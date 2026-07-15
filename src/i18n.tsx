import { createContext, useContext, type ReactNode } from 'react'

/**
 * Tiny i18n layer. Hungarian is the canonical language and lives at the root
 * (`/`, `/greenbox`, …); English lives under an `/en` prefix (`/en`,
 * `/en/greenbox`, …). Copy is translated inline at the call site with
 * `t('magyar', 'english')` — no central key registry to drift out of sync —
 * and English falls back to Hungarian when a string hasn't been translated
 * yet, so the site never renders blank during a staged rollout.
 */

export type Lang = 'hu' | 'en'

const LangContext = createContext<Lang>('hu')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useLang(): Lang {
  return useContext(LangContext)
}

/** translator hook: `const t = useT(); t('Kapcsolat', 'Contact')` */
export function useT() {
  const lang = useContext(LangContext)
  return (hu: string, en?: string) => (lang === 'en' ? en ?? hu : hu)
}

/** split a pathname into its language and the HU-canonical route */
export function splitLangPath(pathname: string): { lang: Lang; path: string } {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/en' || clean.startsWith('/en/')) {
    const rest = clean.slice(3) || '/'
    return { lang: 'en', path: rest.startsWith('/') ? rest : `/${rest}` }
  }
  return { lang: 'hu', path: clean }
}

/** build the URL for a canonical route in a given language */
export function localizedPath(path: string, lang: Lang): string {
  const base = path === '/' ? '' : path
  return lang === 'en' ? `/en${base}` : path || '/'
}
