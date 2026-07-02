import type { CSSProperties } from 'react'

const WORDS = [
  { text: 'VILLÁMGYORS AI-KÉP', color: '#E94A35', doodle: 3, size: 40 },
  { text: 'KULCSRAKÉSZEN', color: '#4888F8', doodle: 2, size: 44 },
  { text: 'MEGOSZTHATÓ PILLANAT', color: '#9868F8', doodle: 1, size: 40 },
  { text: 'RENDEZVÉNYRE SZABVA', color: '#48D880', doodle: 6, size: 42 },
]

const wordStyle = (color: string): CSSProperties => ({
  fontFamily: 'Syne',
  fontWeight: 700,
  fontSize: 30,
  letterSpacing: '-.01em',
  color,
})

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 54, alignItems: 'center' }} aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span style={wordStyle(w.color)}>{w.text}</span>
          <span
            style={{
              width: w.size,
              height: w.size,
              background: 'rgba(246,241,233,.5)',
              WebkitMask: `url(/assets/doodle-${w.doodle}.png) center/contain no-repeat`,
              mask: `url(/assets/doodle-${w.doodle}.png) center/contain no-repeat`,
            }}
          />
        </span>
      ))}
    </div>
  )
}

/** Doodle marquee: coloured slogans with neutral grey doodles between them. */
export function Marquee() {
  return (
    <div
      style={{
        position: 'relative',
        background: '#17150D',
        color: '#F6F1E9',
        padding: '22px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          gap: 54,
          alignItems: 'center',
          animation: 'ep-marquee 26s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        <Row />
        <Row hidden />
      </div>
    </div>
  )
}
