import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { resolveFast, resolveInBackground } from "../utils/storageFast";
import { downloadFile, guessFileName } from "../utils/downloadFile";

type BookDoc = {
  title?: string; name?: string;
  author?: string; autor?: string;
  year?: number | string;
  description?: string;
  cover?: unknown;
  fileUrl?: unknown;
  doc?: unknown;
};

const COVER_CLASSES = [
  "from-emerald-400 to-teal-600",
  "from-blue-400 to-indigo-600",
  "from-fuchsia-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-lime-400 to-green-600",
  "from-cyan-400 to-sky-600",
  "from-rose-400 to-red-600",
  "from-purple-400 to-indigo-600",
];

function pickCoverClass(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_CLASSES[h % COVER_CLASSES.length];
}

/* ---------------- utilidades robustas ---------------- */

function timeout<T>(p: Promise<T>, ms: number, tag = "op"): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${tag}-timeout-${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

// reintento con backoff, cada intento con timeout duro
async function resolveRef(refLike: unknown): Promise<string | undefined> {
  const tries = [
    () => timeout(resolveFast(refLike), 1200, "fast"),
    () => timeout(resolveInBackground(refLike), 2000, "bg1"),
    () => timeout(resolveInBackground(refLike), 3000, "bg2"),
  ];
  for (const run of tries) {
    try {
      const url = await run();
      if (url) return url;
    } catch (e) {
      // consola silenciosa para diagnóstico sin romper UI
      console.debug("[resolveRef]", e);
    }
  }
  return undefined;
}

async function robustDownload(url: string, fallbackName: string) {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = guessFileName(url, fallbackName);
    a.rel = "noopener";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  } catch {}
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = guessFileName(url, fallbackName);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function prefetchFile(url: string) {
  try {
    const u = new URL(url);
    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = `${u.protocol}//${u.host}`;
    pre.crossOrigin = "anonymous";
    document.head.appendChild(pre);

    const pf = document.createElement("link");
    pf.rel = "prefetch";
    // @ts-ignore
    pf.as = "fetch";
    pf.href = url;
    pf.crossOrigin = "anonymous";
    document.head.appendChild(pf);
  } catch {}
}

/* ---------------- componente ---------------- */

export default function CycleStackBookDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<{
    id: string;
    title: string;
    author: string;
    year: number | string;
    description: string;
    coverUrl?: string;
    fileUrlResolved?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);

  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  // marcador de operación lenta (UX)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(t);
  }, [id]);

  // 1) lee el doc y PINTA de inmediato; 2) resuelve URLs en background
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!id) throw new Error("missing-id");
        setLoading(true);
        setError(null);

        const snap = await timeout(getDoc(doc(db, "books", id)), 4000, "getDoc");
        if (cancelled) return;

        if (!snap.exists()) {
          setState(null);
          setLoading(false);
          return;
        }

        const v = snap.data() as DocumentData as BookDoc;
        const title = String(v.title ?? v.name ?? "");
        const author = String(v.author ?? v.autor ?? "");
        const year = v.year ?? "";
        const description = String(v.description ?? "");

        // Pinta YA, sin URLs
        setState({ id, title, author, year, description });
        setLoading(false);

        // Resuelve URLs en segundo plano
        const [coverUrl, fileUrlResolved] = await Promise.all([
          resolveRef(v.cover),
          resolveRef(v.fileUrl ?? v.doc),
        ]);

        if (cancelled || !alive.current) return;

        setState(s => (s ? { ...s, coverUrl: coverUrl ?? s.coverUrl, fileUrlResolved: fileUrlResolved ?? s.fileUrlResolved } : s));

        if (fileUrlResolved) prefetchFile(fileUrlResolved);
      } catch (e: any) {
        if (!cancelled) {
          console.error("[BookDetails]", e);
          setError(e?.message ?? "Error");
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  const coverClass = useMemo(() => (state ? pickCoverClass(state.id) : COVER_CLASSES[0]), [state]);
  const hasFile = Boolean(state?.fileUrlResolved);

  /* ---------------- UI states ---------------- */

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl p-6 font-quicksand">
        <div className="rounded-md border border-gray-200 p-6 text-center">
          <p className="mb-4 text-andesnavy">{t("cyclestacks.missing") || "No encontrado"}</p>
          <button onClick={() => navigate(-1)} className="rounded-full bg-tmbred px-4 py-2 text-white hover:bg-tmbred/90">
            {t("cyclestacks.back") || "Volver"}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6 font-quicksand">
        <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {(t("common.error") as string) || "Error"}: {error}
        </div>
      </div>
    );
  }

  if (loading && !state) {
    return (
      <div className="mx-auto max-w-5xl p-6 font-quicksand animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="md:col-span-2"><div className="h-64 bg-gray-200 rounded-xl" /></div>
          <div className="md:col-span-3 space-y-3">
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded" />
            <div className="h-10 w-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="mx-auto max-w-5xl p-6 font-quicksand">
        <div className="rounded-md border border-gray-200 p-6 text-center">
          <p className="mb-4 text-andesnavy">{t("cyclestacks.missing") || "No encontrado"}</p>
          <button onClick={() => navigate(-1)} className="rounded-full bg-tmbred px-4 py-2 text-white hover:bg-tmbred/90">
            {t("cyclestacks.back") || "Volver"}
          </button>
        </div>
      </div>
    );
  }

  const openInNewTab = () => {
    if (state.fileUrlResolved) window.open(state.fileUrlResolved, "_blank", "noopener,noreferrer");
  };

  const onDownload = async () => {
    if (!state.fileUrlResolved) return;
    try {
      const name = guessFileName(state.fileUrlResolved, `${state.title}.pdf`);
      await downloadFile(state.fileUrlResolved, name);
    } catch {
      await robustDownload(state.fileUrlResolved, `${state.title}.pdf`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 font-quicksand">
      {/* aviso opcional si tarda */}
      {slow && !hasFile && (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          {t("cyclestacks.loadingSlow") || "Estamos preparando el archivo… puedes seguir leyendo mientras tanto."}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="mb-4 text-sm" aria-label="breadcrumb">
        <Link to="/cicloteca" className="text-andesnavy hover:underline">
          {t("cyclestacks.brand") || "CicloTeca"}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-andesnavy">{state.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* COVER clickable */}
        <div className="md:col-span-2">
          <div
            role={hasFile ? "button" : "img"}
            onClick={openInNewTab}
            title={
              hasFile
                ? (t("cyclestacks.openHint") as string) || "Abrir en nueva pestaña"
                : (t("cyclestacks.fileMissing") as string) || "Archivo no disponible"
            }
            className={`group relative h-64 rounded-xl overflow-hidden ${hasFile ? "cursor-pointer" : "cursor-default"} select-none bg-gradient-to-br ${coverClass} flex items-center justify-center text-white ring-1 ring-gray-200`}
          >
            <span className="mx-6 text-center text-base font-semibold drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
              {state.title}
            </span>
            {hasFile && (
              <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-andesnavy shadow-sm">
                {t("cyclestacks.clickToOpen") || "Click para abrir"}
              </div>
            )}
          </div>
        </div>

        {/* INFO + ACCIONES */}
        <div className="md:col-span-3">
          <h1 className="mb-2 text-2xl md:text-4xl font-rubikOne uppercase tracking-wide text-andesnavy">
            {state.title}
          </h1>

          <p className="mb-4 text-sm text-andesnavy/90">
            <strong className="text-andesnavy">{t("cyclestacks.author") || "Autor"}:</strong> {state.author}
            &nbsp;·&nbsp;
            <strong className="text-andesnavy">{t("cyclestacks.year") || "Año"}:</strong> {state.year as any}
          </p>

          <p className="mb-6 text-andesnavy leading-relaxed whitespace-pre-line">{state.description}</p>

          <div className="flex flex-wrap gap-3">
            {hasFile ? (
              <>
                <button
                  onClick={onDownload}
                  className="rounded-full bg-tmbred px-5 py-2.5 text-sm font-semibold text-white hover:bg-tmbred/90 active:translate-y-px shadow-sm"
                >
                  {t("cyclestacks.download") || "Descargar"}
                </button>

                <a
                  href={state.fileUrlResolved}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-gray-50"
                >
                  {t("cyclestacks.openNew") || "Ver online"}
                </a>
              </>
            ) : (
              <span className="text-sm text-andesnavy/70">
                {t("cyclestacks.fileMissing") || "Archivo no disponible"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
