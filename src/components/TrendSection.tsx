import { useEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { Words } from './Words'
import { Squiggle } from './Squiggle'
import { Doodle } from './Doodle'

const TRAIL = 'M12 8 C 12 24, 86 24, 86 42 C 86 60, 12 60, 12 76 C 12 90, 40 92, 62 98'

/** t-progress where each step "lights up" as the rocket flies past. */
const STEP_ON = [0.1, 0.48, 0.84]
const SPARK_COLORS = ['#48D880', '#F2937F', '#4888F8', '#F6F1E9']
const SPARK_POOL = 12

const STEPS = [
  {
    n: '01',
    color: '#48D880',
    title: 'A vendég mindig új élményt vár',
    body: 'Olyat akarnak, amit otthon nem tudnak könnyen megcsinálni, és leesik helyben az álluk.',
    style: { maxWidth: '34ch', marginRight: 'auto' } as const,
    delay: 0,
  },
  {
    n: '02',
    color: '#4888F8',
    title: 'A megosztható pillanat a marketing',
    body:
      'Minden brandingelt kép a te arculatoddal kerül majd fel a közösségi médiába — organikus elérés, AI szuperboost-tal.',
    style: { maxWidth: '36ch', marginLeft: 'auto', textAlign: 'right' } as const,
    delay: 80,
  },
  {
    n: '03',
    color: '#F2937F',
    title: 'Mindenki a saját élményét viszi haza',
    body: 'Személyre szabott, egyedi AI-alkotás — emlék, amit tényleg hazavisznek és megőriznek.',
    style: { maxWidth: '34ch', marginLeft: '12%' } as const,
    delay: 160,
  },
]

/** Hand-drawn rocket, nose pointing right (+x), so rotate() follows the path angle. */
export function RocketArt() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="64"
      height="64"
      style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 4px 14px rgba(72,216,128,.45))' }}
    >
      {/* speed lines — opacity driven by flight speed */}
      <g data-speed stroke="rgba(246,241,233,.6)" strokeWidth="2.4" strokeLinecap="round" opacity="0">
        <line x1="-4" y1="23" x2="10" y2="23" />
        <line x1="-10" y1="32" x2="8" y2="32" />
        <line x1="-4" y1="41" x2="10" y2="41" />
      </g>
      {/* flame — flickers on its own, scales with speed */}
      <g data-flameroot style={{ transformOrigin: '19px 32px' }}>
        <g style={{ transformOrigin: '19px 32px', animation: 'ep-flame .3s ease-in-out infinite' }}>
          <path d="M19 32 C 13 25.5, 6.5 27, 1.5 32 C 6.5 37, 13 38.5, 19 32 Z" fill="#E94A35" />
          <path d="M19 32 C 15 28.5, 10.5 29.5, 7.5 32 C 10.5 34.5, 15 35.5, 19 32 Z" fill="#F2937F" />
        </g>
      </g>
      {/* swept-back fins */}
      <path
        d="M28 24 L16 13 L24 27 Z"
        fill="#2FB268"
        stroke="#F6F1E9"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 40 L16 51 L24 37 Z"
        fill="#2FB268"
        stroke="#F6F1E9"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* slim body, long pointed nose toward +x */}
      <path
        d="M19 32 C 19 27, 23 22.5, 30 21 C 44 17.5, 56 26, 63 32 C 56 38, 44 46.5, 30 43 C 23 41.5, 19 37, 19 32 Z"
        fill="#48D880"
        stroke="#F6F1E9"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* tail cap */}
      <path d="M21.5 26.5 C 19 29.5, 19 34.5, 21.5 37.5" fill="none" stroke="#F6F1E9" strokeWidth="2" strokeLinecap="round" />
      {/* porthole */}
      <circle cx="35" cy="32" r="5" fill="#17150D" stroke="#F6F1E9" strokeWidth="2" />
      <circle cx="36.8" cy="30.4" r="1.3" fill="rgba(246,241,233,.85)" />
      {/* nose shine */}
      <path d="M50 24.5 Q57 28 60.5 31" fill="none" stroke="rgba(246,241,233,.7)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * "Miért most" — dark editorial section. A hand-drawn rocket flies along the
 * serpentine dotted trail with spring-smoothed motion (rAF + exponential
 * easing on position and heading), banking into curves, dropping sparks and
 * lighting up each numbered step as it passes. The green progress line is
 * revealed behind it via a growing SVG mask.
 */
