# Feature: Design tokens & fonts

**From build-plan:** feature 1
**Build attempt:** 1
**Branch:** feature/design-tokens-fonts
**Status:** verified

## Goal

Replace the create-next-app theme with the provisional Cyberpunk Brutalism
token set: colour, type, border, hard-shadow and motion tokens as CSS variables
mapped into the Tailwind v4 theme, plus Archivo Black and JetBrains Mono loaded
through `next/font`. Every later component styles itself only through these
tokens, so changing the palette means editing one file.

## Design reference

- [Design mockups canvas](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx),
  artboard 01 (Buttons) is the source for the concrete non-colour values below:
  - Display: Archivo Black, 132px headline, `line-height: 0.85`,
    `letter-spacing: -0.02em`, uppercase, fallback `Impact, sans-serif`
  - Mono: JetBrains Mono 400/700, fallback `ui-monospace, monospace`; sizes 10,
    11, 12, 13, 15px; label tracking `0.14em`, button tracking `0.12em`
  - Borders 1px (line), 2px, 3px; hard shadow `6px 6px 0` in ink, `3px` on
    hover, `0` pressed
  - Motion `90ms steps(2)` (press), `120ms steps(3)` (bracket snap)
  - Focus: `3px` signal outline, `6px` offset
- Colours come from the project overview palette table, which is provisional.
  Mockup colours are not authoritative.

## In scope

- One opt-in token file holding every design token as a CSS variable on `:root`
  and its Tailwind v4 `@theme inline` mapping
- Colour tokens exactly as the plan lists them: `--bg`, `--surface`, `--line`,
  `--muted`, `--signal`, `--ink`, `--label`, `--ground-deep`, `--ground-void`,
  `--neon-2`
- Type tokens: display and mono font families, a fluid display scale, small
  fixed mono sizes, display leading and tracking, label tracking
- Border width, hard-shadow offset, focus ring and motion duration/easing tokens
- `next/font/google` loading of Archivo Black and JetBrains Mono in the root
  layout, replacing Geist
- `app/globals.css` reduced to importing Tailwind and the token file, plus base
  `body` styles (dark canvas, ink text, mono font)
- A temporary token specimen at `/` replacing the create-next-app page, so the
  tokens can be seen working (Feature 13 replaces it with the real landing page)
- Root metadata title/description changed from "Create Next App" to the
  `CYBR//UI` placeholder

## Out of scope

- Effects (scanline, grain, glitch, HUD corners, hazard stripes), `cn()`,
  reduced-motion hook: Feature 2
- Registry packaging of the token file (`registry.json`, `shadcn build`):
  Feature 3
- Alternate theme presets, preset switching, locking the final palette:
  Feature 12
- Any component, global focus style on interactive elements, or docs pages
- Light mode (the scaffold's `prefers-color-scheme` switch is removed; the style
  is dark only until Feature 12 adds presets)
- Installing new dependencies (none needed)

## Build loop

`workflow.stepReview` is `feature` and `workflow.checkpointCommits` is
`disabled`: implement all steps, then present one feature-level review packet.
No per-step approval pauses or checkpoint commits. `/complete` creates the
feature commit.

## Build steps

- [x] 1. **Token file.** Create `styles/tokens.css` with the `:root` variables
  and `@theme inline` mapping in Data / contracts. Import it from
  `app/globals.css` after `@import "tailwindcss"`; remove the scaffold
  `--background`/`--foreground` variables, the Geist font mapping and the
  `prefers-color-scheme` block. Set `body` to `background: var(--bg)`,
  `color: var(--ink)`, `font-family: var(--font-mono)`.
  **Done when:** `npm run lint`, `npx tsc --noEmit` and `npm run build` pass,
  and `grep -nE '#[0-9a-fA-F]{3,8}' app/` finds no hex values (hex appears only
  in `styles/tokens.css`).
