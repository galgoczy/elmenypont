import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Post-build prerender: bakes each route's server-rendered HTML into static
 * files so the page text is present without JavaScript. Every route is
 * emitted in both languages — Hungarian at the root (dist/<route>/index.html)
 * and English under /en (dist/en/<route>/index.html) — with localized head
 * fields, <html lang>, and reciprocal hreflang links for SEO.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(resolve(root, 'dist-ssr/ssg-entry.js'))

const ORIGIN = 'https://elmeny.hu'

// NOTE: descriptions land inside content="…" — never use a double quote in
// them (a bare " truncates the attribute; that bug once cut the greenbox
// description at `24"`)
const ROUTES = [
  {
    path: '/',
    // HU home keeps the template's own head; EN home is patched below
    en: {
      title: 'AI photo booth rental for events — AI Selfiemata | Élménypont',
      description:
        'Real-time AI image generation at your event: a guest photo becomes a unique, shareable, branded artwork in 9–15 seconds. Videomata, greenbox and interactive walls — turnkey, from one team.',
    },
  },
  {
    path: '/ai-fotoautomata',
    hu: {
      title: 'AI fotóautomata bérlés rendezvényre — AI Selfiemata | Élménypont',
      description:
        'Valós idejű AI-képgenerálás rendezvényre: a vendég fotójából 9–15 másodperc alatt egyedi, brandingelt alkotás készül. Nem arccsere — teljes képi újragenerálás. 105 000 Ft-tól.',
      ogImage: 'https://elmeny.hu/assets/photos/ai/hero-uhajos-full.jpg',
    },
    en: {
      title: 'AI photo booth (AI Selfiemata) rental for events | Élménypont',
      description:
        'Real-time AI image generation for events: a guest photo becomes a unique, branded artwork in 9–15 seconds. Not a face swap — full image regeneration. From 105 000 HUF.',
      ogImage: 'https://elmeny.hu/assets/photos/ai/hero-uhajos-full.jpg',
    },
  },
  {
    path: '/adatkezeles',
    hu: {
      title: 'Adatkezelési tájékoztató | Élménypont',
      description: 'Az elmeny.hu ajánlatkérő űrlapján megadott személyes adatok kezelésének feltételei.',
    },
    en: {
      title: 'Privacy policy | Élménypont',
      description: 'How personal data submitted through the elmeny.hu quote-request form is processed.',
    },
  },
  {
    path: '/greenbox',
    hu: {
      title: 'Greenbox fotózás bérlés rendezvényre | Élménypont — Greenbox Selfiemata',
      description:
        'Zöld hátteres stúdió-automata rendezvényre: 24 hüvelykes érintőképernyő, élő előnézet, kész fotó 15 másodperc alatt nyomtatva vagy online. 80 000 Ft-tól, Budapesten.',
      ogImage: 'https://elmeny.hu/assets/photos/greenbox-before-after.jpg',
    },
    en: {
      title: 'Greenbox photo studio rental for events | Élménypont — Greenbox Selfiemata',
      description:
        'Green-screen studio automat for events: 24-inch touchscreen, live preview, finished photo in 15 seconds — printed or online. From 80 000 HUF, in Budapest.',
      ogImage: 'https://elmeny.hu/assets/photos/greenbox-before-after.jpg',
    },
  },
  {
    path: '/smart-wall',
    hu: {
      title: 'Smart Wall — interaktív fal bérlés rendezvényre | Élménypont',
      description:
        'Érintésre életre kelő vetített fal konferenciára, kiállításra, termékbemutatóra. AI-alapú tartalomgyártással már 600 000 Ft-tól — a rendezvényed arculatában.',
      ogImage: 'https://elmeny.hu/assets/photos/smartwall-event.jpg',
    },
    en: {
      title: 'Smart Wall — interactive projection wall rental for events | Élménypont',
      description:
        'A projected wall that comes alive at a touch — for conferences, expos and product launches. With AI-assisted content production from 600 000 HUF, in your event branding.',
      ogImage: 'https://elmeny.hu/assets/photos/smartwall-event.jpg',
    },
  },
  {
    path: '/mosaic-wall',
    hu: {
      title: 'Mosaic Wall — mozaikfal rendezvényre | Élménypont',
      description:
        'A vendégek fotóiból közösen összeálló nagy mozaikkép: fotózz, nyomtass, ragassz. 200 darabos mozaik 450 000 Ft-tól. Nagylétszámú rendezvényekre.',
      ogImage: 'https://elmeny.hu/assets/photos/mosaic-wall-real.jpg',
    },
    en: {
      title: 'Mosaic Wall — photo mosaic wall for events | Élménypont',
      description:
        'One big mosaic image built together from guest photos: shoot, print, stick. 200-piece mosaic from 450 000 HUF. For large events.',
      ogImage: 'https://elmeny.hu/assets/photos/mosaic-wall-real.jpg',
    },
  },
  {
    path: '/selfiebox',
    hu: {
      title: 'Selfiebox — szelfigép és fotóbox bérlés rendezvényre | Élménypont',
      description:
        'Szelfigép, fotóbox és fotókabin bérlés rendezvényre azonnali nyomtatással. Egyszerű, gyors, minden korosztálynak. 80 000 Ft-tól, Budapesten.',
      ogImage: 'https://elmeny.hu/assets/photos/team-original.jpg',
    },
    en: {
      title: 'Selfiebox — selfie machine & photo booth rental for events | Élménypont',
      description:
        'Selfie machine, photo booth and photo cabin rental for events with instant printing. Simple, fast, for all ages. From 80 000 HUF, in Budapest.',
      ogImage: 'https://elmeny.hu/assets/photos/team-original.jpg',
    },
  },
]

