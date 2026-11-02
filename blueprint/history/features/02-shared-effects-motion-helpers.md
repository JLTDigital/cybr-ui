# Feature: Shared effects & motion helpers

**From build-plan:** feature 2
**Build attempt:** 1
**Branch:** feature/shared-effects-motion-helpers
**Status:** verified

## Goal

Give every later component one shared, token-only set of visual effects
(scanlines, grain, HUD corners, crosshair, hazard stripes, glitch) plus the two
helpers every component imports: `cn()` for class merging and
`useReducedMotion()` for JS-driven animation. All effects must honour
`prefers-reduced-motion` and the no-flashing rule, and add no global CSS beyond
the opt-in token layer.

## In scope

- `styles/effects.css`: an opt-in file of Tailwind v4 `@utility` and
  `@keyframes` blocks, imported in `app/globals.css` after `tokens.css`
  (user decision: separate file, not inside `tokens.css`, so Feature 12 presets
  stay variables-only).
- Six effect utilities: `scanlines`, `grain`, `hud-corners`, `crosshair`,
  `hazard-stripes`, `glitch`.
- `lib/utils.ts` exporting `cn()` (clsx + tailwind-merge, the shadcn
  convention), with tailwind-merge taught this project's custom theme scales so
  token classes do not cancel each other.
- `lib/use-reduced-motion.ts` exporting `useReducedMotion(): boolean`.
- A new "07 / Effects" section (and a motion-preference readout) on the
  temporary specimen page so every effect and both helpers are observable.
- Record `lib/` as the established util folder in `coding-standards.md`
  (it is listed there as the proposed default "when first needed").

## Out of scope

- Any component (Hard-Offset Button and beyond): Feature 3+.
- `registry.json`, `shadcn build`, registry item types for effects/`cn()`:
  Feature 3. Keep files self-contained so Feature 3 can register them as-is.
- Installing `motion` or GSAP. No component animates with JS yet.
- Backgrounds (Blueprint Grid, CRT Overlay, Data Rain, etc.): Feature 9.
- CRT flicker: not in this feature's list; Feature 9 owns CRT Overlay.
- Palette changes and contrast re-checks for new presets: Feature 12.
- Test runner setup (`/tests`).

## Build loop

- `workflow.stepReview` is `feature`: implement all steps, running the step's
  checks as you go, then stop once for review at the end of the feature.
- `workflow.checkpointCommits` is `disabled`: no commits during the build.
  `/complete` creates the single feature commit.
- Work on branch `feature/shared-effects-motion-helpers`, created from `main`.

## Build steps

- [x] 1. **Helpers: `cn()` and `useReducedMotion()`**
  - `npm install clsx tailwind-merge`.
  - `lib/utils.ts`: `cn(...inputs: ClassValue[])` = `twMerge(clsx(inputs))`,
    using `extendTailwindMerge` to register the custom scales from
    `styles/tokens.css` (`@theme inline`): font sizes `display-xl`,
    `display-lg`, `display-md`, `micro`, `caption`; shadows `hard`,
    `hard-hover`; tracking `label`, `button`; eases `step-2`, `step-3`,
    `step-12`. Colors (`bg`, `surface`, `line`, `muted`, `signal`, `ink`,
    `label`, `ground-deep`, `ground-void`, `neon-2`) must resolve as colors.
    Check the installed tailwind-merge major's config keys in its
    `node_modules` types before writing the config.
  - `lib/use-reduced-motion.ts`: `useReducedMotion(): boolean` built on
    `useSyncExternalStore` + `window.matchMedia("(prefers-reduced-motion:
    reduce)")`, subscribing to `change`. Server snapshot returns `true`
    (static-first: JS animation must not start before the real preference is
    known). No `'use client'` in the hook file; consumers are client
    components.
  - Done when: `npx tsc --noEmit` and `npm run lint` pass, and the specimen
    (step 3) proves `cn("text-display-md text-signal")` keeps both classes and
    `cn("text-ink", "text-signal")` keeps only `text-signal`.

- [x] 2. **`styles/effects.css` utilities**
  - Create the file with a header comment matching `tokens.css` style; import
    it in `app/globals.css` after `tokens.css`.
  - Colours only through token variables (`var(--signal)`, `color-mix()` on
    tokens); no hex anywhere in the file. Durations and easings from tokens
    where one fits.
  - Layer ownership (so effects combine predictably; document it in a comment
    at the top of the file):
    | Utility | Draws with | Host requirement |
    | --- | --- | --- |
    | `scanlines` | `::after` overlay, `pointer-events: none` | positioned host (`relative`/`absolute`) |
    | `grain` | `::before` overlay, inline SVG `feTurbulence` data URI, `pointer-events: none` | positioned host |
    | `hud-corners` | `background-image` gradients (four L brackets) | none |
    | `crosshair` | `background-image` gradients (centred cross) | none |
    | `hazard-stripes` | `background-image` 45deg repeating gradient, `--signal` / `--ground-deep` | none |
    | `glitch` | `text-shadow` split (`--signal` / `--neon-2`) + stepped `@keyframes` | none |
    `hud-corners`, `crosshair` and `hazard-stripes` share `background-image`
    and are not combinable on one element; say so in the comment.
  - Overlays are decorative: subtle opacity, `pointer-events: none`, `inset:
    0`, no layout shift, and they must not lower text contrast on the host
    below the overview's stated ratios (keep overlay opacity low; confirm
    body text stays legible in the specimen).
  - `glitch`: a short burst (well under 1s) inside a ~3s loop using
    `steps()` easing, so it never exceeds 3 flashes per second (WCAG 2.3.1).
    Animation applies only inside `@media (prefers-reduced-motion:
    no-preference)`; under `reduce` the element shows a static state (no
    animation). Text content is untouched, so the real string stays readable
    and announced.
  - No other effect animates.
  - Done when: `npm run build` passes, and `grep -E '#[0-9a-fA-F]{3,8}\b'
    styles/effects.css` finds nothing. (Tailwind emits a `@utility` only when
    a class uses it, so the built-CSS check for all six belongs to step 3.)

