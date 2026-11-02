# Feature: Text & Motion set

**From build-plan:** feature 6
**Build attempt:** 1
**Branch:** feature/text-motion-set
**Status:** verified

## Goal

Ship the five components from the Text & Motion artboard (Decrypt Text,
Typewriter Terminal, Glitch Heading, Telemetry Counter and Stepped Wipe Reveal)
as installable `@cybr` registry items with docs pages. These are the first
components that animate from JavaScript, so register the existing
`lib/use-reduced-motion.ts` hook as `@cybr/use-reduced-motion` so that installs
keep the static-first, reduced-motion behaviour.

## Design reference

Mockups canvas, artboard "Text and Motion" (`project/TextMotion.dc.html`), cards
`01 / DECRYPT TEXT` to `05 / STEPPED WIPE REVEAL`. Match layout, motion and
details. Colours come from tokens only (artboard `#FF4C29` → `signal`,
`#00E5FF` → `neon-2`, `#F8F9FA` → `ink`, `#ADB5BD` → `label`, `#0E1012` →
`ground-void`, `#212529` → `bg`, `#495057` → `line`). The card chrome (numbered
labels, captions, `TTY0 · 80×24`, `DEMO VALUES`) is docs demo content, not
part of any component.

| Component | Artboard behaviour |
|---|---|
| Decrypt Text | Display font, 64px. Every 50ms tick redraws the string. Characters before `floor(tick / 2.5)` show the real character, and spaces always do. The rest show `GLYPHS[(i * 7 + tick * 3) % GLYPHS.length]` from `#%&@$*!<>/\|=+01ΞΣ`. `white-space: pre`. Runs once on mount. Demo string `ACCESS GRANTED`. |
| Typewriter Terminal | `ground-void` panel, mono 15px, line-height 1.75, line min-height 26px, `white-space: pre`. Types 2 characters per 50ms tick (40 chars/s) across lines in order. Prompt lines (`> …`) are `signal`, output lines `ink`. A 10×18px `signal` block cursor blinks at 1s `steps(1)` after the active line, and stays on the last line when done. Demo lines: `> boot --style=brutal`, `mounting /dev/concrete ...... ok`, `loading neon.drv ............ ok`, `> _ready`. |
| Glitch Heading | Display font, UPPERCASE, line-height 0.9 (artboard 50px). Two label copies: A is `signal` and B is `neon-2`. They are hidden (`clip-path: inset(0 0 100% 0)`) except during a burst on a 3.2s `steps(1)` cycle. A: 86% `translate(-7px,0)` `inset(8% 0 62% 0)`, 89% `(6px,0)` `inset(52% 0 22% 0)`, 92% `(-3px,0)` `inset(30% 0 48% 0)`, back to hidden at 84% and 100%. B: 87% `(7px,0)` `inset(64% 0 6% 0)`, 90% `(-5px,0)` `inset(18% 0 58% 0)`, 93% `(4px,0)` `inset(72% 0 4% 0)`, back to hidden at 85% and 100%. Demo text `SIGNAL LOST`. |
| Telemetry Counter | Display font, `tabular-nums`, 30px. It counts from 0 to the value over 45 ticks of 50ms (2250ms) with ease-out cubic `1 - (1 - p)^3`. Demo rows: `REQ / S` 1,284, `LATENCY MS` 12.4, `NODES ONLINE` 064, each a mono 11px `label` caption and the number, split by a 1px `line` rule. The caption says "counts on scroll-into-view". |
| Stepped Wipe Reveal | Display font, UPPERCASE, 44px, line-height 0.92, block lines. `clip-path` goes from `inset(0 100% 0 0)` to `inset(0 0 0 0)` on `steps(12)`. In the artboard, that wipe-in is the first 30% of a 3.6s loop (1080ms). Lines are staggered by 300ms. Demo: `Raw.`, `Loud.`, and `Lit.` in `signal`. |

The artboard is a looping demo, so these points need a decision. Each one is
visual, reversible and internal, and each docs page records it:

- **No `motion` dependency.** The overview names `motion/react` as the default
  animation tool. These effects are fixed-tick or CSS `steps()` animations. A
  timer, `requestAnimationFrame`, `IntersectionObserver` and CSS keyframes
  cover all of them. Adding `motion` would make every consumer install a
  package that none of them needs. Add it in the first feature that needs
  springs, layout animation or gestures.
