import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cl } from '../hooks/useScene'
import { Magnetic } from './Magnetic'

interface NavProps {
  /** hero scroll progress — omit on subpages (they have no dark hero) */
  heroP?: number
  scrolled: boolean
  /** prefix for the section anchors: '' on the home page, '/' on subpages
   *  so the links lead back to the home page's sections */
  base?: string
}

/** the services menu items — absolute hrefs (subpages/AI) stay as-is, the
 *  '#' anchor is prefixed with `base` so subpages point back home */
const SERVICE_ITEMS = [
  { href: '/ai-fotoautomata', label: 'AI Selfiemata', desc: 'Valós idejű AI-képgenerálás', ai: true },
  { href: '/greenbox', label: 'Greenbox Selfiemata', desc: 'Zöld hátteres stúdió-automata' },
  { href: '/smart-wall', label: 'Smart Wall', desc: 'Interaktív, érinthető fal' },
  { href: '/mosaic-wall', label: 'Mosaic Wall', desc: 'Közös mozaikkép a vendégfotókból' },
  { href: '/selfiebox', label: 'Selfiebox', desc: 'Klasszikus fotóbox azonnali nyomtatással' },
  { href: null, label: 'AI Videomata', desc: 'Hamarosan' },
] as { href: string | null; label: string; desc: string; ai?: boolean }[]

const LINKS = [
  { href: '#elmeny', label: 'Az élmény' },
  { href: '#rolunk', label: 'Rólunk' },
  { href: '#kapcsolat', label: 'Kapcsolat' },
]

