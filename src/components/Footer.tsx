import { Instagram, Linkedin, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logoUrl from "../assets/logoblanco.svg";
import { useMemo } from "react";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const nav = useMemo(
    () => [
      { to: "/recuerdos", label: t("nav.memories", "Recuerdos") },
      { to: "/voluntariado", label: t("nav.volunteering", "Voluntariado") },
      { to: "/cyclestacks", label: t("nav.cyclestacks", "Cicloteca") },
    ],
    [t]
  );

  return (
    <footer className="mt-auto relative border-t border-white/10 bg-gradient-to-b from-neutral-900 to-black text-neutral-100">
      {/* halo sutil */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 flex justify-center">
        <div className="h-40 w-[32rem] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white/5 p-6 md:p-7 lg:p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
          {/* columna 3 más ancha para ocupar espacio */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr_1.9fr]">
            {/* Brand */}
            <div className="space-y-3">
              <Link to="/" className="group inline-flex items-center gap-3">
               <img
                  src={logoUrl}
                  alt="Tomebambike"
                  className="h-16 w-auto block drop-shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
                />
              
              </Link>
              <p className="text-sm text-neutral-300/90">
                {t("footer.tagline", "Ciudades más sanas, seguras e inclusivas — un pedal a la vez.")}
              </p>
            </div>

            {/* Enlaces rápidos (vertical) */}
            <nav>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-300">
                {t("footer.quicklinks", "Enlaces rápidos")}
              </p>
              <ul className="flex flex-col gap-2.5">
                {nav.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group inline-flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                    >
                      <span className="text-base text-neutral-100/90">{label}</span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA primero, “Síguenos” debajo */}
            <section className="space-y-4">
              {/* CTA ancho */}
              <div className="rounded-2xl bg-gradient-to-r from-white/10 to-white/5 p-4 ring-1 ring-white/10 md:p-5">
                <p className="text-sm font-semibold">
                  {t("footer.ctaTitle", "¿Quieres enterarte de nuestros eventos?")}
                </p>
                <p className="mt-1 text-sm text-neutral-300/90">
                  {t("footer.ctaDesc", "Síguenos en Instagram y activa las notificaciones. Allí publicamos fechas, rutas y cupos.")}
                </p>
                {/* Botón con cambio de color de texto en hover */}
                <a
                  href="https://instagram.com/tomebambike"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative mt-3 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-black transition
                             hover:-translate-y-[1px] hover:shadow-[0_10px_30px_-10px_rgba(255,0,0,0.45)]
                             focus:outline-none focus:ring-2 focus:ring-primary/60"
                >
                  {/* brillo diagonal */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition
                               group-hover:translate-x-full group-hover:opacity-100"
                    style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 40%, #000 50%, transparent 60%)' }}
                  />
                  <span className="relative transition-colors group-hover:text-white">
                    {t("footer.ctaButton", "Ver próximos eventos en Instagram")}
                  </span>
                </a>
              </div>

              {/* “Síguenos” debajo del CTA */}
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
                  {t("footer.follow", "Síguenos")}
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/tomebambike"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ring-white/10 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/tomebambike/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ring-white/10 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Divider compacto */}
          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-neutral-300 md:flex-row">
            <p>© {year} Tomebambike — {t("footer.rights", "Todos los derechos reservados")}</p>
            <div className="flex items-center gap-4">
              <Link to="/privacidad" className="hover:text-white/90">
                {t("footer.privacyLink", "Privacidad")}
              </Link>
              <span aria-hidden>·</span>
              <Link to="/terminos" className="hover:text-white/90">
                {t("footer.termsLink", "Términos")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
