// src/components/VoluntarioPositions.tsx
import { FC } from 'react'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'

import designerImg     from '../assets/v2.svg'
import commsImg        from '../assets/v3.svg'
import architectImg    from '../assets/v4.svg'
import sociologistImg  from '../assets/v1.svg'

const APPLICATION_URL = 'https://forms.gle/Mqe39FNQYuGmMSDM8'

const POSITIONS = [
  { key: 'designer',    img: designerImg    },
  { key: 'comms',       img: commsImg       },
  { key: 'architect',   img: architectImg   },
  { key: 'sociologist', img: sociologistImg }
] as const

const container: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const item: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export const VoluntarioPositions: FC = () => {
  const { t } = useTranslation()
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="py-24 bg-gray-100">
      {/* Título */}
      <div className="mx-auto max-w-7xl px-4 text-center mb-12">
        <h2 className="uppercase text-3xl md:text-4xl font-extrabold text-andesnavy">
          {t('volunteer.positionsTitle')}
        </h2>
      </div>

      {/* Grid de tarjetas */}
      <motion.div
        className="mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl px-4"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={container}
      >
        {POSITIONS.map(({ key, img }) => (
          <motion.div
            key={key}
            variants={item}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
          >
            {/* Imagen con mayor altura */}
            <img
              src={img}
              alt={key}
              className="w-full h-80 object-cover"
            />

            {/* Contenido */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="uppercase text-xl font-semibold text-andesnavy mb-2 flex-grow">
                {t(`volunteer.positions.${key}.title`)}
              </h3>
              <p className="text-gray-700 mb-6 flex-grow">
                {t(`volunteer.positions.${key}.desc`)}
              </p>
              <a
                href={APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('volunteer.positions.cta')}
                className="mt-auto inline-block text-sm font-semibold uppercase tracking-wide text-primary border-2 border-primary px-4 py-2 rounded-full transition-transform hover:scale-105 hover:bg-primary hover:text-white text-center"
              >
                {t('volunteer.positions.cta')}
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default VoluntarioPositions
