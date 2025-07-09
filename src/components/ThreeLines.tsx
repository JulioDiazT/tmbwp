// src/components/ThreeLines.tsx
import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export const ThreeLines: FC = () => {
  const { t } = useTranslation();

  // Colores para cada línea
  const colors = ['text-primary', 'text-tmbgreen', 'text-andesnavy'] as const;
  const keys = ['mobility', 'community', 'city'] as const;

  return (
    <section id="three-lines" className="py-20 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        {keys.map((key, i) => (
          <motion.h2
            key={key}
            className={`
              w-full
              font-rubikOne
              uppercase
              text-center
              ${colors[i]}
              text-6xl sm:text-7xl md:text-8xl lg:text-9xl
              leading-snug
              mt-16
            `}
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1, delay: i * 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
          >
            {t(`three.${key}`)}
          </motion.h2>
        ))}
      </div>
    </section>
  );
};

export default ThreeLines;
