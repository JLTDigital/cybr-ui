# Feature: Navbar, Footer & Loader set

**From build-plan:** feature 10
**Build attempt:** 1
**Branch:** feature/navbar-footer-loader-set
**Status:** verified

## Goal

Ship six installable registry components in the CYBR//UI style: Status Bar,
Terminal Navbar, Brutal Mega Menu, Monolith Footer, Boot Sequence Loader and
Segmented Progress. Each one gets a `registry.json` entry, built `public/r/`
output and a docs page at `/docs/components/<item>` that uses the Feature 4
template.

## Design reference

- Mockup canvas: https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx, artboard
  `project/Navbar.dc.html` ("Nav / Footer / Boot", section 06). Its numbered
  blocks are 01 Status Bar, 02 Terminal Navbar, 03 Mega Menu (pinned open),
  04 Boot Sequence Loader, 05 Segmented Progress and 06 Monolith Footer.
- The artboard uses hex values. Map them to tokens only:
  - `#0E1012` → `--ground-void`
  - `#16191C` → `--ground-deep`
  - `#212529` → `--bg`
  - `#495057` → `--line`
  - `#ADB5BD` → `--label`
  - `#F8F9FA` → `--ink`
  - accent → `--signal`

  Use the existing border, tracking and type tokens. Do not use hex.
- Key details from the artboard:
  - **Status Bar:** 28px high on `--ground-void` with 11px mono, `--label`
    text and 0.14em tracking. Left: system strings (`SYS:OK`, `REV 0.1`,
    `NODE / EU-NE`). Right: a 4-bar signal meter (filled bars `--signal`,
    empty bars `--line`) and a tabular UTC clock in `--ink`.
  - **Terminal Navbar:** 62px high on `--ground-deep`. It has a display-font
    wordmark (`CYBR//UI` with signal `//`), then mono bold 13px links, each
    separated by a 2px `--line` left border. The current link renders as
    `[ LABEL ]` in `--signal`, and hover gives `--ink` text on `--bg`. An
    actions area on the right holds the ⌘K hint and a solid `--signal` CTA
    with `--ground-deep` text.
  - **Mega Menu:** a grid of 5 cells separated by 2px `--line` gaps (hairline
    grid over a `--line` parent).
    - Four link columns on `--bg`. Each has a bold 11px heading with a 2px
      bottom rule. The first column's rule is `--signal`; the others are
      `--line`.
    - Links are 12px `--label`, with `--signal` on hover.
    - One promo tile: a hazard-stripe border around a `--ground-deep` inner
      box, a small eyebrow, and a display-font title ending in `→`.
  - **Boot Sequence Loader:** on `--ground-void`. Monospace lines like
    `[0000.01] init kernel ............ OK`. The text is `--label` and the
    status is `--signal`. Lines appear one at a time, each status fills in
    when that line completes, and a blinking block cursor follows the lines.
  - **Segmented Progress:** a display-font percentage padded to 3 digits
    (`065%`), a phase label on the right, and a track of 20 segments with a
    2px `--ink` border and 3px padding. Filled segments are `--signal`; empty
    segments are transparent.
  - **Monolith Footer:** on `--ground-deep`. A grid of up to 4 columns: each
    has a `--signal` 11px heading, then links or plain text lines. A huge
    display-font wordmark is clipped by the bottom edge of the footer.

## In scope

- Six components in `registry/ui/`:
  - `status-bar.tsx`
  - `terminal-navbar.tsx`
  - `mega-menu.tsx`
  - `monolith-footer.tsx`
  - `boot-sequence-loader.tsx`
  - `segmented-progress.tsx`
- Six `registry.json` items named `status-bar`, `terminal-navbar`,
  `mega-menu`, `monolith-footer`, `boot-sequence-loader` and
  `segmented-progress`. Each declares the `@cybr/*` registry dependencies and
  npm `dependencies` it actually uses.
