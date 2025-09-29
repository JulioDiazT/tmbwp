// src/components/AboutUsSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Imágenes de categoría (lado derecho cuando no hay testimonio)
import t1 from '../assets/t1.png';
import t2 from '../assets/t2.png';
import t3 from '../assets/t3.png';

// Avatares de testimonios
import pia from '../assets/pia.png';
import daniela from '../assets/dani.png';
import adrian from '../assets/adri.png';

type CategoryKey = 'ride' | 'learn' | 'change';

type Category = {
  key: CategoryKey;
  color: string;
  categoryImg: string;
  testimonialImg: string;
};

const CATEGORIES: Category[] = [
  { key: 'ride',   color: '#D2042D', categoryImg: t1, testimonialImg: pia     },
  { key: 'learn',  color: '#0075FF', categoryImg: t2, testimonialImg: pia },
  { key: 'change', color: '#6EB44E', categoryImg: t3, testimonialImg: adrian  },
];

export default function AboutUsSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState<CategoryKey | null>(null);

  return (
    <section id="about" className="bg-white w-screen overflow-hidden">
      {/* TÍTULO PRINCIPAL (MUY GRANDE) */}
      <div className="w-screen px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <h2
          className="
            text-center text-tmbred font-rubikOne uppercase
            tracking-[0.06em] leading-[0.95]
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl
          "
        >
          {t('about.inviteTitle')}
        </h2>
      </div>

      {CATEGORIES.map((cat) => {
        const isOpen = active === cat.key;

        return (
          <motion.div
            key={cat.key}
            className="relative w-screen overflow-hidden lg:h-[75vh]" // alto consistente en desktop
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* COLUMNA IZQUIERDA: título, texto y botón (limitado a container) */}
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
              <div className="lg:w-1/2">
                <h3
                  className="
                    font-rubikOne font-bold uppercase
                    text-4xl sm:text-5xl lg:text-6xl
                    leading-[0.98] mb-4
                  "
                  style={{ color: cat.color }}
                >
                  {t(`about.cards.${cat.key}.title`)}
                </h3>

                <p className="text-lg md:text-xl text-andesnavy mb-6 font-quicksand leading-relaxed">
                  {t(`about.cards.${cat.key}.desc`)}
                </p>

                <button
                  onClick={() => setActive(isOpen ? null : cat.key)}
                  aria-expanded={isOpen}
                  aria-controls={`testimonial-${cat.key}`}
                  className="
                    inline-block max-w-xs w-full sm:w-auto
                    rounded-full px-6 py-2
                    text-sm md:text-base font-medium
                    transition-transform duration-300 ease-in-out hover:scale-105
                    border-2
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                  "
                  style={
                    isOpen
                      ? { backgroundColor: cat.color, color: '#fff', borderColor: cat.color }
                      : { backgroundColor: 'transparent', color: cat.color, borderColor: cat.color }
                  }
                >
                  {isOpen ? t('about.testimonials.hide') : t('about.testimonials.show')}
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: imagen full-bleed o tarjeta de testimonio */}
            <div
              className={`
                block w-screen
                lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2
                flex justify-center items-start
                px-0
                ${isOpen ? 'pt-6 lg:pt-10' : 'pt-0'}   /* sin padding cuando hay imagen */
                h-full
              `}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    id={`testimonial-${cat.key}`}
                    key="testimonial"
                    className="
                      bg-white rounded-2xl shadow-xl
                      w-[92vw] max-w-md sm:max-w-lg md:max-w-xl
                      p-6 sm:p-8 text-center
                    "
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    {/* Avatar más grande y centrado */}
                    <div
                      className="
                        mx-auto mb-5
                        w-36 h-36 sm:w-40 sm:h-40
                        rounded-full overflow-hidden ring-4 ring-white
                      "
                      style={{ backgroundColor: cat.color }}
                    >
                      <img
                        src={cat.testimonialImg}
                        alt={t(`aboutTestimonials.${cat.key}.name`) as string}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="text-2xl sm:text-3xl font-semibold text-andesnavy mb-2">
                      {t(`aboutTestimonials.${cat.key}.name`)}, {t(`aboutTestimonials.${cat.key}.age`)}
                    </h4>

                    <p className="text-andesnavy/80 text-lg sm:text-xl italic">
                      {t(`aboutTestimonials.${cat.key}.text`)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.img
                    key="categoryImg"
                    src={cat.categoryImg}
                    alt={t(`about.cards.${cat.key}.title`) as string}
                    className="
                      block w-screen lg:w-full
                      h-64 sm:h-80 md:h-96 lg:h-full    /* llena la altura de la fila */
                      object-cover
                    "
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
