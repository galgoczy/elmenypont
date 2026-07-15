import { useState } from 'react'
import { useT } from '../i18n'
import { Reveal } from './Reveal'
import { Doodle } from './Doodle'

/** the shared FAQ — answers confirmed by the client */
const FAQ: { q: string; a: string; qEn: string; aEn: string }[] = [
  {
    q: 'Mennyi helyet igényel egy automata?',
    a: 'Kompakt: kb. 3×2 méter kényelmesen elég. A greenbox stúdióhoz — háttérrel együtt — kb. 3×3 méter az ajánlott.',
    qEn: 'How much space does a booth need?',
    aEn: "It's compact: roughly 3×2 metres is comfortably enough. For the greenbox studio — backdrop included — we recommend about 3×3 metres.",
  },
  {
    q: 'Mi kell a helyszíntől?',
    a: 'Egy szabványos 230V-os konnektor és stabil helyszíni internet. Ha nincs net a helyszínen, saját mobilnetes megoldást viszünk.',
    qEn: 'What do you need from the venue?',
    aEn: 'A standard 230V socket and stable on-site internet. If there’s no connection at the venue, we bring our own mobile-internet solution.',
  },
  {
    q: 'Mennyi idő a telepítés?',
    a: 'A rendezvény kezdete előtt kb. 1 órával érkezünk; az építés és a bontás egyaránt kb. 30 perc.',
    qEn: 'How long does setup take?',
    aEn: 'We arrive about 1 hour before the event starts; both setup and teardown take roughly 30 minutes each.',
  },
  {
    q: 'Hová kerülnek a képek?',
    a: 'A vendég azonnal megkapja QR-kóddal, e-mailben vagy nyomtatva. A képek igény szerint privát online galériába kerülhetnek, harmadik félnek nem adjuk át, és a rendezvény után kérésre töröljük őket.',
    qEn: 'Where do the photos end up?',
    aEn: 'Guests get them instantly via QR code, email or printed. On request the photos can go into a private online gallery; we never share them with third parties, and we delete them after the event if you ask.',
  },
  {
    q: 'Hány vendéget bír el?',
    a: 'Óránként kb. 70–100 fotó. Nagyobb létszámra több gépet vagy hosszabb időtartamot ajánlunk.',
    qEn: 'How many guests can it handle?',
    aEn: 'About 70–100 photos per hour. For larger crowds we recommend more machines or a longer rental.',
  },
  {
    q: 'Mennyibe kerül?',
    a: '4 órás budapesti kitelepüléssel: sima fotóautomata és Greenbox 80 000 Ft-tól, AI Selfiemata 105 000 Ft-tól (nettó), a nyomatcsomag 20 000 Ft-tól. Minden megkeresésre gyorsan, 24 órán belül egyedi ajánlatot adunk.',
    qEn: 'How much does it cost?',
    aEn: 'For a 4-hour Budapest booking: a standard photo booth and Greenbox from 80,000 HUF, AI Selfiemata from 105,000 HUF (net), and the print package from 20,000 HUF. We send a tailored quote for every enquiry fast — within 24 hours.',
  },
  {
    q: 'Adtok személyzetet is?',
    a: 'Igen, minden kitelepüléshez animátor / kezelő tartozik, aki végig segíti a vendégeket.',
    qEn: 'Do you provide staff too?',
    aEn: 'Yes — every booking comes with a host / operator who helps your guests throughout.',
  },
  {
    q: 'Hányféle stílust kérhetünk?',
    a: 'Nincs meghatározva. Tapasztalatból 3–5 stílust javaslunk — ennyiből választ kényelmesen a vendég.',
    qEn: 'How many styles can we request?',
    aEn: 'There’s no fixed limit. From experience we suggest 3–5 styles — enough for guests to choose from comfortably.',
  },
  {
    q: 'Kérhetünk egyedi képvilágot vagy hátteret?',
    a: 'Hogyne — minden eseményre egyedi anyaggal készülünk, a rendezvény arculatához igazítva.',
    qEn: 'Can we ask for a custom look or backdrop?',
    aEn: 'Of course — we prepare bespoke visuals for every event, matched to your event’s branding.',
  },
  {
    q: 'Nincs ötletünk — olyankor mi van?',
    a: '10+ év rutinból mindig tudunk kreatív ötleteket javasolni. Keressetek bátran!',
    qEn: 'We’re out of ideas — what then?',
    aEn: 'With 10+ years of experience we can always suggest creative ideas. Just reach out!',
  },
  {
    q: 'Bizonytalanok vagyunk még a rendezvény paramétereiben, tudtok segíteni?',
    a: 'Természetesen — évtizedes tapasztalattal akár ötlettel, akár (bizonytalan paraméterek esetén) nagyságrendi árral szívesen segítünk.',
    qEn: 'We’re still unsure about the event details — can you help?',
    aEn: 'Absolutely — with a decade of experience we’re happy to help with ideas, or (when details are still up in the air) a ballpark price.',
  },
]

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

/**
 * GYIK — accordion with FAQPage JSON-LD (rendered into the static HTML by
 * the prerender step, so search/AI systems get the Q&A pairs). One item is
 * open by default; the rest expand on click.
 */
export function Faq({ schema = true }: { schema?: boolean }) {
  const [open, setOpen] = useState(0)
  const t = useT()

  return (
    <section
      id="gyik"
      className="ep-deco"
      style={{
        position: 'relative',
        background: '#F6F1E9',
        padding: 'clamp(50px,7vw,90px) clamp(24px,6vw,90px)',
        scrollMarginTop: '80px',
      }}
    >
      <Doodle n={3} color="rgba(0,0,0,.05)" size={80} right="5%" top="12%" anim="float2" duration={9} rotate="7deg" />
      {/* one canonical FAQPage entity — emitted on the home page only to
          avoid duplicate structured data across routes */}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />
      )}
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <Reveal
          as="p"
          style={{ fontSize: 14, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#E94A35', marginBottom: 14 }}
        >
          {t('Gyakori kérdések', 'Frequently asked questions')}
        </Reveal>
        <Reveal
          as="h2"
          style={{
            fontFamily: 'Syne',
            fontWeight: 500,
            fontSize: 'clamp(28px,3.8vw,48px)',
            lineHeight: 1.05,
            letterSpacing: '-.03em',
            color: '#17150D',
            marginBottom: 'clamp(28px,4vw,44px)',
          }}
        >
          {t('Amit a leggyakrabban kérdeznek', 'The things people ask us most')}
        </Reveal>
        <div>
          {FAQ.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={Math.min(i * 40, 200)} style={{ borderTop: '1px solid rgba(0,0,0,.12)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '20px 4px',
                    fontFamily: 'inherit',
                    color: '#17150D',
                  }}
                >
                  <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: 'clamp(17px,1.9vw,20px)', letterSpacing: '-.01em' }}>
                    {t(f.q, f.qEn)}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 'none',
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(0,0,0,.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      color: '#E94A35',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform .25s',
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows .3s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#46433A', padding: '0 4px 22px', maxWidth: '68ch' }}>
                      {t(f.a, f.aEn)}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
