import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { Words } from './Words'
import { Squiggle } from './Squiggle'
import { useT } from '../i18n'

const POINTS = [
  { n: '01', title: 'Kulcsrakész', titleEn: 'Turnkey', body: 'A teljes technika, alapanyag és profi személyzet felkészült az eseményedre!', bodyEn: 'The full tech setup, materials and pro crew — all ready for your event!', delay: 0 },
  { n: '02', title: 'Gyors', titleEn: 'Fast', body: 'AI-kép 10–15 mp alatt; helyben nyomtatás vagy e-mail küldés.', bodyEn: 'AI photo in 10–15 sec; printed on the spot or sent by e-mail.', delay: 60 },
  { n: '03', title: 'Brandingelhető', titleEn: 'Brandable', body: 'Minden a rendezvény arculatára szabható.', bodyEn: 'Everything tailored to your event branding.', delay: 120 },
  { n: '04', title: 'Korlátlan', titleEn: 'Unlimited', body: 'A program alatt akár korlátlan kép/nyomat opció.', bodyEn: 'Unlimited photo/print option throughout the program.', delay: 180 },
  { n: '05', title: 'Utólag is', titleEn: 'Afterwards too', body: 'A teljes képanyag megosztható — a te döntésed szerint.', bodyEn: 'The whole gallery is shareable — your call.', delay: 240 },
]

export function WhyUs() {
  const t = useT()
  return (
    <section
      id="rolunk"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#EBE4D7',
        padding: 'clamp(80px,11vw,150px) clamp(24px,6vw,90px)',
      }}
    >
      <Doodle n={6} color="rgba(0,0,0,.05)" size={92} right="4%" top="12%" anim="sway" duration={10} rotate="8deg" />
      <Doodle n={3} color="rgba(0,0,0,.04)" size={60} left="2%" bottom="8%" anim="float" duration={9.5} rotate="-6deg" />
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
            gap: 'clamp(34px,5vw,70px)',
            alignItems: 'start',
          }}
        >
          <Reveal className="ep-whyus-head">
            <span
              style={{
                display: 'inline-block',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: '#48D880',
                marginBottom: 22,
              }}
            >
              {t('Miért mi', 'Why us')}
            </span>
            <Words
              as="h2"
              stagger={90}
              style={{
                fontFamily: 'Syne',
                fontWeight: 500,
                fontSize: 'clamp(32px,4.4vw,64px)',
                lineHeight: 1,
                letterSpacing: '-.03em',
              }}
            >
              <Squiggle color="rgba(72,216,128,.6)" delay={900}>
                {t('Élmény', 'Experience')}
              </Squiggle>{' '}
              {t('az eseményeden.', 'at your event.')}
            </Words>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: '#46433A', marginTop: 22, maxWidth: '38ch' }}>
              {t(
                '15 éve készítünk rendezvényprogramokat — azon belül is vizuális, fotós élményeket. Hisszük, hogy minden rendezvény lelke az élmény, és a mi dolgunk, hogy ez tartós is legyen.',
                'For 15 years we have been crafting event programs — visual, photo-driven experiences above all. We believe the soul of every event is the experience, and our job is to make it last.',
              )}
            </p>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: -10,
                bottom: -40,
                width: 96,
                height: 96,
                background: 'rgba(72,216,128,.3)',
                WebkitMask: 'url(/assets/doodle-2.png) center/contain no-repeat',
                mask: 'url(/assets/doodle-2.png) center/contain no-repeat',
                animation: 'ep-float 8s ease-in-out infinite',
              }}
            />
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {POINTS.map((p) => (
              <Reveal
                key={p.n}
                variant="right"
                delay={p.delay}
                style={{
                  background: '#F6F1E9',
                  borderRadius: 20,
                  padding: '28px 30px',
                  display: 'flex',
                  gap: 22,
                  alignItems: 'flex-start',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1.2), box-shadow .45s'
                  el.style.transform = 'translateX(10px)'
                  el.style.boxShadow = '0 22px 44px -26px rgba(23,21,13,.35)'
                  const n = el.querySelector<HTMLElement>('[data-num]')
                  if (n) n.style.transform = 'scale(1.25) rotate(-6deg)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateX(0)'
                  el.style.boxShadow = 'none'
                  const n = el.querySelector<HTMLElement>('[data-num]')
                  if (n) n.style.transform = 'none'
                }}
              >
                <span
                  data-num
                  style={{
                    fontFamily: 'Syne',
                    fontWeight: 600,
                    fontSize: 26,
                    color: '#48D880',
                    lineHeight: 1,
                    display: 'inline-block',
                    transition: 'transform .45s cubic-bezier(.2,.8,.2,1.3)',
                    transformOrigin: 'center',
                  }}
                >
                  {p.n}
                </span>
                <div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 21 }}>{t(p.title, p.titleEn)}</h3>
                  <p style={{ fontSize: 16, color: '#46433A', marginTop: 6, lineHeight: 1.5 }}>{t(p.body, p.bodyEn)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
