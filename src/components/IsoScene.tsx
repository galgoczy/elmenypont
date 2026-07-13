import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Reveal } from './Reveal'
import { Words } from './Words'

/* ------------------------------------------------------------------ *
 *  Rotatable paper-diorama event space.
 *
 *  The floor is a true 3D plane (rotateX + rotateZ, driven by the
 *  --spin/--tilt custom properties); every prop is a hand-drawn SVG
 *  "paper cutout" planted on the plane and counter-rotated via the
 *  shared --bill transform so it always faces the camera. Drag to spin
 *  (with inertia), the scene keeps rotating on its own — even under
 *  the cursor — and only pauses while actively grabbed or while a
 *  station info card is open. Clicking a station opens a one-line
 *  description card with a "Tovább" link.
 * ------------------------------------------------------------------ */

const FLOOR = 460

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
      {/* printed photo — slides out of the SIDE slot, behind the body */}
      <g style={{ animation: 'ep-kphoto 6s ease-in-out infinite' }}>
        <g transform="translate(58 44)">
          <rect x="0" y="0" width="26" height="32" rx="2.5" fill="#fff" stroke="#D8D2C6" strokeWidth="1.5" />
          <rect x="3" y="3" width="20" height="20" rx="1.5" fill="#9868F8" opacity="0.85" />
          <rect x="3" y="26" width="12" height="2.5" rx="1.25" fill="#C9C3B6" />
        </g>
      </g>
      {/* stand */}
      <rect x="38" y="92" width="8" height="36" fill="#3A352A" />
      <rect x="22" y="126" width="40" height="8" rx="4" fill="#3A352A" />
      {/* body */}
      <rect x="8" y="6" width="68" height="88" rx="12" fill="url(#ep-kg)" stroke="rgba(255,255,255,.35)" strokeWidth="2.5" />
      {/* side slot the photo exits from */}
      <rect x="71.5" y="46" width="4" height="30" rx="2" fill="rgba(11,10,7,.55)" />
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

/** Hand-drawn rocket doodle as ONE compound path so a single
 *  stroke-dashoffset animation "draws" it subpath by subpath. */
const SW_DOODLE =
  'M62 76 C56 60 64 42 82 33 C98 39 106 55 99 71 C90 84 71 85 62 76 Z ' +
  'M76 54 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 ' +
  'M61 78 L48 92 M72 84 L66 96 M94 80 L101 93'

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
      <defs>
        <clipPath id="ep-sw-clip">
          <rect x="8" y="8" width="160" height="92" rx="10" />
        </clipPath>
      </defs>
      {/* feet */}
      <rect x="26" y="100" width="10" height="22" rx="3" fill="#3A352A" />
      <rect x="140" y="100" width="10" height="22" rx="3" fill="#3A352A" />
      {/* wall */}
      <rect x="6" y="6" width="164" height="96" rx="12" fill="#211D14" stroke="rgba(246,241,233,.3)" strokeWidth="2.5" />
      {/* colourful tiles — fade away during the blackout */}
      <g style={{ animation: 'ep-sw-tiles 10.5s linear infinite' }}>{tiles}</g>
      {/* blackout board */}
      <rect
        x="10"
        y="10"
        width="156"
        height="88"
        rx="9"
        fill="#060504"
        opacity="0"
        style={{ animation: 'ep-sw-dark 10.5s linear infinite' }}
      />
      {/* hand-drawn rocket doodle on the black board */}
      <path
        d={SW_DOODLE}
        fill="none"
        stroke="#F6F1E9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
        opacity="0"
        style={{ animation: 'ep-sw-draw 10.5s linear infinite' }}
      />
      {/* white sweep flash from the bottom-right corner */}
      <g clipPath="url(#ep-sw-clip)">
        <g style={{ animation: 'ep-sw-sweep 10.5s linear infinite' }} opacity="0">
          <rect x="60" y="-80" width="52" height="300" fill="rgba(255,255,255,.85)" transform="rotate(35 88 54)" />
        </g>
      </g>
      {/* touch highlight where the guest presses */}
      <circle cx="134" cy="66" r="7" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" style={{ animation: 'ep-pulse 2s ease-in-out infinite' }} />
      {/* guest touching the wall — the arm presses right before the sweep */}
      <circle cx="150" cy="82" r="7" fill="#E8B48C" />
      <path d="M150 89 q-9 4 -9 21 h18 q0 -17 -9 -21 Z" fill="#F2937F" />
      <path
        d="M146 93 L135 70"
        stroke="#F2937F"
        strokeWidth="4.5"
        strokeLinecap="round"
        style={{
          transformBox: 'fill-box',
          transformOrigin: '100% 100%',
          animation: 'ep-sw-arm 10.5s linear infinite',
        }}
      />
      <rect x="144" y="110" width="4.5" height="16" rx="2.25" fill="#D06B55" />
      <rect x="151.5" y="110" width="4.5" height="16" rx="2.25" fill="#D06B55" />
    </svg>
  )
}

