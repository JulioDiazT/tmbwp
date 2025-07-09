/* src/components/AboutMissionQuote.tsx */
import { FC } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const AboutMissionQuote: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="mission" className="py-16 bg-white">
      <motion.div
        className="container mx-auto px-12 sm:px-32 lg:px-32 "
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p
          className="
            font-bebas uppercase
            text-4xl md:text-5xl
            text-andesnavy
leading-tight
  text-center
            tracking-wide
            select-none
          "
        >
          {/* PRE */}
          <span>{t('mission.pre')}</span>{''}
          {/* CITIES */}
          <span className="highlight highlight--blue leading-tight  → 1.375

  ">
            {t('mission.cities')}
          </span>
          ,{' '}
          {/* MID */}
          <span>{t('mission.mid')}</span>{' '}
          {/* PEDAL */}
          <span className="highlight highlight--blue leading-tight">
            {t('mission.pedal')}
          </span>
          .
        </p>
      </motion.div>
    </section>
  );
};

export default AboutMissionQuote;
