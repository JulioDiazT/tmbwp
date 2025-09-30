import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Reemplaza por tus imágenes reales
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
  { id: "m1", cover: slide1, dateISO: "2024-08-17",
    titleKey: "memories.moments.m1.title",
    excerptKey: "memories.moments.m1.excerpt",
    placeKey: "memories.moments.m1.place",
    tagKey: "memories.moments.m1.tag",
    reviewKey: "memories.moments.m1.review",
    altKey: "memories.moments.m1.alt" },
  { id: "m2", cover: slide2, dateISO: "2024-07-05",
    titleKey: "memories.moments.m2.title",
    excerptKey: "memories.moments.m2.excerpt",
    placeKey: "memories.moments.m2.place",
    reviewKey: "memories.moments.m2.review",
    altKey: "memories.moments.m2.alt" },
  { id: "m3", cover: slide3, dateISO: "2024-05-21",
    titleKey: "memories.moments.m3.title",
    excerptKey: "memories.moments.m3.excerpt",
    placeKey: "memories.moments.m3.place",
    reviewKey: "memories.moments.m3.review",
    altKey: "memories.moments.m3.alt" },
  { id: "m4", cover: slide4, dateISO: "2024-03-09",
    titleKey: "memories.moments.m4.title",
    excerptKey: "memories.moments.m4.excerpt",
    placeKey: "memories.moments.m4.place",
    reviewKey: "memories.moments.m4.review",
    altKey: "memories.moments.m4.alt" },
];

type Props = {
  items?: MomentItem[];
  titleKey?: string;
  subtitleKey?: string;
};

const btnBase =
  "inline-flex items-center justify-center rounded-full bg-white/90 text-gray-900 px-3 py-2 text-sm font-semibold shadow backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/40";

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
    new Date(iso).toLocaleDateString(i18n.language, { year: "numeric", month: "short", day: "2-digit" });

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <section className="bg-white py-16 sm:py-20" aria-label={t("memories.carousel.aria", "Our best moments")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-andesnavy font-extrabold uppercase tracking-tight text-[clamp(1.8rem,4.5vw,3rem)]">
              {t(titleKey)}
            </h2>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
              {t(subtitleKey, "")}
            </p>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              aria-label={t("memories.carousel.prev", "Previous")}
              onClick={() => scrollerRef.current?.scrollBy({ left: -step(), behavior: "smooth" })}
              disabled={!canLeft}
              className={btnBase + " disabled:cursor-not-allowed disabled:opacity-50"}
            >
              ‹
            </button>
            <button
              aria-label={t("memories.carousel.next", "Next")}
              onClick={() => scrollerRef.current?.scrollBy({ left: step(), behavior: "smooth" })}
              disabled={!canRight}
              className={btnBase + " disabled:cursor-not-allowed disabled:opacity-50"}
            >
              ›
            </button>
          </div>
        </div>

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <style>{`[data-hide-scrollbar]::-webkit-scrollbar{ display:none; }`}</style>

          {items.map((m, idx) => {
            const expanded = expandedId === m.id;
            return (
              <motion.article
                key={m.id}
                data-hide-scrollbar
                className="relative h-[28rem] w-[90vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                           sm:h-[30rem] sm:w-[75vw] lg:h-[32rem] lg:w-[50rem] xl:w-[60rem]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.03 }}
                aria-expanded={expanded}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {!expanded ? (
                    <motion.div
                      key="cover"
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <img
                        src={m.cover}
                        alt={m.altKey ? t(m.altKey) : ""}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 800px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

                      {m.tagKey && (
                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur">
                          {t(m.tagKey)}
                        </span>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <h3 className="text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-3xl">
                          {t(m.titleKey)}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-white/90 sm:text-base">
                          {t(m.excerptKey)}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/85 sm:text-xs">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 backdrop-blur">
                            {formatDate(m.dateISO)}
                          </span>
                          <span>•</span>
                          <span>{t(m.placeKey)}</span>
                        </div>

                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => toggle(m.id)}
                            aria-pressed={expanded}
                            className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/40"
                          >
                            {t("memories.carousel.read", "Read review")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="review"
                      className="absolute inset-0 bg-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex h-full flex-col">
                        <div className="flex items-start justify-between gap-3 border-b border-black/5 p-5 sm:p-6">
                          <div>
                            <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                              {t(m.titleKey)}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:text-sm">
                              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                                {formatDate(m.dateISO)}
                              </span>
                              <span>•</span>
                              <span>{t(m.placeKey)}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggle(m.id)}
                            aria-pressed={expanded}
                            className="rounded-full border-2 border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          >
                            {t("memories.carousel.close", "Close")}
                          </button>
                        </div>

                        <div className="flex-1 overflow-auto p-5 text-sm leading-relaxed text-gray-800 sm:p-6 sm:text-base">
                          <p className="whitespace-pre-line">{t(m.reviewKey)}</p>
                        </div>

                        <div className="border-t border-black/5 p-5 sm:p-6">
                          <button
                            type="button"
                            onClick={() => toggle(m.id)}
                            className="w-full rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/40"
                          >
                            {t("memories.carousel.close", "Close")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MemoriesGallery;
