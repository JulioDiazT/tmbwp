// src/components/MemoriesTimeline.tsx
import { FC, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import img2019 from '../assets/2019.jpg'
import img2024 from '../assets/2024.jpg'
import imgUDA  from '../assets/uda.jpg'
import imgPartners from '../assets/partners.jpg'

gsap.registerPlugin(ScrollTrigger)

interface Hito { key: string; img: string }
const HITOS: Hito[] = [
  { key: '2019',     img: img2019    },
  { key: '2024',     img: img2024    },
  { key: 'uda',      img: imgUDA     },
  { key: 'partners', img: imgPartners }
]

const MemoriesTimeline: FC = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      container
        .querySelectorAll<HTMLDivElement>('.hito-item')
        .forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            },
            x: i % 2 === 0 ? -150 : 150,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
          })
        })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 bg-gray-100" ref={containerRef}>
      <div className="mx-auto max-w-5xl px-4 space-y-16">
        {HITOS.map((hito, i) => {
          const data = t(`memories.timeline.${hito.key}`, { returnObjects: true }) as {
            year: string
            title: string
            desc: string
          }

          return (
            <div
              key={hito.key}
              className={`hito-item flex flex-col md:flex-row items-center gap-8 ${
                i % 2 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <img
                src={hito.img}
                alt={data.title}
                className="w-full md:w-1/2 h-60 object-cover rounded-lg shadow-lg"
              />
              <div className="md:w-1/2 text-center md:text-left">
                <span className="text-primary font-bold text-lg">{data.year}</span>
                <h3 className="mt-2 text-2xl font-semibold text-andesnavy">{data.title}</h3>
                <p className="mt-2 text-gray-700">{data.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MemoriesTimeline
