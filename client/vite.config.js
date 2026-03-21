import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico','icons/icon-192.png','icons/icon-512.png'],
      manifest: {
        name: 'Gambia Marketplace',
        short_name: 'GMB Market',
        description: 'Local listings for The Gambia',
        theme_color: '#1A5C6B',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          { // Stale-while-revalidate for API
            urlPattern: /^https?:.*\/api\/listings/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-listings', expiration: { maxEntries: 60, maxAgeSeconds: 3600 } }
          },
          { // Cache-first for Supabase images
            urlPattern: /supabase\.co\/storage/,
            handler: 'CacheFirst',
            options: { cacheName: 'listing-images', expiration: { maxEntries: 100, maxAgeSeconds: 86400 } }
          }
        ]
      }
    })
  ],
  server: { proxy: { '/api': 'http://localhost:3001' } }
});
