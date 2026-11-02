# Project Plan: Cyberpunk Brutalism UI Library

> Name: **CYBR//UI**, install namespace `@cybr`, domain **cybr-ui.com** (decided for Feature 15).
> Items marked **[DECIDE]** are open questions. I didn't want to guess the answers.
> Items marked **[VERIFY]** depend on third-party tools that change often, so check their current docs before building.

---

## 1. Problem: What problem are we solving?

Developers who want a cyberpunk or brutalist look in React and Next.js have no ready-made, polished option in that style:

- **General libraries** (shadcn/ui, Radix-based kits) are deliberately neutral. Getting a raw, industrial, neon-on-concrete look means restyling every component by hand.
- **Animated "copy-paste" libraries** such as Vengeance UI, which has about 76 components across Buttons, Text & Motion, Interactive, Layout & Cards, Tooltip & Marquee, Backgrounds and Navbar, give you high-quality motion. Their look is glassy, gooey and soft, though, which is close to the opposite of brutalism.
- **Cyberpunk brutalism resources** online are mostly moodboards, vector packs and AI-prompt style guides (Draggen, Magnific, Superdesign). None of them are production React components.

**Purpose:** a copy-paste and CLI-installable library of high-quality, animated React components in one consistent **Cyberpunk Brutalism** design language. It should let someone build a full site or app in that style quickly, without having to work out the visual rules themselves.

**Positioning:** you could describe it as "Vengeance UI's breadth of motion and interaction, with an opinionated visual system." The design system is the product, and the components are how it gets delivered.

---

## 2. Users: Who is this for?

**Primary:**
- **Front-end and creative developers** building portfolios, landing pages, product sites and side projects who want a distinctive look without designing it from scratch.
- **Indie hackers and devtool or AI startups** who want an edgy, technical brand (terminal, HUD and "declassified" aesthetics suit dev tools, security, AI and gaming).
- **Music, nightlife and fashion brands**: techno labels, club nights, streetwear drops.

**Secondary:**
- **Game and narrative projects** with cyberpunk settings that need web front ends: marketing sites, wikis, lore pages.
- **AI coding-tool users** (Cursor, v0, Claude Code) who pull components in through a registry rather than browsing docs.

**Assumed skill level:** comfortable with React, Next.js App Router and Tailwind. This isn't a no-code tool.

---

## 3. Features: What does the MVP need?

### 3a. Foundation (build first, everything depends on it)
- **Design tokens:** colours, type scale, spacing, border widths, hard-shadow offsets and motion timings, all as CSS variables and a Tailwind theme.
- **Theme presets:** a default "Concrete / Signal Orange" theme plus 1–2 alternates (for example "Acid Terminal" and "Ice Neon"), switchable by swapping variables.
- **Shared effect utilities:** scanlines, noise/grain, CRT flicker, glitch, HUD corner brackets, crosshair grid markers and warning stripes, each reusable across components.
- **`cn()` and motion helpers**, plus a shared reduced-motion hook.
- **CLI registry install:** `npx shadcn add @cybr/<component>`, or a URL-based add.
- **Docs site:** live preview, props table, a code tab, a copy-install button and a copy-source button for every component.

### 3b. MVP components (about 30, mirroring Vengeance UI's categories)

> 35 of these are mocked up on the [design canvas](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx). Section 7 maps each artboard to what to carry into the build. The mockups also added a few components that aren't in the lists below: Access/ID Card, Neon Edge Card, Classified/Redacted Card, Béton Brut background, Exposed Wiring background, Status Bar and Segmented Progress.

**Buttons**
- Hard-Offset Button: solid offset shadow that "presses in" on click
- Glitch Button: RGB-split or slice glitch on hover
- Bracket Button: HUD corner brackets that snap in on hover
- Terminal Button: `> EXECUTE_` with a blinking cursor and typed label
- Warning-Stripe Button: animated hazard-stripe fill for destructive or CTA actions

**Text & Motion**
- Decrypt / Scramble Text: random glyphs resolve to the final string
- Glitch Heading: chromatic split and slice displacement
- Typewriter Terminal Text, with an optional prompt prefix
- Counter / Telemetry Number: odometer-style stats with units
- Stencil / Mask Reveal Heading: huge uppercase type revealed by a wipe

