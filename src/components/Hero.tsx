import type { CSSProperties, ReactNode } from 'react'
import { cl } from '../hooks/useScene'
import { Magnetic } from './Magnetic'

interface HeroProps {
  heroP: number
}

const STAT_CHIPS = [
  { value: '9–15 mp', label: 'AI generálás', color: '#4888F8' },
  { value: '∞ stílus', label: 'választható téma', color: '#9868F8' },
  { value: '100%', label: 'rendezvényre szabva', color: '#E94A35' },
]

/** One headline unit rising out of its own mask, scrubbed by the reveal progress. */
function RiseWord({ p, i, children }: { p: number; i: number; children: ReactNode }) {
  const w = cl(p, i * 0.09, i * 0.09 + 0.55)
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        padding: '0.08em 0.05em 0.12em',
        margin: '-0.08em -0.05em -0.12em',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${((1 - w) * 108).toFixed(1)}%) rotate(${((1 - w) * 4).toFixed(2)}deg)`,
          transformOrigin: 'left bottom',
        }}
      >
        {children}
      </span>
    </span>
  )
}

/**
 * Sticky scroll-choreographed hero, ported from the prototype:
 *   kiosk turns from its back to face -> camera flash -> the dark stage
 *   dissolves to cream while the "AI Selfiemata" headline + stat chips fade in.
 */
export function Hero({ heroP: p }: HeroProps) {
  const turn = cl(p, 0.02, 0.42)
  const flash = cl(p, 0.44, 0.54) * (1 - cl(p, 0.54, 0.66))
  const reveal = cl(p, 0.56, 0.9)
  const mix = reveal

  // dark -> cream background blend
  const dark = [23, 21, 13]
  const cream = [246, 241, 233]
  const bg = dark.map((d, i) => Math.round(d + (cream[i] - d) * mix))
  const heroBg = `rgb(${bg[0]},${bg[1]},${bg[2]})`

  const heroGlow = (0.5 * (1 - mix) * (0.4 + 0.6 * turn)).toFixed(3)
  const kioskRot = (180 - 180 * turn).toFixed(1)
  const kioskScale = (0.9 + 0.12 * turn - 0.5 * reveal).toFixed(3)
  const kioskLift = (reveal * -160).toFixed(0)
  const screenOn = (turn * (1 - 0.4 * reveal)).toFixed(2)
  const screenTextOp = cl(turn, 0.6, 1).toFixed(2)
  const copyOp = reveal.toFixed(2)
  const copyY = ((1 - reveal) * 40).toFixed(0)
  const copyPe: CSSProperties['pointerEvents'] = reveal > 0.6 ? 'auto' : 'none'
  const hintOp = (1 - cl(p, 0, 0.12)).toFixed(2)
  const hintColor = mix > 0.5 ? '#7A766B' : 'rgba(255,255,255,.7)'

  const chip: CSSProperties = {
    background: '#F6F1E9',
    border: '1px solid rgba(0,0,0,.07)',
    borderRadius: 16,
    padding: '13px 22px',
    textAlign: 'left',
  }

  return (
    <section id="top" data-hero style={{ position: 'relative', height: '165vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: heroBg,
        }}
      >
        {/* ambient glow — drifts with the cursor */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(120% 80% at calc(50% + var(--mxs, 0) * 12%) calc(38% + var(--mys, 0) * 10%), rgba(233,74,53,${heroGlow}) 0%, rgba(233,74,53,0) 55%)`,
            pointerEvents: 'none',
          }}
        />

        {/* 3D kiosk stage */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1400px',
          }}
        >
          <div
            style={{
              transform: `translateY(${kioskLift}px) rotateX(calc(8deg + var(--mys, 0) * 6deg)) rotateY(calc(${kioskRot}deg + var(--mxs, 0) * -12deg)) scale(${kioskScale})`,
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 40px 60px rgba(0,0,0,.5))',
            }}
          >
            {/* screen box */}
            <div
              style={{
                position: 'relative',
                width: 300,
                height: 230,
                background: 'linear-gradient(180deg,#fbfbfb,#e9e9e6)',
                borderRadius: 12,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 16,
                  borderRadius: 7,
                  background: '#0a0a0a',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg,#4888F8,#9868F8 55%,#4888F8)',
                    opacity: screenOn,
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    color: '#fff',
                    fontFamily: 'Syne',
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: '.06em',
                    opacity: screenTextOp,
                  }}
                >
                  AI
                </span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#111',
                  border: '2px solid #d8d8d4',
                }}
              />
              {/* side face for depth */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: 34,
                  height: 230,
                  background: '#cfcfca',
                  transform: 'rotateY(90deg) translateZ(2px)',
                  transformOrigin: 'right',
                  borderRadius: '0 12px 12px 0',
                }}
              />
            </div>
            {/* stand */}
            <div
              style={{
                width: 46,
                height: 150,
                background: 'linear-gradient(180deg,#1c1c1c,#070707)',
                margin: '0 auto',
                borderRadius: 4,
              }}
            />
            <div
              style={{
                width: 200,
                height: 18,
                background: '#080808',
                margin: '-2px auto 0',
                borderRadius: 6,
                transform: 'rotateX(60deg)',
                boxShadow: '0 30px 40px rgba(0,0,0,.6)',
              }}
            />
          </div>
        </div>

        {/* camera flash */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            opacity: flash.toFixed(2),
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />

        {/* hero copy */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            opacity: copyOp,
            transform: `translateY(${copyY}px)`,
            pointerEvents: copyPe,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: 'Syne',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'linear-gradient(135deg,#4888F8,#9868F8 55%,#4888F8)',
              backgroundSize: '200% 200%',
              animation: 'ep-grad 6s ease infinite',
              padding: '9px 18px',
              borderRadius: 100,
              marginBottom: 30,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
            #1 rendezvény trend · 2026
          </span>
          <h1
            style={{
              fontFamily: 'Syne',
              fontWeight: 500,
              fontSize: 'clamp(46px,8.2vw,116px)',
              lineHeight: 0.96,
              letterSpacing: '-.035em',
              maxWidth: '13ch',
              color: '#17150D',
            }}
          >
            <RiseWord p={reveal} i={0}>
              A
            </RiseWord>{' '}
            <RiseWord p={reveal} i={1}>
              fotóautomata
            </RiseWord>{' '}
            <RiseWord p={reveal} i={2}>
              <span style={{ fontWeight: 600, color: '#E94A35' }}>újragondolva</span>
            </RiseWord>{' '}
            <RiseWord p={reveal} i={3}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#17150D',
                  color: '#F6F1E9',
                  padding: '.02em .22em .1em',
                  borderRadius: '.14em',
                  transform: 'rotate(-1.6deg)',
                }}
              >
                AI&nbsp;Selfiemata.
              </span>
            </RiseWord>
          </h1>
          <p
            style={{
              fontSize: 'clamp(17px,2vw,21px)',
              lineHeight: 1.55,
              color: '#46433A',
              maxWidth: '48ch',
              marginTop: 28,
            }}
          >
            Valós idejű AI-képgenerálás a rendezvényeden. A vendég fotóját az AI pár másodperc alatt
            egyedi, megosztható, brandingelt alkotássá varázsolja.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 38,
            }}
          >
            <Magnetic strength={8}>
              <a
                href="#kapcsolat"
                style={{
                  background: '#17150D',
                  color: '#F6F1E9',
                  fontWeight: 600,
                  fontSize: 17,
                  padding: '17px 30px',
                  borderRadius: 100,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  transition: 'box-shadow .3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 16px 34px -14px rgba(23,21,13,.55)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                Kérek bemutatót →
              </a>
            </Magnetic>
            <Magnetic strength={6}>
              <a
                href="#szolgaltatasok"
                style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: '#17150D',
                  fontWeight: 600,
                  fontSize: 17,
                  padding: '17px 30px',
                  borderRadius: 100,
                  border: '1.5px solid rgba(0,0,0,.18)',
                  transition: 'background .25s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Szolgáltatások
              </a>
            </Magnetic>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 34,
            }}
          >
            {STAT_CHIPS.map((c, i) => {
              const cp = cl(reveal, 0.25 + i * 0.12, 0.7 + i * 0.12)
              return (
                <div
                  key={c.label}
                  style={{
                    ...chip,
                    opacity: cp.toFixed(2),
                    transform: `translateY(${((1 - cp) * 26).toFixed(1)}px) scale(${(0.94 + cp * 0.06).toFixed(3)})`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Syne',
                      fontWeight: 600,
                      fontSize: 22,
                      letterSpacing: '-.01em',
                      color: c.color,
                    }}
                  >
                    {c.value}
                  </div>
                  <div style={{ fontSize: 13, color: '#7A766B', marginTop: 2 }}>{c.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 34,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: hintOp,
            color: hintColor,
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            Görgess
          </span>
          <span
            style={{
              width: 1,
              height: 38,
              background: 'currentColor',
              animation: 'ep-bob 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
