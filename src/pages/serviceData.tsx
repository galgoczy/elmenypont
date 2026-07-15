import type { ServiceData } from './ServicePage'

/** Shared inline emphasis for the boxed accent word in H1s. */
function Boxed({ children, bg }: { children: string; bg: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: bg,
        color: '#F6F1E9',
        padding: '.02em .22em .1em',
        borderRadius: '.14em',
        transform: 'rotate(-1.4deg)',
      }}
    >
      {children}
    </span>
  )
}

export const GREENBOX: ServiceData = {
  slug: 'greenbox',
  docTitle: 'Greenbox fotózás bérlés rendezvényre | Élménypont — Greenbox Selfiemata',
  crumb: 'Greenbox Selfiemata',
  crumbEn: 'Greenbox Selfiemata',
  title: (
    <>
      Bármilyen háttér, egy <Boxed bg="#48D880">gombnyomásra.</Boxed>
    </>
  ),
  titleEn: (
    <>
      Any backdrop, at the <Boxed bg="#48D880">press of a button.</Boxed>
    </>
  ),
  accent: '#48D880',
  lead: (
    <>
      Zöld hátteres stúdió-automata profi világítással: a vendég a 24"-os érintőképernyőn hátteret
      választ — egzotikus tengerpart, filmjelenet vagy a céges képvilág —, pózol, a gép pedig
      azonnal a választott környezetbe helyezi. Kész fotó 15 másodperc alatt, nyomtatva vagy
      e-mailben.
    </>
  ),
  leadEn: (
    <>
      A green-screen studio automat with professional lighting: on the 24" touchscreen the guest
      picks a backdrop — an exotic beach, a movie scene or your corporate visuals — strikes a pose,
      and the machine instantly drops them into the chosen setting. A finished photo in 15 seconds,
      printed or by e-mail.
    </>
  ),
  steps: [
    {
      title: 'Háttérválasztás',
      titleEn: 'Choose a backdrop',
      body: 'A vendég a 24"-os érintőképernyőn kiválasztja a neki tetsző hátteret a rendezvényre szabott képvilágból.',
      bodyEn: 'On the 24" touchscreen the guest picks their favourite backdrop from the visuals tailored to your event.',
    },
    {
      title: 'Póz — élő előnézettel',
      titleEn: 'Pose — with live preview',
      body: 'A zöld háttér előtt pózol, és a képernyőn folyamatosan látja magát a választott környezetben — mindenki a legjobb arcát hozza.',
      bodyEn: 'They pose in front of the green screen and see themselves in the chosen setting in real time — everyone brings their best angle.',
    },
    {
      title: 'Fotó és azonnali kompozit',
      titleEn: 'Photo and instant compositing',
      body: 'A gép visszaszámol, elkészíti a fotót, és azonnal a háttérbe helyezi a vendéget.',
      bodyEn: 'The machine counts down, takes the photo and instantly places the guest into the backdrop.',
    },
    {
      title: 'Nyomtatás vagy megosztás',
      titleEn: 'Print or share',
      body: 'A kész kép 15 másodperc alatt nyomtatható vagy e-mailben megosztható, és igény szerint privát online galériába is felkerül.',
      bodyEn: 'The finished image can be printed or shared by e-mail within 15 seconds, and on request it is added to a private online gallery too.',
    },
  ],
  featuresTitle: 'Miért szeretik a vendégek?',
  featuresTitleEn: 'Why guests love it',
  features: [
    {
      color: '#48D880',
      title: 'Nincs sorban állás',
      titleEn: 'No queueing',
      body: 'Az automata másodpercek alatt elkészíti és kinyomtatja a képet, senki sem marad le a buli többi részéről.',
      bodyEn: 'The automat shoots and prints the photo within seconds, so no one misses the rest of the party.',
    },
    {
      color: '#E94A35',
      title: 'Kézzelfogható emlék',
      titleEn: 'A tangible keepsake',
      body: 'A vendégek azonnal nyomtatott képet visznek haza — és digitálisan is megkapják, megoszthatóan.',
      bodyEn: 'Guests take home a printed photo right away — and get it digitally too, ready to share.',
    },
    {
      color: '#4888F8',
      title: 'Kompakt kialakítás',
      titleEn: 'Compact footprint',
      body: 'Kis helyen is elfér, nem foglalja el a rendezvényteret — mégis a program központi eleme lesz.',
      bodyEn: 'It fits into a small space without taking over the venue — yet it becomes the centrepiece of the programme.',
    },
    {
      color: '#9B6BF2',
      title: 'Teljesen testreszabható',
      titleEn: 'Fully customisable',
      body: 'Logók, egyedi keretek, digitális kellékek: a képvilágot a rendezvény témájához igazítjuk.',
      bodyEn: 'Logos, custom frames, digital props: we match the visuals to your event theme.',
    },
    {
      color: '#E9A13B',
      title: 'Animátor a helyszínen',
      titleEn: 'A host on site',
      body: '1 fő animátorunk végig segíti a vendégeket, hogy mindenkinek élmény legyen a fotózkodás.',
      bodyEn: 'One of our hosts helps guests throughout, so the photo session is an experience for everyone.',
    },
    {
      color: '#48D880',
      title: 'Profi minőség',
      titleEn: 'Professional quality',
      body: 'Professzionális fényképezőgép, világítás és nyomtató — nincs több elmosódott vagy sötét kép.',
      bodyEn: 'A professional camera, lighting and printer — no more blurry or dark photos.',
    },
  ],
  useCases: ['Céges rendezvény', 'Esküvő', 'Születésnap', 'Csapatépítő', 'Brandaktiváció'],
  useCasesEn: ['Corporate event', 'Wedding', 'Birthday', 'Team building', 'Brand activation'],
  heroImage: {
    src: '/assets/photos/greenbox-before-after.jpg',
    alt: 'Greenbox előtte-utána: baráti társaság a zöld háttér előtt, majd ugyanők egy napsütötte tengerparton',
    altEn: 'Greenbox before and after: a group of friends in front of the green screen, then the same group on a sunlit beach',
  },
  images: [
    {
      src: '/assets/photos/greenbox-studio-setup.jpg',
      alt: 'A greenbox stúdió felépítése a helyszínen: zöld háttér, stúdióvilágítás és a fotóautomata',
      altEn: 'The greenbox studio set up on site: green screen, studio lighting and the photo automat',
      rotate: -1.1,
    },
    {
      src: '/assets/photos/greenbox-gatsby.jpg',
      alt: 'Gatsby-jelmezes csapat fotózkodik a greenbox zöld háttere előtt egy rendezvényen',
      altEn: 'A Gatsby-costumed team posing in front of the greenbox green screen at an event',
      rotate: 1,
    },
  ],
  price: {
    headline: 'Árak',
    headlineEn: 'Pricing',
    blurb: 'A legkisebb egység: 4 órás kitelepülés Budapesten, online megosztással.',
    blurbEn: 'The smallest package: a 4-hour deployment in Budapest, with online sharing.',
    rows: [
      { label: 'Greenbox Selfiemata — 4 óra, Budapest, online megosztás', value: '80 000 Ft-tól', labelEn: 'Greenbox Selfiemata — 4 hours, Budapest, online sharing', valueEn: 'from 80,000 HUF' },
      { label: 'Nyomatcsomagok (10×15 cm papírkép)', value: '20 000 Ft-tól', labelEn: 'Print packages (10×15 cm paper photo)', valueEn: 'from 20,000 HUF' },
    ],
    factors: ['időtartam', 'helyszín (Budapesten kívül kiszállás)', 'vendégszám és nyomatcsomag'],
    factorsEn: ['duration', 'venue (travel outside Budapest)', 'number of guests and print package'],
  },
  provide: [
    'Greenbox stúdió-automata profi világítással',
    'Rendezvényre szabott digitális képvilág és keretek',
    '1 fő animátor, aki végig segíti a vendégeket',
    'Helyszíni nyomtatás a választott nyomatcsomaggal',
    'Online megosztás és privát galéria',
  ],
  provideEn: [
    'Greenbox studio automat with professional lighting',
    'Event-tailored digital visuals and frames',
    'One host who assists guests throughout',
    'On-site printing with the chosen print package',
    'Online sharing and a private gallery',
  ],
  crossLink: {
    text: 'A mesterséges intelligenciás képgenerálás érdekel?',
    textEn: 'Interested in AI-powered image generation?',
    label: 'AI Selfiemata →',
    labelEn: 'AI Selfiemata →',
    href: '/ai-fotoautomata',
  },
}

