import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { Reveal } from './Reveal'
import { Words } from './Words'

/* ------------------------------------------------------------------ *
 *  Rotatable paper-diorama event space.
 *
 *  The floor is a true 3D plane (rotateX + rotateZ, driven by the
 *  --spin/--tilt custom properties); every prop is a hand-drawn SVG
 *  "paper cutout" planted on the plane and counter-rotated via the
 *  shared --bill transform so it always faces the camera — the classic
 *  pop-up-book look. Drag to spin (with inertia), the scene slowly
 *  auto-rotates when idle, and the cursor tilts the whole diorama.
 * ------------------------------------------------------------------ */

const FLOOR = 460
const WALK_PATH = 'M 120 140 C 330 70, 400 290, 250 375 C 120 430, 70 260, 120 140'

/** Shared billboard transform: undoes the floor's rotateZ then rotateX. */
const BILL = 'rotateZ(calc(var(--spin, -45deg) * -1)) rotateX(calc((58deg + var(--tilt, 0deg)) * -1))'

/* ---------- hand-drawn sprites ------------------------------------ */

function KioskSprite() {
  return (
    <svg viewBox="0 0 84 136" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="ep-kg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4888F8" />
          <stop offset="1" stopColor="#9868F8" />
        </linearGradient>
      </defs>
      {/* printed photo — rises out from behind the kiosk top */}
      <g style={{ animation: 'ep-photo 6s ease-in-out infinite' }}>
        <rect x="28" y="12" width="28" height="34" rx="2.5" fill="#fff" stroke="#D8D2C6" strokeWidth="1.5" />
        <rect x="31.5" y="15.5" width="21" height="21" rx="1.5" fill="#9868F8" opacity="0.85" />
        <rect x="31.5" y="40" width="13" height="2.5" rx="1.25" fill="#C9C3B6" />
      </g>
      {/* stand */}
      <rect x="38" y="92" width="8" height="36" fill="#3A352A" />
      <rect x="22" y="126" width="40" height="8" rx="4" fill="#3A352A" />
      {/* body */}
      <rect x="8" y="6" width="68" height="88" rx="12" fill="url(#ep-kg)" stroke="rgba(255,255,255,.35)" strokeWidth="2.5" />
      <circle cx="42" cy="12.5" r="3" fill="#0B0A07" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />
      <rect x="17" y="19" width="50" height="52" rx="6" fill="#0B0A07" />
      <text
        x="42"
        y="49"
        textAnchor="middle"
        fill="#F6F1E9"
        style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, letterSpacing: '.06em' }}
      >
        AI ✦
      </text>
      {/* camera flash */}
      <rect x="17" y="19" width="50" height="52" rx="6" fill="#fff" style={{ animation: 'ep-kflash 6s linear infinite' }} opacity="0" />
      <rect x="30" y="84" width="24" height="4" rx="2" fill="rgba(0,0,0,.45)" />
    </svg>
  )
}

function GreenboxSprite() {
  return (
    <svg viewBox="0 0 168 132" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* backdrop */}
      <rect x="34" y="8" width="100" height="98" rx="10" fill="#48D880" stroke="#2FA562" strokeWidth="3" />
      <rect x="42" y="16" width="84" height="82" rx="6" fill="rgba(255,255,255,.08)" />
      <path d="M34 106 Q84 120 134 106" fill="none" stroke="#2FA562" strokeWidth="3" strokeLinecap="round" />
      {/* posing guest silhouette */}
      <circle cx="84" cy="46" r="9" fill="#1E7A48" />
      <path d="M84 56 q-13 5 -13 24 h26 q0 -19 -13 -24 Z" fill="#1E7A48" />
      <path d="M76 61 L62 46 M92 61 L106 46" stroke="#1E7A48" strokeWidth="5" strokeLinecap="round" />
      {/* camera flash */}
      <ellipse cx="84" cy="56" rx="58" ry="46" fill="#fff" opacity="0" style={{ animation: 'ep-gbflash 7s ease-in-out infinite' }} />
      {/* left softbox */}
      <path d="M16 128 L25 94 M34 128 L25 94" stroke="#D8D2C6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="80" r="17" fill="rgba(255,255,255,.22)" style={{ animation: 'ep-pulse 3.4s ease-in-out infinite' }} />
      <rect x="11" y="70" width="26" height="20" rx="4" fill="#fff" stroke="#D8D2C6" strokeWidth="2" transform="rotate(-16 24 80)" />
      {/* right softbox */}
      <path d="M138 128 L146 96 M154 128 L146 96" stroke="#D8D2C6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="146" cy="82" r="15" fill="rgba(255,255,255,.2)" style={{ animation: 'ep-pulse 4.1s ease-in-out infinite .8s' }} />
      <rect x="133" y="72" width="26" height="20" rx="4" fill="#fff" stroke="#D8D2C6" strokeWidth="2" transform="rotate(14 146 82)" />
    </svg>
  )
}

