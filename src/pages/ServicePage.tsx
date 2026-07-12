import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { useScene } from '../hooks/useScene'
import { CursorFX } from '../components/CursorFX'
import { Nav } from '../components/Nav'
import { Reveal } from '../components/Reveal'
import { Doodle } from '../components/Doodle'
import { Magnetic } from '../components/Magnetic'
import { ContactCTA } from '../components/ContactCTA'
import { Footer } from '../components/Footer'

export interface ServiceData {
  slug: string
  /** document.title for dev/client navigation — the prerender step patches
   *  the real <head> of the static HTML from scripts/prerender.mjs */
  docTitle: string
  crumb: string
  title: ReactNode
  accent: string
  lead: ReactNode
  steps: { title: string; body: string }[]
  featuresTitle: string
  features: { color: string; title: string; body: string }[]
  useCases?: string[]
  /** silent looping product video — plays as the hero's media card */
  video?: { src: string; poster: string; label: string }
  /** hero media card when there is no video */
  heroImage?: { src: string; alt: string }
  /** real product photos — sticker-tilted band under "Hogyan működik" */
  images?: { src: string; alt: string; rotate?: number }[]
  price: {
    headline: string
    blurb?: ReactNode
    rows: { label: string; value: string }[]
    factors: string[]
  }
  provide: string[]
  crossLink?: { text: string; label: string; href: string }
}

const wrap: CSSProperties = { maxWidth: 1180, margin: '0 auto' }

const h2Style: CSSProperties = {
  fontFamily: 'Syne',
  fontWeight: 700,
  fontSize: 'clamp(26px,3.2vw,40px)',
  letterSpacing: '-.02em',
  color: '#17150D',
}

/**
 * Shared layout for the service subpages (/greenbox, /smart-wall,
 * /mosaic-wall) — the home page's design language on a calm cream canvas:
 * Syne display headings, doodle accents, Reveal entrances, and the same
 * contact block + footer. Content comes fully from a ServiceData object.
 */
