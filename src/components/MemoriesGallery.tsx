// src/components/MemoriesGallery.tsx
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Imágenes de ejemplo (sustituye por las tuyas)
import slide1 from "../assets/1.svg";
import slide2 from "../assets/2.svg";
import slide3 from "../assets/3.svg";
import slide4 from "../assets/slide4.svg";

type MomentItem = {
  id: string;
  cover: string;
  dateISO: string;
  titleKey: string;
  excerptKey: string;
  placeKey: string;
  tagKey?: string;
  reviewKey: string;
  altKey?: string;
};

const DEFAULT_ITEMS: MomentItem[] = [
  {
    id: "m1",
    cover: slide1,
    dateISO: "2024-08-17",
    titleKey: "memories.moments.m1.title",
    excerptKey: "memories.moments.m1.excerpt",
    placeKey: "memories.moments.m1.place",
    tagKey: "memories.moments.m1.tag",
    reviewKey: "memories.moments.m1.review",
    altKey: "memories.moments.m1.alt",
  },
  {
    id: "m2",
    cover: slide2,
    dateISO: "2024-07-05",
    titleKey: "memories.moments.m2.title",
    excerptKey: "memories.moments.m2.excerpt",
    placeKey: "memories.moments.m2.place",
    reviewKey: "memories.moments.m2.review",
    altKey: "memories.moments.m2.alt",
  },
  {
    id: "m3",
    cover: slide3,
    dateISO: "2024-05-21",
    titleKey: "memories.moments.m3.title",
    excerptKey: "memories.moments.m3.excerpt",
    placeKey: "memories.moments.m3.place",
    reviewKey: "memories.moments.m3.review",
    altKey: "memories.moments.m3.alt",
  },
  {
    id: "m4",
    cover: slide4,
    dateISO: "2024-03-09",
    titleKey: "memories.moments.m4.title",
    excerptKey: "memories.moments.m4.excerpt",
    placeKey: "memories.moments.m4.place",
    reviewKey: "memories.moments.m4.review",
    altKey: "memories.moments.m4.alt",
  },
];

type Props = {
  items?: MomentItem[];
  titleKey?: string;
  subtitleKey?: string;
};

// Colores de marca (usa los tuyos)
const BRAND = ["#9958fd", "#d6ef0a", "#fe8303"] as const;

// Botón outline que se rellena al hover con el acento
function AccentButton({
  accent,
  children,
  onClick,
  className = "",
  ariaPressed,
}: {
  accent: string;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  ariaPressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={[
        "group relative inline-flex items-center justify-center rounded-full",
        "px-4 py-2 text-sm font-bold transition-colors",
        "border-2 bg-white text-andesnavy",
        "focus:outline-none focus:ring-2 focus:ring-black/20",
        className,
      ].join(" ")}
      style={{ borderColor: accent }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: accent }}
        aria-hidden
      />
      <span className="relative transition-colors group-hover:text-white">
        {children}
      </span>
    </button>
  );
}

