// src/utils/image-preload.ts
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

const memo = new Set<string>();
export function preloadOnce(srcs: string[]) {
  srcs.forEach(src => {
    if (!src || memo.has(src)) return;
    memo.add(src);
    preloadImage(src).catch(() => {});
  });
}
