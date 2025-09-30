import { ArrowRight, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function MemoriesCTA() {
  const { t } = useTranslation();

  // Deep link a DM de Instagram con texto precargado
  const igDmLink = (() => {
    const text = t(
      "memories.cta.dmText",
      "Hola Tomebambike 👋 Me gustaría proponer/consultar sobre un evento."
    );
    return `https://ig.me/tomebambike?text=${encodeURIComponent(text)}`;
  })();

  return (
    <motion.section
      // Aparece dinámicamente al hacer scroll
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative py-14 sm:py-16"
      aria-label={t("memories.cta.title")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Contenedor limpio SIN sombras */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          {/* Cinta clara (sin fondos ni brillos laterales) */}
          <div className="px-6 py-10 md:px-10 md:py-12">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.6fr_1fr]">
              <header>
                {/* Acento cambiado a rojo (tmbred) */}
                <h2 className="text-tmbred text-[clamp(1.9rem,4.5vw,3.2rem)] font-extrabold leading-tight tracking-tight">
                  {t("memories.cta.title", "Let’s create our next memories together")}
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-700">
                  {t(
                    "memories.cta.desc",
                    "If you have an idea for a route, workshop or activity, propose it. We love co-creating with the community."
                  )}
                </p>
              </header>

              <div className="flex flex-col items-start gap-3 md:items-end">
                {/* BOTÓN outline rojo que se rellena al hover */}
                <a
                  href={igDmLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center rounded-2xl border-2 border-tmbred px-6 py-3 text-sm font-semibold text-tmbred transition
                             hover:-translate-y-[1px] hover:bg-tmbred hover:text-white focus:outline-none focus:ring-2 focus:ring-tmbred/40"
                >
                  <span className="mr-2">{t("memories.cta.button", "Propose an event")}</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </a>

                {/* Enlace secundario al perfil de IG */}
                <a
                  href="https://instagram.com/tomebambike"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:text-tmbred"
                  aria-label="Instagram Tomebambike"
                >
                  <Instagram size={16} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
