import { renderToString } from 'react-dom/server'
import { Page } from './Page'

/**
 * Build-time entry for static prerendering (scripts/prerender.mjs). Renders
 * a route to plain HTML so crawlers get the full text without executing JS —
 * the client bundle then re-renders over it on load. Effects never run here,
 * so components must not touch window/document during the render phase.
 */
export function render(path: string): string {
  return renderToString(<Page path={path} />)
}
