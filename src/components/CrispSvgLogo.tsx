import React from "react";

type Props = {
  // Componente importado con ?react (SVGR)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | any;
  alt: string;
  width: number;   // píxeles enteros (clave para nitidez)
  height: number;  // píxeles enteros
  className?: string;
};

/**
 * Renderiza el SVG inline con tamaño exacto y hints de nitidez.
 * Evita baseline, escalas fraccionales y filtros.
 */
export default function CrispSvgLogo({ Component, alt, width, height, className }: Props) {
  return (
    <figure
      className={`flex items-center justify-center ${className ?? ""}`}
      style={{ lineHeight: 0 }} // evita baseline
      aria-label={alt}
    >
      <Component
        width={width}
        height={height}
        role="img"
        aria-label={alt}
        // reforzamos props (además de los default en vite.config.ts)
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        preserveAspectRatio="xMidYMid meet"
        className="svg-logo block select-none"
        style={{
          filter: "none",
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </figure>
  );
}
