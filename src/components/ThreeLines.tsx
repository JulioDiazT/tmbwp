// src/components/ThreeLines.tsx
import { FC, useEffect, useRef } from "react";
import { motion, Variants, useAnimation, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

/* Variantes base: aparece al entrar y se desvanece al salir */
const rowVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

type RowProps = {
  label: string;
  color: string;
  delay: number;
};

const LineRow: FC<RowProps> = ({ label, color, delay }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  // Observa entrada/salida y anima en ambas direcciones (no se “queda” visible)
  const inView = useInView(ref, {
    amount: 0.65,
    margin: "0px 0px -15% 0px", // empieza antes de que llegue al centro
  });

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className="group"
      variants={rowVariants}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      style={{ willChange: "opacity, transform" }}
    >
      {/* Texto 100% del color (sin sombras de color) */}
      <motion.h2
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="
          font-rubikOne uppercase
          leading-[0.95] tracking-[-0.02em]
          text-5xl sm:text-6xl md:text-7xl lg:text-8xl
          inline-block transform-gpu
          text-center
        "
        style={{ color }}
      >
        {label}
      </motion.h2>

      {/* subrayado del mismo color, sin sombras de color */}
      <div className="mt-4 flex justify-center">
        <motion.span
          className="h-2 w-28 sm:w-36 md:w-44 lg:w-56 rounded-full origin-center transform-gpu"
          style={{ background: color, opacity: 0.9 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export const ThreeLines: FC = () => {
  const { t } = useTranslation();

  // Un color por línea (en tu orden)
  const accents = ["#d6ef0a", "#9958fd", "#fe8303"] as const;
  const keys    = ["mobility", "community", "city"] as const;

  return (
    <section id="three-lines" className="py-20 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* más espacio entre líneas y responsivo */}
        <div className="flex flex-col space-y-28 sm:space-y-32 md:space-y-36">
          {keys.map((k, i) => (
            <LineRow
              key={k}
              label={t(`three.${k}`)}
              color={accents[i]}
              delay={i * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeLines;
