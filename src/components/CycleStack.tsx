// File: src/pages/CycleStacks.tsx
import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBooksFast } from "../hooks/useBooksFast";

const COVER_CLASSES = [
  "from-emerald-400 to-teal-600",
  "from-blue-400 to-indigo-600",
  "from-fuchsia-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-lime-400 to-green-600",
  "from-cyan-400 to-sky-600",
  "from-rose-400 to-red-600",
  "from-purple-400 to-indigo-600",
];
function pickCoverClass(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_CLASSES[h % COVER_CLASSES.length];
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
      .filter((b) => b.title.toLowerCase().includes(ql) || b.author.toLowerCase().includes(ql))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [data, dq]);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 font-quicksand">
      <header className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-rubikOne uppercase tracking-wide text-andesnavy">
            {t("cyclestacks.brand") || "CICLOTECA"}
          </h1>
          <p className="text-andesnavy/70">
            {t("cyclestacks.tagline") || "Biblioteca ciclista abierta por y para la comunidad"}
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <a
            href={CONTRIBUTION_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-tmbred px-4 py-2 text-sm font-semibold text-white hover:bg-tmbred/90"
          >
            {t("cyclestacks.contribute") || "Aportar a la CicloTeca"}
          </a>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("cyclestacks.searchPh") || "Escribe un título o autor..."}
            className="w-72 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-tmbred focus:outline-none focus:ring-2 focus:ring-tmbred"
          />
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {(t("common.error") as string) || "Error"}: {error}
        </div>
      )}

      {loading && books.length === 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-48 w-full rounded-2xl bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>
            </li>
          ))}
        </ul>
      ) : books.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-8 text-center text-andesnavy/70">
          {t("cyclestacks.empty") || "Aún no hay libros. ¡Sé el primero en aportar uno!"}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <li key={b.id}>
              <Link
                to={`/cyclestacks/${b.id}`}
                className="group block rounded-2xl border border-gray-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-tmbred"
                aria-label={b.title}
              >
                {/* Cover verde con título */}
                <div className={`h-48 w-full rounded-t-2xl overflow-hidden bg-gradient-to-br ${pickCoverClass(b.id)} flex items-center justify-center text-white`}>
                  <span className="px-3 text-center text-sm font-semibold drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                    {b.title}
                  </span>
                </div>

                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-andesnavy">{b.title}</h3>
                  <p className="text-xs text-andesnavy/70">{b.author} • {b.year}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
