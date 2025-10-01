// src/components/Header.tsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/logonegro.svg";

const navItems = [
  { path: "/recuerdos",    labelKey: "nav.memories" },
  { path: "/voluntariado", labelKey: "nav.volunteer" },
  { path: "/cyclestacks",  labelKey: "nav.CycleStacks" },
] as const;

/* Colores de marca */
const C1 = "#9958fd"; // morado
const C2 = "#d6ef0a"; // lima
const C3 = "#fe8303"; // naranja
const GRAD = `linear-gradient(90deg, ${C1} 0%, ${C2} 50%, ${C3} 100%)`;

export default function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // rail animado (barra que sigue el hover)
  const railRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const moveRail = (el?: HTMLElement | null) => {
    const rail = railRef.current;
    const list = listRef.current;
    if (!rail || !list) return;
    if (!el) {
      rail.style.opacity = "0";
      return;
    }
    const r = el.getBoundingClientRect();
    const p = list.getBoundingClientRect();
    const w = Math.min(r.width * 0.78, 140);
    rail.style.opacity = "1";
    rail.style.width = `${w}px`;
    rail.style.transform = `translateX(${r.left - p.left + r.width / 2 - w / 2}px)`;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
      moveRail();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
    setOpen(false);
  };

  const navLinkClass =
    ({ isActive, index = 0 }: { isActive: boolean; index?: number }) =>
      `
      group relative inline-block uppercase
      text-[15px] md:text-[15px] lg:text-[17px]
      font-semibold tracking-wide
      transition-colors
      ${isActive ? "text-neutral-900" : "text-neutral-800 hover:text-neutral-900"}
      after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1
      after:h-[2px] after:w-0 after:rounded-full
      after:transition-[width,background] after:duration-300 group-hover:after:w-4/5
      ${isActive ? "after:w-4/5" : ""}
      ${underlineColor(index)}
    `;

  function underlineColor(i: number) {
    const c = [C1, C2, C3][i % 3];
    return `after:bg-[${c}]`.replace("[", "(").replace("]", ")"); // sólo para lectura; tailwind no parsea variables dinámicas, así que usamos style inline abajo
  }

  return (
    <header
      className={`
        sticky top-0 z-50 rounded-b-3xl
        bg-white/92 backdrop-blur-xl
        transition-shadow duration-200
        ${scrolled ? "shadow-[0_10px_30px_rgba(0,0,0,.15)] ring-1 ring-black/5" : "shadow-[0_6px_22px_rgba(0,0,0,.08)]"}
      `}
    >
      {/* pestaña superior con tu gradiente */}
      <div className="h-[6px] w-full" style={{ background: GRAD }} />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2">
        {/* logo */}
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

        {/* desktop nav */}
        <nav className="relative hidden md:block" role="navigation" aria-label="Primary">
          <ul
            ref={listRef}
            className="relative flex items-center gap-8 lg:gap-10"
            onMouseLeave={() => moveRail(undefined)}
          >
            {/* rail animado con gradiente de marca */}
            <span
              ref={railRef}
              className="pointer-events-none absolute -bottom-1.5 h-[3px] w-0 rounded-full transition-[transform,width,opacity] duration-300 ease-out opacity-0"
              style={{ background: GRAD }}
              aria-hidden
            />
            {navItems.map(({ path, labelKey }, i) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) => navLinkClass({ isActive, index: i })}
                  onMouseEnter={(e) => moveRail(e.currentTarget)}
                  style={{
                    // subrayado por ítem en su color correspondiente (soporte seguro)
                    ["--u" as any]: [C1, C2, C3][i % 3],
                  }}
                >
                  <span
                    className="after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full group-hover:after:w-4/5"
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <span
                      className="pointer-events-none absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] w-0 rounded-full transition-[width] duration-300"
                      style={{ background: `var(--u)` }}
                    />
                    {t(labelKey)}
                  </span>
                </NavLink>
              </li>
            ))}
            {/* selector de idioma (píldora glass con borde color marca al hover) */}
            <li>
              <button
                onClick={toggleLang}
                className="
                  inline-flex items-center justify-center rounded-full
                  px-3 py-1.5 text-sm font-semibold uppercase tracking-wide
                  text-neutral-900 bg-white border border-black/10 backdrop-blur
                  hover:shadow-sm hover:-translate-y-[1px]
                  transition
                "
                style={{ boxShadow: "inset 0 0 0 0px transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `inset 0 0 0 2px ${C1}`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 0 0px transparent")}
                aria-label={t("nav.changeLang", { defaultValue: "Cambiar idioma" })}
              >
                {i18n.language === "es" ? "EN" : "ES"}
              </button>
            </li>
          </ul>
        </nav>

        {/* móvil: idioma + hamburguesa */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleLang}
            className="uppercase text-sm font-semibold text-neutral-900 bg-white border border-black/10 backdrop-blur px-2.5 py-1 rounded-full mr-2 hover:shadow-sm transition"
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

      {/* backdrop móvil */}
      <button
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={`
          md:hidden fixed inset-0 bg-black/35 transition-opacity
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
        tabIndex={-1}
      />

      {/* menú móvil */}
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
        {/* pestañita superior con gradiente de marca */}
        <div className="h-[4px] w-full" style={{ background: GRAD }} />
        <ul className="px-6 py-6 flex flex-col gap-3">
          {navItems.map(({ path, labelKey }, i) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={() => setOpen(false)}
                className="block py-2 uppercase text-base font-semibold tracking-wide text-neutral-800 hover:text-neutral-900"
                style={{ borderBottom: `2px solid ${[C1, C2, C3][i % 3]}22` }}
              >
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