export function Nav({ heroP = 1, scrolled, base = '' }: NavProps) {
  // reveal mix: at the end of the hero the stage turns cream, so the nav
  // switches from light-on-dark to dark-on-cream (same window as the
  // hero's reveal phase).
  const mix = cl(heroP, 0.711, 0.826)
  const navDark = !scrolled && mix < 0.5
  // services dropdown: hover on desktop, tap-toggle on touch
  const [svcOpen, setSvcOpen] = useState(false)
  const svcRef = useRef<HTMLDivElement | null>(null)
  // close on tap/click outside (touch has no mouseleave)
  useEffect(() => {
    if (!svcOpen) return
    const onDown = (e: PointerEvent) => {
      if (svcRef.current && !svcRef.current.contains(e.target as Node)) setSvcOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [svcOpen])

  const navStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${scrolled ? '14px' : '20px'} clamp(20px,5vw,56px)`,
    transition: 'padding .4s, background .4s, box-shadow .4s',
    background: scrolled ? 'rgba(247,242,234,.82)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
    boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,.06)' : 'none',
  }

  const linkCol = navDark ? 'rgba(255,255,255,.85)' : '#17150D'
  const navLinkStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 500,
    color: linkCol,
    transition: 'color .4s, opacity .2s',
    opacity: 0.9,
  }
  const navCtaStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    padding: '11px 20px',
    borderRadius: 100,
    background: navDark ? '#F6F1E9' : '#17150D',
    color: navDark ? '#17150D' : '#F6F1E9',
    transition: 'transform .25s, background .4s, color .4s',
  }

  return (
    <nav style={navStyle}>
      {/* reading-progress hairline */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 3,
          transformOrigin: 'left',
          transform: 'scaleX(var(--scrollp, 0))',
          background: 'linear-gradient(90deg,#E94A35,#F2937F)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <a href={base ? base : '#top'} className="ep-nav-logo" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/assets/logo/elmenypont-logo-coral.png"
          alt="Élménypont"
          style={{ height: 30, width: 'auto', display: 'block' }}
        />
        <img
          src="/assets/logo/elmenypont-logo-white.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 30,
            width: 'auto',
            display: 'block',
            opacity: navDark ? 1 : 0,
            transition: 'opacity .4s',
          }}
        />
      </a>
      <div className="ep-nav-right" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Szolgáltatások — hover/tap dropdown of the individual services */}
        <div
          className="ep-nav-svc"
          ref={svcRef}
          onMouseEnter={() => setSvcOpen(true)}
          onMouseLeave={() => setSvcOpen(false)}
          style={{ position: 'relative' }}
        >
          <a
            href={base ? `${base}#szolgaltatasok` : '#szolgaltatasok'}
            style={{ ...navLinkStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={(e) => {
              // touch devices (no real hover) just toggle the menu — the
              // individual services are the point there; on desktop the hover
              // already opened it, so a click navigates to the section
              const touch =
                typeof window !== 'undefined' &&
                window.matchMedia &&
                window.matchMedia('(hover: none)').matches
              if (touch) {
                // header tap always opens; closing is via outside-tap or
                // picking an item (a toggle here races the outside-close)
                e.preventDefault()
                setSvcOpen(true)
              } else {
                setSvcOpen(false)
              }
            }}
            aria-expanded={svcOpen}
          >
            Szolgáltatások
            <span
              aria-hidden="true"
              style={{
                fontSize: 10,
                transform: svcOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform .25s',
              }}
            >
              ▾
            </span>
          </a>
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: `translateX(-50%) translateY(${svcOpen ? '0' : '-6px'})`,
              // the visual gap below the trigger lives INSIDE the panel as
              // transparent padding: crossing it keeps the pointer within
              // the wrapper, so mouseleave doesn't close the menu mid-way
              paddingTop: 10,
              opacity: svcOpen ? 1 : 0,
              visibility: svcOpen ? 'visible' : 'hidden',
              pointerEvents: svcOpen ? 'auto' : 'none',
              transition: 'opacity .22s, transform .22s, visibility .22s',
              zIndex: 5,
            }}
          >
            <div
              style={{
                minWidth: 268,
                padding: 8,
                background: 'rgba(247,242,234,.96)',
                backdropFilter: 'blur(16px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                border: '1px solid rgba(0,0,0,.08)',
                borderRadius: 16,
                boxShadow: '0 24px 50px -20px rgba(23,21,13,.32)',
              }}
            >
            {SERVICE_ITEMS.map((s) => {
              const inactive = !s.href
              const href = s.href && s.href.startsWith('#') ? `${base}${s.href}` : s.href || undefined
              return (
                <a
                  key={s.label}
                  href={href}
                  role="menuitem"
                  aria-disabled={inactive || undefined}
                  onClick={(e) => {
                    if (inactive) e.preventDefault()
                    else setSvcOpen(false)
                  }}
                  className={inactive ? undefined : 'ep-svc-item'}
                  style={{
                    display: 'block',
                    padding: '10px 14px',
                    borderRadius: 10,
                    color: inactive ? '#A8A398' : '#17150D',
                    cursor: inactive ? 'default' : 'pointer',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.label}
                    {s.ai && (
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '.05em',
                          color: '#fff',
                          background: 'linear-gradient(120deg,#9B6BF2,#4888F8)',
                          borderRadius: 100,
                          padding: '2px 7px',
                          lineHeight: 1.4,
                        }}
                      >
                        AI ✦
                      </span>
                    )}
                    {inactive && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '.06em',
                          textTransform: 'uppercase',
                          color: '#A8A398',
                          border: '1px solid rgba(0,0,0,.14)',
                          borderRadius: 100,
                          padding: '2px 7px',
                        }}
                      >
                        Hamarosan
                      </span>
                    )}
                  </span>
                  {!inactive && (
                    <span style={{ fontSize: 13, color: '#7A766B', marginTop: 1, display: 'block' }}>{s.desc}</span>
                  )}
                </a>
              )
            })}
            </div>
          </div>
        </div>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={`${base}${l.href}`}
            style={navLinkStyle}
            className="ep-nav-link"
          >
            {l.label}
          </a>
        ))}
        <Magnetic strength={5}>
          <a href="#kapcsolat" className="ep-nav-cta" style={{ ...navCtaStyle, display: 'inline-block', whiteSpace: 'nowrap' }}>
            Ajánlatot kérek
          </a>
        </Magnetic>
      </div>
    </nav>
  )
}
