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
  /**
   * Cursor-parallax depth in px: how far the doodle drifts with the pointer
   * (reads the smoothed --mxs/--mys vars written by CursorFX). Positive
   * values follow the cursor, negative drift against it.
   */
  parallax?: number
  className?: string
  style?: CSSProperties
}

/**
 * Floating doodle decoration. A single-colour PNG doodle is used as a CSS
 * mask filled with `color`. The outer span handles placement + continuous
 * cursor parallax; the inner span runs the float keyframes, so the two
 * transforms compose instead of fighting.
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
  parallax = 18,
  className,
  style,
}: DoodleProps) {
  const mask = `url(${DOODLE(n)})`
  const cls = ['ep-doodle-pos', className].filter(Boolean).join(' ')
  return (
    <span
      aria-hidden="true"
      className={cls}
      style={{
        width: size,
        height: size,
        top,
        right,
        bottom,
        left,
        transform: parallax
          ? `translate3d(calc(var(--mxs, 0) * ${parallax}px), calc(var(--mys, 0) * ${parallax}px), 0)`
          : undefined,
        ...style,
      }}
    >
      <span
        className="ep-doodle"
        style={{
          color,
          WebkitMaskImage: mask,
          maskImage: mask,
          animation: `ep-${anim} ${duration}s ease-in-out infinite`,
          ...(rotate ? ({ ['--r' as string]: rotate } as CSSProperties) : {}),
        }}
      />
    </span>
  )
}
