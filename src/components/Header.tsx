import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import logoRojo from '../assets/logorojo.png'

const navItems = [
  { path: '/eventos',    labelKey: 'nav.events'   },
  { path: '/recuerdos',  labelKey: 'nav.memories' },
  { path: '/voluntariado', labelKey: 'nav.volunteer' }
] as const

export default function Header() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
    setOpen(false)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase text-base md:text-lg font-semibold tracking-wide transition-colors
     ${isActive ? 'text-primary' : 'text-neutral-900 hover:text-primary'}`

  return (
    <header className="sticky top-0 z-50 rounded-b-2xl bg-white/95 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoRojo} alt="Tomebambike" className="h-10 w-auto md:h-14" />
        </Link>

        {/* Móvil: idioma + hamburguesa */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleLang}
            className="uppercase text-base font-semibold text-neutral-900 hover:text-primary mr-2 px-2"
            aria-label="Cambiar idioma"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
          <button onClick={() => setOpen(o => !o)} aria-label="Menú">
            <Menu size={28} strokeWidth={1.6} className="text-neutral-900" />
          </button>
        </div>

        {/* Navegación */}
        <nav
          className={`
            absolute inset-x-0 top-full bg-white/95 px-6 py-8
            transition-all duration-200
            md:static md:flex md:items-center md:gap-10 md:bg-transparent md:p-0
            ${open ? 'visible opacity-100' : 'invisible opacity-0 md:visible md:opacity-100'}
          `}
        >
          <ul className="flex flex-col gap-4 md:flex-row md:gap-10">
            {navItems.map(({ path, labelKey }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => setOpen(false)}
                  className={navLinkClass}
                >
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}

            {/* Desktop: selector de idioma */}
            <li className="hidden md:block">
              <button
                onClick={toggleLang}
                className="uppercase text-base md:text-lg font-semibold tracking-wide text-neutral-900 hover:text-primary"
                aria-label="Cambiar idioma"
              >
                {i18n.language === 'es' ? 'EN' : 'ES'}
              </button>
            </li>

            {/* CTA */}
            <li>
              <a
                href="https://chat.whatsapp.com/XXXXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded bg-primary px-6 py-2 text-base font-semibold uppercase tracking-wide text-white hover:bg-primary/90 transition-colors text-center"
              >
                {t('nav.join')}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