- **Triggers.** Decrypt Text and Typewriter Terminal run once on mount, as in
  the artboard. Telemetry Counter and Stepped Wipe Reveal start the first time
  they scroll into view (`IntersectionObserver`, once), as the build plan says
  for the counter. Glitch Heading bursts continuously on its CSS cycle.
- **The wipe reveals once.** The artboard loop (hold, then wipe out) is a demo
  device. A reveal plays its 1080ms `steps(12)` wipe-in once, then stays
  revealed.
- **Static-first.** `useReducedMotion` reports `true` on the server and during
  hydration. So the server HTML, no-JS visitors and reduced-motion users get
  the finished state: the real string, all lines, the final number and visible
  wipe lines. Animation starts only after hydration confirms that motion is
  allowed. That means an above-the-fold item can show its final state for one
  frame before it resets and animates. That is the accepted cost of never
  hiding content from no-JS or reduced-motion users.
- **Replay in docs only.** The artboard's "↻ Replay sequence" becomes a docs
  helper that remounts the preview. The components expose no replay API.
- **Durations.** The artboard timings (about 1.75s decrypt, 2.25s count, 1.08s
  wipe) are longer than the 120-300ms token range. That range covers UI
  transitions. These are content reveals, and the artboard is the reference.

## In scope

- `lib/use-reduced-motion.ts` registered as a `registry:lib` item named
  `use-reduced-motion`. The file is unchanged.
- New `@utility` and `@keyframes` blocks in `styles/effects.css`:
  `glitch-heading-a`, `glitch-heading-b` and `wipe-reveal`. They are recorded in
  the layer-ownership comment and animate only under
  `prefers-reduced-motion: no-preference`.
- Five components in `registry/ui/`:
  - `decrypt-text.tsx` (`DecryptText`, client)
  - `typewriter-terminal.tsx` (`TypewriterTerminal`, client)
  - `glitch-heading.tsx` (`GlitchHeading`, server-safe, CSS only)
  - `telemetry-counter.tsx` (`TelemetryCounter`, client)
  - `stepped-wipe-reveal.tsx` (`SteppedWipeReveal`, client)
- Five `registry:ui` items and five docs pages at
  `app/docs/components/<item>/page.mdx`.
- `app/docs/_components/replay.tsx`, a small client helper that remounts its
  children from a Replay button. Use it in the Decrypt, Typewriter, Counter and
  Wipe previews.

## Out of scope

- The `motion` package or GSAP.
- A shared `use-in-view` hook or registry item. Two components each use their
  own few-line `IntersectionObserver` effect.
- Looping or wipe-out modes, `onComplete` callbacks, and imperative replay APIs.
- Stat rows and label/value layouts. Those belong to Stat Band in Feature 7. The
  counter is the number alone.
- Typed labels on the Terminal Button (Feature 5 is complete; no change).
- The component index, the specimen page (`app/page.tsx`), and links between
  docs pages (Feature 13).
- Changes to `useReducedMotion` behaviour.

## Build loop

- Work on `feature/text-motion-set`, created from `main`.
- `workflow.stepReview` is `feature`: build every step, then stop once for review
  at the end. `workflow.checkpointCommits` is `disabled`: make no commits.
  `/complete` creates the feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. After steps 1, 4
  and 5, also run `npm run build`.

## Build steps

- [x] 1. **Effects keyframes and the `use-reduced-motion` item**
  - In `styles/effects.css`, add utilities that follow the existing conventions:
    - `glitch-heading-a` and `glitch-heading-b`: the artboard `ghA`/`ghB`
      keyframes, 3.2s `steps(1, end)` infinite. Hidden `clip-path` is the base
      keyframe state.
    - `wipe-reveal`: `clip-path` from `inset(0 100% 0 0)` to `inset(0 0 0 0)`,
      1080ms `steps(12, end)`, `animation-fill-mode: both`, so the line stays
      clipped through its delay.
    - Every animation sits inside
      `@media (prefers-reduced-motion: no-preference)`.
    - Add a flash-rate comment for the heading burst: three positions per copy
      in about 300ms, once every 3.2s, so no more than 3 flashes in any second
      (WCAG 2.3.1).
  - Add the `use-reduced-motion` registry item: `registry:lib`, file
    `lib/use-reduced-motion.ts`, type `registry:lib`.
  - Check how the installed shadcn CLI places `registry:lib` files and rewrites
    `@/lib/use-reduced-motion` imports. If it differs from `lib/`, record the
    deviation here.
  - Done when `npm run build` passes, `public/r/use-reduced-motion.json` and the
    updated `effects.json` exist, and the existing docs pages still render.

