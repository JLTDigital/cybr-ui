# Feature: Layout & Cards set

**From build-plan:** feature 7
**Build attempt:** 1
**Branch:** feature/layout-cards-set
**Status:** verified

## Goal

Ship the eight components on the Layout & Cards artboard as installable `@cybr`
registry items, each with a docs page. The components are Brutal Bento Grid,
Spec Card, Access/ID Card, Hardware Panel, HUD Image Frame, Neon Edge Card,
Classified Card and Stat Band. Most are static and server-safe. Only the
Classified Card's click-to-declassify bars need client state.

## Design reference

Mockups canvas, artboard "Layout and Cards" (`project/Cards.dc.html`), cells
`01 / SPEC CARD` to `06 / CLASSIFIED`, plus the stat band row
(`07 · STAT BAND / DATA RIBBON`). The page itself is the bento grid. Match the
layout, motion and details. Colours come from tokens only:

| Artboard hex | Token |
|---|---|
| `#FF4C29` / `{{accent}}` | `signal` |
| `#F8F9FA` | `ink` |
| `#ADB5BD` | `label` |
| `#6C757D` | `dim` |
| `#495057` | `line` |
| `#343A40` | `surface` |
| `#212529` | `bg` |
| `#16191C` | `ground-deep` |
| `#0E1012` | `ground-void` |

The cell chrome is docs demo content, not part of any component. That covers the
numbered labels (`01 / SPEC CARD`), `X:0412 Y:0193`, the page header and footer,
and the noise and scanline overlays. All placeholder text (`[VALUE]`,
`[Operator name]`, `[PHOTO]`, `[IMAGE] · SCAN 38%`, `CLICK BAR TO DECLASSIFY`,
the stat values) is demo content passed in by the caller.

| Component | Artboard details |
|---|---|
| Brutal Bento Grid | A 4-column grid with 2px gaps over a `line` parent, so the gaps become the borders. Cells are `bg` with 28px/32px padding, a flex column with a 14px gap, and spans of 1, 2 or 4. Top and bottom 2px `line` border. |
| Spec Card | An `article` with a 2px `ink` border, an `8px 8px 0` `signal` hard shadow and a `ground-deep` fill. The header row is mono 11px `label` with 0.14em tracking (`UNIT / D-01 · REV 2.6`), plus a 7-bar `ink` barcode (widths 2,4,1,3,1,5,2px, 14px tall, 3px gap), padding 10px 18px and a 2px `ink` bottom rule. The body has 18px padding and a 24px gap. On the left: a display 34px UPPERCASE title (leading 0.95), a 13px `label` description (leading 1.6) and an action link. On the right: a 190px `dl` of label/value rows, 11px with 0.1em tracking, `label` terms, 7px padding and 1px `line` rules between rows. A row value can be `signal` (`STATUS ONLINE`). The action link has an `ink` fill, `ground-deep` text, 700 weight 12px with 0.14em tracking, min-height 44px, 18px x-padding, a 2px `ink` border and a `4px 4px 0` `signal` shadow. On hover it moves 2px/2px and the shadow drops to 2px. Focus is a 3px `signal` outline offset 4px. |
| Access/ID Card | An `ink` card with `ground-deep` text and a 2px `ink` border. A 14px hazard-stripe band runs along the top. The body has 12px/14px padding and a 10px gap. The `ACCESS LVL` row is 10px bold with 0.14em tracking, and its level chip is `ground-deep` with `ink` text and 2px/6px padding. A 96px `surface` photo slot carries a `dim` crosshair inset 8px. Then a display 20px UPPERCASE name, an ID line at 10px with 0.12em tracking (`ID 0x4F2A-91 · EXP 2099`), and a 26px repeating `ground-deep` barcode. |
| Hardware Panel | A `surface` panel with a 2px `dim` border and 24px/22px/22px/40px padding. Four 9px round `dim` rivets with an inset `label` highlight sit 8px in from each corner. A 12px cable channel runs down the left edge (top 26px, bottom 26px, left 14px) with repeating `bg` 4px / `line` 2px bands and a 1px `bg` border. The title is display 22px, leading 1, 18px below. Status rows are 11px with 0.12em tracking, a 10px gap, the label on the left and the state text plus a 10px LED on the right. An on LED is a `signal` fill with a `0 0 10px` `signal` glow. An off LED is a 2px `label` outline. |
| HUD Image Frame | A `ground-void` box, 196px tall, with a 1px `line` border, 18px padding and overflow hidden. Content sits at the bottom, spread between the two ends. Four 22px `signal` corner brackets, 3px thick and 10px in from the edges. A centre reticle: a 40px round `label` 1px ring, a vertical 1px line over the middle 40% of the height, and a horizontal 1px line over the middle 16% of the width. A 2px `signal` scan line at 38% from the top, at 55% opacity. A display 88px outlined numeral (`01`, leading 0.8, transparent fill, 2px `ink` stroke) at the bottom left and an 11px `label` caption at the bottom right. Static: nothing moves. |
| Neon Edge Card | A link card with a 2px `line` border, a `ground-deep` fill and 18px padding. It is a flex column spread between top and bottom. It holds an 11px `label` eyebrow, a display 26px UPPERCASE title (leading 0.95) and an 11px `signal` call to action (`OPEN →`). On hover the border turns `signal` and gains a `0 0 0 1px` ring plus a `0 0 24px -4px` `signal` glow, over 120ms on `steps(3)`. The artboard calls it "the only glow allowed". |
| Classified Card | A 2px dashed `dim` frame with 18px padding, a 10px gap, 13px text and leading 1.7. A `REDACTED` stamp sits at the start: 2px `signal` border, `signal` 700 11px text with 0.2em tracking, 2px/8px padding, rotated -3deg. Inline redaction bars have an `ink` fill with transparent text, and clicking a bar declassifies it. A hint line underneath is 11px `label` with 0.12em tracking. |
| Stat Band | A `signal` band with `ground-deep` text, laid out as 4 equal columns split by 2px `ground-deep` rules. Each stat has 20px/32px padding, a display 48px value (leading 0.9) and, 6px below it, an 11px bold label with 0.14em tracking. Demo: `030 MVP COMPONENTS`, `06 CATEGORIES`, `0PX BORDER RADIUS`, `0 BLURRED SHADOWS`. |