- Six docs pages at `app/docs/components/<item>/page.mdx`. Each has a header,
  install command, live preview, props table, usage, states and an
  accessibility section, like the existing pages.
- Regenerated `public/r/` output from `npm run registry:build`.
- Reduced-motion behaviour for every animated part: the boot reveal, the
  cursor blink and any menu transition.

## Out of scope

- Swapping the docs site's own header or footer for these components
  (Feature 13).
- A working ⌘K command palette (Feature 11). The navbar only provides a slot
  where a caller can put a hint or trigger.
- A slide-in drawer, focus trap or body scroll lock for the narrow navbar
  menu. Step 7 adds a plain disclosure panel instead.
- Indeterminate progress, a live data source for the status bar, and theme
  presets (Feature 12).
- Test runners, Playwright and CI (Feature 14 / `/tests`).

## Build loop

- `workflow.stepReview` is `feature`. Build all steps, then stop once for
  review at the end of the feature, not after each step.
- `workflow.checkpointCommits` is `disabled`. Make no commits during the
  build. `/complete` creates the single feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. After the last
  step, run `npm run build`, which includes the registry build.

## Build steps

- [x] 1. **Status Bar + Segmented Progress (static pieces).**
  - Build `StatusBar`:
    - It is a `<div>`, not a landmark, so callers can place it above a
      `<nav>`.
    - Props:
      - `items: ReactNode[]`: the left-side system strings.
      - `signal?: 0 | 1 | 2 | 3 | 4`: when set, renders the bar meter with
        `role="img"` and `aria-label="Signal strength N of 4"`.
      - `clock?: boolean`, default `true`: shows a live `HH:MM:SS UTC`
        readout.
      - `...div props`, with `className` merged by `cn()`.
    - The clock renders `--:--:--` on the server and on first client render.
      After mount it updates once a second from `Date` in UTC, and the
      interval is cleared on unmount. It is not an `aria-live` region.
  - Build `SegmentedProgress`:
    - Props:
      - `value: number`: clamped to `0..max`. A non-finite value becomes `0`.
      - `max?: number`, default `100`.
      - `segments?: number`, default `20`.
      - `label: string`: required, used as the progressbar's accessible name.
      - `phase?: ReactNode`: the right-side phase text.
      - `showValue?: boolean`, default `true`: the big padded percentage.
      - `...div props`.
    - The track has `role="progressbar"` with `aria-valuemin`,
      `aria-valuemax`, `aria-valuenow` and `aria-label`.
    - The number of filled segments is
      `Math.floor(value / max * segments)`.
    - The visual percentage readout is `aria-hidden`, because the
      progressbar already exposes the value.
    - Nothing animates. A segment fill change is an instant snap.
  - Add both registry items and both docs pages. The progress demo shows a
    fixed value, such as 65 with phase `HANDSHAKE`.
  - **Done when:** `/docs/components/status-bar` and
    `/docs/components/segmented-progress` render and match the artboard
    blocks 01 and 05. The clock ticks after hydration with no hydration
    warning in the console. Lint and tsc pass.

- [x] 2. **Terminal Navbar.**
  - Render a `<nav>` with `aria-label`, default `"Primary"`. Props:
    - `brand?: ReactNode`: the wordmark slot. The default is `CYBR//UI` with
      a `--signal` `//`, wrapped in a link to `brandHref`, default `"/"`.
    - `links: { label: string; href: string; current?: boolean }[]`.
      - The current link gets `aria-current="page"` and shows
        `[ LABEL ]` in `--signal`.
      - The brackets are decorative (`aria-hidden`), so the accessible name
        stays `LABEL`.
    - `actions?: ReactNode`: the right-side slot for a ⌘K hint or CTA.
    - `...nav props`.
  - Export a small `TerminalNavbarCta` link styled like the artboard's
    `INSTALL →`, so the docs demo and consumers can drop it into `actions`.
  - Use the signal-colour focus outline on every link, inset like the
    accordion trigger (`outline-offset` −3px).
  - **Done when:** `/docs/components/terminal-navbar` matches artboard
    block 02. Tab reaches the brand, each link and the CTA in order, with a
    visible signal outline. The current link announces as "LABEL, current
    page". Lint and tsc pass.