- [x] 2. **Glitch Heading and Stepped Wipe Reveal, with items**
  - **`GlitchHeading`**
    - Props: `ComponentProps<"h2">` plus `as?: "h1" | "h2" | "h3" | "h4" | "h5"
      | "h6"`, default `"h2"`. `className` is merged last with `cn()`.
    - Classes: display font, UPPERCASE, `text-display-md`,
      `leading-[0.9]`, `text-ink`, `relative inline-block`.
    - Render `children` once as real text, plus two absolutely positioned
      `aria-hidden="true"` copies (`text-signal glitch-heading-a`,
      `text-neon-2 glitch-heading-b`). Do not use `::before`/`::after` with
      `attr()`, as in Feature 5.
    - The copies are `hidden` under `motion-reduce`.
    - No `"use client"`.
    - Item dependencies: `["utils", "@cybr/tokens", "@cybr/effects"]`.
  - **`SteppedWipeReveal`**
    - `"use client"`.
    - Props: `ComponentProps<"span">` plus `delay?: number`, in ms, default 0,
      applied as the inline `animationDelay`.
    - Renders a `block` span. The caller sets typography; the docs demo uses the
      artboard styles.
    - Phases, as a pure function of `reduced` and in-view state:
      - reduced, or before hydration: no clip
      - motion allowed but not yet seen: `[clip-path:inset(0_100%_0_0)]`
      - seen: `wipe-reveal`
    - The `IntersectionObserver` disconnects after the first intersection and on
      unmount.
    - The content is always in the DOM, so it needs no ARIA.
    - Item dependencies:
      `["utils", "@cybr/tokens", "@cybr/effects", "@cybr/use-reduced-motion"]`.
  - Put each component file first in its `files` list, because `getItemSource`
    reads `files[0]`.
  - Done when lint and typecheck pass and `npm run registry:build` writes
    `glitch-heading.json` and `stepped-wipe-reveal.json`. Check that each one's
    `registryDependencies` is correct.