The artboard is a fixed 1280px poster, so these points need a decision. Each one
is visual, reversible and internal, and each docs page records it:

- **Bento Grid responsiveness.** The grid has 1 column below `sm`, 2 from `sm`,
  and 4 from `lg`. A span of 2 means 2 columns from `sm`. A span of 3 or 4 fills
  the row: 2 columns from `sm`, then 3 or 4 from `lg`. Spans come from a fixed
  class map, so Tailwind can see every class.
- **Bento Grid border.** The artboard is full-bleed, so it shows only the top and
  bottom borders. As a standalone component, the grid draws all four sides with
  2px `line`, so it reads as one closed slab.
- **Stat Band rules.** Use the same hairline-gap technique: a `ground-deep`
  parent with a 2px gap, and `signal` children that flex-wrap with a minimum
  basis. That keeps the rules correct for any number of stats and at any wrap
  point. With four stats at full width, it matches the artboard.
- **Literal offsets.** The 8px Spec Card shadow, the 4px/2px action shadow and
  the 22px brackets are the artboard's own values. They are arbitrary values
  that use `var(--signal)`, never hex. The existing `--offset-hard` (6px, `ink`)
  belongs to the Hard-Offset Button and is not reused here.
- **Round rivets.** The radius rule is 0 (2px max) for component shapes. Rivets
  and the reticle ring are round decorative motifs on the artboard, so they keep
  `rounded-full`. Nothing interactive is rounded.
- **Access Card stripes.** Reuse the existing `hazard-stripes` utility. Its
  stripes are 12px, where the artboard band uses 8px. The 14px band still shows
  the motif, and reusing the shared utility keeps palette swaps in one place.
- **Classified reveal is one-way.** Clicking (or pressing Enter/Space on) a bar
  declassifies it for good, as "click bar to declassify" suggests. There is no
  re-redact toggle.
- **Neon Edge is hover and focus only.** The artboard's `live` class only shows
  the hover state on a static poster. The component has no forced-lit prop. The
  docs preview tells readers to hover or tab to it.

## In scope

