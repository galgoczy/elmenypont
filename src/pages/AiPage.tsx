import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useScene } from '../hooks/useScene'
import { CursorFX } from '../components/CursorFX'
import { Nav } from '../components/Nav'
import { Reveal } from '../components/Reveal'
import { Doodle } from '../components/Doodle'
import { Magnetic } from '../components/Magnetic'
import { BeforeAfter } from '../components/BeforeAfter'
import { RocketTrail, ScrollTrail } from '../components/RocketTrail'
import { Faq } from '../components/Faq'
import { ContactCTA } from '../components/ContactCTA'
import { track } from '../components/CookieBar'
import { Footer } from '../components/Footer'
import { Kiosk3D } from '../components/Hero'
import { useT, useLang } from '../i18n'

/** serpentine that STARTS at the 01 point (top-left), curves down to 02
 *  (mid-right), then to 03 (lower-left), then descends to land */
const WHY_TRAIL = 'M10 14 C 18 26, 44 32, 44 46 C 44 60, 20 66, 22 80 C 23 90, 34 97, 42 104'
/** dotted connector through the how-steps (01 → 02 → 03 → 04) */
const HOW_TRAIL = 'M6 8 C 12 18, 32 24, 42 34 C 50 41, 42 48, 32 53 C 22 58, 16 60, 18 68 C 20 78, 38 82, 52 88'

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
  { key: 'uhajos', label: 'Űrhajós', labelEn: 'Astronaut', src: '/assets/photos/ai/hero-uhajos-full.jpg' },
  { key: 'festmeny', label: 'Festmény', labelEn: 'Painting', src: '/assets/photos/ai/hero-festmeny-full.jpg' },
  { key: 'karikatura', label: 'Karikatúra', labelEn: 'Caricature', src: '/assets/photos/ai/hero-karikatura-full.jpg' },
  { key: 'extrem', label: 'Extrém', labelEn: 'Extreme', src: '/assets/photos/ai/hero-extrem-full.jpg' },
]

/** ported 1:1 from the original landing's dark "Miért most? Miért AI?" */
const WHY = [
  {
    title: 'A vendégek AI élményt várnak',
    titleEn: 'Guests expect an AI experience',
    body: 'Az okostelefon már nem elég. Az emberek valami olyat akarnak, amit otthon nem tudnak könnyen megcsinálni.',
    bodyEn: 'A smartphone just isn’t enough anymore. People want something they can’t easily make at home.',
  },
  {
    title: 'Organikus viral tartalom',
    titleEn: 'Organic viral content',
    body: 'Egy egyedi AI kép 3× nagyobb valószínűséggel kerül ki social médiára, mint egy hagyományos fotó.',
    bodyEn: 'A one-of-a-kind AI image is 3× more likely to land on social media than a traditional photo.',
  },
  {
    title: 'Brand aktiváció új szinten',
    titleEn: 'Brand activation on a new level',
    body: 'Az AI kimenet brandingelhető – minden megosztott kép a te logóddal, a te rendezvényed nevével megy ki.',
    bodyEn: 'The AI output is fully brandable – every shared image goes out with your logo and your event’s name.',
  },
]

/** the original image-backed style cards */
const STYLE_CARDS = [
  { img: 'masterpiece', name: 'Masterpiece', nameEn: 'Masterpiece', desc: 'Van Gogh, Klimt, Pop Art', descEn: 'Van Gogh, Klimt, Pop Art' },
  { img: 'epicscene', name: 'Epic Scene', nameEn: 'Epic Scene', desc: 'F1, viking, űrhajós', descEn: 'F1, viking, astronaut' },
  { img: 'karikatura', name: 'Karikatúra', nameEn: 'Caricature', desc: 'Vicces AI torzítás', descEn: 'Playful AI distortion' },
  { img: 'pixar', name: 'Pixar Mode', nameEn: 'Pixar Mode', desc: '3D animációs karakter', descEn: '3D animated character' },
  { img: 'anime', name: 'Anime', nameEn: 'Anime', desc: 'Japán animációs portré', descEn: 'Japanese animation portrait' },
  { img: 'cyberpunk', name: 'Cyberpunk', nameEn: 'Cyberpunk', desc: 'Neon city, 2076', descEn: 'Neon city, 2076' },
  { img: 'kocka', name: 'Kocka', nameEn: 'Brick', desc: 'Építőkocka-figura stílus', descEn: 'Building-block figure style' },
]

