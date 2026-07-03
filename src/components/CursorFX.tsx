import { useEffect } from 'react'

/**
 * Continuous cursor tracking: writes smoothed, normalised cursor
 * coordinates (-0.5 .. 0.5) into the `--mxs` / `--mys` custom properties
 * on <html>, so any element can react to the pointer with pure CSS
 * (`calc(var(--mxs) * 20px)`) at zero React-render cost — parallax
 * doodles, the hero kiosk, the glow, the tilting cards all read these.
 *
 * (The visible custom cursor was retired; only the tracking remains.)
 * No-op on coarse pointers and under prefers-reduced-motion.
 */
export function CursorFX() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const doc = document.documentElement
    let mx = 0
    let my = 0
    let sx = 0
    let sy = 0
    let raf = 0
    let last = performance.now()

    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const k = 1 - Math.exp(-9 * dt)
      sx += (mx - sx) * k
      sy += (my - sy) * k
      doc.style.setProperty('--mxs', sx.toFixed(4))
      doc.style.setProperty('--mys', sy.toFixed(4))
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      doc.style.removeProperty('--mxs')
      doc.style.removeProperty('--mys')
    }
  }, [])

  return null
}