export const SMART_WALL: ServiceData = {
  slug: 'smart-wall',
  docTitle: 'Smart Wall — interaktív fal bérlés rendezvényre | Élménypont',
  crumb: 'Smart Wall',
  crumbEn: 'Smart Wall',
  title: (
    <>
      A fal, ami <Boxed bg="#4888F8">életre kel.</Boxed>
    </>
  ),
  titleEn: (
    <>
      The wall that <Boxed bg="#4888F8">comes to life.</Boxed>
    </>
  ),
  accent: '#4888F8',
  lead: (
    <>
      Nyomtatott grafika és érintésre életre kelő vetített animáció egyetlen felületen. A vendég
      megérinti a falat, és mozgásba lendül a tartalom: programok, idővonal, termékbemutató,
      infografika — a rendezvényed arculatában.
    </>
  ),
  leadEn: (
    <>
      Printed graphics and projected animation that springs to life at a touch, on a single surface.
      The guest touches the wall and the content sets in motion: programmes, timelines, product
      showcases, infographics — all in your event's branding.
    </>
  ),
  steps: [
    {
      title: 'Kreatív koncepció',
      titleEn: 'Creative concept',
      body: 'Közösen kitaláljuk, mit meséljen a fal: program, idővonal, termék, játék — elkészül a fix grafikai nyomat terve.',
      bodyEn: 'Together we work out what the wall should tell: programme, timeline, product, game — and the design for the fixed printed graphic is finalised.',
    },
    {
      title: 'Tartalomgyártás',
      titleEn: 'Content production',
      body: 'Az interaktív, vetített animációk AI-alapú tartalomgyártásunkkal napok alatt elkészülnek — nem hetek alatt.',
      bodyEn: 'The interactive projected animations are produced in days with our AI-powered content production — not weeks.',
    },
    {
      title: 'Telepítés és kalibrálás',
      titleEn: 'Installation and calibration',
      body: 'A falszerkezetet és az érintésszenzorral kalibrált HD projektort a helyszínen állítjuk üzembe — minden beltéri fényviszonynál jól látható.',
      bodyEn: 'We set up the wall structure and the touch-sensor-calibrated HD projector on site — clearly visible in any indoor lighting.',
    },
    {
      title: 'Élmény a rendezvényen',
      titleEn: 'The experience at the event',
      body: 'Érintésre indulnak az animációk; nyugalmi állapotban figyelemfelkeltő mozgás csalogatja oda a vendégeket. Technikai felügyelet végig a helyszínen.',
      bodyEn: 'A touch triggers the animations; while idle, eye-catching motion draws guests over. Technical supervision on site throughout.',
    },
  ],
  featuresTitle: 'Mire való?',
  featuresTitleEn: 'What is it for?',
  features: [
    {
      color: '#4888F8',
      title: 'Információ, ami élmény',
      titleEn: 'Information that becomes an experience',
      body: 'Programlista, idővonal vagy előadó-bemutató interaktív formában — a vendég magának fedezi fel, ezért meg is jegyzi.',
      bodyEn: 'A programme list, timeline or speaker line-up in interactive form — the guest discovers it themselves, so they remember it.',
    },
    {
      color: '#E94A35',
      title: 'Termékbemutató másképp',
      titleEn: 'Product showcases, reimagined',
      body: 'Új termék vagy szolgáltatás bemutatása érintésre elinduló animációkkal, infografikákkal.',
      bodyEn: 'Present a new product or service with touch-triggered animations and infographics.',
    },
    {
      color: '#48D880',
      title: 'Magához vonzza a vendéget',
      titleEn: 'It draws guests in',
      body: 'A fal nyugalmi állapotban is mozog — távolról felkelti a figyelmet, közelről interakcióra hív.',
      bodyEn: 'The wall moves even while idle — it catches attention from afar and invites interaction up close.',
    },
    {
      color: '#9B6BF2',
      title: '100% arculatra szabva',
      titleEn: '100% on-brand',
      body: 'A nyomat és a vetített tartalom is teljes egészében az esemény arculatára készül.',
      bodyEn: "Both the print and the projected content are made entirely to your event's branding.",
    },
  ],
  useCases: [
    'Konferencia',
    'Kiállítás',
    'Sajtóesemény',
    'Termékbemutató',
    'Díjátadó',
    'Dolgozói esemény',
    'Ügyfélparty',
    'Fesztivál',
  ],
  useCasesEn: [
    'Conference',
    'Exhibition',
    'Press event',
    'Product launch',
    'Awards ceremony',
    'Employee event',
    'Client party',
    'Festival',
  ],
  video: {
    src: '/assets/video/smartwall-loop.mp4',
    poster: '/assets/photos/smartwall-nespresso.jpg',
    label: 'A Smart Wall működés közben: vendégek egy interaktív Nespresso kávétérképet érintenek',
    labelEn: 'The Smart Wall in action: guests touching an interactive Nespresso coffee map',
  },
  images: [
    {
      src: '/assets/photos/smartwall-event.jpg',
      alt: 'Vendégek a Nespresso rendezvényén az interaktív Smart Wall kávétérképét nézik',
      altEn: 'Guests at the Nespresso event looking at the interactive Smart Wall coffee map',
      rotate: -1.1,
    },
    {
      src: '/assets/photos/smartwall-touch.jpg',
      alt: 'Egy vendég megérinti a Smart Wall vetített felületét, és elindul az animáció',
      altEn: 'A guest touches the Smart Wall projected surface and the animation starts',
      rotate: 1.2,
    },
  ],
  price: {
    headline: 'Árak — az AI-fordulat',
    headlineEn: 'Pricing — the AI turning point',
    blurb: (
      <>
        Az egyedi interaktív tartalom fejlesztése a sarokpont — egyben a legösszetettebb tétel is
        ebben a szolgáltatásban. Szerencsére a korábban hosszú, sok szakembert igénylő folyamat ma
        az AI-alapú, de ember által végzett tartalomgyártásunkkal napok alatt, a korábbi költségek
        töredéke mellett elkészülhet. És minél többször veted be ugyanazt a tartalmat, annál jobban megéri.
      </>
    ),
    blurbEn: (
      <>
        Developing the bespoke interactive content is the cornerstone — and also the most complex
        item in this service. Fortunately, a process that used to be long and required many
        specialists can now be delivered in days with our AI-powered but human-made content
        production, at a fraction of the former cost. And the more often you deploy the same content,
        the more it pays off.
      </>
    ),
    rows: [
      {
        label: 'Első bevetés: koncepció + tartalomfejlesztés + fali nyomat + 1 nap telepítés és üzemeltetés',
        value: '600 000 Ft-tól',
        labelEn: 'First deployment: concept + content development + wall print + 1 day of installation and operation',
        valueEn: 'from 600,000 HUF',
      },
      { label: 'További napok ugyanazon a rendezvényen (nincs újraszerelés)', value: '+80 000 Ft/nap-tól', labelEn: 'Additional days at the same event (no re-installation)', valueEn: '+80,000 HUF/day' },
      { label: 'Meglévő tartalommal újabb rendezvényen', value: '150 000 Ft/nap-tól', labelEn: 'With existing content at a new event', valueEn: 'from 150,000 HUF/day' },
    ],
    factors: ['napok száma', 'helyszín', 'a tartalom összetettsége'],
    factorsEn: ['number of days', 'venue', 'the complexity of the content'],
  },
  provide: [
    'Kreatív koncepció és grafikai tervezés',
    'Smart Projector és falszerkezet',
    'Animációkészítés és alkalmazásfejlesztés',
    'Fali nyomat',
    'Telepítés, kalibrálás és technikai felügyelet',
    'Igény szerint hostess',
  ],
  provideEn: [
    'Creative concept and graphic design',
    'Smart Projector and wall structure',
    'Animation creation and application development',
    'Wall print',
    'Installation, calibration and technical supervision',
    'A hostess on request',
  ],
  crossLink: {
    text: 'A vendégek fotóiból épülő közös élményt keresel?',
    textEn: "Looking for a shared experience built from your guests' photos?",
    label: 'Mosaic Wall →',
    labelEn: 'Mosaic Wall →',
    href: '/mosaic-wall',
  },
}

