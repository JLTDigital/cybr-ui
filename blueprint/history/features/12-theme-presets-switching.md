# Feature: Theme presets & switching

**From build-plan:** feature 12
**Build attempt:** 1
**Branch:** feature/theme-presets-switching
**Status:** verified

## Goal

Lock the current palette as the final default and ship two alternate presets,
"Acid Terminal" and "Ice Neon". Each one is an opt-in CSS-variable file scoped
by `data-theme`, so any app can switch the whole page or one section at runtime.
The docs get a persisted global switcher, and every component is shown to swap
cleanly and to pass the project's contrast rules in all three presets.

## In scope

- Lock the default palette in `styles/tokens.css` with its values unchanged:
  `--bg #212529`, `--surface #343a40`, `--line #495057`, `--dim #6c757d`,
  `--signal #ff4c29`, `--ink #f8f9fa`, `--label #adb5bd`,
  `--ground-deep #16191c`, `--ground-void #0e1012`, `--neon-2 #00e5ff`. Take
  out the "provisional" wording and put the measured contrast ratios in the
  header comment. `--neon-2` stays (cyan in the default preset), which
  resolves that overview open question for this library.
- Two alternate preset files. Each sets only the ten colour tokens, under
  `[data-theme="<id>"]`:

  | Token | Acid Terminal (`acid-terminal`) | Ice Neon (`ice-neon`) |
  | --- | --- | --- |
  | `--bg` | `#0d110d` | `#0f1620` |
  | `--surface` | `#1a211a` | `#1b2633` |
  | `--line` | `#2f3a2f` | `#2c3b4d` |
  | `--dim` | `#5f6f5f` | `#5b6d82` |
  | `--signal` | `#c6ff00` | `#00e5ff` |
  | `--ink` | `#e9f5e9` | `#eef6ff` |
  | `--label` | `#9fb59f` | `#a3b5c9` |
  | `--ground-deep` | `#070a07` | `#0a0f16` |
  | `--ground-void` | `#030503` | `#05080c` |
  | `--neon-2` | `#ff4c29` | `#c6ff00` |

- Two registry items, `theme-acid-terminal` and `theme-ice-neon`
  (`registry:file`, `registryDependencies: ["@cybr/tokens"]`). They install to
  `styles/cybr-theme-acid-terminal.css` and `styles/cybr-theme-ice-neon.css`,
  and their descriptions give the import order and the `data-theme` usage.
- Contrast verification for all three presets against the overview rules (see
  Data / contracts), recorded in each preset file's header comment.
- A swap audit across all 38 `registry/ui/*` components plus the shared
  effects, docs chrome and token specimen. Any colour that does not come from a
  token gets fixed.
- A docs theme switcher. It is a native labelled `<select>` (Default / Acid
  Terminal / Ice Neon) in the `/docs/components` layout header and on the `/`
  token specimen. It sets `data-theme` on `<html>`, persists the choice to
  `localStorage`, and an inline `<head>` script applies the saved choice before
  first paint.

## Out of scope

- Theme builder or generator (Feature 19), and any other presets.
- Light-mode presets and OS `prefers-color-scheme` following.
- Changes to non-colour tokens (type, borders, offsets, motion).
- A dedicated themes docs page or new route. The `/docs/components` index and
  landing page are Feature 13.
- Playwright visual snapshots and CI contrast checks (Feature 14).
- A switcher component shipped in the registry. Installers set `data-theme`
  themselves.

## Build loop

`workflow.stepReview` is `feature`, so build all steps, then stop for one review
of the whole feature. `workflow.checkpointCommits` is `disabled`, so make no
commits during Implement. `/complete` creates the single feature commit.

## Build steps

1. [x] **Lock the default palette.** Update the header comment in
   `styles/tokens.css`: drop "provisional", record the default ratios
   (ink/bg 14.63, label/bg 7.43, signal/bg 4.64, signal/surface 3.46,
   ground-deep on signal 5.31, dim/bg 3.29), and note that colour tokens can be
   overridden by preset files scoped with `[data-theme]`. Leave the values
   unchanged. Update the `/` specimen's `--neon-2` row, which says "Provisional
   second accent", to say "Second accent (glitch split, code)".
   **Done when:** `tokens.css` values are byte-identical to before and
   `npm run lint` passes.