const STEPS = [
  { title: 'Stílus', titleEn: 'Style', body: 'A vendég választ a rendezvényre tervezett AI stílusok közül.', bodyEn: 'The guest picks from the AI styles designed for your event.', doodle: 5, dur: 3.2 },
  { title: 'Fotó', titleEn: 'Photo', body: 'Az érintőképernyős automatával lefényképezi magát – ebben személyzet is segít neki.', bodyEn: 'They snap a photo of themselves on the touchscreen booth – with staff on hand to help.', doodle: 2, dur: 3.8 },
  { title: 'AI varázsol', titleEn: 'AI works its magic', body: 'A felhőalapú AI 9–15 másodperc alatt újrarajzolja a képet.', bodyEn: 'The cloud-based AI redraws the image in 9–15 seconds.', doodle: 6, dur: 3.4 },
  { title: 'Megosztás', titleEn: 'Share', body: 'QR-kóddal, emailen vagy nyomtatva átveszi – akár azonnal megosztja, brandingelt kerettel.', bodyEn: 'They grab it via QR code, email or print – and can share it instantly, in a branded frame.', doodle: 3, dur: 4 },
]

const CUSTOM = [
  { title: 'Esemény-koncepció', titleEn: 'Event concept', body: 'Közösen kitaláljuk, mi illik a rendezvényhez: téma, hangulat, üzenet.', bodyEn: 'Together we figure out what fits your event: theme, mood, message.' },
  { title: 'AI vizuális világ', titleEn: 'AI visual world', body: 'A stílusokat az eseményedre tervezzük — céges party, csapatépítő, promóció, családi nap, esküvő.', bodyEn: 'We design the styles for your event — company party, team-building, promo, family day, wedding.' },
  { title: 'Brand-integráció', titleEn: 'Brand integration', body: 'Logó, keret, esemény-arculat minden kimenő képen.', bodyEn: 'Logo, frame and event identity on every image that goes out.' },
  { title: 'Egyedi prompt-rendszer', titleEn: 'Custom prompt system', body: 'Nem sablon: a képi világot promptszinten szabjuk a briefedre.', bodyEn: 'No templates: we tailor the visual world to your brief at the prompt level.' },
]

/**
 * AI Selfiemata a fő domainen — a zászlóshajó oldala, szándékosan
 * látványosabb a többi aloldalnál: az eredeti ai.elmeny.hu sötét
 * „Miért AI" szekciója és képes stíluskártya-sávja portolva, álló
 * (portré) előtte-utána heróval és merészebb beúszásokkal.
 */
