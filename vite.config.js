import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    {
      name: 'enhanced-test-series-entry',
      enforce: 'pre',
      resolveId(source, importer) {
        if (source === './pages/TestSeries' && importer?.endsWith('/src/App.jsx')) {
          return fileURLToPath(new URL('./src/pages/TestSeriesPro.jsx', import.meta.url))
        }
        return null
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Smit Sir Commerce',
        short_name: 'SmitSir',
        description: 'CBSE and GSEB Commerce study material — notes, PDFs, practice, quizzes and tools | Mehsana',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#FAF6EE',
        theme_color: '#D4AF37',
        orientation: 'portrait-primary',
        categories: ['education'],
        lang: 'en-IN',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          {
            name: 'Study Material',
            short_name: 'Notes',
            description: 'Open free Commerce notes and PDFs',
            url: '/study-material',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Economics Quizzes',
            short_name: 'Quizzes',
            description: 'Open chapter-wise Economics quizzes',
            url: '/quizzes',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [
          /^\/games(?:\/|\?|$)/,
          /^\/materials\//,
          /^\/cbse\//,
          /^\/cbse-notes(?:\/|\?|$)/,
          /^\/cbse-practice(?:\/|\?|$)/,
          /^\/practice\//,
          /^\/tests\//,
          /^\/sitemap\.xml(?:\?|$)/,
          /^\/robots\.txt(?:\?|$)/,
          /\.pdf(?:\?|$)/i,
        ],
        globPatterns: ['index.html', '**/*.{js,css,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ssc-navigation-fresh-v2',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
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
          if (id.includes('/node_modules/lucide-react/')) return 'icons';
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
