import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  /** When `truenas.duylong.art` does not resolve (ENOTFOUND), set e.g. `https://192.168.1.10` in `.env.local`. */
  const truenasProxyTarget = env.VITE_TRUENAS_PROXY_TARGET || 'https://truenas.duylong.art'

  return {
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
      '/user-profiles': {
        target: 'http://192.168.22.4:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user-profiles/, ''),
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
        target: truenasProxyTarget,
        changeOrigin: true,
        secure: true,
      },
      '/gomedia': {
        target: 'https://media.duylong.art',
        changeOrigin: true,
        secure: true,
      }
    }
  }
  }
})
