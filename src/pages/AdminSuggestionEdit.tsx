import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  doc, getDoc, updateDoc, addDoc, collection, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

type S = {
  id: string;
  // propuesto
  p_title: string; p_author?: string; p_year?: number|null;
  p_description?: string; p_link?: string|null; p_license?: string; p_contact?: string|null;
  lang?: "es"|"en";
  // editorial
  e_title_es?: string; e_title_en?: string;
  e_desc_es?: string;  e_desc_en?: string;
  e_author?: string|null; e_year?: number|null; e_link?: string|null; e_notes?: string|null;
  status: "pending"|"in_review"|"approved"|"rejected";
};

const empty = (v?: string|null) => (v ?? "").trim();

export default function AdminSuggestionEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [sug, setSug] = useState<S | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "suggestions", id)).then((snap) => {
      if (!snap.exists()) { setSug(null); setLoading(false); return; }
      setSug({ id: snap.id, ...(snap.data() as any) });
      setLoading(false);
    });
  }, [id]);

  function onChange<K extends keyof S>(k: K, v: S[K]) {
    setSug(prev => prev ? { ...prev, [k]: v } : prev);
  }

  async function saveDraft() {
    if (!sug) return;
    setBusy(true);
    await updateDoc(doc(db, "suggestions", sug.id), {
      e_title_es: empty(sug.e_title_es),
      e_title_en: empty(sug.e_title_en),
      e_desc_es:  empty(sug.e_desc_es),
      e_desc_en:  empty(sug.e_desc_en),
      e_author:   empty(sug.e_author),
      e_year:     sug.e_year ?? null,
      e_link:     empty(sug.e_link) || null,
      e_notes:    empty(sug.e_notes) || null,
      status: "in_review",
      reviewedAt: serverTimestamp(),
    });
    setBusy(false);
    alert("Guardado.");
  }

  async function publish() {
    if (!sug) return;
    // preferencia: usa editorial si hay; si no, usa lo propuesto.
    const title_es = empty(sug.e_title_es) || (sug.lang === "es" ? empty(sug.p_title) : "");
    const title_en = empty(sug.e_title_en) || (sug.lang === "en" ? empty(sug.p_title) : "");
    const description_es = empty(sug.e_desc_es) || (sug.lang === "es" ? empty(sug.p_description) : "");
    const description_en = empty(sug.e_desc_en) || (sug.lang === "en" ? empty(sug.p_description) : "");
    const author = empty(sug.e_author) || empty(sug.p_author) || "—";
    const year = (sug.e_year ?? sug.p_year ?? null) as number|null;
    const fileUrl = empty(sug.e_link) || empty(sug.p_link) || null;

    if (!title_es && !title_en) {
      alert("Completa al menos un título (ES o EN).");
      return;
    }
    if (!description_es && !description_en) {
      alert("Completa al menos una descripción (ES o EN).");
      return;
    }

    setBusy(true);
    await addDoc(collection(db, "books"), {
      title_es: title_es || undefined,
      title_en: title_en || undefined,
      description_es: description_es || undefined,
      description_en: description_en || undefined,
      author, year, fileUrl,
      createdAt: serverTimestamp(),
      sourceSuggestionId: sug.id,
    });

    await updateDoc(doc(db, "suggestions", sug.id), {
      status: "approved",
      reviewedAt: serverTimestamp(),
    });

    setBusy(false);
    alert("Publicado en Cicloteca.");
    nav("/admin/suggestions");
  }

  async function reject() {
    if (!sug) return;
    const reason = prompt("Motivo del rechazo (opcional):") || "";
    setBusy(true);
    await updateDoc(doc(db, "suggestions", sug.id), {
      status: "rejected",
      rejectReason: reason.trim() || null,
      reviewedAt: serverTimestamp(),
    });
    setBusy(false);
    nav("/admin/suggestions");
  }

  if (loading) return <div className="p-6">Cargando…</div>;
  if (!sug) return <div className="p-6">No existe.</div>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4">
        <Link to="/admin/suggestions" className="text-blue-700 underline">← Volver</Link>
      </div>

      <h1 className="font-rubikOne text-2xl text-andesnavy mb-2">Editar y publicar</h1>

      {/* Propuesto (solo lectura) */}
      <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm mb-6">
        <h2 className="font-extrabold text-andesnavy">Propuesto</h2>
        <p className="text-sm text-andesnavy/70">Idioma: {sug.lang?.toUpperCase() || "—"}</p>
        <div className="mt-2 text-[15px]">
          <p><span className="font-semibold">Título:</span> {sug.p_title}</p>
          <p><span className="font-semibold">Autor:</span> {sug.p_author || "—"}</p>
          <p><span className="font-semibold">Año:</span> {sug.p_year ?? "—"}</p>
          <p className="mt-1 whitespace-pre-line">{sug.p_description}</p>
          {sug.p_link && <a href={sug.p_link} target="_blank" rel="noreferrer" className="text-blue-700 underline mt-1 inline-block">Ver enlace</a>}
        </div>
      </div>

      {/* Editorial (editable) */}
      <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
        <h2 className="font-extrabold text-andesnavy mb-3">Edición (ES / EN)</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-andesnavy">Título (ES)</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={sug.e_title_es || ""}
              onChange={(e) => onChange("e_title_es", e.target.value)}
              placeholder="Título en español"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">Título (EN)</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={sug.e_title_en || ""}
              onChange={(e) => onChange("e_title_en", e.target.value)}
              placeholder="Title in English"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">Descripción (ES)</label>
            <textarea
              rows={6}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={sug.e_desc_es || ""}
              onChange={(e) => onChange("e_desc_es", e.target.value)}
              placeholder="Resumen en español"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">Descripción (EN)</label>
            <textarea
              rows={6}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={sug.e_desc_en || ""}
              onChange={(e) => onChange("e_desc_en", e.target.value)}
              placeholder="Summary in English"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div>
            <label className="block text-sm font-medium text-andesnavy">Autor</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={sug.e_author || ""}
              onChange={(e) => onChange("e_author", e.target.value)}
              placeholder={sug.p_author || "Autor"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">Año</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              inputMode="numeric"
              value={sug.e_year ?? ""}
              onChange={(e) => onChange("e_year", e.target.value ? Number(e.target.value) : null)}
              placeholder={(sug.p_year ?? "") as any}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">Enlace (PDF / web)</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={sug.e_link || ""}
              onChange={(e) => onChange("e_link", e.target.value)}
              placeholder={sug.p_link || "https://..."}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-andesnavy">Notas internas</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={sug.e_notes || ""}
            onChange={(e) => onChange("e_notes", e.target.value)}
            placeholder="Criterios editoriales, fuentes, estilo, etc."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={saveDraft}
            disabled={busy}
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-neutral-50 disabled:opacity-50"
          >
            Guardar (en revisión)
          </button>
          <button
            onClick={publish}
            disabled={busy}
            className="rounded-full bg-andesnavy text-white px-5 py-2.5 text-sm font-semibold hover:brightness-105 disabled:opacity-50"
          >
            Publicar en Cicloteca
          </button>
          <button
            onClick={reject}
            disabled={busy}
            className="rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:brightness-105 disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
