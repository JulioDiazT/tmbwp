// File: src/pages/CycleStacks.tsx
import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBooksFast } from "../hooks/useBooksFast";
import { Search } from "lucide-react";

/* Paleta coherente: verde, morado, tomate */
const BRAND = ["#d6ef0a", "#9958fd", "#fe8303"] as const;
const GREEN = BRAND[0];

function pickBrandIndex(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % BRAND.length;
}

const CONTRIBUTION_URL = "https://forms.gle/tu-form-id";

export default function CycleStacks() {
  const { t } = useTranslation();
  const { books: data, loading, error } = useBooksFast();

  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const books = useMemo(() => {
    const src = data || [];
    if (!dq) return [...src].sort((a, b) => a.title.localeCompare(b.title));
    const ql = dq.toLowerCase();
    return src
      .filter(
        (b) =>
          b.title.toLowerCase().includes(ql) ||
          b.author.toLowerCase().includes(ql)
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [data, dq]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pt-10 pb-14">
      {/* =================== Header =================== */}
      <header className="mb-8 md:mb-10">
        {/* Eyebrow arriba del título */}
        <div className="h-1.5 w-16 rounded-full mb-2" style={{ background: GREEN }} />
        <h1 className="font-rubikOne uppercase tracking-[0.06em] text-andesnavy text-[clamp(2rem,4.6vw,3.4rem)] leading-tight">
          {t("cyclestacks.brand", { defaultValue: "Cicloteca" }) as string}
        </h1>
        <p className="mt-1 text-andesnavy/80 text-[clamp(.98rem,1.4vw,1.1rem)] font-quicksand">
          {t("cyclestacks.tagline", {
            defaultValue: "Biblioteca ciclista abierta por y para la comunidad",
          }) as string}
        </p>

        {/* Acciones: buscador (izquierda) + sugerir (derecha) */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-center">
          {/* Buscador visible */}
          <div className="order-1 sm:order-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-andesnavy/50"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  (t("cyclestacks.searchPh") as string) ||
                  "Escribe un título o autor…"
                }
                className="w-full rounded-full bg-white px-10 py-3 text-sm text-andesnavy placeholder:text-andesnavy/50
                           border border-black/10 outline-none transition focus:ring-2"
                style={{ boxShadow: "inset 0 0 0 2px transparent" }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `inset 0 0 0 2px ${GREEN}`)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "inset 0 0 0 2px transparent")
                }
              />
            </div>
          </div>

          {/* CTA a la derecha */}
          <div className="order-2 sm:order-2 sm:justify-self-end">
            <a
              href={CONTRIBUTION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition border-2"
              style={{
                borderColor: GREEN,
                color: "#0b1120",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = GREEN;
                e.currentTarget.style.color = "#0b1120";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#0b1120";
              }}
            >
              {t("cyclestacks.contribute", {
                defaultValue: "Sugerir libro",
              }) as string}
            </a>
          </div>
        </div>
      </header>

      {/* =================== Estados =================== */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {(t("common.error") as string) || "Error"}: {error}
        </div>
      )}

      {loading && (books?.length ?? 0) === 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-52 w-full rounded-[22px] bg-neutral-200/70" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 bg-neutral-200 rounded" />
                <div className="h-3 w-1/2 bg-neutral-200 rounded" />
              </div>
            </li>
          ))}
        </ul>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-andesnavy/75">
          {t("cyclestacks.empty", {
            defaultValue: "Aún no hay libros. ¡Sé el primero en aportar uno!",
          }) as string}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => {
            const accent = BRAND[pickBrandIndex(b.id)];
            return (
              <li key={b.id}>
                <Link
                  to={`/cyclestacks/${b.id}`}
                  className="group block overflow-hidden rounded-[22px] bg-white shadow-[0_12px_34px_rgba(0,0,0,.07)] ring-1 ring-black/5 transition
                             hover:-translate-y-[2px] focus:outline-none focus:ring-2"
                  aria-label={b.title}
                >
                  {/* Cabecera sólida de color con patrón sutil */}
                  <div
                    className="h-36 w-full px-4 grid place-items-center"
                    style={{
                      background: accent,
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 6px, transparent 6px 12px)",
                    }}
                  >
                    <span className="font-rubikOne uppercase text-center text-white text-[15px] leading-snug tracking-wide drop-shadow-sm">
                      {b.title}
                    </span>
                  </div>

                  {/* Cuerpo con meta */}
                  <div className="px-4 py-4 bg-white">
                    <h3 className="line-clamp-2 text-[15px] font-extrabold text-andesnavy">
                      {b.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-andesnavy/70">
                      {b.author} • {b.year}
                    </p>

                    {/* Rail inferior del MISMO color que la cabecera */}
                    <div
                      className="mt-3 h-1.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
                      style={{ background: accent }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
