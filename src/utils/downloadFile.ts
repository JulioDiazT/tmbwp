// File: src/utils/downloadFile.ts
export async function downloadFile(url: string, filename = "documento.pdf") {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
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
    const name = decodeURIComponent(u.pathname.split("/").pop() || "");
    if (name && name.includes(".")) return name;
    const disp = u.searchParams.get("response-content-disposition") || "";
    const m = /filename\*?=(?:UTF-8'')?([^;]+)/i.exec(disp);
    if (m) return decodeURIComponent(m[1].replace(/"/g, ""));
  } catch {}
  return fallback;
}
