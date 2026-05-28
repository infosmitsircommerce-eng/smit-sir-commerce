import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Smit Sir Commerce',
        short_name: 'SmitSir',
        description: 'CBSE Class 11 & 12 Commerce Coaching — Notes, Quizzes, AI Doubt Solver | Mehsana',
        start_url: '/',
        display: 'standalone',
        background_color: '#030112',
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
            name: 'Ask a Doubt',
            short_name: 'Ask Doubt',
            description: 'AI Doubt Solver',
            url: '/ask',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Take a Quiz',
            short_name: 'Quiz',
            description: 'Test your knowledge',
            url: '/quizzes',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'framer': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
          'icons': ['lucide-react'],
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
