import type { CSSProperties } from 'react'
import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { BeforeAfter } from './BeforeAfter'
import { TiltCard } from './TiltCard'
import { Words } from './Words'
import { useT } from '../i18n'

const SHOWCASE_STATS = [
  { value: '9–15 mp', valueEn: '9–15 sec', label: 'AI generálás', labelEn: 'AI generation', color: '#9868F8' },
  { value: '∞ stílus', valueEn: '∞ styles', label: 'választható téma', labelEn: 'themes to choose from', color: '#48D880' },
  { value: '100%', valueEn: '100%', label: 'rendezvényre szabva', labelEn: 'tailored to your event', color: '#28D0B8' },
]

const badge: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '9px 16px',
  borderRadius: 100,
  background: 'linear-gradient(105deg,#9868F8,#4888F8)',
  backgroundSize: '160% 160%',
  animation: 'ep-grad 6s ease infinite',
  fontFamily: 'Syne',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '.08em',
  color: '#fff',
}

/** Services + AI showcase: featured AI Selfiemata with live before/after + Videomata. */
export function Services() {
  const t = useT()
  return (
    <section
      id="szolgaltatasok"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        // a touch of top padding + scroll-margin so the "Amit a rendezvényedre
        // hozunk" heading lands just below the fixed nav when linked to
        padding: 'clamp(24px,4vw,56px) clamp(24px,6vw,90px) clamp(70px,9vw,120px)',
        scrollMarginTop: '72px',
      }}
    >
      <Doodle n={6} color="rgba(0,0,0,.05)" size={78} right="2%" top="8%" anim="float" duration={9} rotate="9deg" />
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 18,
            marginBottom: 48,
          }}
        >
          <Words
            as="h2"
            style={{
              fontFamily: 'Syne',
              fontWeight: 500,
              fontSize: 'clamp(28px,3.6vw,52px)',
              lineHeight: 1.02,
              letterSpacing: '-.03em',
            }}
          >
            {t('Amit a rendezvényedre hozunk', 'What we bring to your event')}
          </Words>
          <Reveal as="p" delay={80} style={{ fontSize: 16, color: '#7A766B', maxWidth: '34ch' }}>
            {t(
              'Sokféle megoldás, de mindegyik élmény — válassz nyugodtan, a többit intézzük.',
              "Plenty of options, and every one is an experience — pick freely, we'll handle the rest.",
            )}
          </Reveal>
        </div>

        {/* AI showcase: featured Selfiemata with live before/after */}
        <Reveal
          variant="mask"
          radius={30}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
            gap: 'clamp(28px,4vw,56px)',
            alignItems: 'center',
            background: '#17150D',
            borderRadius: 30,
            padding: 'clamp(28px,3.5vw,52px)',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', color: '#F6F1E9' }}>
            <span style={badge}>AI SELFIEMATA</span>
            <h3
              style={{
                fontFamily: 'Syne',
                fontWeight: 600,
                fontSize: 'clamp(34px,3.8vw,54px)',
                letterSpacing: '-.02em',
                lineHeight: 1.02,
                marginTop: 20,
              }}
            >
              {t('Lehetsz bárki', 'Be anyone')}
              <br />{t('— 10 másodperc alatt.', '— in 10 seconds.')}
            </h3>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                color: 'rgba(246,241,233,.72)',
                marginTop: 16,
                maxWidth: '42ch',
              }}
            >
              {t(
                'Valós idejű AI-képgenerálás a rendezvényeden. A vendég fotója egyedi, brandingelt, megosztható alkotássá válik — húzd el a csúszkát, és nézd meg élőben.',
                'Real-time AI image generation at your event. A guest photo turns into a unique, branded, shareable creation — drag the slider and watch it happen live.',
              )}
            </p>
            <div style={{ display: 'flex', gap: 26, marginTop: 28, flexWrap: 'wrap' }}>
              {SHOWCASE_STATS.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: 'Syne',
                      fontWeight: 700,
                      fontSize: 28,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {t(s.value, s.valueEn)}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(246,241,233,.55)', marginTop: 3 }}>
                    {t(s.label, s.labelEn)}
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/ai-fotoautomata"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                marginTop: 30,
                fontWeight: 600,
                fontSize: 16,
                color: '#fff',
                border: '1.5px solid rgba(246,241,233,.28)',
                padding: '13px 24px',
                borderRadius: 100,
                transition: 'background .3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246,241,233,.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {t('AI fotóautomata bérlés', 'AI photo booth rental')} <span>→</span>{' '}
              <span style={{ opacity: 0.55, fontWeight: 400 }}>{t('105 000 Ft-tól', 'from 105,000 HUF')}</span>
            </a>
          </div>
          <div style={{ position: 'relative' }}>
            <BeforeAfter
              before="/assets/photos/original.png"
              after="/assets/photos/style-astronaut.png"
              beforeLabel={t('Eredeti', 'Original')}
              afterLabel="AI ✦"
              beforeAlt={t('Eredeti vendégfotó az AI Selfiemata fotóautomatából', 'Original guest photo from the AI Selfiemata booth')}
              afterAlt={t('Az AI Selfiemata által generált asztronauta-változat ugyanarról a vendégről', 'The astronaut version of the same guest generated by AI Selfiemata')}
              style={{ width: '100%' }}
            />
          </div>
        </Reveal>

        {/* AI Videomata — cursor-tilting card with sheen (no page yet) */}
        <Reveal pop delay={120} style={{ marginTop: 26 }}>
          <TiltCard tilt={4} lift={8} radius={28} hoverShadow="0 44px 74px -30px rgba(0,0,0,.55)">
            <div
              style={{
                position: 'relative',
                borderRadius: 28,
                overflow: 'hidden',
                background: '#17150D',
                color: '#fff',
                minHeight: 440,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 38,
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector<HTMLElement>('[data-bgimg]')
                if (img) img.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector<HTMLElement>('[data-bgimg]')
                if (img) img.style.transform = 'scale(1)'
              }}
            >
              <img
                data-bgimg
                className="ep-videomata-img"
                src="/assets/aivideomata.jpg"
                alt="AI Videomata"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 1.1s cubic-bezier(.16,1,.3,1)',
                  willChange: 'transform',
                }}
              />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg,rgba(23,21,13,.1) 20%,rgba(23,21,13,.88) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ ...badge, position: 'absolute', top: 30, left: 30 }}>AI VIDEOMATA</div>
          <div style={{ position: 'relative', pointerEvents: 'none', maxWidth: '48ch' }}>
            <h3
              style={{
                fontFamily: 'Syne',
                fontWeight: 600,
                fontSize: 'clamp(32px,3.4vw,46px)',
                letterSpacing: '-.02em',
                lineHeight: 1.04,
              }}
            >
              {t('Lépj be a saját AI-videódba', 'Step into your own AI video')}
            </h3>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,.84)',
                marginTop: 14,
                maxWidth: '44ch',
              }}
            >
              {t(
                'Rúgd be a győztes gólt, szerepelj szuperhősként, vagy legyél rajzfilmsztár! A kész videó azonnal látható, és meg is osztható.',
                'Score the winning goal, star as a superhero, or become a cartoon star! The finished video is ready to watch — and share — instantly.',
              )}
            </p>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                marginTop: 20,
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.9)',
                border: '1.5px solid rgba(255,255,255,.35)',
                padding: '9px 16px',
                borderRadius: 100,
              }}
            >
              {t('Hamarosan', 'Coming soon')}
            </span>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}
