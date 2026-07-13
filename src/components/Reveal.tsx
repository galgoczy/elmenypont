import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'

type Variant = 'up' | 'blur' | 'pop' | 'mask' | 'left' | 'right'

interface RevealProps {
  /**
   * Entrance style:
   *  - 'blur' (default): soft rise with a focus pull — the sophisticated fade
   *  - 'up': plain rise (the old default)
   *  - 'pop': bigger travel + scale + tilt, springy ease (product cards)
   *  - 'mask': clip-path wipe from the bottom + settle (hero surfaces)
   *  - 'left' / 'right': slide in sideways
   */
  variant?: Variant
  /** Back-compat alias for variant="pop". */
  pop?: boolean
  /** Stagger, in ms. */
  delay?: number
  /** Border radius kept during a 'mask' wipe. */
  radius?: number | string
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
  href?: string
  onMouseEnter?: (e: ReactMouseEvent<HTMLElement>) => void
  onMouseLeave?: (e: ReactMouseEvent<HTMLElement>) => void
}

/**
 * Scroll-reveal. The visible end state is the baseline — under
 * prefers-reduced-motion nothing is ever hidden (DS motion rule), so a
 * paused / no-JS view still shows all content.
 */
export function Reveal({
  variant,
  pop = false,
  delay = 0,
  radius = 0,
  as = 'div',
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const v: Variant = variant ?? (pop ? 'pop' : 'blur')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // tuned down after the site audit: shorter travel + duration and an
    // eager trigger, so fast scrolling never leaves sections blank while
    // the entrances play catch-up
    const r = typeof radius === 'number' ? `${radius}px` : radius
    let dur = '.6s'
    let ease = 'cubic-bezier(.16,1,.3,1)'
    const props: string[] = ['opacity', 'transform']

    switch (v) {
      case 'up':
        el.style.opacity = '0'
        el.style.transform = 'translateY(22px)'
        dur = '.55s'
        break
      case 'pop':
        el.style.opacity = '0'
        el.style.transform = 'translateY(48px) scale(.94) rotate(-1deg)'
        dur = '.7s'
        ease = 'cubic-bezier(.2,.8,.2,1.05)'
        break
      case 'mask':
        el.style.opacity = '0.001'
        el.style.transform = 'translateY(16px) scale(.99)'
        el.style.clipPath = `inset(6% 4% 55% 4% round ${r})`
        dur = '.8s'
        props.push('clip-path')
        break
      case 'left':
        el.style.opacity = '0'
        el.style.transform = 'translateX(-30px)'
        break
      case 'right':
        el.style.opacity = '0'
        el.style.transform = 'translateX(30px)'
        break
      case 'blur':
      default:
        el.style.opacity = '0'
        el.style.transform = 'translateY(18px) scale(.997)'
        el.style.filter = 'blur(6px)'
        props.push('filter')
        break
    }

    el.style.transition = props.map((p) => `${p} ${dur} ${ease}`).join(', ')
    el.style.willChange = props.join(', ')
    el.style.transitionDelay = `${Math.min(delay, 200)}ms`

    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement
            target.style.opacity = '1'
            target.style.transform = 'none'
            target.style.filter = 'none'
            if (v === 'mask') target.style.clipPath = `inset(0 0 0 0 round ${r})`
            // release will-change once the entrance settles
            window.setTimeout(() => {
              target.style.willChange = 'auto'
            }, 1000 + delay)
            io.unobserve(target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px 0px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [v, delay, radius])

  return createElement(as, { ref, className, style, ...rest }, children)
}
