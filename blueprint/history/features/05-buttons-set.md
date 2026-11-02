# Feature: Buttons set

**From build-plan:** feature 5
**Build attempt:** 1
**Branch:** feature/buttons-set
**Status:** verified

## Goal

Ship the other four buttons from the Buttons artboard (Glitch, HUD Bracket,
Terminal, Hazard) as installable `@cybr` registry items with docs pages. Each
docs page, including the existing Hard-Offset page, documents its idle, hover,
pressed and disabled states. Register `styles/effects.css` as `@cybr/effects`,
because these are the first components that need shared keyframes. Feature 3
deferred that until now.

## Design reference

Mockups canvas, artboard "Buttons" (`project/Main.dc.html`), cards `02 / GLITCH`
to `06 / STATES`. Match layout, motion and details. Colours come from tokens
only. Shared base, same as Hard-Offset: JetBrains Mono, 15px
(`text-[0.9375rem]`), `min-h-13`, `rounded-none`, inline-flex, centred, `gap-2.5`,
and the same focus-visible outline (`--focus-width` solid `signal`, offset
`--focus-offset`).

| Button | Idle (artboard) | Hover (artboard) |
|---|---|---|
| Glitch | bold, `tracking-button`, UPPERCASE, `px-7`; transparent bg, `text-ink`, 2px (`--border-base`) solid `ink` border | border becomes `signal`. Two copies of the label slice over it: the top copy is `signal`, clipped to `inset(0 0 55% 0)`; the bottom copy is `neon-2`, clipped to `inset(52% 0 0 0)`. They jitter on `steps(3)` (A: -4,0 → 3,-1 → -1,1 px; B: the mirror image) |
| HUD Bracket | bold, `tracking-button`, UPPERCASE, `px-8.5` (34px); `bg-ground-deep`, `text-ink`, 1px (`--border-hair`) `line` border. Four 12px L-shaped corners with 3px (`--border-heavy`) arms in `signal`, placed at -6px | text becomes `signal`; corners snap out to -11px (5px) over `--duration-fast` with `ease-step-3` |
| Terminal | weight 400, normal case, `tracking-[0.04em]`; `bg-ground-void`, `text-signal`, 1px `line` border. Label is `> ` + text + a 10×18px `currentColor` block cursor that blinks on a 1s `steps(1)` cycle | `bg-signal`, `text-ground-void`, border `signal` |
| Hazard | bold, `tracking-button`, UPPERCASE; outer has 6px padding, no border, a -45deg stripe background (`signal` 0-12px / `ground-deep` 12-24px), `background-size: 34px 34px`. Inner span: `min-h-10`, `px-5.5`, `bg-ground-deep`, `text-ink` | the stripes march: `background-position` goes to `34px 0` over 0.6s, linear, infinite |

The artboard leaves three things undefined. These choices are visual, reversible
and internal, and each docs page records them:

- **Pressed (`:active`):** every new button presses in by `--offset-hard-hover`
  (3px) on both axes, with no transition. This is the family's press-in motion.
- **Disabled ("OFFLINE"):** the `06 / STATES` treatment from Hard-Offset:
  `bg-surface`, `text-label`, 2px dashed `dim` border, `cursor-not-allowed`, and
  no hover, press or animation. Bracket corners turn `dim` and stay at -6px.
  The Terminal cursor stays solid. The Hazard stripes are replaced by
  `bg-surface`, and the inner span becomes `bg-surface text-label`.
- **Glitch rhythm:** the artboard loops the jitter at 0.4s for as long as the
  button is hovered. That breaks the overview's rule of short glitch bursts about
  every 3s, so the jitter runs on a 3s cycle instead. Displacement happens only
  in the first ~400ms (about 13%), matching the existing `glitch` utility.

Contrast, computed from `styles/tokens.css`: `signal` on `ground-void` is 5.74:1
and the reverse is 5.74:1. `ink` on `ground-deep` is 16.74:1, `ink` on `bg` is
14.63:1, and `label` on `surface` is 5.55:1. All text passes 4.5:1. The Terminal
border (`line` on `ground-void`) is 2.33:1. That is acceptable because the
`signal` label identifies the control, not the border.

## In scope