- [x] 3. **Specimen: effects section and helper proof**
  - In `app/page.tsx` add `SectionLabel index="07" title="Effects"` with one
    labelled tile per utility (token-only colours, mono labels in `--label`
    or `--ink`, never `--muted`/`--line` for small text), including one tile
    combining `scanlines` + `grain` + `hud-corners` to prove the layer
    ownership table. Use `cn()` for the tile classes, including the two
    merge cases from step 1 rendered as visible sample text.
  - Add a small client component `app/_components/motion-status.tsx` that
    renders `MOTION: REDUCED` or `MOTION: FULL` from `useReducedMotion()`.
  - Keep the page static (no data APIs; `cacheComponents` is on).
  - Done when: `npm run lint`, `npx tsc --noEmit` and `npm run build` pass;
    the prerendered HTML for `/` in `.next/` shows the merged class strings
    from step 1; the built CSS under `.next/` contains all six utilities;
    and, when a browser is available, the effects render at
    `http://localhost:3000`, the glitch bursts about every 3s, and switching
    the OS/devtools "prefers-reduced-motion: reduce" stops the glitch and
    flips the readout to `MOTION: REDUCED`. If no browser is available, say
    the visual check was not run.

- [x] 4. **Standards note**
  - In `blueprint/context/coding-standards.md` File Organization, replace the
    `lib/` part of the TODO with the established rule: shared helpers in
    `lib/`, route-private components in `app/_components/`, effects in
    `styles/effects.css`. Leave `components/` as still-proposed.
  - Done when: the section reflects the files this feature created and
    nothing else in that file changed.

## Files / areas

- `styles/effects.css` (new)
- `app/globals.css` (add one `@import`)
- `lib/utils.ts` (new)
- `lib/use-reduced-motion.ts` (new)
- `app/_components/motion-status.tsx` (new, client)
- `app/page.tsx` (new section 07)
- `package.json`, `package-lock.json` (`clsx`, `tailwind-merge`)
- `blueprint/context/coding-standards.md` (File Organization only)

## Data / contracts

- Public helper API that later registry items depend on:
  - `cn(...inputs: ClassValue[]): string` from `@/lib/utils` (shadcn path and
    name, so `registryDependencies` on shadcn `utils` stays compatible).
  - `useReducedMotion(): boolean` from `@/lib/use-reduced-motion`; `true`
    during SSR and hydration until the client preference is read.
- Effect class names are the six utility names above, unprefixed. They are a
  public contract once Feature 3 ships; do not rename them later without a
  plan change.
- No persisted data, network input, auth, or secrets are involved.

## Testing

- No test command is configured, so no unit tests. Gates: `npm run lint`,
  `npx tsc --noEmit`, `npm run build`.
- `cn()` behaviour is checked through the prerendered specimen HTML (step 3).
- Visual and reduced-motion behaviour is checked in a browser only when one
  is available (`verification.uiEvidence: when-available`); report honestly if
  not run.
- No Verify command exists; none was run during planning.

## Notes for the AI

- Read the Next.js 16 CSS guide in `node_modules/next/dist/docs/` before
  step 2 if `@import` of a second CSS file or `@utility` behaves unexpectedly
  through `@tailwindcss/turbopack`.
- No inline styles (`style={}`): use classes and the utilities.
- Tokens only; hex stays in `styles/tokens.css`.
- Motion is mechanical: `steps()` easing, 120-300ms timings where a token
  fits, no springs. At most one glitch element per viewport on the specimen.
- `--neon-2` is provisional (Feature 12); using it in the glitch split matches
  the mockups.
- `coding-standards.md` Styling still says tokens live in `app/globals.css`;
  that drift is not this feature's to fix beyond step 4.
- No em dashes in code comments or copy.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":9688,"specSha256":"05c4b7f9161e8670bf5b8b67b7bd20176a52a1a2cb4872da281fbd0289d27f2a","branch":"refs/heads/feature/shared-effects-motion-helpers","head":"6c11c5083f0b17d5238ad641609dbf9283f14889","baseRef":"refs/heads/main","baseCommit":"6c11c5083f0b17d5238ad641609dbf9283f14889","sourceTree":"eaa076e1c16e114ff801bab1c0855a794550c82f","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev` (restart it if it was already running before this feature, so the
new `styles/effects.css` import is picked up), open http://localhost:3000 and
scroll to **07 / Effects**. In Chrome DevTools > Rendering, set "Emulate CSS
media feature prefers-reduced-motion" to `reduce`, then back.

Expected:

With no preference the readout says `MOTION: FULL` and "SIGNAL LOST" splits
into signal-orange and cyan in a ~220ms burst about every 3s. With `reduce` the
readout says `MOTION: REDUCED` and the heading stays static.

This proves:

The glitch utility and `useReducedMotion()` both honour the reduced-motion
preference.
