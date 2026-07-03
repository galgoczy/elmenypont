import { useRef, type CSSProperties } from 'react'

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
              animation: `ep-spin ${16 + i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            }}
          />
        </span>
      ))}
    </div>
  )
}

/**
 * Doodle marquee: coloured slogans with slowly spinning doodles between
 * them, on a slightly tilted dark band. Pauses on hover so the words are
 * actually readable when someone leans in.
 */
export function Marquee() {
  const track = useRef<HTMLDivElement | null>(null)

  return (
    // sticker-style band laid across the section seam; the inner strip is
    // tilted and slightly oversized so no gap shows at the rotated corners.
    // Top margin stays positive and viewport-scaled: the rotation makes the
    // band's corners stick out ~1vw above its box, which on wide screens
    // would otherwise slide over the hero's stat chips.
    <div style={{ position: 'relative', zIndex: 5, marginTop: 'clamp(18px, 2vw, 44px)', marginBottom: -28 }}>
      <div
        style={{
          position: 'relative',
          width: '104%',
          marginLeft: '-2%',
          background: '#17150D',
          color: '#F6F1E9',
          padding: '22px 0',
          overflow: 'hidden',
          transform: 'rotate(-1.1deg)',
          boxShadow: '0 18px 44px -22px rgba(0,0,0,.45)',
        }}
        onMouseEnter={() => {
          if (track.current) track.current.style.animationPlayState = 'paused'
        }}
        onMouseLeave={() => {
          if (track.current) track.current.style.animationPlayState = 'running'
        }}
      >
        <div
          ref={track}
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
    </div>
  )
}
