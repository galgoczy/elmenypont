import { useRef, useState, type CSSProperties, type FocusEvent as ReactFocusEvent } from 'react'
import { useT, useLoc } from '../i18n'
import { Reveal } from './Reveal'
import { Doodle } from './Doodle'
import { Magnetic } from './Magnetic'
import { track } from './CookieBar'

const EMAIL = 'hello@elmeny.hu'
const PHONE_LABEL = '+36 20 468 0489'
const PHONE_HREF = 'tel:+36204680489'

/** multi-select service chips — the last one signals "several of these" */
const SERVICES = [
  'AI Selfiemata',
  'Greenbox Selfiemata',
  'Smart Wall',
  'Mosaic Wall',
  'Selfiebox',
  'Többfélére kérek ajánlatot!',
]

/** English chip labels — brand names stay identical, only the CTA differs */
const SERVICE_EN: Record<string, string> = {
  'Többfélére kérek ajánlatot!': "I'd like a quote for several!",
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: '#F6F1E9',
  border: '1.5px solid rgba(0,0,0,.08)',
  borderRadius: 12,
  padding: '14px 16px',
  fontSize: 16,
  color: '#17150D',
  outline: 'none',
  transition: 'border-color .25s, background .25s',
  fontFamily: 'inherit',
}

const onFocus = (e: ReactFocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = '#4888F8'
}
const onBlur = (e: ReactFocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = 'rgba(0,0,0,.08)'
}

