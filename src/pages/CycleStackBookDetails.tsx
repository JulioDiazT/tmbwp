// File: src/pages/CycleStackBookDetails.tsx
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

// --- helpers de descarga robusta ---
async function robustDownload(url: string, fallbackName: string) {
  // 1) intenta <a download>, que en la mayoría funciona (Chrome/Edge/Firefox)
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = guessFileName(url, fallbackName);
    a.rel = "noopener";
    a.target = "_blank";
    // Inyecta y dispara
    document.body.appendChild(a);
    a.click();
    a.remove();
    // En Safari iOS puede abrir nueva pestaña en vez de descargar; dejamos seguir.
    return;
  } catch { /* sigue al blob */ }

  // 2) fetch → blob → ObjectURL (mejor para Safari/iOS y algunos cross-origin)
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
    // 3) último recurso: abrir en pestaña
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// Reintento exponencial suave (hasta ~18s total)
async function resolveWithRetry(refLike: unknown, fastFirst = true): Promise<string | undefined> {
  const tryOnce = () => (fastFirst ? resolveFast(refLike) : resolveInBackground(refLike));
  const altOnce = () => (fastFirst ? resolveInBackground(refLike) : resolveFast(refLike));

  let url = await tryOnce();
  if (url) return url;

  const sleeps = [400, 800, 1600, 3200, 6400]; // ms
  for (let i = 0; i < sleeps.length; i++) {
    await new Promise(r => setTimeout(r, sleeps[i]));
    url = await altOnce();
    if (url) return url;
  }
  return undefined;
}

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
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // Carga + resolución con retry
  useEffect(() => {
    let alive = true;
    const doWork = async () => {
      try {
        if (!id) throw new Error("Sin :id");
        const snap = await getDoc(doc(db, "books", id));
        if (!alive) return;

        if (!snap.exists()) { setState(null); setLoading(false); return; }

        const v = snap.data() as DocumentData as BookDoc;
        const title = String(v.title ?? v.name ?? "");
        const author = String(v.author ?? v.autor ?? "");
        const year = v.year ?? "";
        const description = String(v.description ?? "");
        const cover = v.cover;
        const fileRef = v.fileUrl ?? v.doc;

        const [coverUrl, fileUrlResolved] = await Promise.all([
          resolveWithRetry(cover, true),
          resolveWithRetry(fileRef, true),
        ]);

        if (!alive) return;
        setState({ id, title, author, year, description, coverUrl, fileUrlResolved });
        setLoading(false);
      } catch (e: any) {
        if (alive) { setError(e?.message ?? "Error"); setLoading(false); }
      }
    };

    setLoading(true);
    doWork();
    return () => { alive = false; };
  }, [id]);

  const coverClass = useMemo(() => (state ? pickCoverClass(state.id) : COVER_CLASSES[0]), [state]);

  // --- UI states ---
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

  const hasFile = Boolean(state.fileUrlResolved);

  const openInNewTab = () => {
    if (state.fileUrlResolved) window.open(state.fileUrlResolved, "_blank", "noopener,noreferrer");
  };

  const onDownload = async () => {
    if (!state.fileUrlResolved) return;
    try {
      // intenta tu util primero
      const name = guessFileName(state.fileUrlResolved, `${state.title}.pdf`);
      await downloadFile(state.fileUrlResolved, name);
    } catch {
      // robust fallback
      await robustDownload(state.fileUrlResolved, `${state.title}.pdf`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 font-quicksand">
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
