import type { CSSProperties } from 'react'

const DOODLE = (n: number) => `/assets/doodle-${n}.png`

type Anim = 'float' | 'float2' | 'sway'

interface DoodleProps {
  /** doodle-N.png index (1..6) */
  n: number
  /** CSS color — the mask is filled with currentColor. */
  color: string
  size: number
  /** placement (any subset of top/right/bottom/left) */
  top?: string
  right?: string
  bottom?: string
  left?: string
  anim?: Anim
  duration?: number
  /** base rotation, e.g. '-10deg' */
  rotate?: string
  className?: string
  style?: CSSProperties
}

/**
 * Floating grey doodle decoration. A single-colour PNG doodle is used as a
 * CSS mask filled with `color`, so any tint works. Sits behind section
 * content via the shared `.ep-doodle` class (z-index:-1 inside an
 * `.ep-deco` stacking context).
 */
export function Doodle({
  n,
  color,
  size,
  top,
  right,
  bottom,
  left,
  anim = 'float',
  duration = 8,
  rotate,
  className,
  style,
}: DoodleProps) {
  const mask = `url(${DOODLE(n)})`
  const cls = ['ep-doodle', className].filter(Boolean).join(' ')
  return (
    <span
      aria-hidden="true"
      className={cls}
      style={{
        color,
        width: size,
        height: size,
        top,
        right,
        bottom,
        left,
        WebkitMaskImage: mask,
        maskImage: mask,
        animation: `ep-${anim} ${duration}s ease-in-out infinite`,
        ...(rotate ? ({ ['--r' as string]: rotate } as CSSProperties) : {}),
        ...style,
      }}
    />
  )
}
