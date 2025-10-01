// src/components/ThreeLines.tsx
import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

export const ThreeLines: FC = () => {
  const { t } = useTranslation();

  const keys = ["mobility", "community", "city"] as const;
  const accents = ["#9958fd", "#d6ef0a", "#fe8303"] as const;

  return (
    <section
      id="three-lines"
      className="
        relative py-20
        bg-[radial-gradient(1000px_420px_at_20%_-10%,rgba(153,88,253,0.10),transparent_60%),radial-gradient(900px_380px_at_80%_110%,rgba(254,131,3,0.10),transparent_60%),linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]
        overflow-hidden
      "
    >
      {/* pestaña superior multicolor */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 rounded-b-full"
        style={{
          background:
            "linear-gradient(90deg,#9958fd 0%, #d6ef0a 50%, #fe8303 100%)",
        }}
      />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {keys.map((key, i) => {
          const c1 = accents[i % accents.length];
          const c2 = accents[(i + 1) % accents.length]; // gradiente al siguiente color
          return (
            <motion.div
              key={key}
              className="relative mt-14 sm:mt-16 md:mt-20"
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.6, once: false }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
            >
              {/* texto gigante A COLOR (gradiente) */}
              <motion.h2
                whileHover={{ y: -4 }}
                className="
                  font-rubikOne uppercase
                  leading-[0.95] tracking-[-0.02em]
                  text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                  text-transparent bg-clip-text inline-block
                "
                style={{
                  backgroundImage: `linear-gradient(90deg, ${c1}, ${c2})`,
                }}
              >
                {t(`three.${key}`)}
              </motion.h2>

              {/* subrayado animado centrado */}
              <div
                className="
                  h-2 w-28 sm:w-36 md:w-44 lg:w-56 rounded-full mt-3 mx-auto
                  overflow-hidden bg-neutral-100
                "
                aria-hidden
              >
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                  className="h-full"
                  style={{
                    background: `linear-gradient(90deg, ${c1}, ${c2}, rgba(0,0,0,0.25))`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ThreeLines;
