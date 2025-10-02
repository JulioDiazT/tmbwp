// src/components/AboutUsSection.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePreloadOnIntersect } from "../hooks/usePreloadOnIntersect";

// Assets
import t1 from "../assets/t1.png";
import t2 from "../assets/t2.png";
import t3 from "../assets/t3.png";
import pia from "../assets/pia.svg";
import adrian from "../assets/adri.svg";
import mateo from "../assets/mateo.svg";

type Key = "ride" | "learn" | "change";
type Card = {
  key: Key;
  img: string;     // imagen de actividad (solo en la tarjeta, no en el modal)
  avatar: string;  // foto/persona para el testimonio
  accent: string;  // color sólido
};

const C1 = "#9958fd"; // morado
const C2 = "#d6ef0a"; // verde
const C3 = "#fe8303"; // naranja

const CARDS: Card[] = [
  { key: "ride",   img: t1, avatar: mateo,  accent: C1 },
  { key: "learn",  img: t2, avatar: pia,    accent: C2 },
  { key: "change", img: t3, avatar: adrian, accent: C3 },
];

function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on(); m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

export default function AboutUsSection() {
  const { t } = useTranslation();
  const reduced = useReduced();

  // Precarga
  const preloadRef = usePreloadOnIntersect(
    useMemo(() => [t1, t2, t3, pia, adrian, mateo], []),
    { rootMargin: "1000px 0px", once: true }
  );

  const [active, setActive] = useState<Key | null>(null);
  const open = (k: Key) => setActive(k);
  const close = () => setActive(null);

  const focusCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active && focusCloseRef.current) focusCloseRef.current.focus();
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative w-full bg-white">
      <div ref={preloadRef} aria-hidden="true" />

      {/* Encabezado limpio */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-6 text-center">
        <h2
          className="
            font-rubikOne uppercase tracking-[.06em]
            text-[clamp(2rem,4.8vw,4rem)] leading-tight
            text-andesnavy
          "
        >
          {t("about.inviteTitle")}
        </h2>
      </header>

      {/* Tarjetas */}
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 md:space-y-14">
        {CARDS.map((c, i) => (
          <PanelRow
            key={c.key}
            id={`showcase-${c.key}`}
            card={c}
            mirrored={i % 2 === 1}
            reduced={reduced}
            onOpen={() => open(c.key)}
          />
        ))}
      </div>

      {/* Modal/Testimonio */}
      <AnimatePresence>
        {active && (
          <Spotlight
            card={CARDS.find(c => c.key === active)!}
            close={close}
            focusCloseRef={focusCloseRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------ PanelRow ------------------------ */

function PanelRow({
  id,
  card,
  mirrored,
  reduced,
  onOpen,
}: {
  id: string;
  card: Card;
  mirrored?: boolean;
  reduced?: boolean;
  onOpen: () => void;
}) {
  const { t } = useTranslation();

  return (
    <section id={id} className="relative">
      <div className="grid items-center gap-6 sm:gap-8 md:gap-10 lg:grid-cols-12">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`lg:col-span-5 ${mirrored ? "lg:order-2" : ""} px-2 sm:px-0`}
        >
          {/* ⬇️ Eliminado el chip “Te invitamos a…” */}
          <h3
            className="font-rubikOne uppercase leading-[0.98] text-[clamp(1.8rem,4vw,3rem)] mb-3"
            style={{ color: card.accent }}
          >
            {t(`about.cards.${card.key}.title`)}
          </h3>

          <p className="text-[clamp(1rem,1.7vw,1.2rem)] text-andesnavy/90 leading-relaxed font-quicksand">
            {t(`about.cards.${card.key}.desc`)}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpen}
              className="rounded-full px-5 py-2 text-sm font-semibold transition active:translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: card.accent,
                color: "#fff",
                boxShadow: `0 8px 24px ${card.accent}33`,
              }}
            >
              {t("about.testimonials.show")}
            </button>
          </div>
        </motion.div>

        {/* Imagen — sin BORDES/rings (adiós reborde celeste) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className={`lg:col-span-7 ${mirrored ? "lg:order-1" : ""}`}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,.12)]">
            {/* Eliminada la franja superior de color */}
            <img
              src={card.img}
              alt=""
              className="block h-[52vh] min-h-[280px] w-full object-cover
                         sm:h-[56vh] md:h-[58vh] lg:h-[60vh]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------ Spotlight (Modal de testimonio) ------------------------ */

function Spotlight({
  card,
  close,
  focusCloseRef,
}: {
  card: Card;
  close: () => void;
  focusCloseRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="spotlight-title"
    >
      {/* Backdrop sólido */}
      <div className="absolute inset-0 bg-black/70" onClick={close} aria-hidden />

      {/* Tarjeta: FOTO GRANDE a la IZQUIERDA, texto a la derecha */}
      <motion.div
        className="relative z-10 w-[min(94vw,980px)] overflow-hidden rounded-[28px] bg-white shadow-2xl border-2"
        style={{ borderColor: card.accent }}
        initial={{ scale: 0.96, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Columna izquierda: retrato grande */}
          <div className="md:col-span-2 p-6 sm:p-8 bg-white">
            <div
              className="w-full aspect-square rounded-2xl overflow-hidden border-2"
              style={{ borderColor: card.accent }}
            >
              <img
                src={card.avatar}
                alt={t(`aboutTestimonials.${card.key}.name`) || ""}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* Columna derecha: nombre/edad + título + testimonio + cerrar */}
          <div className="md:col-span-3 p-6 sm:p-8">
            <div className="mb-4">
              <h3 id="spotlight-title" className="text-2xl font-bold text-andesnavy">
                {t(`aboutTestimonials.${card.key}.name`)}
              </h3>
              <p className="text-sm text-andesnavy/70">
                {t(`aboutTestimonials.${card.key}.age`)}
              </p>
            </div>

            <h4
              className="font-rubikOne uppercase leading-tight text-[clamp(1.2rem,2.2vw,1.6rem)] mb-2"
              style={{ color: card.accent }}
            >
              {t(`about.cards.${card.key}.title`)}
            </h4>

            <p className="text-[16px] md:text-[17px] leading-relaxed text-andesnavy/90 font-quicksand italic">
              {t(`aboutTestimonials.${card.key}.text`)}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                ref={focusCloseRef}
                onClick={close}
                className="rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  border: `2px solid ${card.accent}`,
                  color: card.accent,
                  background: "#fff",
                }}
              >
                {t("about.testimonials.hide")}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