2. [x] **Add the preset files.** Create `styles/themes/acid-terminal.css` and
   `styles/themes/ice-neon.css` with the exact values above inside one
   `[data-theme="<id>"] { ... }` block each, plus a header comment that lists
   the measured ratios and the required import order (after tokens). Import both
   in `app/globals.css` after `tokens.css` and before `effects.css`. Equal
   specificity with `:root` means source order decides, so they must come after
   the tokens. Recompute every ratio in the contrast table with the WCAG 2.x
   relative-luminance formula, for example using a one-off `node -e` that is not
   committed, and record the results.
   **Done when:** every contrast rule passes for both presets as recorded,
   `npx tsc --noEmit` and `npm run lint` pass, and setting `data-theme` on
   `<html>` in DevTools recolours the page (if a browser is available).

3. [x] **Add the registry items.** Add `theme-acid-terminal` and
   `theme-ice-neon` to `registry.json` after `tokens`, following the existing
   `tokens` item's shape (`target` under `styles/`). Run `npm run registry:build`.
   **Done when:** `public/r/theme-acid-terminal.json` and
   `public/r/theme-ice-neon.json` exist and embed the preset CSS, and
   `registry:build` exits 0. Run `npx shadcn add` against a local server only if
   one is available. Otherwise report it as not run.

4. [x] **Add the theme switcher and the pre-paint script.**
   - `app/_lib/themes.ts`: the preset list
     (`{ id: "default" | "acid-terminal" | "ice-neon", label }`) and the storage
     key `cybr-theme`.
   - `app/layout.tsx`: add `suppressHydrationWarning` to `<html>` and an inline
     `<head>` script, following
     `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`
     § Themes. The script reads `cybr-theme` inside `try/catch` and sets
     `data-theme` only when the value is in the allowlist built from
     `themes.ts` (serialised with `JSON.stringify`). Any other value, or storage
     that is missing or throws, leaves the default.
   - `app/_components/theme-switcher.tsx` (client): a native `<select>` with a
     visible or `sr-only` `<label>` "Theme". It reads the current value with
     `useSyncExternalStore`: the snapshot is the `<html>` `data-theme`, the
     server snapshot is `"default"`, and a `MutationObserver` watches that
     attribute, so two switchers stay in sync and hydration matches. On change:
     choosing default removes the attribute and the storage key, while choosing
     an alternate sets both. Storage writes are wrapped in `try/catch`, so the
     switch still applies for the session when storage is unavailable. Style it
     with tokens only, with a bold signal focus outline like the docs header
     link.
   - Place it in `app/docs/components/layout.tsx`'s header (replacing nothing,
     beside the status text) and on `app/page.tsx`.
   - Check that the `cacheComponents` build accepts the inline script, which
     `npm run build` exercises.
   **Done when:** `npm run build` passes, and a browser check (if available)
   shows the choice surviving a reload with no flash of the default palette,
   a client-side navigation between docs pages keeping the theme, and
   keyboard-only operation working.

5. [x] **Swap audit.** Grep `registry/`, `app/`, `lib/` and `styles/` (except
   the token and preset files) for hex, `rgb(`, `hsl(`, `oklch(`, named CSS
   colours in style props or SVG `fill`/`stroke`, and Tailwind default-palette
   classes (`white`, `black`, `red-*`, `zinc-*`, and so on). Replace each hit
   with the matching token. Confirm that `--shadow-hard`, the effects
   utilities, and the Shiki mapping in `app/docs/docs.css` resolve through
   variables. If a browser is available, step through every
   `/docs/components/<item>` page in each preset and note any component that
   keeps a default colour or loses legibility.
   **Done when:** the grep returns no non-token colours outside the token and
   preset files, `npm run build` and `npm run lint` pass, and the per-page
   visual walk is either reported or stated as not run.

## Files / areas

- `styles/tokens.css` (comment only), `styles/themes/acid-terminal.css`,
  `styles/themes/ice-neon.css` (new)
