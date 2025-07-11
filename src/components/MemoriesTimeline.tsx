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
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - containerRef.current!.clientWidth

      const horizontal = gsap.to(trackRef.current, {
        x: () => -distance,
        ease: 'none',
        scrollTrigger: {
          id: 'memories-h-scroll',
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      })

      gsap.utils.toArray<HTMLDivElement>('.hito-item').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          scrollTrigger: {
            trigger: el,
            containerAnimation: horizontal,
            start: 'left center'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 bg-gray-100" ref={containerRef}>
      <div ref={trackRef} className="flex w-max">
        {HITOS.map((hito) => {
          const data = t(`memories.timeline.${hito.key}`, {
            returnObjects: true
          }) as {
            year: string
            title: string
            desc: string
          }

          return (
            <div
              key={hito.key}
              className="hito-item flex-none w-screen px-6 flex flex-col md:flex-row items-center gap-8"
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
