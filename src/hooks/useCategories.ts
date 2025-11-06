import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const FALLBACK = [
  { slug: "movilidad",       labels: { es: "Movilidad Sostenible",          en: "Sustainable Mobility" } },
  { slug: "normativa",       labels: { es: "Normativa y Políticas",         en: "Policy & Regulation" } },
  { slug: "espacio-publico", labels: { es: "Espacio Público y Urbanismo",   en: "Public Space & Urban Design" } },
  { slug: "comunidad",       labels: { es: "Comunidad y Participación",     en: "Community & Participation" } },
  { slug: "seguridad-vial",  labels: { es: "Seguridad Vial y Cultura Vial", en: "Road Safety & Street Culture" } },
  { slug: "infancias",       labels: { es: "Infancias y Juventudes",        en: "Children & Youth" } },
  { slug: "genero",          labels: { es: "Género",                         en: "Gender" } },
  { slug: "datos",           labels: { es: "Datos",                          en: "Data & Evaluation" } },
];

export function useCategories() {
  const [cats, setCats] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "meta", "categories");
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const d = snap.data() as any;
        if (Array.isArray(d.slugs)) setCats(d.slugs);
      }
      setLoading(false);
    });
    // live updates (opcional)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data() as any;
        if (Array.isArray(d.slugs)) setCats(d.slugs);
      }
    });
    return () => unsub();
  }, []);

  return { categories: cats, loading };
}
