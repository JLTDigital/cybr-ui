# Feature: Accessible primitives decision + Tooltip & Marquee set

**From build-plan:** feature 8
**Build attempt:** 1
**Branch:** feature/accessible-primitives-decision-tooltip-marquee-set
**Status:** verified

## Goal

Settle the accessible-primitives library as **Base UI** (`@base-ui/react`), and
record that choice in the plans. Then ship the five components on the Tooltip
and Marquee artboard as installable `@cybr` registry items, each with a docs
page. The components are HUD Tooltip, Classified FAQ Accordion, Ticker Marquee,
Warning Tape and Logo Wall. Tooltip and Accordion wrap Base UI. The two marquees
use a new shared CSS `marquee` utility and get a visible pause control
(WCAG 2.2.2). Logo Wall is static and server-safe.

## Decisions made at spec time

- **Primitives: Base UI.** The user chose it on 2026-11-02 over Radix UI. The
  package is `@base-ui/react` (1.9.0 is current on npm). It composes triggers
  through a `render` prop, not `asChild`. Later features (Command Palette, Mega
  Menu, dialogs, form primitives) build on it.
- **Marquee pause.** The user chose this on 2026-11-02. Ticker Marquee and Warning
  Tape pause on hover and while focus is inside them. They also show a visible
  pause/play toggle, which is on by default and hidden by
  `pauseControl={false}`. Under `prefers-reduced-motion` nothing moves and the
  toggle is not rendered.

## Design reference

Mockups canvas, artboard "Tooltip and Marquee"
(`project/TooltipMarquee.dc.html`), cells `01 / TICKER MARQUEE` to
`05 / LOGO WALL`. Match the layout, motion and details. Colours come from tokens
only. The hex-to-token map is the same as in Feature 7:

| Artboard hex | Token |
|---|---|
| `#FF4C29` / `{{accent}}` | `signal` |
| `#F8F9FA` | `ink` |
| `#ADB5BD` | `label` |
| `#495057` | `line` |
| `#343A40` | `surface` |
| `#212529` | `bg` |
| `#16191C` | `ground-deep` |
| `#0E1012` | `ground-void` |

The cell chrome is docs demo content, not part of any component. That covers the
numbered labels, the header and footer, the noise and the scanlines. The
`NODE 07` / `NODE 12` trigger buttons, the FAQ copy, the ticker and tape strings
and `[LOGO 01]` are also demo content. In the ticker demo,
`NPX SHADCN ADD @CYBR/TICKER` becomes `@CYBR/TICKER-MARQUEE`, the real install
id.

| Component | Artboard details |
|---|---|
| Ticker Marquee | A `signal` band, 50px tall, with `ground-deep` text and 2px `ground-deep` top and bottom borders. Overflow is hidden and items are vertically centred. The track is mono 700 14px with 0.14em tracking, `nowrap`, and 48px right padding on each item. It is rendered twice (the second copy `aria-hidden`) and translates `-50%` over 26s, linear, infinite. |
| HUD Tooltip, `readout` | A `ground-void` box, 200px wide, with a 1px `signal` border and 10px/12px padding. Mono 11px, leading 1.6, 0.06em tracking, `ink` text. It sits 58px below the trigger's top, so about a 12px gap under a 44px trigger. It appears instantly (`display` toggle) on hover and focus. |
| HUD Tooltip, `lock` | A `ground-void` box, 222px wide, with a 1px `line` border and 14px/16px padding. Two 12px `signal` corner brackets, 3px thick, sit at the top-left and bottom-right, offset -4px. Inside: a 10px `label` eyebrow with 0.16em tracking and a 6px gap below, a display 20px title (leading 1) with 8px below, and an 11px `label` body (leading 1.6). A 2px `signal` elbow leader line ends in a 10px `signal` square node, running from the popup edge toward the trigger. |
| Classified FAQ Accordion | A 2px `line` frame. Each item has a 1px `line` bottom rule. The trigger is full width, `min-h-13` (52px), with 18px x-padding, mono 700 13px, 0.12em tracking and `ink` text. It is split between an id in `signal` (`F-01`) plus the question on the left, and a decorative 18px `+`/`−` mark on the right. Hover fills it with `surface`. Focus is a 3px `signal` outline, offset -3px. The panel has 2px/18px/14px padding, 12px `label` text, leading 1.7, a `ground-deep` fill and a 1px dashed `line` top border. Only one item is open at a time and it can be closed. It opens instantly, with no height animation. |
| Warning Tape | A `ground-deep` strip, 140px tall, holding a 40px tape rotated -2.5deg. The tape overhangs each side by 40px and is filled with 14px `signal` / `ground-deep` diagonal stripes at -45deg. Its labels are `ground-deep` chips with `ink` text, 700 13px with 0.2em tracking, 6px/14px padding and 140px between chips. They scroll in reverse over 20s. Below it is a decorative 22px `ink`/`ground-deep` striped tape rotated 1.5deg at 0.85 opacity. |
| Logo Wall | A hairline grid (2px gaps over a `line` parent) with a 2px `line` bottom border, 96px tall. A 220px label cell (12px `label`, 0.14em tracking, 32px x-padding) is followed by six equal `bg` cells. Each logo is a link that fills its cell: 700 12px with 0.16em tracking, `label` text and a 2px transparent border. On hover the text and border turn `signal`, over 100ms on `steps(2)`. |

