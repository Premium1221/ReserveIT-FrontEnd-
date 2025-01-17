import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    host: '0.0.0.0',
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        withCredentials: true
      }
    }
  },
  define: {
    global: 'window', // Add this to fix the SockJS global error
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})