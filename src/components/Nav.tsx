import type { CSSProperties } from 'react'
import { cl } from '../hooks/useScene'

interface NavProps {
  heroP: number
  scrolled: boolean
}

const LINKS = [
  { href: '#szolgaltatasok', label: 'Szolgáltatások' },
  { href: '#elmeny', label: 'Az élmény' },
  { href: '#rolunk', label: 'Rólunk' },
  { href: '#kapcsolat', label: 'Kapcsolat' },
]

export function Nav({ heroP, scrolled }: NavProps) {
  // reveal mix: at the end of the hero the stage turns cream, so the nav
  // switches from light-on-dark to dark-on-cream.
  const mix = cl(heroP, 0.56, 0.9)
  const navDark = !scrolled && mix < 0.5

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
      <a href="#top" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={navLinkStyle}
            className="ep-nav-link"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#kapcsolat"
          style={navCtaStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
        >
          Ajánlatot kérek
        </a>
      </div>
    </nav>
  )
}
