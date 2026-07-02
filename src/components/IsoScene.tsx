import { useState, type CSSProperties } from 'react'
import { Reveal } from './Reveal'

const HOTSPOTS = [
  { href: 'https://ai.elmeny.hu', left: '31%', top: '34%', color: '#4888F8', label: 'AI Selfiemata', delay: '0s' },
  { href: 'https://greenbox.elmeny.hu', left: '60%', top: '40%', color: '#48D880', label: 'Greenbox', delay: '.5s' },
  { href: 'https://smart-wall.hu', left: '45%', top: '62%', color: '#E94A35', label: 'Smart Wall', delay: '1s' },
]

const figure = (bg: string, dur: string, delay = '0s'): CSSProperties => ({
  position: 'absolute',
  width: 14,
  height: 30,
  background: bg,
  borderRadius: 7,
  transform: 'translateZ(30px) rotateZ(45deg) rotateX(-58deg)',
  animation: `ep-bob ${dur} ease-in-out infinite ${delay}`,
})

/** Isometric diorama that tilts toward the cursor, with clickable hotspots. */
export function IsoScene() {
  const [iso, setIso] = useState({ x: 0, y: 0 })
  const isoRX = (6 - iso.y * 12).toFixed(2)
  const isoRZ = (iso.x * 14).toFixed(2)

  return (
    <section
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: '0 clamp(16px,4vw,56px) clamp(80px,10vw,130px)',
      }}
    >
      <Reveal
        style={{
          position: 'relative',
          maxWidth: 1280,
          margin: '0 auto',
          borderRadius: 34,
          overflow: 'hidden',
          background: 'radial-gradient(120% 120% at 50% 0%, #211d14 0%, #100e09 70%)',
          color: '#F6F1E9',
          padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,70px) clamp(20px,4vw,40px)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '22ch', margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#F2937F',
              marginBottom: 18,
            }}
          >
            Élő, forgatható tér
          </span>
          <h2
            style={{
              fontFamily: 'Syne',
              fontWeight: 500,
              fontSize: 'clamp(28px,4vw,58px)',
              lineHeight: 1,
              letterSpacing: '-.03em',
            }}
          >
            Minden rendezvényre{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#4888F8,#9868F8 55%,#4888F8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              (AI)
            </span>{' '}
            élményt adunk.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', marginTop: 16 }}>
            Forgasd körbe a teret, és nézd meg, mi történik egy Élménypont-rendezvényen. Kattints egy
            állomásra.
          </p>
        </div>

        {/* iso diorama */}
        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setIso({
              x: (e.clientX - r.left) / r.width - 0.5,
              y: (e.clientY - r.top) / r.height - 0.5,
            })
          }}
          onMouseLeave={() => setIso({ x: 0, y: 0 })}
          style={{
            position: 'relative',
            height: 'clamp(380px,46vw,560px)',
            marginTop: 10,
            perspective: '1500px',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
              transition: 'transform .3s ease-out',
              transform: `rotateX(${isoRX}deg) rotateZ(${isoRZ}deg)`,
            }}
          >
            {/* floor */}
            <div
              style={{
                position: 'relative',
                width: 440,
                height: 440,
                transform: 'rotateX(58deg) rotateZ(-45deg)',
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg,#2b2619,#1a160e)',
                borderRadius: 18,
                boxShadow: '0 60px 80px rgba(0,0,0,.5)',
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',
                backgroundSize: '55px 55px',
              }}
            >
              {/* prop: AI Selfiemata */}
              <div
                style={{
                  position: 'absolute',
                  left: 70,
                  top: 90,
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg,#4888F8,#9868F8)',
                  borderRadius: 8,
                  transform: 'translateZ(70px) rotateZ(45deg) rotateX(-58deg)',
                  boxShadow: '0 20px 30px rgba(0,0,0,.4)',
                }}
              />
              {/* prop: Greenbox */}
              <div
                style={{
                  position: 'absolute',
                  left: 250,
                  top: 120,
                  width: 58,
                  height: 58,
                  background: '#48D880',
                  borderRadius: 8,
                  transform: 'translateZ(56px) rotateZ(45deg) rotateX(-58deg)',
                  boxShadow: '0 20px 30px rgba(0,0,0,.4)',
                }}
              />
              {/* prop: Smart Wall */}
              <div
                style={{
                  position: 'absolute',
                  left: 150,
                  top: 250,
                  width: 90,
                  height: 18,
                  background: '#E94A35',
                  borderRadius: 5,
                  transform: 'translateZ(64px) rotateZ(45deg) rotateX(-58deg)',
                  boxShadow: '0 20px 30px rgba(0,0,0,.4)',
                }}
              />
              {/* tiny figures */}
              <div style={{ ...figure('#FFD2C6', '1.4s'), left: 160, top: 160 }} />
              <div style={{ ...figure('#C9DCFF', '1.7s', '.3s'), left: 200, top: 200 }} />
              <div style={{ ...figure('#D6FFE9', '1.55s', '.15s'), left: 120, top: 210 }} />
            </div>

            {/* hotspots (screen-space) */}
            {HOTSPOTS.map((h) => (
              <a
                key={h.label}
                href={h.href}
                style={{
                  position: 'absolute',
                  left: h.left,
                  top: h.top,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const l = e.currentTarget.querySelector<HTMLElement>('span:last-child')
                  if (l) {
                    l.style.transform = 'scale(1.08)'
                    l.style.transition = 'transform .2s'
                  }
                }}
                onMouseLeave={(e) => {
                  const l = e.currentTarget.querySelector<HTMLElement>('span:last-child')
                  if (l) l.style.transform = 'none'
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: h.color,
                    boxShadow: `0 0 0 6px ${h.color}40`,
                    animation: `ep-pulse 2s ease-in-out infinite ${h.delay}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,.95)',
                    color: '#17150D',
                    padding: '5px 11px',
                    borderRadius: 100,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h.label}
                </span>
              </a>
            ))}
          </div>
          <span
            style={{
              position: 'absolute',
              bottom: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: 'rgba(255,255,255,.4)',
              letterSpacing: '.04em',
            }}
          >
            Élő 3D tér · hamarosan forgathatóan
          </span>
        </div>
      </Reveal>
    </section>
  )
}
