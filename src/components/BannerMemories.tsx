// src/components/BannerMemories.tsx
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import heroImg from '../assets/banner-recuerdos.svg';
import { useTranslation } from 'react-i18next';

// Respeta reduced motion (RRM)
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

// Divide el texto en palabras y, a su vez, en caracteres (no se parte dentro de la palabra)
function splitToWordChars(text: string) {
  const words = text.trim().split(/\s+/);
  return words.map(w => [...w]); // spread = codepoints (acentos/emoji OK)
}

const BannerMemories: FC = () => {
  const { t } = useTranslation();
  const bannerRef   = useRef<HTMLElement | null>(null);
  const titleRef    = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Header fijo (auto)
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const el =
      document.querySelector<HTMLElement>('[data-fixed-header], header[role="banner"]') ||
      document.querySelector<HTMLElement>('header');
    const getH = () => setHeaderH(el?.getBoundingClientRect().height ?? 0);
    getH();
    const ro = el ? new ResizeObserver(getH) : null;
    el && ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  // i18n
  const titleText = t('memories.banner.title', 'TODO LO MEMORABLE COMIENZA CON UN…');
  const subText   = t('memories.banner.subtitle', '¿QUÉ HACES ESTE SÁBADO?');

  const titleWc = useMemo(() => splitToWordChars(titleText), [titleText]); // string[][]
  const subWc   = useMemo(() => splitToWordChars(subText),   [subText]);

  useEffect(() => {
    if (prefersReduced) return;

    let ctx: any;
    (async () => {
      const gsapMod = await import('gsap');
      const stMod   = await import('gsap/ScrollTrigger');
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!bannerRef.current || !titleRef.current || !subtitleRef.current) return;

      // Selecciona TODOS los caracteres en orden DOM
      const titleChars = titleRef.current.querySelectorAll<HTMLElement>('.char');
      const subChars   = subtitleRef.current.querySelectorAll<HTMLElement>('.char');
      const totalChars = titleChars.length + subChars.length;

      // Duración del pin (en px de scroll) basada en nº de caracteres
      const isSmall  = window.matchMedia('(max-width: 640px)').matches;
      const perChar  = isSmall ? 10 : 14;
      const minPin   = Math.max(window.innerHeight * 1.05, 700);
      const endDist  = Math.max(minPin, totalChars * perChar);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: bannerRef.current!,
            start: () => `top top+=${headerH}`,   // compensa navbar fija
            end:   () => `+=${Math.round(endDist)}`,
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // markers: true,
          },
        });

        tl.to(titleChars, {
          opacity: 1,
          y: 0,
          stagger: { each: 0.02, from: 'start' },
          duration: 0.6,
        }, 0);

        tl.to(subChars, {
          opacity: 1,
          y: 0,
          stagger: { each: 0.02, from: 'start' },
          duration: 0.6,
        }, '>-0.15');

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh);
        document.fonts?.ready?.then(refresh);
        setTimeout(refresh, 50);
      }, bannerRef);
    })();

    return () => ctx?.revert?.();
  }, [prefersReduced, headerH, titleWc.length, subWc.length]);

  return (
    <section
      ref={bannerRef}
      className="relative w-full overflow-hidden min-h-screen flex items-center justify-center bg-black"
      style={{ minHeight: '100svh' }}
      aria-label={t('memories.banner.aria', 'Sección de apertura de Recuerdos')}
    >
      {/* Imagen LCP */}
      <img
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center px-4">
        {/* TÍTULO — palabra con wrap protegido + letras animables */}
        <h1
          ref={titleRef}
          className="
            font-extrabold text-white uppercase leading-tight
            text-[clamp(2rem,6vw,4.5rem)] tracking-tight select-none
          "
        >
          {titleWc.map((word, wi) => (
            <span key={`w-${wi}`} className="word inline-block whitespace-nowrap mr-[0.28em]">
              {word.map((ch, ci) => (
                <span
                  key={`t-${wi}-${ci}`}
                  className="char inline-block opacity-0 translate-y-12 transform-gpu"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* SUBTÍTULO — mismo patrón */}
        <p
          ref={subtitleRef}
          className="
            mt-6 font-semibold text-yellow-400 uppercase
            text-[clamp(1.25rem,3.5vw,2rem)] tracking-wide select-none
          "
        >
          {subWc.map((word, wi) => (
            <span key={`sw-${wi}`} className="word inline-block whitespace-nowrap mr-[0.24em]">
              {word.map((ch, ci) => (
                <span
                  key={`s-${wi}-${ci}`}
                  className="char inline-block opacity-0 translate-y-8 transform-gpu"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default BannerMemories;
