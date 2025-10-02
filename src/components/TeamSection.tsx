// src/components/TeamSection.tsx
import { FC } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import adrianImg from "../assets/adri.svg";
import julioImg from "../assets/julio.svg";
import danielaImg from "../assets/dani.svg";

type Member = {
  key: string;      // i18n: team.members.<key>.*
  img: string;
  age: number;
  songUrl?: string;
  theme: string;    // #9958fd | #d6ef0a | #1097f6
};

const MEMBERS: Member[] = [
  {
    key: "adrian",
    img: adrianImg,
    age: 27,
    songUrl:
      "https://open.spotify.com/track/1myEOhXztRxUVfaAEQiKkU?si=CEHTnL1ORtOJJL-O7ezcGQ&context=spotify%3Asearch%3Aflorence",
    theme: "#9958fd",
  },
  {
    key: "julio",
    img: julioImg,
    age: 26,
    songUrl:
      "https://open.spotify.com/intl-es/track/3IQF4xCQUPicbA4hWfTxPo?si=e4d01eb269a74e60",
    theme: "#d6ef0a",
  },
  {
    key: "daniela",
    img: danielaImg,
    age: 25,
    songUrl:
      "https://open.spotify.com/track/0HGUJg63wQZIaaFY12rC5O?si=18Q1WUecRIuIVD3MAvj-vA",
    theme: "#1097f6",
  },
];

const SpotifyIcon: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 1.6a10.4 10.4 0 1 0 0 20.8A10.4 10.4 0 0 0 12 1.6zm5.03 15.31a.9.9 0 0 1-1.24.3c-3.41-2.08-7.7-2.55-12.75-1.39a.9.9 0 1 1-.41-1.76c5.46-1.25 10.17-.72 13.94 1.51a.9.9 0 0 1 .46 1.34zm1.6-3.28a1.06 1.06 0 0 1-1.45.35c-3.91-2.39-9.87-3.09-14.5-1.7a1.06 1.06 0 1 1-.61-2.02c5.18-1.55 11.73-.77 16.21 1.91.5.31.66.97.35 1.46zm.12-3.34C14.4 7.63 7.2 7.37 3.05 8.63a1.24 1.24 0 1 1-.73-2.37C7.06 4.72 15 5 20.05 8.04a1.24 1.24 0 1 1-1.3 2.04z"
    />
  </svg>
);

const TeamSection: FC = () => {
  const { t } = useTranslation();

  return (
    <section id="team" className="py-20 bg-[#f6f7f9]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado coherente con el resto de la web */}
        <header className="mb-8 sm:mb-10">
          {/* Acento superior verde (coherente con secciones anteriores) */}
          <div className="h-1.5 w-20 rounded-full bg-[#d6ef0a]" />
          {/* Eyebrow / subtítulo pequeño */}
          <p className="mt-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-andesnavy/70">
            {t("team.tag")}
          </p>
          {/* Título principal */}
          <h2
            className="
              mt-1 font-rubikOne uppercase text-andesnavy
              text-[clamp(2rem,4.4vw,3rem)] leading-[1.05] tracking-wide
            "
          >
            {t("team.title")}
          </h2>
        </header>

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m, i) => {
            const rawName = t(`team.members.${m.key}.name`);
            const cleanName = String(rawName).replace(/,\s*\d+\s*$/g, "");
            const imgBg = `linear-gradient(180deg, ${m.theme}66 0%, ${m.theme}22 40%, #ffffff 100%)`;

            return (
              <motion.article
                key={m.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -3, rotate: 0.0001 }}
                className="relative overflow-hidden rounded-[26px] bg-white shadow-[0_10px_30px_rgba(0,0,0,.07)] ring-1 ring-black/5 flex flex-col"
              >
                {/* Pestaña superior del color del miembro */}
                <div className="h-3 w-full" style={{ background: m.theme }} />

                {/* Contenido textual */}
                <div className="px-5 pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-[11px] font-semibold text-neutral-800">
                      {t("team.ageLabel", { defaultValue: "{{count}} años", count: m.age })}
                    </span>

                    <a
                      href={m.songUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold text-white hover:bg-black"
                    >
                      <SpotifyIcon className="h-3.5 w-3.5" />
                      <span>{t("team.favoriteSong", { defaultValue: "Mi canción favorita" })}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <h3 className="mt-4 text-[28px] leading-8 font-extrabold tracking-tight text-neutral-900">
                    {cleanName}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-neutral-600">
                    {t(`team.members.${m.key}.pronouns`)}
                  </p>

                  <p className="mt-3 text-[15px] leading-[1.6] text-neutral-800 font-quicksand max-w-[70ch]">
                    {t(`team.members.${m.key}.bio`)}
                  </p>
                </div>

                {/* Imagen al borde inferior, con fondo degradado suave del tema */}
                <div className="relative w-full flex-1" style={{ background: imgBg }}>
                  <img
                    src={m.img}
                    alt={cleanName}
                    className="block w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
