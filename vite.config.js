import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the build works on GitHub Pages' /<repo>/ subpath
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
