import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // Propiedades por defecto para los SVGs como componente
        svgProps: {
          focusable: 'false',
          role: 'img'
        },
        // Mantén vector puro y limpia atributos conflictivos
        dimensions: false,          // evita width/height fijos
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            { name: 'removeDimensions', active: true },
            { name: 'convertStyleToAttrs', active: true },
            { name: 'removeXMLNS', active: true },
            { name: 'removeUselessDefs', active: true },
            { name: 'cleanupIDs', active: true },
            { name: 'convertTransform', active: true }
          ]
        }
      }
    })
  ]
})
