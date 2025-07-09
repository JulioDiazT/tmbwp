// src/components/ImpactMetrics.tsx
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation, Variants } from 'framer-motion'

// Iconos de lucide-react (aceptan className y style)
import {
  MapPin,
  Wrench,
  Users,
  Cloud,
  Activity,
  Mic2,
  type LucideIcon
} from 'lucide-react'

interface Metric {
  labelKey: string
  value: number
  suffix?: string
  color: string
  Icon: LucideIcon
}

const METRICS: Metric[] = [
  { labelKey: 'metrics.rides',     value: 20,  suffix: '',   color: '#E30613', Icon: MapPin   },
  { labelKey: 'metrics.workshops', value: 12,  suffix: '',   color: '#6EB44E', Icon: Wrench   },
  { labelKey: 'metrics.people',    value: 200, suffix: '',   color: '#FFDE00', Icon: Users    },
  { labelKey: 'metrics.co2',       value: 1,   suffix: ' t', color: '#0B213F', Icon: Cloud    },
  { labelKey: 'metrics.km',        value: 200, suffix: ' km',color: '#8C2EFF', Icon: Activity },
  { labelKey: 'metrics.speakers',  value: 12,  suffix: '',   color: '#0075FF', Icon: Mic2     },
]

export default function ImpactMetrics() {
  const { t } = useTranslation()
  const controls = useAnimation()
  const { ref, inView } = useInView({ threshold: 0.2 })

  // Cuando inView cambia, disparamos la animación de entrada/salida
  useEffect(() => {
    controls.start(inView ? 'visible' : 'hidden')
  }, [inView, controls])

  const container: Variants = {
    hidden:  { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.12, ease: 'easeOut', duration: 0.6 }
    }
  }

  const item: Variants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold uppercase font-rubikOne text-andesnavy">
          {t('metrics.title')}
        </h2>

        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
          initial="hidden"
          animate={controls}
          variants={container}
        >
          {METRICS.map(({ labelKey, value, suffix, color, Icon }) => (
            <motion.li
              key={labelKey}
              className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-200"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              {/* Icono */}
              <Icon
                size={48}
                className="mb-4 transition-colors duration-200 group-hover:text-white"
                style={{ color: inView ? color : '#bbb' }}
              />

              {/* Número animado (arranca solo cuando inView===true) */}
              <AnimatedNumber
                className="text-5xl font-extrabold transition-colors duration-200"
                style={{ color: inView ? color : '#444' }}
                value={value}
                suffix={suffix}
                duration={2}
                start={inView}
              />

              {/* Etiqueta */}
              <span
                className="mt-2 text-lg font-semibold uppercase transition-colors duration-200 group-hover:text-[inherit]"
                style={{ color: inView ? color : '#666' }}
              >
                {t(labelKey)}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------
   Componente para animar el número de 0 al valor final,
   soltando el interval hasta que `start` sea true.
------------------------------------------------------------ */
interface AniNumProps {
  value: number
  duration: number  // duración en segundos
  suffix?: string
  className?: string
  style?: React.CSSProperties
  start: boolean      // nuevo prop
}
function AnimatedNumber({
  value,
  duration,
  suffix = '',
  className = '',
  style,
  start
}: AniNumProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!start) return  // no arrancar antes del scroll
    let current = 0
    const totalMs = duration * 1000
    const stepMs = Math.max(16, totalMs / Math.max(value, 1))
    const increment = value / (totalMs / stepMs)

    const id = setInterval(() => {
      current += increment
      if (current >= value) {
        clearInterval(id)
        current = value
      }
      setDisplay(Math.round(current))
    }, stepMs)

    return () => clearInterval(id)
  }, [value, duration, start])

  return (
    <span className={className} style={style}>
      {value >= 100 ? '+' : ''}
      {display}
      {suffix}
    </span>
  )
}
