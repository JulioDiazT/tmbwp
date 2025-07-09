// src/components/AboutUsSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import t1 from '../assets/t1.png';
import t2 from '../assets/t2.png';
import t3 from '../assets/t3.png';
import julio from '../assets/julio.png';
import daniela from '../assets/dani.png';
import adrian from '../assets/adri.png';

type Category = {
  key: string;
  color: string;
  categoryImg: string;
  testimonialImg: string;
};

const CATEGORIES: Category[] = [
  { key: 'ride',  color: '#D2042D', categoryImg: t1, testimonialImg: julio },
  { key: 'learn', color: '#0075FF', categoryImg: t2, testimonialImg: daniela },
  { key: 'change',color: '#6EB44E',categoryImg: t3, testimonialImg: adrian },
];

export default function AboutUsSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="about" className="bg-white w-full">
      {CATEGORIES.map(cat => {
        const isOpen = active === cat.key;
        return (
          <motion.div
            key={cat.key}
            className="
              flex flex-col lg:flex-row
              items-stretch
              max-w-screen-xl mx-auto
              px-4 sm:px-6 lg:px-0
              min-h-[80vh]
            "
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* IZQUIERDA */}
            <div className="w-full lg:w-1/2 lg:pr-8 flex flex-col justify-center">
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-rubikOne"
                style={{ color: cat.color }}
              >
                {t(`about.cards.${cat.key}.title`)}
              </h2>
              <p className="text-lg md:text-xl text-andesnavy mb-6 font-quicksand">
                {t(`about.cards.${cat.key}.desc`)}
              </p>
              <button
                onClick={() => setActive(isOpen ? null : cat.key)}
                className="
                  inline-block max-w-xs w-full sm:w-auto
                  rounded-full px-6 py-2
                  text-sm md:text-base font-medium
                  transition-transform duration-300 ease-in-out hover:scale-105
                  border-2
                "
                style={
                  isOpen
                    ? {
                        backgroundColor: cat.color,
                        color: '#fff',
                        borderColor: cat.color,
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: cat.color,
                        borderColor: cat.color,
                      }
                }
              >
                {isOpen
                  ? t('about.testimonials.hide')
                  : t('about.testimonials.show')}
              </button>
            </div>

            {/* DERECHA */}
            <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0 ">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="testimonial"
                    className="
                      bg-white rounded-xl shadow-lg
                      py-2 px-2
                      max-w-xs
                      pr-0 mr-0
                      flex flex-col items-center justify-center
                    "
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <div
                      className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4"
                      style={{ backgroundColor: cat.color }}
                    >
                      <img
                        src={cat.testimonialImg}
                        alt={t(`aboutTestimonials.${cat.key}.name`)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-andesnavy mb-2">
                      {t(`aboutTestimonials.${cat.key}.name`)},{' '}
                      {t(`aboutTestimonials.${cat.key}.age`)}
                    </h3>
                    <p className="text-center text-gray-800 text-2xl md:text-1 font-style: italic">
                      {t(`aboutTestimonials.${cat.key}.text`)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.img
                    key="categoryImg"
                    src={cat.categoryImg}
                    alt={t(`about.cards.${cat.key}.title`)}
                    className="w-full h-full object-cover pr-0"
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