- `app/globals.css` (imports)
- `registry.json`, `public/r/` (generated)
- `app/_lib/themes.ts` (new), `app/_components/theme-switcher.tsx` (new)
- `app/layout.tsx`, `app/docs/components/layout.tsx`, `app/page.tsx`
- Any `registry/ui/*`, `styles/effects.css` or `app/docs/*` file the audit flags

## Data / contracts

- **Preset contract:** a preset is one CSS file containing exactly one
  `[data-theme="<id>"]` rule that overrides only the ten colour tokens. The
  default preset is `:root` in `tokens.css` and has no attribute. Preset files
  must load after `tokens.css`. Ids are kebab-case and stable: `acid-terminal`
  and `ice-neon`. Putting `data-theme` on any element scopes the preset to that
  subtree.
- **Persisted client value:** `localStorage["cybr-theme"]` is `"acid-terminal"`
  or `"ice-neon"`. If it is absent, the theme is default. Any other value is
  ignored and never written to the DOM. Nothing is stored on the server.
- **Contrast rules (each preset):** ink/bg ≥ 7 (target ~14), label/bg ≥ 7,
  signal/bg ≥ 4.5 (text), signal/surface ≥ 3 (large/UI only),
  ground-deep on signal ≥ 4.5, dim/bg ≥ 3 (large/secondary only).
  `--line` is decorative and exempt. Pre-checked values:
  Acid 16.95 / 8.69 / 16.05 / 13.87 / 16.77 / 3.56;
  Ice 16.66 / 8.66 / 11.81 / 9.95 / 12.49 / 3.42.
- **Registry items:** `theme-acid-terminal` and `theme-ice-neon`, type
  `registry:file`, one file each with a `target` under `styles/`.

## Testing

No test command is configured, so the gates are `npx tsc --noEmit`,
`npm run lint`, `npm run registry:build` and `npm run build`. The contrast
ratios are computed during implementation and recorded. The browser checks (no
flash on reload, persistence, keyboard use, the per-component visual walk) run
only if a browser is available, and are otherwise reported as not run.

## Notes for the AI

- This Next.js has breaking changes, so follow the bundled
  `preventing-flash-before-hydration.md` guide for the inline script rather
  than memory.
- Do not touch `tokens.css` values or any non-colour token.
- The preset files must stay plain CSS (no `@theme`). `@theme inline` in
  `tokens.css` already maps the utilities to the variables.
- The inline script must not interpolate unvalidated input. Its only dynamic
  content is the `JSON.stringify` of the static allowlist.
- Components stay free of global side effects. The switcher and the inline
  script are docs-only and do not ship in the registry.

## Implementation notes

- Contrast recomputed from the committed files (WCAG 2.x): all three presets
  match the Data / contracts table.
- Swap audit: no hex, rgb/hsl/oklch, or Tailwind default-palette colours outside
  the token and preset files. The remaining literals are `transparent` and
  `currentColor`, plus greyscale SVG noise (`grain`, Béton Brut) that is
  deliberately palette-neutral. No component needed changes.
- Not run: `npx shadcn add` against a live server, and the browser checks (no
  flash on reload, persistence, keyboard, per-page visual walk). No dev server
  or browser was started.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":11275,"specSha256":"62270ccb36134df7aa823e04954588370dfbe4ceb1deb97e93ed4c5ce670db0a","branch":"refs/heads/feature/theme-presets-switching","head":"02e82ce8ad0ea89673e4f2b7adf0812b7232064f","baseRef":"refs/heads/main","baseCommit":"02e82ce8ad0ea89673e4f2b7adf0812b7232064f","sourceTree":"2d9a4329ae9aa70541397175c6502b31b5af75a8","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

1. Restart the dev server: stop any running `next dev`, then run `npm run dev`.
2. Open http://localhost:3000/docs/components/hard-offset-button.
3. In the header, set **Theme** to **Acid Terminal**.
4. Reload the page (⌘R).

Expected:

- Before reloading, the page turns near-black green (`#0d110d`). The `//` in the header, the `$` in the install box and the **DEPLOY NOW** button fill all turn lime (`#c6ff00`).
- After reloading, the page loads straight into the green-and-lime theme with no flash of the default graphite and orange. The dropdown still reads **Acid Terminal**.

This proves: the docs switcher applies a preset to the whole page, the choice is saved, and it is applied before the first paint.
