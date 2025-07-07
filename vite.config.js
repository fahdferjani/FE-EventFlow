import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Make sure Vite handles history fallback for SPA routes
    fs: { allow: ['.'] },
    historyApiFallback: true
  }
})
