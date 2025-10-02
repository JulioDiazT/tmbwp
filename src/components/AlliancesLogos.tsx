// src/components/AlliancesLogos.tsx
import { FC, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

import CBTLogoUrl       from "../assets/CBT.png";
import UDALogoUrl       from "../assets/uda.png";
import UCuencaLogoUrl   from "../assets/ucuenca.png";
import S2CitiesLogoUrl  from "../assets/S2C.png";
import AmaruLogoUrl     from "../assets/Amaru.png";
import MunchiesLogoUrl  from "../assets/munchies.png";
import BHLogoUrl        from "../assets/BH.png";
import GIBUrl           from "../assets/GIB.png";
import CUENCAUrl        from "../assets/Cuenca.png";
import HUASIPICHANGAUrl from "../assets/huasi.png";
import INTEGRARUrl      from "../assets/integrar.png";
import PROCREDITUrl     from "../assets/BP.png";
import EMOVUrl          from "../assets/emov.png";
import AFUrl            from "../assets/AF.png";

gsap.registerPlugin(ScrollTrigger);

interface Alliance { name: string; src: string; }

const PRIMARY_ALLIES: Alliance[] = [
  { name: "Cuenca Bike Tours", src: CBTLogoUrl },
];

const INSTITUTIONS: Alliance[] = [
  { name: "Safe & Sound Cities",  src: S2CitiesLogoUrl },
  { name: "Huasipichanga",        src: HUASIPICHANGAUrl },
  { name: "GIB",                  src: GIBUrl },
  { name: "Cuenca",               src: CUENCAUrl },
  { name: "INTEGRAR",             src: INTEGRARUrl },
  { name: "BioParque Amaru",      src: AmaruLogoUrl },
  { name: "Universidad del Azuay",src: UDALogoUrl },
  { name: "Universidad de Cuenca",src: UCuencaLogoUrl },
  { name: "EMOV EP",              src: EMOVUrl },
];

const SPONSORS: Alliance[] = [
  { name: "ProCredit",        src: PROCREDITUrl },
  { name: "Alianza Francesa", src: AFUrl },
  { name: "BioParque Amaru",  src: AmaruLogoUrl },
  { name: "Munchies",         src: MunchiesLogoUrl },
  { name: "BH Bikes",         src: BHLogoUrl },
];

const LOGO_SIZE = "h-16 md:h-20 lg:h-24 w-auto";
const PRIMARY_LOGO_SIZE = "h-24 md:h-28 lg:h-32 w-auto";

function LogosGrid({ list, sizeClass = LOGO_SIZE }: { list: Alliance[]; sizeClass?: string }) {
  return (
    <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10">
      {list.map(({ name, src }) => (
        <li key={name} className="flex items-center justify-center">
          <img
            src={src}
            alt={name}
            decoding="async"
            loading="lazy"
            className={`logo-item logo-crisp ${sizeClass} inline-block`}
          />
        </li>
      ))}
    </ul>
  );
}

const AlliancesLogos: FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll<HTMLElement>("img.logo-item");
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08,
        force3D: false,
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        clearProps: "transform,opacity,visibility",
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Encabezado simple (solo el que viene de i18n) */}
        <header className="mb-12 sm:mb-14 text-center">
          <div className="mx-auto h-1.5 w-20 rounded-full bg-[#d6ef0a]" />
          <h2
            className="
              mt-3 font-rubikOne uppercase text-andesnavy
              text-[clamp(2rem,4.4vw,3rem)] leading-[1.05] tracking-wide
            "
          >
            {t("alliances.title")}
          </h2>
        </header>

        {/* Bloques */}
        <div className="space-y-14">
          <div className="space-y-6">
            <h3 className="text-center text-sm sm:text-base font-bold uppercase tracking-wide text-andesnavy">
              {t("alliances.primary")}
            </h3>
            <LogosGrid list={PRIMARY_ALLIES} sizeClass={PRIMARY_LOGO_SIZE} />
          </div>

          <div className="space-y-6">
            <h3 className="text-center text-sm sm:text-base font-bold uppercase tracking-wide text-andesnavy">
              {t("alliances.institutions")}
            </h3>
            <LogosGrid list={INSTITUTIONS} />
          </div>

          <div className="space-y-6">
            <h3 className="text-center text-sm sm:text-base font-bold uppercase tracking-wide text-andesnavy">
              {t("alliances.sponsors")}
            </h3>
            <LogosGrid list={SPONSORS} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlliancesLogos;
