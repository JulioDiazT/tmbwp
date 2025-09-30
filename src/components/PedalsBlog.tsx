// src/components/PedalsBlog.tsx
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Imágenes demo
import slide1 from "../assets/slide1.svg";
import slide2 from "../assets/slide2.svg";
import slide3 from "../assets/slide3.svg";

type PedalCard = {
  id: string;
  image: string;
  titleKey: string;    // i18n
  bodyKey: string;     // i18n (resumen)
  detailsKey?: string; // i18n (reseña ampliada)
  altKey?: string;     // i18n alt
  // igUrl?: string;   // ← si lo tenías, ya no se usa
};

const DEFAULT_ITEMS: PedalCard[] = [
  {
    id: "uda",
    image: slide1,
    titleKey: "memories.pedals.uda.title",
    bodyKey:  "memories.pedals.uda.body",
    detailsKey:"memories.pedals.uda.details",
    altKey:   "memories.pedals.uda.alt"
  },
  {
    id: "lab",
    image: slide2,
    titleKey: "memories.pedals.lab.title",
    bodyKey:  "memories.pedals.lab.body",
    detailsKey:"memories.pedals.lab.details",
    altKey:   "memories.pedals.lab.alt"
  },
  {
    id: "med",
    image: slide3,
    titleKey: "memories.pedals.med.title",
    bodyKey:  "memories.pedals.med.body",
    detailsKey:"memories.pedals.med.details",
    altKey:   "memories.pedals.med.alt"
  },
];

type Props = { items?: PedalCard[] };

const PedalsBlog: FC<Props> = ({ items = DEFAULT_ITEMS }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <section
      className="bg-gray-50 py-16 sm:py-20"
      aria-label={t("memories.pedals.aria", "Our pedals: projects and milestones")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10 text-center">
          <h2 className="text-andesnavy font-extrabold uppercase tracking-tight text-[clamp(1.8rem,4.5vw,3rem)]">
            {t("memories.pedals.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
            {t("memories.pedals.subtitle")}
          </p>
        </header>

        <motion.ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
        >
          {items.map((card) => {
            const expanded = expandedId === card.id;
            return (
              <motion.li
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
              >
                <article
                  className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  aria-expanded={expanded}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {!expanded ? (
                      // ---------- Vista tarjeta ----------
                      <motion.div
                        key="card"
                        className="flex h-full flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.altKey ? t(card.altKey) : ""}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                          <h3 className="text-andesnavy text-xl sm:text-2xl font-extrabold">
                            {t(card.titleKey)}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-700">
                            {t(card.bodyKey)}
                          </p>

                          <div className="mt-auto pt-2">
                            <button
                              type="button"
                              onClick={() => toggle(card.id)}
                              aria-pressed={expanded}
                              className="inline-flex w-full items-center justify-center rounded-full border-2 border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                              {t("memories.pedals.openDetails")}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // ---------- Vista reseña ----------
                      <motion.div
                        key="details"
                        className="flex h-full flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-black/5">
                          <h3 className="text-gray-900 text-xl sm:text-2xl font-extrabold">
                            {t(card.titleKey)}
                          </h3>
                       
                        </div>

                        <div className="flex-1 overflow-auto p-5 sm:p-6 text-sm sm:text-base leading-relaxed text-gray-800">
                          <p className="whitespace-pre-line">
                            {t(card.detailsKey || card.bodyKey)}
                          </p>
                        </div>

                        <div className="border-t border-black/5 p-5 sm:p-6">
                          <button
                            type="button"
                            onClick={() => toggle(card.id)}
                            className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/40"
                          >
                            {t("memories.pedals.closeDetails")}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};

export default PedalsBlog;
