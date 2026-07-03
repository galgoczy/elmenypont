import { useRef, type CSSProperties, type ReactNode } from 'react'

interface TiltCardProps {
  /** Max tilt in degrees. */
  tilt?: number
  /** Hover lift in px (translateY up). */
  lift?: number
  /** Show a cursor-following sheen. */
  glare?: boolean
  /** Border radius for the glare overlay (match the card). */
  radius?: number | string
  hoverShadow?: string
  style?: CSSProperties
  className?: string
  children: ReactNode
}

/**
 * Cursor-reactive 3D tilt wrapper: the card leans toward the pointer with a
 * light sheen following it, then springs flat on leave. Wrap the card
 * element (anchor, div) — the wrapper owns the hover transform.
 */
export function TiltCard({
  tilt = 5,
  lift = 6,
  glare = true,
  radius = 22,
  hoverShadow = '0 36px 60px -28px rgba(23,21,13,.45)',
  style,
  className,
  children,
}: TiltCardProps) {
  const inner = useRef<HTMLDivElement | null>(null)
  const sheen = useRef<HTMLDivElement | null>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = inner.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * tilt
    const ry = (px - 0.5) * tilt
    el.style.transition = 'transform .14s ease-out, box-shadow .4s'
    el.style.transform = `translateY(${-lift}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    el.style.boxShadow = hoverShadow
    if (sheen.current) {
      sheen.current.style.opacity = '1'
      sheen.current.style.background = `radial-gradient(300px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,.16), transparent 65%)`
    }
  }
  const onLeave = () => {
    const el = inner.current
    if (!el) return
    el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), box-shadow .8s'
    el.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)'
    el.style.boxShadow = 'none'
    if (sheen.current) sheen.current.style.opacity = '0'
  }

  return (
    <div
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 900, ...style }}
    >
      <div
        ref={inner}
        style={{
          position: 'relative',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          borderRadius: radius,
        }}
      >
        {children}
        {glare && (
          <div
            ref={sheen}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity .4s',
              zIndex: 3,
            }}
          />
        )}
      </div>
    </div>
  )
}
