// src/components/HowItStarted.tsx
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type TLKey = "2019" | "2024" | "uda" | "partners";
const ORDER: TLKey[] = ["2019", "2024", "uda", "partners"];

// Colores de acento (morado, lima, navy claro para variar sin perder coherencia)
const ACCENTS = ["#9958fd", "#d6ef0a", "#0B213F"] as const;

const HowItStarted: FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative bg-white py-16 sm:py-20"
      aria-label={t("memories.timeline.aria", "Cómo comenzó todo")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Encabezado coherente con el resto del sitio */}
        <header className="mb-12 text-center">
          <div className="mx-auto mb-3 h-1.5 w-24 rounded-full bg-[#d6ef0a]" />
          <h2 className="font-rubikOne text-andesnavy text-[clamp(1.9rem,4.6vw,3rem)] uppercase tracking-tight">
            {t("memories.timeline.title", "Cómo comenzó todo")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-andesnavy/70">
            {t("memories.timeline.subtitle", "Una historia que pedalea desde la comunidad.")}
          </p>
        </header>

        {/* Contenedor de timeline */}
        <div className="relative mx-auto max-w-5xl">
          {/* Línea central para md+; en móvil usamos una lateral sutil */}
          <div
            aria-hidden
            className="
              pointer-events-none absolute left-1.5 top-0 h-full w-[3px] rounded-full bg-andesnavy/10
              md:left-1/2 md:-translate-x-1/2 md:bg-andesnavy/20
            "
          />

          <ol className="grid grid-cols-1 gap-10 md:gap-14">
            {ORDER.map((k, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const isRight = i % 2 === 1; // en desktop alterna derecha/izquierda

              return (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className={`
                    relative grid grid-cols-[auto_1fr] items-start gap-4 md:grid-cols-1
                    ${isRight ? "md:justify-items-end" : "md:justify-items-start"}
                  `}
                  style={{ ["--accent" as any]: accent } as React.CSSProperties}
                >
                  {/* Nodo / punto en la línea */}
                  <span
                    aria-hidden
                    className="
                      mt-2 h-3 w-3 rounded-full bg-[var(--accent)]
                      md:absolute md:top-3 md:h-3.5 md:w-3.5
                      md:left-1/2 md:-translate-x-1/2
                      ring-4 ring-white shadow-[0_6px_18px_rgba(0,0,0,.08)]
                    "
                  />

                  {/* Conector hacia la card (solo en desktop para dramatismo) */}
                  <span
                    aria-hidden
                    className={`
                      hidden md:block md:absolute md:top-4
                      ${isRight ? "md:left-[52%]" : "md:right-[52%]"}
                      h-[2px] w-[10%] rounded-full bg-[var(--accent)]/70
                    `}
                  />

                  {/* Card */}
                  <article
                    className={`
                      relative col-span-2 md:col-span-1
                      w-full max-w-[46rem]
                      rounded-3xl bg-white p-6 sm:p-7
                      shadow-[0_10px_30px_rgba(0,0,0,.06)] ring-1 ring-black/5
                      transition-transform duration-200 hover:-translate-y-0.5
                      ${isRight ? "md:pl-12" : "md:pr-12"}
                    `}
                  >
                    {/* Barra superior de acento */}
                    <div
                      aria-hidden
                      className="absolute left-6 right-6 top-0 h-1.5 -translate-y-1/2 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />

                    {/* Año como píldora */}
                    <div className="mb-2 inline-flex items-center gap-2">
                      <span
                        className="
                          rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide
                          text-andesnavy
                        "
                        style={{
                          background: "color-mix(in oklab, var(--accent) 18%, white)",
                          border: "1px solid color-mix(in oklab, var(--accent) 38%, transparent)",
                        }}
                      >
                        {t(`memories.timeline.${k}.year`)}
                      </span>
                    </div>

                    {/* Título + detalle */}
                    <h3 className="text-[1.25rem] sm:text-[1.45rem] font-extrabold text-andesnavy leading-snug">
                      {t(`memories.timeline.${k}.title`)}
                    </h3>

                    <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-andesnavy/85">
                      {t(`memories.timeline.${k}.desc`)}
                    </p>

                    {/* Línea de progreso decorativa */}
                    <div className="mt-5 h-2 rounded-full bg-andesnavy/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full"
                        style={{ background: "var(--accent)" }}
                      />
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItStarted;
