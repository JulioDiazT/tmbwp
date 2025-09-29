// src/components/InstagramFeed.tsx
import { FC, useEffect } from 'react'

/**
 * Embeds the Instagram feed using SociableKIT (embed ID 25577737).
 * El script se inyecta una sola vez aunque el componente se monte varias veces.
 */
const InstagramFeed: FC = () => {
  useEffect(() => {
    // Evita cargar el script más de una vez
    if (document.getElementById('sk-instagram-feed-script')) return

    const script = document.createElement('script')
    script.id = 'sk-instagram-feed-script'
    script.src = 'https://widgets.sociablekit.com/instagram-feed/widget.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <div
      className="sk-instagram-feed w-full h-[500px] max-w-5xl mx-auto"
      data-embed-id="25577737"
    />
  )
}

export default InstagramFeed
