// src/components/AlliancesLogos.tsx
import { FC, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

// Importa logos (ideal: .webp optimizados en /assets)
import CBTLogo from "../assets/CBT.svg";
import UDALogo from "../assets/UDA.svg";
import UCuencaLogo from "../assets/UCUENCA.svg";
import S2CitiesLogo from "../assets/S2C.svg";
import AmaruLogo from "../assets/AMARU.svg";
import MunchiesLogo from "../assets/MUNCHIES.svg";
import BHLogo from "../assets/BH.svg";
import GIB from "../assets/GIB.svg";
import CUENCA from "../assets/CUENCA.svg";
import HUASIPICHANGA from "../assets/HUASIPICHANGA.svg";
import INTEGRAR from "../assets/INTEGRAR.svg";
import PROCREDIT from "../assets/PROCREDIT.svg";
import EMOV from "../assets/EMOV.svg";
import AF from "../assets/AF.svg";

gsap.registerPlugin(ScrollTrigger);

interface Alliance {
  name: string;
  logo: string;
  width?: number;
  height?: number;
}

const PRIMARY_ALLIES: Alliance[] = [
  { name: "Cuenca Bike Tours", logo: CBTLogo, width: 300, height: 120 },
];

const INSTITUTIONS: Alliance[] = [
  { name: "Safe & Sound Cities", logo: S2CitiesLogo, width: 200, height: 80 },
  { name: "Huasipichanga", logo: HUASIPICHANGA, width: 200, height: 80 },
  { name: "GIB", logo: GIB, width: 200, height: 80 },
  { name: "Cuenca", logo: CUENCA, width: 200, height: 80 },
  { name: "INTEGRAR", logo: INTEGRAR, width: 200, height: 80 },
  { name: "BioParque Amaru", logo: AmaruLogo, width: 200, height: 80 },
  { name: "Universidad del Azuay", logo: UDALogo, width: 200, height: 80 },
  { name: "Universidad de Cuenca", logo: UCuencaLogo, width: 200, height: 80 },
  { name: "EMOV EP", logo: EMOV, width: 200, height: 80 },
];

const SPONSORS: Alliance[] = [
  { name: "Procredit", logo: PROCREDIT, width: 200, height: 80 },
  { name: "Alianza Francesa", logo: AF, width: 200, height: 80 },
  { name: "BioParque Amaru", logo: AmaruLogo, width: 200, height: 80 },
  { name: "Munchies", logo: MunchiesLogo, width: 200, height: 80 },
  { name: "BH Bikes", logo: BHLogo, width: 200, height: 80 },
];

// Tamaños
const LOGO_SIZE =
  "h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[160px] sm:max-w-[190px] md:max-w-[220px]";
const PRIMARY_LOGO_SIZE =
  "h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[360px]";

const renderLogos = (list: Alliance[], sizeClass: string = LOGO_SIZE) => (
  <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10">
    {list.map(({ name, logo, width, height }, i) => (
      <li key={name} className="flex items-center justify-center">
        <img
          src={logo}
          alt={name}
          width={width}
          height={height}
          className={`logo-item ${sizeClass} object-contain`}
          // Solo los 2 primeros logos se cargan con prioridad
          loading={i < 2 ? "eager" : "lazy"}
          // @ts-expect-error
          fetchpriority={i < 2 ? "high" : "auto"}
          decoding="async"
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
    const images = sectionRef.current.querySelectorAll<HTMLImageElement>("img.logo-item");

    gsap.fromTo(
      images,
      { autoAlpha: 0, y: 14 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
        clearProps: "opacity,visibility,transform",
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 space-y-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-andesnavy text-center uppercase tracking-wide">
          {t("alliances.title")}
        </h2>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-tmbred text-center uppercase tracking-wide">
            {t("alliances.primary")}
          </h3>
          {renderLogos(PRIMARY_ALLIES, PRIMARY_LOGO_SIZE)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-tmbred text-center uppercase tracking-wide">
            {t("alliances.institutions")}
          </h3>
          {renderLogos(INSTITUTIONS)}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-tmbred text-center uppercase tracking-wide">
            {t("alliances.sponsors")}
          </h3>
          {renderLogos(SPONSORS)}
        </div>
      </div>
    </section>
  );
};

export default AlliancesLogos;
