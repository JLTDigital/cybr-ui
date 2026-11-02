# Feature: Docs site built with the library

**From build-plan:** feature 13
**Build attempt:** 1
**Branch:** feature/docs-site-built-with-the-library
**Status:** verified

## Goal

Turn the app into the library's own docs site: replace the temporary token
specimen at `/` with a real landing page, add the component index with search
at `/docs/components`, and give every page one shared site header and footer.
The site uses the library's own components (Terminal Navbar, Blueprint Grid,
Command Palette, cards, Monolith Footer) as the showcase.

## Design reference

- Visual direction: the [design mockups canvas](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx).
  This planning pass could not read it (it is a typed artifact), and no
  dedicated landing or index artboard is confirmed. Compose the pages from the
  existing component artboards and the UI/UX rules in
  `blueprint/context/project-overview.md`. If a landing or docs-site artboard
  turns up during Implement, match its layout and motion (not its colours).
- Tokens only, never hex. Contrast rules apply: `--signal` text only on
  `--bg`; `--dim` and `--line` never for body text; dark `--ground-deep` text
  on accent fills.
- At most one glitch element per viewport. No glassmorphism, blurred shadows,
  pill buttons or springs.

## In scope

- **Catalogue** (`app/docs/_lib/catalog.ts`): the seven component sets in
  build-plan order, each listing its registry item names. Built from
  `registry.json` through `getRegistryItem`, so an unknown name fails the
  build. It also fails the build when any `registry:ui` item is missing from
  the catalogue or listed twice. Non-UI items (`tokens`, `theme-*`, `effects`,
  `use-reduced-motion`) are not in the catalogue.
- **Shared site chrome** in the root layout, on `/` and every
  `/docs/components/*` page:
  - Header: a skip link to `#main`, then a Terminal Navbar with the
    `CYBR//UI` brand linking to `/`, links `COMPONENTS` (`/docs/components`,
    current on any `/docs/components*` path) and `INSTALL` (`/#install`), and
    actions holding the existing Theme Switcher and the site search.
  - Site search: a Command Palette whose groups are the catalogue sets.
    Choosing an item navigates to `/docs/components/<name>`. Its ⌘K/Ctrl+K
    shortcut is off on `/docs/components/command-palette`, so it does not
    fight the live demo there. Its trigger button still works on that page.
  - Footer: a Monolith Footer with a `SETS` column (links to
    `/docs/components#<set-id>`), a `DOCS` column (Components, Install) and a
    `SYSTEM` column of plain text strings (for example the component count and
    `SYS:OK`). No licence, domain, repo or name claims; Feature 15 owns those.
  - The docs layout drops its own header (the site header replaces it) and
    keeps its `<main>` container, now with `id="main"`.
- **Landing page `/`** (replaces the token specimen), a server component in
  one `<main id="main">`:
  - Hero on a Blueprint Grid with a Glitch Heading (the page's only glitch
    element), a short tagline, a link CTA to `/docs/components` (an anchor
    styled with the library, never a button inside a link), and the install
    command for the whole library, `npx shadcn@latest add @cybr/all`, through
    the existing `InstallCommand` (`id="install"` on its wrapper), with a line
    saying single components install from their docs pages.
  - A Stat Band whose numbers come from data: component count and set count
    from the catalogue, theme count from `THEMES`. No hardcoded counts.
  - A set grid: one Neon Edge Card per set (title, item count, set code)
    linking to `/docs/components#<set-id>`.
  - A small live specimen area (for example a Brutal Bento Grid holding a few
    buttons, a Telemetry Counter and a Segmented Progress), each cell linking
    to its docs page.
  - Root metadata stays; the page needs no separate title.
- **Component index `/docs/components`** (`app/docs/components/page.tsx`,
  server) with page metadata `Components · CYBR//UI`:
  - Heading, a one-line intro, then a client `ComponentIndex` that receives the
    catalogue as props.
  - A labelled `type="search"` input. Matching is a case-insensitive substring
    test on the trimmed query against each item's title, name, description and
    set label. An empty or whitespace query shows everything.
  - Results grouped by set under a heading with `id="<set-id>"`. Sets with no
    matches hide. Each item is a link card to `/docs/components/<name>` showing
    title, set code and description.
  - A polite live region with the result count (`12 / 38 COMPONENTS`).
  - Empty state: `NO MATCH FOR "<query>"`, with the query rendered as React
    text, plus a clear button that empties the query and returns focus to the
    input.
