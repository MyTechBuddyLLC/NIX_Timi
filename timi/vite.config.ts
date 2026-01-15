/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Tími',
        short_name: 'Tími',
        description: 'A local-first, privacy-centric calendar architecture tool.',
        theme_color: '#3E5C76',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          // Note: 512x512 icon is missing. Add it here when available.
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node', // Switched to the 'node' environment
  },
})
