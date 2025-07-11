// src/components/BannerVolunteering.tsx
import { FC, useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import bannerImg from '../assets/vbanner.png'

const container: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
}

export const BannerVolunteering: FC = () => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      className="relative h-[90vh] min-h-[500px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-0 max-w-3xl"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={container}
      >
        <h1 className="uppercase font-rubikOne text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4">
          {t('volunteer.banner.title')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90">
          {t('volunteer.banner.subtitle')}
        </p>
      </motion.div>
    </section>
  )
}

export default BannerVolunteering
