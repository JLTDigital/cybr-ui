# Feature: Interactive set

**From build-plan:** feature 11
**Build attempt:** 1
**Branch:** feature/interactive-set
**Status:** verified

## Goal

Ship three installable registry components in the CYBR//UI style:

- **Command Palette (⌘K):** a keyboard-first, filterable command list in a
  dialog.
- **Pixelated Image Trail:** images that drop behind the cursor and resolve
  from coarse pixels.
- **Data-Readout Carousel:** a framed slide viewer with `01 / 08` index
  counters.

Each one gets a `registry.json` entry, built `public/r/` output and a docs page
at `/docs/components/<item>` using the Feature 4 template.

## Design reference

There is no artboard for this set. The mockup canvas
(https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx) stops at board 06. The
user chose to spec the look from the existing design language instead, so the
rules below are the reference. Use tokens only, no hex, in components.

- **Shared language:**
  - Radius 0 and 2px `--line` borders.
  - Solid offset shadows (`--shadow-hard`) with no blur. No backdrop blur,
    because glassmorphism is banned.
  - Mono labels at 0.14em tracking in `--label`, with numeric indexes in
    `--signal`.
  - Hairline grids, made with `gap` over a `--line` parent.
  - Mechanical motion only: `steps()` and snaps, 120–300ms.
- **Command Palette:**
  - **Backdrop:** `--ground-void` at about 80% opacity.
  - **Popup:** `--ground-deep`, 2px `--line` border, hard offset shadow, about
    40rem wide (capped to the viewport minus 2rem), placed about 15vh from
    the top.
  - **Input row:** a `--signal` `>` prompt before a mono input with a
    `--signal` caret, separated by a 2px `--line` rule.
  - **Group labels:** micro mono `--label` text, such as `// COMPONENTS`.
  - **Rows:** mono `--ink` labels with an optional right-aligned `--label`
    hint. The highlighted row fills `--signal` with `--ground-deep` text.
  - **Empty state:** `NO MATCH // 0 RESULTS` in `--label`.
  - **Footer strip:** `↑↓ NAVIGATE · ↵ RUN · ESC CLOSE` on the left and the
    result count on the right.
  - **Default trigger:** a bordered mono button reading `SEARCH`, followed by
    a `⌘K` key-cap on `--ground-void`.
- **Pixelated Image Trail:**
  - The host is a `relative` box that clips its overflow. Images spawn at
    the pointer, about 160×120 each, with a 1px `--line` border.
  - Each tile resolves through stepped pixel sizes (coarse → sharp), holds,
    then steps back to coarse and disappears. There is no smooth opacity
    fade.
- **Data-Readout Carousel:**
  - **Frame:** a 2px `--line` border on `--bg`.
  - **Header bar:** on `--ground-deep`, with the carousel label on the left
    and the counter on the right. The counter is a `--signal` current index,
    padded to 2 digits, then ` / ` and the total in `--label`
    (`01 / 08`).
  - **Slide area:** below the header.
  - **Footer bar:** `[ ← PREV ]` and `[ NEXT → ]` mono buttons at the ends.
    Between them sits a decorative segment strip with one cell per slide; the
    current cell is `--signal`, the rest are `--line`.
  - **Slide change:** a stepped wipe that reuses the existing `wipe-reveal`
    utility from `styles/effects.css`. That utility runs for 1080ms, so
    shorten it on the slide to about 300ms with an `animation-duration`
    override, keeping its `steps()` timing. Do not edit the shared utility.

## In scope

- Three components:
  - `registry/ui/data-readout-carousel.tsx`
  - `registry/ui/command-palette.tsx`
  - `registry/ui/pixelated-image-trail.tsx`
- Three `registry.json` items named `data-readout-carousel`,
  `command-palette` and `pixelated-image-trail`, each with the `@cybr/*` and
  npm dependencies it actually uses.
- Three docs pages at `app/docs/components/<item>/page.mdx`. Each has a
  header, install command, live preview, props table, usage, states or
  behaviour, and an accessibility section, like the existing pages.
- Original demo images for the trail demo: a few simple SVG "data plates" in
  `public/demo/`. They are docs-only and not part of any registry item.
