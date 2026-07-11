import { Reveal } from './Reveal'

/**
 * Real partner marks (monochrome SVGs under /assets/logos), tinted to the
 * warm ink via CSS masks so they sit quietly in the brand palette.
 * Coca-Cola and GE are wide wordmarks, the rest are compact — width hints
 * keep their optical sizes balanced in the strip.
 */
const LOGOS = [
  { slug: 'bosch', name: 'Bosch', w: 155 },
  { slug: 'coca-cola', name: 'Coca-Cola', w: 220 },
  { slug: 'siemens', name: 'Siemens', w: 220 },
  { slug: 'ge', name: 'General Electric', w: 76 },
  { slug: 'hbo', name: 'HBO', w: 170 },
  { slug: 'hilton', name: 'Hilton', w: 84 },
]

/** Item spacing lives INSIDE the row (padding-right on each item): a gap on
 *  the track container would offset the -50% loop point and make the
 *  marquee visibly jump every cycle. */
function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} aria-hidden={hidden || undefined}>
      {LOGOS.map((l) => (
        <span key={l.slug} style={{ flex: 'none', paddingRight: 56 }}>
          <span
            role={hidden ? undefined : 'img'}
            aria-label={hidden ? undefined : l.name}
            style={{
              display: 'block',
              width: l.w,
              height: 62,
              background: '#17150D',
              WebkitMask: `url(/assets/logos/${l.slug}.svg) center/contain no-repeat`,
              mask: `url(/assets/logos/${l.slug}.svg) center/contain no-repeat`,
            }}
          />
        </span>
      ))}
    </div>
  )
}

export function Partners() {
  return (
    <section style={{ position: 'relative', background: '#F6F1E9', padding: 'clamp(60px,8vw,100px) 0', overflow: 'hidden' }}>
      <Reveal
        as="p"
        style={{
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: '#7A766B',
          marginBottom: 46,
        }}
      >
        Több száz rendezvényen — ők is velünk dolgoztak
      </Reveal>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          alignItems: 'center',
          animation: 'ep-marquee 32s linear infinite',
          opacity: 0.5,
        }}
      >
        <Row />
        <Row hidden />
      </div>
    </section>
  )
}
