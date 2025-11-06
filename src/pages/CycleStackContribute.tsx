// src/pages/CycleStackContribute.tsx
import React, { useMemo, useState, useId, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Check, CheckCircle2, Loader2, X } from "lucide-react";

/* ========= Tipos y constantes ========= */
type LicenseKey = "public" | "perm" | "external";
type CategorySlug =
  | "movilidad"
  | "normativa"
  | "espacio-publico"
  | "comunidad"
  | "seguridad-vial"
  | "infancias"
  | "genero"
  | "datos";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_MB = 25;                         // ← ajusta el máximo en MB
const ACCEPT_MIME = ["application/pdf"];        // ← tipos permitidos

const CATEGORIES: { slug: CategorySlug; label: (lang: string) => string }[] = [
  { slug: "movilidad",       label: (l) => (l.startsWith("es") ? "Movilidad Sostenible"          : "Sustainable Mobility") },
  { slug: "normativa",       label: (l) => (l.startsWith("es") ? "Normativa y Políticas"         : "Policy & Regulation") },
  { slug: "espacio-publico", label: (l) => (l.startsWith("es") ? "Espacio Público y Urbanismo"   : "Public Space & Urban Design") },
  { slug: "comunidad",       label: (l) => (l.startsWith("es") ? "Comunidad y Participación"     : "Community & Participation") },
  { slug: "seguridad-vial",  label: (l) => (l.startsWith("es") ? "Seguridad Vial y Cultura Vial" : "Road Safety & Street Culture") },
  { slug: "infancias",       label: (l) => (l.startsWith("es") ? "Infancias y Juventudes"        : "Children & Youth") },
  { slug: "genero",          label: (l) => (l.startsWith("es") ? "Género"                         : "Gender") },
  { slug: "datos",           label: (l) => (l.startsWith("es") ? "Datos"                          : "Data & Evaluation") },
];

const initialPayload = {
  title: "",
  author: "",
  year: "",
  description: "",
  contact: "",
  license: "public" as LicenseKey,
  consent: false,
  midName: "", // honeypot (anti-bots)
};

/* ========= Utilitarias de estilo (consistencia de campos) ========= */
const FIELD_ACCENT = { ["--accent" as any]: "#d6ef0a" };
const fieldBase =
  "w-full h-12 rounded-2xl border-2 border-gray-300 px-4 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]";
const fieldSelect =
  "w-full h-12 rounded-2xl border-2 border-gray-300 px-4 text-sm bg-white focus:border-[--accent] focus:ring-2 focus:ring-[--accent]";
const fieldTextarea =
  "w-full min-h-[9.5rem] rounded-2xl border-2 border-gray-300 px-4 py-3 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]";
const chipBase =
  "group relative w-full h-12 overflow-hidden rounded-2xl border-2 px-4 text-left flex items-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/* ========= Toast de éxito (overlay top) ========= */
