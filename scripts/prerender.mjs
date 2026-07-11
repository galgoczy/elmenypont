import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Post-build prerender: bakes each route's server-rendered HTML into the
 * built index.html so the page text is present without JavaScript (search
 * engines need an indexed, snippet-eligible page — a client-only SPA makes
 * that fragile). Runs after `vite build` + the --ssr build of ssg-entry.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(resolve(root, 'dist-ssr/ssg-entry.js'))

const ROUTES = [{ path: '/', out: 'dist/index.html' }]

const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
const MOUNT = '<div id="root"></div>'
if (!template.includes(MOUNT)) {
  throw new Error('prerender: mount point <div id="root"></div> not found in dist/index.html')
}

for (const route of ROUTES) {
  const html = render(route.path)
  const out = resolve(root, route.out)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, template.replace(MOUNT, `<div id="root">${html}</div>`))
  console.log(`prerendered ${route.path} -> ${route.out} (${(html.length / 1024).toFixed(1)}kB body)`)
}