- [x] 3. **Brutal Mega Menu (Base UI NavigationMenu).**
  - Before writing any code, read the NavigationMenu docs and types under
    `node_modules/@base-ui/react/navigation-menu`. Confirm the part names
    (Root, List, Item, Trigger, Content, Portal/Positioner/Popup/Viewport,
    Link) and the data attributes for the open state.
  - Build `MegaMenu`. Props:
    - `label: ReactNode`: the trigger text, styled like a Terminal Navbar
      link, with a `+`/`−` or `▾` mark that is `aria-hidden`.
    - `columns: { heading: string; links: { label: string; href: string }[] }[]`.
    - `feature?: { eyebrow: string; title: string; href: string }`: the
      hazard-stripe promo tile.
    - `...Root props`.
  - The panel is the 5-cell hairline grid. The first column's heading rule is
    `--signal`.
  - Opening and closing follow Base UI defaults: click or hover opens,
    Escape closes and returns focus to the trigger, and arrow and Tab
    navigation work. Panels appear instantly, or use a short stepped
    transition that is off under reduced motion.
  - The trigger can sit inside `TerminalNavbar`'s `links` row. The docs
    demo shows the menu standing alone and shows it inside a
    `TerminalNavbar` through an added `children` slot rendered after the
    links. Add that slot to `TerminalNavbar` in this step and document it
    there.
  - **Done when:** `/docs/components/mega-menu` matches artboard block 03
    once opened. Keyboard open, navigate and Escape all work, with focus
    returning to the trigger. The panel closes on outside click. Lint and
    tsc pass.

- [x] 4. **Monolith Footer.**
  - Render a `<footer>`. Props:
    - `columns: { heading: string; items: ({ label: string; href: string } | { text: string })[] }[]`:
      `href` items render as links, and `text` items render as plain
      `--label` lines.
    - `wordmark?: ReactNode`: the default is `CYBR//UI` with a `--signal`
      `//`.
    - `...footer props`.
  - The giant wordmark is `aria-hidden`, clipped by `overflow-hidden`, and
    sized with `clamp()` or `vw` so it still crops cleanly at narrow widths.
  - Columns drop from 4 to 2 below `sm`.
  - **Done when:** `/docs/components/monolith-footer` matches artboard
    block 06 at desktop width. At about 375px wide nothing overflows the
    page horizontally. Links show the focus outline. Lint and tsc pass.

- [x] 5. **Boot Sequence Loader.**
  - Before building, read `registry/ui/typewriter-terminal.tsx` and
    `lib/use-reduced-motion.ts`. Copy their static-first pattern and
    server-render behaviour rather than inventing a new one.
  - Props:
    - `lines: { text: string; status: string }[]`
    - `lineDuration?: number`, default `1000` ms per line, close to the
      artboard's 22 × 45ms.
    - `onComplete?: () => void`
    - `...div props`
  - Animated path: line *i* appears at `i × lineDuration`, and its status
    fills in at `(i + 1) × lineDuration`. `onComplete` fires once, after the
    last status. A blinking block cursor follows the lines, using the
    existing cursor-blink effect utility from `styles/effects.css` (confirm
    its class name). Timers are cleared on unmount.
  - Reduced motion and no-JS: every line is shown complete straight away,
    the cursor is static, and `onComplete` fires once after mount.
  - Accessibility:
    - The animated lines are `aria-hidden`.
    - A visually hidden `role="status"` element announces only the final
      state: the last line's text and status, such as
      "handshake uplink READY".
    - Nothing is announced per line.
  - The docs demo is wrapped in the existing `Replay` docs component, so
    reviewers can re-run it.
  - **Done when:** `/docs/components/boot-sequence-loader` plays the
    artboard 04 sequence and replays on demand. With
    `prefers-reduced-motion: reduce` emulated, the complete log shows at
    once. Lint and tsc pass.

