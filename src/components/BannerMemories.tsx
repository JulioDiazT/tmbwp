// src/components/BannerRecuerdos.tsx
import { FC, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImg from '../assets/banner-recuerdos.jpg'
import { useTranslation } from 'react-i18next'

gsap.registerPlugin(ScrollTrigger)

const BannerMemories: FC = () => {
  const { t } = useTranslation()
  const bannerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  const title = t('memories.banner.title', 'TODO LO MEMORABLE COMIENZA CON UN...')
  const subtitle = t('memories.banner.subtitle', '¿QUÉ HACES ESTE SÁBADO?')
  const titleWords = title.split(' ')
  const subtitleWords = subtitle.split(' ')

  useLayoutEffect(() => {
    if (!bannerRef.current) return

    ScrollTrigger.create({
      trigger: bannerRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      pinSpacing: false
    })

    const ctx = gsap.context(() => {
      const words = bannerRef.current!.querySelectorAll('.banner-word')

      gsap.timeline({
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }).from(words, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.05,
        ease: 'power2.out'
      })
    }, bannerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={bannerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Textos */}
      <div className="relative z-10 text-center px-4">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase leading-tight"
        >
          {titleWords.map((w, i) => (
            <span key={i} className="banner-word inline-block mr-2">
              {w}
            </span>
          ))}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-2xl sm:text-3xl font-semibold text-yellow-400 uppercase"
        >
          {subtitleWords.map((w, i) => (
            <span key={i} className="banner-word inline-block mr-1">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

export default BannerMemories
