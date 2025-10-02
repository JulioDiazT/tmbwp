// src/components/Header.tsx
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/logonegro.svg";

/* Rutas */
const navItems = [
  { path: "/recuerdos",    labelKey: "nav.memories" },
  { path: "/voluntariado", labelKey: "nav.volunteer" },
  { path: "/cyclestacks",  labelKey: "nav.CycleStacks" },
] as const;

/* Colores */
const GREEN = "#d6ef0a";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  /* Sombra al hacer scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Auto hide/show del header según dirección del scroll */
  useEffect(() => {
    let lastY = window.scrollY;
    const THRESH = 6;
    const TOPLOCK = 40;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY + THRESH;
      const goingUp   = y < lastY - THRESH;

      if (open) {
        setHidden(false);
        lastY = y;
        return;
      }
      if (goingDown && y > TOPLOCK) setHidden(true);
      else if (goingUp || y <= TOPLOCK) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
    setOpen(false);
  };

  /* Clase base para los links (subrayado verde en hover/activo) */
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `
    group relative inline-block uppercase
    text-[15px] md:text-[15px] lg:text-[17px]
    font-semibold tracking-wide transition-colors
    ${isActive ? "text-neutral-900" : "text-neutral-800 hover:text-neutral-900"}
  `;

  return (
    <header
      className={`
        sticky top-0 z-50 rounded-b-3xl
        bg-white/92 backdrop-blur-xl
        transition-[transform,box-shadow] duration-300
        ${scrolled ? "shadow-[0_10px_30px_rgba(0,0,0,.15)] ring-1 ring-black/5" : "shadow-[0_6px_22px_rgba(0,0,0,.08)]"}
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      {/* línea superior verde sólida */}
      <div className="h-[6px] w-full" style={{ background: GREEN }} />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
          aria-label="Tomebambike - Inicio"
        >
          <img
            src={Logo}
            alt="Tomebambike"
            className="h-12 sm:h-14 md:h-16 w-auto"
            decoding="async"
            loading="eager"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="relative hidden md:block" role="navigation" aria-label="Primary">
          <ul className="relative flex items-center gap-8 lg:gap-10">
            {navItems.map(({ path, labelKey }) => (
              <li key={path}>
                <NavLink to={path} className={linkClass}>
                  {({ isActive }) => (
                    <span className="relative inline-block">
                      {t(labelKey)}
                      {/* subrayado verde (hover/activo) */}
                      <span
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2px] rounded-full transition-[width] duration-300 w-0 group-hover:w-4/5"
                        style={{
                          background: GREEN,
                          width: isActive ? "80%" : undefined,
                        }}
                        aria-hidden
                      />
                    </span>
                  )}
                </NavLink>
              </li>
            ))}

            {/* Botón idioma: liquid glass + borde verde al hover */}
            <li>
              <button
                onClick={toggleLang}
                className="
                  inline-flex items-center justify-center rounded-full
                  px-3 py-1.5 text-sm font-semibold uppercase tracking-wide
                  transition
                "
                style={{
                  background: "rgba(255,255,255,0.35)",
                  color: "#111",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(0,0,0,0.10)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06) inset",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1.5px solid ${GREEN}`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${GREEN}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(0,0,0,0.10)";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06) inset";
                }}
                aria-label={t("nav.changeLang", { defaultValue: "Cambiar idioma" })}
              >
                {i18n.language === "es" ? "EN" : "ES"}
              </button>
            </li>
          </ul>
        </nav>

        {/* Móvil: idioma + hamburguesa */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleLang}
            className="uppercase text-sm font-semibold px-2.5 py-1 rounded-full mr-2 transition"
            style={{
              background: "rgba(255,255,255,0.35)",
              color: "#111",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(0,0,0,0.10)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.border = `1.5px solid ${GREEN}`)}
            onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(0,0,0,0.10)")}
            aria-label={t("nav.changeLang", { defaultValue: "Cambiar idioma" })}
          >
            {i18n.language === "es" ? "EN" : "ES"}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={t("nav.menu", { defaultValue: "Menú" })}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="p-2 rounded-full bg-white border border-black/10 backdrop-blur hover:shadow-sm transition"
          >
            {open ? <X size={24} strokeWidth={1.8} /> : <Menu size={26} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Backdrop móvil */}
      <button
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={`
          md:hidden fixed inset-0 bg-black/35 transition-opacity
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
        tabIndex={-1}
      />

      {/* Menú móvil */}
      <nav
        id="mobile-nav"
        role="navigation"
        aria-label="Primary mobile"
        className={`
          md:hidden fixed left-0 right-0 top-[calc(100%)]
          bg-white/95 backdrop-blur-xl border-t border-black/10
          rounded-b-3xl
          transition-[transform,opacity] duration-200
          ${open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"}
        `}
      >
        {/* línea superior verde sólida en panel móvil */}
        <div className="h-[4px] w-full" style={{ background: GREEN }} />
        <ul className="px-6 py-6 flex flex-col gap-3">
          {navItems.map(({ path, labelKey }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={() => setOpen(false)}
                className="block py-2 uppercase text-base font-semibold tracking-wide text-neutral-800 hover:text-neutral-900"
                style={{ borderBottom: `2px solid ${GREEN}22` }}
              >
                {/* subrayado en mobile lo sugerimos como borde suave */}
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
