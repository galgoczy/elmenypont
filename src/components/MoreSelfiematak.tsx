import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { ImageSlot } from './ImageSlot'

const CARDS = [
  {
    href: 'https://greenbox.elmeny.hu',
    slot: 'Greenbox háttércsere minta',
    title: 'Greenbox Selfiemata',
    body: 'Bármilyen háttér zöld vászon előtt: egzotikus helyszín vagy a céges arculat.',
    link: 'greenbox.elmeny.hu →',
    delay: 0,
  },
  {
    href: 'https://greenbox.elmeny.hu',
    slot: 'Selfiebox fotósarok minta',
    title: 'Selfiebox',
    body: 'Klasszikus fotósarok azonnali nyomtatással — egyszerű és mindig működik.',
    link: 'greenbox.elmeny.hu →',
    delay: 120,
  },
]

export function MoreSelfiematak() {
  return (
    <section
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: '0 clamp(24px,6vw,90px) clamp(40px,5vw,70px)',
      }}
    >
      <Doodle n={1} color="rgba(0,0,0,.05)" size={88} left="1%" top="30%" anim="sway" duration={12} rotate="-7deg" />
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, letterSpacing: '.02em' }}>
            További Selfiematák
          </span>
          <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.1)' }} />
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 22,
          }}
        >
          {CARDS.map((c) => (
            <Reveal
              key={c.title}
              as="a"
              pop
              delay={c.delay}
              href={c.href}
              style={{
                background: '#F6F1E9',
                border: '1px solid rgba(0,0,0,.08)',
                borderRadius: 22,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 30px 50px -28px rgba(0,0,0,.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <ImageSlot shape="rect" fit="cover" placeholder={c.slot} style={{ width: '100%', height: 230, display: 'block' }} />
              <div style={{ padding: 28 }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 25, letterSpacing: '-.01em' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.5, color: '#46433A', marginTop: 12 }}>{c.body}</p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 18,
                    fontWeight: 600,
                    color: '#E94A35',
                  }}
                >
                  {c.link}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