export function TrendSection() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rocketRef = useRef<HTMLSpanElement | null>(null)
  const geoRef = useRef<SVGPathElement | null>(null)
  const maskRef = useRef<SVGPathElement | null>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([])
  const smokeRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    const rocket = rocketRef.current
    const geo = geoRef.current
    if (!wrap || !rocket || !geo) return

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
    // path length can settle after fonts/layout
    const settle = window.setTimeout(measure, 350)

    let raf = 0
    let last = performance.now()
    let tS = -1 // smoothed progress (-1 = uninitialised)
    let rotS = 0
    let sparkAcc = 0
    let sparkIdx = 0
    let landS = 0 // smoothed landing progress (post-trail descent)
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
      // skip all work while far offscreen
      if (r.bottom < -300 || r.top > vh + 300) return

      const tRaw = (vh * 0.8 - r.top) / (r.height * 0.9 || 1)
      const t = clamp01(tRaw)
      const first = tS < 0
      const k = reduce || first ? 1 : 1 - Math.exp(-6.5 * dt)
      const prev = first ? t : tS
      tS = prev + (t - prev) * k

      // after the trail ends the rocket noses up and settles down onto the
      // section's bottom edge (the dark→cream boundary)
      const land = clamp01((tRaw - 1.02) / 0.16)
      landS += (land - landS) * (reduce || first ? 1 : 1 - Math.exp(-6.5 * dt))
      const landE = smooth(landS)

      const pt = geo.getPointAtLength(tS * L)
      const ahead = geo.getPointAtLength(Math.min(L, tS * L + L * 0.015))
      let x = (pt.x / 100) * r.width
      let y = (pt.y / 100) * r.height
      const dx = ((ahead.x - pt.x) / 100) * r.width
      const dy = ((ahead.y - pt.y) / 100) * r.height
      let ang = (Math.atan2(dy, dx) * 180) / Math.PI

      if (landS > 0.003) {
        const sec = wrap.closest<HTMLElement>('[data-trend]')
        if (sec) {
          const sb = sec.getBoundingClientRect()
          // tail should kiss the boundary: rocket points up, tail ≈ centre+32
          const landY = sb.bottom - r.top - 44
          y = y + (landY - y) * landE
          ang = -90 // nose up while descending
        }
      }

      // shortest-arc heading smoothing; the residual becomes the banking tilt
      let d = ang - rotS
      d = ((d + 540) % 360) - 180
      rotS += d * (reduce || first ? 1 : 1 - Math.exp(-9 * dt))
      const bank = Math.max(-16, Math.min(16, d)) * 0.5

      const speed = Math.abs(tS - prev) / Math.max(dt, 1e-4) // t-units / s

      rocket.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(rotS + bank).toFixed(2)}deg)`

      // touchdown: two smoke puffs roll out sideways, once per landing
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

      // flame + speed lines scale with velocity; braking burn while landing
      const boost = Math.max(Math.min(1, speed * 3), landS > 0.02 && landS < 0.96 ? 0.7 : 0)
      const flame = rocket.querySelector<SVGGElement>('[data-flameroot]')
      if (flame) {
        flame.style.transform = `scaleX(${(0.55 + boost * 0.9).toFixed(3)})`
        flame.style.opacity = tS > 0.005 && tS < 0.995 ? '1' : '0.25'
      }
      const lines = rocket.querySelector<SVGGElement>('[data-speed]')
      if (lines) lines.style.opacity = (boost * 0.9).toFixed(2)

      // reveal the green trail behind the rocket
      if (maskRef.current) maskRef.current.style.strokeDashoffset = String(1000 * (1 - tS))

      // light up the numbered steps as the rocket passes
      STEP_ON.forEach((thr, i) => {
        stepRefs.current[i]?.classList.toggle('on', tS > thr)
      })

      // spark trail while moving
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
  }, [])

  return (
    <section
      data-trend
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#17150D',
        color: '#F6F1E9',
        padding: 'clamp(90px,13vw,170px) clamp(24px,6vw,90px) clamp(110px,15vw,200px)',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <Doodle
        n={2}
        color="rgba(246,241,233,.07)"
        size={100}
        right="6vw"
        top="16%"
        anim="float"
        duration={7}
        parallax={-30}
        style={{ zIndex: 0 }}
      />
      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
        <Reveal
          as="span"
          style={{
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#48D880',
            marginBottom: 30,
          }}
        >
          Miért most
        </Reveal>
        <Words
          as="h2"
          delay={120}
          style={{
            fontFamily: 'Syne',
            fontWeight: 500,
            fontSize: 'clamp(34px,5.6vw,82px)',
            lineHeight: 1,
            letterSpacing: '-.035em',
            maxWidth: '16ch',
          }}
        >
          A rendezvényipar{' '}
          <span style={{ color: '#48D880' }}>
            <Squiggle color="rgba(72,216,128,.55)" delay={900}>
              legnagyobb trendje
            </Squiggle>
          </span>{' '}
          2026-ban az AI&nbsp;élmény.
        </Words>

        {/* staggered steps with the spring-smoothed flying rocket */}
        <div data-trendwrap ref={wrapRef} style={{ position: 'relative', marginTop: 'clamp(60px,9vw,120px)' }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <mask id="ep-trail-mask" maskUnits="userSpaceOnUse">
                <path
                  ref={maskRef}
                  d={TRAIL}
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
              d={TRAIL}
              fill="none"
              stroke="rgba(246,241,233,.1)"
              strokeWidth="0.5"
              strokeDasharray="1.3 3.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={geoRef}
              d={TRAIL}
              fill="none"
              stroke="#48D880"
              strokeWidth="1"
              strokeDasharray="1.3 3.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              mask="url(#ep-trail-mask)"
              style={{ filter: 'drop-shadow(0 0 6px rgba(72,216,128,.5))' }}
            />
          </svg>

          {/* spark pool (recycled by the rAF loop) */}
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

          {/* touchdown smoke puffs */}
          {[0, 1].map((i) => (
            <span
              key={`smoke-${i}`}
              ref={(el) => {
                smokeRefs.current[i] = el
              }}
              aria-hidden="true"
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

          {/* flying rocket — position is written imperatively each frame */}
          <span
            ref={rocketRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 64,
              height: 64,
              margin: '-32px 0 0 -32px',
              zIndex: 2,
              willChange: 'transform',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                animation: 'ep-rocket-idle 2.6s ease-in-out infinite',
              }}
            >
              <RocketArt />
            </span>
          </span>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(48px,7vw,96px)',
            }}
          >
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={s.delay} style={s.style}>
                <div
                  ref={(el) => {
                    stepRefs.current[i] = el
                  }}
                  className="ep-step-num"
                  style={{
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    fontSize: 'clamp(56px,7.5vw,104px)',
                    lineHeight: 0.82,
                    letterSpacing: '-.04em',
                    color: s.color,
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    fontSize: 'clamp(22px,2.2vw,28px)',
                    letterSpacing: '-.01em',
                    marginTop: 16,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'rgba(246,241,233,.62)',
                    marginTop: 12,
                  }}
                >
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
