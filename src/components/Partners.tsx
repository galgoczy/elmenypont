import { Reveal } from './Reveal'

/**
 * Real partner marks (monochrome SVGs under /assets/logos), tinted to the
 * warm ink via CSS masks so they sit quietly in the brand palette.
 * The SVG viewBoxes are cropped to the glyph bounds (the source icons sit
 * on square canvases, which made every wordmark render as a thin band in a
 * square), so each w×h below IS the rendered mark: round emblems at ~44px,
 * wordmark heights matched to their optical weight — and the order
 * alternates emblem/wordmark so the two circular "H" marks (Bosch, Hilton)
 * never sit side by side, not even across the loop seam.
 */
const LOGOS = [
  { slug: 'bosch', name: 'Bosch', w: 44, h: 44 },
  { slug: 'coca-cola', name: 'Coca-Cola', w: 135, h: 44 },
  { slug: 'ge', name: 'General Electric', w: 44, h: 44 },
  { slug: 'siemens', name: 'Siemens', w: 145, h: 26 },
  { slug: 'hilton', name: 'Hilton', w: 63, h: 44 },
  { slug: 'hbo', name: 'HBO', w: 81, h: 34 },
]

/** Item spacing lives INSIDE the row (padding-right on each item): a gap on
 *  the track container would offset the -50% loop point and make the
 *  marquee visibly jump every cycle. */
function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} aria-hidden={hidden || undefined}>
      {LOGOS.map((l) => (
        <span key={l.slug} style={{ flex: 'none', paddingRight: 64 }}>
          <span
            role={hidden ? undefined : 'img'}
            aria-label={hidden ? undefined : l.name}
            style={{
              display: 'block',
              width: l.w,
              height: l.h,
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
