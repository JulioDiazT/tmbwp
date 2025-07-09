import { useTranslation } from 'react-i18next'

interface EventCard {
  id: number
  title: string
  date: string   // ISO 2025-08-12
  img: string
}

const MOCK: EventCard[] = [
  { id: 1, title: 'Ciclopaseo Nocturno', date: '2025-08-14', img: '/src/assets/event1.jpg' },
  { id: 2, title: 'Bici‐escuela Infantil', date: '2025-08-24', img: '/src/assets/event2.jpg' },
  { id: 3, title: 'Rodada Empresas', date: '2025-09-02', img: '/src/assets/event3.jpg' }
]

export default function EventsPreview() {
  const { t, i18n } = useTranslation()

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' })

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="mb-8 text-center font-display text-3xl font-bold text-neutral-900">
        {t('events.upcoming')}
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {MOCK.map(({ id, title, date, img }) => (
          <article key={id} className="overflow-hidden rounded-xl shadow hover:shadow-lg transition">
            <img src={img} alt={title} className="h-48 w-full object-cover" />
            <div className="space-y-2 bg-white p-4">
              <p className="text-sm font-semibold text-primary">{fmt(date)}</p>
              <h3 className="font-semibold text-neutral-900">{title}</h3>
              <a
                href={`https://forms.gle/xyz?event=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
              >
                {t('events.join')}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
