import { useEffect, useRef } from 'react'
import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { ImageSlot } from './ImageSlot'
import { Squiggle } from './Squiggle'
import { useT } from '../i18n'

// real AI Selfiemata output samples — mixed portrait/landscape crops, each
// tilted a few degrees for a scattered-polaroid feel; ordered so no two
// similar styles/subjects sit adjacent (loop seam included). Portraits are
// framed to their upper third so faces stay in view.
const STRIP: { w: number; h: number; src: string; alt: string; altEn: string; pos?: string; rot: number }[] = [
  { w: 200, h: 260, src: '/assets/photos/ai/hero-pixar.jpg', alt: 'AI Selfiemata minta: vendégfotó Pixar-stílusú animációs karakterként', altEn: 'AI Selfiemata sample: guest photo as a Pixar-style animated character', pos: '50% 20%', rot: -2.5 },
  { w: 300, h: 185, src: '/assets/photos/ai/man-space.jpg', alt: 'AI Selfiemata minta: vendég űrhajósként', altEn: 'AI Selfiemata sample: guest as an astronaut', rot: 1.8 },
  { w: 195, h: 255, src: '/assets/photos/ai/woman-baroque.jpg', alt: 'AI Selfiemata minta: vendég barokk festményportrén', altEn: 'AI Selfiemata sample: guest in a Baroque painted portrait', pos: '50% 22%', rot: 2.4 },
  { w: 300, h: 190, src: '/assets/photos/ai/man-f1.jpg', alt: 'AI Selfiemata minta: vendég Forma-1-es versenyzőként', altEn: 'AI Selfiemata sample: guest as a Formula 1 racing driver', rot: -1.6 },
  { w: 205, h: 265, src: '/assets/photos/ai/festmeny.jpg', alt: 'AI Selfiemata minta: vendégfotó klasszikus festményként', altEn: 'AI Selfiemata sample: guest photo as a classical painting', pos: '50% 20%', rot: 2 },
  { w: 290, h: 180, src: '/assets/photos/ai/man-viking.jpg', alt: 'AI Selfiemata minta: vendég viking harcosként', altEn: 'AI Selfiemata sample: guest as a Viking warrior', pos: '50% 24%', rot: -2.2 },
  { w: 200, h: 260, src: '/assets/photos/ai/karikatura.jpg', alt: 'AI Selfiemata minta: vendégfotó rajzolt karikatúraként', altEn: 'AI Selfiemata sample: guest photo as a hand-drawn caricature', pos: '50% 20%', rot: 1.4 },
  { w: 210, h: 265, src: '/assets/photos/ai/woman-pirate.jpg', alt: 'AI Selfiemata minta: vendég kalózkapitányként', altEn: 'AI Selfiemata sample: guest as a pirate captain', pos: '50% 22%', rot: -1.8 },
]