export function AiPage() {
  const t = useT()
  const lang = useLang()

  // "Miért most?" background kiosk: spins in as the section scrolls up into
  // view (0 → 1), then holds — mirrors the home hero's entrance.
  const whyRef = useRef<HTMLElement>(null)
  const [whyTurn, setWhyTurn] = useState(0)
  useEffect(() => {
    const el = whyRef.current
    if (!el) return
    let raf = 0
    const compute = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const winH = window.innerHeight || 1
      // 0 when the section top sits at the viewport bottom, 1 once it has
      // risen a bit further; clamped so it holds afterwards. The tighter the
      // divisor, the fewer pixels the full turn takes — ~20% faster here.
      setWhyTurn(Math.min(1, Math.max(0, (winH - r.top) / (winH * 0.708))))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    compute()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  const { scrolled } = useScene()
  const [style, setStyle] = useState(STYLES[0])

  // demo request mini-form state
  const [demoState, setDemoState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const demoSubmit = async (form: HTMLFormElement) => {
    setDemoState('sending')
    try {
      const email = new FormData(form).get('demoEmail')
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      })
      const json = await res.json().catch(() => ({ ok: false }))
      if (!res.ok || !json.ok) throw new Error()
      track('demo_request')
      setDemoState('ok')
      form.reset()
    } catch {
      setDemoState('err')
    }
  }

  // the style track drifts sideways on its own; any hover/touch pauses it,
  // and at the ends it gently turns back (ping-pong)
  const trackRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let raf = 0
    let dir = 1
    let paused = false
    let last = performance.now()
    // float accumulator: scrollLeft floors fractional writes, so per-frame
    // sub-pixel increments would round away to nothing
    let pos = el.scrollLeft
    const pause = () => {
      paused = true
    }
    const resume = () => {
      paused = false
      pos = el.scrollLeft // pick up wherever the user left the track
    }
    el.addEventListener('pointerenter', pause)
    el.addEventListener('pointerleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume)
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(50, now - last)
      last = now
      if (paused) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 2) return
      pos = Math.min(max, Math.max(0, pos + dir * 0.022 * dt))
      el.scrollLeft = pos
      if (pos >= max - 1) dir = -1
      else if (pos <= 1) dir = 1
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', pause)
      el.removeEventListener('pointerleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
    }
  }, [])

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
          {/* alignItems start: the portrait slider is much taller than the
              other subpages' media, so centering pushed the copy down —
              top-aligning puts the H1 exactly where the siblings have it */}
          <div className="ep-svc-hero" style={{ ...wrap, alignItems: 'start' }}>
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
                {t('AI Selfiemata · #1 rendezvénytrend 2026', 'AI Selfiemata · #1 event trend of 2026')}
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
                {t('A fotóautomata újraírva —', 'The photo booth, reinvented —')}{' '}
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
                {t(
                  'Valós idejű AI-kép fotóautomata rendezvényeken: a vendégekről készült fotót az AI átvarázsolja — egyedi, megosztható, brandingelt emlék, pár másodperc alatt.',
                  'A real-time AI-image photo booth for events: AI transforms the photo taken of your guests — a unique, shareable, branded memory in just a few seconds.',
                )}
              </Reveal>
              <Reveal className="ep-ai-stats" delay={150} style={{ display: 'flex', gap: 22, marginTop: 26, flexWrap: 'wrap' }}>
                {[
                  { v: '9–15 mp', vEn: '9–15 s', l: 'AI generálás', lEn: 'AI generation', c: '#9B6BF2' },
                  { v: '∞ stílus', vEn: '∞ styles', l: 'választható téma', lEn: 'themes to choose from', c: '#48D880' },
                  { v: '100%', vEn: '100%', l: 'rendezvényre szabva', lEn: 'tailored to your event', c: '#E94A35' },
                ].map((s) => (
                  <div className="ep-ai-stat" key={s.l}>
                    <div className="ep-ai-stat-v" style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 24, color: s.c, lineHeight: 1 }}>{t(s.v, s.vEn)}</div>
                    <div className="ep-ai-stat-l" style={{ fontSize: 13, color: '#7A766B', marginTop: 3 }}>{t(s.l, s.lEn)}</div>
                  </div>
                ))}
              </Reveal>
              <Reveal className="ep-ai-cta" delay={200} style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 30, flexWrap: 'wrap' }}>
                <Magnetic strength={7}>
                  <a
                    href="#kapcsolat"
                    className="ep-ai-cta-btn"
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
                    {t('Kérj ajánlatot', 'Get a quote')} →
                  </a>
                </Magnetic>
                <Magnetic strength={6}>
                  <a
                    href="#bemutato"
                    className="ep-ai-cta-btn"
                    style={{
                      display: 'inline-block',
                      background: '#4888F8',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 17,
                      padding: '15px 28px',
                      borderRadius: 100,
                    }}
                  >
                    {t('Bemutatót kérek', 'Request a demo')} →
                  </a>
                </Magnetic>
              </Reveal>
            </div>
            <div>
              <Reveal variant="mask" radius={24} style={{ maxWidth: 440, margin: '0 auto' }}>
                <BeforeAfter
                  before="/assets/photos/ai/hero-before-full.jpg"
                  after={style.src}
                  beforeLabel={t('Eredeti', 'Original')}
                  afterLabel={`AI ✦ ${t(style.label, style.labelEn)}`}
                  beforeAlt={t('Eredeti vendégfotó az AI Selfiemata automatából', 'Original guest photo from the AI Selfiemata booth')}
                  afterAlt={t(
                    `Az AI Selfiemata által generált ${style.label.toLowerCase()} stílusú változat ugyanarról a vendégről`,
                    `The ${style.labelEn.toLowerCase()}-style version of the same guest, generated by AI Selfiemata`,
                  )}
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
                      {t(s.label, s.labelEn)}
                    </button>
                  )
                })}
                {/* non-clickable "Egyedi" pill — signals fully custom styles,
                    dashed outline to set it apart from the selectable ones */}
                <span
                  aria-label={t('Egyedi stílus – kérésre bármilyen téma', 'Custom style – any theme on request')}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    fontWeight: 600,
                    padding: '8px 15px',
                    borderRadius: 100,
                    border: '1.5px dashed rgba(0,0,0,.22)',
                    background: 'transparent',
                    color: '#9A968C',
                  }}
                >
                  {t('Egyedi', 'Custom')}
                </span>
              </Reveal>
            </div>
          </div>
        </header>

        {/* Miért most? Miért AI? — the original dark section, 1:1, with the
            home page's rocket flying point to point and landing at the end */}
        <section
          ref={whyRef}
          data-rockethome
          style={{ position: 'relative', background: '#1C1917', padding: 'clamp(70px,9vw,100px) clamp(24px,6vw,90px) clamp(100px,13vw,150px)', overflow: 'hidden' }}
        >
          {/* faint home-hero kiosk in the background right: spins in with
              scroll (like the home entrance), base cropped, then just stays */}
          <div
            aria-hidden="true"
            className="ep-why-kiosk"
            style={{
              position: 'absolute',
              top: 'clamp(30px,7vw,90px)',
              right: 'clamp(-110px,-3vw,-30px)',
              width: 340,
              height: 560,
              overflow: 'hidden',
              perspective: '1500px',
              opacity: 0.22,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 52,
                marginLeft: -150,
                transformOrigin: 'top center',
                transform: `rotateX(6deg) rotateY(${(-360 * (whyTurn * whyTurn * (3 - 2 * whyTurn))).toFixed(2)}deg) scale(0.72)`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <Kiosk3D turn={whyTurn * whyTurn * (3 - 2 * whyTurn)} photo1On={0} photoOn={0} screenFlash={0} />
            </div>
          </div>
          <div style={{ ...wrap, position: 'relative', zIndex: 1 }}>
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
              {t('Miért most? Miért AI?', 'Why now? Why AI?')}
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
              {t('A rendezvényipar', 'The events industry’s')}{' '}
              <span style={{ color: '#4ade80' }}>{t('legnagyobb trendje', 'biggest trend')}</span>{' '}
              {t('2026-ban az AI élmény.', 'in 2026 is the AI experience.')}
            </Reveal>
            <div style={{ position: 'relative' }}>
              <RocketTrail trail={WHY_TRAIL} color="#4ade80" />
              <div className="ep-scatter" style={{ position: 'relative', zIndex: 1 }}>
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
                      <h3 style={{ color: '#fff' }}>{t(w.title, w.titleEn)}</h3>
                      <p style={{ color: 'rgba(255,255,255,.62)' }}>{t(w.body, w.bodyEn)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
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
              {t('AI stílusok', 'AI styles')}
            </Reveal>
            <Reveal
              as="h2"
              variant="pop"
              delay={60}
              style={{ ...h2Style, fontSize: 'clamp(30px,4vw,52px)', marginTop: 14 }}
            >
              {t('Nem filter. Nem sablon.', 'Not a filter. Not a template.')}
              <br />
              {t('Minden kép', 'Every image is a')} <span style={{ color: '#FF6B35' }}>{t('egyedi alkotás.', 'unique creation.')}</span>
            </Reveal>
            <Reveal delay={120}>
              <div className="ep-strack" ref={trackRef}>
                {STYLE_CARDS.map((c) => (
                  <div key={c.img} className="ep-scard">
                    <div
                      className="ep-scard-bg"
                      role="img"
                      aria-label={t(`AI Selfiemata ${c.name} stílusminta: ${c.desc}`, `AI Selfiemata ${c.nameEn} style sample: ${c.descEn}`)}
                      style={{ backgroundImage: `url(/assets/photos/ai/style-${c.img}.jpg)` }}
                    />
                    <div className="ep-scard-info">
                      <h3>{t(c.name, c.nameEn)}</h3>
                      <p>{t(c.desc, c.descEn)}</p>
                    </div>
                  </div>
                ))}
                <div className="ep-scard-more">
                  <span className="ep-plus" aria-hidden="true">
                    +
                  </span>
                  <span>
                    {t('Egyedi', 'Custom')}
                    <br />
                    {t('kérésre', 'on request')}
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
                  {t('Ajánlatot kérek', 'Get a quote')} →
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
              {t('Hogyan működik?', 'How it works?')}
            </Reveal>
            <Reveal as="h2" variant="pop" delay={60} style={{ ...h2Style, fontSize: 'clamp(30px,4vw,52px)', marginTop: 14 }}>
              {t('4 lépés.', '4 steps.')}
              <br />
              {t('10 másodperc.', '10 seconds.')}
            </Reveal>
            <div style={{ position: 'relative' }}>
              {/* the original landing's dotted connector: draws itself from
                  point to point as the scroll reaches them */}
              <ScrollTrail trail={HOW_TRAIL} color="#4888F8" />
              <div className="ep-scatter" style={{ position: 'relative', zIndex: 1 }}>
                {STEPS.map((s, i) => (
                  <Reveal
                    key={s.title}
                    variant={i % 2 ? 'right' : 'left'}
                    delay={i * 100}
                    className={`ep-scatter-item ep-si-${i + 1}`}
                    style={{ position: 'relative' }}
                  >
                    {/* playful doodle wiggling next to each step */}
                    <Doodle
                      n={s.doodle}
                      color="rgba(72,136,248,.32)"
                      size={48}
                      anim="wiggle"
                      duration={s.dur}
                      parallax={12}
                      style={{ top: -14, right: -8 }}
                    />
                    <span className="ep-scatter-num" style={{ color: '#4888F8' }} aria-hidden="true">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 style={{ color: '#17150D' }}>{t(s.title, s.titleEn)}</h3>
                      <p style={{ color: '#46433A' }}>{t(s.body, s.bodyEn)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* demo request: leave an email, the demo link + password arrives */}
            <Reveal variant="pop" delay={100} style={{ marginTop: 'clamp(36px,5vw,56px)' }}>
              <div
                id="bemutato"
                style={{
                  scrollMarginTop: '90px',
                  background: '#FBF8F3',
                  border: '1px solid rgba(0,0,0,.12)',
                  borderRadius: 20,
                  padding: 'clamp(24px,3vw,36px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'clamp(16px,3vw,32px)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 22, color: '#17150D' }}>
                    {t('Kérek bemutatót!', 'Request a demo!')}
                  </h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.55, color: '#46433A', marginTop: 8 }}>
                    {t(
                      'Add meg az e-mail-címed, és azonnal küldjük az élő demó linkjét és jelszavát — kipróbálhatod, mielőtt ajánlatot kérsz.',
                      'Drop your email and we’ll send the live demo link and password right away — try it out before you request a quote.',
                    )}
                  </p>
                </div>
                {demoState === 'ok' ? (
                  <p style={{ fontSize: 15.5, fontWeight: 600, color: '#2FB268' }}>
                    {t('✅ Elküldtük! Nézd meg a postafiókod.', '✅ Sent! Check your inbox.')}
                  </p>
                ) : (
                  <form
                    method="post"
                    action="/api/demo"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (demoState !== 'sending') void demoSubmit(e.currentTarget)
                    }}
                    style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: '1 1 340px', justifyContent: 'flex-end' }}
                  >
                    <input
                      type="email"
                      name="demoEmail"
                      required
                      placeholder={t('E-mail címed', 'Your email')}
                      aria-label={t('E-mail cím a demóhoz', 'Email address for the demo')}
                      style={{
                        flex: '1 1 200px',
                        maxWidth: 300,
                        background: '#F6F1E9',
                        border: '1.5px solid rgba(0,0,0,.12)',
                        borderRadius: 100,
                        padding: '13px 20px',
                        fontSize: 15.5,
                        fontFamily: 'inherit',
                        color: '#17150D',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={demoState === 'sending'}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 15.5,
                        fontWeight: 600,
                        padding: '13px 24px',
                        borderRadius: 100,
                        border: 'none',
                        background: '#4888F8',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      {demoState === 'sending' ? t('Küldés…', 'Sending…') : `${t('Kérek bemutatót', 'Request a demo')} →`}
                    </button>
                    {demoState === 'err' && (
                      <p role="alert" style={{ width: '100%', textAlign: 'right', fontSize: 13.5, color: '#C6402E' }}>
                        {t('Nem sikerült — írj nekünk: hello@elmeny.hu', 'Something went wrong — email us: hello@elmeny.hu')}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Személyre szabás */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
            <div>
              <Reveal as="h2" variant="pop" style={h2Style}>
                {t('Nem sablon. Teljesen rád szabjuk.', 'No templates. Fully tailored to you.')}
              </Reveal>
              <div style={{ display: 'grid', gap: '12px 0', marginTop: 26 }}>
                {CUSTOM.map((c, i) => (
                  <Reveal key={c.title} variant="left" delay={i * 70} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span aria-hidden="true" style={{ color: '#9B6BF2', fontWeight: 700, fontSize: 18, lineHeight: 1.4 }}>✓</span>
                    <span style={{ fontSize: 16, lineHeight: 1.55, color: '#46433A' }}>
                      <strong style={{ color: '#17150D' }}>{t(c.title, c.titleEn)}:</strong> {t(c.body, c.bodyEn)}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal variant="pop" delay={150} style={{ background: '#FBF8F3', border: '1px solid rgba(0,0,0,.12)', borderRadius: 18, padding: '26px 28px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A766B' }}>
                {t('Példa brief', 'Sample brief')}
              </p>
              <dl style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.7, color: '#46433A' }}>
                <div><strong style={{ color: '#17150D' }}>{t('Rendezvény:', 'Event:')}</strong> {t('év végi céges gála, 200 fő', 'year-end company gala, 200 guests')}</div>
                <div><strong style={{ color: '#17150D' }}>{t('Stílus:', 'Style:')}</strong> {t('hollywoodi filmplakát, céges logóval', 'Hollywood movie poster, with company logo')}</div>
                <div><strong style={{ color: '#17150D' }}>{t('Kimenet:', 'Output:')}</strong> {t('digitális + opcionális nyomtatás', 'digital + optional print')}</div>
                <div><strong style={{ color: '#17150D' }}>{t('Időtartam:', 'Duration:')}</strong> {t('8 óra, Egerben', '8 hours, in Eger')}</div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Árak */}
        <section style={{ position: 'relative', padding: 'clamp(40px,5vw,70px) clamp(24px,6vw,90px)' }}>
          <div style={wrap}>
            <Reveal variant="mask" radius={28} style={{ background: '#17150D', borderRadius: 28, padding: 'clamp(32px,4.5vw,58px)', color: '#F6F1E9' }}>
              <h2 style={{ ...h2Style, color: '#F6F1E9' }}>{t('Árak', 'Pricing')}</h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'rgba(246,241,233,.78)', maxWidth: '62ch', marginTop: 16 }}>
                {t('A legkisebb egység: 4 órás kitelepülés Budapesten, online megosztással.', 'The smallest package: a 4-hour setup in Budapest, with online sharing.')}
              </p>
              <div style={{ marginTop: 30, borderTop: '1px solid rgba(246,241,233,.16)' }}>
                {[
                  { label: 'AI Selfiemata — 4 óra, Budapest, online megosztás', labelEn: 'AI Selfiemata — 4 hours, Budapest, online sharing', value: '105 000 Ft-tól', valueEn: 'from 105,000 HUF' },
                  { label: 'Nyomatcsomagok (10×15 cm papírkép)', labelEn: 'Print packages (10×15 cm paper photo)', value: '20 000 Ft-tól', valueEn: 'from 20,000 HUF' },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap', padding: '16px 0', borderBottom: '1px solid rgba(246,241,233,.16)' }}
                  >
                    <span style={{ fontSize: 16, color: 'rgba(246,241,233,.85)', maxWidth: '46ch' }}>{t(r.label, r.labelEn)}</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 'clamp(19px,2.2vw,24px)', color: '#9B6BF2' }}>{t(r.value, r.valueEn)}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(246,241,233,.55)', marginTop: 18 }}>
                {t(
                  'Az árak nettó árak. Mitől függ a pontos ár: időtartam · helyszín (Budapesten kívül kiszállás) · vendégszám és nyomatcsomag.',
                  'Prices are net. What the exact price depends on: duration · location (travel outside Budapest) · guest count and print package.',
                )}
              </p>
            </Reveal>
          </div>
        </section>

        {/* SEO-záró bekezdés — tight bottom: the quote form follows right after */}
        <section style={{ position: 'relative', padding: 'clamp(24px,3vw,40px) clamp(24px,6vw,90px) clamp(20px,2.5vw,36px)' }}>
          <div style={wrap}>
            <Reveal as="h2" style={{ ...h2Style, fontSize: 'clamp(22px,2.6vw,32px)' }}>
              {t('Új generációs szelfigép — mesterséges intelligenciával', 'Next-generation selfie machine — powered by artificial intelligence')}
            </Reveal>
            <Reveal as="p" delay={60} style={{ fontSize: 16.5, lineHeight: 1.65, color: '#46433A', maxWidth: '78ch', marginTop: 16 }}>
              {t(
                'Az AI Selfiemata a hagyományos szelfigép és fotóautomata következő generációja. Ha fotós rendezvényprogramot vagy egyedi AI-rendezvényélményt keresel — esküvőre, céges bulira, gálára vagy csapatépítőre —, ez az élményállomás garantáltan a rendezvény legemlékezetesebb eleme lesz. Nem sablon, nem nyomtatott fotó: valós idejű AI-képgenerálás, ami minden vendégből főszereplőt csinál. Az AI-transzformáció teremt igazán megosztásra érdemes pillanatot — rendezvényenként, vendégenként, egyedileg.',
                'The AI Selfiemata is the next generation of the classic selfie machine and photo booth. If you’re looking for a photo-based event activity or a one-of-a-kind AI event experience — for a wedding, company party, gala or team-building day — this experience station is guaranteed to be the most memorable part of your event. No templates, no printed photos: real-time AI image generation that turns every guest into the star. It’s the AI transformation that creates a truly share-worthy moment — event by event, guest by guest, uniquely.',
              )}
            </Reveal>
          </div>
        </section>

        <Faq schema={false} />
        <ContactCTA preselect={["AI Selfiemata"]} />
        <Footer />
      </main>
    </div>
  )
}