const SuccessToast: React.FC<{
  lang: string;
  title?: string;
  open: boolean;
  onClose: () => void;
}> = ({ lang, title, open, onClose }) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      timerRef.current = window.setTimeout(onClose, 5000); // se cierra solo en 5s
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-x-0 top-0 z-[1000] flex justify-center px-4 pt-4
        sm:pt-6 pointer-events-none
      "
      role="status"
      aria-live="polite"
    >
      <div
        className="
          pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-2xl
          border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-white
          shadow-lg px-5 py-4 text-emerald-900
        "
      >
        <button
          onClick={onClose}
          aria-label={lang.startsWith("es") ? "Cerrar" : "Close"}
          className="absolute right-3 top-3 rounded-full p-1 text-emerald-700/70 hover:bg-emerald-100"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6" />
          <div>
            <h3 className="font-semibold">
              {lang.startsWith("es") ? "¡Envío recibido!" : "Submission received!"}
            </h3>
            <p className="mt-0.5 text-sm text-emerald-800/90">
              {lang.startsWith("es")
                ? "Gracias por tu aporte. Revisaremos la propuesta y, si todo está bien, la publicaremos en la Cicloteca."
                : "Thanks for your contribution. We’ll review your suggestion and publish it if everything looks good."}
            </p>
            {title ? (
              <p className="mt-1 text-sm">
                {lang.startsWith("es") ? "Título enviado: " : "Submitted title: "}
                <span className="font-semibold">{title}</span>
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/cyclestacks"
                className="rounded-full bg-andesnavy px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                {lang.startsWith("es") ? "Ver Cicloteca" : "Open Library"}
              </Link>
              <button
                onClick={onClose}
                className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                {lang.startsWith("es") ? "Cerrar" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========= Overlay de carga + barra superior ========= */
const GlobalUploadOverlay: React.FC<{ visible: boolean; progress: number; lang: string }> = ({
  visible,
  progress,
  lang,
}) => {
  if (!visible) return null;

  return (
    <>
      {/* Barra fija arriba */}
      <div className="fixed inset-x-0 top-0 z-[1100] h-1 bg-neutral-200">
        <div
          className="h-1 bg-[--accent] transition-[width] duration-200"
          style={{ width: `${progress}%`, ["--accent" as any]: "#d6ef0a" }}
        />
      </div>

      {/* Overlay con spinner */}
      <div className="fixed inset-0 z-[1050] bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
        <div className="rounded-2xl bg-white p-6 shadow-xl w-[90%] max-w-sm text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-andesnavy" />
            <p className="text-andesnavy font-semibold">
              {lang.startsWith("es") ? "Subiendo archivo…" : "Uploading file…"}
            </p>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
            <div
              className="h-2 rounded-full transition-[width] duration-200"
              style={{ width: `${progress}%`, background: "#d6ef0a" }}
            />
          </div>
          <p className="mt-2 text-sm text-andesnavy/70">{progress}%</p>
        </div>
      </div>
    </>
  );
};

/* ========= Componente principal ========= */
const CycleStackContribute: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "es").toLowerCase();

  const [payload, setPayload] = useState(initialPayload);
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<CategorySlug[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const ids = {
    title: useId(),
    author: useId(),
    file: useId(),
    cats: useId(),
    year: useId(),
    desc: useId(),
    contact: useId(),
    license: useId(),
    consent: useId(),
  };

  const validity = useMemo(() => {
    const titleOk = payload.title.trim().length > 0;
    const authorOk = payload.author.trim().length > 0;
    const yearOkFormat = /^\d{3,4}$/.test(payload.year.trim());
    const yearOk = payload.year.trim().length > 0 && yearOkFormat;
    const descOk = payload.description.trim().length > 0;
    const contactOk = payload.contact.trim().length > 0 && emailRe.test(payload.contact.trim());
    const fileOk = !!file;
    const catsOk = categories.length >= 1;
    const licenseOk = !!payload.license;
    const consentOk = payload.consent === true;

    return { titleOk, authorOk, yearOk, yearOkFormat, descOk, contactOk, fileOk, catsOk, licenseOk, consentOk };
  }, [payload, file, categories]);

  const canSubmit = useMemo(() => {
    const v = validity;
    return (
      v.titleOk &&
      v.authorOk &&
      v.yearOk &&
      v.descOk &&
      v.contactOk &&
      v.fileOk &&
      v.catsOk &&
      v.licenseOk &&
      v.consentOk &&
      !payload.midName &&
      !submitting
    );
  }, [validity, payload.midName, submitting]);

  function markTouched(key: string) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function onPickFile(f: File | null) {
    markTouched("file");
    if (!f) {
      setFile(null);
      return;
    }
    const tooBig = f.size > MAX_FILE_MB * 1024 * 1024;
    const badType = !ACCEPT_MIME.includes(f.type);
    if (tooBig) {
      setError(
        lang.startsWith("es")
          ? `El archivo supera el límite de ${MAX_FILE_MB} MB. Por favor, sube un PDF más liviano.`
          : `File exceeds the ${MAX_FILE_MB} MB limit. Please upload a lighter PDF.`
      );
      setFile(null);
      return;
    }
    if (badType) {
      setError(lang.startsWith("es") ? "Solo se permiten archivos PDF." : "Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }

  function toggleCategory(slug: CategorySlug) {
    markTouched("cats");
    setCategories((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }
  function onCatKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, slug: CategorySlug) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleCategory(slug);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      title: true,
      author: true,
      year: true,
      desc: true,
      contact: true,
      file: true,
      cats: true,
      license: true,
      consent: true,
    });
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setError(null);
      setProgress(0);

      const langKey = lang.startsWith("en") ? "en" : "es";
      const created = await addDoc(collection(db, "suggestions"), {
        p_title: payload.title.trim(),
        p_author: payload.author.trim(),
        p_year: Number(payload.year.trim()),
        p_description: payload.description.trim(),
        p_license: payload.license,
        p_contact: payload.contact.trim(),
        p_categories: categories,
        lang: langKey,
        status: "pending",
        createdAt: serverTimestamp(),
        p_fileName: null,
        p_fileSize: null,
        p_fileType: null,
        p_filePath: null,
      });

      if (!file) throw new Error("missing-file");
      const storage = getStorage();
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `suggestions/${created.id}/${safeName}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file, { contentType: file.type || "application/pdf" });

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          () => resolve()
        );
      });

      await updateDoc(doc(db, "suggestions", created.id), {
        p_fileName: file.name,
        p_fileSize: file.size,
        p_fileType: file.type || "application/pdf",
        p_filePath: path,
      });

      // Éxito
      setSent(true);
      setShowToast(true);

      // Reset manteniendo título en el toast hasta que se cierre
      setPayload((p) => ({ ...initialPayload, title: p.title }));
      setFile(null);
      setCategories([]);
      setProgress(100);
      setTouched({});
    } catch (err) {
      console.error(err);
      setError(
        t("common.error", {
          defaultValue: lang.startsWith("es") ? "Algo salió mal. Intenta nuevamente." : "Something went wrong. Please try again.",
        }) as string
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ========= Render ========= */
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6 font-quicksand">
      {/* Overlay/Barra de carga global */}
      <GlobalUploadOverlay visible={submitting && progress > 0 && progress < 100} progress={progress} lang={lang} />

      {/* Toast de éxito superior */}
      <SuccessToast
        lang={lang}
        title={sent ? payload.title : undefined}
        open={showToast}
        onClose={() => {
          setShowToast(false);
          setSent(false);
          setPayload(initialPayload);
          setProgress(0);
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="breadcrumb">
        <Link to="/cyclestacks" className="text-andesnavy hover:underline">
          {t("cyclestacks.brand", { defaultValue: "CycleStacks" }) as string}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-andesnavy">
          {t("cyclestacks.contribute", { defaultValue: "Suggest a book" }) as string}
        </span>
      </nav>

      {/* Error visible */}
      {error && (
        <div className="mb-4 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      {/* Form */}
      <form noValidate className="mt-4 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm" onSubmit={onSubmit}>
        {/* honeypot */}
        <input
          aria-hidden
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={payload.midName}
          onChange={(e) => setPayload((p) => ({ ...p, midName: e.target.value }))}
        />

        {/* Título + Autor */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.title} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.title", { defaultValue: "• Title:" }) as string}
            </label>
            <input
              id={ids.title}
              required
              onBlur={() => markTouched("title")}
              className={fieldBase}
              style={FIELD_ACCENT}
              value={payload.title}
              onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))}
              aria-invalid={touched.title && !validity.titleOk}
            />
            {touched.title && !validity.titleOk && (
              <p className="mt-1 text-xs text-red-600">{lang.startsWith("es") ? "Título obligatorio." : "Title is required."}</p>
            )}
          </div>
          <div>
            <label htmlFor={ids.author} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.author", { defaultValue: "• Author:" }) as string}
            </label>
            <input
              id={ids.author}
              required
              onBlur={() => markTouched("author")}
              className={fieldBase}
              style={FIELD_ACCENT}
              value={payload.author}
              onChange={(e) => setPayload((p) => ({ ...p, author: e.target.value }))}
              aria-invalid={touched.author && !validity.authorOk}
            />
            {touched.author && !validity.authorOk && (
              <p className="mt-1 text-xs text-red-600">{lang.startsWith("es") ? "Autor obligatorio." : "Author is required."}</p>
            )}
          </div>
        </div>

        {/* PDF */}
        <div>
          <label htmlFor={ids.file} className="block text-sm font-medium text-andesnavy">
            {lang.startsWith("es") ? "Archivo (PDF)" : "File (PDF)"}{" "}
            <span className="text-andesnavy/60 text-xs">
              {lang.startsWith("es") ? `máx. ${MAX_FILE_MB} MB` : `max. ${MAX_FILE_MB} MB`}
            </span>
          </label>
          <input
            id={ids.file}
            required
            onBlur={() => markTouched("file")}
            type="file"
            accept={ACCEPT_MIME.join(",")}
            className={`${fieldBase} file:mr-4 file:rounded-xl file:border-0 file:bg-[--accent] file:px-4 file:py-2 file:text-andesnavy file:font-semibold hover:file:brightness-110`}
            style={FIELD_ACCENT}
            onChange={(e) => onPickFile(e.currentTarget.files?.[0] ?? null)}
            aria-invalid={touched.file && !validity.fileOk}
          />
          {file && (
            <p className="mt-1 text-xs text-andesnavy/70">
              {file.name} — {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
          {touched.file && !validity.fileOk && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {lang.startsWith("es")
                ? `Sube un PDF (máximo ${MAX_FILE_MB} MB).`
                : `Upload a PDF (max ${MAX_FILE_MB} MB).`}
            </p>
          )}
        </div>

        {/* Categorías */}
        <div>
          <label htmlFor={ids.cats} className="block text-sm font-medium text-andesnavy">
            {lang.startsWith("es") ? "Categorías (elige al menos 1)" : "Categories (choose at least 1)"}
          </label>
          <div id={ids.cats} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" role="group">
            {CATEGORIES.map((c) => {
              const active = categories.includes(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleCategory(c.slug)}
                  onKeyDown={(e) => onCatKeyDown(e, c.slug)}
                  onBlur={() => markTouched("cats")}
                  aria-pressed={!!active}
                  className={[
                    chipBase,
                    active
                      ? "border-transparent bg-gradient-to-r from-[#d6ef0a] via-[#e7f86a] to-[#f7ffb0] text-andesnavy shadow-[0_8px_24px_rgba(214,239,10,0.35)]"
                      : "border-gray-300 bg-white text-andesnavy hover:bg-neutral-50",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "mr-3 grid h-6 w-6 place-items-center rounded-full border transition",
                      active ? "border-andesnavy bg-white" : "border-gray-300 bg-white",
                    ].join(" ")}
                  >
                    <Check size={16} className={["transition-transform", active ? "scale-100 opacity-100" : "scale-0 opacity-0"].join(" ")} />
                  </span>
                  <span className="font-semibold">{c.label(lang)}</span>
                </button>
              );
            })}
          </div>
          {touched.cats && !validity.catsOk && (
            <p className="mt-2 text-xs text-red-600">{lang.startsWith("es") ? "Elige al menos una categoría." : "Choose at least one category."}</p>
          )}
        </div>

        {/* Año + Contacto */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.year} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.year", { defaultValue: "• Year:" }) as string}
            </label>
            <input
              id={ids.year}
              required
              onBlur={() => markTouched("year")}
              inputMode="numeric"
              pattern="\d{3,4}"
              placeholder="2020"
              className={fieldBase}
              style={FIELD_ACCENT}
              value={payload.year}
              onChange={(e) => setPayload((p) => ({ ...p, year: e.target.value }))}
              aria-invalid={touched.year && !validity.yearOk}
            />
            {touched.year && !validity.yearOk && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {t("cyclestacks.validation.year", {
                  defaultValue: lang.startsWith("es") ? "Año obligatorio (3–4 dígitos)." : "Year is required (3–4 digits).",
                }) as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={ids.contact} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.contact", { defaultValue: "• My contact:" }) as string}
            </label>
            <input
              id={ids.contact}
              required
              onBlur={() => markTouched("contact")}
              type={ "email" }
              placeholder={lang.startsWith("es") ? "tu@email.com" : "your@email.com"}
              className={fieldBase}
              style={FIELD_ACCENT}
              value={payload.contact}
              onChange={(e) => setPayload((p) => ({ ...p, contact: e.target.value }))}
              aria-invalid={touched.contact && !validity.contactOk}
            />
            {touched.contact && !validity.contactOk && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {t("cyclestacks.validation.email", {
                  defaultValue: lang.startsWith("es") ? "Email válido obligatorio." : "Valid email is required.",
                }) as string}
              </p>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor={ids.desc} className="block text-sm font-medium text-andesnavy">
            {t("cyclestacks.mail.desc", { defaultValue: "• Short description:" }) as string}
          </label>
        </div>
        <div>
          <textarea
            id={ids.desc}
            required
            onBlur={() => markTouched("desc")}
            className={fieldTextarea}
            style={FIELD_ACCENT}
            value={payload.description}
            onChange={(e) => setPayload((p) => ({ ...p, description: e.target.value }))}
            placeholder={
              lang.startsWith("es")
                ? "¿Por qué este libro aporta a la cicloteca?"
                : "Why is this book relevant for the library?"
            }
            aria-invalid={touched.desc && !validity.descOk}
          />
          {touched.desc && !validity.descOk && (
            <p className="mt-1 text-xs text-red-600">
              {lang.startsWith("es") ? "Descripción obligatoria." : "Description is required."}
            </p>
          )}
        </div>

        {/* Licencia */}
        <div>
          <label htmlFor={ids.license} className="block text-sm font-medium text-andesnavy">
            {t("cyclestacks.contribute.license.label", {
              defaultValue: lang.startsWith("es") ? "Licencia / Permiso" : "License / Permission",
            }) as string}
          </label>
          <select
            id={ids.license}
            required
            onBlur={() => markTouched("license")}
            className={fieldSelect}
            style={FIELD_ACCENT}
            value={payload.license}
            onChange={(e) => setPayload((p) => ({ ...p, license: e.target.value as LicenseKey }))}
            aria-invalid={touched.license && !validity.licenseOk}
          >
            <option value="public">
              {t("cyclestacks.contribute.license.public", {
                defaultValue: lang.startsWith("es") ? "Público / Abierto" : "Public / Open",
              }) as string}
            </option>
            <option value="perm">
              {t("cyclestacks.contribute.license.perm", {
                defaultValue: lang.startsWith("es") ? "Con permiso" : "With permission",
              }) as string}
            </option>
            <option value="external">
              {t("cyclestacks.contribute.license.external", {
                defaultValue: lang.startsWith("es") ? "Solo enlace externo" : "External link only",
              }) as string}
            </option>
          </select>
          {touched.license && !validity.licenseOk && (
            <p className="mt-1 text-xs text-red-600">
              {lang.startsWith("es") ? "Selecciona una licencia." : "License is required."}
            </p>
          )}
        </div>

        {/* Consentimiento */}
        <label htmlFor={ids.consent} className="flex items-start gap-3 text-sm text-andesnavy">
          <input
            id={ids.consent}
            required
            onBlur={() => markTouched("consent")}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-andesnavy focus:ring-andesnavy"
            checked={payload.consent}
            onChange={(e) => setPayload((p) => ({ ...p, consent: e.target.checked }))}
            aria-invalid={touched.consent && !validity.consentOk}
          />
          <span>
            {t("cyclestacks.contribute.consent", {
              defaultValue: lang.startsWith("es")
                ? "Confirmo que tengo derecho a compartir esta información y acepto que será revisada antes de su publicación."
                : "I confirm I have the right to share this information and accept it will be reviewed before publication.",
            }) as string}
          </span>
        </label>
        {touched.consent && !validity.consentOk && (
          <p className="mt-1 text-xs text-red-600">{lang.startsWith("es") ? "Debes aceptar." : "You must accept."}</p>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-andesnavy px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {submitting
              ? (t("common.loading", { defaultValue: lang.startsWith("es") ? "Cargando…" : "Loading…" }) as string)
              : (lang.startsWith("es") ? "Enviar" : "Submit")}
          </button>

          <Link
            to="/cyclestacks"
            className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-gray-200"
          >
            {t("cyclestacks.back", { defaultValue: lang.startsWith("es") ? "Volver" : "Go back" }) as string}
          </Link>
        </div>
      </form>

      <p className="mt-4 text-xs text-andesnavy/60">
        {t("cyclestacks.contribute.note", {
          defaultValue: lang.startsWith("es")
            ? "Revisamos manualmente cada sugerencia para asegurar calidad, licenciamiento y relevancia antes de publicarla."
            : "We manually review each suggestion to ensure quality, licensing, and relevance before publishing.",
        }) as string}
      </p>
    </div>
  );
};

export default CycleStackContribute;
