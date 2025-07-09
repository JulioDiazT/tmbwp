import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const navItems = [
  { path: '/eventos',   labelKey: 'nav.events'   },
  { path: '/proyectos', labelKey: 'nav.projects' },
  { path: '/blog',      labelKey: 'nav.blog'     }
] as const

export default function Header() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase text-base md:text-lg font-semibold tracking-wide transition-colors
     ${isActive ? 'text-primary' : 'text-neutral-900 hover:text-primary'}`

  return (
    <header className="sticky top-0 z-50 rounded-b-2xl bg-white/95 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/src/assets/logorojo2.png"
            alt="Tomebambike"
            className="h-10 w-auto md:h-10 lg:h-14"
          />
        </Link>

        {/* Hamburguesa SOLO móvil */}
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menú">
          <Menu size={30} strokeWidth={1.6} className="text-neutral-900" />
        </button>

        {/* Navegación */}
        <nav
          className={`absolute left-0 right-0 top-full flex flex-col gap-6 bg-white/95 px-6 py-8
                      transition-all md:static md:flex md:flex-row md:items-center md:gap-10 md:bg-transparent md:p-0
                      ${open ? 'visible opacity-100' : 'invisible opacity-0 md:visible md:opacity-100'}`}
        >
          {navItems.map(({ path, labelKey }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={navClass}
            >
              {t(labelKey)}
            </NavLink>
          ))}

          {/* ——— Idioma ES/EN ——— */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
            className="uppercase text-base md:text-lg font-semibold tracking-wide text-neutral-900 transition-colors hover:text-primary"
            aria-label="Cambiar idioma"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>

          {/* CTA */}
          <a
            href="https://chat.whatsapp.com/XXXXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-primary px-6 py-2 text-base font-semibold uppercase tracking-wide
                       text-white hover:bg-primary/90"
          >
            {t('nav.join')}
          </a>
        </nav>
      </div>
    </header>
  )
}
