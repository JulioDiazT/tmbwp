// src/utils/ensureAuth.ts
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

export async function ensureAuth() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) return user;
  return await new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { unsub(); resolve(u); }
      else {
        try {
          const cred = await signInAnonymously(auth);
          unsub(); resolve(cred.user);
        } catch (e) {
          unsub(); reject(e);
        }
      }
    });
  });
}
