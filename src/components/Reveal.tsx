import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'

interface RevealProps {
  /** Bolder entrance for product cards: bigger travel + scale + tilt, springy ease. */
  pop?: boolean
  /** Stagger, in ms. */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
  href?: string
  onMouseEnter?: (e: ReactMouseEvent<HTMLElement>) => void
  onMouseLeave?: (e: ReactMouseEvent<HTMLElement>) => void
}

/**
 * Scroll-reveal, ported from the prototype's mount logic. The visible end
 * state is the baseline — under prefers-reduced-motion nothing is ever hidden
 * (DS motion rule), so a paused / no-JS view still shows all content.
 */
export function Reveal({
  pop = false,
  delay = 0,
  as = 'div',
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    el.style.opacity = '0'
    el.style.transform = pop
      ? 'translateY(90px) scale(.9) rotate(-1.5deg)'
      : 'translateY(34px)'
    const dur = pop ? '1.05s' : '.9s'
    const ease = pop ? 'cubic-bezier(.2,.8,.2,1.05)' : 'cubic-bezier(.16,1,.3,1)'
    el.style.transition = `opacity ${dur} ${ease}, transform ${dur} ${ease}`
    el.style.willChange = 'opacity, transform'
    el.style.transitionDelay = `${delay}ms`

    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement
            target.style.opacity = '1'
            target.style.transform = 'none'
            io.unobserve(target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pop, delay])

  return createElement(as, { ref, className, style, ...rest }, children)
}