The artboard is a fixed 1280px poster, so these points need a decision. Each one
is visual, reversible and internal, and each docs page records it:

- **Tooltip as one component with two variants.** `variant="readout"` (the
  default) and `variant="lock"`. The artboard's "pinned" lock tooltip only shows
  the open state on a static poster. The component is controllable
  (`open`/`defaultOpen`/`onOpenChange`), so a caller can pin it. There is no
  separate pinned component.
- **Lock leader line.** The leader is a decorative stub plus a square node on the
  popup edge that faces the trigger. It is oriented by Base UI's `data-side` on
  the popup, so it follows collision flips. It replaces the artboard's
  free-floating elbow, which is positioned by hand.
- **Tooltip timing.** Opening is instant (no fade), as on the artboard. The open
  delay is 150ms. The artboard has none, but a short delay stops tooltips firing
  as the pointer sweeps past. Focus opens it immediately, through Base UI's
  default behaviour.
- **Tooltip side.** It opens below the trigger by default (`side="bottom"`,
  `sideOffset={12}`, start-aligned), as on the artboard. `side` and `align` are
  props. Base UI flips it on collision.
- **Accordion hover contrast.** `signal` small text fails contrast on `surface`.
  So while a trigger is hovered, its id switches to `ink`. The id stays `signal`
  on the default `bg`.
- **Accordion default state.** The artboard opens F-01 by default. The component
  defaults to all closed. The docs demo passes `defaultValue` to open the first
  item.
- **Marquee seam.** Two copies of the content are needed for a seamless loop, and
  each copy must be at least as wide as the band. The component does not measure
  or repeat content automatically. The docs say to pass enough items to fill the
  widest expected band.
- **Pause toggle placement.** On the Ticker it sits at the right end of the band
  as a `ground-deep` chip with `ink` mono 11px bold text (`PAUSE`/`PLAY`), above
  the track. On the Warning Tape it sits unrotated in the top-right corner of the
  strip with the same styling. Its focus outline is `ink` rather than `signal`
  where the button sits on the `signal` band, because a `signal` outline would be
  invisible there. `ink` on `signal` clears 3:1 for a non-text indicator.
