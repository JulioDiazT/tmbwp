import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type LicenseKey = "public" | "perm" | "external";

// —— Config de envío ——
const SUBMISSION_MODE: "form" | "email" = "form";                 // cambia si quieres solo email
const SUBMISSION_FORM_URL = "https://forms.gle/tu-form-id";        // ⚠️ reemplaza
const SUBMISSION_EMAIL    = "hola@tomebambike.ec";                  // ⚠️ reemplaza

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
    consent: false
  });

  const canSubmit = useMemo(() => {
    const yearOk = !payload.year || /^\d{3,4}$/.test(payload.year);
    return (
      payload.title.trim().length > 1 &&
      payload.author.trim().length > 1 &&
      yearOk &&
      payload.description.trim().length > 5 &&
      payload.consent
    );
  }, [payload]);

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
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/cyclestacks" className="text-andesnavy hover:underline">
          {t("cyclestacks.brand")}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-andesnavy">{t("cyclestacks.contribute")}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-rubikOne uppercase tracking-wide text-andesnavy">
          {t("cyclestacks.contribute")}
        </h1>
        <p className="mt-1 text-andesnavy/70">{t("cyclestacks.contributeSubtitle")}</p>
      </header>

      {/* Form */}
      <form
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (SUBMISSION_MODE === "form" && SUBMISSION_FORM_URL) {
            window.open(SUBMISSION_FORM_URL, "_blank");
          } else {
            submitEmail();
          }
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.mail.title")}</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
              value={payload.title}
              onChange={(e) => setPayload((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.mail.author")}</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
              value={payload.author}
              onChange={(e) => setPayload((p) => ({ ...p, author: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.mail.year")}</label>
            <input
              inputMode="numeric"
              pattern="\d{3,4}"
              placeholder="2020"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
              value={payload.year}
              onChange={(e) => setPayload((p) => ({ ...p, year: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.mail.link")}</label>
            <input
              type="url"
              placeholder="https://…"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
              value={payload.link}
              onChange={(e) => setPayload((p) => ({ ...p, link: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.mail.desc")}</label>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
            value={payload.description}
            onChange={(e) => setPayload((p) => ({ ...p, description: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.contribute.license.label")}</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
              value={payload.license}
              onChange={(e) => setPayload((p) => ({ ...p, license: e.target.value as LicenseKey }))}
            >
              <option value="public">{t("cyclestacks.contribute.license.public")}</option>
              <option value="perm">{t("cyclestacks.contribute.license.perm")}</option>
              <option value="external">{t("cyclestacks.contribute.license.external")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-andesnavy">{t("cyclestacks.mail.contact")}</label>
            <input
              type="email"
              placeholder="tú@email.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-tmbred focus:ring-2 focus:ring-tmbred"
              value={payload.contact}
              onChange={(e) => setPayload((p) => ({ ...p, contact: e.target.value }))}
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-andesnavy">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-tmbred focus:ring-tmbred"
            checked={payload.consent}
            onChange={(e) => setPayload((p) => ({ ...p, consent: e.target.checked }))}
          />
          <span>{t("cyclestacks.contribute.consent")}</span>
        </label>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-tmbred px-5 py-2.5 text-sm font-semibold text-white hover:bg-tmbred/90 disabled:opacity-50"
          >
            {SUBMISSION_MODE === "form" ? t("cyclestacks.contribute.openForm") : t("cyclestacks.contribute.sendEmail")}
          </button>

          {/* Siempre disponible: enviar por correo con los datos escritos */}
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

      {/* Nota legal */}
      <p className="mt-4 text-xs text-andesnavy/60">
        {t("cyclestacks.contribute.note")}
      </p>
    </div>
  );
};

export default CycleStackContribute;