- Four components in `registry/ui/`: `glitch-button.tsx` (`GlitchButton`),
  `hud-bracket-button.tsx` (`HudBracketButton`), `terminal-button.tsx`
  (`TerminalButton`) and `hazard-button.tsx` (`HazardButton`). All are CSS-only
  server-safe components with no `"use client"` and no `motion`.
- New `@utility` and `@keyframes` blocks in `styles/effects.css` for the
  reusable motion: the glitch slice jitter (two layers), the blinking cursor and
  the hazard march. Each one animates only under
  `prefers-reduced-motion: no-preference`.
- A `registry.json` item named `effects` (`registry:file`, from
  `styles/effects.css`, target `styles/cybr-effects.css`). This copies the
  pattern of the `tokens` item. Its description gives the
  `@import "../styles/cybr-effects.css";` line.
- Four `registry:ui` items. Glitch, Terminal and Hazard depend on
  `["utils", "@cybr/tokens", "@cybr/effects"]`. HUD Bracket uses transitions only
  and depends on `["utils", "@cybr/tokens"]`.
- Four docs pages at `app/docs/components/<item>/page.mdx`, following the
  Hard-Offset template.
- A `## States` section on all five button docs pages, including Hard-Offset.

## Out of scope

- A combined `@cybr/button` with variants. The artboard footer string is a
  placeholder. The repo uses one registry item and one docs page per component.
- Typed-out labels on the Terminal Button. Typewriter behaviour belongs to
  Feature 6.
- A component index or links between docs pages (Feature 13). Changes to the
  specimen page (`app/page.tsx`).
- Size variants, `asChild` or Slot, and new primitives (Feature 8).
- Registering the extended `cn()`. Components keep working with the consumer's
  stock `cn()`.
- Production domain and install docs (Feature 15).

## Build loop

- Work on `feature/buttons-set`, created from `main`.
- `workflow.stepReview` is `feature`: build every step, then stop once for review
  at the end. `workflow.checkpointCommits` is `disabled`: make no commits.
  `/complete` creates the feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. After steps 1 and
  5, also run `npm run build`.

## Build steps

- [x] 1. **Effects keyframes and the `effects` registry item**
  - In `styles/effects.css`, add utilities that follow the file's existing
    conventions and record each one in the layer-ownership comment:
    - `glitch-slice-a` and `glitch-slice-b`: transform animation, 3s
      `steps(1, end)` infinite, with displacement only in the first ~13%.
    - `cursor-blink`: opacity animation, 1s `steps(1)` infinite.
    - `hazard-march`: animates `background-position` to `34px 0`, 0.6s linear
      infinite.
    - Every animation sits inside
      `@media (prefers-reduced-motion: no-preference)`.
  - The blink and the march stay below WCAG 2.3.1's 3 flashes per second (blink
    is 1Hz; the march is about 1.7 stripe alternations per second) and cover a
    small area. Write that rationale in a comment.
  - Add the `effects` item to `registry.json`.
  - Done when `npm run build` passes, `public/r/effects.json` exists with the
    `styles/cybr-effects.css` target, and the Hard-Offset docs page still
    renders unchanged.

- [x] 2. **Glitch Button and HUD Bracket Button, with items**
  - **`GlitchButton`:** `ComponentProps<"button">`, `type="button"` by default,
    and `className` merged last with `cn()`, as in `HardOffsetButton`. The label
    renders once as visible text. The two slice copies are absolutely positioned
    `aria-hidden="true"` spans that hold the same `children`. Do not use
    `::before`/`::after` with `content: attr()`, because generated content can be
    read into the accessible name. The slices are hidden until an enabled hover,
    and they stay hidden under `motion-reduce`, where hover only changes the
    border colour.
  - **`HudBracketButton`:** the same API. Four `aria-hidden` corner spans snap
    out on enabled hover. Add `motion-reduce:transition-none`.
  - Gate every hover and press effect on the enabled state, because disabled
    buttons still match `:hover`.
  - Avoid class pairs that a stock tailwind-merge would collapse.
  - Add both `registry:ui` items, with the component file listed first in
    `files`, because `getItemSource` reads `files[0]`.
  - Done when lint and typecheck pass and `npm run registry:build` writes
    `glitch-button.json` and `hud-bracket-button.json`.

