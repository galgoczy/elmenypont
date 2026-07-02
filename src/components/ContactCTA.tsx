import { useState, type CSSProperties, type FocusEvent as ReactFocusEvent } from 'react'
import { Reveal } from './Reveal'
import { Doodle } from './Doodle'

const EMAIL = 'hello@elmeny.hu'
const PHONE_LABEL = '+36 20 468 0489'
const PHONE_HREF = 'tel:+36204680489'

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

export function ContactCTA() {
  const [sent, setSent] = useState(false)

  return (
    <section
      id="kapcsolat"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: 'clamp(40px,6vw,90px) clamp(24px,6vw,90px) clamp(80px,10vw,130px)',
      }}
    >
      <Doodle n={2} color="rgba(0,0,0,.05)" size={84} left="4%" top="18%" anim="float2" duration={9} rotate="-9deg" />
      <Doodle n={4} color="rgba(0,0,0,.04)" size={58} right="5%" bottom="16%" anim="sway" duration={11} rotate="7deg" />

      <Reveal
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
            Ajánlatkérés
          </span>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 500, fontSize: 'clamp(28px,3.4vw,48px)', lineHeight: 1, letterSpacing: '-.03em' }}>
            Kérj személyre
            <br />
            szabott ajánlatot.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(255,255,255,.82)', marginTop: 18, maxWidth: '34ch' }}>
            Mondd el, milyen rendezvényt tervezel — 1 munkanapon belül válaszolunk.
          </p>
          <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
            <a
              href={PHONE_HREF}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 11, fontWeight: 600, fontSize: 17, color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {PHONE_LABEL}
            </a>
            <a href={`mailto:${EMAIL}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 11, fontSize: 16, color: 'rgba(255,255,255,.78)' }}>
              {EMAIL}
            </a>
          </div>
        </div>

        {/* form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          style={{ padding: 'clamp(36px,4vw,56px)', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input required placeholder="Név" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <input required type="email" placeholder="E-mail" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input placeholder="Telefon (opc.)" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <input placeholder="Esemény típusa" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <input placeholder="Időpont" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            <input placeholder="Vendégszám" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <textarea placeholder="Üzenet" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
          <button
            type="submit"
            style={{
              marginTop: 6,
              border: 'none',
              cursor: 'pointer',
              background: sent ? '#48D880' : '#17150D',
              color: '#F6F1E9',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 17,
              padding: '16px 28px',
              borderRadius: 100,
              transition: 'transform .25s, background .3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            {sent ? 'Köszönjük! Hamarosan jelentkezünk ✓' : 'Ajánlatot kérek →'}
          </button>
        </form>
      </Reveal>
    </section>
  )
}
