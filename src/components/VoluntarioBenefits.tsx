import { FC, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { Briefcase, Users, Award, ArrowUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const BRAND = ["#9958fd", "#fe8303", "#d6ef0a", "#0b3764"] as const;

const ITEMS = [
  { Icon: Briefcase, key: "impactSkills", color: BRAND[0] },
  { Icon: Users, key: "networking", color: BRAND[1] },
  { Icon: Award, key: "recognition", color: BRAND[2] },
  { Icon: ArrowUp, key: "personalGrowth", color: BRAND[3] },
] as const;

export const VoluntarioBenefits: FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const cards = section.querySelectorAll<HTMLElement>(".benefit-card");
    const title = section.querySelector<HTMLElement>("h2")!;
    const subtitle = section.querySelector<HTMLElement>("p[data-sub]")!;

    gsap.set([title, subtitle, cards], { opacity: 1, y: 0 });

    gsap.fromTo(
      title,
      { opacity: 0, y: -24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reset" },
      }
    );

    gsap.fromTo(
      subtitle,
      { opacity: 0, y: -14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        delay: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reset" },
      }
    );

    ScrollTrigger.batch(cards, {
      start: "top 85%",
      interval: 0.1,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y: 34, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.35)",
            stagger: 0.12,
          }
        ),
      onLeaveBack: (batch) =>
        gsap.to(batch, { opacity: 0, y: 34, scale: 0.96, duration: 0.35 }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-4 font-extrabold uppercase text-andesnavy text-[clamp(1.8rem,4.2vw,3rem)]">
          {t("volunteer.benefits.title")}
        </h2>
        <p data-sub className="mx-auto mb-14 max-w-3xl text-[17px] text-gray-700">
          {t("volunteer.benefits.subtitle")}
        </p>

        <div className="grid gap-8 sm:grid-cols-2">
          {ITEMS.map(({ Icon, key, color }, idx) => (
            <div
              key={key}
              className="benefit-card group rounded-3xl p-7 text-left transition-transform will-change-transform hover:-translate-y-1.5"
              style={{
                background: `linear-gradient(180deg, ${color}1A 0%, ${color}0D 100%)`,
                border: "1px solid rgba(11,55,100,.08)",
                boxShadow: "0 18px 36px rgba(0,0,0,.06)",
              }}
            >
              <div
                className="mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl text-white"
                style={{
                  background:
                    idx === 2
                      ? "#d6ef0a"
                      : idx === 3
                      ? "#0b3764"
                      : idx === 1
                      ? "#fe8303"
                      : "#9958fd",
                }}
              >
                <Icon size={22} className="opacity-95" />
              </div>

              <h3 className="text-andesnavy mb-2 text-xl font-extrabold">
                {t(`volunteer.benefits.items.${key}.title`)}
              </h3>
              <p className="text-gray-700 text-[15px]">
                {t(`volunteer.benefits.items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoluntarioBenefits;
