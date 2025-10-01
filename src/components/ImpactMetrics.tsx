// src/components/ImpactMetrics.tsx
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation, Variants } from "framer-motion";

// Iconos de lucide-react
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
  color: string;     // se usará como --accent
  Icon: LucideIcon;
}

/** Paleta de acentos (marca) */
const BRAND = ["#9958fd", "#d6ef0a", "#fe8303"] as const;

const METRICS: Metric[] = [
  { labelKey: "metrics.rides",     value: 20,  suffix: "",    color: BRAND[0], Icon: MapPin   },
  { labelKey: "metrics.workshops", value: 12,  suffix: "",    color: BRAND[2], Icon: Wrench   },
  { labelKey: "metrics.people",    value: 200, suffix: "",    color: BRAND[1], Icon: Users    },
  { labelKey: "metrics.co2",       value: 1,   suffix: " t",  color: BRAND[0], Icon: Cloud    },
  { labelKey: "metrics.km",        value: 200, suffix: " km", color: BRAND[1], Icon: Activity },
  { labelKey: "metrics.speakers",  value: 12,  suffix: "",    color: BRAND[2], Icon: Mic2     },
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
        relative py-20 
        bg-[radial-gradient(900px_400px_at_20%_-10%,rgba(153,88,253,0.10),transparent_60%),radial-gradient(900px_400px_at_80%_110%,rgba(254,131,3,0.10),transparent_60%),linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]
      "
    >
      {/* pestaña sutil superior */}
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
          {METRICS.map(({ labelKey, value, suffix, color, Icon }) => (
            <motion.li
              key={labelKey}
              variants={item}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,.06)] p-5"
              style={
                {
                  // CSS var para acento
                  ["--accent" as any]: color,
                } as React.CSSProperties
              }
            >
              {/* Header: icono dentro de chip con borde en gradiente */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <span className="inline-grid place-items-center h-12 w-12 rounded-2xl text-white shadow-sm transition-transform duration-200 group-hover:scale-[1.03]"
                        style={{
                          background:
                            "linear-gradient(135deg,var(--accent),rgba(0,0,0,0.85))",
                          boxShadow: "0 10px 24px rgba(0,0,0,.10)",
                        }}>
                    <Icon size={22} className="opacity-95" />
                  </span>
                </div>

                {/* mini chip de color */}
                <span
                  className="h-2 w-12 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--accent),rgba(0,0,0,0.2))",
                  }}
                />
              </div>

              {/* Número */}
              <div className="mt-5">
                <AnimatedNumber
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                  style={{ color }}
                  value={value}
                  suffix={suffix}
                  duration={1.8}
                  start={inView}
                />
              </div>

              {/* Etiqueta */}
              <div className="mt-1 text-base sm:text-lg font-semibold text-neutral-800">
                {t(labelKey)}
              </div>

              {/* Barra de progreso decorativa (no funcional) para dinamismo */}
              <div className="mt-4 h-2 rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: inView ? "100%" : 0 }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
                  className="h-full"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--accent),rgba(0,0,0,0.25))",
                  }}
                />
              </div>
            </motion.li>
          ))}
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
      const current = Math.round(fromRef.current + (value - fromRef.current) * eased);
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