- [x] 3. **Terminal Button and Hazard Button, with items**
  - **`TerminalButton`:** the same API. Render `>` and a space, then `children`,
    then the cursor span. The prompt and the cursor are both `aria-hidden`, so
    the accessible name is the label alone. The cursor uses `cursor-blink`.
  - **`HazardButton`:** the same API. The outer `<button>` carries the stripes
    and `hazard-march` on enabled hover. The inner span carries the label.
  - Add both items.
  - Done when lint and typecheck pass and the registry build writes
    `terminal-button.json` and `hazard-button.json`.

- [x] 4. **Docs pages**
  - Add `app/docs/components/{glitch-button,hud-bracket-button,terminal-button,hazard-button}/page.mdx`
    with the same structure as the Hard-Offset page:
    - header, install command, and a preview showing an idle and a disabled
      instance, using the artboard labels "Jack in", "Target", "execute" and
      "Purge cache", with "Offline" for disabled
    - props table
    - `## Usage`
    - a new `## States` bullet list (Idle, Hover, Pressed, Disabled, plus
      Focus-visible)
    - `## Accessibility`
  - Each page's usage or accessibility notes give the `cybr-effects.css` import
    where the item needs it.
  - The accessibility notes cover these points:
    - native `<button>`
    - `type` default
    - focus outline
    - the aria-hidden decorations (slice copies, corners, prompt and cursor)
    - reduced-motion fallbacks
    - flash-rate compliance for glitch, blink and march
    - contrast, if colours are overridden
    - for Hazard, that destructive actions still need confirmation in the
      consumer's own flow
  - Add a `## States` section to `hard-offset-button/page.mdx`. Its existing
    content stays.
  - Done when `npm run build` prerenders all five `/docs/components/<item>`
    routes and each page's Code tab shows its own source.

- [x] 5. **Verification**
  - Run `npm run lint`, `npx tsc --noEmit` and `npm run build`.
  - Inspect each new `public/r/*.json` for its files, targets and
    `registryDependencies`.
  - When a browser is available, run `npm run dev` and check each new page:
    - idle, hover, pressed, disabled and focus-visible against the artboard
    - with "prefers-reduced-motion: reduce" emulated, no animation runs
      (`document.getAnimations()` is empty while hovering)
    - the accessible name of each button is its label alone
  - When network access is available, install `@cybr/hazard-button` into a
    throwaway Next.js app outside the repo against the local dev server, as in
    Feature 3. Confirm that `styles/cybr-tokens.css` and
    `styles/cybr-effects.css` arrive and that the stripes march after both
    imports are added.
  - If a browser or network access is unavailable, record that check as not run
    and say why.
  - Done when the results are recorded in this spec.

## Files / areas

- `styles/effects.css` (edit)
- `registry.json` (edit)
- `registry/ui/glitch-button.tsx`, `hud-bracket-button.tsx`, `terminal-button.tsx`,
  `hazard-button.tsx` (new)
- `app/docs/components/{glitch-button,hud-bracket-button,terminal-button,hazard-button}/page.mdx`
  (new)
- `app/docs/components/hard-offset-button/page.mdx` (edit: add `## States`)
- `public/r/` (generated, gitignored)

## Data / contracts

- **New registry install ids:** `@cybr/effects`, `@cybr/glitch-button`,
  `@cybr/hud-bracket-button`, `@cybr/terminal-button` and `@cybr/hazard-button`.
  The names become public install ids once shipped, so do not rename them later.
- **Effects install contract:** the consumer gets `styles/cybr-effects.css` and
  adds one `@import` after the tokens import. This mirrors `@cybr/tokens`.
  The utility names added to `effects.css` become public, like the existing ones.
- **Component APIs:** each component is `ComponentProps<"button">` with
  `type="button"` by default and no extra props. Its export name is the
  PascalCase of the file name.
- **Docs routes:** `/docs/components/<item>`, where `<item>` is the registry
  `name`.

## Testing

- No test command is configured. The components contain no branching logic
  worth unit-testing.
- The gates are `npm run lint`, `npx tsc --noEmit` and `npm run build`, plus
  inspection of the registry JSON.
- Browser, reduced-motion and clean-install checks run only when a browser or
  network access is available (step 5). Do not claim them otherwise.

## Notes for the AI

- Read the relevant guides in `node_modules/next/dist/docs/` before touching MDX
  or routing. `cacheComponents` is enabled.
