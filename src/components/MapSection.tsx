import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'TU_MAPBOX_TOKEN'

export default function MapSection() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const map = new mapboxgl.Map({
      container: ref.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-78.999, -2.899],   // Cuenca, EC
      zoom: 13
    })

    // Ejemplo: carga ciclovías GeoJSON
    map.on('load', () => {
      map.addSource('ciclovias', {
        type: 'geojson',
        data: '/ciclovias.geojson'
      })
      map.addLayer({
        id: 'ciclovias',
        type: 'line',
        source: 'ciclovias',
        paint: { 'line-color': '#E30613', 'line-width': 4 }
      })
    })

    return () => map.remove()
  }, [])

  return (
    <section className="h-[60vh] w-full">
      <div ref={ref} className="h-full w-full" />
    </section>
  )
}