export const MOSAIC_WALL: ServiceData = {
  slug: 'mosaic-wall',
  docTitle: 'Mosaic Wall — mozaikfal rendezvényre | Élménypont',
  crumb: 'Mosaic Wall',
  crumbEn: 'Mosaic Wall',
  title: (
    <>
      Mindenki hozzátesz a nagy <Boxed bg="#E94A35">egészhez.</Boxed>
    </>
  ),
  titleEn: (
    <>
      Everyone adds to the bigger <Boxed bg="#E94A35">picture.</Boxed>
    </>
  ),
  accent: '#E94A35',
  lead: (
    <>
      A vendégekről készült fotók matricaként kerülnek fel egy sorszámozott falra, és a szemünk
      előtt áll össze belőlük a közösen választott nagy kép. Igazi közösségi aktivitás: fotózz,
      nyomtass, ragassz.
    </>
  ),
  leadEn: (
    <>
      Photos of the guests go up as stickers on a numbered wall, and before our eyes they assemble
      into the big picture chosen together. A truly communal activity: shoot, print, stick.
    </>
  ),
  steps: [
    {
      title: 'Fotózz',
      titleEn: 'Shoot',
      body: 'A vendégekről a kihelyezett digitális fotóautomatánk készít képet — az érintőkijelzős felület tükörként is szolgál.',
      bodyEn: 'Our on-site digital photo automat takes a picture of the guests — the touchscreen surface doubles as a mirror.',
    },
    {
      title: 'Nyomtass',
      titleEn: 'Print',
      body: 'A képek perceken belül filterezést kapnak, és matricaként kerülnek a vendég kezébe.',
      bodyEn: 'Within minutes the photos are filtered and handed to the guest as a sticker.',
    },
    {
      title: 'Ragassz',
      titleEn: 'Stick',
      body: 'A rácsháló azonosítói megmutatják a matrica helyét — minden kép oda kerül, ahová szánták.',
      bodyEn: 'The grid coordinates show where the sticker goes — every photo ends up exactly where it belongs.',
    },
    {
      title: 'Összeáll a nagy kép',
      titleEn: 'The big picture takes shape',
      body: 'A sok kicsi mozaikból kirajzolódik az előre közösen kiválasztott kompozíció. Kollégáink végig segítenek.',
      bodyEn: 'From the many small tiles the composition chosen together in advance emerges. Our colleagues help throughout.',
    },
  ],
  featuresTitle: 'Miért különleges?',
  featuresTitleEn: 'What makes it special?',
  features: [
    {
      color: '#E94A35',
      title: 'Kétszeres élmény',
      titleEn: 'A double experience',
      body: 'A fotózkodás önmagában is szórakoztató — és közben mindenki próbálja kitalálni, mi lesz a végső kép.',
      bodyEn: 'Posing for photos is fun in itself — and meanwhile everyone tries to guess what the final picture will be.',
    },
    {
      color: '#48D880',
      title: 'Maradandó végeredmény',
      titleEn: 'A lasting result',
      body: 'A kész mozaik a rendezvény dekorációja lesz, utólag plakátként vagy keretezett képként is kérhető.',
      bodyEn: 'The finished mosaic becomes the event decoration, and can be ordered afterwards as a poster or a framed print.',
    },
    {
      color: '#4888F8',
      title: 'Közösségformáló',
      titleEn: 'Community-building',
      body: 'Mindenki hozzátesz egy darabot — a közös alkotás erősíti a résztvevők közötti kapcsolatot.',
      bodyEn: 'Everyone adds a piece — creating something together strengthens the bond between participants.',
    },
    {
      color: '#9B6BF2',
      title: 'Brandingelhető',
      titleEn: 'Fully brandable',
      body: 'A fal nyomata és a fotóautomata szoftverének felülete is a rendezvény arculatára szabható.',
      bodyEn: "Both the wall print and the photo automat's software interface can be tailored to your event branding.",
    },
  ],
  useCases: ['Nagylétszámú céges esemény', 'Konferencia', 'Fesztivál', 'Jubileum', 'Brandaktiváció'],
  useCasesEn: ['Large-scale corporate event', 'Conference', 'Festival', 'Anniversary', 'Brand activation'],
  heroImage: {
    src: '/assets/photos/mosaic-wall-real.jpg',
    alt: 'Kész Mosaic Wall egy rendezvényen: vendégek ragasztják fel az utolsó fotómatricákat a nagy közös képre',
    altEn: 'A finished Mosaic Wall at an event: guests sticking the last photo stickers onto the big shared picture',
  },
  images: [
    {
      src: '/assets/photos/mosaic-grid.jpg',
      alt: 'Rendezvényfotókból összeálló mozaikrács — sok kicsi képből egy nagy kompozíció',
      altEn: 'A mosaic grid assembled from event photos — one big composition from many small images',
      rotate: -1,
    },
  ],
  price: {
    headline: 'Árak',
    headlineEn: 'Pricing',
    blurb: 'Nagylétszámú eseményekre ajánljuk — a fal több méretben elérhető.',
    blurbEn: 'Recommended for large-scale events — the wall is available in several sizes.',
    rows: [
      { label: '200 darabos mozaik, 130×90 cm-es nyomattal', value: '450 000 Ft-tól', labelEn: '200-piece mosaic, with a 130×90 cm print', valueEn: 'from 450,000 HUF' },
    ],
    factors: ['a mozaik mérete és darabszáma', 'időtartam', 'helyszín'],
    factorsEn: ['the size and piece count of the mosaic', 'duration', 'venue'],
  },
  provide: [
    'Mozaikfal, nyomtató és minden szükséges eszköz',
    'Grafikai tervezés — a mozaikkockákat vizuális egésszé alakítjuk',
    '1 fős technikai felügyelet: nyomtatás, segítség, moderálás',
    'Igény szerint hostess a program aktivizálásához',
    'Utólagos plakát vagy keretezett kép igény szerint',
  ],
  provideEn: [
    'Mosaic wall, printer and all the necessary equipment',
    'Graphic design — we shape the mosaic tiles into a visual whole',
    'One-person technical supervision: printing, assistance, moderation',
    'A hostess on request to energise the activity',
    'A poster or framed print afterwards on request',
  ],
  crossLink: {
    text: 'Informatív, érinthető felületet keresel inkább?',
    textEn: 'Looking for an informative, touchable surface instead?',
    label: 'Smart Wall →',
    labelEn: 'Smart Wall →',
    href: '/smart-wall',
  },
}

