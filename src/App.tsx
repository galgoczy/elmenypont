import { useScene } from './hooks/useScene'
import { CursorFX } from './components/CursorFX'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { TrendSection } from './components/TrendSection'
import { WhatWeDo } from './components/WhatWeDo'
import { Services } from './components/Services'
import { MoreSelfiematak } from './components/MoreSelfiematak'
import { OtherServices } from './components/OtherServices'
import { DoodleBreak } from './components/DoodleBreak'
import { IsoScene } from './components/IsoScene'
import { WhyUs } from './components/WhyUs'
import { Partners } from './components/Partners'
import { ContactCTA } from './components/ContactCTA'
import { Footer } from './components/Footer'

export default function App() {
  const { heroP, scrolled } = useScene()

  return (
    // overflow-x: clip (not hidden) — hidden would create a scroll container
    // and silently break every position:sticky descendant (hero, doodle break)
    <div style={{ position: 'relative', width: '100%', overflowX: 'clip' }}>
      <CursorFX />
      <Nav heroP={heroP} scrolled={scrolled} />
      <main>
        <Hero heroP={heroP} />
        <Marquee />
        <TrendSection />
        <WhatWeDo />
        <Services />
        <MoreSelfiematak />
        <OtherServices />
        <DoodleBreak />
        <IsoScene />
        <WhyUs />
        <Partners />
        <ContactCTA />
        <Footer />
      </main>
    </div>
  )
}
