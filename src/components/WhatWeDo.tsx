import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { ImageSlot } from './ImageSlot'
import { Squiggle } from './Squiggle'

// widths mirror the prototype's varied strip rhythm; ~1/3 height (190px)
const STRIP = [300, 260, 300, 250, 300, 270]

function StripRow({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 16 }} aria-hidden={hidden || undefined}>
      {STRIP.map((w, i) => (
        <ImageSlot
          key={i}
          shape="rounded"
          radius={16}
          fit="cover"
          placeholder="Rendezvény fotó"
          style={{ width: w, height: 190, display: 'block', flex: 'none' }}
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
        padding: 'clamp(90px,14vw,180px) clamp(24px,6vw,90px)',
      }}
    >
      <Reveal
        as="span"
        style={{
          position: 'absolute',
          right: '6vw',
          top: 60,
          width: 'clamp(90px,11vw,150px)',
          height: 'clamp(90px,11vw,150px)',
          background: 'rgba(233,74,53,.16)',
          WebkitMask: 'url(/assets/doodle-5.png) center/contain no-repeat',
          mask: 'url(/assets/doodle-5.png) center/contain no-repeat',
          animation: 'ep-float 7s ease-in-out infinite',
        }}
      />
      <Doodle n={2} color="rgba(0,0,0,.05)" size={96} left="3%" top="30%" anim="sway" duration={11} rotate="-10deg" />
      <Doodle n={4} color="rgba(0,0,0,.045)" size={64} left="46%" bottom="14%" anim="float2" duration={8} rotate="6deg" />

      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
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

      {/* auto-scrolling photo reference strip (client-fillable) */}
      <Reveal
        delay={160}
        style={{
          marginTop: 'clamp(44px,6vw,72px)',
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
            gap: 16,
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
