import { FC, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";

import designerImg from "../assets/v2.svg";
import commsImg from "../assets/v3.svg";
import architectImg from "../assets/v4.svg";
import sociologistImg from "../assets/v1.svg";

const APPLICATION_URL = "https://forms.gle/Mqe39FNQYuGmMSDM8";

const POSITIONS = [
  { key: "designer", img: designerImg },
  { key: "comms", img: commsImg },
  { key: "architect", img: architectImg },
  { key: "sociologist", img: sociologistImg },
] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const BAND = ["#9958fd", "#fe8303", "#d6ef0a", "#0b3764"] as const;

export const VoluntarioPositions: FC = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true });

  const cards = useMemo(() => POSITIONS, []);

  return (
    <section ref={ref} className="bg-gray-50 py-24">
      {/* Título */}
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center">
        <h2 className="font-extrabold uppercase text-andesnavy text-[clamp(1.6rem,3.6vw,2.4rem)]">
          {t("volunteer.positionsTitle")}
        </h2>
      </div>

      {/* Grid */}
      <motion.div
        className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={container}
      >
        {cards.map(({ key, img }, i) => (
          <motion.article
            key={key}
            variants={item}
            whileHover={{ y: -6 }}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,.06)] ring-1 ring-black/5"
          >
            {/* Franja de color */}
            <div className="h-2 w-full" style={{ background: BAND[i % BAND.length] }} />

            {/* Imagen */}
            <img src={img} alt="" className="h-72 w-full object-cover" loading="lazy" />

            {/* Contenido */}
            <div className="flex flex-col p-6">
              <h3 className="text-andesnavy mb-2 text-lg font-extrabold uppercase">
                {t(`volunteer.positions.${key}.title`)}
              </h3>
              <p className="mb-6 text-[15px] text-gray-700">
                {t(`volunteer.positions.${key}.desc`)}
              </p>

              <a
                href={APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide transition"
                style={{
                  color: "#0b3764",
                  border: "2px solid #d6ef0a",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d6ef0a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {t("volunteer.positions.cta")}
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default VoluntarioPositions;