/** Adult-proportioned silhouette (feet at local 0,0). Poses 0-2 dance,
 *  3-4 are relaxed loitering stances. */
function DancerFig({ color, pose }: { color: string; pose: 0 | 1 | 2 | 3 | 4 }) {
  const arms =
    pose === 0 ? (
      <path d="M-5 -44 L-16 -60 M5 -44 L16 -34" stroke={color} strokeWidth="4" strokeLinecap="round" />
    ) : pose === 1 ? (
      <path d="M-5 -44 L-15 -33 M5 -44 L15 -59" stroke={color} strokeWidth="4" strokeLinecap="round" />
    ) : pose === 2 ? (
      <path d="M-5 -44 L-16 -56 M5 -44 L16 -56" stroke={color} strokeWidth="4" strokeLinecap="round" />
    ) : pose === 3 ? (
      <path d="M-5 -44 L-9 -29 M5 -44 L9 -29" stroke={color} strokeWidth="4" strokeLinecap="round" />
    ) : (
      // holding a drink
      <>
        <path d="M-5 -44 L-9 -30 M5 -44 L13 -38" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <rect x="11" y="-46" width="5" height="8" rx="1.5" fill="rgba(246,241,233,.85)" />
      </>
    )
  return (
    <>
      <circle cx="0" cy="-56" r="6.5" fill={color} />
      <rect x="-6.5" y="-48" width="13" height="23" rx="6.5" fill={color} />
      {arms}
      <path d="M-3 -26 L-9 0 M3 -26 L9 -1" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </>
  )
}

/** Dance corner: colour-cycling disco lamps over 2-3 dancing guests. */
function DanceCornerSprite() {
  const lampX = [50, 90, 130]
  return (
    <svg viewBox="0 0 180 160" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* truss */}
      <path d="M18 156 L18 14 M162 156 L162 14 M14 14 L166 14" stroke="#3A352A" strokeWidth="4" strokeLinecap="round" />
      {lampX.map((x, i) => (
        <g key={i}>
          {/* light cone */}
          <polygon
            points={`${x - 5},26 ${x + 5},26 ${x + 26},150 ${x - 26},150`}
            opacity="0.16"
            style={{ animation: `ep-disco 5s linear ${-i * 1.7}s infinite` }}
          />
          {/* lamp head */}
          <path d={`M${x - 7} 14 L${x + 7} 14 L${x + 5} 26 L${x - 5} 26 Z`} fill="#2B2619" stroke="#4A443A" strokeWidth="1.5" />
          <circle cx={x} cy="27" r="4.5" style={{ animation: `ep-disco 5s linear ${-i * 1.7}s infinite` }} />
        </g>
      ))}
      {/* dancers — outer <g> holds the static position (a CSS transform
          animation on the same element would override it) */}
      <g transform="translate(56 152)">
        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'ep-dance1 1.5s ease-in-out infinite' }}>
          <DancerFig color="#E94A35" pose={0} />
        </g>
      </g>
      <g transform="translate(92 154)">
        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'ep-dance2 1.9s ease-in-out infinite .3s' }}>
          <DancerFig color="#28D0B8" pose={1} />
        </g>
      </g>
      <g transform="translate(126 152)">
        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'ep-dance3 1.7s ease-in-out infinite .6s' }}>
          <DancerFig color="#9868F8" pose={2} />
        </g>
      </g>
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
  /** key for the screen-space label + click-proxy overlays to track */
  station?: string
  children: ReactNode
}

