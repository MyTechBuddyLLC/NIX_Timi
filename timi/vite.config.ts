/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version)
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Switched to the 'node' environment
  },
})
