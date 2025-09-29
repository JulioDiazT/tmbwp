// File: src/pages/CycleStackBookDetails.tsx
import React, { useEffect, useMemo, useState } from "react";
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
  cover?: unknown;   // string | Reference | StorageRef
  fileUrl?: unknown; // string | Reference | StorageRef
  doc?: unknown;     // compat
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

export default function CycleStackBookDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<{
    id: string;
    title: string;
    author: string;
    year: number;
    description: string;
    coverUrl?: string;
    fileUrlResolved?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [late, setLate] = useState<{ coverUrl?: string; fileUrlResolved?: string }>({});
  const [error, setError] = useState<string | null>(null);

  // Carga + resolución rápida (≤2.5s)
  useEffect(() => {
    let alive = true;
    const stopSpinner = setTimeout(() => { if (alive) setLoading(false); }, 2500);

    (async () => {
      try {
        if (!id) throw new Error("Sin :id");
        const snap = await getDoc(doc(db, "books", id));
        if (!alive) return;

        if (!snap.exists()) { setState(null); setLoading(false); return; }

        const v = snap.data() as DocumentData as BookDoc;
        const title = String(v.title ?? v.name ?? "");
        const author = String(v.author ?? v.autor ?? "");
        const year = Number(v.year ?? 0);
        const description = String(v.description ?? "");
        const cover = v.cover;
        const fileRef = v.fileUrl ?? v.doc;

        const [coverUrl, fileUrlResolved] = await Promise.all([
          resolveFast(cover),
          resolveFast(fileRef),
        ]);

        if (!alive) return;
        setState({
          id,
          title,
          author,
          year,
          description,
          coverUrl,
          fileUrlResolved,
        });
        setLoading(false);

        // SWR: si no hubo URL rápida, reintenta en segundo plano
        if (!coverUrl && cover) resolveInBackground(cover).then(u => u && alive && setLate(s => ({ ...s, coverUrl: u })));
        if (!fileUrlResolved && fileRef) resolveInBackground(fileRef).then(u => u && alive && setLate(s => ({ ...s, fileUrlResolved: u })));
      } catch (e: any) {
        if (alive) { setError(e.message ?? "Error"); setLoading(false); }
      }
    })();

    return () => { alive = false; clearTimeout(stopSpinner); };
  }, [id]);

  // Actualiza cuando llegan URLs en segundo plano
  useEffect(() => {
    if (!state) return;
    if (late.coverUrl || late.fileUrlResolved) {
      setState({ ...state, coverUrl: late.coverUrl ?? state.coverUrl, fileUrlResolved: late.fileUrlResolved ?? state.fileUrlResolved });
    }
  }, [late]); // eslint-disable-line

  const coverClass = useMemo(() => (state ? pickCoverClass(state.id) : COVER_CLASSES[0]), [state]);

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
    // Skeleton (≤2.5s)
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
      // fallback: si algo falla, abre en pestaña
      window.open(state.fileUrlResolved, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 font-quicksand">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm" aria-label="breadcrumb">
        <Link to="/cyclestacks" className="text-andesnavy hover:underline">
          {t("cyclestacks.brand") || "CicloTeca"}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-andesnavy">{state.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* PORTADA -> SIEMPRE COVER CON TÍTULO Y FONDO DE COLOR */}
        <div className="md:col-span-2">
          <div
            role="button"
            onClick={openInNewTab}
            title={state.fileUrlResolved ? "Abrir en nueva pestaña" : "Archivo no disponible"}
            className={`group relative h-64 rounded-xl overflow-hidden cursor-pointer select-none bg-gradient-to-br ${coverClass} flex items-center justify-center text-white ring-1 ring-gray-200`}
          >
            <span className="mx-6 text-center text-base font-semibold drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
              {state.title}
            </span>
            {state.fileUrlResolved && (
              <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-andesnavy shadow-sm">
                Click para abrir
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
            <strong className="text-andesnavy">{t("cyclestacks.year") || "Año"}:</strong> {state.year}
          </p>

          <p className="mb-6 text-andesnavy leading-relaxed whitespace-pre-line">{state.description}</p>

          <div className="flex flex-wrap gap-3">
            {state.fileUrlResolved ? (
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
                  {t("cyclestacks.openNew") || "Abrir en pestaña"}
                </a>
              </>
            ) : (
              <span className="text-sm text-andesnavy/70">Archivo no disponible</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
