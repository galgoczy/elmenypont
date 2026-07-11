import { useEffect, useRef, type CSSProperties } from 'react'

const ROW1 = 'AI SELFIEMATA ✦ GREENBOX ✦ SMART WALL ✦ MOSAIC WALL ✦ '
const ROW2 = 'EGY TÉRBEN ✹ EGY CSAPATTÓL ✹ KULCSRAKÉSZEN ✹ '

/** extra scroll (px) the finished panel stays pinned before releasing */
const HOLD_PX = 120

const rowStyle: CSSProperties = {
  fontFamily: 'Syne',
  fontWeight: 700,
  fontSize: 'clamp(40px,7vw,96px)',
  letterSpacing: '-.02em',
  whiteSpace: 'nowrap',
  lineHeight: 1.15,
  willChange: 'transform',
}

/**
 * Full-screen doodle interlude: while scrolling through, a coral panel
 * blooms out of a dot (scroll-linked clip-path circle), giant slogan rows
 * slide in opposite directions, white doodles float with cursor parallax
 * and a drawn arrow points on toward the rotatable event space below.
 */
export function DoodleBreak() {
  const secRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = secRef.current
    if (!sec) return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      sec.style.setProperty('--p', '1')
      return
    }

    let p = 0
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -100 || r.top > vh + 100) return
      // progress completes HOLD_PX before the sticky releases: the finished
      // panel stays pinned and unchanged for that stretch of scroll — a
      // breather to take the slogan in — while the doodles keep floating
      const target = Math.min(1, Math.max(0, -r.top / (r.height - vh - HOLD_PX || 1)))
      p += (target - p) * (1 - Math.exp(-9 * dt))
      sec.style.setProperty('--p', p.toFixed(4))
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const doodle = (n: number, size: number, pos: CSSProperties, dur: number, parallax: number): CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    ...pos,
    background: 'rgba(255,255,255,.35)',
    WebkitMask: `url(/assets/doodle-${n}.png) center/contain no-repeat`,
    mask: `url(/assets/doodle-${n}.png) center/contain no-repeat`,
    animation: `ep-float ${dur}s ease-in-out infinite`,
    transform: `translate3d(calc(var(--mxs,0) * ${parallax}px), calc(var(--mys,0) * ${parallax}px), 0)`,
    pointerEvents: 'none',
  })

  return (
    <section
      ref={secRef}
      aria-hidden="true"
      style={{ position: 'relative', height: `calc(170vh + ${HOLD_PX}px)`, background: '#F6F1E9' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* coral panel blooming from a dot */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#E94A35',
            clipPath: 'circle(calc(var(--p, 0) * 130%) at 50% 58%)',
            WebkitClipPath: 'circle(calc(var(--p, 0) * 130%) at 50% 58%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(10px,2vw,24px)',
            color: '#F6F1E9',
          }}
        >
          <span style={doodle(5, 150, { left: '6%', top: '12%' }, 8, -34)} />
          <span style={doodle(2, 110, { right: '9%', top: '18%' }, 10, 40)} />
          <span style={doodle(6, 90, { left: '14%', bottom: '14%' }, 9, 28)} />
          <span style={doodle(3, 120, { right: '12%', bottom: '10%' }, 11, -26)} />

          {/* opposite-sliding slogan rows, scroll-linked */}
          <div style={{ ...rowStyle, color: 'rgba(255,255,255,.35)', transform: 'translateX(calc(6% - var(--p, 0) * 22%))' }}>
            {ROW1.repeat(3)}
          </div>
          <div
            style={{
              fontFamily: 'Syne',
              fontWeight: 500,
              fontSize: 'clamp(30px,4.6vw,64px)',
              letterSpacing: '-.03em',
              lineHeight: 1.05,
              textAlign: 'center',
              maxWidth: '18ch',
              padding: '0 24px',
              transform: 'scale(calc(.9 + var(--p, 0) * .1))',
            }}
          >
            Így áll össze nálunk egy rendezvénytér.
          </div>
          <div style={{ ...rowStyle, color: 'rgba(255,255,255,.35)', transform: 'translateX(calc(-26% + var(--p, 0) * 22%))' }}>
            {ROW2.repeat(4)}
          </div>

          {/* drawn arrow pointing onward, draws in with progress */}
          <svg viewBox="0 0 60 74" width="46" height="56" style={{ marginTop: 'clamp(4px,1.5vw,16px)', overflow: 'visible' }}>
            <path
              d="M30 4 C 22 20, 40 30, 30 48 C 26 56, 28 62, 30 66 M18 54 C 22 61, 26 65, 30 68 C 36 64, 40 59, 42 53"
              fill="none"
              stroke="rgba(255,255,255,.9)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: 'calc(1 - var(--p, 0))' }}
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
