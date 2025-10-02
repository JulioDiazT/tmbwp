// src/components/ImpactMetrics.tsx
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation, Variants } from "framer-motion";

import {
  MapPin,
  Wrench,
  Users,
  Cloud,
  Activity,
  Mic2,
  type LucideIcon,
} from "lucide-react";

interface Metric {
  labelKey: string;
  value: number;
  suffix?: string;
  Icon: LucideIcon;
}

/** Paleta de acentos (marca) */
const BRAND = ["#9958fd", "#d6ef0a", "#fe8303"] as const;

/** Sólo contenido; los colores se asignan por posición para garantizar patrón morado→verde→naranja */
const METRICS: Metric[] = [
  { labelKey: "metrics.rides",     value: 20,  suffix: "",    Icon: MapPin   },
  { labelKey: "metrics.workshops", value: 12,  suffix: "",    Icon: Wrench   },
  { labelKey: "metrics.people",    value: 200, suffix: "",    Icon: Users    },
  { labelKey: "metrics.co2",       value: 1,   suffix: " t",  Icon: Cloud    },
  { labelKey: "metrics.km",        value: 200, suffix: " km", Icon: Activity },
  { labelKey: "metrics.speakers",  value: 12,  suffix: "",    Icon: Mic2     },
];

export default function ImpactMetrics() {
  const { t } = useTranslation();
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.18 });

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
  }, [inView, controls]);

  const container: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, ease: "easeOut", duration: 0.6 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="
        relative py-20 my-16                  /* margen interno y externo */
        bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]
      "
    >
      {/* pestaña superior en colores de marca */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg,#9958fd 0%, #d6ef0a 50%, #fe8303 100%)",
        }}
      />

      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl sm:text-4xl font-bold uppercase font-rubikOne text-andesnavy">
          {t("metrics.title")}
        </h2>

        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          animate={controls}
          variants={container}
        >
          {METRICS.map(({ labelKey, value, suffix, Icon }, i) => {
            const accent = BRAND[i % 3]; // patrón fijo morado → verde → naranja
            return (
              <motion.li
                key={labelKey}
                variants={item}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,.06)] p-5"
                style={{ ["--accent" as any]: accent } as React.CSSProperties}
              >
                {/* Layout horizontal: icono grande izquierda + contenido derecha */}
                <div className="flex items-center gap-5">
                  {/* Icono grande, fondo sólido del color (sin degradado negro) */}
                  <span
                    className="
                      inline-grid place-items-center
                      h-20 w-20 sm:h-20 sm:w-20
                      rounded-2xl text-white shrink-0
                    "
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                    }}
                  >
                    <Icon size={36} strokeWidth={2} />
                  </span>

                  {/* Métrica + etiqueta centradas verticalmente para igualar la altura del icono */}
                  <div className="min-w-0 flex-1 min-h-[84px] flex flex-col justify-center">
                    <AnimatedNumber
                      className="text-[2.25rem] sm:text-[2.75rem] font-extrabold leading-none"
                      style={{ color: accent }}
                      value={value}
                      suffix={suffix}
                      duration={1.8}
                      start={inView}
                    />
                    <div className="mt-2 text-base sm:text-lg font-semibold text-neutral-800 truncate">
                      {t(labelKey)}
                    </div>

                    {/* Barra de acento sólida */}
                    <div className="mt-3 h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: inView ? "100%" : 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                        className="h-full"
                        style={{ background: "var(--accent)", opacity: 0.35 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------
   AnimatedNumber con rAF para mayor suavidad
------------------------------------------------------------ */
interface AniNumProps {
  value: number;
  duration: number; // segundos
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
  start: boolean;
}
function AnimatedNumber({
  value,
  duration,
  suffix = "",
  className = "",
  style,
  start,
}: AniNumProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const rafId = useRef<number | null>(null);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const stop = () => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  };

  useEffect(() => {
    if (!start) {
      stop();
      return;
    }
    stop();
    startRef.current = null;
    fromRef.current = 0;

    const totalMs = Math.max(200, duration * 1000);

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(1, elapsed / totalMs);
      const eased = easeOutCubic(p);
      const current = Math.round(
        fromRef.current + (value - fromRef.current) * eased
      );
      setDisplay(current);
      if (p < 1) {
        rafId.current = requestAnimationFrame(step);
      } else {
        stop();
      }
    };
    rafId.current = requestAnimationFrame(step);
    return stop;
  }, [value, duration, start]);

  const prefix = useMemo(() => (value >= 100 ? "+" : ""), [value]);

  return (
    <span className={className} style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
