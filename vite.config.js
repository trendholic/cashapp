import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Strip the crossorigin attribute Vite adds to <script>/<link> tags so the
// build also loads from CDNs/hosts that don't send CORS headers.
function stripCrossorigin() {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin/g, '')
    },
  }
}

export default defineConfig({
  // Relative base so the build works on GitHub Pages' /<repo>/ subpath
  base: './',
  plugins: [react(), stripCrossorigin()],
  server: {
    host: true,
    port: 5173,
  },
})
