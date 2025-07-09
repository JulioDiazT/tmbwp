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
    once: false
  });

  const variants: Variants = {
    hidden:  { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      id="mission"
      className="
        py-16
        bg-white
        min-h-[80vh]
        flex           /* 1. convertimos en flex container */
        items-center   /* 2. centramos verticalmente */
        justify-center /* opcional: si quieres centrar también horizontalmente */
      "
    >
      <motion.div
        ref={ref}
        className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6"
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p
          className="
            font-bebas uppercase
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            text-andesnavy
            leading-snug
            text-center
            tracking-wide
            break-words
            select-none
            font-bold
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