const TILE_COLORS = ['#E94A35', '#4888F8', '#9868F8', '#48D880']

function SmartWallSprite() {
  const tiles: ReactNode[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      const i = r * 5 + c
      tiles.push(
        <rect
          key={i}
          x={18 + c * 29}
          y={18 + r * 25}
          width="24"
          height="20"
          rx="4"
          fill={TILE_COLORS[i % 4]}
          style={{ animation: `ep-tile 3.8s ease-in-out ${(i * 0.23).toFixed(2)}s infinite` }}
          opacity="0.16"
        />,
      )
    }
  }
  return (
    <svg viewBox="0 0 176 128" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* feet */}
      <rect x="26" y="100" width="10" height="22" rx="3" fill="#3A352A" />
      <rect x="140" y="100" width="10" height="22" rx="3" fill="#3A352A" />
      {/* wall */}
      <rect x="6" y="6" width="164" height="96" rx="12" fill="#211D14" stroke="rgba(246,241,233,.3)" strokeWidth="2.5" />
      {tiles}
      {/* touch highlight */}
      <circle cx="134" cy="66" r="7" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" style={{ animation: 'ep-pulse 2s ease-in-out infinite' }} />
      {/* guest touching the wall */}
      <circle cx="150" cy="82" r="7" fill="#E8B48C" />
      <path d="M150 89 q-9 4 -9 21 h18 q0 -17 -9 -21 Z" fill="#F2937F" />
      <path d="M146 93 L135 70" stroke="#F2937F" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="144" y="110" width="4.5" height="16" rx="2.25" fill="#D06B55" />
      <rect x="151.5" y="110" width="4.5" height="16" rx="2.25" fill="#D06B55" />
    </svg>
  )
}

interface PersonProps {
  body: string
  dark: string
  skin: string
  pose?: 0 | 1 | 2
  anim?: string
  flip?: boolean
}

/** Little doodle guest: blob body, round head, dancing via whole-sprite keyframes. */
function Person({ body, dark, skin, pose = 0, anim = 'ep-dance1 1.6s ease-in-out infinite', flip = false }: PersonProps) {
  const arms =
    pose === 0 ? (
      <path d="M9 22 L2.5 10 M25 22 L31.5 10" stroke={body} strokeWidth="4.5" strokeLinecap="round" />
    ) : pose === 1 ? (
      <path d="M9 24 L2 19 M25 24 L32 29" stroke={body} strokeWidth="4.5" strokeLinecap="round" />
    ) : (
      <>
        <path d="M9 24 L4 32 M25 22 L30.5 12" stroke={body} strokeWidth="4.5" strokeLinecap="round" />
        <rect x="27.5" y="4.5" width="6" height="9.5" rx="1.5" fill="#17150D" stroke="rgba(246,241,233,.7)" strokeWidth="1" />
      </>
    )
  return (
    <svg
      viewBox="0 0 34 62"
      width="100%"
      height="100%"
      style={{
        display: 'block',
        overflow: 'visible',
        transformOrigin: '50% 100%',
        animation: anim,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      <rect x="10" y="44" width="5" height="16" rx="2.5" fill={dark} />
      <rect x="19" y="44" width="5" height="16" rx="2.5" fill={dark} />
      <rect x="8" y="18" width="18" height="30" rx="9" fill={body} />
      {arms}
      <circle cx="17" cy="10" r="8" fill={skin} />
      <circle cx="14.5" cy="9" r="1.1" fill="#17150D" />
      <circle cx="19.5" cy="9" r="1.1" fill="#17150D" />
      <path d="M14 12.5 Q17 15 20 12.5" fill="none" stroke="#17150D" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- planting things on the floor plane --------------------- */

interface PlantProps {
  /** floor-plane coordinates (0..FLOOR) of the sprite's feet */
  x: number
  y: number
  w: number
  h: number
  shadow?: number
  href?: string
  /** key for the screen-space label overlay to track */
  station?: string
  children: ReactNode
}

/** Billboarded paper-cutout standing at (x, y) on the floor, feet planted. */
function Plant({ x, y, w, h, shadow, href, station, children }: PlantProps) {
  const sw = shadow ?? w * 0.92
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: sw,
          height: sw * 0.42,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(0,0,0,.42), transparent 72%)',
        }}
      />
      <div
        data-station={station}
        style={{
          position: 'absolute',
          left: x - w / 2,
          top: y - h,
          width: w,
          height: h,
          transformOrigin: '50% 100%',
          transform: BILL,
        }}
      >
        {href ? (
          <a
            href={href}
            tabIndex={-1}
            aria-hidden="true"
            style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.12)'
              e.currentTarget.style.transition = 'filter .25s'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none'
            }}
          >
            {children}
          </a>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>{children}</div>
        )}
      </div>
    </>
  )
}

