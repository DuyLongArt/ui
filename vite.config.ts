import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


  server: {
    port: 22222,
    strictPort: true,
    host: true,
    proxy: {
      // String shorthand for simple cases
      '/backend_app': {
        target: 'https://backend.duylong.art', // Your Spring Boot URL
        changeOrigin: true,
        secure: false,
        // Optional: Remove /backend from the URL before sending to Spring Boot
        // rewrite: (path) => path.replace(/^\/backend/, '') 
      },
      '/object': {
        target: 'https://backend.duylong.art', // Your Spring Boot URL
        changeOrigin: true,
        secure: false,
        // Optional: Remove /backend from the URL before sending to Spring Boot
        // rewrite: (path) => path.replace(/^\/object/, '')
      }
    }
  }
})