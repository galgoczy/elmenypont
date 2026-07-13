import { useScene } from '../hooks/useScene'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'

const h2: React.CSSProperties = {
  fontFamily: 'Syne',
  fontWeight: 700,
  fontSize: 22,
  color: '#17150D',
  marginTop: 36,
}

/**
 * Adatkezelési tájékoztató — a régi elmeny.hu GDPR-oldala már nem érhető el,
 * ezért ez egy standard szövegű tájékoztató a cégadatokkal; élesítés előtt
 * jogi szemmel ellenőrizendő.
 */
export function PrivacyPage() {
  const { scrolled } = useScene()
  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'clip', background: '#F6F1E9' }}>
      <Nav scrolled={scrolled} base="/" />
      <main
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: 'clamp(130px,15vw,170px) clamp(24px,6vw,48px) clamp(70px,9vw,110px)',
          fontSize: 16,
          lineHeight: 1.65,
          color: '#46433A',
        }}
      >
        <h1 style={{ fontFamily: 'Syne', fontWeight: 500, fontSize: 'clamp(30px,4vw,44px)', letterSpacing: '-.02em', color: '#17150D' }}>
          Adatkezelési tájékoztató
        </h1>
        <p style={{ marginTop: 18 }}>
          Ez a tájékoztató az elmeny.hu weboldal ajánlatkérő űrlapján és elérhetőségein keresztül
          megadott személyes adatok kezelését ismerteti.
        </p>

        <h2 style={h2}>1. Az adatkezelő</h2>
        <p style={{ marginTop: 10 }}>
          Élménypont Kft. · 1135 Budapest, Reitter Ferenc utca 35. · e-mail:{' '}
          <a href="mailto:hello@elmeny.hu" style={{ color: '#E94A35' }}>hello@elmeny.hu</a> · telefon:{' '}
          <a href="tel:+36204680489" style={{ color: '#E94A35' }}>+36 20 468 0489</a>
        </p>

        <h2 style={h2}>2. A kezelt adatok köre és célja</h2>
        <p style={{ marginTop: 10 }}>
          Az ajánlatkérő űrlapon megadott adatokat (név, e-mail-cím, telefonszám, a tervezett
          rendezvény adatai és az üzenet tartalma) kizárólag az ajánlatkérés megválaszolása és a
          kapcsolatfelvétel céljából kezeljük. Az adatkezelés jogalapja az érintett hozzájárulása
          (GDPR 6. cikk (1) a) pont), amelyet az űrlap beküldése előtt jelölőnégyzettel ad meg.
        </p>

        <h2 style={h2}>3. Az adatkezelés időtartama</h2>
        <p style={{ marginTop: 10 }}>
          Az ajánlatkéréssel összefüggő adatokat az ügy lezárását követő legfeljebb 1 évig őrizzük
          meg, kivéve, ha az együttműködésből szerződés jön létre — ekkor a számviteli
          jogszabályokban előírt megőrzési idők irányadók.
        </p>

        <h2 style={h2}>4. Adattovábbítás, adatfeldolgozók</h2>
        <p style={{ marginTop: 10 }}>
          A beküldött adatok e-mail-rendszerünkbe (Microsoft 365) és belső értesítési csatornánkra
          (Telegram) érkeznek; a weboldal kiszolgálását a Vercel Inc. biztosítja. Harmadik félnek
          marketingcélra adatot nem adunk át.
        </p>

        <h2 style={h2}>5. Webanalitika</h2>
        <p style={{ marginTop: 10 }}>
          A weboldal a látogatottság méréséhez Google Analytics 4 szolgáltatást használ, kizárólag
          a látogató hozzájárulása esetén (süti-beállítások). A mérés anonimizált; személyre
          szabott hirdetési adatkezelés nem történik.
        </p>

        <h2 style={h2}>6. Az érintettek jogai</h2>
        <p style={{ marginTop: 10 }}>
          Bármikor kérhet tájékoztatást személyes adatai kezeléséről, kérheti azok helyesbítését,
          törlését vagy az adatkezelés korlátozását, valamint visszavonhatja hozzájárulását a{' '}
          <a href="mailto:hello@elmeny.hu" style={{ color: '#E94A35' }}>hello@elmeny.hu</a> címen.
          Jogorvoslatért a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH,
          naih.hu) fordulhat.
        </p>
      </main>
      <Footer />
    </div>
  )
}
