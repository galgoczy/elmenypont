import { useRef, type CSSProperties, type ReactNode } from 'react'

interface MagneticProps {
  /** Max translation in px toward the cursor. */
  strength?: number
  style?: CSSProperties
  children: ReactNode
}

/**
 * Magnetic wrapper for CTAs: the child leans toward the cursor while hovered
 * and springs back on leave. Purely event-driven — no rAF loop needed.
 */
export function Magnetic({ strength = 7, style, children }: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null)

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    el.style.transition = 'transform .15s ease-out'
    el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform .6s cubic-bezier(.2,.8,.25,1.2)'
    el.style.transform = 'translate(0,0)'
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'inline-block', willChange: 'transform', ...style }}
    >
      {children}
    </span>
  )
}
