/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Switched to the 'node' environment
    deps: {
      // Vitest struggles with WASM-based dependencies.
      // Inlining tells Vitest to process libsodium-wrappers
      // instead of trying to run it directly in Node.
      inline: ['libsodium-wrappers'],
    },
  },
})