- **Warning Tape stripes.** The main tape reuses the existing `hazard-stripes`
  utility (12px stripes, not the artboard's 14px), as Access Card did in
  Feature 7. `variant="ink"` draws the secondary `ink`/`ground-deep` tape. Without
  `items`, a tape is a static, decorative stripe band. The docs demo stacks a
  `signal` tape with items over an `ink` tape without them.
- **Logo Wall responsiveness.** Below `sm`: a 2-column grid with the label cell
  spanning the full row. From `sm`: 3 columns. From `lg`: one row, the label at
  220px and the logo cells sharing the rest equally. Cells are 96px tall from
  `lg`, and at least 72px below `lg`. Any number of logos is allowed.
- **Logo hover timing** uses `--duration-snap` (90ms) with `ease-step-2`, the
  nearest token to the artboard's 100ms. Under reduced motion there is no
  transition.

## In scope

- `@base-ui/react` added to `package.json` dependencies.
- A `marquee` utility and keyframes added to `styles/effects.css`, with the
  ownership comment updated.
- The decision recorded in `blueprint/project-plan.md` and
  `blueprint/context/project-overview.md`.
- Five `registry:ui` components, one file each, in `registry/ui/`:
  - `hud-tooltip.tsx`: `HudTooltip` (`"use client"`)
  - `classified-accordion.tsx`: `ClassifiedAccordion`,
    `ClassifiedAccordionItem` (`"use client"`)
  - `ticker-marquee.tsx`: `TickerMarquee` (`"use client"`, for pause state)
  - `warning-tape.tsx`: `WarningTape` (`"use client"`, for pause state)
  - `logo-wall.tsx`: `LogoWall`, `LogoWallItem` (server-safe)
- Five items in `registry.json`.
- Five docs pages at `app/docs/components/<item>/page.mdx`.

## Out of scope

- Menus, dialogs, popovers or a Command Palette (Features 10 and 11). No shared
  Base UI wrapper or `Slot` layer is added beyond what these two components use.
- Height or fade animation on Accordion panels or Tooltip popups.
- Automatic content measurement or repetition for marquees, drag or
  speed-on-scroll behaviour, and vertical marquees.
- Retrofitting `render` or `asChild` props onto existing components.
- Theme presets (Feature 12), the component index and landing page (Feature 13),
  and CI (Feature 14).
- Changes to existing components, tokens or docs scaffolding, apart from the
  effects-file comment.

## Build loop

- Work on `feature/accessible-primitives-decision-tooltip-marquee-set`, created
  from `main`.
- `workflow.stepReview` is `feature`: build every step, then stop once for review
  at the end. `workflow.checkpointCommits` is `disabled`: make no commits.
  `/complete` creates the feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. After steps 1, 3,
  5 and 6, also run `npm run build`.

## Build steps

Shared rules for every component (same as Feature 7):

- `className` is merged last with `cn()`.
- The component forwards the remaining native props of its root element.
- Its file comes first in the item's `files` list, because `getItemSource` reads
  `files[0]`.
- Decorative elements are `aria-hidden="true"` and `pointer-events-none`.
- Registry dependencies are `["utils", "@cybr/tokens"]` unless a step says
  otherwise.
- Focus is the standard 3px `signal` outline unless a step says otherwise.

- [x] 1. **Base UI, the marquee utility and the decision record**
  - `npm install @base-ui/react`. Check its peer dependencies in the installed
    `package.json`. npm lists `date-fns` and `@date-fns/tz`, which should be
    optional in `peerDependenciesMeta`. If they are required, stop and report
    rather than adding them.
  - Read the installed Tooltip and Accordion type definitions under
    `node_modules/@base-ui/react/`. Confirm the part names (`Tooltip.Provider`,
    `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`; `Accordion.Root`,
    `Item`, `Header`, `Trigger`, `Panel`). Also confirm where the hover delay
    lives (`Trigger` or `Provider`) and the prop name for single versus
    multiple open. Use what the installed version exposes. Record any
    difference from this spec under Notes in this file.
  - In `styles/effects.css`, add `@utility marquee`. Under
    `prefers-reduced-motion: no-preference`, it runs
    `marquee var(--marquee-duration, 26s) linear infinite` with
    `animation-direction: var(--marquee-direction, normal)`. Add
    `@keyframes marquee { to { transform: translateX(-50%) } }`. Add a row to
    the layer-ownership comment: `marquee  transform animation  host is a w-max
    track holding two identical copies`.
  - In `blueprint/project-plan.md`, replace the line-136 `[DECIDE]` cell with
    Base UI (`@base-ui/react`), and change line 107's "Radix or Base UI" to
    "Base UI". In `project-overview.md`, change the stack bullet to Base UI
    (decided in Feature 8) and remove the "Accessible primitives" open
    question.
  - Done when `npm run build` passes with `@base-ui/react` installed and the
    built CSS contains the `marquee` keyframes. Check this through a temporary
    class in a demo, or by inspecting the step 4 output. The plan and overview
    then name Base UI with no open question.

- [x] 2. **HUD Tooltip, with item**
  - Props:
    - `content: ReactNode` (readout body, or lock body)
    - `children: ReactElement` (one focusable trigger element, passed to Base
      UI's `Trigger` `render` prop)
    - `variant?: "readout" | "lock"`, default `"readout"`
    - `eyebrow?: ReactNode`, `title?: ReactNode` (`lock` only; ignored for
      `readout`)
    - `side?: "top" | "right" | "bottom" | "left"`, default `"bottom"`
    - `align?: "start" | "center" | "end"`, default `"start"`
    - `open?`, `defaultOpen?`, `onOpenChange?`, passed through to Root
    - `className` (applied to the popup) and the remaining popup props
  - Wrap in its own `Tooltip.Provider`, so a single install works with no app
    provider. Hover delay 150ms. Positioner `sideOffset={12}`. Render the popup
    in `Tooltip.Portal`.
  - The popup carries Base UI's `role="tooltip"` and is linked to the trigger
    (check `aria-describedby` in the browser). Escape closes it. The pointer can
    move into the popup without closing it (WCAG 1.4.13, the Base UI default;
    check that it is not disabled).
  - `readout`: `w-50 bg-ground-void border-(length:--border-hair) border-signal
    px-3 py-2.5 font-mono text-caption [line-height:1.6] tracking-[0.06em]
    text-ink`.
  - `lock`: `w-55.5 bg-ground-void border-(length:--border-hair) border-line
    px-4 py-3.5`, the two bracket corners, then eyebrow, title and body as on
    the artboard. Add the decorative leader stub and node on the side facing
    the trigger, chosen by `data-[side=…]` variants.
  - `z-50` on the positioner. No hex. Static class maps for the variants.
  - Registry: `dependencies: ["@base-ui/react"]`.
  - Done when lint and typecheck pass and `npm run registry:build` writes
    `hud-tooltip.json` listing `@base-ui/react`.

- [x] 3. **Classified FAQ Accordion, with item**
  - **`ClassifiedAccordion`**
    - Base UI `Accordion.Root` with single-open as the default.
    - Forward `value`, `defaultValue`, `onValueChange` and the
      multiple-open prop under its installed name.
    - Root classes: `border-(length:--border-base) border-line`.
  - **`ClassifiedAccordionItem`**
    - Props: `value: string`, `id?: ReactNode` (the `F-01` tag), `question:
      ReactNode`, `children` (the answer), `headingAs?: "h2" | "h3" | "h4"`
      (default `"h3"`, through `Accordion.Header`'s `render`), and the
      remaining `Accordion.Item` props.
    - The trigger is a native button from Base UI with `aria-expanded` and
      `aria-controls`. Classes: `group flex w-full min-h-13 items-center
      justify-between gap-4 px-4.5 text-left font-mono text-[0.8125rem]
      font-bold tracking-button text-ink hover:bg-surface
      focus-visible:outline-(length:--focus-width) outline-offset-[-3px]
      outline-signal`.
    - The id `span` is `text-signal group-hover:text-ink`.
    - The `+`/`−` mark is `aria-hidden`, switched by the trigger's
      `data-panel-open` (or the installed equivalent).
    - Panel: `bg-ground-deep border-t border-dashed border-line px-4.5 pt-0.5
      pb-3.5 text-xs [line-height:1.7] text-label`. No animation.
    - Each item has a `border-b-(length:--border-hair) border-line` rule. The
      last item drops it with `last:border-b-0`, so the frame is not doubled.
  - Registry: `dependencies: ["@base-ui/react"]`.
  - Done when `npm run build` passes and writes `classified-accordion.json`.

- [x] 4. **Ticker Marquee and Warning Tape, with items**
  - Shared behaviour, written into each file. Each registry item stays
    self-contained.
    - `items: ReactNode[]`. The first copy is a `ul` of `li`s. The second copy is
      an identical `ul aria-hidden="true"`. Both sit in one `flex w-max marquee`
      track.
    - `duration?: number` (seconds) and `reverse?: boolean` set
      `--marquee-duration` and `--marquee-direction` as inline style.
    - Pause: the track gets `[animation-play-state:paused]` on root
      `group-hover`, on `group-focus-within`, and when `paused` state is true.
    - `pauseControl?: boolean`, default `true`. It renders
      `<button type="button">` with visible text `PAUSE` or `PLAY`. Clicking it
      toggles `paused`. The button carries `motion-reduce:hidden`. When paused
      by the button, hover-out does not resume.
    - An empty `items` renders the band with no track and no button.
    - Keys use the array index.
  - **`TickerMarquee`**
    - Default `duration` 26.
    - Root: `div` with `group relative flex h-12.5 items-center overflow-hidden
      bg-signal text-ground-deep border-y-(length:--border-base)
      border-ground-deep`. It forwards `ComponentProps<"div">` without
      `children`, and callers pass `aria-label`.
    - Items: mono bold 14px, `tracking-label`, `whitespace-nowrap pr-12`.
    - The pause button is `absolute right-0 inset-y-0` with `ground-deep` fill,
      `ink` text and an `ink` focus outline.
  - **`WarningTape`**
    - Props: `items?: ReactNode[]`, `variant?: "signal" | "ink"` (default
      `"signal"`), `tilt?: number` (degrees, default -2.5), `duration` (default
      20), `reverse` (default `true`), `pauseControl`, and
      `ComponentProps<"div">` without `children`.
    - Root: `group relative overflow-hidden py-6`. The caller sets the
      background.
    - Tape: `-mx-10 flex h-10 items-center overflow-hidden` with an inline
      `rotate(<tilt>deg)` transform. The `signal` variant uses
      `hazard-stripes`. The `ink` variant is `h-5.5 opacity-85` with an
      arbitrary `repeating-linear-gradient(-45deg, var(--ink) 0 10px,
      var(--ground-deep) 10px 20px)`.
    - Chips: `bg-ground-deep text-ink px-3.5 py-1.5 mr-35` plus bold 13px with
      `tracking-[0.2em]`.
    - With no `items`, the whole tape is `aria-hidden` and has no pause button.
    - The pause button is `absolute top-2 right-2`, not rotated, with an `ink`
      focus outline.
  - Registry: `["utils", "@cybr/tokens", "@cybr/effects"]` for both.
  - Done when lint and typecheck pass and the registry build writes
    `ticker-marquee.json` and `warning-tape.json`, each depending on
    `@cybr/effects`.

- [x] 5. **Logo Wall, with item**
  - **`LogoWall`**
    - Props: `label?: ReactNode`, `children`, and `ComponentProps<"div">`.
    - Root: `grid grid-cols-2 sm:grid-cols-3 lg:flex gap-(--border-base)
      bg-line border-b-(length:--border-base) border-line`.
    - The label cell is `col-span-full lg:w-55 lg:shrink-0 flex items-center
      bg-bg px-8 py-4 text-xs tracking-label text-label`, and is omitted when
      unset.
  - **`LogoWallItem`**
    - Props: `ComponentProps<"a">`. It renders an `a` when `href` is set,
      otherwise a `div` with the same visual cell.
    - The cell wrapper is `bg-bg min-h-18 lg:h-24 lg:flex-1 lg:min-w-0`.
    - Link classes: `flex size-full items-center justify-center border-(length:--border-base)
      border-transparent text-xs font-bold tracking-[0.16em] text-label
      no-underline transition-colors duration-(--duration-snap) ease-step-2
      hover:text-signal hover:border-signal motion-reduce:transition-none
      focus-visible:outline-(length:--focus-width) outline-offset-[-3px]
      outline-signal`.
    - Logo images and their `alt` text are the caller's job.
  - Done when `npm run build` passes and writes `logo-wall.json`.

- [x] 6. **Docs pages**
  - Add the five `app/docs/components/<item>/page.mdx` pages. They follow the
    Feature 7 structure: header, install command, preview, props table,
    `## Usage` with the needed `@import` lines (tokens, plus effects for the
    marquees), `## States`, then `## Accessibility`.
  - Previews:
    - **HUD Tooltip:** two artboard triggers (`NODE 07` readout, `NODE 12`
      lock) as demo buttons styled like the artboard `.trig`. The page tells
      readers to hover or tab to them.
    - **Accordion:** the three artboard FAQs, with `defaultValue` opening F-01.
    - **Ticker:** the artboard strings, with the install-id fix. `w-full`.
    - **Warning Tape:** a `signal` tape with items over an `ink` tape without
      them, on a `ground-deep` wrapper. `w-full`.
    - **Logo Wall:** six `[LOGO 0n]` links with `href="#"`. `w-full`.
  - The props tables list every prop above, including the forwarded native
    element or Base UI part.
  - `## Accessibility` covers:
    - Tooltip: opens on hover and focus, Escape closes it, the pointer can
      enter the popup, `aria-describedby` linking, content must not be
      essential (touch has no hover), and the decorative leader.
    - Accordion: native buttons with `aria-expanded`, the heading level via
      `headingAs`, and the `signal`-to-`ink` hover swap for contrast.
    - Marquees: the duplicate copy is hidden from assistive tech, hover/focus
      pause, the pause button (WCAG 2.2.2), the reduced-motion static state,
      and the `ink` focus outline on `signal`.
    - Logo Wall: link names come from children, images need `alt`, and hover
      plus focus styles.
    - Text contrast pairs, from the overview figures.
    - The advice to keep contrast when colours are overridden.
  - Each page records its Design reference decisions from the list above.
  - Done when `npm run build` prerenders all five new `/docs/components/<item>`
    routes and each Code tab shows its own source.

- [x] 7. **Verification**
  - Run `npm run lint`, `npx tsc --noEmit` and `npm run build`.
  - Inspect each new `public/r/*.json` for its type, its single file and its
    dependencies. Tooltip and Accordion list `@base-ui/react`. The two marquees
    list `@cybr/effects`. Logo Wall lists neither.
  - Grep the five new component files for hex values. There should be none.
  - Check the server HTML:
    - The accordion triggers are buttons with `aria-expanded`, inside an `h3`.
    - Each marquee has one readable `ul` and one `aria-hidden` copy.
    - The logo cells are `a` elements.
  - When a browser is available, run `npm run dev` and check each page against
    the artboard:
    - The tooltip opens on hover and on Tab, closes on Escape, can be hovered
      into, and flips at the viewport edge with the lock leader following.
    - The accordion opens one item at a time with the keyboard.
    - Marquees loop without a visible seam, and pause on hover, on focus and
      by the button.
    - Under emulated reduced motion, the marquees are static and have no
      button.
    - Logo hover works.
    - There are no hydration warnings or console errors.
  - When network access is available, install `@cybr/hud-tooltip` and
    `@cybr/ticker-marquee` into a throwaway Next.js app outside the repo, as in
    Features 5 and 7. Confirm that `@base-ui/react` installs and `next build`
    passes there.
  - If a browser or network access is unavailable, record that check as not run
    and say why.
  - Done when the results are recorded in this spec.

## Files / areas

- `package.json`, `package-lock.json` (edit: `@base-ui/react`)
- `styles/effects.css` (edit: `marquee` utility, keyframes, comment)
- `blueprint/project-plan.md`, `blueprint/context/project-overview.md` (edit:
  the decision)
- `registry/ui/hud-tooltip.tsx`, `classified-accordion.tsx`,
  `ticker-marquee.tsx`, `warning-tape.tsx`, `logo-wall.tsx` (new)
- `registry.json` (edit: five items)
- `app/docs/components/{hud-tooltip,classified-accordion,ticker-marquee,warning-tape,logo-wall}/page.mdx`
  (new)
- `public/r/` (generated, gitignored)

## Data / contracts

- **New registry install ids:** `@cybr/hud-tooltip`, `@cybr/classified-accordion`,
  `@cybr/ticker-marquee`, `@cybr/warning-tape` and `@cybr/logo-wall`. They
  become public once shipped, so do not rename them later. The artboard footer
  already uses `@cybr/hud-tooltip`.
- **New npm dependency for consumers:** `@base-ui/react`, declared on the two
  Base UI items only.
- **Effects utility:** `marquee`, driven by `--marquee-duration` and
  `--marquee-direction`. It becomes part of the `@cybr/effects` contract.
- **Component APIs**, as listed in steps 2-5. Exported names are the PascalCase
  of the file name, plus `ClassifiedAccordionItem` and `LogoWallItem`.
- **Docs routes:** `/docs/components/<item>`, where `<item>` is the registry
  `name`.
- No persisted data, network input or auth. All props come from the developer.
  Text renders as React text nodes, never as HTML. `href` values are the
  caller's own.

## Testing

- No test command is configured, so there are no unit tests. The only logic is
  the pause toggle state. Open state lives in Base UI.
- The gates are `npm run lint`, `npx tsc --noEmit`, `npm run build`, registry
  JSON inspection and server-HTML inspection.
- Browser, reduced-motion, keyboard and clean-install checks run only when a
  browser or network access is available (step 7). Do not claim them otherwise.

## Notes for the AI

- Read the relevant guides in `node_modules/next/dist/docs/` before touching MDX
  or client components. `cacheComponents` is enabled. Confirm that the client
  components still prerender inside MDX.
- Base UI's API differs from Radix. Use its `render` prop, not `asChild`. Read
  the installed types rather than relying on memory (step 1).
- Never put hex values outside `styles/tokens.css`. Arbitrary values reference
  `var(--token)`.
- Components must work with a consumer's stock `cn()`. Use `[line-height:…]`
  for fixed leading next to a `text-*` size (the Feature 6 finding).
- Static Tailwind class maps only. Never build class names from strings.
- Inline `style` is allowed only for the numeric CSS variables and the tilt
  transform. No colours go in inline style.
- At most one glitch element per viewport. None are added here.
- No flashing: marquees translate smoothly, with no flicker.
- **Base UI findings from step 1 (installed 1.9.0).** Peer `date-fns` and
  `@date-fns/tz` are optional. The part names match the spec. Hover delay is a
  `Trigger` prop. Single versus multiple open is `multiple` (default `false`).
  The open marker on the accordion trigger is `data-panel-open`. **Deviation:**
  Base UI's Tooltip is visual-only. It sets neither `role="tooltip"` nor
  `aria-describedby`. To meet the spec's linking contract, `HudTooltip` sets
  `role="tooltip"` and a `useId` id on the popup. It mirrors the open state, so
  the trigger's `aria-describedby` only points at a mounted popup. Base UI also
  does not show tooltips on touch devices. The docs say so.

## Verification results

Run on `feature/accessible-primitives-decision-tooltip-marquee-set` on
2026-11-02.

- `npm run lint`: clean. `npx tsc --noEmit`: clean.
- `npm run build`: passed.
  - `shadcn build` built all five new items.
  - `next build` prerendered all 27 static routes, including the five new
    `/docs/components/<item>` routes.
- **Registry JSON:** every new item is `registry:ui`, with one file, its own
  `registry/ui/<item>.tsx`.
  - HUD Tooltip and Classified Accordion list `dependencies: ["@base-ui/react"]`
    and `utils, @cybr/tokens`.
  - Ticker Marquee and Warning Tape list `utils, @cybr/tokens, @cybr/effects`.
  - Logo Wall lists `utils, @cybr/tokens` only.
  - The `registry.json` edit only appends entries.
- **Hex grep:** there are no hex values in the five component files.
- **Prerendered HTML:**
  - The accordion has three `<h3><button aria-expanded>` triggers, with F-01
    expanded.
  - Each marquee has one readable `ul`, one `aria-hidden` `ul` copy and a
    `PAUSE` button.
  - Logo Wall renders six `<a>` cells.
- **Compiled CSS:** it contains `@keyframes marquee`, `.marquee`,
  `animation-play-state:paused`, the `data-[side=…]` leader variants,
  `data-panel-open` marks, `motion-reduce:hidden`, the ink tape gradient and
  `outline-ink`.
- **Build-time fixes:**
  - Logo Wall cells used `size-full` inside a `min-h` parent, which would not
    stretch. The wrapper is now `flex` and the cell `w-full`.
  - Re-serialising `registry.json` reformatted every existing entry, so it was
    reverted. New items are now appended as text.
- **`/check` (2026-11-02):** headless Chrome over the DevTools protocol,
  against the user's running dev server. Every done-when passed. The first run's
  misses were test-script artifacts and were rerun: an Enter key event without
  `text`, a float comparison, rotated bounding boxes, an off-screen hover point,
  the wrong transition property, and no emulated window focus.
  - **Tooltip:**
    - Opens 150ms after hover and immediately on Tab focus, 12px below the
      trigger. `role="tooltip"` and `aria-describedby` are present only while
      it is open.
    - The pointer can move into the popup. Escape closes it.
    - The lock tooltip opens right with the leader and node. At 560px it flips
      left, and the leader moves to the trigger-facing edge.
  - **Accordion:** F-01 starts open. Enter and Space open one item at a time
    and close the open item. The `+`/`−` marks follow, and the focus outline is
    a 3px `signal` inset. Hover gives a `surface` fill with an `ink` id.
  - **Marquees:**
    - Two equal copies with the second `aria-hidden`. Each copy is wider than
      the band, and the track moves exactly one copy width.
    - Both pause on hover and on focus inside, with an `ink` focus outline.
    - The PAUSE button switches to PLAY, stays paused after the pointer leaves,
      and PLAY resumes.
    - Under reduced motion there is no animation and no button.
  - **Logo Wall:**
    - One row at 1280px (220px label, 96px cells), 3 columns at 800px and 2 at
      500px.
    - Hover is `signal`, and there is no transition under reduced motion.
  - **All five pages:** no console errors, hydration warnings or failed
    requests, and each Code tab shows its own source.
  - **Cosmetic notes, not done-when failures:**
    - The lock leader stops 1px short of the trigger, because it starts inside
      the popup's 1px border.
    - The Warning Tape PAUSE button can overlap the end of a scrolling chip.
- **Superseded by `/check` above:** the "Not run" browser item below.
- **Not run:**
  - The browser check. That covers tooltip hover, focus, Escape, hover-into and
    flip; the accordion keyboard; the marquee seam and pauses;
    reduced-motion; logo hover; and hydration warnings. Implement does not
    start a dev server. `/check` covers it.
  - The clean-install check into a throwaway Next.js app. It needs the local
    registry served by a running dev server and network access for
    `create-next-app`.



<!-- blueprint:completion {"schemaVersion":2,"specBytes":30815,"specSha256":"cba22108a0c1437577e054af0800e801718d59bb80fa30ad34f7409c058dc5c1","branch":"refs/heads/feature/accessible-primitives-decision-tooltip-marquee-set","head":"8ea03f7b284ebd69e9b50e4ff77d1bf7af9003a0","baseRef":"refs/heads/main","baseCommit":"8ea03f7b284ebd69e9b50e4ff77d1bf7af9003a0","sourceTree":"f476603793f7a2c34b7bcd629339303d9edca02f","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

Run `npm run dev`, open http://localhost:3000/docs/components/ticker-marquee, then click the **PAUSE** button at the right end of the orange band and move the pointer away.

Expected:

The ticker text stops scrolling and the button reads **PLAY**. The text stays still after the pointer leaves the band, and clicking **PLAY** starts the scroll again.

This proves:

The ticker can be paused and resumed from its visible button, separately from the hover pause (WCAG 2.2.2).
