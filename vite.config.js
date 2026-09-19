import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return;
          // Keep React out of the animation chunk so mobile pages can render
          // without downloading decorative motion code.
          if (/\/node_modules\/(?:react|react-dom|scheduler)\//.test(id)) return 'react-vendor';
          if (/\/node_modules\/(?:react-router|react-router-dom|@remix-run\/router)\//.test(id)) return 'router';
          if (/\/node_modules\/(?:framer-motion|motion-dom|motion-utils)\//.test(id)) return 'framer';
          if (id.includes('/node_modules/@supabase/')) return 'supabase';
        },
      },
    },
    cssMinify: true,
    sourcemap: false,
  },
  server: {
    hmr: { overlay: true },
  },
})
