import App from './App'
import { ServicePage } from './pages/ServicePage'
import { GREENBOX, SMART_WALL, MOSAIC_WALL } from './pages/serviceData'

/**
 * Pathname-based page switch — no client-side router. Internal links between
 * pages are plain <a href> full-page navigations: every route is prerendered
 * to its own static HTML (scripts/prerender.mjs), so each load is instant
 * and crawlers see complete documents.
 */
export function Page({ path }: { path: string }) {
  const p = path.replace(/\/+$/, '') || '/'
  switch (p) {
    case '/greenbox':
      return <ServicePage data={GREENBOX} />
    case '/smart-wall':
      return <ServicePage data={SMART_WALL} />
    case '/mosaic-wall':
      return <ServicePage data={MOSAIC_WALL} />
    default:
      return <App />
  }
}
