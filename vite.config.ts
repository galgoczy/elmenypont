import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static single-page marketing site. Relative base so it can be hosted from
// any sub-path (CDN, sub-folder embed) without rewrites.
export default defineConfig({
  base: './',
  plugins: [react()],
})
