import { Reveal } from './Reveal'

/**
 * Real partner marks (monochrome SVGs under /assets/logos), tinted to the
 * warm ink via CSS masks so they sit quietly in the brand palette.
 * Coca-Cola and GE are wide wordmarks, the rest are compact — width hints
 * keep their optical sizes balanced in the strip.
 */
const LOGOS = [
  { slug: 'bosch', name: 'Bosch', w: 110 },
  { slug: 'coca-cola', name: 'Coca-Cola', w: 120 },
  { slug: 'siemens', name: 'Siemens', w: 120 },
  { slug: 'ge', name: 'General Electric', w: 54 },
  { slug: 'hbo', name: 'HBO', w: 92 },
  { slug: 'hilton', name: 'Hilton', w: 60 },
]

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 76, alignItems: 'center' }} aria-hidden={hidden || undefined}>
      {LOGOS.map((l) => (
        <span
          key={l.slug}
          role={hidden ? undefined : 'img'}
          aria-label={hidden ? undefined : l.name}
          style={{
            width: l.w,
            height: 44,
            flex: 'none',
            background: '#17150D',
            WebkitMask: `url(/assets/logos/${l.slug}.svg) center/contain no-repeat`,
            mask: `url(/assets/logos/${l.slug}.svg) center/contain no-repeat`,
          }}
        />
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
          gap: 76,
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
