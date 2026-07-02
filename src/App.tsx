import { useScene } from './hooks/useScene'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { TrendSection } from './components/TrendSection'
import { WhatWeDo } from './components/WhatWeDo'
import { Services } from './components/Services'
import { MoreSelfiematak } from './components/MoreSelfiematak'
import { OtherServices } from './components/OtherServices'
import { IsoScene } from './components/IsoScene'
import { WhyUs } from './components/WhyUs'
import { Partners } from './components/Partners'
import { ContactCTA } from './components/ContactCTA'
import { Footer } from './components/Footer'

export default function App() {
  const { heroP, scrolled, rocket } = useScene()

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      <Nav heroP={heroP} scrolled={scrolled} />
      <main>
        <Hero heroP={heroP} />
        <Marquee />
        <TrendSection rocket={rocket} />
        <WhatWeDo />
        <Services />
        <MoreSelfiematak />
        <OtherServices />
        <IsoScene />
        <WhyUs />
        <Partners />
        <ContactCTA />
        <Footer />
      </main>
    </div>
  )
}
