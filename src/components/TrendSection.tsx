import { Reveal } from './Reveal'
import type { RocketVals } from '../hooks/useScene'

interface TrendProps {
  rocket: RocketVals
}

const TRAIL = 'M12 8 C 12 24, 86 24, 86 42 C 86 60, 12 60, 12 76 C 12 90, 40 92, 62 98'

const STEPS = [
  {
    n: '01',
    color: '#48D880',
    title: 'A vendég mindig új élményt vár',
    body: 'Olyat akarnak, amit otthon nem tudnak könnyen megcsinálni, és leesik helyben az álluk.',
    style: { maxWidth: '34ch', marginRight: 'auto' } as const,
    align: 'left' as const,
    delay: 0,
  },
  {
    n: '02',
    color: '#4888F8',
    title: 'A megosztható pillanat a marketing',
    body:
      'Minden brandingelt kép a te arculatoddal kerül majd fel a közösségi médiába — organikus elérés, AI szuperboost-tal.',
    style: { maxWidth: '36ch', marginLeft: 'auto', textAlign: 'right' } as const,
    align: 'right' as const,
    delay: 80,
  },
  {
    n: '03',
    color: '#F2937F',
    title: 'Mindenki a saját élményét viszi haza',
    body: 'Személyre szabott, egyedi AI-alkotás — emlék, amit tényleg hazavisznek és megőriznek.',
    style: { maxWidth: '34ch', marginLeft: '12%' } as const,
    align: 'left' as const,
    delay: 160,
  },
]

/**
 * "Miért most" — dark editorial section. A rocket flies along the serpentine
 * dotted trail (driven by useScene), revealing the green progress line behind
 * it via a growing SVG mask, past the staggered 01/02/03 steps.
 */
export function TrendSection({ rocket }: TrendProps) {
  return (
    <section
      data-trend
      style={{
        position: 'relative',
        background: '#17150D',
        color: '#F6F1E9',
        padding: 'clamp(90px,13vw,170px) clamp(24px,6vw,90px) clamp(110px,15vw,200px)',
        overflow: 'hidden',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '6vw',
          top: '16%',
          width: 'clamp(70px,8vw,110px)',
          height: 'clamp(70px,8vw,110px)',
          background: 'rgba(246,241,233,.07)',
          WebkitMask: 'url(/assets/doodle-2.png) center/contain no-repeat',
          mask: 'url(/assets/doodle-2.png) center/contain no-repeat',
          animation: 'ep-float 7s ease-in-out infinite',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
        <Reveal
          as="span"
          style={{
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#48D880',
            marginBottom: 30,
          }}
        >
          Miért most
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          style={{
            fontFamily: 'Syne',
            fontWeight: 500,
            fontSize: 'clamp(34px,5.6vw,82px)',
            lineHeight: 1,
            letterSpacing: '-.035em',
            maxWidth: '16ch',
          }}
        >
          A rendezvényipar <span style={{ color: '#48D880' }}>legnagyobb trendje</span> 2026-ban az
          AI&nbsp;élmény.
        </Reveal>

        {/* staggered steps with scroll-flying rocket on a dashed trail */}
        <div data-trendwrap style={{ position: 'relative', marginTop: 'clamp(60px,9vw,120px)' }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <mask id="ep-trail-mask" maskUnits="userSpaceOnUse">
                <path
                  d={TRAIL}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="7"
                  strokeLinecap="round"
                  pathLength={1000}
                  strokeDasharray={1000}
                  strokeDashoffset={rocket.dash}
                />
              </mask>
            </defs>
            <path
              d={TRAIL}
              fill="none"
              stroke="rgba(246,241,233,.1)"
              strokeWidth="0.5"
              strokeDasharray="1.3 3.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              data-trailpath
              d={TRAIL}
              fill="none"
              stroke="#48D880"
              strokeWidth="1"
              strokeDasharray="1.3 3.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              mask="url(#ep-trail-mask)"
            />
          </svg>

          {/* flying rocket */}
          <span
            data-rocket
            style={{
              position: 'absolute',
              left: `${rocket.left}%`,
              top: `${rocket.top}%`,
              width: 52,
              height: 52,
              margin: '-26px 0 0 -26px',
              zIndex: 2,
              transition: 'left .18s ease-out, top .18s ease-out',
              transform: `rotate(${rocket.rot}deg)`,
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                animation: 'ep-rocket-idle 2.6s ease-in-out infinite',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'block',
                  background: '#48D880',
                  WebkitMask: 'url(/assets/doodle-1.png) center/contain no-repeat',
                  mask: 'url(/assets/doodle-1.png) center/contain no-repeat',
                  filter: 'drop-shadow(0 4px 12px rgba(72,216,128,.55))',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: -14,
                  width: 10,
                  height: 20,
                  marginLeft: -5,
                  borderRadius: '50% 50% 60% 60%',
                  background: 'linear-gradient(#F2937F,#E94A35)',
                  filter: 'blur(2px)',
                  transformOrigin: 'top center',
                  animation: 'ep-flame .35s ease-in-out infinite',
                  opacity: rocket.flame,
                }}
              />
            </span>
          </span>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(48px,7vw,96px)',
            }}
          >
            {STEPS.map((s) => (
              <Reveal key={s.n} delay={s.delay} style={s.style}>
                <div
                  style={{
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    fontSize: 'clamp(56px,7.5vw,104px)',
                    lineHeight: 0.82,
                    letterSpacing: '-.04em',
                    color: s.color,
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    fontSize: 'clamp(22px,2.2vw,28px)',
                    letterSpacing: '-.01em',
                    marginTop: 16,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'rgba(246,241,233,.62)',
                    marginTop: 12,
                  }}
                >
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