Eight `registry:ui` components, one file each, in `registry/ui/`:

- `bento-grid.tsx`: `BentoGrid`, `BentoGridItem` (server-safe)
- `spec-card.tsx`: `SpecCard`, `SpecCardAction` (server-safe)
- `access-card.tsx`: `AccessCard` (server-safe)
- `hardware-panel.tsx`: `HardwarePanel`, `HardwarePanelStatus` (server-safe)
- `hud-image-frame.tsx`: `HudImageFrame` (server-safe)
- `neon-edge-card.tsx`: `NeonEdgeCard` (server-safe)
- `classified-card.tsx`: `ClassifiedCard`, `Redacted` (`"use client"`)
- `stat-band.tsx`: `StatBand` (server-safe)

Also:

- Eight items in `registry.json`.
- Eight docs pages at `app/docs/components/<item>/page.mdx`.

## Out of scope

- New effect utilities or keyframes in `styles/effects.css`. Nothing here
  animates beyond a CSS transition.
- Polymorphic `asChild` or `as` link props. Neon Edge Card and Spec Card Action
  render native `<a>`. Feature 8 decides the accessible-primitives library,
  which owns any `Slot` pattern.
- Animated scan lines, flicker or glitch on any card.
- Persisting or syncing the declassified state. Real secrecy is also out of
  scope: redacted text ships in the HTML.
- Theme presets (Feature 12), the component index and landing page (Feature 13),
  and links between docs pages.
- Changes to existing components, tokens or docs scaffolding.

## Build loop

- Work on `feature/layout-cards-set`, created from `main`.
- `workflow.stepReview` is `feature`: build every step, then stop once for review
  at the end. `workflow.checkpointCommits` is `disabled`: make no commits.
  `/complete` creates the feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. After steps 2, 4
  and 6, also run `npm run build`.

## Build steps

Shared rules for every component:

- `className` is merged last with `cn()`.
- The component forwards the remaining native props of its root element.
- Its file comes first in the item's `files` list, because `getItemSource` reads
  `files[0]`.
- Decorative elements are `aria-hidden="true"` and `pointer-events-none`.
- Registry dependencies are `["utils", "@cybr/tokens"]` unless a step says
  otherwise.

