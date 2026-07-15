import { useT, useLoc } from '../i18n'

const EMAIL = 'hello@elmeny.hu'

export function Footer() {
  const t = useT()
  const loc = useLoc()
  return (
    <footer
      style={{
        background: '#17150D',
        color: '#F6F1E9',
        padding: 'clamp(56px,7vw,90px) clamp(24px,6vw,90px) 40px',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 40,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 48,
            borderBottom: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <div style={{ maxWidth: '30ch' }}>
            <img
              src="/assets/logo/elmenypont-logo-white.png"
              alt="Élménypont"
              style={{ height: 34, width: 'auto', display: 'block', marginBottom: 20 }}
            />
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,.6)' }}>
              {t('Interaktív rendezvényélmények —', 'Interactive event experiences —')}{' '}
              <a href={loc('/ai-fotoautomata')} style={{ color: 'rgba(255,255,255,.82)' }}>
                AI Selfiemata
              </a>
              {t(', Videomata, greenbox és interaktív falak, kulcsrakészen.', ', Videomata, greenbox and interactive walls, turnkey.')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'clamp(34px,5vw,80px)', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A766B', marginBottom: 14 }}>
                {t('Szolgáltatások', 'Services')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 15 }}>
                <a href={loc('/ai-fotoautomata')} style={{ color: 'rgba(255,255,255,.82)' }}>
                  {t('AI fotóautomata bérlés rendezvényre', 'AI photo booth rental for events')}
                </a>
                <a href={loc('/greenbox')} style={{ color: 'rgba(255,255,255,.82)' }}>
                  Greenbox Selfiemata
                </a>
                <a href={loc('/smart-wall')} style={{ color: 'rgba(255,255,255,.82)' }}>
                  {t('Smart Wall — interaktív fal', 'Smart Wall — interactive wall')}
                </a>
                <a href={loc('/mosaic-wall')} style={{ color: 'rgba(255,255,255,.82)' }}>
                  {t('Mosaic Wall — mozaikfal', 'Mosaic Wall — mosaic wall')}
                </a>
                <a href={loc('/#elmeny')} style={{ color: 'rgba(255,255,255,.82)' }}>
                  AI Videomata
                </a>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A766B', marginBottom: 14 }}>
                {t('Elérhetőség', 'Contact')}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.82)' }}>
                1135 Budapest,
                <br />
                Reitter Ferenc utca 35.
                <br />
                <a href="tel:+36204680489" style={{ color: '#F2937F' }}>
                  +36 20 468 0489
                </a>
                <br />
                <a href={`mailto:${EMAIL}`} style={{ color: 'rgba(255,255,255,.82)' }}>
                  {EMAIL}
                </a>
              </p>
            </div>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7A766B', marginBottom: 14 }}>
                {t('Kövess', 'Follow')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 15 }}>
                <a
                  href="https://www.facebook.com/Elmenypont/"
                  target="_blank"
                  rel="noopener"
                  style={{ color: 'rgba(255,255,255,.82)' }}
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/elmeny.hu/"
                  target="_blank"
                  rel="noopener"
                  style={{ color: 'rgba(255,255,255,.82)' }}
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 28, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <span>{t('© 2026 Élménypont. Minden jog fenntartva.', '© 2026 Élménypont. All rights reserved.')}</span>
          <a href={loc('/adatkezeles')} style={{ color: 'rgba(255,255,255,.55)' }}>
            {t('Adatkezelési tájékoztató', 'Privacy policy')}
          </a>
        </p>
      </div>
    </footer>
  )
}
