import { useEffect, useState } from 'react'

declare global {
  interface Window {
    epLoadGa?: () => void
    gtag?: (...args: unknown[]) => void
  }
}

/** GA4 event helper — no-op until the visitor consented and gtag loaded. */
export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, params || {})
}

/**
 * Minimal cookie-consent bar: analytics (GA4) only loads after an explicit
 * "Elfogadom". The choice persists in localStorage; the bar never renders
 * during prerender (decision happens in useEffect).
 */
export function CookieBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('ep-consent')) setShow(true)
    } catch {
      /* private mode etc. — no banner, no tracking */
    }
  }, [])

  if (!show) return null

  const decide = (ok: boolean) => {
    try {
      localStorage.setItem('ep-consent', ok ? 'yes' : 'no')
    } catch {
      /* ignore */
    }
    if (ok) window.epLoadGa?.()
    setShow(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Süti-beállítások"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 80,
        maxWidth: 680,
        margin: '0 auto',
        background: 'rgba(23,21,13,.96)',
        color: '#F6F1E9',
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        boxShadow: '0 24px 50px -18px rgba(23,21,13,.5)',
      }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.5, flex: '1 1 320px', margin: 0 }}>
        A látogatottság méréséhez sütiket használunk (Google Analytics). Részletek az{' '}
        <a href="/adatkezeles" style={{ color: '#F2937F', textDecoration: 'underline' }}>
          adatkezelési tájékoztatóban
        </a>
        .
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={() => decide(false)}
          style={{
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 600,
            padding: '10px 16px',
            borderRadius: 100,
            border: '1.5px solid rgba(246,241,233,.35)',
            background: 'transparent',
            color: '#F6F1E9',
            cursor: 'pointer',
          }}
        >
          Elutasítom
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          style={{
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 600,
            padding: '10px 18px',
            borderRadius: 100,
            border: 'none',
            background: '#F6F1E9',
            color: '#17150D',
            cursor: 'pointer',
          }}
        >
          Elfogadom
        </button>
      </div>
    </div>
  )
}