- Reduced-motion and no-JS behaviour for every animated part.

## Out of scope

- Wiring the palette into the docs site, and docs-site search or a component
  index (Feature 13).
- Autoplay for the carousel. Leaving it out avoids WCAG 2.2.2 pause controls.
- Touch swipe on the carousel. Its buttons work on touch.
- An image trail on touch input, and any trail without a pointer. Children
  still render.
- Fuzzy matching, async results, keywords, nested pages or recent items in the
  palette.
- GSAP or any new npm dependency. Base UI (installed) covers the palette.
- Theme presets (Feature 12) and CI checks (Feature 14).

## Build loop

- `workflow.stepReview` is `feature`. Build all steps, then stop once for
  review at the end of the feature, not after each step.
- `workflow.checkpointCommits` is `disabled`. Make no commits during the
  build. `/complete` creates the single feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. After the last
  step, run `npm run build`, which includes the registry build.

## Build steps

- [x] 1. **Data-Readout Carousel.**
  - Client component. Props:
    - `label: string`: required, the carousel's accessible name, shown in
      the header bar.
    - `slides: ReactNode[]`
    - `index?`, `defaultIndex?` (default `0`) and
      `onIndexChange?(index: number)`: controlled or uncontrolled.
    - `loop?: boolean`, default `false`.
    - `...section props`
  - Behaviour:
    - Only the current slide is visible. The others render with the `hidden`
      attribute, so no-JS and server output show slide 1.
    - PREV and NEXT step by one. Without `loop` they are `aria-disabled` at
      the ends (changed from `disabled` during the build: a natively disabled
      button drops focus to `<body>`, which broke the arrow keys); with
      `loop` they wrap.
    - Left and right arrow keys step while focus is inside the carousel,
      except while focus is in a text field.
    - A new slide plays the shortened `wipe-reveal` stepped wipe by
      remounting on index change. It is static under reduced motion, because
      the utility is already off there.
    - Out-of-range `index` or `defaultIndex` values clamp to the valid
      range.
  - Accessibility:
    - The root is a `<section>` with `aria-roledescription="carousel"` and
      `aria-label={label}`.
    - Each slide is a `role="group"` with `aria-roledescription="slide"` and
      `aria-label="N of M"`.
    - The slide container is `aria-live="polite"`. There is no autoplay, so
      announcing changes is appropriate.
    - The buttons are named "Previous slide" and "Next slide". Their bracket
      and arrow glyphs are `aria-hidden`.
    - The counter and segment strip are `aria-hidden`, because the slide
      labels carry the position.
  - Edge states:
    - Empty `slides`: the frame shows `00 / 00`, both buttons are disabled,
      and the slide area is empty.
    - One slide: both buttons are disabled.
  - Add the registry item and docs page. The demo shows about 4 readout
    slides built from existing pieces, such as a `StatBand` or simple
    mono/display text.
  - **Done when:** `/docs/components/data-readout-carousel` renders slide
    `01 / 04`, NEXT and the arrow keys advance with the wipe, PREV is
    disabled on slide 1, and NEXT is disabled on the last slide. Reduced
    motion swaps slides instantly. Lint and tsc pass.

