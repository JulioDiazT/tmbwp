/* src/hooks/useParqueaderosTeaser.ts */
import { useEffect, useState } from 'react';

type Parqueadero = {
  id: number; nombre: string; foto: string | null;
  lat: string; lng: string; direccion: string; tipo: string;
};

interface State {
  data: Parqueadero[];
  loading: boolean;
  error: string | null;
}

export function useParqueaderosTeaser(n = 20): State {
  const [state, setState] = useState<State>({
    data: [], loading: true, error: null
  });

  useEffect(() => {
    const URL = `${import.meta.env.VITE_API_URL}/parqueaderos/teaser?n=${n}`;

    fetch(URL)
      .then(async r => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => setState({ data: [], loading: false, error: err.message }));
  }, [n]);

  return state;
}
