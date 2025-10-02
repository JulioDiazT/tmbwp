// src/components/Phrase.tsx
import { FC, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

/* Paleta */
const C1 = "#9958fd"; // morado
const C2 = "#d6ef0a"; // verde

export const Phrase: FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    amount: 0.2,
    margin: "-100px",
    once: false,
  });

  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="mission"
      className="
        relative w-full min-h-[65vh]
        overflow-hidden
        [grid-column:1/-1] [justify-self:center]
        grid place-items-center
        bg-white
        mb-16 sm:mb-20 lg:mb-24   /* ⬅️ margen inferior total, reducido */
      "
    >
      {/* línea superior SÓLIDA (VERDE) */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 rounded-b-full"
        style={{ background: C2 }}
      />

      {/* Contenido con margen superior DESPUÉS de la línea */}
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12
          mt-24 sm:mt-32 lg:mt-36
        "
      >
        {/* eyebrow */}
        <div className="mb-6 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm"
            style={{ background: "#ffffffcc", backdropFilter: "blur(4px)" }}
          >
            {t("mission.tag", { defaultValue: "Nuestra misión" })}
          </span>
        </div>

        {/* Frase principal — textos: 'cities' VERDE, 'pedal' MORADO */}
        <p
          className="
            font-bebas uppercase font-bold select-none
            tracking-tight leading-[1.05]
            text-center text-neutral-900
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            max-w-[18ch] sm:max-w-[26ch] md:max-w-[32ch] mx-auto
          "
        >
          <span>{t("mission.pre")}</span>{" "}
          <span style={{ color: C2 }}>{t("mission.cities")}</span>
          {", "}
          <span>{t("mission.mid")}</span>{" "}
          <span style={{ color: C1 }}>{t("mission.pedal")}</span>
          {"."}
        </p>

        {/* sub copy */}
        <p className="mt-5 text-center text-sm sm:text-base text-neutral-600 max-w-[60ch] mx-auto">
          {t("mission.sub", {
            defaultValue:
              "Impulsamos la movilidad sostenible, la organización comunitaria y la acción juvenil para transformar nuestros barrios y ciudades.",
          })}
        </p>

        {/* línea inferior de acento (VERDE) con espacio moderado antes y después */}
        <div
          className="mx-auto mt-12 sm:mt-14 lg:mt-16 h-1 w-24 rounded-full"
          style={{ background: C2 }}
        />
        <div className="mb-8 sm:mb-12 lg:mb-14" /> {/* ⬅️ margen inferior reducido */}
      </motion.div>
    </section>
  );
};

export default Phrase;
