import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward all /expenses API calls to the Express backend
      '/expenses': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