- Delete `app/_components/motion-status.tsx` (only the specimen uses it).
- **`@cybr/all` bundle** (added after review at the user's request): one
  `registry.json` item named `all` with no files of its own, whose
  `registryDependencies` list every `registry:ui` item as `@cybr/<name>`. Their
  own dependencies pull in tokens, effects and helpers. The opt-in theme
  presets are not included. The catalogue build guard also fails when the
  bundle is missing a `registry:ui` item or lists something that is not one.

## Out of scope

- A tokens or themes docs page, or keeping the token specimen anywhere else.
  Git history keeps it.
- Syncing the search query to the URL, fuzzy matching, or searching docs page
  bodies.
- A sidebar or previous/next navigation on component pages.
- `not-found.tsx`, analytics, a GitHub or repo link, licence text, the final
  name or domain (Feature 15), and CI or Playwright (Feature 14).
- Changes to any `registry/ui/*` component, or to `registry.json` beyond the
  `all` bundle item. If a component cannot be composed as needed, record it and
  stop instead of editing it.

## Build loop

`workflow.stepReview` is `feature`, so build all steps, then stop for one review
of the whole feature. `workflow.checkpointCommits` is `disabled`, so make no
commits during Implement. `/complete` creates the single feature commit.

## Build steps

- [x] 1. **Catalogue.** Add `app/docs/_lib/catalog.ts` with the seven sets
  (ids, labels, short codes) and their items, resolved through
  `getRegistryItem`, plus the completeness check against `registry:ui` items.
  Export the set list and a flat item list typed for the index, landing,
  footer and palette.
  - **Done when:** `npx tsc --noEmit` passes, and temporarily removing one item
    from a set makes `npm run build` fail with a message naming it (then
    restore it).
- [x] 2. **Site header, search and footer.** Add `app/_components/site-header.tsx`
  (client, `usePathname` for the current link and the palette shortcut rule),
  `app/_components/site-search.tsx` (client, Command Palette + `useRouter`),
  and `app/_components/site-footer.tsx`. Render them in `app/layout.tsx` around
  `children`. Remove the header from `app/docs/components/layout.tsx` and give
  its `<main>` `id="main"`. Read the relevant guide in
  `node_modules/next/dist/docs/` for `usePathname` under `cacheComponents`; if
  the build reports blocking or uncached data, follow that guide (for example a
  Suspense boundary) rather than turning caching off.
  - **Done when:** in `npm run dev`, every existing component page shows the
    new header and footer; the theme switcher still swaps presets; ⌘K opens
    site search on `/docs/components/hard-offset-button` and choosing
    "Glitch Button" lands on its page; on `/docs/components/command-palette`
    ⌘K opens only the demo palette; the skip link is the first Tab stop and
    moves focus to the main content; lint and typecheck pass.
- [x] 3. **Component index.** Add `app/docs/components/page.tsx` and
  `app/docs/_components/component-index.tsx` with the search, grouping,
  anchors, live count and empty state above.
  - **Done when:** `/docs/components` lists all 38 components in seven sets;
    typing `glitch` leaves Glitch Button and Glitch Heading in their sets and
    announces `2 / 38`; typing `zzz` shows the empty state, and the clear
    button restores the full list with focus back in the input;
    `/docs/components#backgrounds` scrolls to that set; every card link opens a
    real page.
- [x] 4. **Landing page.** Replace `app/page.tsx` with the landing sections
  above and delete `app/_components/motion-status.tsx`.
  - **Done when:** `/` shows the hero, install command (copy works), stat band
    with data-driven counts, set cards and live specimens; the `INSTALL` link
    and every set card land on the right place; with
    `prefers-reduced-motion: reduce` the glitch, counter and other motion show
    their static state; each preset in the theme switcher keeps text legible.
- [x] 5. **Whole-site pass.** Check widths from 375px to desktop (navbar folds
  into its MENU panel, no horizontal scroll), keyboard-only use of header,
  palette, index and landing, and that only one glitch element is visible per
  viewport.
  - **Done when:** `npm run lint`, `npx tsc --noEmit` and `npm run build` pass,
    and `/`, `/docs/components` and two component pages are checked in the
    browser at mobile and desktop widths with the results recorded under
    Implementation notes.

- [x] 6. **`@cybr/all` bundle.** Add the `all` item to `registry.json`,
  extend the catalogue guard to check it, and switch the landing install
  command to it.
  - **Done when:** `npm run registry:build` writes `public/r/all.json` with all
    38 components as dependencies; removing one from the bundle makes
    `npm run build` fail naming it (then restore it); the shadcn CLI resolves
    `@cybr/all` from the local registry to the 38 components; the landing copy
    button copies `npx shadcn@latest add @cybr/all`; lint, typecheck and build
    pass.

## Files / areas

- New: `app/docs/_lib/catalog.ts`, `app/_components/site-header.tsx`,
  `app/_components/site-search.tsx`, `app/_components/site-footer.tsx`,
  `app/docs/components/page.tsx`, `app/docs/_components/component-index.tsx`
- Changed: `app/layout.tsx`, `app/page.tsx`, `app/docs/components/layout.tsx`,
  `registry.json` (the `all` item only)
- Deleted: `app/_components/motion-status.tsx`
- Read-only reuse: `registry/ui/*` (terminal-navbar, command-palette,
  monolith-footer, blueprint-grid, glitch-heading, stat-band, neon-edge-card,
  bento-grid, telemetry-counter, segmented-progress, buttons),
  `app/_components/theme-switcher.tsx`, `app/_lib/themes.ts`,
  `app/docs/_lib/registry.ts`, `app/docs/_components/install-command.tsx`

## Data / contracts

- Catalogue sets, in this order (38 items in total):
  - `buttons` / Buttons / `BTN`: hard-offset-button, glitch-button,
    hud-bracket-button, terminal-button, hazard-button
  - `text-motion` / Text & Motion / `TXT`: decrypt-text, typewriter-terminal,
    glitch-heading, telemetry-counter, stepped-wipe-reveal
  - `layout-cards` / Layout & Cards / `CRD`: bento-grid, spec-card,
    access-card, hardware-panel, hud-image-frame, neon-edge-card,
    classified-card, stat-band
  - `tooltip-marquee` / Tooltip & Marquee / `TIP`: hud-tooltip,
    classified-accordion, ticker-marquee, warning-tape, logo-wall
  - `backgrounds` / Backgrounds / `BG`: blueprint-grid, perspective-grid,
    beton-brut, crt-overlay, data-rain, exposed-wiring
  - `navigation-loaders` / Navigation & Loaders / `NAV`: status-bar,
    terminal-navbar, mega-menu, monolith-footer, boot-sequence-loader,
    segmented-progress
  - `interactive` / Interactive / `INT`: command-palette,
    pixelated-image-trail, data-readout-carousel
- Item codes are the set code plus a two-digit position (`BTN-01`). They are
  display-only.
- URLs: `/docs/components` (index), `/docs/components#<set-id>` (set anchor),
  `/docs/components/<name>` (existing pages), `/#install`, and the generated
  `/r/all.json`.
- No persisted data, API or server input. The search query is client state
  only and is rendered as React text.

## Testing

No test command or Browser tests command is configured, so no automated tests
are added. Evidence is `npm run lint`, `npx tsc --noEmit`, `npm run build`, and
manual browser checks on the dev server as listed in each step's Done when.
Do not claim visual parity with the canvas unless it was actually compared.

## Notes for the AI

- This Next.js has breaking changes. Read the matching guide in
  `node_modules/next/dist/docs/` before using `usePathname`, `useRouter`,
  layout metadata or anything touched by `cacheComponents`.
- Pass plain catalogue data from server components into client components as
  props. Keep `registry.json` imports on the server side where practical.
- Neon Edge Card and the navbar render plain `<a>` elements. Full-page
  navigation is acceptable on this static site. Do not change the registry
  components to accept `Link`.
- Follow existing docs styling: token classes, `text-caption tracking-label
  uppercase text-label` labels, signal focus outlines.
- Library components must keep honouring reduced motion. Do not add new
  animation outside them.

## Implementation notes

Status: all steps built and verified in a real browser (headless Chrome over
DevTools against the running `npm run dev`; no Playwright installed).

- Step 1 verified: removing `bento-grid` from the catalogue made `npm run build`
  fail with `Catalog is missing registry:ui items: bento-grid`; restored.
- `npm run lint`, `npx tsc --noEmit` and `npm run build` pass. Every route,
  including `/` and `/docs/components`, prerenders as static, so `usePathname`
  needed no Suspense boundary.
- Prerendered HTML checks: `/`, `/docs/components` and component pages each
  have one `id="main"` and the skip link; `/docs/components` renders all seven
  set anchors, `38 / 38`, and 38 card links, each of which has a built page;
  `/` has `id="install"` and links to all seven set anchors.
- Search logic: `glitch` matches exactly `glitch-button` and `glitch-heading`
  in registry data, so the index should show `2 / 38`.
- Choices: the landing CTA is a token-styled anchor (Hard-Offset Button is a
  `<button>`); specimens use Hard-Offset and Terminal buttons rather than the
  Glitch Button to keep one glitch element per viewport; the install block is
  wrapped in `<div id="install">` because `InstallCommand` already renders its
  own labelled section.

- Browser evidence: header/footer on component pages; theme switcher swaps
  `--signal` across all three presets; Ctrl+K site search lands on
  `/docs/components/glitch-button`; on `/docs/components/command-palette` Ctrl+K
  opens only the demo and the header SEARCH button opens site search; skip link
  is the first Tab stop and the next Tab lands in `<main>`; index `glitch` gives
  `2 / 38`, `zzz` gives the empty state and Clear restores `38 / 38` with focus
  in the input; anchors scroll correctly; all 38 card links return 200; landing
  stats read 38/7/3; copy button writes the install command; reduced motion hides
  glitch slices and shows the counter's final value at once; one glitch element
  on `/`; no horizontal scroll at 375/768/1280 on four routes; MENU fold works
  at 375px; keyboard-only header and palette open/close; no console or network
  errors.
- Fix after first `/check`: the hero heading clipped at 375px (`text-display-xl`
  has a 4rem floor). It now uses `text-display-lg sm:text-display-xl`; measured
  text fits from 320px to 1280px. The search input's native WebKit clear icon
  (off-palette blue) is hidden.
- F-01 fix: at 768-~900px the navbar link row clipped `INSTALL` behind the
  actions slot. `site-header.tsx` now hides the visible THEME label (sr-only,
  via a new `labelClassName` prop on `ThemeSwitcher`) between @3xl and @5xl and
  tightens the actions to `gap-2 px-3`; INSTALL is fully visible from 768px.
- Step 6 (`@cybr/all`, added after review at the user's request): `registry.json`
  gains an `all` item (`registry:item`, no files, 38 `@cybr/<name>`
  dependencies). `npm run registry:build` writes `public/r/all.json` with 38
  dependencies. Removing `@cybr/data-rain` made `next build` fail with
  `@cybr/all must list every component. Missing: data-rain`; restored. A
  `shadcn add @cybr/all --dry-run` in a scratch app pointed at the local
  registry resolves 42 files: the 38 components plus `lib/utils.ts`, tokens,
  effects and `use-reduced-motion`. In the browser, the landing copy button
  copies `npx shadcn@latest add @cybr/all`, with no horizontal scroll at 375px
  and no console errors. Lint, typecheck and build pass.
- Observation, not changed here: shadcn's dry run lists an npm dependency `cn`
  for any `@cybr` install (also for a single `hard-offset-button`), so it comes
  from the `utils` item shadcn resolves, not from this feature.



<!-- blueprint:completion {"schemaVersion":2,"specBytes":16826,"specSha256":"143e5351dd48dea205f4f024675f4c9861ca959366d5c53dff18e650b6fdce50","branch":"refs/heads/feature/docs-site-built-with-the-library","head":"c19f7da8e0417b464fada3792380e51614e40b11","baseRef":"refs/heads/main","baseCommit":"c19f7da8e0417b464fada3792380e51614e40b11","sourceTree":"be1b89ec2e6eb2acf2e4f760006769596dbce329","landing":"local-merge","absentOptional":[]} -->

## Findings

### 13/F-01 [P2] closed - Site header hides part of INSTALL link at 768-~860px

**File:** app/_components/site-header.tsx:34
**Found:** 2026-11-02 by /audit (scope: current; lens: quality)
**Why it matters:** Between the navbar's @3xl breakpoint (768px) and about
860px, the actions slot (theme switcher plus search trigger) leaves the link
row too little room, so its scrollable strip clips `INSTALL` (71px hidden at
768px, 39px at 800px, 0 from 900px; measured in headless Chrome). The link stays
focusable and scrolls into view on focus, so it is a visual/discoverability
defect in the site's primary navigation at common tablet widths, not a broken
contract.
**Suggested fix:** Slim the actions at that range inside `site-header.tsx`, for
example hide the theme switcher's visible "THEME" label or the search trigger's
text below a wider container size, or move the theme switcher into the footer.
No registry component change is needed.
**Resolution:** Fixed in `site-header.tsx` and `theme-switcher.tsx`: between the
navbar's @3xl and @5xl container sizes the THEME label is `sr-only` (the select
keeps its label) and the actions use `gap-2 px-3`. Measured in headless Chrome
with the registry link padding at its HEAD value (`@3xl:px-5`): INSTALL text
fully visible from 768px up (box overhang 2px at 768px, inside the link's 20px
right padding; 0 from 776px). Awaiting re-review.
Closed 2026-11-02 by /audit (scope: current): re-measured in headless Chrome
at 768/1023/1024px with both the current registry padding and the HEAD value
simulated; INSTALL text visible, THEME label sr-only only between @3xl and @5xl,
visible in the 375px MENU panel and from 1024px, select still named "Theme".
Lint and typecheck pass. No new defect from the repair.

### 13/F-02 [P2] closed - Uncommitted out-of-scope edit and reformat of the Terminal Navbar registry component

**File:** registry/ui/terminal-navbar.tsx:111
**Found:** 2026-11-02 by /audit (scope: current; lens: quality)
**Why it matters:** The working tree changes the shipped `terminal-navbar`
component: link padding `@3xl:px-5` becomes `@3xl:px-3`, and the whole file is
reformatted to single quotes and no semicolons (108 insertions, 72 deletions).
The approved spec puts `registry/ui/*` changes out of scope, the padding change
alters what `npx shadcn add @cybr/terminal-navbar` installs and its match with
the mockup, and the formatting drifts from every other registry file. F-01's
fix no longer needs it (INSTALL fits with the HEAD padding). `/complete` would
commit it with this feature.
**Suggested fix:** Restore the file to HEAD (`git checkout --
registry/ui/terminal-navbar.tsx`). This is the user's own uncommitted edit, so
it needs their explicit go-ahead; alternatively accept it with a recorded
reason, or move the padding change to its own `/fix`. Nothing current is lost
by restoring.
**Resolution:** Closed 2026-11-02 in /complete by the user's explicit decision to
restore the file: `git checkout -- registry/ui/terminal-navbar.tsx` ran, and
`git status` shows no change to `registry/`, so the shipped component again
matches HEAD (padding `@3xl:px-5`, repo formatting). The F-01 header fix was
measured against that HEAD padding (INSTALL visible from 768px). Lint,
typecheck, registry build and build were rerun after the restore.

## Try it now

Run or do:

With `npm run dev` running, open http://localhost:3000/docs/components, type `glitch` in the search box, then press ⌘K and choose "Data Rain".

Expected:

The count reads `2 / 38 COMPONENTS` and only Glitch Button (Buttons) and Glitch Heading (Text & Motion) remain. After choosing "Data Rain", the browser lands on `/docs/components/data-rain` with the same site header and footer.

This proves:

The component index search filters by set, and the site-wide ⌘K search goes to component pages.
