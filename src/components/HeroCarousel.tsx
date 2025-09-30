// src/components/HeroCarousel.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import hero1 from "../assets/hero1.svg";
import hero2 from "../assets/hero2.svg";
import hero3 from "../assets/hero3.svg";

const responsiveMap: Record<string, { srcSet?: string; sizes?: string; width?: number; height?: number }> = {
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
    setH(header.offsetHeight);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const el = entry.target as HTMLElement;
      setH(el.offsetHeight);
    });

    ro.observe(header);
    const onResize = () => setH(header.offsetHeight);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return h;
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

  return (
    <section
      style={{ paddingTop: headerHeight }}
      className="relative h-screen overflow-hidden"
      aria-label={t("hero.title") || "Hero"}
    >
      {IMAGES.map((src, i) => {
        const responsive = responsiveMap[src] || {};
        const isActive = i === idx;

        return (
          <img
            key={src}
            src={src}
            width={responsive.width}
            height={responsive.height}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}   // ✅ correción
            decoding="async"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-[opacity]",
              isActive ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        );
      })}

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div
        className="
          relative z-10 mx-auto flex h-full max-w-3xl flex-col 
          items-center justify-start px-4 text-center text-white
          mt-[22vh]
        "
      >
        <h1 className="mb-3 font-rubikOne text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mb-5 font-quicksand text-lg sm:text-xl md:text-2xl">
          {t("hero.subtitle")}
        </p>
        <Link
          to="https://www.instagram.com/tomebambike?utm_source=ig_web_button_share_sheet&igsh=MjQza3Jhb3lhN2xu"
          className="inline-block rounded-full bg-primary px-8 py-3 text-lg font-semibold uppercase tracking-wide transition duration-300 ease-out hover:bg-white hover:text-primary hover:scale-105"
        >
          {t("hero.cta")}
        </Link>
      </div>
    </section>
  );
}
