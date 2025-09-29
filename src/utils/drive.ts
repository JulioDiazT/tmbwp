// File: src/utils/drive.ts

// Quita BOMs, espacios invisibles, comillas y slashes iniciales, etc.
const CLEAN_HEAVY = (input: string) =>
  input
    .replace(/^\uFEFF/, "")         // BOM
    .replace(/[\u200B-\u200D\u2060]/g, "") // zero-width spaces
    .trim()
    .replace(/^\/+/, "")            // slashes al inicio
    .replace(/^"+|"+$/g, "")        // comillas dobles
    .replace(/^'+|'+$/g, "");       // comillas simples

export function isDriveHost(host: string) {
  const h = host.toLowerCase();
  return (
    h.endsWith("drive.google.com") ||
    h.endsWith("docs.google.com") ||
    h === "google.com" ||
    h.endsWith(".google.com")
  );
}

// Intenta localizar la “sub-URL de Drive” dentro de cualquier string (aunque tenga basura antes)
function pluckDriveUrl(raw: string): string | null {
  const s = CLEAN_HEAVY(raw);

  // 1) Si trae http(s) en algún punto, recorto desde la primera ocurrencia
  const httpIdx = s.indexOf("http");
  if (httpIdx >= 0) {
    const cut = s.slice(httpIdx).trim();
    try {
      const u = new URL(cut);
      if (isDriveHost(u.hostname)) return u.toString();
    } catch {
      // si falla, seguimos probando
    }
  }

  // 2) Si no trae http pero sí drive/docs, les agrego https://
  if (s.includes("drive.google.com") || s.includes("docs.google.com")) {
    try {
      const candidate = s.startsWith("http") ? s : `https://${s}`;
      const u = new URL(candidate);
      if (isDriveHost(u.hostname)) return u.toString();
    } catch {
      // seguimos probando con regex
    }
  }

  // 3) Como último recurso, si el string contiene la ruta /file/d/<ID> o /d/<ID>, devuelvo una URL mínima
  const m1 = /\/file\/d\/([A-Za-z0-9_-]+)/.exec(s);
  if (m1?.[1]) return `https://drive.google.com/file/d/${m1[1]}/view?usp=sharing`;

  const m2 = /\/d\/([A-Za-z0-9_-]+)/.exec(s);
  if (m2?.[1]) return `https://drive.google.com/file/d/${m2[1]}/view?usp=sharing`;

  // 4) Si hay id=XXXX en el texto, también sirve
  const m3 = /[?&]id=([A-Za-z0-9_-]+)/.exec(s);
  if (m3?.[1]) return `https://drive.google.com/file/d/${m3[1]}/view?usp=sharing`;

  return null;
}

/** Extrae el ID del archivo Drive desde una URL o string */
export function extractDriveId(raw?: unknown): string | null {
  if (!raw) return null;
  const urlStr = pluckDriveUrl(String(raw));
  if (!urlStr) {
    // Si el string “parece” un ID directo, úsalo
    const s = CLEAN_HEAVY(String(raw));
    if (/^[A-Za-z0-9_-]{20,}$/.test(s)) return s;
    return null;
  }

  try {
    const u = new URL(urlStr);

    // ?id=...
    const idQ = u.searchParams.get("id");
    if (idQ) return idQ;

    // /file/d/<ID> o /d/<ID>
    const m = /\/(?:file\/)?d\/([^/]+)/.exec(u.pathname);
    if (m?.[1]) return m[1];

    return null;
  } catch {
    return null;
  }
}

/** URLs útiles a partir del ID del archivo */
export function driveUrlsFromId(id: string) {
  return {
    viewUrl: `https://drive.google.com/file/d/${id}/view?usp=sharing`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
  };
}

/**
 * Resultado robusto:
 * - Si hay ID: devuelve {viewUrl, downloadUrl}
 * - Si no hay ID pero detecta una URL de Drive, al menos {viewUrl}
 * - Caso contrario: null
 */
export function driveFromAny(raw?: unknown) {
  if (!raw) return null;

  // 1) Intento directo por ID
  const id = extractDriveId(raw);
  if (id) return driveUrlsFromId(id);

  // 2) Al menos un viewUrl si es de Drive
  const view = pluckDriveUrl(String(raw));
  if (view) return { viewUrl: view, downloadUrl: undefined };

  return null;
}