- [x] 1. **Brutal Bento Grid and Stat Band, with items**
  - **`BentoGrid`**
    - `ComponentProps<"div">`.
    - Classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
      gap-(--border-base) bg-line border-(length:--border-base) border-line`.
  - **`BentoGridItem`**
    - `ComponentProps<"div">` plus `span?: 1 | 2 | 3 | 4`, default 1.
    - Spans map to static classes, as set out in Design reference.
    - Cell classes: `bg-bg px-7 py-8 sm:px-8 flex flex-col gap-3.5 min-w-0`.
  - **`StatBand`**
    - Props: `stats: { value: ReactNode; label: ReactNode }[]`, plus
      `ComponentProps<"dl">` without `children`.
    - Root: `dl` with `flex flex-wrap gap-(--border-base) bg-ground-deep`.
    - Each stat is a `div`, `flex flex-col-reverse flex-1 basis-48 bg-signal
      text-ground-deep px-8 py-5`. It holds a `dt` (the label: mono 11px bold,
      `tracking-label`, `mt-1.5`) and then a `dd` (the value: display 48px,
      `[line-height:0.9]`). The DOM order is term then value, so screen readers
      read the label first. The visual order puts the value on top.
    - Values are `ReactNode`, so a `TelemetryCounter` can be dropped in. Stat
      Band itself takes no dependency on it.
    - An empty `stats` renders an empty `dl`.
    - Keys use the array index. The list comes from the developer and is
      static.
  - Done when lint and typecheck pass and `npm run registry:build` writes
    `bento-grid.json` and `stat-band.json` with the right dependencies.

- [x] 2. **Spec Card and Access/ID Card, with items**
  - **`SpecCard`**
    - Props:
      - `title: ReactNode`
      - `titleAs?: "h2" | "h3" | "h4"`, default `"h3"`
      - `meta?: ReactNode` (header text)
      - `specs?: { label: ReactNode; value: ReactNode; accent?: boolean }[]`
      - `action?: ReactNode`
      - `children` (the description)
      - `ComponentProps<"article">` without `title`
    - Header row: `meta`, plus the 7-bar barcode, which is decorative and
      inline.
    - Body: `flex flex-col gap-6 p-4.5 sm:flex-row`. The left column holds the
      title, the description `p` and the action. The `dl` sits on the right at
      `sm:w-47.5 shrink-0` and is omitted when `specs` is empty or unset.
    - `accent` values are `text-signal`, which passes contrast on
      `ground-deep`.
    - Shadow: `shadow-[8px_8px_0_0_var(--signal)]`. The root carries `mr-2 mb-2`
      so the shadow is not clipped by a tight parent.
  - **`SpecCardAction`**
    - `ComponentProps<"a">`, styled as the artboard `.speclink`.
    - Hover is `translate-0.5` with a 2px shadow, and switches to
      `motion-reduce:transition-none` under reduced motion.
    - Focus: `focus-visible:outline-(length:--focus-width) outline-offset-4
      outline-signal`.
  - **`AccessCard`**
    - Props:
      - `name: ReactNode`
      - `level: ReactNode`
      - `levelLabel?: ReactNode`, default `"ACCESS LVL"`
      - `idLine?: ReactNode`
      - `photo?: ReactNode`
      - `ComponentProps<"div">` without `children`
    - The top band uses `hazard-stripes`, so its dependencies are
      `["utils", "@cybr/tokens", "@cybr/effects"]`.
    - Photo slot: `relative h-24 overflow-hidden bg-surface`. With no `photo`,
      it shows the `dim` crosshair lines (decorative). A given `photo` fills the
      slot (`[&>*]:size-full [&>img]:object-cover`), and its alt text is the
      caller's job.
    - The name is a `p`, display 20px UPPERCASE.
    - The barcode is a decorative `div` with the artboard's 12px repeating
      gradient, using `var(--ground-deep)`.
    - Width comes from the caller. The docs demo uses `w-64`.
  - Done when `npm run build` passes and writes both JSON files, and the existing
    docs routes still prerender.

- [x] 3. **Hardware Panel and HUD Image Frame, with items**
  - **`HardwarePanel`**
    - Props: `title: ReactNode`, `titleAs?: "h2" | "h3" | "h4"` (default
      `"h3"`), `children`, and `ComponentProps<"section">` without `title`.
    - Root: `section` with `relative bg-surface border-(length:--border-base)
      border-dim text-ink pt-6 pr-5.5 pb-5.5 pl-10`.
    - Four decorative rivets (`size-2.25 rounded-full bg-dim
      shadow-[inset_1px_1px_0_var(--label)]`, inset 8px).
    - The decorative cable channel uses the repeating gradient from `var(--bg)`
      and `var(--line)`.
    - Children render in a `flex flex-col gap-2.5` stack below the title.
  - **`HardwarePanelStatus`**
    - Props: `label: ReactNode`, `on: boolean`, `stateLabel?: ReactNode`
      (default `"ON"` or `"OFF"`), and `ComponentProps<"div">` without
      `children`.
    - Renders the row with visible state text, so the state never depends on
      colour alone. The LED is decorative.
    - The on-LED glow (`shadow-[0_0_10px_var(--signal)]`) is a neon-accent glow,
      which the visual rules allow.
  - **`HudImageFrame`**
    - Props:
      - `children` (the media layer: an image, video or anything else)
      - `index?: ReactNode` (the outlined numeral)
      - `caption?: ReactNode`
      - `scanLine?: boolean`, default `true`
      - `ComponentProps<"figure">`
    - Root: `figure` with `relative isolate min-h-49 overflow-hidden bg-ground-void
      border-(length:--border-hair) border-line p-4.5 flex items-end
      justify-between gap-4`.
    - Media: `children` render in an `absolute inset-0 -z-10` layer, with
      `[&>*]:size-full [&>img]:object-cover`.
    - Overlays (brackets, reticle, scan line) are decorative and sit above the
      media.
    - `index` renders in a `span aria-hidden="true"`, display 88px,
      `[line-height:0.8]`, `text-transparent [-webkit-text-stroke:2px_var(--ink)]`.
      It is decorative, so it needs no contrast claim. The docs say so.
    - `caption` renders in a `figcaption`, 11px `label` with `tracking-label`,
      and is omitted when unset.
  - Done when lint and typecheck pass and the registry build writes
    `hardware-panel.json` and `hud-image-frame.json`.

- [x] 4. **Neon Edge Card and Classified Card, with items**
  - **`NeonEdgeCard`**
    - Props: `title: ReactNode`, `eyebrow?: ReactNode`, `cta?: ReactNode`, and
      `ComponentProps<"a">` without `title` and `children`.
    - Root: `a` with `flex min-h-48 flex-col justify-between gap-4 bg-ground-deep
      border-(length:--border-base) border-line p-4.5 text-ink no-underline`.
    - Transition on `border-color` and `box-shadow` for
      `duration-(--duration-fast) ease-step-3`, switched off with
      `motion-reduce:transition-none`.
    - `hover:` and `focus-visible:` both apply `border-signal` and
      `shadow-[0_0_0_1px_var(--signal),0_0_24px_-4px_var(--signal)]`.
    - Focus also adds the standard 3px `signal` outline with a 6px offset.
    - The title is a `span`, so the link's accessible name is its whole text.
  - **`ClassifiedCard`**
    - Props: `stamp?: ReactNode` (default `"REDACTED"`), `hint?: ReactNode`,
      `children`, and `ComponentProps<"div">`.
    - The dashed frame and stamp follow the artboard.
    - The stamp is visible text, not decoration.
  - **`Redacted`**
    - Props: `children: ReactNode` plus `ComponentProps<"button">` without
      `children` and `type`.
    - Concealed: a native `<button type="button">`. Inside, the real text is in
      an `aria-hidden` span with `bg-ink text-transparent select-none` and
      `box-decoration-clone`, so the bar wraps across lines. An `sr-only` span
      reads "Redacted. Activate to declassify."
    - Focus: the standard `signal` outline.
    - Activating the button sets `revealed`. The component then renders a
      `span tabIndex={-1}` holding the real text with no bar, and focuses it in
      an effect. Focus is never dropped to `body`, and screen readers read the
      revealed text.
    - The forwarded button props apply only to the concealed button.
    - No-JS: the bar stays concealed. That is the intended effect. The docs say
      so.
    - The docs say the text is present in the page HTML and must never be used
      for real secrets.
  - Done when `npm run build` passes and the build writes both JSON files.

- [x] 5. **Docs pages**
  - Add the eight `app/docs/components/<item>/page.mdx` pages. They follow the
    Feature 5 page structure: header, install command, preview, props table,
    `## Usage` with the needed `@import` lines, then `## Anatomy` (static
    components) or `## States` (Neon Edge Card and Classified Card), then
    `## Accessibility`.
  - Previews use the artboard demo content and placeholders. They set
    `w-full` where the component should span the preview.
    - The Bento Grid preview shows a span-2 cell, two span-1 cells and a span-4
      row, with simple mono label content.
    - The Stat Band preview shows the four artboard stats.
  - The Props tables list every prop above, including the forwarded native
    element.
  - `## Accessibility` covers:
    - landmark and element choices (`article`, `section` with heading, `figure`
      with `figcaption`, `dl`)
    - the heading level via `titleAs`
    - decorative elements being hidden
    - state text alongside LEDs
    - the contrast of text pairs used, from the overview figures: `ink` and
      `label` on dark grounds, `ground-deep` on `signal` and `ink`
    - focus outlines on links and buttons
    - the Redacted focus handoff and no-JS behaviour
    - the advice to keep text contrast when colours are overridden
  - Each page records its Design reference decision from the list above.
  - Done when `npm run build` prerenders all eight new `/docs/components/<item>`
    routes and each Code tab shows its own source.

