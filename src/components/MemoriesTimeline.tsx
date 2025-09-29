// src/components/MemoriesTimeline.tsx
import { FC, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import img2019     from '../assets/2019.jpg'
import img2024     from '../assets/2024.jpg'
import imgUDA      from '../assets/uda.jpg'
import imgPartners from '../assets/partners.jpg'

gsap.registerPlugin(ScrollTrigger)

interface Hito { key: string; img: string }
const HITOS: Hito[] = [
  { key: '2019',     img: img2019    },
  { key: '2024',     img: img2024    },
  { key: 'uda',      img: imgUDA     },
  { key: 'partners', img: imgPartners }
]

const CARD_WIDTH_VW = 80 // ancho de tarjeta en vw

const MemoriesTimeline: FC = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef   = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current!
    const wrapper   = wrapperRef.current!
    const panels    = Array.from(wrapper.children) as HTMLElement[]

    // padding para centrar la primer y última tarjeta
    const sidePadding = (100 - CARD_WIDTH_VW) / 2 // en vw

    // calc scroll distance (px)
    const totalWidth = wrapper.scrollWidth
    const vwToPx = (vw: number) => vw * window.innerWidth / 100
    const pxPadding = vwToPx(sidePadding)
    const distance = totalWidth - window.innerWidth + pxPadding * 2

    // horizontal tween
    const tween = gsap.to(wrapper, {
      x: `-=${distance}px`,
      ease: 'none',
      paused: true
    })

    // ScrollTrigger principal
    ScrollTrigger.create({
      animation: tween,
      trigger: container,
      start: 'top top',
      end: () => `+=${distance}`,
      scrub: true,
      pin: true,
      anticipatePin: 1
    })

    // Animar aparición/desaparición de cada panel
    panels.forEach(panel => {
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: tween,
        start: `left+=${pxPadding * 0.1}px center`,   // entra al 10%
        end: `left+=${panel.clientWidth - pxPadding * 0.1}px center`, // sale al 90%
        scrub: true,
        onToggle: self => {
          const alpha = self.isActive ? 1 : 0
          gsap.to(panel, { autoAlpha: alpha, duration: 0.3 })
        }
      })
    })

    return () => ScrollTrigger.getAll().forEach(st => st.kill())
  }, [])

  return (
    <section
      ref={containerRef}
      className="timeline-section bg-gray-50 overflow-hidden"
      style={{ paddingTop: 110 }}
    >
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-andesnavy mb-8">
        Esta historia la hicimos juntos/as
      </h2>
      <div
        ref={wrapperRef}
        className="timeline-wrapper flex"
        style={{
          padding: `0 ${ (90 - CARD_WIDTH_VW) / 2 }vw`
        }}
      >
        {HITOS.map((hito) => {
          const data = t(`memories.timeline.${hito.key}`, { returnObjects: true }) as {
            year: string
            title: string
            desc: string
          }
          return (
            <div
              key={hito.key}
              className="hito-item bg-white rounded-2xl shadow-lg flex-shrink-0"
              style={{
                width: `${CARD_WIDTH_VW}vw`,
                marginRight: '2vw'
              }}
            >
              <img
                src={hito.img}
                alt={data.title}
                className="w-full h-[60vh] object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <span className="block text-red-600 font-bold uppercase text-sm">
                  {data.year}
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-andesnavy uppercase">
                  {data.title}
                </h3>
                <p className="mt-2 text-gray-700">
                  {data.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MemoriesTimeline
