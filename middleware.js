/**
 * Vercel Edge Middleware — language auto-detection.
 *
 * Hungarian is the default and lives at the site root; English lives under
 * `/en`. On a visitor's first entry we route them by signal:
 *   - an explicit `ep-lang` cookie (set by the header switch) always wins;
 *   - from Hungary (edge geo) → HU;
 *   - Hungarian browser (primary Accept-Language is hu) → HU;
 *   - country unknown → HU (safe fallback);
 *   - otherwise (known non-HU country, non-hu browser) → EN.
 *
 * We only auto-route the Hungarian-root entry — an explicit `/en` URL (e.g.
 * a shared link or a Google result) is always respected. Redirects are 307
 * (temporary): the correct language depends on the visitor, not the URL, so
 * the decision must never be cached.
 */

export const config = {
  // skip API, static assets, Vercel internals, and any file with an extension
  matcher: ['/((?!api/|assets/|_vercel/|.*\\.).*)'],
}

/**
 * Pure routing decision — returns the pathname to redirect to, or null to
 * pass the request through unchanged. Exported for unit testing.
 */
export function decide({ pathname, cookieLang, country, primaryLang }) {
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const toEn = (p) => '/en' + (p === '/' ? '' : p)
  const stripEn = (p) => p.slice(3) || '/'

  // 1) explicit choice wins — keep the visitor on their chosen language,
  //    on every path
  if (cookieLang === 'en') return isEn ? null : toEn(pathname)
  if (cookieLang === 'hu') return isEn ? stripEn(pathname) : null

  // 2) no cookie: auto-detect on any Hungarian path (home and deep pages
  //    alike), redirecting to the /en equivalent for foreign visitors. An
  //    explicit /en URL is always respected.
  if (isEn) return null

  const c = (country || '').toUpperCase()
  const known = /^[A-Z]{2}$/.test(c) && c !== 'XX' && c !== 'T1' // real ISO-2, not a placeholder
  const stayHu = !known || c === 'HU' || (primaryLang || '').toLowerCase().startsWith('hu')
  return stayHu ? null : toEn(pathname)
}

export default function middleware(request) {
  const url = new URL(request.url)
  const cookieMatch = (request.headers.get('cookie') || '').match(/(?:^|;\s*)ep-lang=(hu|en)/)
  const target = decide({
    pathname: url.pathname,
    cookieLang: cookieMatch ? cookieMatch[1] : null,
    country: request.headers.get('x-vercel-ip-country'),
    primaryLang: (request.headers.get('accept-language') || '').split(',')[0].trim(),
  })
  if (target && target !== url.pathname) {
    return Response.redirect(new URL(target + url.search, url), 307)
  }
  // no return → request continues to the static file
}
