import  { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { resolveFast, resolveInBackground } from "../utils/storageFast";
import { downloadFile, guessFileName } from "../utils/downloadFile";
// Si no usas pdfProxy.ts, elimina este import y su uso dentro del efecto.
import { normalizeDocUrl, maybeProxy } from "../utils/pdfProxy";
import { Download, ExternalLink, BookOpen, Calendar, User } from "lucide-react";

type BookDoc = {
  title?: string; title_es?: string; titleEs?: string; title_en?: string; titleEn?: string; name?: string;
  author?: string; autor?: string;
  year?: number | string;
  description?: string;
  description_es?: string; descriptionEs?: string;
  description_en?: string; descriptionEn?: string;
  desc?: string; desc_es?: string; descEs?: string; desc_en?: string; descEn?: string;
  resumen?: string; resumen_es?: string; resumen_en?: string;
  fileUrl?: unknown; doc?: unknown;
};

const ACCENT = "#d6ef0a";
const GRADIENT =
  "radial-gradient(1200px 500px at 0% -10%, rgba(214,239,10,0.12), transparent 50%), radial-gradient(1200px 500px at 100% -10%, rgba(153,88,253,0.10), transparent 50%)";

const lang2 = (l?: string) => (String(l || "es").toLowerCase().startsWith("en") ? "en" : "es");
function pickLocalizedFrom(obj: Record<string, unknown>, bases: string[], lang: "es" | "en", fb = "") {
  const ks: string[] = [];
  for (const k of bases) ks.push(`${k}_${lang}`, `${k}${lang === "en" ? "En" : "Es"}`, k);
  for (const k of ks) { const v = obj[k]; if (typeof v === "string" && v.trim()) return v.trim(); }
  return fb;
}
function timeout<T>(p: Promise<T>, ms: number, tag = "op") {
  return new Promise<T>((res, rej) => { const t = setTimeout(()=>rej(new Error(`${tag}-timeout-${ms}ms`)), ms); p.then(v=>{clearTimeout(t);res(v)}).catch(e=>{clearTimeout(t);rej(e)})});
}
async function resolveRef(refLike: unknown) {
  const tries = [() => timeout(resolveFast(refLike),1500,"fast"), () => timeout(resolveInBackground(refLike),2500,"bg1"), () => timeout(resolveInBackground(refLike),3500,"bg2")];
  for (const run of tries) { try { const u = await run(); if (u) return u; } catch {} }
  return undefined;
}

export default function CycleStackBookDetails() {
  const { t, i18n } = useTranslation();
  const L = lang2(i18n.language);
  const { id } = useParams();

  const [state, setState] = useState<{
    id: string; title: string; author: string; year: number | string; description: string; fileUrlResolved?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true); setError(null);
        const snap = await timeout(getDoc(doc(db, "books", id)), 6000, "getDoc");
        if (cancelled) return;
        if (!snap.exists()) { setState(null); setLoading(false); return; }
        const v = snap.data() as DocumentData as BookDoc;

        const title = pickLocalizedFrom(v as any, ["title", "name"], L, "") || String(v.title ?? v.name ?? "");
        const author = String(v.author ?? v.autor ?? "");
        const year = v.year ?? "";
        const description =
          pickLocalizedFrom(v as any, ["description", "desc", "resumen"], L, "") ||
          (L === "es"
            ? (t("cyclestacks.noDescription", { defaultValue: "Sin descripción." }) as string)
            : (t("cyclestacks.noDescription", { defaultValue: "No description." }) as string));

        setState({ id, title, author, year, description });

        const resolved = await resolveRef(v.fileUrl ?? v.doc);
        if (!alive.current || cancelled) return;
        if (resolved) {
          let finalUrl = resolved;
          try { finalUrl = maybeProxy(normalizeDocUrl(resolved)) || normalizeDocUrl(resolved); } catch {}
          setState(s => s ? { ...s, fileUrlResolved: finalUrl } : s);
        }
        setLoading(false);
      } catch (e: any) {
        if (!cancelled) { setError(e?.message ?? "Error"); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [id, L, t]);

  const fileUrl = state?.fileUrlResolved || "";
  const openInNewTab = () => { if (fileUrl) window.open(fileUrl, "_blank", "noopener,noreferrer"); };
  const onDownload = async () => {
    if (!fileUrl) return;
    try {
      const name = guessFileName(fileUrl, `${state?.title || (L === "es" ? "documento" : "document")}.pdf`);
      await downloadFile(fileUrl, name);
    } catch { openInNewTab(); }
  };

  if (!id) return null;
  if (error) return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700" role="alert">
        {(t("common.error", { defaultValue: L === "es" ? "Ocurrió un error" : "Something went wrong" }) as string)}: {error}
      </div>
    </div>
  );
  if (loading && !state) return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
      <div className="h-2 w-24 rounded-full mb-5 animate-pulse" style={{ background: ACCENT }} />
      <div className="h-12 w-3/4 bg-neutral-200 rounded mb-3 animate-pulse" />
      <div className="h-12 w-2/3 bg-neutral-200 rounded mb-8 animate-pulse" />
      <div className="h-20 w-full bg-neutral-200 rounded animate-pulse" />
    </div>
  );
  if (!state) return null;

  return (
    <>
      {/* BANDA FULL-BLEED (gradiente a todo el ancho) */}
      <section
        className="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 md:px-6 py-10"
        style={{ backgroundImage: GRADIENT }}
      >
        <div className="mx-auto max-w-6xl">
          {/* breadcrumb */}
          <nav className="mb-6 text-sm text-andesnavy/60" aria-label="breadcrumb">
            <Link to="/cyclestacks" className="hover:underline font-medium text-andesnavy">
              {t("cyclestacks.brand", { defaultValue: L === "es" ? "Cicloteca" : "CycleStacks" }) as string}
            </Link>
            <span className="mx-2">/</span>
            <span className="line-clamp-1">{state.title}</span>
          </nav>

          {/* eyebrow */}
          <div className="h-2 w-24 rounded-full mb-5" style={{ background: ACCENT }} />

          {/* título (un poco más pequeño) */}
          <h1 className="font-rubikOne uppercase tracking-wide text-andesnavy text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[1.06]">
            {state.title}
          </h1>

          {/* meta chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-[0.95rem]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-black/10 px-3.5 py-1.5 text-andesnavy">
              <User size={17} className="opacity-70" />
              <strong className="font-semibold">{t("cyclestacks.author", { defaultValue: L === "es" ? "Autor" : "Author" }) as string}</strong>
              <span aria-hidden>·</span>
              <span>{state.author || (L === "es" ? "Desconocido" : "Unknown")}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-black/10 px-3.5 py-1.5 text-andesnavy">
              <Calendar size={17} className="opacity-70" />
              <strong className="font-semibold">{t("cyclestacks.year", { defaultValue: L === "es" ? "Año" : "Year" }) as string}</strong>
              <span aria-hidden>·</span>
              <span>{String(state.year || "—")}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm ring-1 ring-black/10 px-3.5 py-1.5 text-andesnavy">
              <BookOpen size={17} className="opacity-70" />
              <span className="font-semibold">{L === "es" ? "Documento" : "Document"}</span>
            </span>
          </div>
        </div>
      </section>

      {/* CONTENIDO — Card a TODO el ancho del contenedor (alineada con título/chips) */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="w-full rounded-[22px] bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 ring-1 ring-black/10 p-6 md:p-7 shadow-[0_12px_34px_rgba(0,0,0,.06)]">
          <p className="text-[1.06rem] md:text-[1.12rem] leading-[1.75] text-andesnavy/90 whitespace-pre-line">
            {state.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-full bg-andesnavy text-white px-5 py-2.5 text-sm font-semibold hover:brightness-105 active:translate-y-px shadow-sm"
            >
              <Download size={16} />
              {t("cyclestacks.download", { defaultValue: L === "es" ? "Descargar" : "Download" }) as string}
            </button>
            <button
              onClick={openInNewTab}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-neutral-50"
            >
              <ExternalLink size={16} />
              {t("cyclestacks.openNew", { defaultValue: L === "es" ? "Abrir en pestaña" : "Open in new tab" }) as string}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
