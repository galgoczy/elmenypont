import { useScene } from '../hooks/useScene'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { useT } from '../i18n'

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
  const t = useT()
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
          {t('Adatkezelési tájékoztató', 'Privacy Notice')}
        </h1>
        <p style={{ marginTop: 18 }}>
          {t(
            'Ez a tájékoztató az elmeny.hu weboldal ajánlatkérő űrlapján és elérhetőségein keresztül megadott személyes adatok kezelését ismerteti.',
            'This notice describes how we handle the personal data provided through the quote request form and the contact details on the elmeny.hu website.',
          )}
        </p>

        <h2 style={h2}>{t('1. Az adatkezelő', '1. The data controller')}</h2>
        <p style={{ marginTop: 10 }}>
          {t('Élménypont Kft. · 1135 Budapest, Reitter Ferenc utca 35. · e-mail:', 'Élménypont Kft. · 1135 Budapest, Reitter Ferenc utca 35. · e-mail:')}{' '}
          <a href="mailto:hello@elmeny.hu" style={{ color: '#E94A35' }}>hello@elmeny.hu</a> · {t('telefon:', 'phone:')}{' '}
          <a href="tel:+36204680489" style={{ color: '#E94A35' }}>+36 20 468 0489</a>
        </p>

        <h2 style={h2}>{t('2. A kezelt adatok köre és célja', '2. The scope and purpose of the processed data')}</h2>
        <p style={{ marginTop: 10 }}>
          {t(
            'Az ajánlatkérő űrlapon megadott adatokat (név, e-mail-cím, telefonszám, a tervezett rendezvény adatai és az üzenet tartalma) kizárólag az ajánlatkérés megválaszolása és a kapcsolatfelvétel céljából kezeljük. Az adatkezelés jogalapja az érintett hozzájárulása (GDPR 6. cikk (1) a) pont), amelyet az űrlap beküldése előtt jelölőnégyzettel ad meg.',
            'The data provided on the quote request form (name, e-mail address, phone number, details of the planned event and the content of the message) is processed solely for the purpose of answering the quote request and making contact. The legal basis for the processing is the consent of the data subject (GDPR Article 6(1)(a)), given via a checkbox before the form is submitted.',
          )}
        </p>

        <h2 style={h2}>{t('3. Az adatkezelés időtartama', '3. The duration of the processing')}</h2>
        <p style={{ marginTop: 10 }}>
          {t(
            'Az ajánlatkéréssel összefüggő adatokat az ügy lezárását követő legfeljebb 1 évig őrizzük meg, kivéve, ha az együttműködésből szerződés jön létre — ekkor a számviteli jogszabályokban előírt megőrzési idők irányadók.',
            'We retain data relating to a quote request for at most 1 year after the matter is closed, except where the cooperation results in a contract — in which case the retention periods prescribed by accounting legislation apply.',
          )}
        </p>

        <h2 style={h2}>{t('4. Adattovábbítás, adatfeldolgozók', '4. Data transfers and data processors')}</h2>
        <p style={{ marginTop: 10 }}>
          {t(
            'A beküldött adatok e-mail-rendszerünkbe (Microsoft 365) és belső értesítési csatornánkra (Telegram) érkeznek; a weboldal kiszolgálását a Vercel Inc. biztosítja. Harmadik félnek marketingcélra adatot nem adunk át.',
            'The submitted data is delivered to our e-mail system (Microsoft 365) and our internal notification channel (Telegram); the website is served by Vercel Inc. We do not transfer data to third parties for marketing purposes.',
          )}
        </p>

        <h2 style={h2}>{t('5. Webanalitika', '5. Web analytics')}</h2>
        <p style={{ marginTop: 10 }}>
          {t(
            'A weboldal a látogatottság méréséhez Google Analytics 4 szolgáltatást használ, kizárólag a látogató hozzájárulása esetén (süti-beállítások). A mérés anonimizált; személyre szabott hirdetési adatkezelés nem történik.',
            "To measure traffic, the website uses Google Analytics 4, only with the visitor's consent (cookie settings). The measurement is anonymised; no personalised advertising data processing takes place.",
          )}
        </p>

        <h2 style={h2}>{t('6. Az érintettek jogai', '6. The rights of data subjects')}</h2>
        <p style={{ marginTop: 10 }}>
          {t('Bármikor kérhet tájékoztatást személyes adatai kezeléséről, kérheti azok helyesbítését, törlését vagy az adatkezelés korlátozását, valamint visszavonhatja hozzájárulását a', 'You may request information about the processing of your personal data at any time, request its rectification or erasure or the restriction of the processing, and withdraw your consent at')}{' '}
          <a href="mailto:hello@elmeny.hu" style={{ color: '#E94A35' }}>hello@elmeny.hu</a>{t(' címen. Jogorvoslatért a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH, naih.hu) fordulhat.', '. For legal remedy you may turn to the Hungarian National Authority for Data Protection and Freedom of Information (NAIH, naih.hu).')}
        </p>
      </main>
      <Footer />
    </div>
  )
}
