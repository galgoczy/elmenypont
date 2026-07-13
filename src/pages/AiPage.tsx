import { useState, type CSSProperties } from 'react'
import { useScene } from '../hooks/useScene'
import { CursorFX } from '../components/CursorFX'
import { Nav } from '../components/Nav'
import { Reveal } from '../components/Reveal'
import { Doodle } from '../components/Doodle'
import { Magnetic } from '../components/Magnetic'
import { BeforeAfter } from '../components/BeforeAfter'
import { ContactCTA } from '../components/ContactCTA'
import { Footer } from '../components/Footer'

const wrap: CSSProperties = { maxWidth: 1180, margin: '0 auto' }

const h2Style: CSSProperties = {
  fontFamily: 'Syne',
  fontWeight: 700,
  fontSize: 'clamp(26px,3.2vw,40px)',
  letterSpacing: '-.02em',
  color: '#17150D',
}

/** the ai.elmeny.hu hero's style switcher, rebuilt on the main site: the
 *  "after" side of the slider swaps to the picked AI style */
const STYLES = [
  { key: 'uhajos', label: 'Űrhajós', src: '/assets/photos/ai/hero-uhajos-full.jpg' },
  { key: 'festmeny', label: 'Festmény', src: '/assets/photos/ai/hero-festmeny-full.jpg' },
  { key: 'karikatura', label: 'Karikatúra', src: '/assets/photos/ai/hero-karikatura-full.jpg' },
  { key: 'extrem', label: 'Extrém', src: '/assets/photos/ai/hero-extrem-full.jpg' },
  { key: 'pixar', label: 'Pixar', src: '/assets/photos/ai/hero-pixar-full.jpg' },
]

const WHY = [
  {
    color: '#9B6BF2',
    title: 'A vendégek AI-élményt várnak',
    body: 'Az okostelefon már nem elég. Az emberek valami olyat akarnak, amit otthon nem tudnak könnyen megcsinálni.',
  },
  {
    color: '#E94A35',
    title: 'Organikus virális tartalom',
    body: 'Egy egyedi AI-kép háromszor nagyobb valószínűséggel kerül ki a social médiára, mint egy hagyományos fotó.',
  },
  {
    color: '#48D880',
    title: 'Brandaktiváció új szinten',
    body: 'Az AI-kimenet brandingelhető — minden megosztott kép a te logóddal, a te rendezvényed nevével megy ki.',
  },
]

const STYLE_CARDS = [
  { name: 'Masterpiece', desc: 'Van Gogh, Klimt, Pop Art' },
  { name: 'Epic Scene', desc: 'F1, viking, űrhajós' },
  { name: 'Karikatúra', desc: 'Vicces rajzolt torzítás' },
  { name: 'Pixar Mode', desc: '3D animációs karakter' },
  { name: 'Anime', desc: 'Japán animációs portré' },
  { name: 'Cyberpunk', desc: 'Neon city, 2076' },
  { name: 'Kocka', desc: 'Építőkocka-figura stílus' },
  { name: 'Egyedi', desc: 'Kérésre, a rendezvényedre tervezve' },
]

const STEPS = [
  { title: 'Stílus', body: 'A vendég választ a rendezvényre tervezett AI-stílusok közül.' },
  { title: 'Fotó', body: 'Az érintőképernyős automatával lefényképezi magát — ebben személyzet is segít.' },
  { title: 'AI varázsol', body: 'A felhőalapú AI 9–15 másodperc alatt újrarajzolja a képet.' },
  { title: 'Megosztás', body: 'QR-kóddal, e-mailben vagy nyomtatva viszi — akár azonnal megosztja, brandingelt kerettel.' },
]

const CUSTOM = [
  { title: 'Esemény-koncepció', body: 'Közösen kitaláljuk, mi illik a rendezvényhez: téma, hangulat, üzenet.' },
  { title: 'AI vizuális világ', body: 'A stílusokat az eseményedre tervezzük — céges party, csapatépítő, promóció, családi nap, esküvő.' },
  { title: 'Brand-integráció', body: 'Logó, keret, esemény-arculat minden kimenő képen.' },
  { title: 'Egyedi prompt-rendszer', body: 'Nem sablon: a képi világot promptszinten szabjuk a briefedre.' },
]

/**
 * AI Selfiemata a fő domainen — az ai.elmeny.hu landing logikája és szövegei
 * a főoldal dizájnnyelvén: stílusváltós előtte-utána hero, Miért AI,
 * stíluskártyák, 4 lépés, személyre szabás, árak.
 */
