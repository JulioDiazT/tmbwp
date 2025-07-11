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
    if (!containerRef.current) return

    const sections = gsap.utils.toArray<HTMLDivElement>('.hito-item')

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${containerRef.current!.offsetWidth * sections.length}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        id: 'timeline'
      }
    })

    sections.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: el,
          containerAnimation: ScrollTrigger.getById('timeline')?.animation as gsap.core.Animation,
          start: 'left center',
          end: 'right center',
          scrub: true
        }
      })
    })
  }, [])

  return (
    <section ref={containerRef} className="timeline-section h-screen bg-gray-100 overflow-hidden">
      <div className="timeline-wrapper flex h-full">
        {HITOS.map((hito) => {
          const data = t(`memories.timeline.${hito.key}`, { returnObjects: true }) as {
            year: string
            title: string
            desc: string
          }

          return (
            <div
              key={hito.key}
              className="hito-item w-[70vw] flex-shrink-0 flex flex-col items-center justify-center gap-6 px-8"
            >
              <img
                src={hito.img}
                alt={data.title}
                className="w-full h-60 object-cover rounded-lg shadow-lg"
              />
              <div className="text-center">
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
