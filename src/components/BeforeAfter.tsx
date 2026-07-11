import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface BeforeAfterProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  /** descriptive img alts — the short chip labels are poor alt text */
  beforeAlt?: string
  afterAlt?: string
  /** initial split % */
  start?: number
  radius?: string
  style?: CSSProperties
}

/**
 * Before / after slider — the "Lehetsz bárki" core motif. On mouse devices the
 * divider simply follows the pointer (dragging invited ugly text selection in
 * some browsers) and stays put on leave; on touch it's drag-to-reveal.
 * Eredeti → AI ✦. Ported from the design system's BeforeAfter component.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Eredeti',
  afterLabel = 'AI ✦',
  beforeAlt,
  afterAlt,
  start = 50,
  radius = '22px',
  style,
}: BeforeAfterProps) {
  const [pos, setPos] = useState(start)
  const ref = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false)
  const hovering = useRef(false)
  const demoRaf = useRef(0)

  const move = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, p)))
  }

  // one-time demo sweep when first scrolled into view, so visitors instantly
  // get that the divider is draggable; any interaction cancels it
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const KEYS: Array<[number, number]> = [
      [0, start],
      [0.42, 80],
      [0.8, 26],
      [1, start],
    ]
    const ease = (v: number) => 0.5 - Math.cos(v * Math.PI) / 2
    const io = new IntersectionObserver(
      (ents) => {
        if (!ents.some((e) => e.isIntersecting)) return
        io.disconnect()
        const t0 = performance.now()
        const DUR = 2600
        const step = (now: number) => {
          if (dragging.current || hovering.current) return
          const t = Math.min(1, (now - t0) / DUR)
          let a = KEYS[0]
          let b = KEYS[KEYS.length - 1]
          for (let i = 0; i < KEYS.length - 1; i++) {
            if (t >= KEYS[i][0] && t <= KEYS[i + 1][0]) {
              a = KEYS[i]
              b = KEYS[i + 1]
              break
            }
          }
          const f = ease((t - a[0]) / (b[0] - a[0] || 1))
          setPos(a[1] + (b[1] - a[1]) * f)
          if (t < 1) demoRaf.current = requestAnimationFrame(step)
        }
        demoRaf.current = requestAnimationFrame(step)
      },
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(demoRaf.current)
    }
  }, [start])

  useEffect(() => {
    const up = () => {
      dragging.current = false
    }
    const mv = (e: TouchEvent) => {
      if (!dragging.current) return
      move(e.touches[0].clientX)
    }
    window.addEventListener('touchmove', mv)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('touchmove', mv)
      window.removeEventListener('touchend', up)
    }
  }, [])

  const lbl: CSSProperties = {
    position: 'absolute',
    top: 14,
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: '#fff',
    padding: '5px 11px',
    borderRadius: '9999px',
    backdropFilter: 'blur(4px)',
  }

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        // mouse only: hovering drives the divider directly — no button held,
        // so browsers never start a text/image selection. Touch keeps the
        // drag path below (a hover-follow makes no sense there), and the
        // divider simply stays where the pointer left it.
        if (e.pointerType !== 'mouse') return
        hovering.current = true
        cancelAnimationFrame(demoRaf.current)
        move(e.clientX)
      }}
      onPointerLeave={() => {
        hovering.current = false
      }}
      onTouchStart={(e) => {
        dragging.current = true
        move(e.touches[0].clientX)
      }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius,
        userSelect: 'none',
        cursor: 'ew-resize',
        boxShadow: '0 30px 60px -20px rgba(23,21,13,.5)',
        aspectRatio: '16 / 10',
        background: 'var(--ink-900)',
        ...style,
      }}
    >
      <img
        src={after}
        alt={afterAlt || afterLabel}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // faces sit in the upper third of these shots — keep that in frame
          objectPosition: '50% 25%',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, width: `${pos}%`, overflow: 'hidden' }}>
        <img
          src={before}
          alt={beforeAlt || beforeLabel}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: ref.current ? `${ref.current.clientWidth}px` : '1000px',
            maxWidth: 'none',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 25%',
          }}
        />
      </div>
      <span style={{ ...lbl, left: 14, background: 'rgba(23,21,13,.55)' }}>{beforeLabel}</span>
      <span style={{ ...lbl, right: 14, background: 'var(--purple-600)' }}>{afterLabel}</span>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 2,
          background: '#fff',
          transform: 'translateX(-1px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${pos}%`,
          width: 40,
          height: 40,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-900)',
          fontWeight: 700,
          boxShadow: '0 6px 20px rgba(23,21,13,.35)',
        }}
      >
        ⇄
      </div>
    </div>
  )
}
