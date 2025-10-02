import React, { useEffect, useRef } from "react";

type Props = {
  /** ID del chart en Datawrapper, p.ej. "zsQUP" */
  chartId: string;
  /** Título accesible para el iframe */
  title?: string;
  /** Altura inicial mientras llega el ajuste automático */
  initialHeight?: number;
  /** Versión/opción de embed si la usas (normalmente "1") */
  version?: string | number;
  /** Clase opcional para estilos */
  className?: string;
};

const DATAWRAPPER_ORIGINS = new Set([
  "https://datawrapper.dwcdn.net",
  "https://www.datawrapper.de",
]);

/**
 * Componente para embeber gráficos de Datawrapper con auto-resize.
 * Uso:
 *   <DatawrapperEmbed chartId="zsQUP" title="Global CO₂ emissions by fuel and industry" />
 */
export default function DatawrapperEmbed({
  chartId,
  title = "Datawrapper chart",
  initialHeight = 480,
  version = 1,
  className,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Seguridad: sólo aceptar mensajes de Datawrapper
      // Si no puedes depender del origin (algunos proxys), elimina esta validación.
      if (event.origin && !Array.from(DATAWRAPPER_ORIGINS).includes(event.origin)) return;

      const data = event.data as Record<string, any>;
      if (!data || typeof data !== "object") return;

      const heights = data["datawrapper-height"] as Record<string, number> | undefined;
      if (!heights) return;

      // Datawrapper envía un objeto { [chartId]: height }
      // Ajusta la altura del iframe que corresponda.
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Si el mensaje trae una clave exacta del chartId, úsala.
      if (heights[chartId]) {
        iframe.style.height = `${heights[chartId]}px`;
        return;
      }

      // Fallback: si no coincide, pero hay alguna altura, y el mensaje proviene del mismo contentWindow
      // (útil cuando hay varios iframes en la página).
      if (event.source && iframe.contentWindow === event.source) {
        // Toma el primer valor disponible
        const firstKey = Object.keys(heights)[0];
        if (firstKey) {
          iframe.style.height = `${heights[firstKey]}px`;
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [chartId]);

  const src = `https://datawrapper.dwcdn.net/${chartId}/${version}/`;

  return (
    <div className={className} style={{ width: "100%" }}>
      <iframe
        ref={iframeRef}
        title={title}
        id={`datawrapper-chart-${chartId}`}
        src={src}
        scrolling="no"
        frameBorder={0}
        loading="lazy"
        // estilo recomendado por Datawrapper para ancho fluido
        style={{
          width: 0,
          minWidth: "100%",
          border: "none",
          height: initialHeight,
        }}
        // hint para navegadores móviles
        allow="clipboard-read; clipboard-write"
        // marca para integraciones externas
        data-external="1"
      />
    </div>
  );
}
