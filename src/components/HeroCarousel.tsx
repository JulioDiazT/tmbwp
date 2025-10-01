// src/components/HeroCarousel.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";

const responsiveMap: Record<string, { width?: number; height?: number }> = {
  [hero1]: { width: 1600, height: 900 },
  [hero2]: { width: 1600, height: 900 },
  [hero3]: { width: 1600, height: 900 },
};

const IMAGES = [hero1, hero2, hero3];
const CHANGE_EVERY = 7000;

function useHeaderHeight() {
  const [h, setH] = useState<number>(0);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");
    if (!header) return;
    const update = () => setH(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  return h;
}

/* ============== CTA "Liquid Glass" NEUTRO ============== */
function LiquidCTA({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="
        group relative inline-flex items-center justify-center
        px-9 py-3 rounded-full font-semibold uppercase tracking-wide
        text-[15px] sm:text-[16px]
        text-white select-none
      "
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* capa glass */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-white/12 border border-white/30 backdrop-blur-xl
          shadow-[0_10px_26px_rgba(0,0,0,.28)]
          transition-all duration-300
          group-hover:bg-white/16 group-hover:border-white/40
        "
      />
      {/* halo neutro (sin color) */}
      <span
        className="
          absolute -inset-px rounded-full opacity-35
          transition-opacity duration-300
          group-hover:opacity-50
        "
        style={{ background: "rgba(255,255,255,0.35)", filter: "blur(4px)", zIndex: -1 }}
      />
      {/* burbujas líquidas muy sutiles (blancas translúcidas) */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full blur-lg mix-blend-screen"
        initial={{ x: 0, opacity: 0.28, scale: 1 }}
        animate={{ x: [0, 10, 0], opacity: [0.28, 0.44, 0.28], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        style={{ background: "rgba(255,255,255,0.7)" }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-7 w-7 rounded-full blur-md mix-blend-screen"
        initial={{ y: 0, opacity: 0.24, scale: 1 }}
        animate={{ y: [0, -8, 0], opacity: [0.24, 0.38, 0.24], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut", delay: 0.15 }}
        style={{ background: "rgba(255,255,255,0.6)" }}
      />
      {/* sheen (destello) en hover */}
      <motion.span
        aria-hidden
        initial={{ x: "-130%" }}
        whileHover={{ x: "130%" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none absolute inset-y-0 -skew-x-12 w-20 rounded-full opacity-0 group-hover:opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent)",
        }}
      />
      {/* texto */}
      <span className="relative z-[1] drop-shadow-[0_2px_8px_rgba(0,0,0,.35)]">
        {label}
      </span>
    </motion.a>
  );
}

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const nextIdx = useMemo(() => (idx + 1) % IMAGES.length, [idx]);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % IMAGES.length), CHANGE_EVERY);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = IMAGES[nextIdx];
  }, [nextIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % IMAGES.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      style={{ paddingTop: headerHeight }}
      className="relative h-[100svh] overflow-hidden"
      aria-label={t("hero.title") || "Hero"}
    >
      {/* slides */}
      {IMAGES.map((src, i) => {
        const { width, height } = responsiveMap[src] || {};
        const isActive = i === idx;
        return (
          <img
            key={src}
            src={src}
            width={width}
            height={height}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-[opacity]",
              isActive ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        );
      })}

      {/* overlay neutro para legibilidad */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/44 md:bg-black/36" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(1200px 500px at 50% 105%, rgba(0,0,0,.32), transparent 60%)",
          }}
        />
      </div>

      {/* contenido */}
      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-start px-4 text-center text-white mt-[22vh]">
        <h1 className="mb-3 font-rubikOne text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,.5)]">
          {t("hero.title")}
        </h1>
        <p className="mb-6 font-quicksand text-lg sm:text-xl md:text-2xl opacity-95 drop-shadow-[0_2px_6px_rgba(0,0,0,.45)]">
          {t("hero.subtitle")}
        </p>

        <LiquidCTA
          href="https://www.instagram.com/tomebambike?utm_source=ig_web_button_share_sheet&igsh=MjQza3Jhb3lhN2xu"
          label={t("hero.cta") || "ÚNETE A LA COMUNIDAD"}
        />

        {/* indicadores neutrales */}
        <div className="mt-8 flex items-center gap-3">
          {IMAGES.map((_, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className="group relative h-2 w-12 overflow-hidden rounded-full bg-white/35 backdrop-blur-sm ring-1 ring-white/30"
              >
                <span
                  key={`${idx}-${i}-${active}`}
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: active ? "100%" : "0%",
                    background: "linear-gradient(90deg,#ffffff,rgba(255,255,255,.6))",
                    transition: active ? `width ${CHANGE_EVERY}ms linear` : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* fade inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
