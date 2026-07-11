import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Post-build prerender: bakes each route's server-rendered HTML into static
 * files (dist/index.html, dist/<route>/index.html) so the page text is
 * present without JavaScript — search engines need an indexed,
 * snippet-eligible page, and a client-only SPA makes that fragile. The
 * per-route head fields (title, description, canonical, OG) are patched
 * into the shared template here too.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(resolve(root, 'dist-ssr/ssg-entry.js'))

const ORIGIN = 'https://elmeny.hu'

const ROUTES = [
  {
    path: '/',
    out: 'dist/index.html',
    // '/' keeps the template's own head untouched
  },
  {
    path: '/greenbox',
    out: 'dist/greenbox/index.html',
    title: 'Greenbox fotózás bérlés rendezvényre | Élménypont — Greenbox Selfiemata',
    description:
      'Zöld hátteres stúdió-automata rendezvényre: 24"-os érintőképernyő, élő előnézet, kész fotó 15 másodperc alatt nyomtatva vagy online. 80 000 Ft-tól, Budapesten.',
  },
  {
    path: '/smart-wall',
    out: 'dist/smart-wall/index.html',
    title: 'Smart Wall — interaktív fal bérlés rendezvényre | Élménypont',
    description:
      'Érintésre életre kelő vetített fal konferenciára, kiállításra, termékbemutatóra. AI-alapú tartalomgyártással már 450 000 Ft-tól — a rendezvényed arculatában.',
  },
  {
    path: '/mosaic-wall',
    out: 'dist/mosaic-wall/index.html',
    title: 'Mosaic Wall — mozaikfal rendezvényre | Élménypont',
    description:
      'A vendégek fotóiból közösen összeálló nagy mozaikkép: fotózz, nyomtass, ragassz. 200 darabos mozaik 450 000 Ft-tól. Nagylétszámú rendezvényekre.',
  },
]

const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
const MOUNT = '<div id="root"></div>'
if (!template.includes(MOUNT)) {
  throw new Error('prerender: mount point <div id="root"></div> not found in dist/index.html')
}

/** swap the template's per-page head fields for a subroute */
function patchHead(html, route) {
  const url = `${ORIGIN}${route.path}`
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${route.description}$2`,
    )
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${route.title}$2`)
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${route.description}$2`,
    )
}

for (const route of ROUTES) {
  const body = render(route.path)
  const page = route.title ? patchHead(template, route) : template
  const out = resolve(root, route.out)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, page.replace(MOUNT, `<div id="root">${body}</div>`))
  console.log(`prerendered ${route.path} -> ${route.out} (${(body.length / 1024).toFixed(1)}kB body)`)
}
