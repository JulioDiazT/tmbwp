import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const C = {
  lime: "#d6ef0a",
  navy: "#0b3764",
  white: "#ffffff",
  border: "rgba(11,55,100,.12)", // navy muy suave
};

export default function MemoriesCTA() {
  const { t } = useTranslation();

  const dmLink = (() => {
    const text = t(
      "memories.cta.dmText",
      "Hola Tomebambike 👋 Me gustaría proponer/consultar sobre un evento."
    );
    return `https://ig.me/m/tomebambike?text=${encodeURIComponent(text)}`;
  })();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="py-12 sm:py-16"
      aria-label={t("memories.cta.title")}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Tarjeta minimal */}
        <div
          className="rounded-2xl bg-white p-6 sm:p-8 lg:p-10"
          style={{ border: `1px solid ${C.border}` }}
        >
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.25fr_.75fr]">
            {/* Texto */}
            <div>
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: C.navy }}
              >
                {t("memories.cta.kicker", "Comunidad Tomebambike")}
              </p>

              <h2
                className="font-rubikOne uppercase tracking-tight leading-[1.05]
                           text-[clamp(1.8rem,4.4vw,3rem)]"
                style={{ color: C.navy }}
              >
                {t(
                  "memories.cta.title",
                  "¡Únete! Creamos junt@s nuestros próximos recuerdos"
                )}
              </h2>

              <p className="mt-4 max-w-prose text-[15px] leading-relaxed" style={{ color: C.navy }}>
                {t(
                  "memories.cta.desc",
                  "¿Tienes una idea para una ruta, taller o actividad? Propónla. Nos encanta co-crear con la comunidad."
                )}
              </p>
            </div>

            {/* CTA */}
            <div className="md:justify-self-end w-full">
              <a
                href={dmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-[15px] font-extrabold transition"
                style={{
                  background: C.lime,
                  color: C.navy,
                  border: `2px solid ${C.lime}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.white;
                  e.currentTarget.style.color = C.navy;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.lime;
                  e.currentTarget.style.color = C.navy;
                }}
              >
                {t("memories.cta.button", "Proponer un evento")}
                <ArrowRight size={18} />
              </a>

              <p className="mt-3 text-center text-xs" style={{ color: C.navy }}>
                {t("memories.cta.free", "Sin costo — Voluntariado y comunidad")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
