// src/components/BannerRecuerdos.tsx
import { FC, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImg from '../assets/banner-recuerdos.jpg' // tu imagen de banner
import { useTranslation } from 'react-i18next'

gsap.registerPlugin(ScrollTrigger)

const BannerMemories: FC = () => {
  const { t } = useTranslation()
  const bannerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    if (!bannerRef.current || !titleRef.current || !subtitleRef.current) return

    // Pin del banner
    ScrollTrigger.create({
      trigger: bannerRef.current,
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: false
    })

    // Animación secuencial de palabras del título
    gsap.from(titleRef.current.children, {
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top top',
        end: '+=50%',
        scrub: true
      },
      y: 80,
      opacity: 0,
      stagger: 0.15,
      ease: 'power2.out'
    })

    // Aparición del subtítulo
    gsap.from(subtitleRef.current, {
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top+=40% top',
        end: 'bottom top',
        scrub: true
      },
      y: 60,
      opacity: 0,
      ease: 'power2.out'
    })

    // Desvanecer banner al salir
    gsap.to(bannerRef.current, {
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'bottom top',
        end: 'bottom top+=25%',
        scrub: true
      },
      opacity: 0
    })
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
          {t('memories.banner.title', 'TODO LO MEMORABLE COMIENZA CON UN...')
            .split(' ')
            .map((w, i) => (
              <span key={i} className="inline-block mr-2">
                {w}
              </span>
            ))}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-2xl sm:text-3xl font-semibold text-yellow-400 uppercase"
        >
          {t('memories.banner.subtitle', '¿QUÉ HACES ESTE SÁBADO?')}
        </p>
      </div>
    </section>
  )
}

export default BannerMemories