- [x] 3. **Decrypt Text and Typewriter Terminal, with items**
  - **`DecryptText`**
    - `"use client"`.
    - Props: `text: string`, plus `ComponentProps<"span">` without `children`.
      `className` is merged last.
    - Render a `span` with an `sr-only` copy of `text` and an `aria-hidden`
      `whitespace-pre` span showing the current frame. It inherits typography
      from the caller.
    - A 50ms `setInterval` advances `tick` until every character is revealed
      (`ceil(text.length * 2.5)` ticks). It then clears.
    - Use the artboard's deterministic glyph formula. Do not use `Math.random`,
      because output stays reproducible.
    - Reduced motion, or before hydration: render `text` directly.
    - The effect depends on `[text, reduced]`. A change restarts the animation,
      a switch to reduced motion jumps to the final text, and unmount clears the
      timer.
    - An empty `text` renders an empty span.
    - Item dependencies: `["utils", "@cybr/tokens", "@cybr/use-reduced-motion"]`.
  - **`TypewriterTerminal`**
    - `"use client"`.
    - Props:
      - `lines: { text: string; prompt?: boolean }[]`
      - `promptSymbol?: string`, default `"> "`, prefixed to prompt lines
      - `charsPerSecond?: number`, default 40
      - `ComponentProps<"div">` without `children`
    - Panel: `bg-ground-void text-ink font-mono text-[0.9375rem] leading-[1.75]
      px-8 py-6`. Each line is a `div` with `min-h-6.5` and `whitespace-pre`.
      Prompt lines are `text-signal`.
    - Typed characters include the prompt symbol. A 50ms tick advances
      `charsPerSecond / 20` characters, shared across lines in order.
    - The `aria-hidden` cursor span (`inline-block h-4.5 w-2.5 bg-current
      text-signal cursor-blink`, with the artboard's -3px vertical alignment)
      sits after the line being typed, and after the last line once done.
    - Accessibility: an `sr-only` copy holds every full line (with prompt
      symbols). The typed view is `aria-hidden`.
    - Reduced motion, or before hydration: render every line in full, with the
      cursor on the last line.
    - An empty `lines` renders the panel with one empty line and the cursor.
    - Values of `charsPerSecond` that are not finite or not above 0 fall back to
      the default.
    - Item dependencies:
      `["utils", "@cybr/tokens", "@cybr/effects", "@cybr/use-reduced-motion"]`.
  - Done when lint and typecheck pass and the registry build writes
    `decrypt-text.json` and `typewriter-terminal.json`.

- [x] 4. **Telemetry Counter, with item**
  - `"use client"`.
  - Props:
    - `value: number`
    - `decimals?: number`, default 0
    - `minDigits?: number`, default 1
    - `locale?: string`, default `"en-US"`
    - `duration?: number`, in ms, default 2250
    - `ComponentProps<"span">` without `children`
  - Format with one `Intl.NumberFormat(locale, { minimumFractionDigits:
    decimals, maximumFractionDigits: decimals, minimumIntegerDigits: minDigits
    })`. The fixed default locale keeps the server and client output identical.
  - Classes: display font and `tabular-nums`. Size comes from the caller (the
    artboard uses 30px).
  - Render an `sr-only` final formatted value and an `aria-hidden` animated
    value.
  - Reduced motion, or before hydration: show the final value.
  - Motion allowed: show the 0 value until first in view. Then run a
    `requestAnimationFrame` loop from 0 to `value` over `duration` with ease-out
    cubic, landing exactly on `value`.
  - Observe once, and cancel the frame and observer on unmount.
  - A `value` change after the count finishes shows the new value at once.
  - A non-finite `value` renders its `Intl` output without animating.
  - Item dependencies: `["utils", "@cybr/tokens", "@cybr/use-reduced-motion"]`.
  - Done when lint, typecheck and `npm run build` pass and
    `telemetry-counter.json` is written.

- [x] 5. **Docs pages and Replay helper**
  - `app/docs/_components/replay.tsx` (`"use client"`):
    - It holds a `key` counter and renders its children under that key.
    - Below them is a library `TerminalButton` labelled "Replay" that
      increments the key.
    - It has no other state.
  - Add the five `app/docs/components/<item>/page.mdx` pages. They follow the
    Feature 5 page structure: header, install command, preview, props table,
    `## Usage` with the needed `@import` lines, then `## Behaviour` in place of
    `## States`, then `## Accessibility`.
  - Previews use the artboard demo content:
    - `ACCESS GRANTED` at display 64px-equivalent
    - the four boot lines
    - `SIGNAL LOST`
    - the three counter rows built in the page markup from tokens and captions
    - `Raw.` / `Loud.` / `Lit.` at delays 0/300/600, with `Lit.` in `signal`
  - Glitch Heading gets no Replay. It is the only glitch element on its page.
  - `## Behaviour` covers:
    - the trigger
    - the timing
    - the finished state
    - the reduced-motion and no-JS static state
    - the static-first one-frame note where it applies
  - `## Accessibility` covers:
    - the `sr-only` real string or lines, and the `aria-hidden` animated copies
    - heading level via `as` (Glitch Heading)
    - flash rate: decrypt and typing run once; glitch bursts every 3.2s; the
      wipe runs once at 12 steps
    - reduced-motion fallbacks
    - contrast if colours are overridden
  - Done when `npm run build` prerenders all five new
    `/docs/components/<item>` routes and each Code tab shows its own source.

- [x] 6. **Verification**
  - Run `npm run lint`, `npx tsc --noEmit` and `npm run build`.
  - Inspect each new `public/r/*.json` for its files, targets, type and
    `registryDependencies`.
  - Check the server HTML for each page:
    - the final string, lines and number are present
    - no wipe line is clipped
  - When a browser is available, run `npm run dev` and check each page:
    - the animations match the artboard timings
    - Replay restarts them
    - the counter and wipe wait until scrolled into view
    - with "prefers-reduced-motion: reduce" emulated, the final state shows at
      once and `document.getAnimations()` is empty
    - there are no hydration warnings or console errors
    - accessibility-tree text equals the real strings
  - When network access is available, install `@cybr/telemetry-counter` and
    `@cybr/typewriter-terminal` into a throwaway Next.js app outside the repo
    against the local dev server, as in Feature 5. Confirm that:
    - `use-reduced-motion` arrives with its import path rewritten correctly
    - `next build` passes
  - If a browser or network access is unavailable, record that check as not run
    and say why.
  - Done when the results are recorded in this spec.

## Files / areas

- `styles/effects.css` (edit)
- `registry.json` (edit)
- `lib/use-reduced-motion.ts` (registered, unchanged)
- `registry/ui/decrypt-text.tsx`, `typewriter-terminal.tsx`, `glitch-heading.tsx`,
  `telemetry-counter.tsx`, `stepped-wipe-reveal.tsx` (new)
- `app/docs/_components/replay.tsx` (new)
- `app/docs/components/{decrypt-text,typewriter-terminal,glitch-heading,telemetry-counter,stepped-wipe-reveal}/page.mdx`
  (new)
- `public/r/` (generated, gitignored)

## Data / contracts

- **New registry install ids:** `@cybr/use-reduced-motion`,
  `@cybr/decrypt-text`, `@cybr/typewriter-terminal`, `@cybr/glitch-heading`,
  `@cybr/telemetry-counter` and `@cybr/stepped-wipe-reveal`. They become public
  once shipped, so do not rename them later.
- **New public utility names** in `effects.css`: `glitch-heading-a`,
  `glitch-heading-b` and `wipe-reveal`.
- **Component APIs**, as listed in steps 2-4. Each export name is the PascalCase
  of its file name. Every component forwards the remaining native props of its
  root element.
- **Docs routes:** `/docs/components/<item>`, where `<item>` is the registry
  `name`.
- No persisted data, network input or auth. All props come from the developer.
  Text renders as React text nodes, never as HTML.

## Testing

- No test command is configured, so the frame and formatting logic gets no unit
  tests. Keep the formatting and easing as small pure functions inside each
  component file, so `/tests` can cover them later.
- The gates are `npm run lint`, `npx tsc --noEmit`, `npm run build`, registry
  JSON inspection and server-HTML inspection.
- Browser, reduced-motion and clean-install checks run only when a browser or
  network access is available (step 6). Do not claim them otherwise.

## Notes for the AI

- Read the relevant guides in `node_modules/next/dist/docs/` before touching MDX,
  client components or routing. `cacheComponents` is enabled. Confirm that
  client components inside MDX pages still prerender.
- Never put hex values outside `styles/tokens.css`.
- Components must work with a consumer's stock `cn()`. Avoid class pairs that a
  stock tailwind-merge collapses.
- Initial render must equal the server render: derive animated output from
  state that starts at the finished value. Read `window`, time and the observer
  only in effects.
- At most one glitch per viewport: the Glitch Heading page has one instance.
  Other pages must not import it.
- `getItemSource` only reads files under `registry/`. The `use-reduced-motion`
  item has no docs page, so its `lib/` path is fine.
- The scramble changes glyph shapes, not colour or luminance, over a single
  line, and it runs once. Still confirm it does not read as flashing in the
  browser check.

## Verification results

Run on `feature/text-motion-set` on 2026-11-02.

- `npm run lint`: clean. `npx tsc --noEmit`: clean.
- `npm run build`: passed.
  - `shadcn build` built every item, including `use-reduced-motion` and the
    five new components.
  - `next build` prerendered all ten `/docs/components/<item>` routes.
- **Registry JSON:**
  - `use-reduced-motion.json` is `registry:lib`, with the file
    `lib/use-reduced-motion.ts`.
  - `effects.json` contains the new keyframes.
  - Dependencies:
    - Decrypt Text and Telemetry Counter:
      `utils, @cybr/tokens, @cybr/use-reduced-motion`.
    - Typewriter Terminal and Stepped Wipe Reveal:
      `utils, @cybr/tokens, @cybr/effects, @cybr/use-reduced-motion`.
    - Glitch Heading: `utils, @cybr/tokens, @cybr/effects`.
  - Each item lists one file, its own `registry/ui/<item>.tsx`.
- **Compiled CSS:** the `glitch-heading-a`/`-b`, `wipe-reveal` and
  `cursor-blink` animations are emitted only inside
  `@media (prefers-reduced-motion: no-preference)`.
- **Prerendered HTML (static-first):**
  - The Decrypt Text visible copy and its `sr-only` copy both read
    `ACCESS GRANTED`.
  - The Typewriter Terminal shows every line in full, with the cursor after
    `> _ready`. Its `sr-only` copy holds the full lines.
  - The counters render their final values `1,284`, `12.4` and `064`, both
    visibly and in `sr-only`.
  - The wipe lines render as an unclipped `block`.
  - Each Code tab names its own source file.
- **Fixed during the build:**
  - A stock tailwind-merge dropped `leading-[0.9]` from Glitch Heading
    whenever a `text-*` size was passed. It now uses `[line-height:0.9]`.
    `twMerge` keeps that with `text-[3.125rem]`, which was confirmed. A
    consumer `leading-*` class cannot override it; pass `[line-height:…]`
    instead.
- **Deviations:**
  - The Replay button label is lowercase `replay`, in the Terminal Button's
    prompt style.
  - Installed shadcn CLI handling of `registry:lib` placement could not be
    read from its minified bundle. The clean-install check below confirms it.
- **`/check` (2026-11-02):** headless Chrome over the DevTools protocol
  against a freshly restarted dev server. No console errors, failed requests
  or hydration warnings on any page.
  - **Decrypt Text:**
    - It shows the real string for one tick, is scrambled at 0.55s
      (`ACΣ!+& Ξ*=%>1$`), and is resolved by 2.5s.
    - Replay scrambles it again.
    - The accessibility tree holds `ACCESS GRANTED` once and no glyphs.
  - **Typewriter Terminal:**
    - At 0.4s: `> boot --style`, with the cursor on line 1 and prompt lines in
      `signal`.
    - Complete by 3.9s, with the cursor after `> _ready`.
    - The accessibility tree holds the full lines.
  - **Glitch Heading:**
    - Two 3.2s animations whose sampled slice states match the artboard
      keyframes.
    - The line height computes to 45px at 50px.
    - It is announced once as `heading: SIGNAL LOST`.
  - **Telemetry Counter** (300px-tall viewport):
    - It holds `0` / `0.0` / `000` for 2.8s while off screen.
    - It counts once scrolled into view: `746` / `7.2` / `037` at +0.6s, then
      `1,284` / `12.4` / `064` at +2.8s.
    - Replay recounts.
  - **Stepped Wipe Reveal:**
    - Fully clipped while off screen.
    - In view, the wipes run 1080ms in 12 steps with delays of 0, 300 and
      600ms, and are fully revealed by 2.25s.
  - **Reduced motion (all five pages):**
    - `document.getAnimations()` is empty and the final state renders at once.
    - No wipe line is clipped and no glitch slice renders.
- **Clean-app install:** `create-next-app@16.4.4`, `shadcn init -d`, `@cybr`
  mapped to `http://localhost:3000/r/{name}.json`, then
  `shadcn add @cybr/telemetry-counter @cybr/typewriter-terminal`.
  - It created `styles/cybr-tokens.css`, `lib/use-reduced-motion.ts`,
    `styles/cybr-effects.css` and both components, all byte-identical to the
    repo. It skipped the existing `lib/utils.ts`.
  - So `registry:lib` lands in `lib/` and the `@/lib/use-reduced-motion`
    import resolves unchanged.
  - After the two imports, `next build` passed. Under `next start` both
    components animated, with no console errors.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":23751,"specSha256":"284f1905aa09c30a5e8fbc7c6112554de435566cae2adb87e8cd3314b0598c9f","branch":"refs/heads/feature/text-motion-set","head":"9893527418744390a5e289efb9e255f6bae04a86","baseRef":"refs/heads/main","baseCommit":"9893527418744390a5e289efb9e255f6bae04a86","sourceTree":"d8bb41fbc942b53cd2fe3d78452eb1bd2ade4a19","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, then open http://localhost:3000/docs/components/decrypt-text and click the "> replay" button under the preview.

Expected:

The large "ACCESS GRANTED" line turns into random glyphs (such as `#%&Ξ Σ`) and resolves back to "ACCESS GRANTED" letter by letter, left to right, in under two seconds. Each Replay click runs it again.

This proves:

Decrypt Text runs its client-side scramble from the static-first final state, and the docs Replay helper remounts a one-shot animation.
