import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'Bogia Baseline Survey',
      short_name: 'BogiaSurvey',
      description: 'Offline-first village/ward baseline data collection for Bogia',
      theme_color: '#18181b',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [{
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }],
      start_url: '/',
      scope: '/'
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [{
        urlPattern: /^https:\/\/api\.tiles\.mapbox\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'mapbox-tiles-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
          }
        }
      }]
    }
  })],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  optimizeDeps: {
    exclude: ["same-runtime/dist/jsx-runtime", "same-runtime/dist/jsx-dev-runtime"]
  }
});