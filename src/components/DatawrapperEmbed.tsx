// src/components/DatawrapperEmbed.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  chartId: string;               // ej: "zsQUP"
  version?: string | number;     // ej: 1, 2, 3... (tras REPUBLISH cambia)
  title?: string;
  initialHeight?: number;
  className?: string;
  cacheKey?: string | number;    // opcional, para forzar recarga si el navegador cachea
};

const DATAWRAPPER_ORIGINS = new Set([
  "https://datawrapper.dwcdn.net",
  "https://www.datawrapper.de",
]);

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [options]);
  return { ref, inView } as const;
}

export default function DatawrapperEmbed({
  chartId,
  version = 1,
  title = "Datawrapper chart",
  initialHeight = 480,
  className,
  cacheKey,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" });
  const [height, setHeight] = useState(initialHeight);

  const src = useMemo(() => {
    const base = `https://datawrapper.dwcdn.net/${chartId}/${version}/`;
    return cacheKey ? `${base}?k=${encodeURIComponent(String(cacheKey))}` : base;
  }, [chartId, version, cacheKey]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin && !DATAWRAPPER_ORIGINS.has(event.origin)) return;
      const data = event.data as Record<string, any>;
      const heights = data?.["datawrapper-height"] as Record<string, number> | undefined;
      if (!heights) return;
      const h = heights[chartId] ?? heights[Object.keys(heights)[0]];
      if (typeof h === "number" && h > 0) setHeight(h);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [chartId]);

  return (
    <div ref={ref} className={className} style={{ width: "100%" }} aria-label={title}>
      {inView ? (
        <iframe
          ref={iframeRef}
          id={`datawrapper-chart-${chartId}`}
          title={title}
          src={src}
          scrolling="no"
          frameBorder={0}
          loading="lazy"
          style={{ width: "100%", border: "none", height }}
          data-external="1"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      ) : (
        <div className="w-full rounded-xl bg-neutral-100 animate-pulse" style={{ height }} />
      )}
    </div>
  );
}
