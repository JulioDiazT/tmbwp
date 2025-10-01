// src/components/AboutUsSection.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePreloadOnIntersect } from "../hooks/usePreloadOnIntersect";

// Assets (ajusta rutas si cambian)
import t1 from "../assets/t1.png";
import t2 from "../assets/t2.png";
import t3 from "../assets/t3.png";
import pia from "../assets/pia.svg";
import adrian from "../assets/adri.svg";
import mateo from "../assets/mateo.svg";

type Key = "ride" | "learn" | "change";
type Card = {
  key: Key;
  img: string;
  avatar: string;
  accent: string;
  ribbon: [string, string];
};

const CARDS: Card[] = [
  {
    key: "ride",
    img: t1,
    avatar: mateo,
    accent: "#9958fd",              // púrpura
    ribbon: ["#eadbff", "#f6f0ff"], // suaves a juego
  },
  {
    key: "learn",
    img: t2,
    avatar: pia,
    accent: "#d6ef0a",              // lima
    ribbon: ["#f0f8b3", "#f8fde0"],
  },
  {
    key: "change",
    img: t3,
    avatar: adrian,
    accent: "#fe8303",              // naranja
    ribbon: ["#ffd9b3", "#fff2e3"],
  },
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

  // Precarga anticipada para evitar flashes
  const preloadRef = usePreloadOnIntersect(
    useMemo(() => [t1, t2, t3, pia, adrian, mateo], []),
    { rootMargin: "1000px 0px", once: true }
  );

  // Modal/spotlight de testimonio
  const [active, setActive] = useState<Key | null>(null);
  const open = (k: Key) => setActive(k);
  const close = () => setActive(null);

  // Foco accesible para botón de cerrar
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
      {/* Dispara precarga al aproximarse */}
      <div ref={preloadRef} aria-hidden="true" />

      {/* ── ENCABEZADO: subtítulo arriba, título abajo ───────────────────── */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-6 text-center">
        <p className="mx-auto mb-2 max-w-3xl text-[clamp(.95rem,1.6vw,1.1rem)] tracking-wide text-andesnavy/80 font-quicksand uppercase">
          {t("mission.mid")}
        </p>

        {/* Título con degradado en la nueva paleta */}
        <h2
          className="
            font-rubikOne uppercase tracking-[.06em]
            text-[clamp(2rem,4.8vw,4rem)] leading-tight
            text-transparent bg-clip-text
            bg-gradient-to-r from-[#9958fd] via-[#d6ef0a] to-[#fe8303]
          "
        >
          {t("about.inviteTitle")}
        </h2>
      </header>

      {/* Paneles de sección */}
      <div className="mx-auto max-w-7xl space-y-10 px-0 sm:px-6 md:space-y-14">
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

      {/* Spotlight de testimonio */}
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
  const x = useMotionValue(0);
  const y = useTransform(x, [-100, 100], [-8, 8]); // micro-parallax leve

  return (
    <section id={id} className="relative">
      {/* Fondo tipo ribbon (sin blur) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(1000px 260px at ${mirrored ? "20%" : "80%"} 18%, ${card.ribbon[0]}, transparent 65%),
             radial-gradient(800px 220px at ${mirrored ? "75%" : "25%"} 75%, ${card.ribbon[1]}, transparent 60%)`,
        }}
      />

      <div className="grid items-center gap-6 sm:gap-8 md:gap-10 lg:grid-cols-12 px-4 sm:px-0">
        {/* Texto */}
        <div className={`lg:col-span-5 ${mirrored ? "lg:order-2" : ""}`}>
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
              className="rounded-full px-5 py-2 text-sm font-semibold shadow transition active:translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ background: card.accent, color: "#fff" }}
            >
              {t("about.testimonials.show")}
            </button>
          </div>
        </div>

        {/* Imagen (sin blur) */}
        <div className={`lg:col-span-7 ${mirrored ? "lg:order-1" : ""}`}>
          <motion.div
            className={`relative ${mirrored ? "lg:pr-8" : "lg:pl-8"}`}
            style={{ x, y }}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: -30, right: 30 }}
            dragElastic={0.08}
          >
            <div className="relative rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,.12)]">
              <img
                src={card.img}
                alt=""
                className="block h-[52vh] min-h-[280px] w-full rounded-[2rem] object-cover
                           sm:h-[56vh] md:h-[58vh] lg:h-[60vh]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
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
  const y = useMotionValue(0);
  const opacityBg = useTransform(y, [-200, 0, 200], [0.6, 0.72, 0.6]);

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
      {/* Backdrop (sin blur) */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        style={{ opacity: opacityBg }}
        onClick={close}
      />

      {/* Tarjeta */}
      <motion.div
        className="relative z-10 w-[min(92vw,900px)] overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/10"
        drag="y"
        dragConstraints={{ top: -60, bottom: 60 }}
        dragElastic={0.12}
        style={{ y }}
        onDragEnd={(_, info) => { if (Math.abs(info.offset.y) > 120) close(); }}
        initial={{ scale: 0.96, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        {/* Borde suave */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px]"
          style={{
            padding: 2,
            background: `linear-gradient(135deg, ${card.accent}, rgba(255,255,255,.5), rgba(0,0,0,.08))`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative">
            <img
              src={card.img}
              alt=""
              className="h-64 w-full object-cover md:h-full"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full ring-4 ring-white" style={{ background: card.accent }}>
                <img src={card.avatar} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 id="spotlight-title" className="text-xl font-bold text-andesnavy">
                  {t(`aboutTestimonials.${card.key}.name`)}
                </h3>
                <p className="text-sm text-andesnavy/70">{t(`aboutTestimonials.${card.key}.age`)}</p>
              </div>
            </div>

            <h4
              className="font-rubikOne uppercase leading-tight text-[clamp(1.3rem,2.6vw,1.8rem)] mb-2"
              style={{ color: card.accent }}
            >
              {t(`about.cards.${card.key}.title`)}
            </h4>

            <p className="text-[15px] leading-relaxed text-andesnavy/90 font-quicksand italic">
              {t(`aboutTestimonials.${card.key}.text`)}
            </p>

            <div className="mt-6">
              <button
                ref={focusCloseRef}
                onClick={close}
                className="rounded-full border-2 px-5 py-2 text-sm font-semibold transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: card.accent, color: card.accent }}
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
