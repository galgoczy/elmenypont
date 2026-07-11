import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static marketing site with prerendered subpages (/greenbox, …). The base
// must be absolute: relative asset paths would resolve under the subpage
// directories (/greenbox/assets/… → 404). The site is always served from
// the domain root (Vercel), so '/' is safe.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
