// File: src/hooks/useBooksFast.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, DocumentData } from "firebase/firestore";

export type BookItem = {
  id: string;
  title: string;
  author: string;
  year: number;
  description: string;
};

export function useBooksFast() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qy = query(collection(db, "books"));
    const unsub = onSnapshot(
      qy,
      (snap) => {
        try {
          const list: BookItem[] = snap.docs.map((d) => {
            const v = d.data() as DocumentData;
            return {
              id: d.id,
              title: String(v.title ?? v.name ?? ""),
              author: String(v.author ?? v.autor ?? ""),
              year: Number(v.year ?? 0),
              description: String(v.description ?? ""),
            };
          });
          setBooks(list);
          setLoading(false);
        } catch (e: any) {
          setError(e.message || "Error");
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { books, loading, error };
}
