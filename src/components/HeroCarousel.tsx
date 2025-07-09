// src/components/HeroCarousel.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const IMAGES = [
  '/src/assets/hero1.jpg',
  '/src/assets/hero2.jpg',
  '/src/assets/hero3.jpg'
];
const CHANGE_EVERY = 7000; // ms

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const id = setInterval(
      () => setIdx(i => (i + 1) % IMAGES.length),
      CHANGE_EVERY
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`
            absolute inset-0 h-full w-full object-cover
            transition-opacity duration-1000
            ${i === idx ? 'opacity-100' : 'opacity-0'}
          `}
        />
      ))}

      {/* Oscurecer fondo */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 font-rubikOne text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {t('hero.title')}
        </h1>
        <p className="mb-6 font-quicksand text-lg sm:text-xl md:text-2xl">
          {t('hero.subtitle')}
        </p>
        <Link
          to="/eventos"
          className="
            inline-block
            rounded-full
            bg-primary
            px-8 py-3
            font-rubikOne
            text-lg
            transition
            duration-300
            ease-out
            hover:bg-white
            hover:text-primary
            hover:scale-105
          "
        >
          {t('hero.cta')}
        </Link>
      </div>
    </section>
  );
}
