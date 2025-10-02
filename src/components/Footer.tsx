// src/components/Footer.tsx
import { Instagram, Linkedin, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logoUrl from "../assets/logoblanco.svg";
import { useMemo } from "react";

const GREEN = "#d6ef0a";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const nav = useMemo(
    () => [
      { to: "/recuerdos",    label: t("nav.memories", "Recuerdos") },
      { to: "/voluntariado", label: t("nav.volunteering", "Voluntariado") },
      { to: "/cyclestacks",  label: t("nav.cyclestacks", "Cicloteca") },
    ],
    [t]
  );

  return (
    <footer className="mt-auto relative bg-neutral-950 text-neutral-100">
      {/* Acento superior verde */}
      <div className="h-1.5 w-full" style={{ background: GREEN }} />

      {/* Halo sutil */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-16 flex justify-center">
        <div className="h-36 w-[28rem] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-8xl px-6 py-12">
        {/* contenedor glass sin borde azul */}
        <div className="rounded-3xl bg-white/[0.04] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,.35)] border border-white/10 backdrop-blur-md">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1.6fr]">
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt="Tomebambike"
                  className="h-16 w-auto block drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
                  loading="eager"
                  decoding="async"
                />
              </Link>

              <p className="text-[15.5px] leading-relaxed text-neutral-200/90 max-w-[48ch]">
                {t(
                  "footer.tagline",
                  "Ciudades más sanas, seguras e inclusivas — un pedal a la vez."
                )}
              </p>
            </div>

            {/* Enlaces rápidos */}
            <nav>
              <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-300">
                {t("footer.quicklinks", "Enlaces rápidos")}
              </p>
              <ul className="flex flex-col gap-2.5">
                {nav.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group inline-flex w-full items-center justify-between rounded-lg px-2 py-2 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[rgba(214,239,10,.55)]"
                    >
                      <span className="uppercase text-[16px] sm:text-[17px] font-semibold text-neutral-100/95 relative after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-[rgba(214,239,10,1)] after:rounded-full after:transition-all group-hover:after:w-full">
                        {label}
                      </span>
                      <ArrowRight
                        size={18}
                        className="shrink-0 translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA + Redes */}
            <section className="space-y-5">
              {/* CTA legible, sin borde azul */}
              <div className="rounded-2xl bg-white/[0.05] p-5 border border-white/12">
                <p className="text-sm font-semibold uppercase tracking-wider text-neutral-100/95">
                  {t("footer.ctaTitle", "¿Quieres enterarte de nuestros eventos?")}
                </p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-neutral-200/90">
                  {t(
                    "footer.ctaDesc",
                    "Síguenos en Instagram y activa las notificaciones. Allí publicamos fechas, rutas y cupos."
                  )}
                </p>

                {/* Botón grande (outline + fill on hover) */}
                <a
                  href="https://instagram.com/tomebambike"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group relative mt-4 inline-flex w-full items-center justify-center
                    rounded-2xl px-5 py-3.5 text-[15.5px] font-semibold
                    backdrop-blur transition-all duration-200
                  "
                  style={{
                    color: "#f5f5f5",
                    background: "rgba(255,255,255,0.04)",
                    boxShadow: "inset 0 0 0 2px " + GREEN,
                    borderColor: GREEN,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = GREEN;
                    e.currentTarget.style.color = "#0c0c0c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = "#f5f5f5";
                  }}
                >
                  {t("footer.ctaButton", "Ver próximos eventos en Instagram")}
                </a>
              </div>

              {/* Redes */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-300">
                  {t("footer.follow", "Síguenos")}
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/tomebambike"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/0 backdrop-blur transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[rgba(214,239,10,.55)]"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/tomebambike/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/0 backdrop-blur transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[rgba(214,239,10,.55)]"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Divider */}
          <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Copyright centrado */}
          <div className="text-center text-[14.5px] text-neutral-300">
            © {year} Tomebambike — {t("footer.rights", "Todos los derechos reservados")}
          </div>
        </div>
      </div>
    </footer>
  );
}