/**
 * Billboarded paper-cutout standing at (x, y) on the floor, feet planted.
 * The sprite itself never takes pointer events — clicking is handled by
 * screen-space proxies chasing the projected rects (3D hit-testing is
 * unreliable for billboards in the back half of the floor).
 */
function Plant({ x, y, w, h, shadow, station, children }: PlantProps) {
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
          pointerEvents: 'none',
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
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
      </div>
    </>
  )
}

/* ---------- the scene ---------------------------------------------- */

const STATIONS = [
  {
    key: 'selfiemata',
    href: '/ai-fotoautomata',
    label: 'AI Selfiemata',
    color: '#4888F8',
    text: 'A vendég fotójából pár másodperc alatt egyedi, brandingelt AI-kép készül — nyomtatva vagy azonnal megosztva.',
  },
  {
    key: 'greenbox',
    href: '/greenbox',
    label: 'Greenbox stúdió',
    color: '#48D880',
    text: 'Zöld hátteres stúdió-automata profi világítással: a vendégek bármilyen helyszín vagy céges arculat elé varázsolhatók.',
  },
  {
    key: 'smartwall',
    href: '/smart-wall',
    label: 'Smart Wall',
    color: '#E94A35',
    text: 'Interaktív, érinthető vetített fal — termékbemutató, infografika és játék egyetlen látványos felületen.',
  },
]

