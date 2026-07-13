import { useEffect, useRef } from 'react'
import { RocketArt } from './TrendSection'

const SPARK_COLORS = ['#48D880', '#F2937F', '#4888F8', '#F6F1E9']
const SPARK_POOL = 10

interface RocketTrailProps {
  /** path in a 0–100 viewBox, scaled to the parent (parent must be position:relative) */
  trail: string
  /** accent for the revealed line */
  color?: string
  /** the rocket lands on the bottom edge of the closest ancestor with this attribute */
  landAttr?: string
}

/**
 * The home page's spring-smoothed flying rocket, generalized: flies along
 * `trail` (revealed behind it), banks into curves, drops sparks, then noses
 * up and touches down on the section's bottom edge with two smoke puffs.
 * Render inside a position:relative wrapper that spans the step layout.
 */
export function RocketTrail({ trail, color = '#4ade80', landAttr = 'data-rockethome' }: RocketTrailProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rocketRef = useRef<HTMLSpanElement | null>(null)
  const geoRef = useRef<SVGPathElement | null>(null)
  const maskRef = useRef<SVGPathElement | null>(null)
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([])
  const smokeRefs = useRef<(HTMLSpanElement | null)[]>([])
  const maskId = useRef(`ep-rt-${Math.round(performance.now() * 1000) % 1000000}`)

  useEffect(() => {
    const wrap = wrapRef.current?.parentElement
    const overlay = wrapRef.current
    const rocket = rocketRef.current
    const geo = geoRef.current
    if (!wrap || !overlay || !rocket || !geo) return

    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let L = 0
    const measure = () => {
      try {
        L = geo.getTotalLength()
      } catch {
        L = 0
      }
    }
    measure()
    const settle = window.setTimeout(measure, 350)

    let raf = 0
    let last = performance.now()
    let tS = -1
    let rotS = 0
    let sparkAcc = 0
    let sparkIdx = 0
    let landS = 0
    let smoked = false

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
    const smooth = (v: number) => v * v * (3 - 2 * v)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!L) return

      const r = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -300 || r.top > vh + 300) return

      const tRaw = (vh * 0.8 - r.top) / (r.height * 0.9 || 1)
      const t = clamp01(tRaw)
      const first = tS < 0
      const k = reduce || first ? 1 : 1 - Math.exp(-5.2 * dt)
      const prev = first ? t : tS
      tS = prev + (t - prev) * k

      const land = clamp01((tRaw - 1.02) / 0.16)
      landS += (land - landS) * (reduce || first ? 1 : 1 - Math.exp(-6.5 * dt))
      const landE = smooth(landS)

      const pt = geo.getPointAtLength(tS * L)
      const ahead = geo.getPointAtLength(Math.min(L, tS * L + L * 0.015))
      const x = (pt.x / 100) * r.width
      let y = (pt.y / 100) * r.height
      const dx = ((ahead.x - pt.x) / 100) * r.width
      const dy = ((ahead.y - pt.y) / 100) * r.height
      let ang = (Math.atan2(dy, dx) * 180) / Math.PI

      if (landS > 0.003) {
        const sec = wrap.closest<HTMLElement>(`[${landAttr}]`)
        if (sec) {
          const sb = sec.getBoundingClientRect()
          const landY = sb.bottom - r.top - 44
          y = y + (landY - y) * landE
          ang = -90
        }
      }

      let d = ang - rotS
      d = ((d + 540) % 360) - 180
      // gentler than the home rocket: softer heading catch-up and less bank
      rotS += d * (reduce || first ? 1 : 1 - Math.exp(-6 * dt))
      const bank = Math.max(-10, Math.min(10, d)) * 0.3
      const speed = Math.abs(tS - prev) / Math.max(dt, 1e-4)

      rocket.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(rotS + bank).toFixed(2)}deg)`

      if (landS > 0.9 && !smoked && !reduce) {
        smoked = true
        smokeRefs.current.forEach((s, i) => {
          if (!s) return
          const dir = i === 0 ? -1 : 1
          s.style.left = `${(x + dir * 12).toFixed(1)}px`
          s.style.top = `${(y + 30).toFixed(1)}px`
          s.animate(
            [
              { opacity: 0.75, transform: 'translate(-50%,-50%) scale(0.7)' },
              { opacity: 0, transform: `translate(calc(-50% + ${dir * 46}px), calc(-50% - 8px)) scale(2.1)` },
            ],
            { duration: 1100, easing: 'cubic-bezier(.2,.6,.4,1)' },
          )
        })
      }
      if (landS < 0.5) smoked = false

      const boost = Math.max(Math.min(1, speed * 3), landS > 0.02 && landS < 0.96 ? 0.7 : 0)
      const flame = rocket.querySelector<SVGGElement>('[data-flameroot]')
      if (flame) {
        flame.style.transform = `scaleX(${(0.55 + boost * 0.9).toFixed(3)})`
        flame.style.opacity = tS > 0.005 && tS < 0.995 ? '1' : '0.25'
      }
      const lines = rocket.querySelector<SVGGElement>('[data-speed]')
      if (lines) lines.style.opacity = (boost * 0.9).toFixed(2)

      if (maskRef.current) maskRef.current.style.strokeDashoffset = String(1000 * (1 - tS))

      if (!reduce) {
        sparkAcc += speed * dt
        if (sparkAcc > 0.035 && boost > 0.12) {
          sparkAcc = 0
          const s = sparkRefs.current[sparkIdx % SPARK_POOL]
          sparkIdx++
          if (s) {
            s.style.left = `${x.toFixed(1)}px`
            s.style.top = `${y.toFixed(1)}px`
            const a = Math.random() * Math.PI * 2
            const dist = 18 + Math.random() * 26
            s.animate(
              [
                { opacity: 0.9, transform: 'translate(-50%,-50%) scale(1)' },
                {
                  opacity: 0,
                  transform: `translate(calc(-50% + ${(Math.cos(a) * dist).toFixed(0)}px), calc(-50% + ${(Math.sin(a) * dist).toFixed(0)}px)) scale(.15)`,
                },
              ],
              { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(.2,.6,.4,1)' },
            )
          }
        }
      }
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      window.removeEventListener('resize', measure)
    }
  }, [landAttr])

  return (
    <div ref={wrapRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <mask id={maskId.current} maskUnits="userSpaceOnUse">
            <path
              ref={maskRef}
              d={trail}
              fill="none"
              stroke="#fff"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray={1000}
              strokeDashoffset={1000}
            />
          </mask>
        </defs>
        <path
          d={trail}
          fill="none"
          stroke="rgba(246,241,233,.1)"
          strokeWidth="0.5"
          strokeDasharray="1.3 3.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={geoRef}
          d={trail}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="1.3 3.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          mask={`url(#${maskId.current})`}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {Array.from({ length: SPARK_POOL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            sparkRefs.current[i] = el
          }}
          className="ep-spark"
          style={{ background: SPARK_COLORS[i % SPARK_COLORS.length], zIndex: 1 }}
        />
      ))}
      {[0, 1].map((i) => (
        <span
          key={`smoke-${i}`}
          ref={(el) => {
            smokeRefs.current[i] = el
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(246,241,233,.8), rgba(246,241,233,0) 70%)',
            filter: 'blur(1px)',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 2,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      <span
        ref={rocketRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 64,
          height: 64,
          margin: '-32px 0 0 -32px',
          zIndex: 2,
          willChange: 'transform',
        }}
      >
        <span style={{ position: 'absolute', inset: 0, display: 'block', animation: 'ep-rocket-idle 2.6s ease-in-out infinite' }}>
          <RocketArt />
        </span>
      </span>
    </div>
  )
}

/**
 * Scroll-revealed dashed connector (no rocket): the line draws itself from
 * point to point as the section scrolls into view — the original
 * ai.elmeny.hu "scatter canvas" effect. Parent must be position:relative.
 */
export function ScrollTrail({ trail, color = '#4888F8' }: { trail: string; color?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const maskRef = useRef<SVGPathElement | null>(null)
  const maskId = useRef(`ep-st-${Math.round(performance.now() * 1000 + 7) % 1000000}`)

  useEffect(() => {
    const host = hostRef.current?.parentElement
    if (!host) return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    let pS = reduce ? 1 : 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const r = host.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      const t = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height * 0.95 || 1)))
      pS += (t - pS) * (reduce ? 1 : 1 - Math.exp(-6 * dt))
      if (maskRef.current) maskRef.current.style.strokeDashoffset = String(1000 * (1 - pS))
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={hostRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <mask id={maskId.current} maskUnits="userSpaceOnUse">
            <path
              ref={maskRef}
              d={trail}
              fill="none"
              stroke="#fff"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray={1000}
              strokeDashoffset={1000}
            />
          </mask>
        </defs>
        <path
          d={trail}
          fill="none"
          stroke="rgba(0,0,0,.08)"
          strokeWidth="0.5"
          strokeDasharray="1.1 2.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={trail}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="1.1 2.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          mask={`url(#${maskId.current})`}
          style={{ filter: `drop-shadow(0 0 5px ${color}66)` }}
        />
      </svg>
    </div>
  )
}