export function AiPage() {
  const { scrolled } = useScene()
  const [style, setStyle] = useState(STYLES[0])

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'clip', background: '#F6F1E9' }}>
      <CursorFX />
      <Nav scrolled={scrolled} base="/" />
      <main>
        {/* hero: copy + style-switching before/after */}
        <header
          style={{
            position: 'relative',
            padding: 'clamp(140px,16.5vw,188px) clamp(24px,6vw,90px) clamp(40px,5vw,70px)',
          }}
        >
          <Doodle n={2} color="rgba(0,0,0,.05)" size={110} right="5%" top="12%" anim="float" duration={9} rotate="8deg" />
          <div className="ep-svc-hero" style={wrap}>
            <div>
              <Reveal
                as="p"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: '#9B6BF2',
                  marginBottom: 18,
                }}
              >
                AI Selfiemata · #1 rendezvénytrend 2026
              </Reveal>
              <Reveal
                as="h1"
                style={{
                  fontFamily: 'Syne',
                  fontWeight: 500,
                  fontSize: 'clamp(36px,4.6vw,64px)',
                  lineHeight: 1.04,
                  letterSpacing: '-.03em',
                  color: '#17150D',
                  maxWidth: '18ch',
                }}
              >
                A fotóautomata újraírva —{' '}
                <span
                  style={{
                    display: 'inline-block',
                    background: '#17150D',
                    color: '#F6F1E9',
                    padding: '.02em .22em .1em',
                    borderRadius: '.14em',
                    transform: 'rotate(-1.4deg)',
                  }}
                >
                  AI Selfiemata.
                </span>
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
                Valós idejű AI-képgenerálás rendezvényeken: a készült fotót az AI átvarázsolja —
                egyedi, megosztható, brandingelt emlék, pár másodperc alatt. Nem filter, nem
                sablon: minden kép egyedi alkotás.
              </Reveal>
              <Reveal delay={150} style={{ display: 'flex', gap: 22, marginTop: 26, flexWrap: 'wrap' }}>
                {[
                  { v: '9–15 mp', l: 'AI generálás', c: '#9B6BF2' },
                  { v: '∞ stílus', l: 'választható téma', c: '#48D880' },
                  { v: '100%', l: 'rendezvényre szabva', c: '#E94A35' },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 24, color: s.c, lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: 13, color: '#7A766B', marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </Reveal>
              <Reveal delay={200} style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 30, flexWrap: 'wrap' }}>
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
                <a href="/#elmeny" style={{ fontWeight: 600, fontSize: 16, color: '#46433A', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  Minden szolgáltatás
                </a>
              </Reveal>
            </div>
            <div>
              <Reveal variant="mask" radius={24}>
                <BeforeAfter
                  before="/assets/photos/ai/hero-before-full.jpg"
                  after={style.src}
                  beforeLabel="Eredeti"
                  afterLabel={`AI ✦ ${style.label}`}
                  beforeAlt="Eredeti vendégfotó az AI Selfiemata automatából"
                  afterAlt={`Az AI Selfiemata által generált ${style.label.toLowerCase()} stílusú változat ugyanarról a vendégről`}
                  style={{ width: '100%' }}
                />
              </Reveal>
              {/* style pills — swap the slider's AI side */}
              <Reveal delay={120} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' }}>
                {STYLES.map((s) => {
                  const on = s.key === style.key
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setStyle(s)}
                      aria-pressed={on}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 13.5,
                        fontWeight: 600,
                        padding: '8px 15px',
                        borderRadius: 100,
                        cursor: 'pointer',
                        border: `1.5px solid ${on ? '#17150D' : 'rgba(0,0,0,.16)'}`,
                        background: on ? '#17150D' : 'transparent',
                        color: on ? '#F6F1E9' : '#46433A',
                        transition: 'background .2s, color .2s, border-color .2s',
                      }}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </Reveal>
            </div>
          </div>
        </header>

        {/* Miért most? Miért AI? */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal as="h2" style={h2Style}>
              Miért most? Miért AI?
            </Reveal>
            <Reveal as="p" delay={60} style={{ fontSize: 17, lineHeight: 1.6, color: '#46433A', maxWidth: '58ch', marginTop: 14 }}>
              A rendezvényipar legnagyobb trendje 2026-ban az AI-élmény — és a magyar piacon
              szinte egyedül kínálunk teljes képi újragenerálást, nem csak arccserét.
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginTop: 30 }}>
              {WHY.map((f, i) => (
                <Reveal key={f.title} delay={i * 60} style={{ border: '1px solid rgba(0,0,0,.12)', borderRadius: 18, padding: '24px 26px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span aria-hidden="true" style={{ flex: 'none', width: 12, height: 12, borderRadius: '50%', background: f.color, marginTop: 7 }} />
                  <div>
                    <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: '#17150D' }}>{f.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.55, color: '#46433A', marginTop: 6 }}>{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AI stílusok */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <Doodle n={3} color="rgba(0,0,0,.045)" size={76} right="4%" top="8%" anim="float2" duration={9.5} rotate="4deg" />
          <div style={wrap}>
            <Reveal as="h2" style={h2Style}>
              AI-stílusok — minden kép egyedi alkotás
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginTop: 30 }}>
              {STYLE_CARDS.map((s, i) => (
                <Reveal key={s.name} delay={i * 40} style={{ border: '1px solid rgba(0,0,0,.12)', borderRadius: 16, padding: '18px 20px', background: '#FBF8F3' }}>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, color: '#17150D' }}>{s.name}</h3>
                  <p style={{ fontSize: 14, color: '#46433A', marginTop: 5 }}>{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Hogyan működik */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal as="h2" style={h2Style}>
              Hogyan működik? 4 lépés, pár másodperc.
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18, marginTop: 34 }}>
              {STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 70} style={{ border: '1px solid rgba(0,0,0,.12)', borderRadius: 18, padding: '24px 24px 26px', background: '#FBF8F3' }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 38, color: '#9B6BF2', lineHeight: 1 }}>{i + 1}</div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 19, marginTop: 12, color: '#17150D' }}>{s.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.55, color: '#46433A', marginTop: 8 }}>{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Személyre szabás */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
            <div>
              <Reveal as="h2" style={h2Style}>
                Nem sablon. Teljesen rád szabjuk.
              </Reveal>
              <div style={{ display: 'grid', gap: '12px 0', marginTop: 26 }}>
                {CUSTOM.map((c, i) => (
                  <Reveal key={c.title} delay={i * 50} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span aria-hidden="true" style={{ color: '#9B6BF2', fontWeight: 700, fontSize: 18, lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: 16, lineHeight: 1.55, color: '#46433A' }}>
                      <strong style={{ color: '#17150D' }}>{c.title}:</strong> {c.body}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={120} style={{ background: '#FBF8F3', border: '1px solid rgba(0,0,0,.12)', borderRadius: 18, padding: '26px 28px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A766B' }}>
                Példa brief
              </p>
              <dl style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.7, color: '#46433A' }}>
                <div><strong style={{ color: '#17150D' }}>Rendezvény:</strong> év végi céges gála, 200 fő</div>
                <div><strong style={{ color: '#17150D' }}>Stílus:</strong> hollywoodi filmplakát, céges logóval</div>
                <div><strong style={{ color: '#17150D' }}>Kimenet:</strong> digitális + opcionális nyomtatás</div>
                <div><strong style={{ color: '#17150D' }}>Időtartam:</strong> 8 óra, Egerben</div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Árak */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal style={{ background: '#17150D', borderRadius: 28, padding: 'clamp(32px,4.5vw,58px)', color: '#F6F1E9' }}>
              <h2 style={{ ...h2Style, color: '#F6F1E9' }}>Árak</h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'rgba(246,241,233,.78)', maxWidth: '62ch', marginTop: 16 }}>
                A legkisebb egység: 4 órás kitelepülés Budapesten, online megosztással.
              </p>
              <div style={{ marginTop: 30, borderTop: '1px solid rgba(246,241,233,.16)' }}>
                {[
                  { label: 'AI Selfiemata — 4 óra, Budapest, online megosztás', value: '105 000 Ft-tól' },
                  { label: 'Nyomatcsomagok (10×15 cm papírkép)', value: '20 000 Ft-tól' },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap', padding: '16px 0', borderBottom: '1px solid rgba(246,241,233,.16)' }}
                  >
                    <span style={{ fontSize: 16, color: 'rgba(246,241,233,.85)', maxWidth: '46ch' }}>{r.label}</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 'clamp(19px,2.2vw,24px)', color: '#9B6BF2' }}>{r.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(246,241,233,.55)', marginTop: 18 }}>
                Az árak nettó árak. Mitől függ a pontos ár: időtartam · helyszín (Budapesten kívül kiszállás) · vendégszám és
                nyomatcsomag · az AI-képvilág egyediségének mélysége.
              </p>
            </Reveal>
          </div>
        </section>

        {/* SEO-záró bekezdés az ai.elmeny.hu-ról */}
        <section style={{ position: 'relative', padding: 'clamp(30px,4vw,56px) clamp(24px,6vw,90px) clamp(80px,9vw,120px)' }}>
          <div style={wrap}>
            <Reveal as="h2" style={{ ...h2Style, fontSize: 'clamp(22px,2.6vw,32px)' }}>
              Új generációs szelfigép — mesterséges intelligenciával
            </Reveal>
            <Reveal as="p" delay={60} style={{ fontSize: 16.5, lineHeight: 1.65, color: '#46433A', maxWidth: '78ch', marginTop: 16 }}>
              Az AI Selfiemata a hagyományos szelfigép és fotóautomata következő generációja. Ha fotós
              rendezvényprogramot vagy egyedi AI-rendezvényélményt keresel — esküvőre, céges bulira, gálára
              vagy csapatépítőre —, ez az élményállomás garantáltan a rendezvény legemlékezetesebb eleme
              lesz. Nem sablon, nem nyomtatott fotó: valós idejű AI-képgenerálás, ami minden vendégből
              főszereplőt csinál. Az AI-transzformáció teremt igazán megosztásra érdemes pillanatot —
              rendezvényenként, vendégenként, egyedileg.
            </Reveal>
          </div>
        </section>

        <ContactCTA />
        <Footer />
      </main>
    </div>
  )
}