const MemoriesGallery: FC<Props> = ({
  items = DEFAULT_ITEMS,
  titleKey = "memories.gallery.title",
  subtitleKey = "memories.gallery.subtitle",
}) => {
  const { t, i18n } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // flechas
  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, []);

  const step = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    return Math.round(el.clientWidth * 0.8);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const NavBtn = ({
    disabled,
    label,
    onClick,
    children,
  }: {
    disabled?: boolean;
    label: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "bg-white text-andesnavy shadow hover:bg-white/90",
        "disabled:opacity-40 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-label={t("memories.carousel.aria", "Our best moments")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-andesnavy font-rubikOne uppercase tracking-tight text-[clamp(1.9rem,4.5vw,3rem)]">
              {t(titleKey)}
            </h2>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
              {t(subtitleKey, "")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <NavBtn
              disabled={!canLeft}
              label={t("memories.carousel.prev", "Previous")}
              onClick={() =>
                scrollerRef.current?.scrollBy({
                  left: -step(),
                  behavior: "smooth",
                })
              }
            >
              ‹
            </NavBtn>
            <NavBtn
              disabled={!canRight}
              label={t("memories.carousel.next", "Next")}
              onClick={() =>
                scrollerRef.current?.scrollBy({
                  left: step(),
                  behavior: "smooth",
                })
              }
            >
              ›
            </NavBtn>
          </div>
        </div>

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <style>
            {`[data-hide-scrollbar]::-webkit-scrollbar{ display:none; }`}
          </style>

          {items.map((m, idx) => {
            const accent = BRAND[idx % BRAND.length];
            const expanded = expandedId === m.id;

            return (
              <motion.article
                key={m.id}
                data-hide-scrollbar
                className="group relative h-[28rem] w-[90vw] shrink-0 snap-center overflow-visible sm:h-[30rem] sm:w-[75vw] lg:h-[32rem] lg:w-[50rem] xl:w-[60rem]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.03 }}
              >
                {/* Contenedor 3D para flip */}
                <div className="relative h-full w-full [perspective:1200px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {!expanded ? (
                      // Cara frontal (cover)
                      <motion.div
                        key="front"
                        className="relative h-full w-full overflow-hidden rounded-[28px] ring-1 ring-black/10 shadow-[0_12px_40px_rgba(0,0,0,.14)] [transform-style:preserve-3d]"
                        style={{ transformOrigin: "center center" }}
                        initial={{ rotateY: -15, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 15, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        {/* hairline superior (encima de la imagen) */}
                        <span
                          className="absolute left-0 right-0 top-0 z-[2] h-[4px] rounded-t-[28px]"
                          style={{ background: accent }}
                          aria-hidden
                        />

                        {/* imagen */}
                        <img
                          src={m.cover}
                          alt={m.altKey ? t(m.altKey) : ""}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* velos para asegurar lectura */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                        {/* etiqueta/tag */}
                        {m.tagKey && (
                          <span
                            className="absolute left-4 top-4 z-[3] rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white/90"
                            style={{ background: `${accent}cc` }}
                          >
                            {t(m.tagKey)}
                          </span>
                        )}

                        {/* contenido inferior */}
                        <div className="absolute inset-x-0 bottom-0 z-[2] p-5 sm:p-7">
                          <h3 className="text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-3xl">
                            {t(m.titleKey)}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-white/90 sm:text-base">
                            {t(m.excerptKey)}
                          </p>

                          {/* chips fecha/lugar */}
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] sm:text-[13px]">
                            <span className="rounded-full bg-black/55 px-2.5 py-1 font-semibold text-white">
                              {formatDate(m.dateISO)}
                            </span>
                            <span className="text-white/70">•</span>
                            <span className="rounded-full bg-black/55 px-2.5 py-1 font-semibold text-white">
                              {t(m.placeKey)}
                            </span>
                          </div>

                          <div className="mt-4">
                            <AccentButton
                              accent={accent}
                              onClick={() => toggle(m.id)}
                              ariaPressed={expanded}
                            >
                              {t("memories.carousel.read", "Leer reseña")}
                            </AccentButton>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // Cara trasera (reseña)
                      <motion.div
                        key="back"
                        className="relative h-full w-full overflow-hidden rounded-[28px] bg-white ring-1 ring-black/10 shadow-[0_12px_40px_rgba(0,0,0,.14)] [transform-style:preserve-3d]"
                        style={{ transformOrigin: "center center" }}
                        initial={{ rotateY: 15, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -15, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        {/* hairline superior también aquí */}
                        <span
                          className="absolute left-0 right-0 top-0 z-[2] h-[4px] rounded-t-[28px]"
                          style={{ background: accent }}
                          aria-hidden
                        />

                        <div className="flex h-full flex-col">
                          <div className="flex items-start justify-between gap-3 border-b border-black/5 p-5 sm:p-6">
                            <div>
                              <h3 className="text-xl font-extrabold text-andesnavy sm:text-2xl">
                                {t(m.titleKey)}
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-andesnavy/70 sm:text-sm">
                                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-semibold">
                                  {formatDate(m.dateISO)}
                                </span>
                                <span>•</span>
                                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-semibold">
                                  {t(m.placeKey)}
                                </span>
                              </div>
                            </div>

                            <AccentButton
                              accent={accent}
                              onClick={() => toggle(m.id)}
                            >
                              {t("memories.carousel.close", "Ocultar reseña")}
                            </AccentButton>
                          </div>

                          <div className="flex-1 overflow-auto p-5 text-[15px] leading-relaxed text-andesnavy sm:p-6">
                            <p className="whitespace-pre-line">{t(m.reviewKey)}</p>
                          </div>

                          <div className="border-t border-black/5 p-5 sm:p-6">
                            <AccentButton
                              accent={accent}
                              onClick={() => toggle(m.id)}
                              className="w-full justify-center"
                            >
                              {t("memories.carousel.close", "Ocultar reseña")}
                            </AccentButton>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MemoriesGallery;
