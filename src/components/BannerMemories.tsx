import { FC, useEffect, useMemo, useRef, useState } from "react";
import heroImg from "../assets/banner-recuerdos.svg";
import { useTranslation } from "react-i18next";

// Respeta reduced motion
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

// Divide texto en palabras→caracteres
const splitToWordChars = (text: string) =>
  text.trim().split(/\s+/).map(w => [...w]);

const BannerMemories: FC = () => {
  const { t } = useTranslation();
  const bannerRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Altura del header fijo para compensar el pin
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

  const titleText = t("memories.banner.title", "EVERY MEMORABLE JOURNEY BEGINS WITH A…");
  const subText   = t("memories.banner.subtitle", "What are you up to this Saturday?");
  const titleWc = useMemo(() => splitToWordChars(titleText), [titleText]);
  const subWc   = useMemo(() => splitToWordChars(subText),   [subText]);

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!bannerRef.current || !titleRef.current || !subtitleRef.current) return;

      const titleChars = titleRef.current.querySelectorAll<HTMLElement>(".char");
      const subChars   = subtitleRef.current.querySelectorAll<HTMLElement>(".char");
      const totalChars = titleChars.length + subChars.length;

      const isSmall = window.matchMedia("(max-width: 640px)").matches;
      const perChar = isSmall ? 10 : 14;
      const minPin  = Math.max(window.innerHeight * 1.05, 700);
      const endDist = Math.max(minPin, totalChars * perChar);

      ctx = gsap.context(() => {
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
        tl.to(subChars,   { opacity: 1, y: 0, stagger: { each: 0.02, from: "start" }, duration: 0.6 }, ">-0.15");

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        // @ts-ignore
        document.fonts?.ready?.then(refresh);
        setTimeout(refresh, 50);
      }, bannerRef);
    })();

    return () => ctx?.revert?.();
  }, [prefersReduced, headerH, titleWc.length, subWc.length]);

  return (
    <section
      ref={bannerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
      style={{ minHeight: "100svh" }}
      aria-label={t("memories.banner.aria", "Memories – Opening")}
    >
      <img
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 px-4 text-center">
        <h1
          ref={titleRef}
          className="select-none font-extrabold uppercase leading-tight text-white tracking-tight
                     text-[clamp(2rem,6vw,4.5rem)]"
        >
          {titleWc.map((word, wi) => (
            <span key={`w-${wi}`} className="mr-[0.28em] inline-block whitespace-nowrap">
              {word.map((ch, ci) => (
                <span
                  key={`t-${wi}-${ci}`}
                  className="char inline-block translate-y-12 transform-gpu opacity-0"
                  style={{ willChange: "transform, opacity" }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 select-none font-semibold uppercase text-yellow-400 tracking-wide
                     text-[clamp(1.25rem,3.5vw,2rem)]"
        >
          {subWc.map((word, wi) => (
            <span key={`sw-${wi}`} className="mr-[0.24em] inline-block whitespace-nowrap">
              {word.map((ch, ci) => (
                <span
                  key={`s-${wi}-${ci}`}
                  className="char inline-block translate-y-8 transform-gpu opacity-0"
                  style={{ willChange: "transform, opacity" }}
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
