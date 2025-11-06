import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

type Sug = {
  id: string;
  p_title: string; p_author?: string; p_year?: number|null; p_description?: string;
  status: "pending"|"in_review"|"approved"|"rejected";
  createdAt?: any;
};

export default function AdminSuggestions() {
  const [items, setItems] = useState<Sug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "suggestions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      const list: Sug[] = [];
      snap.forEach(d => list.push({ id: d.id, ...(d.data() as any) }));
      setItems(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="p-6">Cargando…</div>;

  const chip = (s: Sug["status"]) => {
    const map: Record<Sug["status"], string> = {
      pending: "bg-amber-100 text-amber-800",
      in_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[s]}`}>{s}</span>;
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="font-rubikOne text-2xl text-andesnavy mb-4">Sugerencias</h1>
      <ul className="space-y-4">
        {items.map(s => (
          <li key={s.id} className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-andesnavy">{s.p_title}</h3>
                <p className="text-sm text-andesnavy/70">
                  {s.p_author || "—"} · {s.p_year ?? "—"}
                </p>
                <div className="mt-2">{chip(s.status)}</div>
              </div>
              <div className="flex items-start gap-2">
                <Link
                  to={`/admin/suggestions/${s.id}`}
                  className="rounded-full bg-andesnavy text-white px-4 py-2 text-sm font-semibold"
                >
                  Editar y publicar
                </Link>
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-andesnavy/60">No hay sugerencias.</p>}
      </ul>
    </div>
  );
}
