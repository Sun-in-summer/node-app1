import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3001,
    proxy: {
      "/api": "http://localhost:5000", // Проксирование запросов к бэкенду
    },
  },
})