- [x] 2. **Command Palette.**
  - Before writing code, read the Base UI Autocomplete "Command palette"
    example in
    `node_modules/@base-ui/react/docs/react/components/autocomplete.md` and
    `dialog.md`. Copy that structure: `Dialog.Root` with an inline,
    always-open `Autocomplete.Root`, `autoHighlight="always"` and
    `keepHighlight`.
  - Client component. Props:
    - `groups: { label: string; items: { value: string; label: string; hint?: string }[] }[]`
    - `onSelect(value: string)`: called with the chosen item's value. The
      palette then closes and clears its input.
    - `open?`, `defaultOpen?` and `onOpenChange?`: controlled or
      uncontrolled.
    - `shortcut?: boolean`, default `true`. While mounted, ⌘K on macOS or
      Ctrl+K anywhere toggles the palette; the key event's default is
      prevented, and nothing fires while an IME is composing.
    - `shortcutLabel?: string`, default `"⌘K"`, shown on the trigger.
    - `trigger?: ReactNode | false`: the default trigger is the SEARCH
      button, and `false` renders none.
    - `label?: string`, default `"Command palette"`: the dialog name.
    - `placeholder?: string`, default `"Type a command…"`.
  - Filtering uses Base UI's default case-insensitive match on item labels.
  - Empty states:
    - No matches shows `NO MATCH // 0 RESULTS`.
    - Empty `groups` shows the same empty state.
    - A group with no matching items hides its label.
  - Accessibility:
    - Focus moves to the input on open.
    - Up and down arrows move the highlight, and Enter runs the highlighted
      item.
    - Escape and a backdrop click close the palette, and focus returns to
      the trigger (Base UI Dialog default).
    - The input is named "Search commands" and described by the visually
      hidden footer instructions.
  - Nothing animates (instant open and close), so there is no reduced-motion
    branch.
  - Add the registry item (`dependencies: ["@base-ui/react"]`) and docs
    page. The demo palette lists the library's components as groups. Its
    `onSelect` shows the chosen value in a small `--label` readout under the
    trigger (`LAST RUN: <value>`), so selection is observable without
    navigating.
  - **Done when:**
    - On `/docs/components/command-palette`, both clicking SEARCH and
      pressing Ctrl+K open the palette with focus in the input.
    - Typing `glitch` filters the list to the Glitch items.
    - ArrowDown plus Enter selects an item, closes the palette and updates
      the readout.
    - Typing `zzz` shows the empty state.
    - Escape closes the palette, with focus back on SEARCH.
    - Lint and tsc pass.

- [x] 3. **Pixelated Image Trail.**
  - Client component. Props:
    - `images: string[]`: image URLs.
    - `spacing?: number`, default `80`: pointer travel in px before the next
      drop.
    - `size?: { width: number; height: number }`, default `160×120`.
    - `max?: number`, default `8`: the most tiles alive at once. The oldest
      is removed first.
    - `children`: the host content.
    - `...div props`
  - Images preload once with `new Image()`. Images that fail to load are
    skipped, and with none loaded there is no trail.
  - Drops cycle through the images in order. A drop happens on `pointermove`
    of `pointerType` mouse or pen only, centred on the pointer within the
    host.
  - Each tile is a `<canvas>`:
    - It draws the image downscaled to the current block size, then scales
      it up with `imageSmoothingEnabled = false`.
    - The block sizes go 24 → 12 → 6 → 3 → 1px, about 70ms per step.
    - It holds sharp for about 400ms, then steps back 3 → 12 → 24 and is
      removed.
    - It never reads pixels, so cross-origin images draw without CORS
      setup.
  - All timers and frames are cleared on unmount.
  - Off paths:
    - Reduced motion, touch-only input and no-JS: no trail, and children
      render normally.
    - The reduced-motion check uses `useReducedMotion`, which reports
      reduced on the server and during hydration, so no trail starts before
      the real preference is known.
  - Accessibility:
    - The trail layer is `aria-hidden` and `pointer-events-none` above the
      children, so children stay fully interactive and readable.
    - Tiles appear only as a direct result of the user's pointer movement.
      Document that they are not flashing content: they are small tiles,
      not full-viewport changes, and the steps are not a repeating flicker.
  - Add 4 original SVG demo plates in `public/demo/` (`trail-01.svg` to
    `trail-04.svg`): simple brutalist blocks, stripes and labels. Hex values
    are fine in these docs-only assets. Add the registry item and docs page;
    the demo host is about 360px tall with a centred heading as children.
  - **Done when:** on `/docs/components/pixelated-image-trail`, moving the
    mouse across the demo drops tiles that resolve from coarse to sharp and
    then disappear, with at most 8 at once. With reduced motion emulated,
    moving the mouse produces no tiles. No console errors. Lint and tsc
    pass.

- [x] 4. **Registry and build verification.**
  - Confirm all three items are in `registry.json`, with descriptions in the
    existing style that end with "Requires @cybr/tokens." and list any other
    required `@cybr/*` item.
  - Run `npm run build`.
  - **Done when:** `npm run build` succeeds, `public/r/` contains the three
    new `<item>.json` files, and all three docs routes appear in the build
    output.

## Files / areas

