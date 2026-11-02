# Cyberpunk Brutalism UI Library - Project Overview

<!-- blueprint:source-hash 8eddfa6daa5239928fabd1885a544ad49b1a6e259ae91d1d59b986a9287a6f53 -->

> A copy-paste and CLI-installable library of animated React components in one
> consistent Cyberpunk Brutalism design language, shipped as a shadcn registry
> plus a docs site built from its own components. Working name TBD; `CYBR//UI`
> and the `@cybr` namespace are placeholders.

## Problem

Developers who want a cyberpunk or brutalist look in React/Next.js have no
polished option. Neutral kits (shadcn/ui, Radix-based) need every component
restyled; animated copy-paste libraries (Vengeance UI) have the motion but a
glassy, soft look; existing cyberpunk-brutalism resources are moodboards and
vector packs, not components. The design system is the product; components are
how it is delivered.

## Users

- **Front-end and creative developers** - portfolios, landing pages, product
  sites wanting a distinctive look without designing it.
- **Indie hackers, devtool/AI/security/gaming startups** - edgy technical brand
  (terminal, HUD, "declassified").
- **Music, nightlife, fashion brands** - techno labels, club nights, streetwear.
- Secondary: **game/narrative web front ends**; **AI coding-tool users** pulling
  components through the registry (Cursor, v0, Claude Code).
- Assumed skill: comfortable with React, Next.js App Router, Tailwind. Not no-code.
- Access: anonymous only. No accounts.

## Usage model

- Internet-facing, public, mostly static docs site; anonymous visitors and
  developers installing components.
- Single maintainer to start.
- Components run inside other people's apps: self-contained, tree-shakeable, no
  global side effects, no global CSS except the opt-in token file.
- Non-requirements (MVP): accounts, auth, payments, user data; React Native or
  mobile; Next.js Pages Router; non-Tailwind setups.
- Not yet established: expected traffic; licence model for any paid tier.

## Features

MVP, in build-plan order. Headline: the component sets (5-11), delivered through
the registry pipeline proven in 3. Every component matches its artboard on the
[design mockups canvas](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx)
(layout, motion, details; not colours).

1. **Design tokens & fonts** - provisional palette, type scale, borders,
   hard-shadow offsets, motion timings as CSS variables + Tailwind v4 theme;
   Archivo Black + JetBrains Mono via `next/font`.
2. **Shared effects & motion helpers** - scanline, grain, HUD corners,
   crosshair, hazard stripe, glitch utilities; `cn()`; reduced-motion hook.
3. **First component end-to-end** - Hard-Offset Button through `registry.json`,
   `shadcn build`, and a verified `npx shadcn add` into a clean Next.js app.
4. **Docs component page template** - live preview, props table, code tab,
   copy-install, copy-source, accessibility notes; reused for every component.
5. **Buttons set** - Glitch, HUD Bracket, Terminal, Hazard; documented
   idle/hover/pressed/disabled states.
6. **Text & Motion set** - Decrypt Text, Typewriter Terminal, Glitch Heading,
   Telemetry Counter (counts on scroll into view), Stepped Wipe Reveal.
7. **Layout & Cards set** - Brutal Bento Grid, Spec Card, Access/ID Card,
   Hardware Panel, HUD Image Frame, Neon Edge Card, Classified Card, Stat Band.
8. **Accessible primitives decision + Tooltip & Marquee set** - pick Radix or
   Base UI; HUD Tooltip, Classified FAQ Accordion, Ticker Marquee, Warning Tape,
   Logo Wall.
9. **Backgrounds set** - Blueprint Grid, Perspective Grid, Béton Brut, CRT
   Overlay, Data Rain, Exposed Wiring; CSS/SVG only.
10. **Navbar, Footer & Loader set** - Status Bar, Terminal Navbar, Brutal Mega
    Menu, Monolith Footer, Boot Sequence Loader, Segmented Progress.
11. **Interactive set** - Command Palette (⌘K), Pixelated Image Trail,
    Data-Readout Carousel.
12. **Theme presets & switching** - lock final palette, add 1-2 alternates
    (e.g. "Acid Terminal", "Ice Neon"), verify every component swaps and passes
    contrast.