- Never put hex values outside `styles/tokens.css`. Use Tailwind token classes
  and `var(--token)` arbitrary values.
- Components must work with a consumer's stock `cn()`. See the comment in
  `registry/ui/hard-offset-button.tsx`.
- Verify shadcn `registry:file` and `target` behaviour against the installed CLI.
  If the CLI rejects anything, record the deviation here.
- Hover in Tailwind v4 already sits behind `@media (hover: hover)`, so touch
  devices get no sticky hover.
- At most one glitch per viewport: the Glitch Button is static when idle and
  glitches only on hover, so it complies. Do not add a "live" or forced-hover
  demo instance to its preview.

## Verification results

Run on `feature/buttons-set` on 2026-11-02.

- `npm run lint`: clean. `npx tsc --noEmit`: clean.
- `npm run build`: passed. `shadcn build` built `tokens`, `effects`,
  `hard-offset-button`, `glitch-button`, `hud-bracket-button`,
  `terminal-button` and `hazard-button`. `next build` prerendered all five
  `/docs/components/<item>` routes.
- Registry JSON:
  - `effects.json` copies `styles/effects.css` to `styles/cybr-effects.css`.
  - Glitch, Terminal and Hazard depend on
    `utils, @cybr/tokens, @cybr/effects`.
  - HUD Bracket depends on `utils, @cybr/tokens`.
  - Each item lists one file, its own `registry/ui/<item>.tsx`.
- Compiled CSS:
  - `glitch-slice-a`/`-b`, `cursor-blink` and `hazard-march` (including their
    `enabled:hover:` and `group-enabled:` variants) are emitted only inside
    `@media (prefers-reduced-motion: no-preference)`.
  - The glitch slices show only via
    `motion-safe:group-enabled:group-hover:block`, which is more specific than
    `hidden`.
  - Disabled `bg-none` clears the hazard stripes.
- Prerendered HTML:
  - Each new page's Code tab names its own source file.
  - The `aria-hidden` decoration counts match the design: 2 slices per Glitch
    instance, 4 corners per Bracket instance, prompt plus cursor per Terminal
    instance, none for Hazard.
- **`/check` (2026-11-02), headless Chrome over the DevTools protocol against
  the running dev server:** all four new pages and the Hard-Offset page pass.
  - Computed styles match the States notes for idle, hover, pressed, disabled
    (with hover having no effect) and focus-visible (3px `signal` outline,
    offset 6px).
  - With "prefers-reduced-motion: reduce" emulated, `document.getAnimations()`
    is empty while hovering on every page.
  - Accessibility-tree names are the labels alone ("JACK IN", "TARGET",
    "execute", "PURGE CACHE").
  - Each Code tab shows its own `registry/ui/<item>.tsx`.
  - No console errors or failed requests.
- **Clean-app install:** `create-next-app`, `shadcn init -d`, `@cybr` mapped to
  `http://localhost:3000/r/{name}.json`, then
  `shadcn add @cybr/hazard-button`.
  - It created `styles/cybr-tokens.css`, `styles/cybr-effects.css` and
    `components/ui/hazard-button.tsx`, byte-identical to the repo, and skipped
    the existing `lib/utils.ts`.
  - After the two imports, `next build` passed.
  - Under `next start`: the stripes march on hover, stay static under reduced
    motion, and the disabled button shows the dashed offline style.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":15817,"specSha256":"72e226c7323aa0b03fd2a547f6e0ebc46aeac8258fc64e3192e07aa00318b82b","branch":"refs/heads/feature/buttons-set","head":"025954d5dd9bca951f617bfd9bcb92ebda57a95f","baseRef":"refs/heads/main","baseCommit":"025954d5dd9bca951f617bfd9bcb92ebda57a95f","sourceTree":"79cd7b796576933b476d5f8e7db4b566ca3dbedf","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, then open http://localhost:3000/docs/components/hazard-button and hover the "Purge cache" button.

Expected:

The orange and dark diagonal stripes around the dark "PURGE CACHE" plate march sideways in a steady loop while hovered and stop when the pointer leaves. The "Offline" button beside it has a dashed grey border, no stripes, and does not react to hover.

This proves:

The new `@cybr/effects` hover animation and the shared disabled state work on a live docs page.