const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
const MOUNT = '<div id="root"></div>'
if (!template.includes(MOUNT)) {
  throw new Error('prerender: mount point <div id="root"></div> not found in dist/index.html')
}

const enBase = (path) => (path === '/' ? '/en' : `/en${path}`)

/** reciprocal hreflang + x-default link tags for a canonical route */
function hreflangTags(path) {
  const hu = `${ORIGIN}${path}`
  const en = `${ORIGIN}${enBase(path)}`
  return (
    `<link rel="alternate" hreflang="hu" href="${hu}" />` +
    `<link rel="alternate" hreflang="en" href="${en}" />` +
    `<link rel="alternate" hreflang="x-default" href="${hu}" />`
  )
}

/**
 * Localize the shared template head for one (route, lang). `meta` may omit
 * title/description (HU home keeps the template's), but canonical/og:url and
 * the hreflang tags are always set.
 */
function patchHead(html, { path, lang, meta }) {
  const url = `${ORIGIN}${lang === 'en' ? enBase(path) : path}`
  let out = html
  if (lang === 'en') {
    out = out
      .replace(/<html lang="hu">/, '<html lang="en">')
      .replace(/(<meta property="og:locale" content=")[^"]*(")/, '$1en_US$2')
  }
  if (meta && meta.title) {
    out = out
      .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${meta.title}$2`)
  }
  if (meta && meta.description) {
    out = out
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${meta.description}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${meta.description}$2`)
  }
  if (meta && meta.ogImage) {
    out = out.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${meta.ogImage}$2`)
  }
  out = out
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/<\/head>/, `${hreflangTags(path)}</head>`)
  return out
}

function emit(outFile, html) {
  const out = resolve(root, outFile)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

for (const route of ROUTES) {
  const { path } = route
  // Hungarian (root)
  const huBody = render(path)
  const huHtml = patchHead(template, { path, lang: 'hu', meta: route.hu }).replace(
    MOUNT,
    `<div id="root">${huBody}</div>`,
  )
  const huOut = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  emit(huOut, huHtml)

  // English (/en)
  const enBody = render(enBase(path))
  const enHtml = patchHead(template, { path, lang: 'en', meta: route.en }).replace(
    MOUNT,
    `<div id="root">${enBody}</div>`,
  )
  const enOut = path === '/' ? 'dist/en/index.html' : `dist/en${path}/index.html`
  emit(enOut, enHtml)

  console.log(`prerendered ${path} (hu ${(huBody.length / 1024).toFixed(1)}kB, en ${(enBody.length / 1024).toFixed(1)}kB)`)
}
