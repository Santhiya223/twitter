import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  server: {
    port : 5000,
    proxy: {"/api": {
      target: "http://localhost:5000",
      changeOrigin: true
    }}
  }
})