- [x] 6. **Verification**
  - Run `npm run lint`, `npx tsc --noEmit` and `npm run build`.
  - Inspect each new `public/r/*.json` for its type, its single file, and its
    `registryDependencies`. Access Card should include `@cybr/effects`. The
    others should not.
  - Grep the eight new component files for hex values. There should be none.
  - Check the server HTML:
    - Every redacted span is a `button` with the `sr-only` label.
    - The Stat Band `dt` comes before its `dd`.
    - The figure has a `figcaption`.
  - When a browser is available, run `npm run dev` and check each page against
    the artboard:
    - The bento columns collapse at the `sm` and `lg` breakpoints.
    - Neon Edge glows on hover and on keyboard focus, and the transition is off
      under emulated reduced motion.
    - The Spec Card action presses on hover.
    - A Redacted bar reveals on click and on Enter/Space, and focus lands on the
      revealed text.
    - There are no hydration warnings or console errors.
  - When network access is available, install `@cybr/access-card` and
    `@cybr/classified-card` into a throwaway Next.js app outside the repo, as in
    Feature 5. Confirm that `next build` passes there.
  - If a browser or network access is unavailable, record that check as not run
    and say why.
  - Done when the results are recorded in this spec.

- [x] 7. **Fix: Spec Card description nested `<p>`**
  - `/check` found a hydration error on `/docs/components/spec-card`: "`<p>`
    cannot be a descendant of `<p>`". MDX wraps the demo's description text in
    a `<p>`, and `SpecCard` wrapped `children` in another `<p>`. A consumer
    passing their own `<p>` would hit the same error.
  - Render the description wrapper as a `<div>` with the same classes, and
    update the `children` props-table row.
  - Done when lint, typecheck and `npm run build` pass, and the Spec Card page
    loads in the browser with no console errors or hydration warnings.

