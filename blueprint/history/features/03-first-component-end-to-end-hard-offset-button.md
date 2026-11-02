# Feature: First component end-to-end (Hard-Offset Button)

**From build-plan:** feature 3
**Build attempt:** 1
**Branch:** feature/first-component-end-to-end-hard-offset-button
**Status:** verified

## Goal

Prove the whole registry pipeline with one component: build the Hard-Offset
Button, register it and the opt-in token file in `registry.json`, generate
`public/r/*.json` with `shadcn build`, and confirm that `npx shadcn add
@cybr/hard-offset-button` installs a working button into a clean Next.js app.
This locks the registry folder layout, item naming, namespace, and token
delivery that Features 5-11 reuse.

## Design reference

- Mockups canvas, artboard "Buttons" (`project/Main.dc.html`), card
  `01 / HARD-OFFSET` and card `06 / STATES`. Match layout, motion and details;
  colours come from tokens only.
- Values taken from the artboard (all already exist as tokens unless noted):
  - JetBrains Mono, bold (700), 15px (`text-[0.9375rem]`, no token for 15px),
    `tracking-button` (0.12em), UPPERCASE, `min-height` 52px (`min-h-13`),
    horizontal padding 28px (`px-7`), inline-flex, centred, gap 10px
    (`gap-2.5`), radius 0.
  - Idle: `bg-signal`, `text-ground-deep`, 3px solid `ink` border
    (`--border-heavy`), `shadow-hard` (6px 6px 0 ink).
  - Hover: translate by `--offset-hard-hover` (3px) on both axes,
    `shadow-hard-hover`.
  - Pressed (`:active`): translate by `--offset-hard` (6px), no shadow.
  - Transition on translate and box-shadow, `--duration-snap` (90ms),
    `ease-step-2`.
  - Focus-visible: `--focus-width` (3px) solid `signal` outline,
    `--focus-offset` (6px) offset.
  - Disabled ("OFFLINE"): `bg-surface`, `text-label`, 2px (`--border-base`)
    dashed `dim` (renamed `--muted`, see step 1) border, no shadow, no
    translate, `cursor-not-allowed`, no hover/pressed movement.

## In scope

