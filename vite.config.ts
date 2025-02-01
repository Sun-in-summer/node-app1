import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: './frontend',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:3001"// Проксирование запросов к бэкенду
    },
  },
})
