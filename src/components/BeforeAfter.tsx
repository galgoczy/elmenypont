import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface BeforeAfterProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  /** initial split % */
  start?: number
  radius?: string
  style?: CSSProperties
}

/**
 * Before / after slider — the "Lehetsz bárki" core motif. Drag the divider to
 * reveal the AI transform. Eredeti → AI ✦. Ported from the design system's
 * BeforeAfter component.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Eredeti',
  afterLabel = 'AI ✦',
  start = 50,
  radius = '22px',
  style,
}: BeforeAfterProps) {
  const [pos, setPos] = useState(start)
  const ref = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false)

  const move = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, p)))
  }

  useEffect(() => {
    const up = () => {
      dragging.current = false
    }
    const mv = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      move(x)
    }
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', mv)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', mv)
      window.removeEventListener('mouseup', up)
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
      onMouseDown={(e) => {
        dragging.current = true
        move(e.clientX)
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
        alt={afterLabel}
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, width: `${pos}%`, overflow: 'hidden' }}>
        <img
          src={before}
          alt={beforeLabel}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: ref.current ? `${ref.current.clientWidth}px` : '1000px',
            maxWidth: 'none',
            height: '100%',
            objectFit: 'cover',
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
