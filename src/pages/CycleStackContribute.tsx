import React, { useMemo, useState, useId } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type LicenseKey = "public" | "perm" | "external";

const SUBMISSION_MODE: "form" | "email" = "form";                 // cambia si quieres solo email
const SUBMISSION_FORM_URL = "https://forms.gle/tu-form-id";        // ⚠️ reemplaza
const SUBMISSION_EMAIL    = "hola@tomebambike.ec";                  // ⚠️ reemplaza

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CycleStackContribute: React.FC = () => {
  const { t } = useTranslation();
  const [payload, setPayload] = useState({
    title: "",
    author: "",
    year: "",
    description: "",
    link: "",
    contact: "",
    license: "public" as LicenseKey,
    consent: false,
    midName: "", // honeypot
  });

  const ids = {
    title: useId(), author: useId(), year: useId(), desc: useId(), link: useId(), contact: useId(), license: useId(), consent: useId()
  };

  const validity = useMemo(() => {
    const yearOk = !payload.year || /^\d{3,4}$/.test(payload.year);
    const emailOk = !payload.contact || emailRe.test(payload.contact);
    const linkOk = !payload.link || /^https?:\/\//i.test(payload.link);
    return { yearOk, emailOk, linkOk };
  }, [payload.year, payload.contact, payload.link]);

  const canSubmit = useMemo(() => {
    return (
      payload.title.trim().length > 1 &&
      payload.author.trim().length > 1 &&
      payload.description.trim().length > 5 &&
      validity.yearOk && validity.emailOk && validity.linkOk &&
      payload.consent &&
      !payload.midName // bot guard
    );
  }, [payload, validity]);

  const bodyText = [
    t("cyclestacks.mail.propose"),
    `${t("cyclestacks.mail.title")} ${payload.title}`,
    `${t("cyclestacks.mail.author")} ${payload.author}`,
    `${t("cyclestacks.mail.year")} ${payload.year || "-"}`,
    `${t("cyclestacks.mail.desc")} ${payload.description}`,
    `${t("cyclestacks.mail.link")} ${payload.link || "-"}`,
    `${t("cyclestacks.mail.license")} ${t(`cyclestacks.contribute.license.${payload.license}`)}`,
    `${t("cyclestacks.mail.contact")} ${payload.contact || "-"}`,
  ].join("\n");

  function submitEmail() {
    const subject = encodeURIComponent(t("cyclestacks.mail.subject"));
    const body    = encodeURIComponent(bodyText);
    window.location.href = `mailto:${SUBMISSION_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6 font-quicksand">
      <nav className="mb-6 text-sm" aria-label="breadcrumb">
        <Link to="/cyclestacks" className="text-andesnavy hover:underline">
          {t("cyclestacks.brand")}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-andesnavy">{t("cyclestacks.contribute")}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-rubikOne uppercase tracking-wide text-andesnavy">
          {t("cyclestacks.contribute")}
        </h1>
        <p className="mt-1 text-andesnavy/70">{t("cyclestacks.contributeSubtitle")}</p>
      </header>

      <form
        noValidate
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          if (SUBMISSION_MODE === "form" && SUBMISSION_FORM_URL) {
            window.open(SUBMISSION_FORM_URL, "_blank", "noopener,noreferrer");
          } else {
            submitEmail();
          }
        }}
      >
        {/* honeypot oculto */}
        <input
          aria-hidden
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={payload.midName}
          onChange={(e) => setPayload((p) => ({ ...p, midName: e.target.value }))}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.title} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.title")}
            </label>
            <input
              id={ids.title}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
              style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
              value={payload.title}
              onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor={ids.author} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.author")}
            </label>
            <input
              id={ids.author}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
              style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
              value={payload.author}
              onChange={(e) => setPayload((p) => ({ ...p, author: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor={ids.year} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.year")}
            </label>
            <input
              id={ids.year}
              inputMode="numeric"
              pattern="\d{3,4}"
              placeholder="2020"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
              style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
              value={payload.year}
              onChange={(e) => setPayload((p) => ({ ...p, year: e.target.value }))}
              aria-invalid={!validity.yearOk}
            />
            {!validity.yearOk && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {t("cyclestacks.validation.year") || "Año inválido (3–4 dígitos)."}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={ids.link} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.link")}
            </label>
            <input
              id={ids.link}
              type="url"
              placeholder="https://…"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
              style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
              value={payload.link}
              onChange={(e) => setPayload((p) => ({ ...p, link: e.target.value }))}
              aria-invalid={!validity.linkOk}
            />
            {!validity.linkOk && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {t("cyclestacks.validation.link") || "URL inválida."}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={ids.desc} className="block text-sm font-medium text-andesnavy">
            {t("cyclestacks.mail.desc")}
          </label>
          <textarea
            id={ids.desc}
            rows={5}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
            style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
            value={payload.description}
            onChange={(e) => setPayload((p) => ({ ...p, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.license} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.contribute.license.label")}
            </label>
            <select
              id={ids.license}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
              style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
              value={payload.license}
              onChange={(e) => setPayload((p) => ({ ...p, license: e.target.value as LicenseKey }))}
            >
              <option value="public">{t("cyclestacks.contribute.license.public")}</option>
              <option value="perm">{t("cyclestacks.contribute.license.perm")}</option>
              <option value="external">{t("cyclestacks.contribute.license.external")}</option>
            </select>
          </div>
          <div>
            <label htmlFor={ids.contact} className="block text-sm font-medium text-andesnavy">
              {t("cyclestacks.mail.contact")}
            </label>
            <input
              id={ids.contact}
              type="email"
              placeholder="tú@email.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[--accent] focus:ring-2 focus:ring-[--accent]"
              style={{ "--accent": "#d6ef0a" } as React.CSSProperties}
              value={payload.contact}
              onChange={(e) => setPayload((p) => ({ ...p, contact: e.target.value }))}
              aria-invalid={!emailRe.test(payload.contact || "") && !!payload.contact}
            />
            {payload.contact && !emailRe.test(payload.contact) && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {t("cyclestacks.validation.email") || "Email inválido."}
              </p>
            )}
          </div>
        </div>

        <label htmlFor={ids.consent} className="flex items-start gap-3 text-sm text-andesnavy">
          <input
            id={ids.consent}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-andesnavy focus:ring-andesnavy"
            checked={payload.consent}
            onChange={(e) => setPayload((p) => ({ ...p, consent: e.target.checked }))}
          />
          <span>{t("cyclestacks.contribute.consent")}</span>
        </label>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-andesnavy px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {SUBMISSION_MODE === "form" ? t("cyclestacks.contribute.openForm") : t("cyclestacks.contribute.sendEmail")}
          </button>

          <button
            type="button"
            onClick={submitEmail}
            disabled={!canSubmit}
            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-gray-50 disabled:opacity-50"
          >
            {t("cyclestacks.contribute.sendEmail")}
          </button>

          <Link
            to="/cyclestacks"
            className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-andesnavy hover:bg-gray-200"
          >
            {t("cyclestacks.back")}
          </Link>
        </div>
      </form>

      <p className="mt-4 text-xs text-andesnavy/60">{t("cyclestacks.contribute.note")}</p>
    </div>
  );
};

export default CycleStackContribute;
