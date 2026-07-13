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

/** the ai.elmeny.hu hero's style switcher: the "after" side of the portrait
 *  slider swaps to the picked AI style */
const STYLES = [
  { key: 'uhajos', label: 'Űrhajós', src: '/assets/photos/ai/hero-uhajos-full.jpg' },
  { key: 'festmeny', label: 'Festmény', src: '/assets/photos/ai/hero-festmeny-full.jpg' },
  { key: 'karikatura', label: 'Karikatúra', src: '/assets/photos/ai/hero-karikatura-full.jpg' },
  { key: 'extrem', label: 'Extrém', src: '/assets/photos/ai/hero-extrem-full.jpg' },
  { key: 'pixar', label: 'Pixar', src: '/assets/photos/ai/hero-pixar-full.jpg' },
]

/** ported 1:1 from the original landing's dark "Miért most? Miért AI?" */
const WHY = [
  {
    title: 'A vendégek AI élményt várnak',
    body: 'Az okostelefon már nem elég. Az emberek valami olyat akarnak, amit otthon nem tudnak könnyen megcsinálni.',
  },
  {
    title: 'Organikus viral tartalom',
    body: 'Egy egyedi AI kép 3× nagyobb valószínűséggel kerül ki social médiára, mint egy hagyományos fotó.',
  },
  {
    title: 'Brand aktiváció új szinten',
    body: 'Az AI kimenet brandingelhető – minden megosztott kép a te logóddal, a te rendezvényed nevével megy ki.',
  },
]