/** A guest strolling around the floor along the drawn dashed route. */
function Walker({ delay, person }: { delay: string; person: PersonProps }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        offsetPath: `path('${WALK_PATH}')`,
        offsetRotate: '0deg',
        animation: `ep-stroll 36s linear infinite ${delay}`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -16,
          top: -58,
          width: 32,
          height: 58,
          transformOrigin: '50% 100%',
          transform: BILL,
          pointerEvents: 'none',
        }}
      >
        <span style={{ display: 'block', width: '100%', height: '100%', animation: 'ep-walkbob .7s ease-in-out infinite' }}>
          <Person {...person} />
        </span>
      </div>
    </div>
  )
}

/* ---------- the scene ---------------------------------------------- */

const STATIONS = [
  { key: 'selfiemata', href: 'https://ai.elmeny.hu', label: 'AI Selfiemata', color: '#4888F8' },
  { key: 'greenbox', href: 'https://greenbox.elmeny.hu', label: 'Greenbox stúdió', color: '#48D880' },
  { key: 'smartwall', href: 'https://smart-wall.hu', label: 'Smart Wall', color: '#E94A35' },
]

const DANCERS: Array<{ x: number; y: number; p: PersonProps }> = [
  { x: 225, y: 220, p: { body: '#E94A35', dark: '#B93524', skin: '#F4CBA6', pose: 0, anim: 'ep-dance1 1.5s ease-in-out infinite' } },
  { x: 288, y: 262, p: { body: '#4888F8', dark: '#3567C4', skin: '#C98E62', pose: 1, anim: 'ep-dance2 1.9s ease-in-out infinite .3s', flip: true } },
  { x: 178, y: 268, p: { body: '#9868F8', dark: '#7449CE', skin: '#8C5B3B', pose: 2, anim: 'ep-dance3 2.1s ease-in-out infinite .15s' } },
  { x: 252, y: 316, p: { body: '#48D880', dark: '#2FA562', skin: '#F6D7C4', pose: 1, anim: 'ep-dance1 1.7s ease-in-out infinite .5s', flip: true } },
  { x: 162, y: 182, p: { body: '#F2937F', dark: '#D06B55', skin: '#E8B48C', pose: 0, anim: 'ep-dance2 1.6s ease-in-out infinite .8s' } },
]

