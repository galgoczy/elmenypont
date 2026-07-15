import { useState } from 'react'
import { Reveal } from './Reveal'
import { Doodle } from './Doodle'

/** the shared FAQ — answers confirmed by the client */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Mennyi helyet igényel egy automata?',
    a: 'Kompakt: kb. 3×2 méter kényelmesen elég. A greenbox stúdióhoz — háttérrel együtt — kb. 3×3 méter az ajánlott.',
  },
  {
    q: 'Mi kell a helyszíntől?',
    a: 'Egy szabványos 230V-os konnektor és stabil helyszíni internet. Ha nincs net a helyszínen, saját mobilnetes megoldást viszünk.',
  },
  {
    q: 'Mennyi idő a telepítés?',
    a: 'A rendezvény kezdete előtt kb. 1 órával érkezünk; az építés és a bontás egyaránt kb. 30 perc.',
  },
  {
    q: 'Hová kerülnek a képek?',
    a: 'A vendég azonnal megkapja QR-kóddal, e-mailben vagy nyomtatva. A képek igény szerint privát online galériába kerülhetnek, harmadik félnek nem adjuk át, és a rendezvény után kérésre töröljük őket.',
  },
  {
    q: 'Hány vendéget bír el?',
    a: 'Óránként kb. 70–100 fotó. Nagyobb létszámra több gépet vagy hosszabb időtartamot ajánlunk.',
  },
  {
    q: 'Mennyibe kerül?',
    a: '4 órás budapesti kitelepüléssel: sima fotóautomata és Greenbox 80 000 Ft-tól, AI Selfiemata 105 000 Ft-tól (nettó), a nyomatcsomag 20 000 Ft-tól. Minden megkeresésre gyorsan, 24 órán belül egyedi ajánlatot adunk.',
  },
  {
    q: 'Adtok személyzetet is?',
    a: 'Igen, minden kitelepüléshez animátor / kezelő tartozik, aki végig segíti a vendégeket.',
  },
  {
    q: 'Hányféle stílust kérhetünk?',
    a: 'Nincs meghatározva. Tapasztalatból 3–5 stílust javaslunk — ennyiből választ kényelmesen a vendég.',
  },
  {
    q: 'Kérhetünk egyedi képvilágot vagy hátteret?',
    a: 'Hogyne — minden eseményre egyedi anyaggal készülünk, a rendezvény arculatához igazítva.',
  },
  {
    q: 'Nincs ötletünk — olyankor mi van?',
    a: '10+ év rutinból mindig tudunk kreatív ötleteket javasolni. Keressetek bátran!',
  },
  {
    q: 'Bizonytalanok vagyunk még a rendezvény paramétereiben, tudtok segíteni?',
    a: 'Természetesen — évtizedes tapasztalattal akár ötlettel, akár (bizonytalan paraméterek esetén) nagyságrendi árral szívesen segítünk.',
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
          Gyakori kérdések
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
          Amit a leggyakrabban kérdeznek
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
                    {f.q}
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
                      {f.a}
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
