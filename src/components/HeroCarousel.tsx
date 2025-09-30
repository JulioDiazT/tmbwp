import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Imágenes base (puedes mantener .jpg; idealmente sube .webp/.avif también)
import hero1 from "../assets/hero1.svg";
import hero2 from "../assets/hero2.svg";
import hero3 from "../assets/hero3.svg";

/**
 * Si tienes variantes responsivas, declara aquí sus srcset.
 * Ejemplo de nombres esperados:
 *   hero1-480.webp, hero1-768.webp, hero1-1280.webp
 *   hero2-480.webp, ...
 *   hero3-480.webp, ...
 */
const responsiveMap: Record<
  string,
  { srcSet?: string; sizes?: string; width?: number; height?: number }
> = {
  [hero1]: {
    // srcSet:
    //   "/assets/hero1-480.webp 480w, /assets/hero1-768.webp 768w, /assets/hero1-1280.webp 1280w",
    // sizes: "(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px",
    width: 1600,
    height: 900,
  },
  [hero2]: {
    // srcSet:
    //   "/assets/hero2-480.webp 480w, /assets/hero2-768.webp 768w, /assets/hero2-1280.webp 1280w",
    // sizes: "(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px",
    width: 1600,
    height: 900,
  },
  [hero3]: {
    // srcSet:
    //   "/assets/hero3-480.webp 480w, /assets/hero3-768.webp 768w, /assets/hero3-1280.webp 1280w",
    // sizes: "(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px",
    width: 1600,
    height: 900,
  },
};

const IMAGES = [hero1, hero2, hero3];
const CHANGE_EVERY = 7000; // ms

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const nextIdx = useMemo(() => (idx + 1) % IMAGES.length, [idx]);

  // Rotación automática
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % IMAGES.length), CHANGE_EVERY);
    return () => clearInterval(id);
  }, []);

  // Prefetch de la siguiente imagen para que el cambio sea inmediato
  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = IMAGES[nextIdx];
  }, [nextIdx]);

  return (
    <section
      className="relative h-[85vh] min-h-[560px] overflow-hidden"
      aria-label={t("hero.title") || "Hero"}
    >
      {IMAGES.map((src, i) => {
        const responsive = responsiveMap[src] || {};
        const isActive = i === idx;

        return (
          <img
            key={src}
            src={src}
            // Si tienes variantes, descomenta:
            // srcSet={responsive.srcSet}
            // sizes={responsive.sizes}
            width={responsive.width}
            height={responsive.height}
            alt=""
            // Solo el primer slide es prioritario: mejora LCP
            loading={i === 0 ? "eager" : "lazy"}
            // @ts-expect-error fetchpriority existe en navegadores modernos
            fetchpriority={i === 0 ? "high" : "auto"}
            decoding="async"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-[opacity]",
              isActive ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        );
      })}

      {/* Overlay oscuro para contraste de texto */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 font-rubikOne text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mb-6 font-quicksand text-lg sm:text-xl md:text-2xl">
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