- [x] 6. **Registry and build verification.**
  - Confirm all six items are in `registry.json`, with descriptions in the
    existing style that end with "Requires @cybr/tokens." and list any other
    required `@cybr/*` item.
  - Run `npm run build`.
  - **Done when:** `npm run build` succeeds, `public/r/` contains the six new
    `<item>.json` files, and all six docs routes appear in the build output.

- [x] 7. **Terminal Navbar hamburger menu (revision requested after /check).**
  - `/check` failed the navbar: the page overflowed by 4px at 375px, and a
    scroll row with a visible scrollbar showed in the 844px docs preview.
    The user asked for a proper hamburger open/close menu on narrow widths.
  - `TerminalNavbar` becomes a client component. The `<nav>` is a Tailwind
    container (`@container`, `w-full`, `relative`). It switches on its own
    width, not the viewport's, so it behaves the same in any layout.
  - **At `@3xl` (48rem) and wider:** the layout is as before, wordmark,
    then links and `children`, then actions. The links row may still scroll
    sideways as a fallback, but its scrollbar is hidden.
  - **Narrower:**
    - The bar shows the wordmark and a `MENU` toggle button at the right.
      The button is 2px rule-separated, mono bold, and has a 3-bar icon that
      becomes an ×. The icon is `aria-hidden` and does not animate.
    - The links, `children` and actions move into a full-width panel
      positioned just below the bar on `--ground-deep`. It is absolutely
      positioned, so it overlays the page instead of pushing it down.
    - Links are stacked rows at least 48px high, separated by hairline
      rules.
  - Toggle contract:
    - The button has `aria-expanded` and `aria-controls` pointing at the
      panel. Its name stays "MENU" in both states.
    - The panel is `display: none` when closed, so it is out of the tab
      order and the accessibility tree.
    - Tab moves from the button into the panel. The button comes before the
      panel in the DOM and is hidden at `@3xl` and wider.
    - Escape inside the nav closes the panel and returns focus to the
      button.
    - Clicking a link in the panel closes it.
    - A pointer-down outside the nav closes it.
    - The links, `children` and actions each render once, with no duplicate
      DOM. The same elements reflow between the row and the panel through
      container-query classes.
  - Docs: hide the ⌘K hint below `@5xl` instead of the viewport `lg`.
    Update the props/States/Accessibility sections to describe the toggle.
    Remove the "no hamburger" line.
  - **Done when:**
    - At 375px viewport, `/docs/components/terminal-navbar` has no
      horizontal page overflow and shows the wordmark plus MENU.
    - Activating MENU opens the stacked panel with `aria-expanded="true"`.
      Tab reaches the panel links, and Escape closes it with focus back on
      MENU.
    - At 1280px, the navbar demo in the docs preview shows its links with no
      visible scrollbar.
    - The Mega Menu docs demo still opens inside the navbar.
    - Lint, tsc and `npm run build` pass.

## Files / areas

- New: `registry/ui/status-bar.tsx`, `terminal-navbar.tsx`, `mega-menu.tsx`,
  `monolith-footer.tsx`, `boot-sequence-loader.tsx` and
  `segmented-progress.tsx`.
- New: `app/docs/components/<item>/page.mdx` for each of the six items.
- Edit: `registry.json` (six new items).
- Generated: `public/r/*.json`.
- Possibly edit: `styles/effects.css`, but only if the cursor blink or
  hazard stripe needs a variant that is not already there. Reuse first.
