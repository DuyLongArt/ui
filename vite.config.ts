import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),

  tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/DataLayer/LocalDataLayer/assets'),
    },
  },


  server: {
    port: 22222,
    strictPort: true,
    host: true,

    // host: '127.0.0.1', // Use the explicit IPv4 instead of 'true' or 'localhost'
    proxy: {
      // String shorthand for simple cases
      '/backend': {

        target: 'https://backend.duylong.art', // Your Spring Boot URL
        changeOrigin: true,
        secure: false,

      },
      '/object': {
        target: 'http://192.168.22.4:9000', // Your Spring Boot URL
        changeOrigin: true,
        secure: false,
      },
      '/tailscale-api': {
        target: 'https://api.tailscale.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tailscale-api/, '/api/v2'),
        secure: true,
      },
      '/cloudflare-graphql': {
        target: 'https://api.cloudflare.com/client/v4/graphql',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudflare-graphql\/?/, ''),
        secure: true,
      },
      '/api': {
        target: 'https://truenas.duylong.art',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
