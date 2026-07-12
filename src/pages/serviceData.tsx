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
  title: (
    <>
      Bármilyen háttér, <Boxed bg="#48D880">egy gombnyomásra.</Boxed>
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
  steps: [
    {
      title: 'Háttérválasztás',
      body: 'A vendég a 24"-os érintőképernyőn kiválasztja a neki tetsző hátteret a rendezvényre szabott képvilágból.',
    },
    {
      title: 'Póz — élő előnézettel',
      body: 'A zöld háttér előtt pózol, és a képernyőn folyamatosan látja magát a választott környezetben — mindenki a legjobb arcát hozza.',
    },
    {
      title: 'Fotó és azonnali kompozit',
      body: 'A gép visszaszámol, elkészíti a fotót, és azonnal a háttérbe helyezi a vendéget.',
    },
    {
      title: 'Nyomtatás vagy megosztás',
      body: 'A kész kép 15 másodperc alatt nyomtatható vagy e-mailben megosztható, és igény szerint privát online galériába is felkerül.',
    },
  ],
  featuresTitle: 'Miért szeretik a vendégek?',
  features: [
    {
      color: '#48D880',
      title: 'Nincs sorban állás',
      body: 'Az automata másodpercek alatt elkészíti és kinyomtatja a képet, senki sem marad le a buli többi részéről.',
    },
    {
      color: '#E94A35',
      title: 'Kézzelfogható emlék',
      body: 'A vendégek azonnal nyomtatott képet visznek haza — és digitálisan is megkapják, megoszthatóan.',
    },
    {
      color: '#4888F8',
      title: 'Kompakt kialakítás',
      body: 'Kis helyen is elfér, nem foglalja el a rendezvényteret — mégis a program központi eleme lesz.',
    },
    {
      color: '#9B6BF2',
      title: 'Teljesen testreszabható',
      body: 'Logók, egyedi keretek, digitális kellékek: a képvilágot a rendezvény témájához igazítjuk.',
    },
    {
      color: '#E9A13B',
      title: 'Animátor a helyszínen',
      body: '1 fő animátorunk végig segíti a vendégeket, hogy mindenkinek élmény legyen a fotózkodás.',
    },
    {
      color: '#48D880',
      title: 'Profi minőség',
      body: 'Professzionális fényképezőgép, világítás és nyomtató — nincs több elmosódott vagy sötét kép.',
    },
  ],
  useCases: ['Céges rendezvény', 'Esküvő', 'Születésnap', 'Csapatépítő', 'Brandaktiváció'],
  images: [
    {
      src: '/assets/photos/greenbox-gatsby.jpg',
      alt: 'Gatsby-jelmezes csapat fotózkodik a greenbox zöld háttere előtt egy rendezvényen',
      rotate: -1.2,
    },
    {
      src: '/assets/photos/greenbox-studio.jpg',
      alt: 'Greenbox stúdió-automata működés közben: vendégek a zöld háttér és a stúdióvilágítás előtt',
      rotate: 1.1,
    },
  ],
  price: {
    headline: 'Árak',
    blurb: 'A legkisebb egység: 4 órás kitelepülés Budapesten, online megosztással.',
    rows: [
      { label: 'Greenbox Selfiemata — 4 óra, Budapest, online megosztás', value: '80 000 Ft-tól' },
      { label: 'Nyomatcsomagok (10×15 cm papírkép)', value: '20 000 Ft-tól' },
    ],
    factors: ['időtartam', 'helyszín (Budapesten kívül kiszállás)', 'vendégszám és nyomatcsomag'],
  },
  provide: [
    'Greenbox stúdió-automata profi világítással',
    'Rendezvényre szabott digitális képvilág és keretek',
    '1 fő animátor, aki végig segíti a vendégeket',
    'Helyszíni nyomtatás a választott nyomatcsomaggal',
    'Online megosztás és privát galéria',
  ],
  crossLink: {
    text: 'A mesterséges intelligenciás képgenerálás érdekel?',
    label: 'AI Selfiemata — ai.elmeny.hu →',
    href: 'https://ai.elmeny.hu',
  },
}