- Patterns to follow:
  - `registry/ui/classified-accordion.tsx` for Base UI wrapping and focus
    styles.
  - `registry/ui/telemetry-counter.tsx` and
    `registry/ui/typewriter-terminal.tsx` for static-first motion and
    sr-only text.
  - `app/docs/components/classified-accordion/page.mdx` for the docs page
    structure.

## Data / contracts

- Registry item names (install ids) are fixed: `status-bar`,
  `terminal-navbar`, `mega-menu`, `monolith-footer`,
  `boot-sequence-loader`, `segmented-progress`. All are `registry:ui`.
  - `registryDependencies` always includes `utils` and `@cybr/tokens`.
  - Add `@cybr/use-reduced-motion` where the hook is imported, and
    `@cybr/effects` where effect classes are used.
  - Add `dependencies: ["@base-ui/react"]` for `mega-menu` only.
- Docs routes: `/docs/components/<item>`, using `getRegistryItem(<item>)`,
  which throws on a typo.
- All props are typed as above. All text comes from props and renders as
  React text nodes. There is no `dangerouslySetInnerHTML`.
- There is no persisted data, network input or auth boundary.

## Testing

- No test command is configured, so there are no unit tests.
- Gates: `npm run lint`, `npx tsc --noEmit` and `npm run build`.
- Manual docs checks on `npm run dev`:
  - visual match against the artboard
  - keyboard paths: navbar Tab order, mega menu open/arrow/Escape, footer
    links
  - reduced-motion emulation for the boot loader and cursor
  - no hydration warnings from the status bar clock
  - no horizontal overflow at 375px for the navbar, mega menu and footer
- Report these as manual evidence only if they were actually run.

## Notes for the AI

- Read `node_modules/next/dist/docs/` for anything Next-specific (the AGENTS
  notice). Read the Base UI NavigationMenu sources before writing step 3.
- Links use plain `<a>`, matching existing registry components, unless an
  existing component already uses `next/link`. Check
  `grep -r "next/link" registry/` first and follow what it shows.
- Narrow layout rule (revised by the user after `/check`): below the
  `@3xl` container width, the Terminal Navbar collapses into a MENU toggle
  with a stacked disclosure panel (step 7). The mega menu grid falls to 2
  columns and then 1, with the promo tile last.
- The demo's fake system strings (`SYS:OK`, `REV 0.1`, `NODE / EU-NE`, the
  boot lines) live in the docs pages, not in component defaults. Components
  take them as props.
- Contrast:
  - Small `--signal` text is fine on `--bg`, `--ground-deep` and
    `--ground-void` (as in existing components), but not on `--surface`.
  - On hover fills, switch to `--ink`, as the accordion does.
  - CTA text is `--ground-deep` on `--signal`.
- Keep animation under 3 flashes per second. The cursor blink at 1s
  `steps(1)` is fine.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":18224,"specSha256":"9cac5423a1abe182c5cebf6da53c983816d7d7bec50bb34d73b477f1fa56596f","branch":"refs/heads/feature/navbar-footer-loader-set","head":"a58cb5f7656d5859b72b733ac120781f315f5825","baseRef":"refs/heads/main","baseCommit":"a58cb5f7656d5859b72b733ac120781f315f5825","sourceTree":"8dca2487ec33f5d45b8153cf342c956276aa8fa5","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, then open http://localhost:3000/docs/components/terminal-navbar and narrow the browser window below about 900px (or use a 375px device preset), then click **MENU** in the navbar demo.

Expected:

The bar shows only the `CYBR//UI` wordmark and a `MENU` button. Clicking it turns the icon into an ×, sets `aria-expanded="true"`, and drops a panel with INDEX, `[ COMPONENTS ]` in signal orange, DOCS and GITHUB as stacked rows, then a full-width orange **INSTALL →**. Pressing Escape closes the panel and leaves focus on MENU, and the page never scrolls sideways.

This proves:

The Terminal Navbar collapses into the MENU disclosure panel on narrow widths and closes with Escape, returning focus.
