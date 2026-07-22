import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cl } from '../hooks/useScene'
import { Magnetic } from './Magnetic'
import { useT, useLoc } from '../i18n'

interface HeroProps {
  heroP: number
}

const STAT_CHIPS = [
  { value: '9–15 mp', valueEn: '9–15 sec', label: 'AI generálás', labelEn: 'AI generation', color: '#4888F8' },
  { value: '∞ stílus', valueEn: '∞ styles', label: 'választható téma', labelEn: 'themes to pick from', color: '#9868F8' },
  { value: '100%', valueEn: '100%', label: 'rendezvényre szabva', labelEn: 'tailored to your event', color: '#E94A35' },
]

/** One headline unit rising out of its own mask, scrubbed by the reveal progress. */
function RiseWord({ p, i, children }: { p: number; i: number; children: ReactNode }) {
  const w = cl(p, i * 0.09, i * 0.09 + 0.55)
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        padding: '0.08em 0.05em 0.12em',
        margin: '-0.08em -0.05em -0.12em',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${((1 - w) * 108).toFixed(1)}%) rotate(${((1 - w) * 4).toFixed(2)}deg)`,
          transformOrigin: 'left bottom',
        }}
      >
        {children}
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ *
 *  True-3D kiosk matching the product reference sheet:
 *  white screen head (camera dot, dark display, photo slot on the
 *  sides, service door with lock on the back), black telescopic
 *  column and a flat black base on four casters.
 * ------------------------------------------------------------------ */

const HEAD_W = 300
const HEAD_H = 230
const HEAD_D = 150
// tall telescopic column per the reference sheet: ~1.5x wider (width only,
// depth unchanged) and much longer than the first iteration
const COL_W = 80
const COL_D = 54
const COL_H = 380
const BASE_W = 240
const BASE_H = 14
export const KIOSK_TOTAL_H = HEAD_H + COL_H + BASE_H
const TOTAL_H = KIOSK_TOTAL_H

function face(w: number, h: number, transform: string, extra?: CSSProperties): CSSProperties {
  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: w,
    height: h,
    margin: `${-h / 2}px 0 0 ${-w / 2}px`,
    transform,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    ...extra,
  }
}

/** Side panel of the head with the horizontal photo-exit slot. */
function HeadSide({ turn }: { turn: number }) {
  return (
    <>
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          width: 74,
          height: 7,
          margin: '-3.5px 0 0 -37px',
          borderRadius: 4,
          background: '#17150d',
          boxShadow: 'inset 0 1.5px 2px rgba(0,0,0,.8)',
        }}
      />
      {/* faint print emerging mid-rotation, teasing the output */}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          width: 58,
          height: 40,
          margin: '-3px 0 0 -29px',
          borderRadius: 3,
          background: '#fff',
          border: '1px solid #d8d8d3',
          transformOrigin: 'top center',
          transform: `rotateX(-72deg) scaleY(${(0.4 + 0.6 * turn).toFixed(3)})`,
          opacity: turn > 0.25 && turn < 0.9 ? 0.9 : 0,
          transition: 'opacity .3s',
        }}
      />
    </>
  )
}

export function Kiosk3D({
  turn,
  photo1On,
  photoOn,
  screenFlash,
}: {
  turn: number
  photo1On: number
  photoOn: number
  screenFlash: number
}) {
  const t = useT()
  const whiteFace = 'linear-gradient(180deg,#fcfcfb,#e9e9e5)'
  const sideFace = 'linear-gradient(180deg,#f1f1ee,#dededa)'
  const wheels = [
    [-86, -86],
    [86, -86],
    [-86, 86],
    [86, 86],
  ]
  return (
    <div style={{ position: 'relative', width: HEAD_W, height: TOTAL_H, transformStyle: 'preserve-3d' }}>
      {/* -------- head box -------- */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: HEAD_W, height: HEAD_H, transformStyle: 'preserve-3d' }}>
        {/* front */}
        <div style={face(HEAD_W, HEAD_H, `translateZ(${HEAD_D / 2}px)`, { background: whiteFace, borderRadius: 14 })}>
          <span
            style={{
              position: 'absolute',
              top: 9,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#111',
              border: '2px solid #d8d8d4',
            }}
          />
          {/* display */}
          <div
            style={{
              position: 'absolute',
              inset: '30px 18px 18px',
              borderRadius: 8,
              background: 'linear-gradient(150deg,#111110,#050504 65%)',
              overflow: 'hidden',
            }}
          >
            {/* standby glyph — gone once the first photo is taken */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Syne',
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: '.08em',
                color: `rgba(246,241,233,${(0.3 * (1 - photo1On)).toFixed(3)})`,
              }}
            >
              AI ✦
            </span>
            {/* the freshly shot group photo — lands with the first flash and
                stays on screen through the whole turn */}
            <img
              src="/assets/photos/team-original.jpg"
              alt={t('Csoportkép az AI Selfiemata fotóautomatával egy rendezvényen', 'Group photo taken with the AI Selfiemata photo booth at an event')}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 28%',
                opacity: photo1On.toFixed(3),
              }}
            />
            {/* glass reflection */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(115deg, rgba(255,255,255,.09) 0%, transparent 30%, transparent 70%, rgba(255,255,255,.05) 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* the AI-transformed version — "generates" in like a diffusion
                render: a scan line sweeps down revealing the image, its edge
                glowing in the AI purple–blue, the picture slightly oversat
                while forming, settling as it completes. Scroll-scrubbed. */}
            <img
              src="/assets/photos/team-heroes.jpg"
              alt={t('Ugyanaz a csoport az AI Selfiemata által generált szuperhős-képen', 'The same group in an AI Selfiemata-generated superhero image')}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // keep the faces in frame
                objectPosition: '50% 24%',
                opacity: photoOn > 0.01 ? 1 : 0,
                clipPath: `inset(0 0 ${((1 - photoOn) * 100).toFixed(2)}% 0)`,
                WebkitClipPath: `inset(0 0 ${((1 - photoOn) * 100).toFixed(2)}% 0)`,
                filter: `saturate(${(1 + 0.6 * photoOn * (1 - photoOn) * 4).toFixed(3)}) brightness(${(1 + 0.25 * photoOn * (1 - photoOn) * 4).toFixed(3)})`,
                transform: `scale(${(1.05 - 0.05 * photoOn).toFixed(3)})`,
              }}
            />
            {/* glowing scan line at the reveal edge */}
            {photoOn > 0.01 && photoOn < 0.995 && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${(photoOn * 100).toFixed(2)}%`,
                  height: 3,
                  marginTop: -1.5,
                  background: 'linear-gradient(90deg, rgba(155,107,242,0), #9B6BF2 22%, #7FB4FF 50%, #9B6BF2 78%, rgba(72,136,248,0))',
                  boxShadow: '0 0 14px 3px rgba(140,120,250,.85), 0 0 34px 10px rgba(90,130,250,.4)',
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* sparkles popping around the screen while the image forms */}
            {photoOn > 0.05 && photoOn < 1 && (
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {[
                  { l: '14%', t: '22%', s: 13, a: 0.1, b: 0.5 },
                  { l: '82%', t: '14%', s: 10, a: 0.25, b: 0.65 },
                  { l: '70%', t: '58%', s: 15, a: 0.4, b: 0.85 },
                  { l: '22%', t: '70%', s: 10, a: 0.55, b: 0.95 },
                  { l: '48%', t: '38%', s: 11, a: 0.3, b: 0.7 },
                ].map((sp, i) => {
                  const k = Math.max(0, Math.min(1, (photoOn - sp.a) / (sp.b - sp.a)))
                  const tw = k * (1 - k) * 4 // 0→1→0 twinkle
                  return (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        left: sp.l,
                        top: sp.t,
                        fontSize: sp.s,
                        lineHeight: 1,
                        color: '#fff',
                        textShadow: '0 0 8px rgba(155,107,242,.95), 0 0 18px rgba(72,136,248,.7)',
                        opacity: tw.toFixed(3),
                        transform: `scale(${(0.5 + tw).toFixed(3)}) rotate(${(k * 90).toFixed(1)}deg)`,
                      }}
                    >
                      ✦
                    </span>
                  )
                })}
              </span>
            )}
            <span
              style={{
                position: 'absolute',
                left: 10,
                bottom: 9,
                padding: '4px 10px',
                borderRadius: 100,
                background: 'linear-gradient(105deg,#9868F8,#4888F8)',
                color: '#fff',
                fontFamily: 'Syne',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '.08em',
                opacity: photoOn.toFixed(3),
              }}
            >
              AI ✦
            </span>
            {/* in-screen flash */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: '#fff',
                opacity: screenFlash.toFixed(3),
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
        {/* back with service door */}
        <div style={face(HEAD_W, HEAD_H, `rotateY(180deg) translateZ(${HEAD_D / 2}px)`, { background: whiteFace, borderRadius: 14 })}>
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 96,
              height: 96,
              transform: 'translate(-50%,-50%)',
              borderRadius: 8,
              border: '2px solid #d3d3ce',
              background: 'linear-gradient(180deg,#f7f7f4,#ebebe7)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                right: 9,
                top: '50%',
                width: 7,
                height: 7,
                marginTop: -3.5,
                borderRadius: '50%',
                background: '#9a9a94',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,.4)',
              }}
            />
          </span>
        </div>
        {/* sides with photo slot */}
        <div style={face(HEAD_D, HEAD_H, `rotateY(90deg) translateZ(${HEAD_W / 2}px)`, { background: sideFace, borderRadius: 6 })}>
          <HeadSide turn={turn} />
        </div>
        <div style={face(HEAD_D, HEAD_H, `rotateY(-90deg) translateZ(${HEAD_W / 2}px)`, { background: sideFace, borderRadius: 6 })}>
          <HeadSide turn={turn} />
        </div>
        {/* top + bottom */}
        <div style={face(HEAD_W, HEAD_D, `rotateX(90deg) translateZ(${HEAD_H / 2}px)`, { background: '#f6f6f3', borderRadius: 10 })} />
        <div style={face(HEAD_W, HEAD_D, `rotateX(-90deg) translateZ(${HEAD_H / 2}px)`, { background: '#cfcfca', borderRadius: 10 })} />
      </div>

      {/* -------- column -------- */}
      <div
        style={{
          position: 'absolute',
          left: (HEAD_W - COL_W) / 2,
          top: HEAD_H,
          width: COL_W,
          height: COL_H,
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={face(COL_W, COL_H, `translateZ(${COL_D / 2}px)`, { background: 'linear-gradient(180deg,#262626,#0b0b0b)' })}>
          {/* telescopic seams */}
          <span style={{ position: 'absolute', left: 7, right: 7, top: 120, height: 3, background: '#000', borderRadius: 2 }} />
          <span style={{ position: 'absolute', left: 7, right: 7, top: 250, height: 3, background: '#000', borderRadius: 2 }} />
        </div>
        <div style={face(COL_W, COL_H, `rotateY(180deg) translateZ(${COL_D / 2}px)`, { background: '#161616' })} />
        <div style={face(COL_D, COL_H, `rotateY(90deg) translateZ(${COL_W / 2}px)`, { background: '#111' })} />
        <div style={face(COL_D, COL_H, `rotateY(-90deg) translateZ(${COL_W / 2}px)`, { background: '#111' })} />
      </div>

      {/* -------- base slab + casters -------- */}
      <div
        style={{
          position: 'absolute',
          left: (HEAD_W - BASE_W) / 2,
          top: HEAD_H + COL_H,
          width: BASE_W,
          height: BASE_H,
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={face(BASE_W, BASE_H, `translateZ(${BASE_W / 2}px)`, { background: '#141414', borderRadius: 3 })} />
        <div style={face(BASE_W, BASE_H, `rotateY(180deg) translateZ(${BASE_W / 2}px)`, { background: '#0e0e0e', borderRadius: 3 })} />
        <div style={face(BASE_W, BASE_H, `rotateY(90deg) translateZ(${BASE_W / 2}px)`, { background: '#101010', borderRadius: 3 })} />
        <div style={face(BASE_W, BASE_H, `rotateY(-90deg) translateZ(${BASE_W / 2}px)`, { background: '#101010', borderRadius: 3 })} />
        <div style={face(BASE_W, BASE_W, `rotateX(90deg) translateZ(${BASE_H / 2}px)`, { background: 'linear-gradient(135deg,#222,#101010)', borderRadius: 8 })} />
        {/* casters: two crossed dark planes each — reads as a wheel from every angle */}
        {wheels.map(([wx, wz], i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: BASE_W / 2 + wx - 8,
              top: BASE_H,
              width: 16,
              height: 17,
              transformStyle: 'preserve-3d',
              transform: `translateZ(${wz}px)`,
            }}
          >
            <span style={{ position: 'absolute', inset: 0, background: '#0a0a0a', borderRadius: '45%' }} />
            <span style={{ position: 'absolute', inset: 0, background: '#0a0a0a', borderRadius: '45%', transform: 'rotateY(90deg)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Gala opening atmosphere: warm spotlight beams sweeping down + soft
 *  floating bokeh. Rendered on the dark stage behind the kiosk; the caller
 *  fades the whole layer out as the machine spins closer. */
function GalaLights({ op }: { op: number }) {
  if (op <= 0.002) return null
  const beams = [
    { left: '20%', rot: -17, w: 230, hue: 'rgba(245,196,110,0.50)' },
    { left: '50%', rot: 2, w: 280, hue: 'rgba(255,236,205,0.40)' },
    { left: '80%', rot: 16, w: 230, hue: 'rgba(242,147,127,0.50)' },
  ]
  const bokeh = [
    { left: '13%', top: '30%', s: 92, c: 'rgba(245,196,110,.55)', d: '0s' },
    { left: '83%', top: '25%', s: 74, c: 'rgba(242,147,127,.55)', d: '1.2s' },
    { left: '31%', top: '65%', s: 60, c: 'rgba(255,236,205,.5)', d: '.6s' },
    { left: '67%', top: '71%', s: 104, c: 'rgba(245,196,110,.42)', d: '2s' },
    { left: '50%', top: '16%', s: 44, c: 'rgba(255,255,255,.55)', d: '1.6s' },
    { left: '91%', top: '56%', s: 54, c: 'rgba(242,147,127,.48)', d: '.9s' },
  ]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: op, pointerEvents: 'none', overflow: 'hidden' }}>
      {beams.map((b, i) => (
        <div
          key={`b${i}`}
          className="ep-gala-beam"
          style={{
            position: 'absolute',
            top: '-14%',
            left: b.left,
            width: b.w,
            height: '150%',
            marginLeft: -b.w / 2,
            background: `linear-gradient(to bottom, ${b.hue} 0%, rgba(0,0,0,0) 72%)`,
            clipPath: 'polygon(43% 0, 57% 0, 100% 100%, 0% 100%)',
            transformOrigin: 'top center',
            filter: 'blur(7px)',
            mixBlendMode: 'screen',
            ['--rot' as string]: `${b.rot}deg`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      {bokeh.map((k, i) => (
        <span
          key={`k${i}`}
          className="ep-gala-bokeh"
          style={{
            position: 'absolute',
            left: k.left,
            top: k.top,
            width: k.s,
            height: k.s,
            marginLeft: -k.s / 2,
            marginTop: -k.s / 2,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, ${k.c}, rgba(0,0,0,0) 70%)`,
            filter: 'blur(2px)',
            mixBlendMode: 'screen',
            animationDelay: k.d,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Sticky scroll-choreographed hero. The kiosk starts far away in full
 * figure, spins all the way around while gliding closer, the camera
 * flashes and a generated sample appears on the display — then the dark
 * stage dissolves to cream while the headline + stat chips rise in.
 */
export function Hero({ heroP: p }: HeroProps) {
  const t = useT()
  const loc = useLoc()
  // Click-to-play: some visitors tap instead of scrolling. A tween drives
  // the window scroll through the hero's phases (spin → flash → photo →
  // copy rise) up to the snap point, so the whole entrance plays on tap.
  // Any manual scroll/tap aborts it so it never fights the user.
  const playRaf = useRef(0)
  const playHero = () => {
    cancelAnimationFrame(playRaf.current)
    const startY = window.scrollY
    const targetY = 1.28 * window.innerHeight // the reveal snap marker (top:128vh)
    if (targetY - startY < 8) return
    const t0 = performance.now()
    const DUR = 3000
    // suspend the page's CSS smooth scrolling for the tween: per-frame
    // scrollTo must land instantly, and Safari chokes on the newer
    // behavior:'instant' option — overriding the CSS works everywhere
    const docStyle = document.documentElement.style
    const prevBehavior = docStyle.scrollBehavior
    docStyle.scrollBehavior = 'auto'
    const abort = () => {
      cancelAnimationFrame(playRaf.current)
      docStyle.scrollBehavior = prevBehavior
      window.removeEventListener('wheel', abort)
      window.removeEventListener('touchstart', abort)
      window.removeEventListener('keydown', abort)
    }
    // user-initiated scroll cancels; our own scrollTo below doesn't fire wheel
    window.addEventListener('wheel', abort, { passive: true })
    window.addEventListener('touchstart', abort, { passive: true })
    window.addEventListener('keydown', abort)
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / DUR)
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 // ease-in-out cubic
      window.scrollTo(0, startY + (targetY - startY) * e)
      if (k < 1) playRaf.current = requestAnimationFrame(step)
      else abort()
    }
    playRaf.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(playRaf.current), [])

  // --- choreography -------------------------------------------------
  // full figure facing us → ONE full turn while drifting a bit closer →
  // flash + sample photo → the copy rises in front while the kiosk just
  // fades back (no extra zoom, no lift)
  // (thresholds are tuned to a 225vh section: the kiosk story plays out in
  // the same scroll distance as before, all the extra height is pure hold
  // time for the finished headline)
  // spin runs 20% quicker in scroll distance; the intro, the flash/photo
  // stretch and the reveal keep their previous pacing — every saved and
  // spare unit goes into the post-reveal hold (now 1.5x longer)
  const spin = cl(p, 0.022, 0.365)
  const spinE = spin * spin * (3 - 2 * spin)
  const rotY = -360 * spinE
  // a teaser flash right at the start, before the turn begins — the fresh
  // group photo lands with it and stays on screen for the whole turn
  const flashStart = cl(p, 0.026, 0.045) * (1 - cl(p, 0.053, 0.09))
  const flashEnd = cl(p, 0.385, 0.408) * (1 - cl(p, 0.416, 0.453))
  const flash = Math.min(1, flashStart + flashEnd)
  const photo1On = cl(p, 0.038, 0.05)
  // the AI image "generates" over a longer stretch so the scan-line reveal
  // reads as a real moment (kicked off by the second flash)
  const photoOn = cl(p, 0.408, 0.53)

  // completion beat: the instant the reveal finishes, the whole machine gives
  // one heartbeat and a lens ripple races from it out to the browser edges.
  // One-shot, re-armed if the visitor scrubs back before the reveal (so a
  // replay pulses again); skipped under prefers-reduced-motion.
  const [ripple, setRipple] = useState(0)
  const rippleArmed = useRef(true)
  const kioskRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (photoOn >= 0.999 && rippleArmed.current) {
      rippleArmed.current = false
      const reduce =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      setRipple((k) => k + 1)
      // restart the machine's heartbeat without remounting the 3D kiosk:
      // drop the class, force a reflow, re-add
      const el = kioskRef.current
      if (el) {
        el.classList.remove('ep-heartbeat')
        void el.offsetWidth
        el.classList.add('ep-heartbeat')
      }
    } else if (photoOn < 0.5 && !rippleArmed.current) {
      rippleArmed.current = true
    }
  }, [photoOn])
  // the landed photo gets a long sticky moment (~350px of scroll) before
  // the copy rises in, then holds to the end. Scroll only sets the TARGET —
  // the reveal itself chases it with a ~1s time constant, so a hard flick
  // can't skip the entrance: the words always play their rise in full.
  const revealT = cl(p, 0.711, 0.826)
  const revealRef = useRef(revealT)
  revealRef.current = revealT
  const [reveal, setReveal] = useState(0)
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      // no inertia under reduced motion — track the scroll directly
      let raf = 0
      const sync = () => {
        raf = requestAnimationFrame(sync)
        setReveal((s) => (s === revealRef.current ? s : revealRef.current))
      }
      raf = requestAnimationFrame(sync)
      return () => cancelAnimationFrame(raf)
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      setReveal((s) => {
        const t = revealRef.current
        const n = s + (t - s) * (1 - Math.exp(-3.4 * dt))
        // snap + bail out near rest so React skips re-renders while idle
        if (Math.abs(t - n) < 0.001) return t
        return n
      })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // ends ~20% closer than before, sitting lower and facing us square-on
  const finalScale = 0.82 + 0.5 * spinE
  const tiltX = 5 - 4 * spinE
  const ty = 40 + 150 * spinE

  const mix = reveal
  const dark = [23, 21, 13]
  const cream = [246, 241, 233]
  const bg = dark.map((d, i) => Math.round(d + (cream[i] - d) * mix))
  const heroBg = `rgb(${bg[0]},${bg[1]},${bg[2]})`

  // gala atmosphere: full at the opening (kiosk far away), gone by the time
  // it has spun close — beams + bokeh fade as the machine approaches
  const galaOp = Math.max(0, 1 - cl(p, 0.03, 0.32))
  const heroGlow = (0.5 * (1 - mix) * (0.35 + 0.65 * spinE)).toFixed(3)
  const copyOp = reveal.toFixed(2)
  // once risen, the copy stands perfectly still until the sticky releases
  const copyY = ((1 - reveal) * 40).toFixed(1)
  const copyPe: CSSProperties['pointerEvents'] = reveal > 0.6 ? 'auto' : 'none'
  const hintOp = (1 - cl(p, 0, 0.1)).toFixed(2)
  const hintColor = mix > 0.5 ? '#7A766B' : 'rgba(255,255,255,.7)'
  const shadowOp = (0.55 * (1 - reveal)).toFixed(3)

  // chip visuals live in .ep-chip (global.css) so mobile can compact them
  const chip: CSSProperties = {}

  return (
    <section id="top" data-hero style={{ position: 'relative', height: '247vh' }}>
      {/* scroll-snap marker at p≈0.87 (copy fully risen): momentum comes to
          rest here, so the entrance always gets seen — a fresh gesture is
          needed to continue past the hero */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '128vh',
          left: 0,
          width: 1,
          height: 1,
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
        }}
      />
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: heroBg,
        }}
      >
        {/* ambient glow — drifts with the cursor */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(120% 80% at calc(50% + var(--mxs, 0) * 12%) calc(38% + var(--mys, 0) * 10%), rgba(233,74,53,${heroGlow}) 0%, rgba(233,74,53,0) 55%)`,
            pointerEvents: 'none',
          }}
        />

        {/* gala opening: warm spotlight beams + floating bokeh behind the
            kiosk, fading out as the machine spins closer */}
        <GalaLights op={galaOp} />

        {/* 3D kiosk stage — while the copy takes over, a soft mask trims
            the column below the CTA/chips midline so the ghosted leg
            doesn't run through the text block */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1600px',
            WebkitMaskImage: `linear-gradient(180deg, #000 ${(100 - reveal * 30).toFixed(1)}%, transparent ${(104 - reveal * 30).toFixed(1)}%)`,
            maskImage: `linear-gradient(180deg, #000 ${(100 - reveal * 30).toFixed(1)}%, transparent ${(104 - reveal * 30).toFixed(1)}%)`,
          }}
        >
          {/* NO opacity here: opacity < 1 is a grouping property that forces
              transform-style back to flat and collapses the box to 2D — the
              fade is done by the scrim layer below instead */}
          <div
            ref={kioskRef}
            // the heartbeat animates the standalone `scale` property, which
            // composes with (never overrides) this inline transform
            style={{
              position: 'relative',
              transform: `translateY(${ty.toFixed(1)}px) rotateX(calc(${tiltX.toFixed(2)}deg + var(--mys, 0) * 5deg)) rotateY(calc(${rotY.toFixed(2)}deg + var(--mxs, 0) * -10deg)) scale(${finalScale.toFixed(3)})`,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <Kiosk3D turn={spinE} photo1On={photo1On} photoOn={photoOn} screenFlash={flash} />
            {/* ground shadow */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: TOTAL_H + 12,
                width: 360,
                height: 66,
                transform: 'translateX(-50%) rotateX(90deg) translateZ(-26px)',
                borderRadius: '50%',
                background: `radial-gradient(closest-side, rgba(0,0,0,${shadowOp}), transparent 70%)`,
              }}
            />
          </div>
        </div>

        {/* fade scrim: dissolves the kiosk into the (solid) background while
            the copy takes over — replaces the opacity that used to sit on
            the 3D wrapper and flattened it */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: heroBg,
            opacity: (reveal * 0.85).toFixed(3),
            pointerEvents: 'none',
          }}
        />

        {/* camera flash */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            opacity: flash.toFixed(2),
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />

        {/* completion ripple: a glowing ring races from the machine out to
            the browser edges; a matching backdrop-filter band riding the same
            ring refracts the whole stage beneath — a passing lens */}
        {ripple > 0 && (
          <div key={`rip-${ripple}`} aria-hidden="true" className="ep-ripple-stage">
            <span className="ep-ripple-lens" />
            <span className="ep-ripple-glow" />
          </div>
        )}

        {/* hero copy — the box is inset 84px top+bottom with safe centering:
            visually identical to true centering, but when the headline grows
            tall on wide windows it can never climb up under the nav bar */}
        <div
          style={{
            position: 'absolute',
            top: 84,
            bottom: 84,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'safe center',
            textAlign: 'center',
            padding: '0 24px',
            opacity: copyOp,
            transform: `translateY(${copyY}px)`,
            pointerEvents: copyPe,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: 'Syne',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'linear-gradient(135deg,#4888F8,#9868F8 55%,#4888F8)',
              backgroundSize: '200% 200%',
              animation: 'ep-grad 6s ease infinite',
              padding: '9px 18px',
              borderRadius: 100,
              marginBottom: 30,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
            {t('#1 rendezvény trend · 2026', '#1 event trend · 2026')}
          </span>
          <h1
            style={{
              fontFamily: 'Syne',
              fontWeight: 500,
              fontSize: 'clamp(46px,8.2vw,116px)',
              lineHeight: 0.96,
              letterSpacing: '-.035em',
              maxWidth: '13ch',
              color: '#17150D',
            }}
          >
            <RiseWord p={reveal} i={0}>
              {t('A', 'The')}
            </RiseWord>{' '}
            <RiseWord p={reveal} i={1}>
              {t('fotóautomata', 'photo booth')}
            </RiseWord>{' '}
            <RiseWord p={reveal} i={2}>
              <span style={{ fontWeight: 600, color: '#E94A35' }}>{t('újragondolva', 'reinvented')}</span>
            </RiseWord>{' '}
            <RiseWord p={reveal} i={3}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#17150D',
                  color: '#F6F1E9',
                  padding: '.02em .22em .1em',
                  borderRadius: '.14em',
                  transform: 'rotate(-1.6deg)',
                }}
              >
                AI&nbsp;Selfiemata.
              </span>
            </RiseWord>
          </h1>
          <p
            style={{
              fontSize: 'clamp(17px,2vw,21px)',
              lineHeight: 1.55,
              color: '#46433A',
              maxWidth: '48ch',
              marginTop: 28,
            }}
          >
            {t(
              'AI fotóautomata rendezvényre: a vendég fotóját az AI pár másodperc alatt egyedi, megosztható, brandingelt alkotássá varázsolja.',
              "AI photo booth for events: in just a few seconds, AI turns your guest's photo into a unique, shareable, branded creation.",
            )}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 38,
            }}
          >
            <Magnetic strength={8}>
              <a
                href={loc('/ai-fotoautomata')}
                style={{
                  background: '#17150D',
                  color: '#F6F1E9',
                  fontWeight: 600,
                  fontSize: 17,
                  padding: '17px 30px',
                  borderRadius: 100,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  transition: 'box-shadow .3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 16px 34px -14px rgba(23,21,13,.55)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                {t('Érdekel! Mutasd', "I'm in! Show me")} →
              </a>
            </Magnetic>
            <Magnetic strength={6}>
              <a
                href="#elmeny"
                style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: '#17150D',
                  fontWeight: 600,
                  fontSize: 17,
                  padding: '17px 30px',
                  borderRadius: 100,
                  border: '1.5px solid rgba(0,0,0,.18)',
                  transition: 'background .25s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {t('Szolgáltatások', 'Services')}
              </a>
            </Magnetic>
            <a
              href="#elmeny"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                fontWeight: 600,
                fontSize: 17,
                color: '#46433A',
                padding: '17px 8px',
                // text and arrow nudge downward together
                animation: 'ep-nudge 1.8s ease-in-out infinite',
              }}
            >
              {t('Ismerd meg!', 'See how it works')}
              <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
                ↓
              </span>
            </a>
          </div>
          <div className="ep-chiprow">
            {STAT_CHIPS.map((c, i) => {
              const cp = cl(reveal, 0.25 + i * 0.12, 0.7 + i * 0.12)
              return (
                <div
                  key={c.label}
                  className="ep-chip"
                  style={{
                    ...chip,
                    opacity: cp.toFixed(2),
                    transform: `translateY(${((1 - cp) * 26).toFixed(1)}px) scale(${(0.94 + cp * 0.06).toFixed(3)})`,
                  }}
                >
                  <div
                    className="ep-chip-value"
                    style={{
                      fontFamily: 'Syne',
                      fontWeight: 600,
                      letterSpacing: '-.01em',
                      color: c.color,
                    }}
                  >
                    {t(c.value, c.valueEn)}
                  </div>
                  <div className="ep-chip-label" style={{ color: '#7A766B', marginTop: 2 }}>{t(c.label, c.labelEn)}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* scroll hint — also a play button: tap to run the whole entrance */}
        <button
          type="button"
          onClick={playHero}
          aria-label={t('Animáció lejátszása', 'Play animation')}
          style={{
            position: 'absolute',
            bottom: 34,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: hintOp,
            color: hintColor,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '4px 12px',
            pointerEvents: Number(hintOp) > 0.05 ? 'auto' : 'none',
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            {t('Görgess vagy koppints', 'Scroll or tap')}
          </span>
          <span
            style={{
              width: 1,
              height: 38,
              background: 'currentColor',
              animation: 'ep-bob 1.8s ease-in-out infinite',
            }}
          />
        </button>
      </div>
    </section>
  )
}
