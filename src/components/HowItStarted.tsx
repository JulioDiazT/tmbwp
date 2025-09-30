import { FC } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type TLKey = "2019" | "2024" | "uda" | "partners";
const ORDER: TLKey[] = ["2019", "2024", "uda", "partners"];

const HowItStarted: FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative bg-white py-16 sm:py-20"
      aria-label={t("memories.timeline.aria", "How it all began")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10 text-center">
          <h2 className="text-andesnavy text-[clamp(1.8rem,4.5vw,3rem)] font-extrabold uppercase tracking-tight">
            {t("memories.timeline.title", "How it all began")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
            {t("memories.timeline.subtitle", "A story that pedals from the community.")}
          </p>
        </header>

        <ol className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {ORDER.map((k, idx) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
              className="relative rounded-3xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-2 inline-flex items-center gap-2">
                <span className="rounded-full bg-andesnavy/10 px-3 py-1 text-xs font-semibold text-andesnavy">
                  {t(`memories.timeline.${k}.year`)}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-andesnavy sm:text-2xl">
                {t(`memories.timeline.${k}.title`)}
              </h3>
              <p className="mt-2 text-sm text-gray-700 sm:text-base">
                {t(`memories.timeline.${k}.desc`)}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItStarted;
