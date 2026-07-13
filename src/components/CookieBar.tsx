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
        right: 12,
        bottom: 12,
        left: 12,
        zIndex: 80,
        maxWidth: 460,
        marginLeft: 'auto',
        background: 'rgba(23,21,13,.94)',
        color: '#F6F1E9',
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        boxShadow: '0 18px 40px -16px rgba(23,21,13,.45)',
      }}
    >
      <p style={{ fontSize: 12.5, lineHeight: 1.45, flex: '1 1 210px', margin: 0, color: 'rgba(246,241,233,.85)' }}>
        Méréshez sütiket használunk —{' '}
        <a href="/adatkezeles" style={{ color: '#F2937F', textDecoration: 'underline' }}>
          részletek
        </a>
        .
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => decide(false)}
          style={{
            fontFamily: 'inherit',
            fontSize: 12.5,
            fontWeight: 600,
            padding: '7px 12px',
            borderRadius: 100,
            border: '1.5px solid rgba(246,241,233,.3)',
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
            fontSize: 12.5,
            fontWeight: 600,
            padding: '7px 14px',
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