## Files / areas

- `registry/ui/bento-grid.tsx`, `stat-band.tsx`, `spec-card.tsx`,
  `access-card.tsx`, `hardware-panel.tsx`, `hud-image-frame.tsx`,
  `neon-edge-card.tsx`, `classified-card.tsx` (new)
- `registry.json` (edit: eight items)
- `app/docs/components/{bento-grid,stat-band,spec-card,access-card,hardware-panel,hud-image-frame,neon-edge-card,classified-card}/page.mdx`
  (new)
- `public/r/` (generated, gitignored)

## Data / contracts

- **New registry install ids:** `@cybr/bento-grid`, `@cybr/stat-band`,
  `@cybr/spec-card`, `@cybr/access-card`, `@cybr/hardware-panel`,
  `@cybr/hud-image-frame`, `@cybr/neon-edge-card` and `@cybr/classified-card`.
  They become public once shipped, so do not rename them later. The artboard
  footer already uses `@cybr/bento-grid`.
- **Component APIs**, as listed in steps 1-4. Exported names are the PascalCase
  of the file name, plus the named subcomponents: `BentoGridItem`,
  `SpecCardAction`, `HardwarePanelStatus` and `Redacted`.
- **Docs routes:** `/docs/components/<item>`, where `<item>` is the registry
  `name`.
- No persisted data, network input or auth. All props come from the developer.
  Text renders as React text nodes, never as HTML. `href` values are the
  caller's own.

## Testing

- No test command is configured, so there are no unit tests. The only logic is
  the span class map and the Redacted reveal state.
- The gates are `npm run lint`, `npx tsc --noEmit`, `npm run build`, registry
  JSON inspection and server-HTML inspection.
- Browser, reduced-motion and clean-install checks run only when a browser or
  network access is available (step 6). Do not claim them otherwise.

## Notes for the AI

- Read the relevant guides in `node_modules/next/dist/docs/` before touching MDX
  or client components. `cacheComponents` is enabled. Confirm that the
  `"use client"` Classified Card still prerenders inside MDX.
- Never put hex values outside `styles/tokens.css`. Arbitrary values reference
  `var(--token)`.
- Components must work with a consumer's stock `cn()`. Avoid class pairs that a
  stock tailwind-merge collapses. Feature 6 found that `leading-*` is dropped
  next to a `text-*` size, so use `[line-height:…]` for fixed display leading.
- Static Tailwind class maps only. Never build class names from strings
  (`col-span-${n}`).
- No glitch elements here. The docs preview's existing `grain` and `crosshair`
  stay as they are. On wide previews (Bento Grid, Stat Band), check that the
  centred preview container does not squash them, and give them `w-full`.
- The breakpoints are viewport breakpoints, not container queries. Inside the
  `max-w-5xl` docs preview, 4 columns at `lg` gives cells of about 200px. Check
  that the demo content fits them. Do not widen the docs layout.

## Verification results

