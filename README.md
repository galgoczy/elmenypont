# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Elmenypont Hub - A.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Elmeny.hu átdizájn 2026` project files (HTML prototypes, assets, components)

---

## Implementation

The **A** direction (`project/Elmenypont Hub - A.dc.html`) has been implemented as a
production **React + Vite + TypeScript** single-page app in this repo.

### Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

### Layout

- `index.html` — app entry
- `src/main.tsx`, `src/App.tsx` — bootstrap + page composition
- `src/styles/global.css` — design-system tokens (colors/typography), local
  `@font-face` (Syne + DM Sans), keyframes, base styles
- `src/hooks/useScene.ts` — the single scroll/resize-driven scene (hero
  sticky-scroll progress + the rocket following the serpentine SVG path)
- `src/components/` — one component per section (Nav, Hero, Marquee,
  TrendSection, WhatWeDo, Services, MoreSelfiematak, OtherServices, IsoScene,
  WhyUs, Partners, ContactCTA, Footer) plus shared primitives (`Reveal`,
  `Doodle`, `ImageSlot`, `BeforeAfter`)
- `public/assets/`, `public/fonts/` — logos, doodles, photos and the bundled
  variable fonts, copied from the design bundle

The design bundle under `project/` and `chats/` is kept intact as the reference.

### Notes for the client

- The auto-scrolling photo strip in **Mit csinálunk** and the Greenbox/Selfiebox
  card images are `ImageSlot` placeholders — drop real photos in later by passing
  a `src` to those slots.
- Contact address is `hello@elmeny.hu`; the form is a front-end demo (wire it to
  a backend / mail service before going live).