export function ContactCTA({ preselect = [] }: { preselect?: string[] }) {
  const t = useT()
  const loc = useLoc()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  // the page passes its own service so it starts ticked — more can be added
  const [picked, setPicked] = useState<string[]>(preselect)
  // invisible spam guard: when the form first mounted, so the server can
  // drop implausibly fast (bot) submissions — see api/contact.js
  const loadedAt = useRef(Date.now())

  const toggleService = (s: string) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const submit = async (form: HTMLFormElement) => {
    setSending(true)
    setError('')
    const f = new FormData(form)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          phone: f.get('phone'),
          services: picked,
          eventType: f.get('eventType'),
          date: f.get('date'),
          guests: f.get('guests'),
          message: f.get('message'),
          // bot traps (invisible to real users)
          website: f.get('website'),
          elapsedMs: Date.now() - loadedAt.current,
        }),
      })
      const json = await res.json().catch(() => ({ ok: false }))
      if (!res.ok || !json.ok) throw new Error(json.error || 'Küldési hiba')
      track('generate_lead', { services: picked.join(',') || 'none' })
      setSent(true)
    } catch {
      setError(
        t(
          `Nem sikerült elküldeni — írj nekünk közvetlenül: ${EMAIL}`,
          `Couldn't send — write to us directly: ${EMAIL}`,
        ),
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="kapcsolat"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: 'clamp(28px,4vw,56px) clamp(24px,6vw,90px) clamp(70px,9vw,110px)',
      }}
    >
      <Doodle n={2} color="rgba(0,0,0,.05)" size={84} left="4%" top="18%" anim="float2" duration={9} rotate="-9deg" />
      <Doodle n={4} color="rgba(0,0,0,.04)" size={58} right="5%" bottom="16%" anim="sway" duration={11} rotate="7deg" />

      <Reveal
        variant="mask"
        radius={32}
        style={{
          position: 'relative',
          maxWidth: 1080,
          margin: '0 auto',
          background: '#F6F1E9',
          border: '1px solid rgba(0,0,0,.07)',
          borderRadius: 32,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
        }}
      >
        {/* coral panel — the single dominant coral surface */}
        <div style={{ padding: 'clamp(36px,4vw,56px)', background: '#E94A35', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: -30,
              bottom: -30,
              width: 180,
              height: 180,
              background: 'rgba(255,255,255,.32)',
              WebkitMask: 'url(/assets/doodle-1.png) center/contain no-repeat',
              mask: 'url(/assets/doodle-1.png) center/contain no-repeat',
              animation: 'ep-float 9s ease-in-out infinite',
            }}
          />
          <span
            style={{
              display: 'inline-block',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.85)',
              marginBottom: 20,
            }}
          >
            {t('Ajánlatkérés', 'Quote request')}
          </span>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 500, fontSize: 'clamp(28px,3.4vw,48px)', lineHeight: 1, letterSpacing: '-.03em' }}>
            {t('Kérj személyre', 'Get a quote made')}
            <br />
            {t('szabott ajánlatot.', 'just for you.')}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,.82)', marginTop: 18, maxWidth: '34ch' }}>
            {t('Mondd el, milyen rendezvényt tervezel — 1 munkanapon belül válaszolunk.', 'Tell us what kind of event you’re planning — we’ll reply within 1 business day.')}
          </p>
          <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
            <a
              href={PHONE_HREF}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 11, fontWeight: 600, fontSize: 17, color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              onClick={() => track('contact_click', { method: 'phone' })}
            >
              {PHONE_LABEL}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 11, fontSize: 16, color: 'rgba(255,255,255,.78)' }}
              onClick={() => track('contact_click', { method: 'email' })}
            >
              {EMAIL}
            </a>
          </div>
        </div>

        {/* form */}
        <form
          method="post"
          action="/api/contact"
          onSubmit={(e) => {
            e.preventDefault()
            if (!sending && !sent) void submit(e.currentTarget)
          }}
          style={{ padding: 'clamp(36px,4vw,56px)', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {/* honeypot: off-screen decoy field. Real users never see or fill
              it; bots that auto-fill inputs trip it and get dropped server-side */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" placeholder="Website" />
          </div>
          {/* which service(s) — multi-select chips */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#7A766B', marginBottom: 10 }}>
              {t('Mi érdekel?', 'What are you interested in?')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SERVICES.map((s) => {
                const on = picked.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleService(s)}
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 14,
                      fontWeight: 600,
                      padding: '9px 16px',
                      borderRadius: 100,
                      cursor: 'pointer',
                      border: `1.5px solid ${on ? '#17150D' : 'rgba(0,0,0,.16)'}`,
                      background: on ? '#17150D' : 'transparent',
                      color: on ? '#F6F1E9' : '#46433A',
                      transition: 'background .2s, color .2s, border-color .2s',
                    }}
                  >
                    {t(s, SERVICE_EN[s] ?? s)}
                  </button>
                )
              })}
            </div>
          </div>
          {/* placeholders carry the visual design; name + aria-label make the
              fields identifiable to assistive tech and agents (a placeholder
              alone disappears on input and is not a label) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input required name="name" autoComplete="name" aria-label={t('Név', 'Name')} placeholder={t('Név', 'Name')} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <input required type="email" name="email" autoComplete="email" aria-label={t('E-mail', 'Email')} placeholder={t('E-mail', 'Email')} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input type="tel" name="phone" autoComplete="tel" aria-label={t('Telefon (opcionális)', 'Phone (optional)')} placeholder={t('Telefon (opc.)', 'Phone (opt.)')} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <input name="eventType" aria-label={t('Esemény típusa', 'Event type')} placeholder={t('Esemény típusa', 'Event type')} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input name="date" aria-label={t('Időpont', 'Date')} placeholder={t('Időpont', 'Date')} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <input name="guests" aria-label={t('Vendégszám', 'Guest count')} placeholder={t('Vendégszám', 'Guest count')} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <textarea name="message" aria-label={t('Üzenet', 'Message')} placeholder={t('Üzenet', 'Message')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.5, color: '#7A766B', cursor: 'pointer' }}>
            <input type="checkbox" name="gdpr" required style={{ marginTop: 3, width: 16, height: 16, accentColor: '#17150D' }} />
            <span>
              {t('Elolvastam és elfogadom az', 'I have read and accept the')}{' '}
              <a href={loc('/adatkezeles')} target="_blank" rel="noopener" style={{ color: '#E94A35', textDecoration: 'underline' }}>
                {t('adatkezelési tájékoztatót', 'privacy policy')}
              </a>
              {t(', és hozzájárulok adataim ajánlatadás céljából történő kezeléséhez.', ', and I consent to my data being processed for the purpose of preparing a quote.')}
            </span>
          </label>
          <Magnetic strength={6} style={{ marginTop: 6, display: 'block' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                border: 'none',
                cursor: 'pointer',
                background: sent ? '#48D880' : '#17150D',
                color: '#F6F1E9',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: 17,
                padding: '16px 28px',
                borderRadius: 100,
                transition: 'background .3s, box-shadow .3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 16px 30px -14px rgba(23,21,13,.5)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              {sent
                ? t('Köszönjük! Hamarosan jelentkezünk ✓', 'Thank you! We’ll be in touch soon ✓')
                : sending
                  ? t('Küldés…', 'Sending…')
                  : t('Ajánlatot kérek →', 'Get a quote →')}
            </button>
          </Magnetic>
          {error && (
            <p role="alert" style={{ fontSize: 14, color: '#C6402E', textAlign: 'center' }}>
              {error}
            </p>
          )}
        </form>
      </Reveal>
    </section>
  )
}
