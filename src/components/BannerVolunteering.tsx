import { FC, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import bannerImg from "../assets/vbanner.svg";

const container: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export const BannerVolunteering: FC = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[72vh] items-center justify-center overflow-hidden"
    >
      {/* Fondo */}
      <img
        src={bannerImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      {/* Overlay en gradiente de marca (navy + morado) */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,55,100,.85),rgba(153,88,253,.65))]" />
      {/* Brillos sutiles */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d6ef0a]/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#fe8303]/20 blur-2xl" />

      {/* Contenido */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-5 text-center"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={container}
      >
        <h1 className="font-rubikOne uppercase leading-[1.03] text-white text-[clamp(2.2rem,5.5vw,4.5rem)]">
          {t("volunteer.banner.title")}
        </h1>
        <p className="mt-4 text-white/90 text-[clamp(1rem,2.2vw,1.3rem)]">
          {t("volunteer.banner.subtitle")}
        </p>
      </motion.div>

      {/* Cinta lime inferior */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#d6ef0a]" />
    </section>
  );
};

export default BannerVolunteering;