- [x] 2. **Fonts.** In `app/layout.tsx` replace Geist with `Archivo_Black`
  (`weight: "400"`, `variable: "--font-archivo-black"`) and `JetBrains_Mono`
  (variable font, `variable: "--font-jetbrains-mono"`), both
  `subsets: ["latin"]`, `display: "swap"`; apply both variable classes to
  `<html>`. Update `metadata` to title `CYBR//UI` and a one-line description of
  the library. Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
  first and follow it if the API differs.
  **Done when:** build passes and the built HTML for `/` contains both
  `next/font` class names on `<html>`; no `Geist` import remains.
- [x] 3. **Token specimen at `/`.** Replace `app/page.tsx` with a server
  component that shows every token using only token utilities (no hex, no
  arbitrary colour values): a swatch per colour token with its name and value
  label, the display scale (uppercase headline ending in a `--signal` `_`), the
  mono size steps, the border widths, a hard-shadow block at each offset
  (static; no interaction), and a list of the motion tokens as text. Remove
  unused scaffold SVGs from `public/` only if nothing references them.
  **Done when:** lint, typecheck and build pass; `/` renders on `--bg` with
  Archivo Black display text and JetBrains Mono labels (browser screenshot if a
  browser is available, otherwise the built HTML/CSS shows the token classes and
  font variables).

## Files / areas

- `styles/tokens.css` (new) - the single opt-in token file
- `app/globals.css` - Tailwind import, token import, base body styles
- `app/layout.tsx` - fonts and metadata
- `app/page.tsx` - temporary token specimen
- `public/*.svg` - scaffold assets, removed only if unreferenced

## Data / contracts

The token names below are the contract later components and Feature 3's
registry item depend on. Values are provisional; names should not change
without re-running `/overview` and checking dependent features.

**Colour (`:root`)** - plan palette, hex only in this file:

| Variable | Value | Tailwind colour (`--color-*`) |
|---|---|---|
| `--bg` | `#212529` | `bg` |
| `--surface` | `#343A40` | `surface` |
| `--line` | `#495057` | `line` (decorative only) |
| `--muted` | `#6C757D` | `muted` (large/secondary only) |
| `--signal` | `#FF4C29` | `signal` |
| `--ink` | `#F8F9FA` | `ink` |
| `--label` | `#ADB5BD` | `label` |
| `--ground-deep` | `#16191C` | `ground-deep` |
| `--ground-void` | `#0E1012` | `ground-void` |
| `--neon-2` | `#00E5FF` | `neon-2` (provisional, see Notes) |

Mapping uses `@theme inline { --color-bg: var(--bg); ... }` so utilities like
`bg-bg`, `bg-surface`, `text-ink`, `text-label`, `border-line`, `text-signal`
resolve to the `:root` variables and a later preset can swap them.

**Type**