export const SELFIEBOX: ServiceData = {
  slug: 'selfiebox',
  docTitle: 'Selfiebox — szelfigép és fotóbox bérlés rendezvényre | Élménypont',
  crumb: 'Selfiebox',
  crumbEn: 'Selfiebox',
  title: (
    <>
      A klasszikus fotóbox — ami <Boxed bg="#E9A13B">mindig működik.</Boxed>
    </>
  ),
  titleEn: (
    <>
      The classic photo booth — that <Boxed bg="#E9A13B">always works.</Boxed>
    </>
  ),
  accent: '#E9A13B',
  lead: (
    <>
      Szelfigép és fotóautomata bérlés rendezvényre azonnali nyomtatással: egy gombnyomás, profi
      fény, és pár másodperc múlva ott a kész kép a vendég kezében. Egyszerű, gyors, minden
      korosztálynak — és mindig működik.
    </>
  ),
  leadEn: (
    <>
      A selfie machine and photo automat for hire with instant printing: one press of a button,
      professional lighting, and a few seconds later the finished photo is in the guest's hand.
      Simple, fast, for every age group — and it always works.
    </>
  ),
  steps: [
    {
      title: 'Pózolj',
      titleEn: 'Pose',
      body: 'A vendég beáll a fotóbox elé, az érintőképernyőn látja magát, és kiválasztja a brandingelt keretet.',
      bodyEn: 'The guest steps up to the photo booth, sees themselves on the touchscreen and picks the branded frame.',
    },
    {
      title: 'Egy gombnyomás',
      titleEn: 'One button press',
      body: 'Az automata visszaszámol és elkészíti a képet — profi világítással, éles, jól exponált fotóval.',
      bodyEn: 'The automat counts down and takes the photo — with professional lighting, sharp and well-exposed.',
    },
    {
      title: 'Azonnali nyomtatás',
      titleEn: 'Instant printing',
      body: 'A kész kép pár másodperc alatt nyomtatva a kézben, és igény szerint e-mailben vagy QR-kóddal is megosztható.',
      bodyEn: 'The finished photo is in hand within seconds, and can also be shared by e-mail or QR code on request.',
    },
  ],
  featuresTitle: 'Miért szeretik a vendégek?',
  featuresTitleEn: 'Why guests love it',
  features: [
    {
      color: '#E9A13B',
      title: 'Egyszerű és gyors',
      titleEn: 'Simple and fast',
      body: 'Nincs tanulási görbe: odaáll, mosolyog, gombot nyom — kész. Sorban állás nélkül pörög.',
      bodyEn: 'No learning curve: step up, smile, press a button — done. It keeps moving without queues.',
    },
    {
      color: '#E94A35',
      title: 'Kézzelfogható emlék',
      titleEn: 'A tangible keepsake',
      body: 'A vendég azonnal nyomtatott képet visz haza — a klasszikus, amit mindenki imád.',
      bodyEn: 'The guest takes home a printed photo right away — the classic everyone loves.',
    },
    {
      color: '#4888F8',
      title: 'Minden korosztálynak',
      titleEn: 'For every age group',
      body: 'A nagyszülőtől a gyerekekig mindenki azonnal érti és használja.',
      bodyEn: 'From grandparents to children, everyone understands and uses it straight away.',
    },
    {
      color: '#9B6BF2',
      title: 'Brandingelhető keret',
      titleEn: 'A brandable frame',
      body: 'A nyomat kerete és a képernyő is a rendezvény arculatára szabható.',
      bodyEn: 'Both the print frame and the screen can be tailored to your event branding.',
    },
  ],
  useCases: ['Esküvő', 'Céges buli', 'Születésnap', 'Ballagás', 'Családi nap'],
  useCasesEn: ['Wedding', 'Company party', 'Birthday', 'Graduation', 'Family day'],
  heroImage: {
    src: '/assets/photos/team-original.jpg',
    alt: 'Klasszikus fotóboxban készült csoportkép egy rendezvényen',
    altEn: 'A group photo taken in a classic photo booth at an event',
  },
  price: {
    headline: 'Árak',
    headlineEn: 'Pricing',
    blurb: 'A legkisebb egység: 4 órás kitelepülés Budapesten.',
    blurbEn: 'The smallest package: a 4-hour deployment in Budapest.',
    rows: [
      { label: 'Selfiebox — 4 óra, Budapest', value: '80 000 Ft-tól', labelEn: 'Selfiebox — 4 hours, Budapest', valueEn: 'from 80,000 HUF' },
      { label: 'Nyomatcsomagok (10×15 cm papírkép)', value: '20 000 Ft-tól', labelEn: 'Print packages (10×15 cm paper photo)', valueEn: 'from 20,000 HUF' },
    ],
    factors: ['időtartam', 'helyszín (Budapesten kívül kiszállás)', 'vendégszám és nyomatcsomag'],
    factorsEn: ['duration', 'venue (travel outside Budapest)', 'number of guests and print package'],
  },
  provide: [
    'Fotóbox automata profi világítással és nyomtatóval',
    'Rendezvényre szabott, brandingelhető keret',
    '1 fő kezelő / animátor a helyszínen',
    'Helyszíni nyomtatás a választott nyomatcsomaggal',
    'Online megosztás e-mailben vagy QR-kóddal',
  ],
  provideEn: [
    'Photo booth automat with professional lighting and a printer',
    'An event-tailored, brandable frame',
    'One operator / host on site',
    'On-site printing with the chosen print package',
    'Online sharing by e-mail or QR code',
  ],
  crossLink: {
    text: 'Dobd fel mesterséges intelligenciával?',
    textEn: 'Want to spice it up with artificial intelligence?',
    label: 'AI Selfiemata →',
    labelEn: 'AI Selfiemata →',
    href: '/ai-fotoautomata',
  },
}
