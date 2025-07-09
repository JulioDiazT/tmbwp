/* src/components/ParqueaderosTeaserMap.tsx */
import { useState, useMemo } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { Bike, X } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

import defaultPhoto from '../assets/defaultPhoto.png';
import { useParqueaderosTeaser } from '../hooks/useParqueaderosTeaser';

type Parqueadero = {
  id: number;
  nombre: string;
  foto: string | null;
  lat: string;
  lng: string;
  direccion: string;
  tipo: string;
};

export default function ParqueaderosTeaserMap() {
  const { data: parks, loading, error } = useParqueaderosTeaser();
  const [selected, setSelected] = useState<Parqueadero | null>(null);

  /* ---------- vista inicial ---------- */
  const initialView = useMemo(() => {
    if (!parks.length) return { longitude: -79, latitude: -2.9, zoom: 13 };

    const lons = parks.map(p => +p.lng);
    const lats = parks.map(p => +p.lat);

    return {
      longitude: (Math.min(...lons) + Math.max(...lons)) / 2,
      latitude : (Math.min(...lats) + Math.max(...lats)) / 2,
      zoom: 13,
    };
  }, [parks]);

  if (loading) return <p className="py-10 text-center">Cargando mapa…</p>;
  if (error)   return <p className="py-10 text-center text-red-600">{error}</p>;

  /* ---------- render ---------- */
  return (
    <section className="my-16 w-full h-[70vh]">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Puntos&nbsp;TMB&nbsp;(parqueaderos &amp; talleres)
      </h2>

      <Map
        {...initialView}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setSelected(null)}
      >
        <NavigationControl position="bottom-right" />

        {parks.map(p => (
          <Marker
            key={p.id}
            longitude={+p.lng}
            latitude={+p.lat}
            anchor="bottom"
            onClick={e => {
              // e ya está tipado como mapboxgl.MapboxEvent<MouseEvent>
              (e.originalEvent as MouseEvent | PointerEvent).stopPropagation();
              setSelected(p);
            }}
          >
            <Bike
              size={32}
              className="text-primary hover:text-accent transition-colors"
            />
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={+selected.lng}
            latitude={+selected.lat}
            anchor="top"
            offset={[0, 6]}
            closeButton={false}
            className="p-0 border-none"
            onClose={() => setSelected(null)}
          >
            <PopupCard park={selected} onClose={() => setSelected(null)} />
          </Popup>
        )}
      </Map>
    </section>
  );
}

/* ---------- tarjeta del pop-up ---------- */
function PopupCard({
  park,
  onClose,
}: {
  park: Parqueadero;
  onClose: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative w-72 sm:w-80">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
      >
        <X size={18} />
      </button>

      <img
        src={park.foto || defaultPhoto}
        alt={park.nombre}
        className="h-32 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold leading-tight">{park.nombre}</h3>
        <p className="text-sm text-gray-600">{park.direccion}</p>

        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
          {park.tipo}
        </span>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2 text-sm text-primary hover:underline"
        >
          Cómo llegar →
        </a>
      </div>
    </div>
  );
}