/** the original image-backed style cards */
const STYLE_CARDS = [
  { img: 'masterpiece', name: 'Masterpiece', desc: 'Van Gogh, Klimt, Pop Art' },
  { img: 'epicscene', name: 'Epic Scene', desc: 'F1, viking, űrhajós' },
  { img: 'karikatura', name: 'Karikatúra', desc: 'Vicces AI torzítás' },
  { img: 'pixar', name: 'Pixar Mode', desc: '3D animációs karakter' },
  { img: 'anime', name: 'Anime', desc: 'Japán animációs portré' },
  { img: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon city, 2076' },
  { img: 'kocka', name: 'Kocka', desc: 'Építőkocka-figura stílus' },
]

const STEPS = [
  { title: 'Stílus', body: 'A vendég választ a rendezvényre tervezett AI stílusok közül.' },
  { title: 'Fotó', body: 'Az érintőképernyős automatával lefényképezi magát – ebben személyzet is segít neki.' },
  { title: 'AI varázsol', body: 'A felhőalapú AI 9–15 másodperc alatt újrarajzolja a képet.' },
  { title: 'Megosztás', body: 'QR-kóddal, emailen vagy nyomtatva átveszi – akár azonnal megosztja, brandingelt kerettel.' },
]

const CUSTOM = [
  { title: 'Esemény-koncepció', body: 'Közösen kitaláljuk, mi illik a rendezvényhez: téma, hangulat, üzenet.' },
  { title: 'AI vizuális világ', body: 'A stílusokat az eseményedre tervezzük — céges party, csapatépítő, promóció, családi nap, esküvő.' },
  { title: 'Brand-integráció', body: 'Logó, keret, esemény-arculat minden kimenő képen.' },
  { title: 'Egyedi prompt-rendszer', body: 'Nem sablon: a képi világot promptszinten szabjuk a briefedre.' },
]

/**
 * AI Selfiemata a fő domainen — a zászlóshajó oldala, szándékosan
 * látványosabb a többi aloldalnál: az eredeti ai.elmeny.hu sötét
 * „Miért AI" szekciója és képes stíluskártya-sávja portolva, álló
 * (portré) előtte-utána heróval és merészebb beúszásokkal.
 */
export function AiPage() {
  const { scrolled } = useScene()
  const [style, setStyle] = useState(STYLES[0])

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'clip', background: '#F6F1E9' }}>
      <CursorFX />
      <Nav scrolled={scrolled} base="/" />
      <main>
        {/* hero: copy + portrait style-switching before/after */}
        <header
          style={{
            position: 'relative',
            padding: 'clamp(140px,16.5vw,188px) clamp(24px,6vw,90px) clamp(40px,5vw,70px)',
          }}
        >
          <Doodle n={2} color="rgba(0,0,0,.05)" size={110} right="4%" top="10%" anim="float" duration={9} rotate="8deg" />
          <Doodle n={5} color="rgba(0,0,0,.04)" size={84} left="3%" bottom="6%" anim="float2" duration={11} rotate="-6deg" />
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
                variant="pop"
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
                egyedi, megosztható, brandingelt emlék, pár másodperc alatt.
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
              <Reveal variant="mask" radius={24} style={{ maxWidth: 440, margin: '0 auto' }}>
                <BeforeAfter
                  before="/assets/photos/ai/hero-before-full.jpg"
                  after={style.src}
                  beforeLabel="Eredeti"
                  afterLabel={`AI ✦ ${style.label}`}
                  beforeAlt="Eredeti vendégfotó az AI Selfiemata automatából"
                  afterAlt={`Az AI Selfiemata által generált ${style.label.toLowerCase()} stílusú változat ugyanarról a vendégről`}
                  style={{ width: '100%', aspectRatio: '3 / 4' }}
                />
              </Reveal>
              {/* style pills — swap the slider's AI side */}
              <Reveal delay={140} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, justifyContent: 'center' }}>
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

        {/* Miért most? Miért AI? — the original dark section, 1:1 */}
        <section style={{ position: 'relative', background: '#1C1917', padding: 'clamp(70px,9vw,100px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal
              as="p"
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: '#4ade80',
                marginBottom: 24,
              }}
            >
              Miért most? Miért AI?
            </Reveal>
            <Reveal
              as="h2"
              variant="pop"
              style={{
                fontFamily: 'Syne',
                fontWeight: 600,
                fontSize: 'clamp(32px,4.5vw,56px)',
                color: '#fff',
                lineHeight: 1.08,
                letterSpacing: '-.03em',
                maxWidth: 700,
              }}
            >
              A rendezvényipar <span style={{ color: '#4ade80' }}>legnagyobb trendje</span> 2026-ban
              az AI élmény.
            </Reveal>
            <div className="ep-scatter">
              {WHY.map((w, i) => (
                <Reveal
                  key={w.title}
                  variant={i % 2 ? 'right' : 'left'}
                  delay={i * 120}
                  className={`ep-scatter-item ep-si-${i + 1}`}
                >
                  <span className="ep-scatter-num" style={{ color: '#4ade80' }} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 style={{ color: '#fff' }}>{w.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,.62)' }}>{w.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AI stílusok — the original image card track */}
        <section style={{ position: 'relative', padding: 'clamp(70px,9vw,100px) 0 clamp(40px,5vw,60px)', overflow: 'hidden' }}>
          <div style={{ ...wrap, padding: '0 clamp(24px,6vw,90px)', maxWidth: 1180 + 180 }}>
            <Reveal
              as="p"
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#FF6B35' }}
            >
              AI stílusok
            </Reveal>
            <Reveal
              as="h2"
              variant="pop"
              delay={60}
              style={{ ...h2Style, fontSize: 'clamp(30px,4vw,52px)', marginTop: 14 }}
            >
              Nem filter. Nem sablon.
              <br />
              Minden kép <span style={{ color: '#FF6B35' }}>egyedi alkotás.</span>
            </Reveal>
            <Reveal delay={120}>
              <div className="ep-strack">
                {STYLE_CARDS.map((c) => (
                  <div key={c.img} className="ep-scard">
                    <div
                      className="ep-scard-bg"
                      role="img"
                      aria-label={`AI Selfiemata ${c.name} stílusminta: ${c.desc}`}
                      style={{ backgroundImage: `url(/assets/photos/ai/style-${c.img}.jpg)` }}
                    />
                    <div className="ep-scard-info">
                      <h3>{c.name}</h3>
                      <p>{c.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="ep-scard-more">
                  <span className="ep-plus" aria-hidden="true">
                    +
                  </span>
                  <span>
                    Egyedi
                    <br />
                    kérésre
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160} style={{ textAlign: 'center', marginTop: 18 }}>
              <Magnetic strength={6}>
                <a
                  href="#kapcsolat"
                  style={{
                    display: 'inline-block',
                    background: '#17150D',
                    color: '#F6F1E9',
                    fontWeight: 600,
                    fontSize: 16,
                    padding: '14px 28px',
                    borderRadius: 100,
                  }}
                >
                  Ajánlatot kérek →
                </a>
              </Magnetic>
            </Reveal>
          </div>
        </section>

        {/* Hogyan működik — scattered numbers, light */}
        <section style={{ position: 'relative', padding: 'clamp(50px,7vw,80px) clamp(24px,6vw,90px)' }}>
          <Doodle n={4} color="rgba(0,0,0,.045)" size={72} right="6%" top="10%" anim="sway" duration={10} rotate="6deg" />
          <div style={wrap}>
            <Reveal
              as="p"
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#4888F8' }}
            >
              Hogyan működik?
            </Reveal>
            <Reveal as="h2" variant="pop" delay={60} style={{ ...h2Style, fontSize: 'clamp(30px,4vw,52px)', marginTop: 14 }}>
              4 lépés.
              <br />
              10 másodperc.
            </Reveal>
            <div className="ep-scatter">
              {STEPS.map((s, i) => (
                <Reveal
                  key={s.title}
                  variant={i % 2 ? 'right' : 'left'}
                  delay={i * 100}
                  className={`ep-scatter-item ep-si-${i + 1}`}
                >
                  <span className="ep-scatter-num" style={{ color: '#4888F8' }} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 style={{ color: '#17150D' }}>{s.title}</h3>
                    <p style={{ color: '#46433A' }}>{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Személyre szabás */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
            <div>
              <Reveal as="h2" variant="pop" style={h2Style}>
                Nem sablon. Teljesen rád szabjuk.
              </Reveal>
              <div style={{ display: 'grid', gap: '12px 0', marginTop: 26 }}>
                {CUSTOM.map((c, i) => (
                  <Reveal key={c.title} variant="left" delay={i * 70} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span aria-hidden="true" style={{ color: '#9B6BF2', fontWeight: 700, fontSize: 18, lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: 16, lineHeight: 1.55, color: '#46433A' }}>
                      <strong style={{ color: '#17150D' }}>{c.title}:</strong> {c.body}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal variant="pop" delay={150} style={{ background: '#FBF8F3', border: '1px solid rgba(0,0,0,.12)', borderRadius: 18, padding: '26px 28px' }}>
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
            <Reveal variant="mask" radius={28} style={{ background: '#17150D', borderRadius: 28, padding: 'clamp(32px,4.5vw,58px)', color: '#F6F1E9' }}>
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

        {/* SEO-záró bekezdés — tight bottom: the quote form follows right after */}
        <section style={{ position: 'relative', padding: 'clamp(24px,3vw,40px) clamp(24px,6vw,90px) clamp(20px,2.5vw,36px)' }}>
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
