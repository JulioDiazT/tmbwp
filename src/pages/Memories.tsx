import React, { useLayoutEffect, useRef } from 'react';
import BannerMemories     from '../components/BannerMemories';
import MemoriesGallery    from '../components/MemoriesGallery';
import PedalsBlog from '../components/PedalsBlog';

// Hook mínimo para garantizar scroll-top al montar y foco accesible
function useScrollTopOnMount(focusRef?: React.RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    // “auto” = instantáneo; evita scroll suave involuntario al entrar
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    focusRef?.current?.focus?.();
  }, []);
}

/** “Memories” – visual recollections hub */
export const MemoriesPage = () => {
  const mainRef = useRef<HTMLElement | null>(null); 
  useScrollTopOnMount();

  return (
    <>
      {/* Hero banner (GSAP-pinned, con fallback RRM) */}
      <BannerMemories />

      {/* Contenido principal navegable con teclado (skip-to-content friendly) */}
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="outline-none"
        aria-label="Contenido de recuerdos"
      >
        {/* Circular gallery */}
        <MemoriesGallery />
        <PedalsBlog/>

   

      </main>
    </>
  );
};

export default MemoriesPage;