- `--font-display: var(--font-archivo-black), Impact, sans-serif`
- `--font-mono: var(--font-jetbrains-mono), ui-monospace, monospace`
  (overrides Tailwind's default `font-mono`)
- Display scale (Tailwind `--text-*` with paired `--line-height` and
  `--letter-spacing`): `display-xl` `clamp(4rem, 10vw, 8.25rem)` (132px max,
  from the mockup), `display-lg` `clamp(2.5rem, 6vw, 5rem)`, `display-md`
  `clamp(1.75rem, 3.5vw, 3rem)`; leading `0.85` / `0.9` / `0.95`, tracking
  `-0.02em`
- Mono sizes added to Tailwind defaults: `text-micro` `0.625rem` (10px),
  `text-caption` `0.6875rem` (11px); 12/13/15px use Tailwind `text-xs` or the
  nearest default (record any arbitrary size choice in the review)
- `--tracking-label: 0.14em`, `--tracking-button: 0.12em` (Tailwind
  `tracking-label`, `tracking-button`)

**Shape, depth, focus**

- `--border-hair: 1px`, `--border-base: 2px`, `--border-heavy: 3px`,
  `--border-max: 4px`
- `--offset-hard: 6px`, `--offset-hard-hover: 3px`, `--offset-hard-pressed: 0px`
- Tailwind `--shadow-hard: var(--offset-hard) var(--offset-hard) 0 0 var(--ink)`
  and `--shadow-hard-hover` at the hover offset (utilities `shadow-hard`,
  `shadow-hard-hover`); no blur in any shadow token
- `--focus-width: 3px`, `--focus-offset: 6px` (consumed by components later)
- No radius tokens: components use `rounded-none` (2px max per plan)

**Motion**

- `--duration-snap: 90ms`, `--duration-fast: 120ms`, `--duration-base: 200ms`,
  `--duration-slow: 300ms`
- Tailwind `--ease-step-2: steps(2)`, `--ease-step-3: steps(3)`,
  `--ease-step-12: steps(12)` (utilities `ease-step-2` etc.; `steps(12)` is the
  mockup's wipe-reveal timing)

**Token file constraints** (components run in other people's apps)

- Only `:root` custom properties and `@theme inline`; no element selectors, no
  resets, no `@font-face`. Base `body` styles live in `app/globals.css`, not in
  the token file.
- Fonts are the consumer's responsibility via `next/font`; the token file only
  references `--font-archivo-black` / `--font-jetbrains-mono` with fallbacks.

## Testing

- No test command is configured, so there is no unit-test gate. This feature is
  CSS and layout only, with no logic to test.
- Verification per step: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- `next/font/google` downloads fonts at build time; a build failure from no
  network is an environment blocker to report, not a reason to self-host.
- UI evidence (`verification.uiEvidence: when-available`): screenshot `/` from
  the dev or production server if a browser tool is available; otherwise report
  that only build output was checked.

## Notes for the AI

- Read the Next.js 16 font and CSS guides in `node_modules/next/dist/docs/`
  before step 2. `cacheComponents` is on; the specimen page is static and needs
  no data APIs.
- Tailwind v4 is CSS-first: there is no `tailwind.config.*`. Confirm `@theme
  inline` inside an imported file is picked up through
  `@tailwindcss/turbopack` by checking a token utility appears in the built CSS.
- `--neon-2` is a plan `[DECIDE]`. It uses cyan `#00E5FF` because the mockups
  use cyan in the glitch split. It is provisional and Feature 12 settles it.
- `--duration-base: 200ms` is the only motion value not taken directly from the
  mockup; it sits inside the plan's 120-300ms range.
- Contrast pairs are already verified in the plan for these values; the
  specimen must not put `--muted` or `--line` on small text or `--signal` on
  `--surface` for small text.
- No em dashes in code comments or copy.

## Implementation notes

- Base body styles are Tailwind utilities on `<body>` in `app/layout.tsx`
  (`bg-bg text-ink font-mono`) rather than CSS in `app/globals.css`, because
  Tailwind only emits theme variables like `--font-mono` when a utility uses
  them. `app/globals.css` now only imports Tailwind and the token file.
- Specimen swatches label each colour with its token name and use, not its hex
  value, so hex stays only in `styles/tokens.css` (step 1 done-when).
- All five scaffold SVGs in `public/` were unreferenced and removed.
- Verified: `npm run lint`, `npx tsc --noEmit`, `npm run build` pass; no hex or
  Geist in `app/`; built `<html>` carries both `next/font` variable classes;
  built CSS contains the `:root` tokens and the token utilities. No browser
  screenshot was captured (no browser tool in this session).


<!-- blueprint:completion {"schemaVersion":2,"specBytes":10896,"specSha256":"98f8a26b37d86388f7e68183dffa467848c47aaf9f491122ed76661a259399e0","branch":"refs/heads/feature/design-tokens-fonts","head":"8330a7b7ee51b92d6313327931cc4c483a2db2f2","baseRef":"refs/heads/main","baseCommit":"8330a7b7ee51b92d6313327931cc4c483a2db2f2","sourceTree":"0d028fd22698178b0b693956db47ad43b90e5224","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, then open http://localhost:3000

Expected:

A dark charcoal page with a huge uppercase "TOKENS_" headline in Archivo Black
(orange underscore), then six numbered sections in JetBrains Mono: 01 Colour
(10 swatches), 02 Display, 03 Mono, 04 Borders, 05 Hard shadow (three orange
blocks, the last two shifted into their shadow) and 06 Motion.

This proves:

The tokens, the Tailwind mapping and both fonts load and render together in the
app.
