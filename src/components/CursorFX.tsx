import { useEffect, useRef, useState } from 'react'

/**
 * Continuous cursor layer.
 *
 * 1. Writes smoothed, normalised cursor coordinates (-0.5 .. 0.5) into the
 *    `--mxs` / `--mys` custom properties on <html>, so any element can react
 *    to the pointer with pure CSS (`calc(var(--mxs) * 20px)`) at zero
 *    React-render cost.
 * 2. Renders a coral dot + lagging ring that trails the pointer and swells
 *    over interactive elements.
 *
 * Only mounts its work on fine pointers, and never under
 * prefers-reduced-motion.
 */
export function CursorFX() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setEnabled(true)

    const doc = document.documentElement
    let mx = 0
    let my = 0
    let sx = 0
    let sy = 0
    let px = window.innerWidth / 2
    let py = window.innerHeight / 2
    let dx = px
    let dy = py
    let rx = px
    let ry = py
    let scale = 1
    let scaleT = 1
    let seen = false
    let raf = 0
    let last = performance.now()

    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
      if (!seen) {
        seen = true
        dx = rx = px
        dy = ry = py
      }
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      const hot = t?.closest?.('a, button, input, textarea, [data-cursor]')
      scaleT = hot ? 1.35 : 1
      ringRef.current?.classList.toggle('is-active', !!hot)
    }
    const onDown = () => {
      scaleT = 0.85
    }
    const onUp = () => {
      scaleT = 1
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const kVar = 1 - Math.exp(-9 * dt)
      const kDot = 1 - Math.exp(-30 * dt)
      const kRing = 1 - Math.exp(-13 * dt)
      sx += (mx - sx) * kVar
      sy += (my - sy) * kVar
      dx += (px - dx) * kDot
      dy += (py - dy) * kDot
      rx += (px - rx) * kRing
      ry += (py - ry) * kRing
      scale += (scaleT - scale) * kRing
      doc.style.setProperty('--mxs', sx.toFixed(4))
      doc.style.setProperty('--mys', sy.toFixed(4))
      if (seen && dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx - 5}px, ${dy - 5}px, 0)`
        dotRef.current.style.opacity = '1'
      }
      if (seen && ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 120}px, ${ry - 120}px, 0) scale(${scale.toFixed(3)})`
        ringRef.current.style.opacity = '1'
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(raf)
      doc.style.removeProperty('--mxs')
      doc.style.removeProperty('--mys')
    }
  }, [])

  if (!enabled) return null
  return (
    <>
      <div ref={dotRef} className="ep-cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="ep-cursor-ring" style={{ opacity: 0 }} />
    </>
  )
}
