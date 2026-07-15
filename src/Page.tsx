import App from './App'
import { ServicePage } from './pages/ServicePage'
import { AiPage } from './pages/AiPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { CookieBar } from './components/CookieBar'
import { GREENBOX, SMART_WALL, MOSAIC_WALL, SELFIEBOX } from './pages/serviceData'
import { LangProvider, splitLangPath } from './i18n'

/**
 * Pathname-based page switch — no client-side router. Internal links between
 * pages are plain <a href> full-page navigations: every route is prerendered
 * to its own static HTML (scripts/prerender.mjs), so each load is instant
 * and crawlers see complete documents.
 */
export function Page({ path }: { path: string }) {
  const { lang, path: p } = splitLangPath(path)
  let page = <App />
  switch (p) {
    case '/ai-fotoautomata':
      page = <AiPage />
      break
    case '/adatkezeles':
      page = <PrivacyPage />
      break
    case '/greenbox':
      page = <ServicePage data={GREENBOX} />
      break
    case '/smart-wall':
      page = <ServicePage data={SMART_WALL} />
      break
    case '/mosaic-wall':
      page = <ServicePage data={MOSAIC_WALL} />
      break
    case '/selfiebox':
      page = <ServicePage data={SELFIEBOX} />
      break
  }
  return (
    <LangProvider lang={lang}>
      {page}
      <CookieBar />
    </LangProvider>
  )
}