13. **Docs site built with the library** - landing page, component index and
    search, using its own components as the showcase.
14. **Quality gates in CI** - lint, type-check, registry build, Playwright visual
    snapshots, reduced-motion and keyboard checks on every PR.
15. **Launch** - name and domain, licence, Vercel deploy, README and install docs.

Post-MVP (not v1): 16 Blocks & page templates (separate registry namespace,
possible paid tier), 17 Form primitives, 18 3D pieces (React Three Fiber,
opt-in), 19 Theme builder, 20 Figma kit.

## Data model

No database. "Data" is static files in the repo; these shapes are the contracts
features depend on.

### Component (source)

- `registry/<item>.tsx` style source file (`.tsx`) - exact folder > TODO, set in
  Feature 3
- Uses only colour tokens (no hex), Tailwind classes, shared effect utilities
- Animation via `motion/react` (or `motion/react-client` in server components);
  GSAP only as an opt-in per-component dependency
- Exposes a static/instant fallback under `prefers-reduced-motion`

### Registry item (`registry.json` entry -> `public/r/<item>.json`)

- `name` (string, kebab-case) - install id, e.g. `hard-offset-button`
- `type` (registry item type, e.g. component, lib, style) - per shadcn schema
- `title`, `description` (string)
- `files` (array of source paths) - component plus any local helpers
- `dependencies` (npm packages, e.g. `motion`) and `registryDependencies`
  (other items, e.g. shared effects, `cn()`, tokens)
- Generated by `shadcn build` into `public/r/*.json`, served at
  `https://<domain>/r/<item>.json`
- Namespace: `@cybr/<item>` placeholder; blocks/templates kept in a separate
  namespace from day one
- > Locked in Feature 3. Exact schema fields: verify against current shadcn
  > registry docs.

### Docs page (MDX, one per component)

- description, props table (name, type, default, description), usage code,
  accessibility notes
- linked demo/preview component (one per registry item)
- install command and copyable source
- File `app/docs/components/<item>/page.mdx` (`<item>` = registry item
  `name`), served at `/docs/components/<item>`; built with `@next/mdx`

### Theme preset (token file)

- One CSS-variable file per preset; swapping presets swaps variables only
- Colour tokens: `--bg`, `--surface`, `--line` (decorative only), `--dim`
  (large/secondary only), `--signal` (the one accent), `--ink` (body),
  `--label` (small mono labels), `--ground-deep` (insets, text on accent),
  `--ground-void` (terminals, frames, CRT/data rain), `--neon-2` (optional,
  TODO)
- Non-colour tokens: type scale, spacing, border widths (2-4px), hard-shadow
  offsets (e.g. 6px / 3px hover / 0 pressed), motion timings (120-300ms)
- > Locked in Feature 1; palette values provisional until Feature 12.

### Analytics (optional)

- Privacy-friendly page views and copy-button clicks via a third-party key.
  No feature owns it yet (see Open questions).

## Tech stack

- **Next.js 16 (App Router) + React 19 + TypeScript** - single app for docs and
  registry
- **Tailwind CSS v4** - tokens as CSS variables in the theme; shadcn-compatible
- **Motion** (`motion` package) - default animation; verify App Router import
  guidance
- **GSAP** - heavier timelines, opt-in per component only
- **CSS + SVG filters first**, then Canvas 2D, WebGL only if needed - effects
- **Base UI** (`@base-ui/react`) - tooltip, menu, dialog, accordion primitives
  (decided in Feature 8)
- **shadcn registry + CLI** - `registry.json` -> `shadcn build` -> `public/r/`
- **MDX** via `@next/mdx` - docs content; **Shiki** - server-rendered code
  highlighting
- **next/font** - Archivo Black (display), JetBrains Mono (UI/data)
- **ESLint, Prettier, Playwright visual snapshots** - quality (Prettier and
  Playwright not installed yet)
- Single repo; monorepo only if an npm package is added

## Monetization

Not decided. Leading suggestion: free MIT as a portfolio piece now, designed for
an open-core Pro tier (paid blocks/templates via Lemon Squeezy, Polar or
Gumroad) by keeping blocks in a separate registry namespace. Sponsorship and a
Shopify theme spin-off are other options.

## UI/UX

