import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { ImageSlot } from './ImageSlot'
import { TiltCard } from './TiltCard'
import { useT } from '../i18n'

const CARDS = [
  {
    href: '/greenbox',
    src: '/assets/photos/greenbox-before-after.jpg',
    alt: 'Greenbox háttércsere: csapat a zöld háttér előtt és ugyanők a tengerparton',
    altEn: 'Greenbox background swap: a team in front of the green screen and the same team on the beach',
    title: 'Greenbox Selfiemata',
    body: 'Bármilyen háttér zöld vászon előtt: egzotikus helyszín vagy a céges arculat.',
    bodyEn: 'Any backdrop in front of the green screen: an exotic venue or your company branding.',
    link: 'Greenbox fotózás bérlés →',
    linkEn: 'Greenbox photo rental →',
    delay: 0,
  },
  {
    href: '/selfiebox',
    src: '/assets/photos/team-original.jpg',
    alt: 'Klasszikus fotóboxban készült csoportkép egy rendezvényen',
    altEn: 'Group photo taken in a classic photo booth at an event',
    title: 'Selfiebox',
    body: 'Klasszikus fotóbox azonnali nyomtatással — egyszerű és mindig működik.',
    bodyEn: 'A classic photo booth with instant printing — simple, and it always works.',
    link: 'Fotóbox bérlés →',
    linkEn: 'Photo booth rental →',
    delay: 120,
  },
]

export function MoreSelfiematak() {
  const t = useT()
  return (
    <section
      id="selfiebox"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: '0 clamp(24px,6vw,90px) clamp(40px,5vw,70px)',
        // linked from the nav's services dropdown — land below the fixed nav
        scrollMarginTop: '96px',
      }}
    >
      <Doodle n={1} color="rgba(0,0,0,.05)" size={88} left="1%" top="30%" anim="sway" duration={12} rotate="-7deg" />
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, letterSpacing: '.02em' }}>
            {t('További Selfiematák', 'More Selfiematák')}
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
            <Reveal key={c.title} pop delay={c.delay}>
              <TiltCard tilt={5} lift={7} radius={22} hoverShadow="0 34px 56px -28px rgba(0,0,0,.4)" style={{ height: '100%' }}>
                <a
                  href={c.href}
                  style={{
                    background: '#F6F1E9',
                    border: '1px solid rgba(0,0,0,.08)',
                    borderRadius: 22,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <ImageSlot shape="rect" fit="cover" src={c.src} alt={t(c.alt, c.altEn)} style={{ width: '100%', height: 230, display: 'block' }} />
                  <div style={{ padding: 28 }}>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 25, letterSpacing: '-.01em' }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.5, color: '#46433A', marginTop: 12 }}>{t(c.body, c.bodyEn)}</p>
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
                      {t(c.link, c.linkEn)}
                    </span>
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
