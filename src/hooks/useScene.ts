import { useEffect, useRef, useState } from 'react'

export interface RocketVals {
  left: number
  top: number
  rot: number
  dash: number
  flame: number
}

export interface SceneState {
  y: number
  heroP: number
  scrolled: boolean
  rocket: RocketVals
}

const INITIAL: SceneState = {
  y: 0,
  heroP: 0,
  scrolled: false,
  rocket: { left: 12, top: 8, rot: 45, dash: 1000, flame: 0.2 },
}

/**
 * Single scroll/resize-driven scene, ported 1:1 from the prototype's DCLogic
 * `_onScroll`. Reads the hero sticky-scroll progress and drives the trend
 * section's rocket along the actual serpentine SVG path geometry
 * (getPointAtLength), revealing the dotted trail behind it via a growing mask.
 *
 * Elements are located by data-attribute (single page, exactly like the
 * prototype) so no ref threading between distant components is needed.
 */
export function useScene(): SceneState {
  const [state, setState] = useState<SceneState>(INITIAL)
  const trailPath = useRef<SVGPathElement | null>(null)
  const trailLen = useRef(0)

  useEffect(() => {
    const cacheTrail = () => {
      trailPath.current = document.querySelector<SVGPathElement>('[data-trailpath]')
      try {
        trailLen.current = trailPath.current ? trailPath.current.getTotalLength() : 0
      } catch {
        trailLen.current = 0
      }
    }

    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero]')
      let heroP = 0
      if (hero) {
        const r = hero.getBoundingClientRect()
        const total = hero.offsetHeight - window.innerHeight
        heroP = Math.min(1, Math.max(0, -r.top / (total || 1)))
      }

      // trend-section scroll progress -> flying rocket
      const rocket: RocketVals = { ...INITIAL.rocket }
      const tw = document.querySelector<HTMLElement>('[data-trendwrap]')
      if (tw && trailPath.current && trailLen.current) {
        const tr = tw.getBoundingClientRect()
        const vh = window.innerHeight
        const t = Math.min(1, Math.max(0, (vh * 0.78 - tr.top) / (tr.height * 0.86 || 1)))
        const L = trailLen.current
        const pt = trailPath.current.getPointAtLength(t * L)
        const pt2 = trailPath.current.getPointAtLength(Math.min(L, t * L + L * 0.02))
        // viewBox is 0-100 stretched over the container -> % positions
        rocket.left = +pt.x.toFixed(2)
        rocket.top = +pt.y.toFixed(2)
        // angle in real pixels (account for non-uniform stretch)
        const dx = ((pt2.x - pt.x) / 100) * tr.width
        const dy = ((pt2.y - pt.y) / 100) * tr.height
        rocket.rot = +(Math.atan2(dy, dx) * 180 / Math.PI + 45).toFixed(1)
        rocket.dash = +(1000 * (1 - t)).toFixed(1)
        rocket.flame = t > 0.01 && t < 0.99 ? 1 : 0.2
      }

      setState({
        y: window.scrollY,
        heroP,
        scrolled: window.scrollY > 40,
        rocket,
      })
    }

    cacheTrail()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    // path length can settle after layout / fonts load
    const t = window.setTimeout(() => {
      cacheTrail()
      onScroll()
    }, 300)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(t)
    }
  }, [])

  return state
}

/** clamp-normalise: (v-a)/(b-a) clamped to 0..1 — the prototype's `cl`. */
export function cl(v: number, a: number, b: number): number {
  return Math.min(1, Math.max(0, (v - a) / (b - a)))
}
