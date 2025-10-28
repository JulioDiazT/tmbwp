// src/utils/pdfProxy.ts
const ALWAYS_PROXY_HOSTS = [
  "drive.google.com",
  "docs.google.com",
  "dropbox.com",
  "dl.dropboxusercontent.com",
  "github.com",
  "raw.githubusercontent.com",
];

const PROXY_ORIGIN = import.meta.env.VITE_PDF_PROXY_ORIGIN || "";

/** Convierte enlaces “view” a descarga directa (Drive/Dropbox) para pdf.js */
export function normalizeDocUrl(u: string) {
  try {
    const url = new URL(u);

    // Google Drive: /file/d/:id/view -> uc?export=download&id=:id
    if (url.hostname === "drive.google.com" && url.pathname.includes("/file/d/")) {
      const id = url.pathname.split("/file/d/")[1]?.split("/")[0];
      if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
    }

    // Dropbox: www.dropbox.com -> dl.dropboxusercontent.com (y quita ?dl=0)
    if (url.hostname.endsWith("dropbox.com")) {
      url.hostname = "dl.dropboxusercontent.com";
      url.searchParams.delete("dl");
      return url.toString();
    }

    return u;
  } catch {
    return u;
  }
}

/** Devuelve URL proxificada si el host lo requiere (o si configuraste proxy). */
export function maybeProxy(u: string) {
  if (!PROXY_ORIGIN) return null;
  try {
    const url = new URL(u);
    if (
      ALWAYS_PROXY_HOSTS.some((h) => url.hostname.endsWith(h)) ||
      url.hostname.endsWith("firebasestorage.googleapis.com")
    ) {
      return `${PROXY_ORIGIN}/?u=${encodeURIComponent(u)}`;
    }
    return null;
  } catch {
    return `${PROXY_ORIGIN}/?u=${encodeURIComponent(u)}`;
  }
}
