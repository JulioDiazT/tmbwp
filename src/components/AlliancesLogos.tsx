// src/components/AlliancesLogos.tsx
import { FC, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

import CBTLogo from '../assets/CBT.png';
import UDALogo from '../assets/UDA.png';
import UCuencaLogo from '../assets/UCUENCA.png';
import S2CitiesLogo from '../assets/S2C.png';
import AmaruLogo from '../assets/AMARU.png';
import MunchiesLogo from '../assets/MUNCHIES.png';
import BHLogo from '../assets/BH.png';
import GIB from '../assets/GIB.png';
import CUENCA from '../assets/cuenca.png';
import HUASIPICHANGA from '../assets/HUASIPICHANGA.png';
import INTEGRAR from '../assets/INTEGRAR.jpeg';
import PROCREDIT from '../assets/PROCREDIT.png';
import EMOV from '../assets/EMOV.png';
import AF from '../assets/AF.png';



gsap.registerPlugin(ScrollTrigger);

interface Alliance { name: string; logo: string }

const PRIMARY_ALLIES: Alliance[] = [
  { name: 'Cuenca Bike Tours', logo: CBTLogo }, // ← este va más grande
];

const INSTITUTIONS: Alliance[] = [
  { name: 'Safe & Sound Cities', logo: S2CitiesLogo },
  { name: 'Huasipichanga', logo: HUASIPICHANGA },
  { name: 'GIB', logo: GIB },
  { name: 'Cuenca', logo: CUENCA },
  { name: 'INTEGRAR', logo: INTEGRAR },
  { name: 'BioParque Amaru', logo: AmaruLogo },
  { name: 'Universidad del Azuay', logo: UDALogo },
  { name: 'Universidad de Cuenca', logo: UCuencaLogo },
  { name: 'EMOV EP', logo: EMOV },

];

const SPONSORS: Alliance[] = [
  { name: 'Procredit', logo: PROCREDIT },
  { name: 'Alianza Francesa', logo: AF },

  { name: 'BioParque Amaru', logo: AmaruLogo },
  { name: 'Munchies', logo: MunchiesLogo },
  { name: 'BH Bikes', logo: BHLogo },
];

// Tamaño base (pequeño/ uniforme)
const LOGO_SIZE =
  'h-10 sm:h-12 md:h-14 lg:h-16 w-auto ' +
  'max-w-[160px] sm:max-w-[190px] md:max-w-[220px]';

// Tamaño especial SOLO para “Aliados principales”
const PRIMARY_LOGO_SIZE =
  'h-16 sm:h-20 md:h-24 lg:h-28 w-auto ' +             // más alto (64→112px)
  'max-w-[240px] sm:max-w-[300px] md:max-w-[360px]';   // y más ancho

const renderLogos = (list: Alliance[], sizeClass: string = LOGO_SIZE) => (
  <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10">
    {list.map(({ name, logo }) => (
      <li key={name} className="flex items-center justify-center">
        <img
          src={logo}
          alt={name}
          loading="lazy"
          className={`logo-item ${sizeClass} object-contain opacity-100 brightness-100 contrast-100`}
          onError={() => console.error(`No se pudo cargar el logo: ${name}`)}
        />
      </li>
    ))}
  </ul>
);

const AlliancesLogos: FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const images = sectionRef.current.querySelectorAll<HTMLImageElement>('img.logo-item');

    gsap.set(images, { autoAlpha: 1, y: 0 });

    gsap.fromTo(
      images,
      { autoAlpha: 0, y: 14 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
        clearProps: 'opacity,visibility,transform',
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 space-y-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-andesnavy text-center uppercase tracking-wide">
          {t('alliances.title')}
        </h2>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-tmbred text-center uppercase tracking-wide">
            {t('alliances.primary')}
          </h3>
          {/* 👇 Logo de “Cuenca Bike Tours” más grande */}
          {renderLogos(PRIMARY_ALLIES, PRIMARY_LOGO_SIZE)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-tmbred text-center uppercase tracking-wide">
            {t('alliances.institutions')}
          </h3>
          {renderLogos(INSTITUTIONS)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-tmbred text-center uppercase tracking-wide">
            {t('alliances.sponsors')}
          </h3>
          {renderLogos(SPONSORS)}
        </div>
      </div>
    </section>
  );
};

export default AlliancesLogos;
