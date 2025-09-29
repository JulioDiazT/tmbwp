// src/components/Phrase.tsx
import { FC, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Phrase: FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    amount: 0.2,
    margin: '-100px',
    once: false,
  });

  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="mission"
      className="
        bg-white
        w-full
        min-h-[80vh]
        px-4 sm:px-8 lg:px-12

        /* === ¡CLAVES! si el padre es grid === */
        [grid-column:1/-1]         /* ocupa todas las columnas del grid del padre */
        [justify-self:center]      /* si el padre es grid, centra este item */

        /* === fallback si el padre es flex o block === */
        grid place-items-center    /* centra el hijo (motion.div) v+h */
      "
    >
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="
          w-full
          max-w-7xl                 /* ancho máximo del bloque */
          mx-auto                   /* centra el bloque si el padre es block/flex */
        "
      >
        <p
          className="
            font-bebas uppercase font-bold select-none
            text-andesnavy tracking-wide leading-tight
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            text-center
            break-words
            max-w-[72ch] mx-auto    /* centra el texto si limitas el ancho de lectura */
          "
        >
          <span>{t('mission.pre')}</span>{' '}
          <span className="text-tmbyellow">{t('mission.cities')}</span>,{' '}
          <span>{t('mission.mid')}</span>{' '}
          <span className="text-tmbyellow">{t('mission.pedal')}</span>.
        </p>
      </motion.div>
    </section>
  );
};

export default Phrase;
