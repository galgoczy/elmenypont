import { useEffect, useState } from 'react'

export interface SceneState {
  y: number
  heroP: number
  scrolled: boolean
}

const INITIAL: SceneState = {
  y: 0,
  heroP: 0,
  scrolled: false,
}

/**
 * Scroll/resize-driven scene state for the hero + nav. Also mirrors the
 * page scroll progress into the `--scrollp` custom property on <html> for
 * pure-CSS consumers (nav progress bar).
 *
 * The trend-section rocket runs its own spring-smoothed rAF loop inside
 * TrendSection — it no longer lives here.
 */
export function useScene(): SceneState {
  const [state, setState] = useState<SceneState>(INITIAL)

  useEffect(() => {
    const doc = document.documentElement

    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero]')
      let heroP = 0
      if (hero) {
        const r = hero.getBoundingClientRect()
        const total = hero.offsetHeight - window.innerHeight
        heroP = Math.min(1, Math.max(0, -r.top / (total || 1)))
      }

      const max = doc.scrollHeight - window.innerHeight
      doc.style.setProperty('--scrollp', (max > 0 ? window.scrollY / max : 0).toFixed(4))

      // the hero's snap point only exists while the viewport is inside the
      // hero — a page-wide scroll-snap-type kills iOS momentum scrolling.
      // Release it right after the p≈0.87 snap marker (where the copy has
      // fully risen and the scroll comes to rest) so normal momentum resumes
      // from the hero text, not half a screen lower. Subpages have no hero.
      doc.classList.toggle('ep-snap', !!hero && heroP < 0.88)

      setState({
        y: window.scrollY,
        heroP,
        scrolled: window.scrollY > 40,
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return state
}

/** clamp-normalise: (v-a)/(b-a) clamped to 0..1 — the prototype's `cl`. */
export function cl(v: number, a: number, b: number): number {
  return Math.min(1, Math.max(0, (v - a) / (b - a)))
}