**Interactive**
- HUD Image Frame: image with crosshair, coordinates and a scan line passing over it
- Pixelated / Dithered Image Trail, following the cursor
- Data-Readout Slider or Carousel, with index counters (`01 / 08`)
- Command Palette / Terminal Search (⌘K)
- Accordion / FAQ styled as a "classified file" with expand-to-decrypt

**Layout & Cards**
- Brutal Bento Grid: 1px-gap grid with hard borders and modular cells
- Spec Card: monospace metadata header (`UNIT / D-01`, `REV 2.6`)
- ID / Access Card, in the style of a futuristic ID badge
- Panel with exposed hardware: rivets, cable channels, corner screws
- Stat Band / Data Ribbon: full-width row of telemetry numbers

**Tooltip & Marquee**
- HUD Tooltip: bracketed box with a leader line to the target
- Ticker Marquee: industrial news-ticker or stock-tape style
- Warning Tape Marquee: diagonal hazard tape crossing a section
- Logo Wall, with grayscale-to-neon on hover

**Backgrounds**
- Blueprint / Engineering Grid, with crosshairs at intersections
- Perspective Neon Grid (synthwave floor, desaturated)
- Concrete Noise Texture, done with an SVG filter and no images
- Scanline / CRT Overlay
- Data Rain / Falling Glyphs (restrained, not Matrix-cliché)

**Navbar & Footer**
- Terminal Navbar: monospace links, active state as `[ACTIVE]`
- Status-Bar Navbar: system-status strip with time, "signal" and version
- Brutal Mega Menu: grid-panel dropdown
- Monolith Footer: oversized wordmark with a dense metadata grid

**Loaders**
- Boot Sequence Loader: line-by-line system boot log
- Progress Bar with segmented blocks and a percentage readout

### 3c. Post-MVP (explicitly not in v1)
- Three.js / React Three Fiber heavy pieces (3D wireframe heads, low-poly meshes)
- Full page templates and blocks (landing, portfolio, pricing, 404)
- Figma kit
- Form primitives (inputs, selects, checkboxes), wrapping Base UI for accessibility
- Theme builder UI on the docs site

---

## 4. Data: What are we storing?

The MVP is a static library, so there's **no user database**.

- **Component source files** (`.tsx`) in the repo
- **Registry JSON** (`registry.json` and generated `public/r/*.json` items), served statically
- **Docs content:** MDX pages per component (description, props, usage, accessibility notes) at `app/docs/components/<item>/page.mdx`, served at `/docs/components/<item>`; `/docs/components` is reserved for the component index (Feature 13)
- **Demo/preview components:** one per registry item
- **Theme token files:** CSS variables per preset
- **Optional:** privacy-friendly analytics (page views, copy-button clicks) to see which components get used

If monetised later (section 6), the store would need **users, licences and purchase records**. That's handled by the payment provider, not a custom DB, at least at first.

---

## 5. Tech: What stack are we using?

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript** | Same as Vengeance UI's install target |
| Styling | **Tailwind CSS v4**, with tokens as CSS variables | Keeps components shadcn-compatible |
| Animation | **Motion** (`motion` package, import from `motion/react`) | Motion is the successor to Framer Motion. For App Router server components, `motion/react-client` is the documented import. **[VERIFY]** |
| Heavier timelines | **GSAP**, opt-in per component only | Don't make it a dependency of every component |
| Effects | CSS + SVG filters (feTurbulence, feDisplacementMap) first, then Canvas 2D, then WebGL only if needed | Keeps bundles light |
| Accessible primitives | **Base UI** (`@base-ui/react`) for tooltip, menu, dialog, accordion | Decided in Feature 8 over Radix UI: actively developed, stable v1, `render` prop composition |
| Distribution | **shadcn registry**: `registry.json`, then `shadcn build`, which generates JSON into `public/r/` | Lets users run `npx shadcn add <url>`. Namespaced registries are also supported. **[VERIFY]** current CLI flags |
| Docs | Next.js + `@next/mdx`; Shiki for server-rendered code highlighting | Decided in Feature 4 |
| Fonts | Heavy grotesk for display (e.g. Archivo Black, Inter Black) and mono for UI/data (e.g. JetBrains Mono, IBM Plex Mono, Space Mono), via `next/font` | All are free Google Fonts. Check the licences for redistribution in templates. |
| Quality | ESLint, Prettier, Playwright visual snapshots of the demo pages | Visual regression matters for a style-led library |
| Repo | Single Next.js app (docs + registry) to start, moving to a monorepo only if an npm package is added | |

