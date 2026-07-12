import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { ImageSlot } from './ImageSlot'
import { Squiggle } from './Squiggle'

// real AI Selfiemata output samples — mixed portrait/landscape crops, each
// tilted a few degrees for a scattered-polaroid feel; ordered so no two
// similar styles/subjects sit adjacent (loop seam included). Portraits are
// framed to their upper third so faces stay in view.
const STRIP: { w: number; h: number; src: string; alt: string; pos?: string; rot: number }[] = [
  { w: 200, h: 260, src: '/assets/photos/ai/hero-pixar.jpg', alt: 'AI Selfiemata minta: vendégfotó Pixar-stílusú animációs karakterként', pos: '50% 20%', rot: -2.5 },
  { w: 300, h: 185, src: '/assets/photos/ai/man-space.jpg', alt: 'AI Selfiemata minta: vendég űrhajósként', rot: 1.8 },
  { w: 195, h: 255, src: '/assets/photos/ai/woman-baroque.jpg', alt: 'AI Selfiemata minta: vendég barokk festményportrén', pos: '50% 22%', rot: 2.4 },
  { w: 300, h: 190, src: '/assets/photos/ai/man-f1.jpg', alt: 'AI Selfiemata minta: vendég Forma-1-es versenyzőként', rot: -1.6 },
  { w: 205, h: 265, src: '/assets/photos/ai/festmeny.jpg', alt: 'AI Selfiemata minta: vendégfotó klasszikus festményként', pos: '50% 20%', rot: 2 },
  { w: 290, h: 180, src: '/assets/photos/ai/man-viking.jpg', alt: 'AI Selfiemata minta: vendég viking harcosként', pos: '50% 24%', rot: -2.2 },
  { w: 200, h: 260, src: '/assets/photos/ai/karikatura.jpg', alt: 'AI Selfiemata minta: vendégfotó rajzolt karikatúraként', pos: '50% 20%', rot: 1.4 },
  { w: 210, h: 265, src: '/assets/photos/ai/woman-pirate.jpg', alt: 'AI Selfiemata minta: vendég kalózkapitányként', pos: '50% 22%', rot: -1.8 },
]

function StripRow({ hidden }: { hidden?: boolean }) {
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
          alt={hidden ? '' : s.alt}
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

/** "Mit csinálunk" + a continuously side-scrolling photo reference strip. */
export function WhatWeDo() {
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
          Mit csinálunk
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
          Interaktív rendezvény&shy;élményeket készítünk. A klasszikus fotóautomatát{' '}
          <span style={{ color: '#E94A35' }}>
            <Squiggle color="rgba(233,74,53,.45)" delay={500}>
              újragondoltuk:
            </Squiggle>
          </span>{' '}
          valós idejű AI-val a vendég
          fotója pár másodperc alatt{' '}
          <span style={{ color: '#9868F8' }}>egyedi, megosztható, brandingelt</span> alkotássá válik.
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
          Te csak válassz — a technikát, a személyzetet és a teljes hátteret mi hozzuk.
        </Reveal>
      </div>

      {/* auto-scrolling photo reference strip — vertical padding so the
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
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'ep-marquee 40s linear infinite',
          }}
        >
          <StripRow />
          <StripRow hidden />
        </div>
      </Reveal>
    </section>
  )
}