export function IsoScene() {
  const secRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const labelRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    const sec = secRef.current
    const stage = stageRef.current
    if (!sec || !stage) return
    sec.style.setProperty('--spin', '-45deg')
    sec.style.setProperty('--tilt', '0deg')

    // labels live in stage screen space (2D overlay) and chase the projected
    // billboard rects each frame — the 3D plane-splitting artifacts that
    // swallowed in-scene labels can't touch them
    const bills = STATIONS.map((s) => ({
      key: s.key,
      el: stage.querySelector<HTMLElement>(`[data-station="${s.key}"]`),
    }))
    const positionLabels = () => {
      const sr = stage.getBoundingClientRect()
      bills.forEach(({ key, el }) => {
        const lab = labelRefs.current[key]
        if (!el || !lab) return
        const r = el.getBoundingClientRect()
        const x = r.left - sr.left + r.width / 2
        const y = r.top - sr.top - 10
        lab.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`
        lab.style.opacity = '1'
      })
    }

    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      positionLabels()
      window.addEventListener('resize', positionLabels)
      return () => window.removeEventListener('resize', positionLabels)
    }

    let spin = -45
    let vel = 0
    let tilt = 0
    let tiltT = 0
    let dragging = false
    let lastX = 0
    let lastMove = performance.now()
    let lastInteract = -1e9
    let hover = false
    let raf = 0
    let last = performance.now()

    const down = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastMove = performance.now()
      vel = 0
      lastInteract = performance.now()
      stage.setPointerCapture(e.pointerId)
      stage.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      const now = performance.now()
      if (dragging) {
        const d = (e.clientX - lastX) * 0.35
        const dtm = Math.max(8, now - lastMove)
        lastX = e.clientX
        lastMove = now
        spin += d
        vel = Math.max(-220, Math.min(220, (d / dtm) * 1000))
        lastInteract = now
      } else {
        const r = stage.getBoundingClientRect()
        const cy = (e.clientY - r.top) / r.height - 0.5
        tiltT = cy * -5
      }
    }
    const up = () => {
      dragging = false
      stage.style.cursor = 'grab'
    }
    const enter = () => {
      hover = true
    }
    const leave = () => {
      hover = false
      tiltT = 0
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const r = sec.getBoundingClientRect()
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return

      if (!dragging) {
        spin += vel * dt
        vel *= Math.exp(-2.4 * dt)
        // slow show-off rotation when nobody is playing with it
        if (!hover && now - lastInteract > 3000) spin += 2.6 * dt
      }
      tilt += (tiltT - tilt) * (1 - Math.exp(-6 * dt))
      sec.style.setProperty('--spin', `${spin.toFixed(3)}deg`)
      sec.style.setProperty('--tilt', `${tilt.toFixed(3)}deg`)
      positionLabels()
    }

    stage.addEventListener('pointerdown', down)
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerup', up)
    stage.addEventListener('pointercancel', up)
    stage.addEventListener('pointerenter', enter)
    stage.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      stage.removeEventListener('pointerdown', down)
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerup', up)
      stage.removeEventListener('pointercancel', up)
      stage.removeEventListener('pointerenter', enter)
      stage.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const spriteBox = (w: number, h: number): CSSProperties => ({ width: w, height: h })

  return (
    <section
      ref={secRef}
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: '0 clamp(16px,4vw,56px) clamp(80px,10vw,130px)',
      }}
    >
      <Reveal
        variant="mask"
        radius={34}
        style={{
          position: 'relative',
          maxWidth: 1280,
          margin: '0 auto',
          borderRadius: 34,
          overflow: 'hidden',
          background: 'radial-gradient(120% 120% at 50% 0%, #211d14 0%, #100e09 70%)',
          color: '#F6F1E9',
          padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,70px) clamp(20px,4vw,40px)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Reveal
            as="span"
            style={{
              display: 'inline-block',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#F2937F',
              marginBottom: 18,
            }}
          >
            Élő, forgatható tér
          </Reveal>
          <Words
            as="h2"
            delay={150}
            style={{
              fontFamily: 'Syne',
              fontWeight: 500,
              fontSize: 'clamp(28px,4vw,58px)',
              lineHeight: 1,
              letterSpacing: '-.03em',
            }}
          >
            Minden rendezvényre{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#4888F8,#9868F8 55%,#4888F8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              (AI)
            </span>{' '}
            élményt adunk.
          </Words>
          <Reveal as="p" delay={300} style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', marginTop: 16 }}>
            Fogd meg és forgasd körbe a teret — kattints egy állomásra, és nézd meg közelebbről.
          </Reveal>
        </div>

        {/* rotatable diorama */}
        <div
          ref={stageRef}
          data-cursor
          style={{
            position: 'relative',
            height: 'clamp(400px,48vw,580px)',
            marginTop: 10,
            perspective: '1500px',
            cursor: 'grab',
            touchAction: 'pan-y',
          }}
        >
          {/* rising sparkles (screen space) */}
          {[14, 30, 48, 62, 78, 88].map((l, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: `${l}%`,
                bottom: '18%',
                fontSize: 10 + (i % 3) * 5,
                color: 'rgba(246,241,233,.4)',
                animation: `ep-rise ${7 + (i % 4) * 2}s linear ${i * 1.4}s infinite`,
                pointerEvents: 'none',
                zIndex: 3,
              }}
            >
              ✦
            </span>
          ))}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* floor plane */}
            <div
              style={{
                position: 'relative',
                width: FLOOR,
                height: FLOOR,
                transform: 'rotateX(calc(58deg + var(--tilt, 0deg))) rotateZ(var(--spin, -45deg))',
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg,#2b2619,#1a160e)',
                borderRadius: 22,
                boxShadow: '0 70px 90px rgba(0,0,0,.55)',
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',
                backgroundSize: '46px 46px',
                willChange: 'transform',
              }}
            >
              {/* plinth for thickness */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: -10,
                  transform: 'translateZ(-16px)',
                  background: '#0d0b07',
                  borderRadius: 28,
                }}
              />

              {/* drawn floor markings */}
              <svg
                viewBox={`0 0 ${FLOOR} ${FLOOR}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              >
                {/* walking route */}
                <path d={WALK_PATH} fill="none" stroke="rgba(72,216,128,.14)" strokeWidth="2.5" strokeDasharray="4 12" strokeLinecap="round" />
                {/* dance floor rings */}
                <g style={{ transformOrigin: '230px 252px', animation: 'ep-spin 70s linear infinite' }}>
                  <circle cx="230" cy="252" r="62" fill="none" stroke="rgba(233,74,53,.4)" strokeWidth="3" strokeDasharray="20 14" strokeLinecap="round" />
                  <circle cx="230" cy="252" r="88" fill="none" stroke="rgba(246,241,233,.12)" strokeWidth="2" strokeDasharray="5 12" strokeLinecap="round" />
                </g>
                {/* corner crosses */}
                {[
                  [56, 56],
                  [404, 56],
                  [56, 404],
                  [404, 404],
                ].map(([cx, cy], i) => (
                  <path
                    key={i}
                    d={`M${cx - 8} ${cy} H${cx + 8} M${cx} ${cy - 8} V${cy + 8}`}
                    stroke="rgba(246,241,233,.18)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ))}
              </svg>

              {/* stations in three corners */}
              <Plant x={112} y={100} w={84} h={136} href="https://ai.elmeny.hu" station="selfiemata">
                <span style={{ display: 'block', ...spriteBox(84, 136) }}>
                  <KioskSprite />
                </span>
              </Plant>
              <Plant x={352} y={122} w={168} h={132} href="https://greenbox.elmeny.hu" station="greenbox">
                <span style={{ display: 'block', ...spriteBox(168, 132) }}>
                  <GreenboxSprite />
                </span>
              </Plant>
              <Plant x={122} y={368} w={176} h={128} href="https://smart-wall.hu" station="smartwall">
                <span style={{ display: 'block', ...spriteBox(176, 128) }}>
                  <SmartWallSprite />
                </span>
              </Plant>

              {/* dancing guests */}
              {DANCERS.map((d, i) => (
                <Plant key={i} x={d.x} y={d.y} w={34} h={62} shadow={30}>
                  <span style={{ display: 'block', ...spriteBox(34, 62) }}>
                    <Person {...d.p} />
                  </span>
                </Plant>
              ))}

              {/* strolling guests */}
              <Walker delay="0s" person={{ body: '#28D0B8', dark: '#1E9E8C', skin: '#F4CBA6', pose: 2 }} />
              <Walker delay="-17s" person={{ body: '#F2937F', dark: '#D06B55', skin: '#8C5B3B', pose: 1, flip: true }} />
            </div>
          </div>

          {/* screen-space station labels — positioned each frame from the
              projected billboard rects */}
          {STATIONS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              ref={(el) => {
                labelRefs.current[s.key] = el
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 4,
                opacity: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                fontWeight: 600,
                background: 'rgba(255,255,255,.95)',
                color: '#17150D',
                padding: '5px 11px',
                borderRadius: 100,
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 22px rgba(0,0,0,.35)',
                willChange: 'transform',
                transition: 'opacity .4s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 10px 26px rgba(0,0,0,.45), 0 0 0 3px ${s.color}55`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,0,0,.35)')}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: s.color,
                  boxShadow: `0 0 0 4px ${s.color}33`,
                  animation: 'ep-pulse 2.4s ease-in-out infinite',
                }}
              />
              {s.label}
            </a>
          ))}

          {/* drag hint */}
          <span
            style={{
              position: 'absolute',
              bottom: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,.55)',
              letterSpacing: '.04em',
              background: 'rgba(255,255,255,.08)',
              padding: '7px 14px',
              borderRadius: 100,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              pointerEvents: 'none',
            }}
          >
            <span style={{ display: 'inline-block', animation: 'ep-sway 4s ease-in-out infinite' }}>⟲</span>
            Húzd el a forgatáshoz · magától is körbejár
          </span>
        </div>
      </Reveal>
    </section>
  )
}