**Tooling note:** Cursor or Claude Code plus a shadcn registry MCP server would let you, and later your users, pull components into projects by prompt. **[VERIFY]** the current registry MCP setup.

---

## 6. Monetize: How will this make money?

**[DECIDE]** You haven't said yet, so here are the realistic options:

1. **Free and open source (MIT) only, as a portfolio piece.** It shows motion, design-system and front-end skill, and supports your job search and freelance work. Lowest effort.
2. **Open core (common model for this kind of library):** free MIT components, plus paid **Pro** templates or blocks (full landing pages, portfolio, music-artist or label site, e-commerce storefront), sold one-off through Lemon Squeezy, Polar or Gumroad. **[VERIFY]** current fees.
3. **Sponsorship:** GitHub Sponsors or Open Collective. Vengeance UI links to a sponsors page.
4. **Spin-offs:** a Shopify theme in the same style (it plays directly to your Shopify background), or custom-build services.

My suggestion is to start with option 1 and design for option 2: keep "blocks/templates" a separate registry namespace from day one so a paid tier can be added without restructuring.

---

## 7. UI/UX: How should this look and feel?

### What makes Cyberpunk Brutalism distinct
It sits where two things meet:
- **Brutalism:** raw, exposed structure; hard borders; square corners; flat fills; visible grids; heavy oversized type; no polish for its own sake. Digital brutalism borrows the name from post-war architecture's exposed concrete (*béton brut*).
- **Cyberpunk:** neon signal colour against dark urban greys; HUD and terminal interfaces; exposed tech (wires, pipes, circuit boards); glitch and CRT artefacts; data density.

The result should feel like **a classified terminal bolted into a concrete bunker**: heavy and mechanical, lit by one or two neon signals.

### Design mockups (visual reference for the build)

**Canvas:** [Cyberpunk Brutalism UI — Component Mockups](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx)

These mockups are the agreed visual direction. When building a component, check its artboard first and match its layout, motion and details. **The colours are not**: the palette is still provisional (see "Colour" below).

| Artboard | Components mocked up | Key details to carry into the build |
|---|---|---|
| 01 — Buttons | Hard-Offset, Glitch, HUD Bracket, Terminal, Hazard, States row | 6px solid offset shadow that presses in (3px on hover, 0 on click); RGB slice glitch on hover; corners snap out 5px; `> prompt` + blinking block cursor; marching hazard stripes for destructive actions; disabled = dashed border, no shadow |
| 02 — Text & Motion | Decrypt Text, Typewriter Terminal, Glitch Heading, Telemetry Counter, Stepped Wipe Reveal | Glyphs resolve left to right, with the real string in `aria-label`; glitch fires in short bursts about every 3s, never continuously; tabular figures for counters; `clip-path` wipe on `steps(12)` with a 300ms stagger; Replay control |
| 03 — Layout & Cards | Spec Card, Access/ID Card, Hardware Panel, HUD Image Frame, Neon Edge Card, Classified/Redacted Card, Stat Band | Grid lines made from 2px gaps over a line-coloured parent; spec header with `UNIT / REV` and a barcode; inverted light ID card with a hazard strip; rivets and a cable channel; corner brackets, crosshair and scan line on images; neon glow is the *only* glow allowed; redaction bars; full-width accent stat band |
| 04 — Tooltip & Marquee | Ticker Marquee, HUD Tooltip, Classified FAQ Accordion, Warning Tape, Logo Wall | Accent ticker strip; tooltip with an elbow leader line and bracket corners, opening on hover *and* focus; one-open-at-a-time accordion with `aria-expanded`; crossed, rotated hazard tapes; logos go from grey to accent on hover |
| 05 — Backgrounds | Blueprint Grid, Perspective Grid, Béton Brut (concrete), CRT Overlay, Data Rain, Exposed Wiring | All pure CSS/SVG with no images; 24/120px blueprint grid with crosshairs; desaturated perspective floor (no synthwave sunset); concrete via SVG noise plus formwork seams and tie holes; CRT flicker kept under 3Hz; grey data rain with one accent column; circuit traces with a signal pulse on one path |
| 06 — Navbar, Footer & Loader | Status Bar, Terminal Navbar, Mega Menu, Boot Sequence Loader, Segmented Progress, Monolith Footer | Status strip with live clock and signal bars; active link shown as `[ LABEL ]`; ⌘K search slot; accent CTA block; mega menu as a 5-column grid with a hazard-framed feature cell; boot log lines ending in OK; 20-segment progress bar with `role="progressbar"`; oversized wordmark bleeding off the bottom of the footer |

