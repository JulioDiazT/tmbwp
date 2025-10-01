// src/components/Phrase.tsx
import { FC, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

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
        bg-[radial-gradient(1200px_500px_at_50%_-10%,rgba(153,88,253,0.10),transparent_60%),linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]
      "
    >
      {/* blobs sutiles */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "#9958fd22" }}
      />
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "#d6ef0a22" }}
      />

      {/* pestaña superior */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 rounded-b-full"
        style={{
          background:
            "linear-gradient(90deg,#9958fd 0%, #d6ef0a 50%, #fe8303 100%)",
        }}
      />

      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12"
      >
        {/* eyebrow */}
        <div className="mb-5 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm"
            style={{ background: "#ffffffcc", backdropFilter: "blur(4px)" }}
          >
            {t("mission.tag", { defaultValue: "Nuestra misión" })}
          </span>
        </div>

        {/* frase principal */}
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
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg,#9958fd,#d6ef0a)" }}
          >
            {t("mission.cities")}
          </span>
          {", "}
          <span>{t("mission.mid")}</span>{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg,#d6ef0a,#fe8303)" }}
          >
            {t("mission.pedal")}
          </span>
          {"."}
        </p>

        {/* sub copy actualizado */}
        <p className="mt-4 text-center text-sm sm:text-base text-neutral-600 max-w-[60ch] mx-auto">
          {t("mission.sub", {
            defaultValue:
              "Impulsamos la movilidad sostenible, la organización comunitaria y la acción juvenil para transformar nuestros barrios y ciudades.",
          })}
        </p>

        {/* línea inferior de acento */}
        <div
          className="mx-auto mt-8 h-1 w-24 rounded-full"
          style={{
            background: "linear-gradient(90deg,#9958fd,#d6ef0a,#fe8303)",
          }}
        />
      </motion.div>
    </section>
  );
};

export default Phrase;
