import React, { useLayoutEffect, useRef } from "react";
import BannerMemories from "../components/BannerMemories";
import HowItStarted from "../components/HowItStarted";
import MemoriesGallery from "../components/MemoriesGallery";
import MemoriesCTA from "../components/MemoriesCTA";

// scroll-top al entrar (con foco accesible opcional)
function useScrollTopOnMount(focusRef?: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const el = focusRef?.current;
    if (el && typeof el.focus === "function") el.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const MemoriesPage: React.FC = () => {
  // TIP: evita el error de tipos usando HTMLElement | null
  const mainRef = useRef<HTMLElement | null>(null);
  useScrollTopOnMount(mainRef);

  return (
    <>
      <BannerMemories />

      {/* Contenido principal navegable por teclado */}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="outline-none"
        aria-label="Recuerdos"
      >
        <HowItStarted />
        <MemoriesGallery />
        <MemoriesCTA />
      </main>
    </>
  );
};

export default MemoriesPage;