- New:
  - `registry/ui/data-readout-carousel.tsx`
  - `registry/ui/command-palette.tsx`
  - `registry/ui/pixelated-image-trail.tsx`
- New: `app/docs/components/<item>/page.mdx` for each of the three items.
- New: `public/demo/trail-01.svg` to `trail-04.svg` (docs demo assets only).
- New: `app/docs/_components/command-palette-demo.tsx`, a docs-only client
  wrapper that holds the `LAST RUN` readout state for the palette demo.
- Edit: `registry.json`. Add the three items as text, without reformatting
  existing entries.
- Generated: `public/r/*.json` (gitignored).
- Patterns to follow:
  - `registry/ui/mega-menu.tsx` and `registry/ui/classified-accordion.tsx`
    for Base UI wrapping.
  - `registry/ui/boot-sequence-loader.tsx` and `lib/use-reduced-motion.ts`
    for timers and the static-first approach.
  - `registry/ui/segmented-progress.tsx` for the segment strip look.
  - `app/docs/_components/replay.tsx` if a demo needs a remount.

## Data / contracts

- Registry item names (install ids) are fixed: `data-readout-carousel`,
  `command-palette`, `pixelated-image-trail`. All are `registry:ui`.
  - `registryDependencies` always includes `utils` and `@cybr/tokens`.
  - Add `@cybr/effects` to the carousel, for `wipe-reveal`.
  - Add `@cybr/use-reduced-motion` to the trail.
  - Add `dependencies: ["@base-ui/react"]` to `command-palette` only.
- Docs routes: `/docs/components/<item>`, using `getRegistryItem(<item>)`.
- All text comes from props and renders as React text nodes. There is no
  `dangerouslySetInnerHTML`.
- Trail image URLs are passed to `Image.src` only; they are never injected
  into markup.
- There is no persisted data, network API, auth or destructive operation.

## Testing

- No test command is configured, so there are no unit tests.
- Gates: `npm run lint`, `npx tsc --noEmit` and `npm run build`.
- Behavioural checks happen in `/check` against the dev server, using
  headless Chrome over CDP as in Feature 10. Playwright is not installed, so
  do not install it.
  - carousel: buttons, arrows, ends, reduced motion
  - palette: Ctrl+K, filter, empty state, select, Escape focus return
  - trail: tiles on mouse move, max 8, none under reduced motion
  - each page: no console errors and no horizontal overflow at 375px
- Report these as evidence only if they were actually run.

## Notes for the AI

- Read `node_modules/next/dist/docs/` for anything Next-specific (the AGENTS
  notice).
- The palette's ⌘K listener registers on `document` only while mounted with
  `shortcut` on.
- On the docs page, the palette trigger works inside a `TerminalNavbar`
  `actions` slot. Mention this in Usage; it needs no demo.
- Contrast:
  - The highlighted palette row is `--ground-deep` on `--signal` at 5.31:1.
  - Hints are `--label` on `--ground-deep` at 8.51:1.
  - The carousel counter is `--signal` on `--ground-deep` at 5.31:1.
  - Never put small `--signal` text on `--surface`.
- Keep each file self-contained, because the library is copy-paste. Do not
  share helpers across these registry files.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":16055,"specSha256":"07f03a8e5b0e57877bf15b5e75aaac59516362f1e8c2748966a185ca04c2dc58","branch":"refs/heads/feature/interactive-set","head":"7b856a24075d7a731ffb96630583fe1372c44136","baseRef":"refs/heads/main","baseCommit":"7b856a24075d7a731ffb96630583fe1372c44136","sourceTree":"36b095e2f6d7b33098a7d93500477d061ad2a807","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, open http://localhost:3000/docs/components/command-palette, press **Ctrl+K** (or ⌘K), type `glitch`, press **↓** then **Enter**.

Expected:

The palette opens with focus after the orange `>` prompt and lists 11 commands. Typing `glitch` leaves **Glitch Button** and **Glitch Heading** with `02 RESULTS` in the footer. ↓ moves the orange highlight to Glitch Heading, and Enter closes the palette, with `LAST RUN: glitch-heading` under the SEARCH button.

This proves:

The ⌘K shortcut opens the Command Palette, typing filters it, and keyboard selection calls `onSelect`.
