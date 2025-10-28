// src/components/BannerMemories.tsx
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/banner-recuerdos.svg";

/* =====================  utilidades ===================== */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

// Divide el texto en palabras → caracteres para animación letra a letra
const splitToWordChars = (text: string) =>
  text.trim().split(/\s+/).map(w => [...w]);

/* =====================  componente ===================== */

const C_LIME = "#d6ef0a";
const C_PURP = "#9958fd";
const C_NAVY = "#0B213F";

const BannerMemories: FC = () => {
  const { t } = useTranslation();
  const prefersReduced = usePrefersReducedMotion();

  const bannerRef   = useRef<HTMLElement | null>(null);
  const titleRef    = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const imgRef      = useRef<HTMLImageElement | null>(null);

  // Si tienes header sticky, compensa el pin/scroll
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const el =
      document.querySelector<HTMLElement>("[data-fixed-header], header[role='banner']") ||
      document.querySelector<HTMLElement>("header");
    const getH = () => setHeaderH(el?.getBoundingClientRect().height ?? 0);
    getH();
    const ro = el ? new ResizeObserver(getH) : null;
    el && ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  const titleText = t("memories.banner.title", "CADA RECUERDO COMIENZA CON UN PEDAL");
  const subText   = t("memories.banner.subtitle", "¿Qué plan traes para este sábado?");
  const titleWc   = useMemo(() => splitToWordChars(titleText), [titleText]);
  const subWc     = useMemo(() => splitToWordChars(subText),   [subText]);

  useEffect(() => {
    if (prefersReduced) return; // accesibilidad

    let ctx: any;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!bannerRef.current || !titleRef.current || !subtitleRef.current) return;

      const titleChars = titleRef.current.querySelectorAll<HTMLElement>(".char");
      const subChars   = subtitleRef.current.querySelectorAll<HTMLElement>(".char");

      // Distancia de animación/pin adaptativa
      const isSmall = window.matchMedia("(max-width: 640px)").matches;
      const perChar = isSmall ? 10 : 14;
      const total   = titleChars.length + subChars.length;
      const endDist = Math.max(window.innerHeight * 1.05, total * perChar, 700);

      ctx = gsap.context(() => {
        // Parallax sutil del fondo (imagen) para dar vida
        if (imgRef.current) {
          gsap.to(imgRef.current, {
            scale: 1.08,
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: bannerRef.current!,
              start: () => `top top+=${headerH}`,
              end:   () => `+=${Math.round(endDist)}`,
              scrub: true,
            },
          });
        }

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: bannerRef.current!,
            start: () => `top top+=${headerH}`,
            end:   () => `+=${Math.round(endDist)}`,
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(titleChars, { opacity: 1, y: 0, stagger: { each: 0.02, from: "start" }, duration: 0.6 }, 0);
        tl.to(subChars,   { opacity: 1, y: 0, stagger: { each: 0.018, from: "start" }, duration: 0.55 }, ">-0.12");

        // Refresca cuando cargan fuentes/imagenes
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        // @ts-ignore
        document.fonts?.ready?.then?.(refresh);
        setTimeout(refresh, 60);
      }, bannerRef);
    })();

    return () => ctx?.revert?.();
  }, [prefersReduced, headerH, titleWc.length, subWc.length]);

  return (
    <section
      ref={bannerRef}
      className="
        relative flex min-h-screen items-center justify-center overflow-hidden
        bg-[#0b213f] /* fallback si no carga la imagen */
      "
      style={{ minHeight: "100svh" }}
      aria-label={t("memories.banner.aria", "Recuerdos – Apertura")}
    >
      {/* Fondo: imagen + degradado + viñeta + malla de toques lime/púrpura */}
      <img
        ref={imgRef}
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      {/* Capa de color para mejorar lectura (sin arcoíris) */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(1200px_500px_at_15%_-10%,rgba(214,239,10,0.18),transparent_60%),
              radial-gradient(1100px_520px_at_85%_110%,rgba(153,88,253,0.18),transparent_60%)]
        "
        aria-hidden
      />
      {/* Viñeta suave desde bordes */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.35)_40%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.55)_100%)]" />

      {/* Contenido */}
      <div className="relative z-10 px-4 text-center max-w-5xl">
        {/* Eye-brow lime minimalista para coherencia de marca */}
        <div className="mx-auto mb-5 h-1.5 w-24 rounded-full" style={{ background: C_LIME }} />

        <h1
          ref={titleRef}
          className="
            select-none uppercase font-rubikOne tracking-tight leading-[0.98]
            text-white text-[clamp(2.2rem,7vw,4.8rem)]
          "
        >
          {titleWc.map((word, wi) => (
            <span key={`w-${wi}`} className="mr-[0.28em] inline-block whitespace-nowrap">
              {word.map((ch, ci) => (
                <span
                  key={`t-${wi}-${ci}`}
                  className="char inline-block translate-y-12 opacity-0 will-change-[transform,opacity]"
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="
            mt-6 select-none font-quicksand font-semibold uppercase tracking-wide
            text-[clamp(1.1rem,3.2vw,1.8rem)]
          "
          style={{ color: C_LIME }}
        >
          {subWc.map((word, wi) => (
            <span key={`sw-${wi}`} className="mr-[0.24em] inline-block whitespace-nowrap">
              {word.map((ch, ci) => (
                <span
                  key={`s-${wi}-${ci}`}
                  className="char inline-block translate-y-8 opacity-0 will-change-[transform,opacity]"
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>

        {/* Chips decorativos (opcional, sin ruido) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90"
            style={{ background: `${C_PURP}33`, border: `1px solid ${C_PURP}66` }}
          >
            #Recuerdos
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90"
            style={{ background: `${C_LIME}2a`, border: `1px solid ${C_LIME}66`, color: C_NAVY }}
          >
            #Comunidad
          </span>
        </div>
      </div>

      {/* Línea inferior lime para cerrar el bloque y mantener coherencia global */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 h-1.5 w-24 rounded-full" style={{ background: C_LIME }} />
    </section>
  );
};

export default BannerMemories;