Run on `feature/layout-cards-set` on 2026-11-02.

- `npm run lint`: clean. `npx tsc --noEmit`: clean.
- `npm run build`: passed.
  - `shadcn build` built all eight new items.
  - `next build` prerendered all 22 static routes, including the eight new
    `/docs/components/<item>` routes.
- **Registry JSON:** every new item is `registry:ui`, with one file, its own
  `registry/ui/<item>.tsx`.
  - Access Card's dependencies are `utils, @cybr/tokens, @cybr/effects`.
  - The other seven depend on `utils, @cybr/tokens` only.
  - The `registry.json` edit only appends entries. Existing entries are
    unchanged.
- **Hex grep:** there are no hex values in the eight component files.
- **Prerendered HTML:**
  - Each Classified Card bar is `<button type="button">` holding an
    `aria-hidden` text span and the `sr-only` "Redacted. Activate to
    declassify."
  - Stat Band renders `<dt>MVP COMPONENTS</dt>` before `<dd>030</dd>`.
  - HUD Image Frame has a `<figcaption>`.
  - The Spec Card and Hardware Panel titles render as `<h3>`.
  - The Bento cells carry `sm:col-span-2` and `sm:col-span-2 lg:col-span-4`.
  - Each Code tab shows its own source file.
- **Compiled CSS:** it contains `hazard-stripes`, `lg:col-span-4` and
  `-webkit-text-stroke:2px var(--ink)`.
- **Build-time fixes:**
  - Access Card: the `[&>*]:size-full` photo sizing would also have resized the
    placeholder crosshair lines. It now applies only on a wrapper around a
    supplied `photo`.
  - HUD Image Frame: the caption uses `ml-auto` to stay at the bottom right when
    there is no `index`, so no empty spacer element is needed.
- **`/check` (2026-11-02), first run:** headless Chrome over the DevTools
  protocol, against the user's running dev server. It failed on one item: a
  nested `<p>` hydration error on the Spec Card page. Step 7 fixed it.
- **After step 7:** lint, typecheck and `npm run build` pass. The same browser
  script was rerun:
  - All eight pages load with no console errors, hydration warnings or failed
    requests, and each Code tab shows its own source.
  - The Bento Grid has 4, 2 and 1 columns at 1280, 800 and 500px.
  - The Stat Band wraps to full-width rows at 500px.
  - The Spec Card has its 8px signal shadow, and its action moves 2px and drops
    to a 2px shadow on hover.
  - The Neon Edge Card glows on hover and on keyboard focus, with a 3px outline
    offset 6px. Its link name is the full card text, and reduced motion turns
    the transition off.
  - Redacted bars reveal on click, Enter and Space. Focus moves onto the
    revealed text, and a revealed bar cannot be hidden again. A focused bar
    shows a 3px signal outline.
  - The accessibility tree holds the hidden words only inside the page's Usage
    code sample, never in the preview, until a bar is revealed.
  - The screenshots match the artboard.
- **Superseded by `/check` above:** the "Not run" browser item below.
- **Not run:**
  - The browser check: hover, focus glow, reduced-motion, Redacted focus
    handoff, breakpoints and hydration warnings. Implement does not start a dev
    server. `/check` covers it.
  - The clean-install check into a throwaway Next.js app. It needs the local
    registry served by a running dev server and network access for
    `create-next-app`.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":27480,"specSha256":"20c2b914493907a86fee836060810eeba93ac9526cbb8f422f02600a1dda52cd","branch":"refs/heads/feature/layout-cards-set","head":"c3d5906195cba43a7d97aae60044e91374a52192","baseRef":"refs/heads/main","baseCommit":"c3d5906195cba43a7d97aae60044e91374a52192","sourceTree":"31fc799fcadf7ff5e01e8fa6c0afc5e78b0640a4","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

Run `npm run dev`, open http://localhost:3000/docs/components/classified-card, then press Tab until a black bar is focused and press Enter.

Expected:

The bar shows a 3px signal-coloured outline when focused. On Enter it becomes the plain text "sector nine at", focus moves onto that text, and the bar doesn't come back.

This proves:

The Redacted bar can be revealed from the keyboard, the reveal is one-way, and focus moves onto the revealed text.
