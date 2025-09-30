// src/components/TeamSection.tsx
import { FC } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { UserRound } from 'lucide-react'

import adrianImg from '../assets/adri.svg'
import julioImg   from '../assets/julio.svg'
import danielaImg from '../assets/dani.svg'

type Member = {
  key: string                  // clave i18n: team.members.<key>.*
  color: string                // Color dinámico para el “ring”
  img: string                  // Foto de perfil
}

const MEMBERS: Member[] = [
  { key: 'adrian',  color: '#D2042D', img: adrianImg  },
  { key: 'julio',   color: '#0075FF', img: julioImg   },
  { key: 'daniela', color: '#7A9B52', img: danielaImg },
]

const TeamSection: FC = () => {
  const { t } = useTranslation()

  return (
    <section id="team" className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <p className=" font-semibold uppercase tracking-wider text-tmbbbyblue font-rubikOne text-4xl">
          {t('team.tag')}
        </p>
        <h2 className="mt-2 text-2xl sm:text-2xl md:text-2xl font-extrabold text-andesnavy font-rubikMono ">
          {t('team.title')}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m, i) => (
            <motion.article
              key={m.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group flex flex-col items-center px-4"
            >
              {/* Avatar con “ring” dinámico */}
              <div
                className={clsx(
                  'relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-offset-2 transition-all duration-300',
                  'group-hover:ring-8 group-hover:ring-offset-0',
                  `ring-tmbyellow`
                )}
              >
                <img
                  src={m.img}
                  alt={t(`team.members.${m.key}.name`)}
                  className="w-full h-full object-cover"
                />
                {/* placeholder si la imagen no carga */}
                <UserRound
                  size={32}
                  className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-20"
                />
              </div>

              {/* Nombre y pronombres */}
              <h3 className="mt-6 text-xl font-semibold text-andesnavy">
                {t(`team.members.${m.key}.name`)}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-4">
                {t(`team.members.${m.key}.pronouns`)}
              </p>

              {/* Bio */}
              <p className="text-base text-gray-600 leading-relaxed font-quicksand">
                {t(`team.members.${m.key}.bio`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection
