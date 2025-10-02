// src/pages/CycleStackBookDetails.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  fileUrl?: unknown;
  doc?: unknown;
};

const ACCENT = "#d6ef0a";
const PROXY_ORIGIN = import.meta.env.VITE_PDF_PROXY_ORIGIN || "";

// ---------------- utils

function timeout<T>(p: Promise<T>, ms: number, tag = "op"): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${tag}-timeout-${ms}ms`)), ms);
    p.then(
      v => { clearTimeout(t); resolve(v); },
      e => { clearTimeout(t); reject(e); }
    );
  });
}

async function resolveRef(refLike: unknown): Promise<string | undefined> {
  const tries = [
    () => timeout(resolveFast(refLike), 1800, "fast"),
    () => timeout(resolveInBackground(refLike), 3000, "bg1"),
    () => timeout(resolveInBackground(refLike), 4500, "bg2"),
  ];
  for (const run of tries) {
    try {
      const url = await run();
      if (url) return url;
    } catch {}
  }
  return undefined;
}

function isProbablyPdfContentType(ct?: string | null) {
  if (!ct) return false;
  const v = ct.toLowerCase();
  return v.includes("application/pdf") || v.includes("octet-stream");
}

async function headOrGet(url: string) {
  // Intenta HEAD; si el server no lo soporta, usa GET con 'range' pequeño
  try {
    const r = await fetch(url, { method: "HEAD", mode: "cors" as RequestMode });
    return r;
  } catch {
    try {
      const r = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        mode: "cors" as RequestMode
      });
      return r;
    } catch (e) {
      throw e;
    }
  }
}

async function fetchBlob(url: string): Promise<Blob> {
  const r = await fetch(url, {
    mode: "cors" as RequestMode,
    credentials: "omit",
    cache: "no-store"
  });
  if (!r.ok) throw new Error(`fetchBlob:${r.status}`);
  return await r.blob();
}

function ensureProxyUrl(u: string) {
  if (!PROXY_ORIGIN) return null;
  return `${PROXY_ORIGIN}/pdf?u=${encodeURIComponent(u)}`;
}

// ---------------- visor

function PdfViewerBlob({ blobUrl }: { blobUrl: string }) {
  // usa el viewer local de pdf.js: asegúrate de tenerlo servido en /pdfjs/web/viewer.html
  const viewer = `/pdfjs/web/viewer.html?file=${encodeURIComponent(blobUrl)}`;
  return (
    <iframe
      title="Documento"
      src={viewer}
      className="h-[70vh] w-full rounded-xl bg-neutral-50 ring-1 ring-black/5"
      loading="lazy"
    />
  );
}

// ---------------- página

export default function CycleStackBookDetails() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [state, setState] = useState<{
    id: string;
    title: string;
    author: string;
    year: number | string;
    description: string;
    fileUrlResolved?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [viewerMsg, setViewerMsg] = useState<string | null>(null);

  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // indicador de carga lenta
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 5500);
    return () => clearTimeout(timer);
  }, [id]);

  // revocar objectURL para evitar fugas
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!id) throw new Error("missing-id");
        setLoading(true);
        setError(null);
        setBlobUrl(null);
        setViewerMsg(null);

        const snap = await timeout(getDoc(doc(db, "books", id)), 7000, "getDoc");
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

        setState({ id, title, author, year, description });
        setLoading(false);

        const resolved = await resolveRef(v.fileUrl ?? v.doc);
        if (cancelled || !alive.current) return;
        if (!resolved) {
          setViewerMsg("No se pudo obtener la URL del archivo.");
          return;
        }
        setState(s => (s ? { ...s, fileUrlResolved: resolved } : s));

        // 1) Verificamos content-type / redirecciones
        let finalUrl = resolved;
        let head: Response | null = null;
        try {
          head = await headOrGet(resolved);
        } catch {
          // si falla igual probaremos blob / proxy
        }

        const ct = head?.headers.get("Content-Type");
        const okPdf = isProbablyPdfContentType(ct);

        // 2) Intentamos descargar a blob
        const tryFetchBlob = async (urlToUse: string) => {
          const b = await fetchBlob(urlToUse);
          // Evita mostrar HTML (como tu web) cuando el servidor responde con algo distinto a PDF
          if (b.type && !b.type.includes("pdf") && !b.type.includes("octet")) {
            throw new Error(`not-pdf:${b.type}`);
          }
          const obj = URL.createObjectURL(b);
          setBlobUrl(obj);
          setViewerMsg(null);
        };

        if (okPdf) {
          try {
            await tryFetchBlob(finalUrl);
            return;
          } catch {}
        }

        // 3) Proxy si está configurado
        const proxied = ensureProxyUrl(finalUrl);
        if (proxied) {
          try {
            await tryFetchBlob(proxied);
            return;
          } catch {
            setViewerMsg("El servidor bloquea la vista previa. Puedes abrir o descargar el archivo.");
            return;
          }
        }

        // 4) Último recurso
        setViewerMsg("No pudimos previsualizar el documento. Ábrelo o descárgalo.");
      } catch (e: any) {
        setError(e?.message ?? "Error");
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  const hasFile = Boolean(state?.fileUrlResolved);
  const fileUrl = state?.fileUrlResolved || "";

  const openInNewTab = () => {
    if (fileUrl) window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const onDownload = async () => {
    if (!fileUrl) return;
    try {
      const name = guessFileName(fileUrl, `${state?.title || "documento"}.pdf`);
      await downloadFile(fileUrl, name);
    } catch {
      openInNewTab();
    }
  };

  if (!id) return null;

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {(t("common.error") as string) || "Error"}: {error}
        </div>
      </div>
    );
  }

  if (loading && !state) {
    return (
      <div className="mx-auto max-w-6xl p-6 animate-pulse">
        <div className="h-8 w-64 bg-neutral-200 rounded mb-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-3">
            <div className="h-5 w-3/4 bg-neutral-200 rounded" />
            <div className="h-5 w-2/3 bg-neutral-200 rounded" />
            <div className="h-24 w-full bg-neutral-200 rounded" />
            <div className="h-10 w-56 bg-neutral-200 rounded" />
          </div>
          <div className="md:col-span-2 h-[60vh] bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!state) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6">
      {/* breadcrumb + título */}
      <nav className="mb-2 text-sm" aria-label="breadcrumb">
        <Link to="/cicloteca" className="text-andesnavy hover:underline">
          {t("cyclestacks.brand") || "CicloTeca"}
        </Link>
        <span className="mx-2 text-neutral-400">/</span>
        <span className="text-andesnavy">{state.title}</span>
      </nav>

      <div className="mb-6">
        <h1 className="font-rubikOne uppercase tracking-wide text-andesnavy text-[clamp(1.8rem,4vw,2.75rem)] leading-tight">
          {state.title}
        </h1>
        <div className="mt-2 h-1.5 w-24 rounded-full" style={{ background: ACCENT }} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Info */}
        <section className="md:col-span-3">
          <p className="mb-3 text-sm text-andesnavy/80">
            <strong className="text-andesnavy">{t("cyclestacks.author") || "Autor"}:</strong> {state.author}
            &nbsp;·&nbsp;
            <strong className="text-andesnavy">{t("cyclestacks.year") || "Año"}:</strong> {String(state.year)}
          </p>

          <p className="text-andesnavy leading-relaxed whitespace-pre-line">
            {state.description || t("cyclestacks.noDescription", { defaultValue: "Sin descripción." })}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onDownload}
              className="rounded-full bg-andesnavy text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:brightness-105 active:translate-y-px"
            >
              {t("cyclestacks.download") || "Descargar"}
            </button>
            <button
              onClick={openInNewTab}
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-neutral-50"
            >
              {t("cyclestacks.openNew") || "Ver online"}
            </button>

            {!hasFile && (
              <span className="text-sm text-neutral-500 inline-flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                {slow
                  ? (t("cyclestacks.loadingSlow") || "Preparando el archivo…")
                  : (t("cyclestacks.preparing") || "Cargando archivo…")}
              </span>
            )}
          </div>
        </section>

        {/* Documento */}
        <aside className="md:col-span-2">
          <div className="rounded-2xl bg-white ring-1 ring-black/10 shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: hasFile ? ACCENT : "#aaa" }} />
              <span className="text-sm font-semibold text-andesnavy">
                {t("cyclestacks.document", { defaultValue: "Documento" })}
              </span>
            </div>

            <div className="p-3">
              {blobUrl ? (
                <PdfViewerBlob blobUrl={blobUrl} />
              ) : viewerMsg ? (
                <div className="h-[60vh] grid place-items-center rounded-xl bg-neutral-50 ring-1 ring-black/5 text-center px-6">
                  <div>
                    <p className="text-andesnavy font-semibold">{viewerMsg}</p>
                    {hasFile && (
                      <button
                        onClick={openInNewTab}
                        className="mt-3 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-andesnavy hover:bg-neutral-50"
                      >
                        {t("cyclestacks.openNew") || "Abrir en pestaña"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[60vh] grid place-items-center rounded-xl bg-neutral-50 ring-1 ring-black/5 text-center px-6">
                  <div>
                    <p className="text-andesnavy font-semibold">
                      {t("cyclestacks.preparing", { defaultValue: "Preparando la vista previa…" })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 py-3 border-t border-black/5">
              <button
                onClick={openInNewTab}
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-andesnavy hover:bg-neutral-50"
              >
                {t("cyclestacks.openNew") || "Abrir en pestaña"}
              </button>
              <button
                onClick={onDownload}
                className="rounded-full bg-andesnavy text-white px-3.5 py-1.5 text-xs font-semibold hover:brightness-105"
              >
                {t("cyclestacks.download") || "Descargar"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
