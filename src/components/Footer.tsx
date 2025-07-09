import { Facebook, Instagram, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-neutral-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        {/* Logo pequeño */}
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="Tomebambike" className="h-10" />
          <span className="font-display text-xl font-semibold"></span>
        </div>

        {/* Enlaces rápidos */}
        <nav className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <a href="/eventos" className="hover:text-primary">{t('nav.events')}</a>
          <a href="/proyectos" className="hover:text-primary">{t('nav.projects')}</a>
          <a href="/blog" className="hover:text-primary">{t('nav.blog')}</a>
        </nav>

        {/* Social + contacto */}
        <div className="flex flex-col gap-3">
          <p className="font-semibold uppercase tracking-wide">{t('footer.follow')}</p>
          <div className="flex gap-4 text-neutral-100/90">
            <a href="https://facebook.com/tomebambike" aria-label="Facebook" className="hover:text-primary">
              <Facebook size={22} />
            </a>
            <a href="https://instagram.com/tomebambike" aria-label="Instagram" className="hover:text-primary">
              <Instagram size={22} />
            </a>
            <a href="mailto:hola@tomebambike.org" aria-label="Email" className="hover:text-primary">
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-black py-4 text-center text-sm">
        © {year} Tomebambike — {t('footer.rights')}
      </div>
    </footer>
  )
}
