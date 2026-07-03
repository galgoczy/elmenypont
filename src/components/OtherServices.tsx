import { Reveal } from './Reveal'
import { Doodle } from './Doodle'

const ROWS = [
  {
    href: 'https://smart-wall.hu',
    doodle: 4,
    color: '#4888F8',
    title: 'Smart Wall',
    body: 'Interaktív, érinthető vetített fal: termékbemutató, infografika, játék.',
    delay: 0,
  },
  {
    href: 'https://mosaicwall.hu',
    doodle: 5,
    color: '#48D880',
    title: 'Mosaic Wall',
    body: 'A vendégek fotóiból közösen összeálló, nagy közös mozaikkép.',
    delay: 80,
  },
]

export function OtherServices() {
  return (
    <section
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: '0 clamp(24px,6vw,90px) clamp(80px,10vw,130px)',
      }}
    >
      <Doodle n={3} color="rgba(0,0,0,.045)" size={70} right="3%" bottom="12%" anim="float2" duration={8.5} rotate="5deg" />
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <span
            style={{
              fontFamily: 'Syne',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '.02em',
              color: '#7A766B',
            }}
          >
            Egyéb szolgáltatások
          </span>
          <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.1)' }} />
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 16,
          }}
        >
          {ROWS.map((r) => (
            <Reveal
              key={r.title}
              as="a"
              delay={r.delay}
              href={r.href}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,0,0,.12)',
                borderRadius: 18,
                padding: '26px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                transition: 'background .35s, border-color .35s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F6F1E9'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,.18)'
                const ic = e.currentTarget.querySelector<HTMLElement>('[data-icon]')
                if (ic) ic.style.transform = 'rotate(-10deg) scale(1.14)'
                const ar = e.currentTarget.querySelector<HTMLElement>('[data-arrow]')
                if (ar) {
                  ar.style.transform = 'translateX(6px)'
                  ar.style.color = '#17150D'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,.12)'
                const ic = e.currentTarget.querySelector<HTMLElement>('[data-icon]')
                if (ic) ic.style.transform = 'none'
                const ar = e.currentTarget.querySelector<HTMLElement>('[data-arrow]')
                if (ar) {
                  ar.style.transform = 'none'
                  ar.style.color = '#7A766B'
                }
              }}
            >
              <span
                data-icon
                style={{
                  flex: 'none',
                  width: 46,
                  height: 46,
                  background: r.color,
                  WebkitMask: `url(/assets/doodle-${r.doodle}.png) center/contain no-repeat`,
                  mask: `url(/assets/doodle-${r.doodle}.png) center/contain no-repeat`,
                  transition: 'transform .45s cubic-bezier(.2,.8,.2,1.3)',
                }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20 }}>{r.title}</h4>
                <p style={{ fontSize: 15, color: '#46433A', marginTop: 4 }}>{r.body}</p>
              </div>
              <span data-arrow style={{ color: '#7A766B', fontSize: 20, transition: 'transform .35s, color .35s' }}>→</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