**Shared details on every artboard:** section header strip (`CYBR//UI · SECTION 0X · REV · UNIT / XXX-0X · SYS:OK`), uppercase heavy display title ending in an accent `_`, numbered component labels (`01 / NAME`), monospace spec captions, an optional scanline overlay, faint SVG grain, and a barcode or `[ 0X / 0X VARIANTS ]` footer.

**What the mockups don't settle:** final colours, the library name (`CYBR//UI` is a placeholder), real copy (bracketed placeholders like `[PHOTO]` and `[LOGO 01]`), and whether to keep the second accent (cyan, used only in the glitch split).

### Visual rules (the "spec" every component must follow)

**Colour: PROVISIONAL "Concrete / Signal" palette** (from Draggen's Cyberpunk Brutalism page). **[DECIDE]**: this palette may change, so:
- Components must **only use the colour tokens below** (CSS variables / Tailwind theme), never hard-coded hex values. Changing the palette should then mean editing one token file.
- The mockups already use a single `--signal` accent variable, with alternates tried in their Tweaks (orange `#FF4C29`, lime `#C6FF00`, cyan `#00E5FF`).
- Re-run the contrast checks below whenever the palette changes.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#212529` | Base canvas |
| `--surface` | `#343A40` | Panels, cards |
| `--line` | `#495057` | Borders, grid lines, dividers (decorative only) |
| `--dim` | `#6C757D` | Secondary UI, large labels |
| `--signal` | `#FF4C29` | The one accent: CTAs, active states, key stats |
| `--ink` | `#F8F9FA` | Body text *(my addition)* |
| `--label` | `#ADB5BD` | Small monospace labels and captions *(added in the mockups, because `--dim` fails for small text)* |
| `--ground-deep` | `#16191C` | Inset cards, text on accent backgrounds *(added in the mockups)* |
| `--ground-void` | `#0E1012` | Terminals, image frames, CRT and data-rain areas *(added in the mockups)* |
| `--neon-2` | e.g. cyan `#00E5FF` or acid `#C6FF00` | Optional second accent *(my addition, which Draggen's "neon" and "deep blues" guidance suggests)*. The mockups use cyan only in the glitch RGB split. **[DECIDE]** |

**Contrast check (WCAG 2.x, which I calculated):**
- `#F8F9FA` on `#212529`: **14.6:1** ✅
- `#FF4C29` on `#212529`: **4.64:1** ✅ AA for normal text, but only just
- `#FF4C29` on `#343A40`: **3.46:1**. Large text or UI only ⚠️
- `#6C757D` on `#212529`: **3.29:1**. Not for body text ⚠️
- `#495057` on `#212529`: **1.89:1**. Decoration only ❌ for text
- `#ADB5BD` on `#212529`: **7.43:1** ✅, on `#343A40`: **5.55:1** ✅ (this is why it's the label colour)
- `#16191C` on `#FF4C29`: **5.31:1** ✅ (dark text on accent buttons and bands)
- Alternate accents on `#212529`: lime `#C6FF00` **13.0:1**, cyan `#00E5FF` **10.0:1** ✅

**Typography**
- **Display:** heavy grotesk, UPPERCASE, tight leading (about 0.85–0.95), huge fluid sizes with `clamp()`
- **UI/data:** monospace, small fixed sizes (about 10–14px), used for labels, buttons, metadata and navigation
- Extreme scale contrast: an enormous headline sitting next to tiny telemetry text

**Shape & depth**
- Square corners (radius 0, or 2px at most)
- Thick solid borders (2–4px)
- **Solid offset shadows only, with no blur.** Glow is the one exception, reserved for neon accents.
- `display: grid; gap: 1px` over a contrasting background to get razor-thin divider grids

**Motifs**
- HUD corner brackets, crosshairs (`+`) at grid intersections, barcodes, hazard/warning stripes
- Fake system strings: `REV 2.6`, `UNIT / D-01`, `SYS:OK`, coordinates, timestamps
- Exposed "hardware": rivets, cable channels, panel seams
- Wireframe/low-poly and HUD icon sets (post-MVP for 3D)

**Texture**
- Concrete noise and grain via SVG filter, scanlines, occasional CRT flicker. Keep it **subtle**, because texture shouldn't fight content.

**Layout**
- Strict blueprint grid. Elements snap to tracks, nothing floats.
- "Bimodal density": tightly packed metadata clusters next to big empty fields around one giant word or number

**Motion**
- Mechanical, not organic: steps, snaps, wipes, glitches, decrypts, boot sequences
- Avoid gooey, liquid and elastic springs. Those are Vengeance UI's language, not this one.
- Short durations (about 120–300ms for UI) with `steps()` easing for glitch and terminal effects

### Explicit don'ts
- No glassmorphism, soft blurred shadows, pastel gradients or rounded pill buttons
- Don't overuse glitch. One glitch element per viewport is a good rule of thumb.
- Don't drift into generic neon "synthwave" (purple-pink sunsets). This style is grittier and greyer.

### Accessibility (non-negotiable)
- Every animation respects `prefers-reduced-motion`, falling back to a static or instant state
- No flashing over 3 times a second (photosensitivity guideline for CRT and glitch effects) **[VERIFY]** against current WCAG 2.3.1 wording
- Scrambled/decrypt text exposes the real string to screen readers (`aria-label` or visually hidden text)
- Keyboard focus states are bold and on-style (a thick signal-colour outline suits brutalism anyway)

### Docs site look
The docs site *is* the showcase, so it's built entirely with the library's own components: terminal navbar, blueprint-grid background, spec-card component previews.

---

## 8. Deployment: Where and how will this ship?

- **Host:** Vercel (natural fit for Next.js; free Hobby tier for non-commercial use) **[VERIFY]** whether Hobby terms allow it if you monetise; otherwise Pro or Netlify/Cloudflare
- **App type:** Next.js app (docs and registry together), mostly static
- **Build command:** `pnpm registry:build && next build` (where `registry:build` = `shadcn build`)
- **Start command:** `next start` (or fully static export, if no server features are needed **[DECIDE]**)
- **Output:** registry JSON in `public/r/*.json`, served at `https://<domain>/r/<item>.json`
- **Env vars:** `NEXT_PUBLIC_SITE_URL` (for absolute registry URLs); analytics key if used, e.g. `NEXT_PUBLIC_ANALYTICS_ID`
- **Database/storage:** none for MVP
- **Workers/cron:** none
- **Health check:** `/` or `/r/registry.json`
- **Domain:** `cybr-ui.com`. Install commands use the `@cybr` namespace mapped to `https://cybr-ui.com/r/{name}.json`.
- **Source:** public GitHub repo, MIT licence, CI running lint, type-check, registry build and Playwright snapshots on PRs

---

## 9. Usage model and constraints

**Known:**
- Internet-facing, public, static docs site; users are anonymous visitors and developers installing components
- Single maintainer to start
- Components run in *other people's* apps, so they must be self-contained, tree-shakeable and avoid global side effects (no global CSS other than the opt-in token file)

**Explicit non-requirements (MVP):**
- No accounts, auth, payments or user data
- No React Native / mobile support (web only)
- No support for Next.js Pages Router or non-Tailwind setups in v1

**Not yet established:** expected traffic, licence model for any paid tier.

---

## Sources
- [Design mockups canvas (this project)](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx)
- [Vengeance UI components](https://www.vengenceui.com/components)
- [Draggen: Cyberpunk Brutalism](https://draggen.io/styles/cyberpunk-brutalism)
- [Magnific: Cyber Brutalism vectors](https://www.magnific.com/vectors/cyber-brutalism)
- [shadcn/ui: Registry getting started](https://ui.shadcn.com/docs/registry/getting-started)
- [Motion for React](https://motion.dev/react)
- [Superdesign: Brutalism website](https://superdesign.dev/styles/brutalism/website)
- [Industrial Brutalist UI skill (Leonxlnx/taste-skill)](https://shyft.ai/skills/leonxlnx-brutalist-skill)
- [daisyUI trends: Brutalism](https://trends.daisyui.com/trend/brutalism/)
