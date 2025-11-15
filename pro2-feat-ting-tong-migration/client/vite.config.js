import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Zapytania do /api będą przekierowywane na serwer backendu
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true, // Ważne dla wirtualnych hostów
        secure: false,      // Jeśli backend nie ma HTTPS
      },
    },
  },
})