export function ServicePage({ data }: { data: ServiceData }) {
  const { scrolled } = useScene()

  useEffect(() => {
    document.title = data.docTitle
  }, [data.docTitle])

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'clip', background: '#F6F1E9' }}>
      <CursorFX />
      <Nav scrolled={scrolled} base="/" />
      <main>
        {/* header — copy left, product media right on desktop; the top
            padding sits a quarter-line tighter than the sections' rhythm
            so the H1 rides higher in the viewport */}
        <header
          style={{
            position: 'relative',
            padding: 'clamp(140px,16.5vw,188px) clamp(24px,6vw,90px) clamp(40px,5vw,70px)',
          }}
        >
          <Doodle n={2} color="rgba(0,0,0,.05)" size={110} right="6%" top="14%" anim="float" duration={9} rotate="8deg" />
          <Doodle n={6} color="rgba(0,0,0,.04)" size={80} left="4%" bottom="4%" anim="float2" duration={11} rotate="-6deg" />
          <div className="ep-svc-hero" style={wrap}>
            <div>
            <Reveal
              as="p"
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: data.accent,
                marginBottom: 18,
              }}
            >
              {data.crumb}
            </Reveal>
            <Reveal
              as="h1"
              style={{
                fontFamily: 'Syne',
                fontWeight: 500,
                // sized for the split hero column — at 84px the boxed accent
                // words broke into chunky two-line blocks
                fontSize: 'clamp(36px,4.6vw,64px)',
                lineHeight: 1.04,
                letterSpacing: '-.03em',
                color: '#17150D',
                maxWidth: '18ch',
              }}
            >
              {data.title}
            </Reveal>
            <Reveal
              as="p"
              delay={90}
              style={{
                fontSize: 'clamp(17px,1.9vw,20px)',
                lineHeight: 1.6,
                color: '#46433A',
                maxWidth: '56ch',
                marginTop: 26,
              }}
            >
              {data.lead}
            </Reveal>
            <Reveal delay={160} style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 34, flexWrap: 'wrap' }}>
              <Magnetic strength={7}>
                <a
                  href="#kapcsolat"
                  style={{
                    display: 'inline-block',
                    background: '#17150D',
                    color: '#F6F1E9',
                    fontWeight: 600,
                    fontSize: 17,
                    padding: '15px 30px',
                    borderRadius: 100,
                  }}
                >
                  Kérj ajánlatot →
                </a>
              </Magnetic>
              {/* no arrow here: the CTA's "→" right next to a "←" read as two
                  arrows pointing at each other */}
              <a href="/#elmeny" style={{ fontWeight: 600, fontSize: 16, color: '#46433A', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                Minden szolgáltatás
              </a>
            </Reveal>
            </div>
            {(data.video || data.heroImage) && (
              <Reveal variant="mask" radius={24} delay={200}>
                {/* gently tilted media card — the video plays as a "living
                    photo" beside the copy */}
                {data.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={data.video.poster}
                    aria-label={data.video.label}
                    style={{
                      display: 'block',
                      width: '100%',
                      borderRadius: 24,
                      boxShadow: '0 34px 70px -28px rgba(23,21,13,.45)',
                      transform: 'rotate(1.4deg)',
                    }}
                  >
                    <source src={data.video.src} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={data.heroImage!.src}
                    alt={data.heroImage!.alt}
                    style={{
                      display: 'block',
                      width: '100%',
                      borderRadius: 24,
                      boxShadow: '0 34px 70px -28px rgba(23,21,13,.45)',
                      transform: 'rotate(1.4deg)',
                    }}
                  />
                )}
              </Reveal>
            )}
          </div>
        </header>

        {/* how it works */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal as="h2" style={h2Style}>
              Hogyan működik?
            </Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
                gap: 18,
                marginTop: 34,
              }}
            >
              {data.steps.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={i * 70}
                  style={{
                    border: '1px solid rgba(0,0,0,.12)',
                    borderRadius: 18,
                    padding: '24px 24px 26px',
                    background: '#FBF8F3',
                  }}
                >
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 38, color: data.accent, lineHeight: 1 }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 19, marginTop: 12, color: '#17150D' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.55, color: '#46433A', marginTop: 8 }}>{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* real product photos */}
        {data.images && (
          <section style={{ position: 'relative', padding: 'clamp(30px,4vw,56px) clamp(24px,6vw,90px)' }}>
            <div
              style={{
                ...wrap,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
                gap: 'clamp(16px,2.5vw,28px)',
                alignItems: 'center',
              }}
            >
              {/* rotation lives on the inner img — Reveal animates the outer
                  element's transform and would wipe it */}
              {data.images.map((im, i) => (
                <Reveal key={im.src} pop delay={i * 90}>
                  <img
                    src={im.src}
                    alt={im.alt}
                    loading="lazy"
                    style={{
                      display: 'block',
                      width: '100%',
                      borderRadius: 20,
                      boxShadow: '0 26px 55px -22px rgba(23,21,13,.4)',
                      transform: `rotate(${im.rotate ?? 0}deg)`,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* features */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <Doodle n={3} color="rgba(0,0,0,.045)" size={76} right="4%" top="8%" anim="float2" duration={9.5} rotate="4deg" />
          <div style={wrap}>
            <Reveal as="h2" style={h2Style}>
              {data.featuresTitle}
            </Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                gap: 16,
                marginTop: 34,
              }}
            >
              {data.features.map((f, i) => (
                <Reveal
                  key={f.title}
                  delay={i * 60}
                  style={{
                    border: '1px solid rgba(0,0,0,.12)',
                    borderRadius: 18,
                    padding: '24px 26px',
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ flex: 'none', width: 12, height: 12, borderRadius: '50%', background: f.color, marginTop: 7 }}
                  />
                  <div>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: '#17150D' }}>{f.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.55, color: '#46433A', marginTop: 6 }}>{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            {data.useCases && (
              <Reveal delay={120} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
                {data.useCases.map((u) => (
                  <span
                    key={u}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#46433A',
                      border: '1px solid rgba(0,0,0,.16)',
                      borderRadius: 100,
                      padding: '8px 16px',
                    }}
                  >
                    {u}
                  </span>
                ))}
              </Reveal>
            )}
          </div>
        </section>

        {/* pricing */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal
              style={{
                background: '#17150D',
                borderRadius: 28,
                padding: 'clamp(32px,4.5vw,58px)',
                color: '#F6F1E9',
              }}
            >
              <h2 style={{ ...h2Style, color: '#F6F1E9' }}>{data.price.headline}</h2>
              {data.price.blurb && (
                <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'rgba(246,241,233,.78)', maxWidth: '62ch', marginTop: 16 }}>
                  {data.price.blurb}
                </p>
              )}
              <div style={{ marginTop: 30, borderTop: '1px solid rgba(246,241,233,.16)' }}>
                {data.price.rows.map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: 20,
                      flexWrap: 'wrap',
                      padding: '16px 0',
                      borderBottom: '1px solid rgba(246,241,233,.16)',
                    }}
                  >
                    <span style={{ fontSize: 16, color: 'rgba(246,241,233,.85)', maxWidth: '46ch' }}>{r.label}</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 'clamp(19px,2.2vw,24px)', color: data.accent }}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(246,241,233,.55)', marginTop: 18 }}>
                Az árak nettó árak. Mitől függ a pontos ár: {data.price.factors.join(' · ')}.
              </p>
            </Reveal>
          </div>
        </section>

        {/* what we provide + cross link */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px) clamp(80px,9vw,120px)' }}>
          <div style={wrap}>
            <Reveal as="h2" style={h2Style}>
              Amit biztosítunk
            </Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                gap: '12px 28px',
                marginTop: 28,
              }}
            >
              {data.provide.map((p, i) => (
                <Reveal key={p} delay={i * 50} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span aria-hidden="true" style={{ color: data.accent, fontWeight: 700, fontSize: 18, lineHeight: 1.4 }}>
                    ✓
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1.55, color: '#46433A' }}>{p}</span>
                </Reveal>
              ))}
            </div>
            {data.crossLink && (
              <Reveal delay={140} style={{ marginTop: 40 }}>
                <p style={{ fontSize: 16.5, color: '#46433A' }}>
                  {data.crossLink.text}{' '}
                  <a href={data.crossLink.href} style={{ fontWeight: 700, color: '#E94A35' }}>
                    {data.crossLink.label}
                  </a>
                </p>
              </Reveal>
            )}
          </div>
        </section>

        <ContactCTA />
        <Footer />
      </main>
    </div>
  )
}
