// src/utils/downloadFile.ts
import { normalizeDocUrl, maybeProxy } from "./pdfProxy";

export async function downloadFile(url: string, filename = "documento.pdf") {
  // Normaliza (Drive/Dropbox) y usa proxy si aplica
  const normalized = normalizeDocUrl(url);
  const via = maybeProxy(normalized) || normalized;

  const res = await fetch(via, { mode: "cors", cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // Intenta filename desde header
  const disp = res.headers.get("Content-Disposition") || "";
  const nameFromHeader = filenameFromContentDisposition(disp);
  const finalName = nameFromHeader || guessFileName(via, filename);

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = finalName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

export function guessFileName(url: string, fallback = "documento.pdf") {
  try {
    const u = new URL(url);
    // Preferir 'alt' cuando viene de Google UC?export=download
    const candidate = decodeURIComponent(u.pathname.split("/").pop() || "");
    if (candidate && candidate.includes(".")) return candidate;
    const disp = u.searchParams.get("response-content-disposition") || "";
    const m = /filename\*?=(?:UTF-8'')?([^;]+)/i.exec(disp);
    if (m) return decodeURIComponent(m[1].replace(/"/g, ""));
  } catch {}
  return fallback;
}

function filenameFromContentDisposition(disp: string) {
  if (!disp) return "";
  // filename*=UTF-8''...  o filename="..."
  const m1 = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(disp);
  if (m1?.[1]) return decodeURIComponent(m1[1].replace(/"/g, ""));
  const m2 = /filename\s*=\s*\"?([^\";]+)\"?/i.exec(disp);
  if (m2?.[1]) return decodeURIComponent(m2[1]);
  return "";
}
