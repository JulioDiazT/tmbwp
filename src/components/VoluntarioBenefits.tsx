// src/components/VoluntarioBenefits.tsx
import { FC, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { Briefcase, Users, Award, ArrowUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { Icon: Briefcase, key: 'impactSkills' },
  { Icon: Users,     key: 'networking'    },
  { Icon: Award,     key: 'recognition'   },
  { Icon: ArrowUp,   key: 'personalGrowth'}
] as const

export const VoluntarioBenefits: FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const cards = section.querySelectorAll<HTMLElement>('.benefit-card')
    const title = section.querySelector<HTMLElement>('h2')!
    const subtitle = section.querySelector<HTMLElement>('p')!

    // 1️⃣ Estado base visible
    gsap.set([title, subtitle, cards], { opacity: 1, y: 0 })

    // 2️⃣ Animación del título
    gsap.fromTo(title,
      { opacity: 0, y: -30 },
      {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reset'
        }
      }
    )
    // 3️⃣ Animación del subtítulo
    gsap.fromTo(subtitle,
      { opacity: 0, y: -20 },
      {
        opacity: 1, y: 0,
        duration: 0.6, delay: 0.2, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reset'
        }
      }
    )

    // 4️⃣ Batch para las tarjetas
    ScrollTrigger.batch(cards, {
      start: 'top 85%',
      interval: 0.1,
      onEnter: batch => {
        gsap.fromTo(batch,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, ease: 'back.out(1.2)',
            stagger: 0.15
          }
        )
      },
      onLeaveBack: batch => {
        gsap.to(batch, { opacity: 0, y: 40, scale: 0.9, duration: 0.4 })
      }
    })

  }, [])

  return (
    <section ref={sectionRef} className="py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="uppercase text-5xl md:text-6xl font-extrabold text-andesnavy mb-6">
          {t('volunteer.benefits.title')}
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 mb-16">
          {t('volunteer.benefits.subtitle')}
        </p>

        <div className="grid gap-12 md:grid-cols-2">
          {ITEMS.map(({ Icon, key }) => (
            <div
              key={key}
              className="benefit-card flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl cursor-pointer select-none will-change-transform"
            >
              <Icon size={56} className="text-primary mb-6" />
              <h3 className="text-3xl font-semibold text-andesnavy mb-3">
                {t(`volunteer.benefits.items.${key}.title`)}
              </h3>
              <p className="text-gray-600 text-lg max-w-lg">
                {t(`volunteer.benefits.items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VoluntarioBenefits
