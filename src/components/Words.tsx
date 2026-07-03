import {
  Children,
  createElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

interface WordsProps {
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** Base delay before the first word, ms. */
  delay?: number
  /** Per-word stagger, ms. */
  stagger?: number
  children: ReactNode
}

/**
 * Word-by-word masked headline reveal: each word rises out of its own
 * overflow-hidden slot with a slight rotation, staggered left to right.
 * Plain strings are split into words; element children (coloured highlight
 * spans etc.) are treated as one atomic "word".
 */
export function Words({ as = 'h2', className, style, delay = 0, stagger = 55, children }: WordsProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [shown, setShown] = useState(reduce)

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  let idx = 0
  const wrap = (node: ReactNode, key: string) => {
    const i = idx++
    const outer: CSSProperties = {
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      // breathing room so descenders / rotation aren't clipped
      padding: '0.09em 0.06em 0.14em',
      margin: '-0.09em -0.06em -0.14em',
    }
    const inner: CSSProperties = {
      display: 'inline-block',
      transform: shown ? 'translateY(0) rotate(0deg)' : 'translateY(115%) rotate(5deg)',
      transformOrigin: 'left bottom',
      transition: `transform 0.9s cubic-bezier(.16,1,.3,1) ${delay + i * stagger}ms`,
      willChange: shown ? undefined : 'transform',
    }
    return (
      <span key={key} style={outer} aria-hidden={typeof node === 'string' ? undefined : undefined}>
        <span style={inner}>{node}</span>
      </span>
    )
  }

  const parts: ReactNode[] = []
  Children.forEach(children, (child, ci) => {
    if (typeof child === 'string' || typeof child === 'number') {
      String(child)
        .split(/(\s+)/)
        .forEach((piece, pi) => {
          if (!piece) return
          if (/^\s+$/.test(piece)) parts.push(' ')
          else parts.push(wrap(piece, `w-${ci}-${pi}`))
        })
    } else if (isValidElement(child)) {
      parts.push(wrap(child, `e-${ci}`))
    } else if (child != null) {
      parts.push(child)
    }
  })

  return createElement(as, { ref, className, style }, parts)
}