function StripRow({ hidden }: { hidden?: boolean }) {
  const t = useT()
  // trailing padding instead of a track gap keeps the -50% loop seamless
  return (
    <div style={{ display: 'flex', gap: 26, paddingRight: 26, alignItems: 'center' }} aria-hidden={hidden || undefined}>
      {STRIP.map((s, i) => (
        <ImageSlot
          key={i}
          shape="rounded"
          radius={16}
          fit="cover"
          src={s.src}
          alt={hidden ? '' : t(s.alt, s.altEn)}
          position={s.pos}
          style={{
            width: s.w,
            height: s.h,
            display: 'block',
            flex: 'none',
            transform: `rotate(${s.rot}deg)`,
            boxShadow: '0 18px 40px -20px rgba(23,21,13,.35)',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Drag-to-fling photo strip: idle when untouched, spun only by dragging and
 * coasting on momentum. It loops infinitely (two identical rows, offset
 * wrapped modulo one row's width) and never reacts to page scroll —
 * transform-only, with touch-action:pan-y so vertical page scroll still works.
 */
function DragStrip() {
  const track = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

    let width = el.scrollWidth / 2 // one row; the second is a duplicate
    let x = 0
    let v = 0 // px per ms
    let dragging = false
    let lastX = 0
    let lastT = 0
    let raf = 0

    const wrap = () => {
      if (width > 0) {
        while (x <= -width) x += width
        while (x > 0) x -= width
      }
    }
    const apply = () => {
      wrap()
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    const measure = () => {
      width = el.scrollWidth / 2
      apply()
    }

    const coast = () => {
      let prev = now()
      const step = () => {
        const t = now()
        const dt = Math.min(48, t - prev)
        prev = t
        x += v * dt
        // exponential friction, framerate-independent
        v *= Math.pow(0.94, dt / 16.67)
        apply()
        if (Math.abs(v) > 0.015) raf = requestAnimationFrame(step)
        else raf = 0
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(step)
    }

    const onDown = (e: PointerEvent) => {
      dragging = true
      cancelAnimationFrame(raf)
      raf = 0
      v = 0
      lastX = e.clientX
      lastT = now()
      el.setPointerCapture?.(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const t = now()
      const dx = e.clientX - lastX
      const dt = t - lastT
      x += dx
      if (dt > 0) v = 0.8 * v + 0.2 * (dx / dt) // smoothed velocity
      lastX = e.clientX
      lastT = t
      apply()
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      el.releasePointerCapture?.(e.pointerId)
      el.style.cursor = 'grab'
      // drop stale velocity if the finger paused before releasing
      if (now() - lastT > 90) v = 0
      if (Math.abs(v) > 0.02) coast()
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    window.addEventListener('resize', measure)
    measure()

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div
      ref={track}
      onDragStart={(e) => e.preventDefault()}
      style={{
        display: 'flex',
        width: 'max-content',
        cursor: 'grab',
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        willChange: 'transform',
      }}
    >
      <StripRow />
      <StripRow hidden />
    </div>
  )
}

/** "Mit csinálunk" + a drag-to-fling photo reference strip. */
export function WhatWeDo() {
  const t = useT()
  return (
    <section
      id="elmeny"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: 'clamp(45px,7vw,90px) clamp(24px,6vw,90px) clamp(90px,14vw,180px)',
        // anchor lands so the heading sits one line below the fixed nav
        scrollMarginTop: 'calc(110px - clamp(45px, 7vw, 90px))',
      }}
    >
      <Doodle n={2} color="rgba(0,0,0,.05)" size={96} left="3%" top="30%" anim="sway" duration={11} rotate="-10deg" />
      <Doodle n={4} color="rgba(0,0,0,.045)" size={64} left="46%" bottom="14%" anim="float2" duration={8} rotate="6deg" />

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
        {/* snapping camera doodle: tilts side to side, flash pops on top;
            on mobile it shrinks into the bottom-right of the text block */}
        <span className="ep-camdoodle" aria-hidden="true">
          <span className="ep-camdoodle-flash" />
          <span className="ep-camdoodle-body" />
        </span>
        <Reveal
          as="span"
          style={{
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#E94A35',
            marginBottom: 30,
          }}
        >
          {t('Mit csinálunk', 'What we do')}
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          style={{
            fontFamily: 'Syne',
            fontWeight: 500,
            fontSize: 'clamp(30px,4.2vw,60px)',
            lineHeight: 1.06,
            letterSpacing: '-.03em',
            maxWidth: '22ch',
          }}
        >
          {t('Interaktív rendezvény', 'Interactive event')}&shy;{t('élményeket készítünk. A klasszikus fotóautomatát', ' experiences we craft. The classic photo booth')}{' '}
          <span style={{ color: '#E94A35' }}>
            <Squiggle color="rgba(233,74,53,.45)" delay={500}>
              {t('újragondoltuk:', 'reinvented:')}
            </Squiggle>
          </span>{' '}
          {t('valós idejű AI-val a vendég fotója pár másodperc alatt', 'with real-time AI, a guest photo becomes, in seconds, a')}{' '}
          <span style={{ color: '#9868F8' }}>{t('egyedi, megosztható, brandingelt', 'unique, shareable, branded')}</span>{t(' alkotássá válik.', ' creation.')}
        </Reveal>
        <Reveal
          as="p"
          delay={120}
          style={{
            fontSize: 'clamp(18px,1.7vw,22px)',
            lineHeight: 1.55,
            color: '#46433A',
            maxWidth: '52ch',
            marginTop: 30,
          }}
        >
          {t('Te csak válassz — a technikát, a személyzetet és a teljes hátteret mi hozzuk.', 'You just choose — we bring the tech, the staff and the entire setup.')}
        </Reveal>
      </div>

      {/* drag-to-fling photo reference strip — vertical padding so the
          tilted cards don't clip at the top/bottom edges */}
      <Reveal
        delay={160}
        style={{
          marginTop: 'clamp(36px,5vw,60px)',
          padding: '22px 0',
          position: 'relative',
          overflow: 'hidden',
          WebkitMask: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
          mask: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
        }}
      >
        <DragStrip />
      </Reveal>
    </section>
  )
}
