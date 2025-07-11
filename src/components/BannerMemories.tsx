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
  const bgRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    if (!bannerRef.current) return

    const ctx = gsap.context(() => {
      // Pin del banner
      ScrollTrigger.create({
        trigger: bannerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        pinSpacing: false
      })

      // Parallax del fondo
      gsap.to(bgRef.current, {
        scale: 1.2,
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Animación entrada del título
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top center'
        }
      })

      // Subtítulo con loop de “latido”
      gsap.timeline({ repeat: -1, yoyo: true, delay: 1 }).to(subtitleRef.current, {
        scale: 1.1,
        duration: 0.6,
        ease: 'sine.inOut'
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
        ref={bgRef}
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
          {t('memories.banner.title', 'TODO LO MEMORABLE COMIENZA CON UN...')}
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
