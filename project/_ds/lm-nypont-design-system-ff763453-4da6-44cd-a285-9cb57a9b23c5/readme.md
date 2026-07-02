# Élménypont — Design System

> **Meleg playfulness, prémium kivitelben.** A mosoly marad, de drágán néz ki.
> *A játékosságot tesszük drágává — a vidámság nem kedvezmény, hanem érték.*

Élménypont egy 10+ éves magyar rendezvény-élmény szolgáltató. Fényképezés köré szervezett, látványos programok: **fotóautomata**, **greenbox fotózás**, és a zászlóshajó **AI Selfiemata** — valós idejű AI képgenerálás, ami minden vendégből főszereplőt csinál. A gerinc-koncepció: **„Lehetsz bárki."**

Ez a design system a két forrás-világ (a meleg, bulis `elmeny.hu` + a prémium, tech-vezérelt `ai.elmeny.hu`) egységesített irányát kódolja design tokenekbe, komponensekbe és UI kitekbe.

---

## Forrás-anyagok (a `uploads/` mappában érkezett)

- `brand-direction.md` — ⭐ a fő stratégiai dokumentum (5 alappillér, keep/adopt/drop).
- `voice-messaging.md` — hang & üzenet (7 alapelv, szlogen-architektúra, két fokozat).
- `visual-tokens.md` — a valós színek, tipó, doodle-szabályok.
- `new-ai-elmeny.md` / `old-elmeny.md` — a két forrás-oldal nyersanyaga.
- `ai-elmeny-full.pdf` — az AI Selfiemata teljes landing PDF-je (innen lettek kinyerve a fotók, doodle-ok, logók).
- Élő források: `elmeny.hu` (régi) + `ai.elmeny.hu` (új), lehúzva 2026-06-27.

A logók, doodle-ok, doodle-mintás hátterek és a stílus-fotók a `assets/` mappában élnek.

---

## A két fokozat, egy brand

Nem két brand — **ugyanaz a brand a közönséghez öltözve.**

| | B2C / fesztivál fokozat | B2B / céges fokozat |
|---|---|---|
| Érzet | melegebb, színesebb, energikus | sötét/mono, visszafogott, sok levegő |
| Háttér | cream + coral doodle alnyomat halványan | ink (`#17150D`) + ritka fehér doodle |
| Akcent | coral jelenlétesebb | egy domináns akcent, fegyelmezetten |
| Hang | „Dobd fel a bulit!" | „Tedd emlékezetessé a rendezvényt." |

---

## CONTENT FUNDAMENTALS — hogyan írunk?

**A hang egy mondatban: laza, de profi.** Olyan, mint egy jó haver, aki történetesen a szakma legjobbja — lelkes, közvetlen, de soha nem gagyi és soha nem védekező.

**Megszólítás:** mindig **tegeződő** magyar. „Keress minket bátran", „Dobd fel a bulit!", „Lehetsz bárki." Soha nem hivataloskodunk, soha nem magázunk. Az „én" helyett **„te"** a főszereplő — a vendég élménye a sztori, nem a mi gépünk.

**Casing:** a címsorok normál mondatkezdéssel (nem ALL CAPS). Az **eyebrow / label** szintű szöveg viszont uppercase + letterspaced: `MIÉRT MOST? MIÉRT AI?`, `AI STÍLUSOK`, `SZEMÉLYRE SZABÁS`. A capslock CSAK ezeknél a kis címkéknél — a futószövegben tilos.

**Az em-dash a kézjegyünk.** Ütős leleplezésekhez: „A fotóautomata újraírva — AI Selfiemata.", „Egy új generációs szelfigép — mesterséges intelligenciával." A gondolatjel a poén/fordulat előtt áll.

**Bizonyíték a lelkesedés mellé.** A wow-t mindig számmal támasztjuk alá: **9–15 mp** AI generálás · **4+ stílus** · **100%** rendezvényre szabva · „3× nagyobb valószínűséggel kerül social médiára". Stat-blokk = nagy szám + rövid felirat.

