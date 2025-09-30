import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  eager?: boolean; // true = prioriza LCP (arriba del fold)
};

export default function ImageSmart({ eager, ...img }: Props) {
  const loading = eager ? "eager" : "lazy";
  const fetchpriority = eager ? "high" : "auto";

  return (
    <img
      {...img}
      loading={loading}
      decoding="async"
      fetchPriority={fetchpriority}
    />
  );
}