"A classified terminal bolted into a concrete bunker": heavy, mechanical, lit by
one or two neon signals. Mockups canvas is the agreed visual direction.

**Rules every component follows**

- Colour: tokens only, never hex. Contrast: `--ink` 14.6:1 and `--label` 7.43:1
  on `--bg`; `--signal` text only on `--bg` (4.64:1), large/UI only on
  `--surface`; `--dim` not for body text; `--line` decoration only; dark
  `--ground-deep` text on accent. Re-check when the palette changes.
- Type: display is heavy grotesk, UPPERCASE, leading 0.85-0.95, fluid
  `clamp()`; UI/data is monospace 10-14px. Extreme scale contrast.
- Shape: radius 0 (2px max), 2-4px solid borders, solid offset shadows with no
  blur; glow only on neon accents. Hairline grids via `gap: 1px` over a
  contrasting parent.
- Motifs: HUD brackets, crosshairs, barcodes, hazard stripes, fake system
  strings (`REV 2.6`, `UNIT / D-01`, `SYS:OK`), rivets, cable channels.
- Texture: SVG noise/grain, scanlines, occasional CRT flicker; subtle.
- Layout: strict blueprint grid; bimodal density.
- Motion: mechanical (steps, snaps, wipes, glitch, decrypt, boot); 120-300ms;
  `steps()` easing for glitch/terminal. No gooey, liquid or elastic springs.
- Don'ts: no glassmorphism, blurred shadows, pastel gradients, pill buttons,
  purple-pink synthwave; at most one glitch element per viewport.

**Accessibility (non-negotiable)**

- Every animation honours `prefers-reduced-motion` with a static/instant state
- No flashing more than 3 times per second (CRT flicker under 3Hz; glitch in
  short bursts about every 3s); verify against WCAG 2.3.1
- Scrambled text exposes the real string (`aria-label` or visually hidden)
- Bold signal-colour focus outlines; tooltips open on hover and focus;
  accordion uses `aria-expanded`; progress uses `role="progressbar"`

**Routes**

- `/` - landing page showcase (Feature 13)
- `/docs/components/<item>` - one docs page per component (Feature 4)
- `/docs/components` - component index with search (Feature 13)
- `/r/<item>.json`, `/r/registry.json` - static registry output

The docs site is built entirely with the library's own components (terminal
navbar, blueprint-grid background, spec-card previews).

## Deployment

- Host: Vercel (verify Hobby terms if monetised; else Pro, Netlify, Cloudflare)
- App: Next.js, mostly static; `next start` or full static export (TODO)
- Build: `registry:build` (`shadcn build`) then `next build`
- Output: `public/r/*.json` served at `/r/<item>.json`
- Env vars: `NEXT_PUBLIC_SITE_URL` (absolute registry URLs);
  `NEXT_PUBLIC_ANALYTICS_ID` if analytics is used
- Storage, workers, cron: none
- Health check: `/` or `/r/registry.json`
- Domain: TODO (name not chosen; install namespace depends on it)
- Source: public GitHub repo, MIT, CI on PRs (Feature 14)

## Open questions

> Resolve these in the plans, then re-run /overview.

- **Package manager:** plan's build command uses `pnpm`; the repo is npm
  (`package-lock.json`). Pick one.
- **Static export vs `next start`:** `next.config.ts` enables
  `cacheComponents`; confirm compatibility if choosing static export.
- **Foundation ordering:** plan §3a lists theme presets and the docs site as
  foundation; build plan places them at 12 and 13. Build plan order is used.
- **Accordion placement:** plan lists it under Interactive; build plan puts the
  Classified FAQ Accordion in Feature 8. Build plan is used.
- **Mockup-only components** (Neon Edge Card, Classified Card, Béton Brut,
  Exposed Wiring, Status Bar, Segmented Progress) are in the build plan but not
  plan §3b lists; plan §3b "Data-Readout Slider or Carousel" became Carousel.
- **Analytics:** optional in plan §4; no build-plan feature owns it.
- **Second accent `--neon-2`:** keep cyan, lime, or drop.
- **Name, domain, licence for paid tier, monetization model.**
- **Prettier and Playwright** are in the plan but not installed; Feature 14
  owns CI, but local commands land via `/tests browser` or that feature.
