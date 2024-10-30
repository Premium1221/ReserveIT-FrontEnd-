import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200, // or any other port you want to set
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api prefix from the URL path
      },
    },
  },
});
