export type Locale = 'es' | 'en';

export type Localized<T = string> = { es: T; en?: T };

export type Book = {
  id: string;                        // doc id (slug)
  title: Localized;
  description: Localized;
  author: string;
  year: number;
  originalLanguage: Locale;          // idioma del libro
  license: 'public' | 'perm' | 'external';
  file: { url?: string; storagePath?: string; mime?: string };
  coverUrl?: string;
  tags?: string[];
  sortKey: { es: string; en: string }; // para ordenar A–Z por idioma
  status: 'published' | 'draft';
  createdAt: number;
  updatedAt: number;
};

export const buildSortKey = (s: string) =>
  s.toLowerCase()
   .normalize('NFD').replace(/\p{Diacritic}/gu,'')
   .replace(/^(el|la|los|las|the)\s+/,'')
   .trim();

export const pickI18n = (loc: Localized<string>, lang: Locale) =>
  loc[lang] ?? loc.es;
