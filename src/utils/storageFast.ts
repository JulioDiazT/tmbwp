/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/utils/storageFast.ts
import { getStorage, ref as sRef, getDownloadURL } from "firebase/storage";
const storage = getStorage();

// ───────────────── cache ─────────────────
const TTL_MS = 6 * 60 * 60 * 1000;
const K = (p: string) => `dlurl:${p}`;
type Rec = { url: string; ts: number };

function getCached(p: string): string | undefined {
  try {
    const raw =
      sessionStorage.getItem(K(p)) || localStorage.getItem(K(p));
    if (!raw) return;
    const r: Rec = JSON.parse(raw);
    if (Date.now() - r.ts > TTL_MS) return;
    return r.url;
  } catch { return; }
}
function setCached(p: string, url: string) {
  const val: Rec = { url, ts: Date.now() };
  try { sessionStorage.setItem(K(p), JSON.stringify(val)); } catch {}
  try { localStorage.setItem(K(p), JSON.stringify(val)); } catch {}
}

// ───────── helpers de tipo súper seguros ─────────
const isString = (v: unknown): v is string => typeof v === "string";

function getStringProp(obj: unknown, key: string): string | undefined {
  if (obj && typeof obj === "object") {
    const v = (obj as any)[key];
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}
function getSegments(obj: unknown): string[] | undefined {
  try {
    const segs = (obj as any)?._key?.path?.segments;
    return Array.isArray(segs) ? (segs as string[]) : undefined;
  } catch { return undefined; }
}

export function isHttpUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}
export function isDriveUrl(url: string) {
  try {
    const h = new URL(url).hostname;
    return /(^|\.)drive\.google\.com$|(^|\.)docs\.google\.com$|(^|\.)google\.com$/.test(h);
  } catch { return false; }
}

// ───────── normalización ─────────
// Acepta string, StorageRef(.fullPath), DocRef(.path) o _key.path.segments.
// Corrige el caso "/https://..." => "https://..."
export function normalizePath(raw?: unknown): string | undefined {
  if (raw == null) return;

  // 1) string
  if (isString(raw)) {
    let s = raw.trim();
    if (!s) return;
    // si viene "/https://..." lo convertimos a https directo
    if (s.startsWith("/https://") || s.startsWith("/http://")) s = s.slice(1);
    if (s.startsWith("/")) s = s.slice(1);
    return s;
  }

  // 2) StorageRef → fullPath
  const fullPath = getStringProp(raw, "fullPath");
  if (fullPath) {
    let s = fullPath.trim();
    if (s.startsWith("/")) s = s.slice(1);
    return s;
  }

  // 3) Firestore DocumentRef → path
  const docPath = getStringProp(raw, "path");
  if (docPath) {
    let s = docPath.trim();
    if (s.startsWith("/")) s = s.slice(1);
    return s;
  }

  // 4) Otra forma de DocRef → _key.path.segments
  const segs = getSegments(raw);
  if (segs && segs.length) {
    let s = segs.join("/");
    if (s.startsWith("/")) s = s.slice(1);
    return s;
  }

  return;
}

export function ensureExt(p: string): string {
  if (/\.[a-z0-9]{2,6}$/i.test(p)) return p;
  if (p.startsWith("books/")) return `${p}.pdf`;
  if (p.startsWith("imgs/"))  return `${p}.jpg`;
  return p;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error("timeout")), ms);
    p.then(v => { clearTimeout(t); res(v); })
     .catch(e => { clearTimeout(t); rej(e); });
  });
}

/** Resuelve rutas a URL https de descarga (≤ 1800ms). Si ya es http(s), la devuelve. */
export async function resolveFast(raw?: unknown, timeoutMs = 1800): Promise<string | undefined> {
  const norm = normalizePath(raw);
  if (!norm) return;
  if (isHttpUrl(norm)) return norm; // http(s) directo (Drive/Storage)

  const path = ensureExt(norm);
  const cached = getCached(path);
  if (cached) return cached;

  try {
    const url = await withTimeout(getDownloadURL(sRef(storage, path)), timeoutMs);
    setCached(path, url);
    return url;
  } catch { return undefined; }
}

/** Reintento sin timeout (background) */
export async function resolveInBackground(raw?: unknown): Promise<string | undefined> {
  const norm = normalizePath(raw);
  if (!norm) return;
  if (isHttpUrl(norm)) return norm;

  const path = ensureExt(norm);
  const cached = getCached(path);
  if (cached) return cached;

  try {
    const url = await getDownloadURL(sRef(storage, path));
    setCached(path, url);
    return url;
  } catch { return undefined; }
}

// Primera página para iframe
export function pdfPreviewSrc(url: string) {
  const hash = "#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0";
  return url.includes("#") ? url : `${url}${hash}`;
}
