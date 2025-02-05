import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/',
  logLevel:'error',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server:{
    proxy:{
      '/api/emojis': {
        target: 'https://emoji-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/emojis/, '/emojis'),
      },
    }
  }
  
})
