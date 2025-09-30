// src/components/ScrollToTop.tsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    // Fuerza ir arriba del todo en cada navegación
    // (si quieres animado, cambia behavior a 'smooth')
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  // incluye search/hash si también quieres resetear al cambiar query o ancla
  }, [pathname, search, hash]);

  return null;
}
