import type { CSSProperties } from 'react'
import { Reveal } from './Reveal'

const NAMES = ['PARTNER', 'LOGÓ', 'MÁRKA', 'ÜGYFÉL', 'REFERENCIA', 'ESEMÉNY']

const name: CSSProperties = { fontFamily: 'Syne', fontWeight: 700, fontSize: 30, color: '#17150D' }

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 64, alignItems: 'center' }} aria-hidden={hidden || undefined}>
      {NAMES.map((n, i) => (
        <span key={i} style={name}>
          {n}
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
          marginBottom: 42,
        }}
      >
        Több száz rendezvényen — ők is velünk dolgoztak
      </Reveal>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          gap: 64,
          alignItems: 'center',
          animation: 'ep-marquee 32s linear infinite',
          opacity: 0.55,
        }}
      >
        <Row />
        <Row hidden />
      </div>
      <Reveal as="p" style={{ textAlign: 'center', fontSize: 13, color: '#C9C3B6', marginTop: 34 }}>
        Ide kerülnek a valódi ügyfél- és partnerlogók.
      </Reveal>
    </section>
  )
}