**Élmény-ígéret, nem feature-lista.** Azt áruljuk, amit a vendég *érez*, nem amit a gép csinál. „Élményt adunk." „amit otthon nem tudsz könnyen megcsinálni." Mindig a megfoghatatlan pluszt emeljük ki (otthon-nem-tudod kontraszt).

**CTA-k:** puha + erős párban. Puha: „Stílusok ↓". Erős: „Ajánlatot kérek →", „Kérek bemutatót →", „Küldd el az üzenetet! →". A nyíl (`→` / `↓`) a CTA-k állandó kísérője.

**Számozott narratíva:** vezetett szekciók nagy `01` `02` `03` sorszámokkal, akcentszínben.

**Emoji:** ❌ nem. A „playful" réteget a **doodle-ok** és a **kerek logó** viszik, nem emoji. Unicode nyíl (→ ↓) és a `✦` szikra-jel viszont a brand része (before/after: `Eredeti → AI ✦`).

### Tiltólista (amitől gagyi lenne)
- Felkiáltójel-özön, capslock a futószövegben.
- Üres szuperlatívuszok konkrétum nélkül („a legjobb élmény valaha").
- Túlmagyarázás / mentegetőzés az AI miatt.
- Hideg, vállalati zsargon — magabiztos ≠ rideg.

---

## VISUAL FOUNDATIONS

**A feszültség feloldása:** a playful jel lefelé húzhatná az árazást. NEM a logót/hangot komolyítjuk — hanem a **környezetet** emeljük: éles editorial fotók, színfegyelem, sok levegő, kifinomult másodlagos tipó.

**Színrendszer — meleg alap + rétegzett akcentek.**
- Alap mindig **semleges és meleg**: ink `#17150D` (warm near-black, NEM rideg fekete) vagy cream `#F6F1E9` (warm off-white, NEM tiszta fehér) + sok whitespace.
- **Coral `#E94A35` = MASTER brand** (Élménypont esernyő — meleg, emberi). A logó színe.
- **Purple `#9868F8` + green/teal/blue = TERMÉK-akcent** (AI Selfiemata — tech, wow).
- *A márka meleg, a termék tech* — nem versengenek, rétegződnek.
- **Szabály:** egy felületen **egy** domináns akcent, max ~10–15% felület. Az alap mindig semleges. Soha nem „úszik mindent a korall".
- Az AI signature gradient (purple→blue) CSAK termék-felületeken, szűken.

**Tipográfia.** **Syne** (display, SemiBold/Bold, tight tracking) a címsorokra — karakteres, enyhén geometrikus, „prémium de nem unalmas". **DM Sans** (Regular/Medium) a futószövegre/UI-ra — tiszta, barátságos geometrikus sans. A kerek, kézzel rajzolt „élménypont" wordmark **jel**, nem szövegfont — önállóan, brandmarkként.

**Háttér / textúra.** Két regiszter:
1. **Doodle alnyomat** — a brand kézjegye. EGYSZÍNŰ, **alacsony opacitású (≈4–8%)**, nagy léptékű textúraként (`assets/patterns/EP_bg_white.png` fehér minta, `EP_bg_coral.png` korall minta). Soha nem teljes telítettségű, teljes felületű — az a „gyerekzsúr" csapda.
2. **Editorial fotó** — full-bleed AI-stílusfotók és before/after kompozíciók. Warm, kontrasztos, filmes világítás.
> A doodle = a brand keze (chrome/dekoráció). Az AI-fotó = a termék kimenete (showcase). **A kettőt nem keverjük egy képkockában.**

**Forma-nyelv.** Kerekített sarkok mindenhol (a kerek logóból következik), **pill-CTA**-k (`border-radius: 999px`). Kártyák: lágy, meleg-tónusú árnyék (soha nem hideg szürke), `--radius-lg` (22px) lekerekítés, vékony `--border-soft` szegély a cream felületeken. A „mosoly" mint motívum (az `e` = arc) loaderként/ikonként újrahasznosítható. A `✦` szikra a transzformáció jele.

**Árnyékrendszer.** Meleg-tintált, lágy árnyékok (`rgba(23,21,13,...)` — sosem tiszta fekete). Coral/AI glow csak a hangsúlyos CTA-kon (`--shadow-coral`, `--shadow-ai`). Belső árnyék ritka.

**Animáció.** Snappy `--ease-out`, és egy finom `--ease-spring` (enyhe bounce) a playful elemekhez. Fade + kis elmozdulás a szekció-belépőkhöz. **Hover:** akcentszín sötétebbre + enyhe emelkedés (translateY). **Press:** apró összehúzódás (`scale(.97)`) + sötétebb szín. Soha nem végtelen, figyelemelterelő loop a tartalmon.

**Transzparencia / blur.** Visszafogottan — sötét felületen lévő üveg-fejlécre, vagy a doodle alnyomatra. Nem öncélú glassmorphism.

**Layout.** `--container` 1200px, `--container-narrow` 760px. Bőséges `--section-y` (64–128px) függőleges ritmus. Az olcsó zsúfol — a prémium teret hagy.

### LANDING / LIGHT MODE PLAYBOOK (a B2C fokozat alapértelmezése)
A marketing-landingek **világos-dominánsak**: a cream (`#F6F1E9`) az úr, a **korall az akcent** (a logó színe), az ink csak grounding/footer. Konkrét szabályok:
- **Háttér:** cream a fő; egy-egy szekció lehet `--surface-sunken` (cream-200) a ritmusért. **Egyetlen** bátor korall színblokk a fő CTA-sávnak (ajánlatkérő) — ez a domináns akcent megtestesülése.
- **Bátor formák és vágások:** `clip-path`-os ferde szekció-élek (pl. a korall CTA-sáv felső éle átlós), elforgatott/eltolt korall blokkok a fotókeretek mögött (`transform: rotate(2–3deg)`), levágott sarkú fotókeretek (`polygon(... 86% 100% ...)`). A vágás legyen magabiztos, nem félénk.
- **Doodle-ok mint dekor:** a recolorolt korall/ink doodle-okat (lásd lent) szellősen, szekciónként 1-2-t, a tartalom mellé/sarkokba. Soha nem a showcase-fotó keretébe.
- **Mikro-animációk (finoman, `prefers-reduced-motion`-gate-elve):** a **rakéta a húzott (dashed) vonalon** repül (`RocketDivider`) — ez a brand kézjegy-animációja; a doodle-ok lágyan lebegnek (`float`) vagy billegnek (`wiggle`). Soha nem a tartalmat rejtő opacity-0 belépő (a látható végállapot az alap — különben pause-olt iframe-ben eltűnik a tartalom).
- **Doodle alnyomat:** néhol halvány (4–8%) korall vagy fehér doodle-minta a háttérben.
- **Sötét horgony + bátor másodlagos színek:** a világos szekciókba is kerüljön **ink (sötét) elem** kontrasztnak (pl. a hero stat-sávja ink panelen ül) — ettől prémium. A korall a **master/domináns** akcent, de az AI tech-paletta (**purple `#9868F8`, green `#48D880`, teal `#28D0B8`, blue `#4888F8`**) bátran használható **másodlagos, per-elem/per-szekció akcentként**: pl. a stat-számok, a stílus-pillek, a számozott lépések kaphatnak külön-külön színt. Egy felületen továbbra is egy domináns hangsúly maradjon — a többi szín ritmust ad, nem zajt.
- **B2B fokozat** ugyanezt a sötét/ink alapra fordítja: ritka fehér doodle, visszafogottabb vágások, kevesebb animáció.

---

## ICONOGRAPHY

Az Élménypontnak **nincs hagyományos vonalas ikonkészlete** — a vizuális jelrendszert a **doodle-ok** adják.

- **6 egyedi doodle** (`assets/doodles/`): rakéta, megafon, polaroid, 3D szemüveg, „Hello!" buborék, boombox. Kézzel rajzolt, egy-vonalas stílus. A gyökér PNG-k **fehér** vonalas változatok (sötét háttérre); a `assets/doodles/coral/` és `assets/doodles/ink/` mappákban a korall és ink recolorolt változatok élnek (világos háttérre). A doodle-mintás hátterek korall és fehér változatban is megvannak.
- **Használat:** akcentként szellősen (egy doodle/szekció, sok levegővel), vagy alnyomatként halványan. B2C-ben jelenlétesebb, B2B-ben akár 1/oldal vagy semmi.
- **Unicode mint ikon:** a brand a `→` `↓` nyilakat (CTA-kísérő) és a `✦` szikrát (transzformáció/AI jel) használja. Ezek a futószöveg részei.
- **Emoji:** nem használunk.
- **UI ikonok (a kitekhez):** ahol funkcionális ikon kell (menü, bezárás, nyíl), a **[Lucide](https://lucide.dev)** készletet linkeljük CDN-ről — vékony (1.75–2px), kerek végződésű stroke, ami illik a kerek logó-érzethez. ⚠️ *Substitution flag:* a Lucide nem a brand saját készlete, hanem a legközelebbi illeszkedő nyílt forrású match. Ha van saját UI-ikonkészlet, cseréljük.

---

## VISUAL ASSETS (`assets/`)

- `logo/` — `elmenypont-logo-coral.png` (világos háttérre), `elmenypont-logo-white.png` (sötétre). A kerek mosolygó „e" + wordmark.
- `doodles/` — 6 doodle PNG fehér vonalas változatban + `coral/` és `ink/` recolorolt almappák (világos háttérre).
- `patterns/` — `EP_bg_coral.png` (korall doodle minta fehéren), `EP_bg_white.png` (fehér doodle minta, transzparens → sötét háttérre).
- `photos/` — a „Lehetsz bárki" transzformáció-sztori: `original.png` (valós fotó) → `style-masterpiece.png` (Van Gogh), `style-epic-pirate.png`, `style-karikatura.png`, `style-pixar.png`, `style-anime.png`, `style-cyberpunk.png`, `style-astronaut.png`. Plusz `hero-before-after.jpg` (gála → űrhajós split) és `booth.png` (az AI Selfiemata állomás).

---

## INDEX — mi hol van

**Foundations / tokenek**
- `styles.css` — gyökér belépő (csak `@import`-ok). Consumerek ezt linkelik.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `fonts.css`

**Komponensek** (`components/core/` — `window.LmNypontDesignSystem_ff7634`)
- `Button`, `Pill`, `Badge`, `StatBlock`, `Card`, `Field`, `BeforeAfter`, `StyleChip`, `Eyebrow`, `DoodleMark`

**UI kit** (`ui_kits/ai-selfiemata/`)
- AI Selfiemata landing — interaktív, többképernyős recreation (hero, miért-AI, stílusgaléria, hogyan működik, ajánlatkérő).

**Sample slides** (`slides/`)
- Title, Stat, Style-gallery, Before/After, Quote, Closing slide-típusok.

**Design System tab** — minden `@dsCard`-taggelt `.html` (foundation specimen kártyák + komponens kártyák).

**Skill** — `SKILL.md` (Claude Code-kompatibilis).

---

## CAVEAT — fontok
A **Syne** és **DM Sans** lokálisan csomagolt variable TTF fontok (`assets/fonts/`), a `tokens/fonts.css` `@font-face` szabályaival — **offline is működik**. SIL OFL licenc (`uploads/Syne/OFL.txt`). Ezek a brand által megadott valós családok.
