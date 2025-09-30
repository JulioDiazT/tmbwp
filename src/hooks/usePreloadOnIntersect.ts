// src/hooks/usePreloadOnIntersect.ts
import { useEffect, useRef } from "react";
import { preloadOnce } from "../utils/image-preload";

type Options = {
  rootMargin?: string;
  once?: boolean;
};

export function usePreloadOnIntersect(urls: string[], options: Options = {}) {
  const { rootMargin = "1000px 0px", once = true } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const io = new IntersectionObserver(
      entries => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        if (once && done.current) return;

        preloadOnce(urls);
        done.current = true;
        if (once) io.unobserve(el);
      },
      { root: null, rootMargin, threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [urls, rootMargin, once]);

  return ref;
}
