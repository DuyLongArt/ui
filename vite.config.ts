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
    // host: '127.0.0.1', // Use the explicit IPv4 instead of 'true' or 'localhost'
    proxy: {
      // String shorthand for simple cases
      '/backend': {

        target: 'https://backend.duylong.art', // Your Spring Boot URL
        changeOrigin: true,
        secure: false,

      },
      '/object': {
        target: 'https://backend.duylong.art', // Your Spring Boot URL
        changeOrigin: true,
        secure: false,
        

      }
    }
  }
})