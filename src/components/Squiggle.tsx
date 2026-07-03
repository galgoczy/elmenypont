import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface SquiggleProps {
  color?: string
  /** Extra delay before the stroke starts drawing, ms. */
  delay?: number
  /** Stroke thickness in SVG units (viewBox is 120x14). */
  width?: number
  style?: CSSProperties
  children: ReactNode
}

/**
 * Hand-drawn squiggle underline that draws itself in (stroke-dashoffset)
 * when scrolled into view — the doodle spirit applied to key words.
 */
export function Squiggle({ color = '#E94A35', delay = 150, width = 4, style, children }: SquiggleProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOn(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {children}
      <svg
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-2%',
          bottom: '-0.28em',
          width: '104%',
          height: '0.32em',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M3 10 C 18 4, 32 3, 47 8 S 76 13, 92 7 S 112 4, 117 6"
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={on ? 0 : 1}
          style={{ transition: `stroke-dashoffset 1s cubic-bezier(.5,0,.2,1) ${delay}ms` }}
        />
      </svg>
    </span>
  )
}