export const SMART_WALL: ServiceData = {
  slug: 'smart-wall',
  docTitle: 'Smart Wall — interaktív fal bérlés rendezvényre | Élménypont',
  crumb: 'Smart Wall',
  title: (
    <>
      A fal, ami <Boxed bg="#4888F8">életre kel.</Boxed>
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
  steps: [
    {
      title: 'Kreatív koncepció',
      body: 'Közösen kitaláljuk, mit meséljen a fal: program, idővonal, termék, játék — elkészül a fix grafikai nyomat terve.',
    },
    {
      title: 'Tartalomgyártás',
      body: 'Az interaktív, vetített animációk AI-alapú tartalomgyártásunkkal napok alatt elkészülnek — nem hetek alatt.',
    },
    {
      title: 'Telepítés és kalibrálás',
      body: 'A falszerkezetet és az érintésszenzorral kalibrált HD projektort a helyszínen állítjuk üzembe — minden beltéri fényviszonynál jól látható.',
    },
    {
      title: 'Élmény a rendezvényen',
      body: 'Érintésre indulnak az animációk; nyugalmi állapotban figyelemfelkeltő mozgás csalogatja oda a vendégeket. Technikai felügyelet végig a helyszínen.',
    },
  ],
  featuresTitle: 'Mire való?',
  features: [
    {
      color: '#4888F8',
      title: 'Információ, ami élmény',
      body: 'Programlista, idővonal vagy előadó-bemutató interaktív formában — a vendég magának fedezi fel, ezért meg is jegyzi.',
    },
    {
      color: '#E94A35',
      title: 'Termékbemutató másképp',
      body: 'Új termék vagy szolgáltatás bemutatása érintésre elinduló animációkkal, infografikákkal.',
    },
    {
      color: '#48D880',
      title: 'Magához vonzza a vendéget',
      body: 'A fal nyugalmi állapotban is mozog — távolról felkelti a figyelmet, közelről interakcióra hív.',
    },
    {
      color: '#9B6BF2',
      title: '100% arculatra szabva',
      body: 'A nyomat és a vetített tartalom is teljes egészében az esemény arculatára készül.',
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
  video: {
    src: '/assets/video/smartwall-loop.mp4',
    poster: '/assets/photos/smartwall-nespresso.jpg',
    label: 'A Smart Wall működés közben: vendégek egy interaktív Nespresso kávétérképet érintenek',
  },
  images: [
    {
      src: '/assets/photos/smartwall-nespresso.jpg',
      alt: 'Vendégek a Nespresso rendezvényén az interaktív Smart Wall kávétérképét nézik',
      rotate: -1.1,
    },
    {
      src: '/assets/photos/smartwall-touch.jpg',
      alt: 'Egy vendég megérinti a Smart Wall vetített felületét, és elindul az animáció',
      rotate: 1.2,
    },
  ],
  price: {
    headline: 'Árak — az AI-fordulat',
    blurb: (
      <>
        Az egyedi interaktív tartalom fejlesztése korábban milliós tétel volt. Ma az AI-alapú
        tartalomgyártásunkkal ugyanez napok alatt, a korábbi ár töredékéért készül el — a
        megtakarítást pedig továbbadjuk. És minél többször veted be, annál jobban megéri.
      </>
    ),
    rows: [
      {
        label: 'Első bevetés: koncepció + tartalomfejlesztés + fali nyomat + 1 nap telepítés és üzemeltetés',
        value: '450 000 Ft-tól',
      },
      { label: 'További napok ugyanazon a rendezvényen (nincs újraszerelés)', value: '+75 000 Ft/nap' },
      { label: 'Meglévő tartalommal újabb rendezvényen', value: '150 000 Ft/nap-tól' },
    ],
    factors: ['napok száma', 'helyszín', 'a tartalom összetettsége'],
  },
  provide: [
    'Kreatív koncepció és grafikai tervezés',
    'Smart Projector és falszerkezet',
    'Animációkészítés és alkalmazásfejlesztés',
    'Fali nyomat',
    'Telepítés, kalibrálás és technikai felügyelet',
    'Igény szerint hostess',
  ],
  crossLink: {
    text: 'A vendégek fotóiból épülő közös élményt keresel?',
    label: 'Mosaic Wall →',
    href: '/mosaic-wall',
  },
}

export const MOSAIC_WALL: ServiceData = {
  slug: 'mosaic-wall',
  docTitle: 'Mosaic Wall — mozaikfal rendezvényre | Élménypont',
  crumb: 'Mosaic Wall',
  title: (
    <>
      Mindenki hozzátesz a <Boxed bg="#E94A35">nagy egészhez.</Boxed>
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
  steps: [
    {
      title: 'Fotózz',
      body: 'A vendégekről a kihelyezett digitális fotóautomatánk készít képet — az érintőkijelzős felület tükörként is szolgál.',
    },
    {
      title: 'Nyomtass',
      body: 'A képek perceken belül filterezést kapnak, és matricaként kerülnek a vendég kezébe.',
    },
    {
      title: 'Ragassz',
      body: 'A rácsháló azonosítói megmutatják a matrica helyét — minden kép oda kerül, ahová szánták.',
    },
    {
      title: 'Összeáll a nagy kép',
      body: 'A sok kicsi mozaikból kirajzolódik az előre közösen kiválasztott kompozíció. Kollégáink végig segítenek.',
    },
  ],
  featuresTitle: 'Miért különleges?',
  features: [
    {
      color: '#E94A35',
      title: 'Kétszeres élmény',
      body: 'A fotózkodás önmagában is szórakoztató — és közben mindenki próbálja kitalálni, mi lesz a végső kép.',
    },
    {
      color: '#48D880',
      title: 'Maradandó végeredmény',
      body: 'A kész mozaik a rendezvény dekorációja lesz, utólag plakátként vagy keretezett képként is kérhető.',
    },
    {
      color: '#4888F8',
      title: 'Közösségformáló',
      body: 'Mindenki hozzátesz egy darabot — a közös alkotás erősíti a résztvevők közötti kapcsolatot.',
    },
    {
      color: '#9B6BF2',
      title: 'Brandingelhető',
      body: 'A fal nyomata és a fotóautomata szoftverének felülete is a rendezvény arculatára szabható.',
    },
  ],
  useCases: ['Nagylétszámú céges esemény', 'Konferencia', 'Fesztivál', 'Jubileum', 'Brandaktiváció'],
  images: [
    {
      src: '/assets/photos/mosaic-grid.jpg',
      alt: 'Rendezvényfotókból összeálló mozaikrács — sok kicsi képből egy nagy kompozíció',
      rotate: -1,
    },
    {
      src: '/assets/photos/mosaic-hero.jpg',
      alt: 'Ünneplő tömeg konfettiesőben egy nagyszabású rendezvényen',
      rotate: 1.1,
    },
  ],
  price: {
    headline: 'Árak',
    blurb: 'Nagylétszámú eseményekre ajánljuk — a fal több méretben elérhető.',
    rows: [
      { label: '200 darabos mozaik, 130×90 cm-es nyomattal', value: '450 000 Ft-tól' },
    ],
    factors: ['a mozaik mérete és darabszáma', 'időtartam', 'helyszín'],
  },
  provide: [
    'Mozaikfal, nyomtató és minden szükséges eszköz',
    'Grafikai tervezés — a mozaikkockákat vizuális egésszé alakítjuk',
    '1 fős technikai felügyelet: nyomtatás, segítség, moderálás',
    'Igény szerint hostess a program aktivizálásához',
    'Utólagos plakát vagy keretezett kép igény szerint',
  ],
  crossLink: {
    text: 'Informatív, érinthető felületet keresel inkább?',
    label: 'Smart Wall →',
    href: '/smart-wall',
  },
}