export function IsoScene() {
  const secRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const labelRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const proxyRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [active, setActive] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const hideTimer = useRef(0)
  const closeTimer = useRef(0)
  const movedRef = useRef(0)

  const clearTimers = () => {
    window.clearTimeout(hideTimer.current)
    window.clearTimeout(closeTimer.current)
  }
  /** fade the card away after 4s unless the pointer is resting on it */
  const armHide = () => {
    clearTimers()
    hideTimer.current = window.setTimeout(() => {
      setClosing(true)
      closeTimer.current = window.setTimeout(() => {
        setActive(null)
        setClosing(false)
      }, 600)
    }, 4000)
  }

  const pick = (key: string) => {
    // ignore the click that ends a drag gesture
    if (movedRef.current > 6) return
    clearTimers()
    setClosing(false)
    setActive((a) => (a === key ? null : key))
  }

  useEffect(() => {
    if (active) armHide()
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

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
        if (!el) return
        const r = el.getBoundingClientRect()
        const x = r.left - sr.left + r.width / 2
        const y = r.top - sr.top - 10
        const lab = labelRefs.current[key]
        if (lab) {
          lab.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`
          lab.style.opacity = '1'
        }
        // invisible click proxy stretched over the projected sprite rect
        const proxy = proxyRefs.current[key]
        if (proxy) {
          proxy.style.transform = `translate(${(r.left - sr.left).toFixed(1)}px, ${(r.top - sr.top).toFixed(1)}px)`
          proxy.style.width = `${r.width.toFixed(1)}px`
          proxy.style.height = `${r.height.toFixed(1)}px`
        }
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
    let raf = 0
    let last = performance.now()

    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      dragging = true
      movedRef.current = 0
      lastX = e.clientX
      lastMove = performance.now()
      vel = 0
      stage.style.cursor = 'grabbing'
    }
    // window-level move/up: no pointer capture, so station clicks still
    // land on the stations instead of being retargeted to the stage
    const move = (e: PointerEvent) => {
      const now = performance.now()
      if (dragging) {
        // drag right → scene turns right (spin follows the hand)
        const d = (e.clientX - lastX) * -0.35
        const dtm = Math.max(8, now - lastMove)
        movedRef.current += Math.abs(e.clientX - lastX)
        lastX = e.clientX
        lastMove = now
        spin += d
        vel = Math.max(-220, Math.min(220, (d / dtm) * 1000))
      } else {
        const r = stage.getBoundingClientRect()
        if (e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right) {
          const cy = (e.clientY - r.top) / r.height - 0.5
          tiltT = cy * -5
        } else {
          tiltT = 0
        }
      }
    }
    const up = () => {
      if (!dragging) return
      dragging = false
      stage.style.cursor = 'grab'
      // let the click handler see the travelled distance, then reset
      window.setTimeout(() => {
        movedRef.current = 0
      }, 0)
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
        // keeps turning on its own — under the cursor and behind an open
        // info card too; pauses only while actively grabbed
        spin += 5.2 * dt
      }
      tilt += (tiltT - tilt) * (1 - Math.exp(-6 * dt))
      sec.style.setProperty('--spin', `${spin.toFixed(3)}deg`)
      sec.style.setProperty('--tilt', `${tilt.toFixed(3)}deg`)
      positionLabels()
    }

    stage.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    raf = requestAnimationFrame(tick)
    return () => {
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      cancelAnimationFrame(raf)
    }
  }, [])

  const spriteBox = (w: number, h: number): CSSProperties => ({ width: w, height: h })
  const activeInfo = STATIONS.find((s) => s.key === active)

  return (
    <section
      ref={secRef}
      style={{
        position: 'relative',
        background: '#F6F1E9',
        // small top gap so the rounded card never touches the full-width
        // doodle-break panel ending right above it
        padding: 'clamp(14px,2vw,26px) clamp(16px,4vw,56px) clamp(80px,10vw,130px)',
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
          // overflow:hidden alone doesn't clip the 3D-transformed floor in
          // Chromium — contain:paint forces it, so the diorama can't spill
          // past the card edge on narrow screens
          contain: 'paint',
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
              transformStyle: 'preserve-3d',
            }}
          >
            {/* floor plane — centred with absolute + translate instead of
                flexbox: WebKit falls back to safe (start) alignment when a
                flex item overflows its container, which shoved the rotation
                pivot off-centre on portrait phones. The phone downscale also
                lives inside the transform chain for the same reason. */}
            <div
              className="ep-isofloor"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: FLOOR,
                height: FLOOR,
                transform:
                  'translate(-50%, -50%) scale(var(--ep-isoscale, 1)) rotateX(calc(58deg + var(--tilt, 0deg))) rotateZ(var(--spin, -45deg))',
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

              {/* colour-cycling light wash under the dance corner */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 268,
                  top: 268,
                  width: 175,
                  height: 175,
                  borderRadius: '50%',
                  filter: 'blur(10px)',
                  animation: 'ep-discoglow 5s linear infinite',
                }}
              />

              {/* drawn floor markings — dance rings under the disco corner */}
              <svg
                viewBox={`0 0 ${FLOOR} ${FLOOR}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              >
                <g style={{ transformOrigin: '355px 355px', animation: 'ep-spin 70s linear infinite' }}>
                  <circle cx="355" cy="355" r="52" fill="none" stroke="rgba(246,241,233,.28)" strokeWidth="3" strokeDasharray="18 13" strokeLinecap="round" />
                  <circle cx="355" cy="355" r="74" fill="none" stroke="rgba(246,241,233,.12)" strokeWidth="2" strokeDasharray="5 12" strokeLinecap="round" />
                </g>
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
              <Plant x={112} y={100} w={84} h={136} station="selfiemata">
                <span style={{ display: 'block', ...spriteBox(84, 136) }}>
                  <KioskSprite />
                </span>
              </Plant>
              <Plant x={352} y={122} w={168} h={132} station="greenbox">
                <span style={{ display: 'block', ...spriteBox(168, 132) }}>
                  <GreenboxSprite />
                </span>
              </Plant>
              <Plant x={122} y={368} w={176} h={128} station="smartwall">
                <span style={{ display: 'block', ...spriteBox(176, 128) }}>
                  <SmartWallSprite />
                </span>
              </Plant>

              {/* dance corner with disco lamps */}
              <Plant x={355} y={362} w={180} h={160} shadow={150}>
                <span style={{ display: 'block', ...spriteBox(180, 160) }}>
                  <DanceCornerSprite />
                </span>
              </Plant>

              {/* loitering guests chatting in the middle, just for mood */}
              <Plant x={224} y={224} w={36} h={72} shadow={32}>
                <span style={{ display: 'block', ...spriteBox(36, 72) }}>
                  <svg viewBox="0 0 36 72" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                    <g transform="translate(18 70) scale(-1 1)">
                      <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'ep-idle 3.6s ease-in-out infinite' }}>
                        <DancerFig color="#4888F8" pose={4} />
                      </g>
                    </g>
                  </svg>
                </span>
              </Plant>
              <Plant x={258} y={244} w={36} h={72} shadow={32}>
                <span style={{ display: 'block', ...spriteBox(36, 72) }}>
                  <svg viewBox="0 0 36 72" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                    <g transform="translate(18 70)">
                      <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'ep-idle 4.3s ease-in-out infinite .9s' }}>
                        <DancerFig color="#F2937F" pose={3} />
                      </g>
                    </g>
                  </svg>
                </span>
              </Plant>
            </div>
          </div>

          {/* invisible click proxies stretched over the projected sprite
              rects — 3D hit-testing misses billboards in the back half */}
          {STATIONS.map((s) => (
            <button
              key={`proxy-${s.key}`}
              type="button"
              aria-label={s.label}
              ref={(el) => {
                proxyRefs.current[s.key] = el
              }}
              onClick={() => pick(s.key)}
              onMouseEnter={() => {
                const el = stageRef.current?.querySelector<HTMLElement>(`[data-station="${s.key}"]`)
                if (el) {
                  el.style.transition = 'filter .25s'
                  el.style.filter = 'brightness(1.12)'
                }
              }}
              onMouseLeave={() => {
                const el = stageRef.current?.querySelector<HTMLElement>(`[data-station="${s.key}"]`)
                if (el) el.style.filter = 'none'
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 3,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                willChange: 'transform',
              }}
            />
          ))}

          {/* screen-space station labels — positioned each frame from the
              projected billboard rects */}
          {STATIONS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              ref={(el) => {
                labelRefs.current[s.key] = el
              }}
              onClick={(e) => {
                e.preventDefault()
                pick(s.key)
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
                background: active === s.key ? '#fff' : 'rgba(255,255,255,.95)',
                color: '#17150D',
                padding: '5px 11px',
                borderRadius: 100,
                whiteSpace: 'nowrap',
                boxShadow: active === s.key ? `0 10px 26px rgba(0,0,0,.45), 0 0 0 3px ${s.color}66` : '0 8px 22px rgba(0,0,0,.35)',
                willChange: 'transform',
                transition: 'opacity .4s, box-shadow .3s',
              }}
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

          {/* station info card — fades away after 4s unless hovered */}
          {activeInfo && (
            <div
              onMouseEnter={() => {
                clearTimers()
                setClosing(false)
              }}
              onMouseLeave={armHide}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 46,
                transform: 'translateX(-50%)',
                zIndex: 6,
                width: 'min(92%, 470px)',
                background: 'rgba(255,255,255,.97)',
                color: '#17150D',
                borderRadius: 18,
                padding: '16px 20px',
                boxShadow: '0 24px 60px rgba(0,0,0,.5)',
                // fill-mode backwards: after the entry animation the inline
                // opacity (the fade-out) takes over
                animation: 'ep-cardin .35s cubic-bezier(.2,.8,.2,1.1) backwards',
                opacity: closing ? 0 : 1,
                transition: 'opacity .6s ease',
              }}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Bezárás"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  border: 'none',
                  background: 'none',
                  fontSize: 18,
                  lineHeight: 1,
                  color: '#7A766B',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ×
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: activeInfo.color }} />
                <strong style={{ fontFamily: 'Syne', fontSize: 16 }}>{activeInfo.label}</strong>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: '#46433A', marginTop: 6 }}>{activeInfo.text}</p>
              <a
                href={activeInfo.href}
                style={{ display: 'inline-block', marginTop: 8, fontWeight: 600, fontSize: 14, color: '#E94A35' }}
              >
                Tovább →
              </a>
            </div>
          )}

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