- **Rename `--muted` to `--dim`** (user decision: the name collides with
  shadcn's standard `--muted`, so installing our tokens would clobber it). Same
  value and usage rules; rename the variable, its `--color-dim` theme mapping,
  the `bg-dim` specimen swatch, and the plan/overview/token documentation.
- `HardOffsetButton` component at `registry/ui/hard-offset-button.tsx`.
- `shadcn` CLI as a devDependency, a root `registry.json`, and a
  `registry:build` npm script that runs `shadcn build` into `public/r/`.
- Two registry items, served under the `@cybr` namespace:
  - `tokens` (`@cybr/tokens`): copies `styles/tokens.css` into the consumer
    project as `styles/cybr-tokens.css` (user decision: copy the file, consumer
    adds one `@import` line; one source of truth).
  - `hard-offset-button` (`@cybr/hard-offset-button`): the component, with
    `registryDependencies` on shadcn's built-in `utils` (user decision: never
    overwrite the consumer's `lib/utils.ts`) and on `@cybr/tokens`.
- A "08 / Button" section on the temporary specimen page showing idle and
  disabled buttons, so the component is observable in this app.
- Clean-app verification in a throwaway Next.js app outside the repo,
  recorded in this spec.
- Record the registry folder layout and commands in `coding-standards.md` and
  `AGENTS.md`.

## Out of scope

- The other buttons (Glitch, HUD Bracket, Terminal, Hazard) and the documented
  state gallery: Feature 5.
- Docs page, props table, copy-install / copy-source buttons: Feature 4.
- Registering `styles/effects.css` or our extended `cn()` as registry items: the
  button needs neither. Effects get registered with the first component that
  uses them.
- `asChild` / Slot polymorphism and size variants: not on the artboard as API;
  primitives library is decided in Feature 8.
- `motion` or GSAP: the button animates with CSS transitions only.
- Production domain, `NEXT_PUBLIC_SITE_URL`, Vercel deploy, install docs:
  Feature 15. Consumers point `@cybr` at a URL in their own `components.json`;
  this feature uses `http://localhost:3000/r/{name}.json`.
- Font delivery to consumers. The token file references
  `--font-archivo-black` / `--font-jetbrains-mono` and falls back to
  `Impact` / `ui-monospace` when the consumer has not loaded those fonts.
  Documenting font setup is Feature 15.
- Palette changes: Feature 12. Test runner setup: `/tests`. CI: Feature 14.

## Build loop

- `workflow.stepReview` is `feature`: implement all steps, running each step's
  checks as you go, then stop once for review at the end of the feature.
- `workflow.checkpointCommits` is `disabled`: no commits during the build.
  `/complete` creates the single feature commit.
- Work on branch `feature/first-component-end-to-end-hard-offset-button`,
  created from `main`.

## Build steps

- [x] 1. **Rename `--muted` to `--dim`**
  - `styles/tokens.css`: `--muted` -> `--dim`, `--color-muted` ->
    `--color-dim`. Value unchanged (`#6c757d`).
  - `app/page.tsx`: colour row becomes `--dim` / `bg-dim`, same "Large
    secondary UI only" note.
  - `blueprint/project-plan.md` (palette table and the `--label` footnote) and
    `blueprint/context/project-overview.md` (theme preset tokens list and the
    UI/UX contrast rule): replace `--muted` with `--dim`. Do not edit archived
    history files.
  - Grep `app lib styles blueprint/context blueprint/*.md` for `muted`; only
    archived history may still mention it.
  - Done when: `npx tsc --noEmit` and `npm run lint` pass, the grep finds no
    live `muted` token reference, and the specimen's colour grid shows a `--dim`
    swatch with the same grey as before.

- [x] 2. **`HardOffsetButton` component**
  - Create `registry/ui/hard-offset-button.tsx` exporting
    `HardOffsetButton(props: React.ComponentProps<"button">)`. Native
    `<button>`, `type` defaults to `"button"`, all other props (including
    `disabled`, `aria-*`, `onClick`, `ref` via React 19 props) pass through;
    `className` is merged last with `cn()` from `@/lib/utils`.
  - Styling exactly as listed under Design reference, tokens only (no hex, no
    inline styles). Hover and pressed movement apply only when enabled (e.g.
    `enabled:hover:` / `enabled:active:`). Tailwind v4 `translate-*` utilities
    use the `translate` property, so transition `translate` and `box-shadow`
    (not `transform`).
  - Reduced motion: `motion-reduce:transition-none` so state changes are
    instant; no other animation exists.
  - No `'use client'`: the component has no hooks or handlers of its own and
    must work as a Server Component.
  - Avoid internal class pairs that plain (unextended) tailwind-merge would
    collapse, because consumers get shadcn's standard `cn()`. In particular,
    do not combine a custom `text-display-*`/`text-micro`/`text-caption` size
    with a `text-<colour>` class.
  - Add "08 / Button" to `app/page.tsx`: one idle `HardOffsetButton` ("Deploy
    now") and one `disabled` ("Run"), labelled IDLE / OFFLINE with the existing
    `SectionLabel` pattern. The page imports from `@/registry/ui/...`.
  - Done when: `npx tsc --noEmit`, `npm run lint` and `npm run build` pass; in
    the dev server the idle button shows the 6px ink shadow, shifts 3px on
    hover, sits flush with no shadow while pressed, shows the 3px signal outline
    on keyboard focus (Tab), and the disabled button is dashed, shadowless and
    does not move on hover or click; with reduced motion emulated the state
    changes are instant.

- [x] 3. **Registry config and build**
  - `npm install -D shadcn` (latest 4.x at spec time: 4.23.0). Before writing
    `registry.json`, read the installed CLI's registry schema
    (`registry.json` / `registry-item.json` in `node_modules/shadcn` or
    `https://ui.shadcn.com/schema/registry.json`) and confirm: item `type`
    values, `files[].target` rules for `registry:file`, and the accepted
    `registryDependencies` forms (built-in name `utils`, namespaced
    `@cybr/tokens`). If namespaced dependencies are not supported by the
    installed version, stop and report rather than hard-coding a localhost URL.
  - Root `registry.json`: `$schema`, `name: "cybr"`, `homepage`
    (`http://localhost:3000` placeholder until Feature 15), and `items`:
    - `tokens`: `type` `registry:file` (or the schema's closest file/style type
      that copies a file verbatim), `title`, `description` stating that the
      consumer must add `@import "../styles/cybr-tokens.css";` after
      `@import "tailwindcss";` in `app/globals.css`, and that fonts fall back
      unless `--font-archivo-black` / `--font-jetbrains-mono` are defined.
      `files`: `styles/tokens.css` with `target` `styles/cybr-tokens.css`.
    - `hard-offset-button`: `type` `registry:ui`, `title`, `description`,
      `files`: `registry/ui/hard-offset-button.tsx`, `dependencies`: none,
      `registryDependencies`: `["utils", "@cybr/tokens"]`.
  - `package.json` scripts: add `"registry:build": "shadcn build"` (default
    output `public/r`), and change `build` to
    `npm run registry:build && next build` (matches the overview's deployment
    build order).
  - Add `/public/r/` to `.gitignore`: the JSON is generated on every build.
  - Done when: `npm run registry:build` writes `public/r/registry.json`,
    `public/r/tokens.json` and `public/r/hard-offset-button.json`, each file's
    `content` matches its source file, and with `npm run dev` running
    `http://localhost:3000/r/hard-offset-button.json` and
    `/r/registry.json` return that JSON. `npm run build` still passes.

- [x] 4. **Clean-app install verification**
  - In a throwaway directory outside this repo (the session scratchpad), create
    a fresh app with `npx create-next-app@latest` (TypeScript, Tailwind, App
    Router, ESLint, no `src/`), then `npx shadcn@latest init` with defaults.
  - Add to its `components.json`:
    `"registries": { "@cybr": "http://localhost:3000/r/{name}.json" }`, with
    this repo's dev server running.
  - Run `npx shadcn@latest add @cybr/hard-offset-button`. Confirm it writes
    `components/ui/hard-offset-button.tsx` and `styles/cybr-tokens.css`, keeps
    the existing `lib/utils.ts` without an overwrite prompt, and installs no
    unexpected npm packages.
  - Add the `@import` line from the item description, render
    `<HardOffsetButton>Deploy now</HardOffsetButton>` and a disabled one on its
    home page, then run its `npm run build` and `npm run dev`.
  - Confirm shadcn's own `--muted` / `bg-muted` value in the clean app is
    unchanged after the import (the reason for step 1).
  - Record the exact commands, CLI versions, and results under "Verification
    evidence" at the end of this spec. Do not commit the throwaway app.
  - Done when: the clean app builds, and its page shows the button with the
    signal fill, ink border, 6px hard shadow, hover/pressed offsets and dashed
    disabled state, matching this repo's specimen.

- [x] 5. **Record conventions**
  - `blueprint/context/coding-standards.md`, File Organization: registry
    component sources live in `registry/ui/<item>.tsx`; registry items are
    declared in root `registry.json` under the `@cybr` namespace; generated
    output in `public/r/` is gitignored; registry components import `cn` from
    `@/lib/utils` and must not rely on our tailwind-merge extensions.
    Styling: replace the stale scaffold note about `bg-background` /
    `text-foreground` and light/dark switching with the actual token classes,
    and note that the `@theme` tokens live in `styles/tokens.css`.
  - `AGENTS.md` Commands: add `Registry build: npm run registry:build` and note
    that `npm run build` runs it first.
  - Done when: both files describe the layout and commands that steps 2-4
    actually used, and `npm run lint` passes.

## Files / areas

- `styles/tokens.css` - rename `--muted` -> `--dim`
- `app/page.tsx` - `--dim` swatch, new "08 / Button" section
- `registry/ui/hard-offset-button.tsx` - new component
- `registry.json` - new registry definition
- `package.json`, `package-lock.json` - `shadcn` devDependency, scripts
- `.gitignore` - `/public/r/`
- `public/r/*.json` - generated, not committed
- `blueprint/project-plan.md`, `blueprint/context/project-overview.md` - token
  rename in docs
- `blueprint/context/coding-standards.md`, `AGENTS.md` - conventions, commands

## Data / contracts

- **Namespace:** `@cybr`. Item ids: `tokens`, `hard-offset-button`. Install
  commands: `npx shadcn add @cybr/hard-offset-button` (pulls `@cybr/tokens`
  and shadcn `utils`). Consumers map `@cybr` to `<origin>/r/{name}.json` in
  `components.json`; the production origin is set in Feature 15.
- **Served URLs:** `/r/registry.json`, `/r/<item>.json`, static from
  `public/r/`.
- **Source layout:** component sources `registry/ui/<item>.tsx` (type
  `registry:ui`, installed to the consumer's `components/ui/`); the token file
  is the existing `styles/tokens.css`, installed as `styles/cybr-tokens.css`.
- **Component API:** `HardOffsetButton(props: React.ComponentProps<"button">)`;
  default `type="button"`; children are the label. No variants.
- **Token rename:** `--muted` -> `--dim`, `bg-muted`/`text-muted`/
  `border-muted` -> `bg-dim`/`text-dim`/`border-dim`. Usage rule unchanged
  (large/secondary UI only, not body text).
- No persisted data, auth, or untrusted input. Registry JSON is static.

## Testing

- No test command is configured, so there are no unit tests in this feature.
- Gates: `npx tsc --noEmit`, `npm run lint`, `npm run registry:build`,
  `npm run build`.
- Manual browser checks in step 2 (this repo) and step 4 (clean app),
  including keyboard focus and reduced-motion emulation. No browser test
  harness exists, so no automated UI evidence is claimed.

## Notes for the AI

- Read the relevant Next.js 16 docs in `node_modules/next/dist/docs/` before
  touching routing or `public/` behaviour; `next.config.ts` has
  `cacheComponents` enabled.
- Verify shadcn schema details against the installed CLI, not memory. If
  `shadcn build` rejects a field named here, use the schema's equivalent and
  record the deviation in this spec.
- Step 4 needs network access (create-next-app, shadcn init) and this repo's
  dev server running. If either is unavailable, mark step 4 blocked with the
  exact error; do not claim the install was verified.
- Keep the specimen page header comment: Feature 13 replaces the page.
- Never add hex values outside `styles/tokens.css`.

## Verification evidence

Recorded by `/check` on 2026-11-02. Browser evidence came from headless Google
Chrome driven over the DevTools protocol (Playwright is not installed): real
mouse and key events, computed styles, screenshots, console and network capture.

- **Gates (this repo):** `npx tsc --noEmit`, `npm run lint`, `npm run build`
  (runs `registry:build` first) all exit 0. No live `muted` token reference in
  `app lib styles blueprint/context blueprint/*.md`.
- **Registry output:** `public/r/registry.json`, `tokens.json` and
  `hard-offset-button.json` written; each file's `content` equals its source.
  With the dev server on :3000, `/r/registry.json`, `/r/tokens.json` and
  `/r/hard-offset-button.json` return 200 `application/json`.
- **Specimen (08 / Button), this repo:**
  - Idle: `bg-signal`, 3px solid ink border, `6px 6px 0 ink` shadow, JetBrains
    Mono 700 15px uppercase, min-height 52px, padding 28px, radius 0.
  - Hover: `translate: 3px 3px`, shadow `3px 3px 0 ink`.
  - Pressed: `translate: 6px 6px`, no shadow.
  - Tab focus: `:focus-visible`, 3px solid signal outline, 6px offset.
  - Disabled: 2px dashed `dim` border, `bg-surface`, `text-label`, no shadow,
    `cursor: not-allowed`; no translate on hover or press; not focusable.
  - Reduced motion emulated: `transition-property: none`.
  - No console errors or failed requests.
- **Clean-app install (scratchpad, not committed):**
  - `npx create-next-app@latest clean-app --ts --tailwind --app --eslint
    --no-src-dir --import-alias "@/*" --use-npm --yes --disable-git`
  - `npx shadcn@latest init --defaults --yes` (shadcn 4.23.0, style
    `base-nova`, base colour `neutral`)
  - `components.json`: `"registries": { "@cybr":
    "http://localhost:3000/r/{name}.json" }`
  - `npx shadcn@latest add @cybr/hard-offset-button`: created
    `styles/cybr-tokens.css` and `components/ui/hard-offset-button.tsx` (both
    byte-identical to the sources); skipped `lib/utils.ts` without a prompt
    (unchanged hash); `package.json` unchanged (no new npm packages).
  - Added `@import "../styles/cybr-tokens.css";` after `@import "tailwindcss";`
    and rendered an idle and a disabled button. `npm run build` passes;
    `next dev -p 3002` shows every state identical to this repo's specimen, no
    console errors or failed requests.
  - shadcn's `--muted` keeps its own values (`#f5f5f5` light, `#262626` dark)
    in the built CSS; our grey ships separately as `--dim: #6c757d`.
  - Observation: the button font resolves to the consumer's Geist Mono, because
    shadcn's `@theme inline` redefines `--font-mono` after our import. Font
    delivery is out of scope here and belongs to Feature 15's install docs.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":17026,"specSha256":"97a00ca21554c3b8d88cb40a34a86c93e1aa36847a68d848bd66f39985dc05bc","branch":"refs/heads/feature/first-component-end-to-end-hard-offset-button","head":"aa58266f3b4927065fb17628ce0f2c1d8768f103","baseRef":"refs/heads/main","baseCommit":"aa58266f3b4927065fb17628ce0f2c1d8768f103","sourceTree":"bcb9e718b0d6f5205b611e46d8ca5f02e6f143d7","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, open http://localhost:3000 and scroll to **08 / Button**. Hover
and hold the mouse down on **DEPLOY NOW**, then press Tab until it is focused.
Hover and click **RUN**.

Expected:

DEPLOY NOW is signal orange with an ink border and a 6px hard shadow. On hover it
steps 3px down-right as the shadow halves, pressed it sits flush with no shadow,
and on Tab focus a 3px orange outline appears 6px out. RUN stays dashed grey,
shadowless and still, with a not-allowed cursor.

This proves:

The Hard-Offset Button idle, hover, pressed, focus and disabled states render
from tokens as specced.
