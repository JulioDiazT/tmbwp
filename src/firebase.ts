// File: src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET, // <-- debe ser .appspot.com
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
  // Logs útiles en consola del navegador
  console.log("[Firebase project]", app.options?.projectId);
  // @ts-ignore
  console.log("[Firebase bucket]", app.options?.storageBucket);
}

export const db = getFirestore(app);
export const storage = getStorage(app);
