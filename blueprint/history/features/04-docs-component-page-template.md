# Feature: Docs component page template

**From build-plan:** feature 4
**Build attempt:** 1
**Branch:** feature/docs-component-page-template
**Status:** verified

## Goal

Build one reusable docs page template for library components. Each page has a
live preview, a code tab with highlighted source, a copyable install command,
a copy-source button, a props table, and accessibility notes. Prove it with the
Hard-Offset Button page at `/docs/components/hard-offset-button`. Every later
component set (Features 5-11) adds a page by writing one MDX file that uses the
same pieces.

Decisions made at spec time (user-approved). These close two open questions in
the overview:

- **Docs tooling:** `@next/mdx` (with `@mdx-js/loader`, `@mdx-js/react`,
  `@types/mdx`). Not Fumadocs.
- **URL structure:** `/docs/components/<item>`, where `<item>` is the registry
  item name. `/docs/components` is reserved for the Feature 13 index, and
  `/docs/<guide>` for later non-component pages.
- **Highlighting:** Shiki at build or render time on the server, themed through
  CSS variables mapped to tokens.

## In scope

- MDX wiring: install the packages, set `pageExtensions` and `createMDX` in
  `next.config.ts`, and add a root `mdx-components.tsx` (required by App
  Router) that styles prose elements (`h2`, `h3`, `p`, `ul`, `li`, `a`, inline
  `code`) with token classes.
- A docs layout for `/docs/components/*` with a page frame and a
  `CYBR//UI · DOCS` header strip.
- Template pieces, reused by every component page:
  - `ComponentDocHeader`: title and description taken from the item's
    `registry.json` entry.
  - `ComponentPreview`: accessible **Preview | Code** tabs. Preview renders the
    live component (passed as MDX children) on a framed surface. Code shows the
    item's highlighted source and a copy-source button.
  - `InstallCommand`: `npx shadcn@latest add @cybr/<item>` with a copy button,
    plus a one-time setup note showing the `components.json` `registries`
    mapping for `@cybr`. Its origin comes from `registry.json` `homepage`.
  - `PropsTable`: rows of name, type, default, and description, with an
    explicit empty state.
  - `CopyButton`: the shared client copy control with idle, copied, and failed
    states.
  - An accessibility notes section, authored as an `## Accessibility` heading
    in each MDX page and rendered by the `mdx-components.tsx` styles.
- The Hard-Offset Button docs page: `app/docs/components/hard-offset-button/page.mdx`.
- A link from the temporary home specimen's Button section to the new page,
  so the route is reachable from the UI.

## Out of scope

- Component index, search, sidebar or nav, and the landing page (Feature 13).
- Terminal navbar, blueprint-grid background, and spec-card previews built
  from library components. Those components don't exist yet. The docs frame
  uses tokens and the existing `styles/effects.css` utilities only.
- Docs pages for any component other than Hard-Offset Button.
- Radix or Base UI (Feature 8). Tabs are hand-rolled to the WAI-ARIA tabs
  pattern.
- Production domain, `NEXT_PUBLIC_SITE_URL`, and final install docs
  (Feature 15). Analytics on copy clicks (no owner yet).
- Remark/rehype plugins, including GFM. Tables come from `PropsTable`, not
  markdown.
- Test runner or browser harness setup (`/tests`).

## Build loop

- `workflow.stepReview` is `feature`: build all steps, then stop once for
  review at the end of the feature (not after each step).
- `workflow.checkpointCommits` is `disabled`: no per-step commits. `/complete`
  creates the final feature commit.
- After each step, run `npm run lint` and `npx tsc --noEmit`. Run `npm run
  build` at the end of steps 1 and 4.

## Build steps

- [x] **1. MDX wiring + docs shell.** Install `@next/mdx @mdx-js/loader
  @mdx-js/react @types/mdx`. Wrap the config in `next.config.ts` with
  `createMDX()` and add `pageExtensions: ["ts", "tsx", "md", "mdx"]`, keeping
  the existing `experimental`, `cacheComponents`, `partialPrefetching`, and
  `turbopack.rules` untouched. Add `mdx-components.tsx` at the repo root with
  token-styled prose elements. Add `app/docs/components/layout.tsx` (page frame
  and header strip, Server Component). Add
  `app/docs/components/hard-offset-button/page.mdx` with an exported
  `metadata`, a heading, and a live `<HardOffsetButton>`.
  **Done when:** `npm run dev` serves `/docs/components/hard-offset-button` with
  styled MDX prose and a working button, `/docs/components/does-not-exist`
  returns the default 404, and lint, tsc and `npm run build` pass. The build
  must list the route as prerendered/static.

- [x] **2. Registry lookup, header, install command, copy button.** Add
  `app/docs/_lib/registry.ts`. It statically imports `@/registry.json` and
  exports `getRegistryItem(name)`, which returns `{ name, title, description,
  files }` and **throws** on an unknown name so a typo fails the build. It also
  exports `getRegistryOrigin()`, which returns `homepage`. Add
  `ComponentDocHeader` (server), `CopyButton` (client), and `InstallCommand`
  (server, renders `CopyButton`). Use them in the MDX page and derive
  `metadata` title and description from the registry item.
  **Done when:** the page shows the registry title and description, the exact
  command `npx shadcn@latest add @cybr/hard-offset-button`, and the
  `components.json` snippet `"registries": { "@cybr":
  "http://localhost:3000/r/{name}.json" }`. Clicking copy puts the exact text
  on the clipboard, shows `COPIED` and announces it, then reverts after about
  2s. With the clipboard unavailable or denied, it shows `COPY FAILED` and
  announces that. Lint and tsc pass.

- [x] **3. Highlighted source + Preview/Code tabs + copy source.** Install
  `shiki`. Add `app/docs/_lib/source.ts`, which reads the item's first
  `files[].path` from disk relative to `process.cwd()` and returns the raw text.
  Add a server `CodeBlock` that highlights `tsx` with Shiki's CSS-variables
  theme. Add `ComponentPreview`: a server wrapper that reads and highlights the
  source, then passes the preview children, highlighted HTML, and raw source
  to a client `Tabs`. In `Tabs`, `role="tablist"`/`tab`/`tabpanel`,
  `aria-selected` and `aria-controls`/`aria-labelledby` are wired, with a
  roving `tabIndex`. ←/→ move between tabs, and Home/End go to the first or
  last tab. Preview is selected by default, and the inactive panel is
  `hidden`. Copy source copies the raw text shown in the Code tab. Map the
  `--shiki-*` variables to tokens in a docs-scoped CSS file imported by the
  docs layout (tokens only, no hex).
  **Done when:** the Code tab shows the exact contents of
  `registry/ui/hard-offset-button.tsx`, highlighted in token colours, keyboard
  tab switching works with visible signal focus outlines, copy source copies
  the file byte for byte, and lint and tsc pass. Confirm this works under
  `cacheComponents` with no "uncached data outside Suspense" error in dev or
  build, using `"use cache"` on the read/highlight function if needed.

- [x] **4. Props table, accessibility notes, reachability.** Add `PropsTable`
  (server) with typed rows `{ name: string; type: string; default?: string;
  description: string }[]`. Use a semantic `<table>` with `<caption>` and
  `<th scope="col">`. A missing default renders `—`. Zero rows render the
  `NO PROPS / NATIVE ATTRIBUTES ONLY` row. Fill the Hard-Offset Button page:
  props (`type` default `"button"`, `className` merged via `cn()`, `disabled`
  with the dashed offline style, and `...props` for all native `<button>`
  attributes), a usage snippet, and `## Accessibility` notes. The notes cover
  the native `<button>`, `type` defaulting to `button`, the signal focus
  outline, native `disabled`, the reduced-motion transition being removed,
  `--ground-deep` text on `--signal`, and that `className` must keep contrast.
  Add the link from `app/page.tsx` section 08 to the docs page.
  **Done when:** the full page renders the header, install, preview/code tabs,
  props table, usage, and accessibility sections in that order. The home
  specimen link navigates to it. Lint, tsc and `npm run build` pass.

## Files / areas

- `package.json`, `package-lock.json`: `@next/mdx`, `@mdx-js/loader`,
  `@mdx-js/react`, `@types/mdx`, `shiki`
- `next.config.ts`: `createMDX` wrapper and `pageExtensions`
- `mdx-components.tsx` (new, repo root, required by `@next/mdx` App Router)
- `app/docs/components/layout.tsx` (new)
- `app/docs/components/hard-offset-button/page.mdx` (new)
- `app/docs/_components/`: `component-doc-header.tsx`, `component-preview.tsx`,
  `tabs.tsx` (client), `code-block.tsx`, `install-command.tsx`,
  `copy-button.tsx` (client), `props-table.tsx`
- `app/docs/_lib/registry.ts`, `app/docs/_lib/source.ts` (new)
- `app/docs/docs.css` (new, Shiki variable → token mapping, imported by the
  docs layout)
- `app/page.tsx`: one link in section 08
- Read-only: `registry.json`, `registry/ui/hard-offset-button.tsx`,
  `styles/tokens.css`, `styles/effects.css`

## Data / contracts

- **Docs page contract (locks the overview's "Docs page (MDX)" shape):** one
  file at `app/docs/components/<item>/page.mdx`, where `<item>` exactly matches
  a `registry.json` item `name`. It exports `metadata` built from
  `getRegistryItem("<item>")`, then composes, in order:
  `<ComponentDocHeader item>`, `<InstallCommand item>`,
  `<ComponentPreview item>{live demo JSX}</ComponentPreview>`,
  `<PropsTable rows>`, a `## Usage` code example, and `## Accessibility`
  notes.
- **Single source of truth:** the title, description, source path, and install
  name come from `registry.json`. The page never restates them. The install
  command format is `npx shadcn@latest add @cybr/<item>`, and the setup
  snippet origin is `registry.json` `homepage` (currently
  `http://localhost:3000`; Feature 15 changes it).
- **Source shown = repo source:** the code tab and copy source use
  `registry/ui/<item>.tsx` as it is in the repo. Installed copies can differ
  slightly, because the shadcn CLI rewrites import aliases. One line under the
  code tab says so.
- **Rendering safety:** Shiki HTML is set with `dangerouslySetInnerHTML`. That
  is acceptable here only because the input is a repo file read at render time
  (not user input) and Shiki escapes the code. No user-controlled text is
  rendered anywhere in this feature.
- **States:** these pages are static, with no loading state. An unknown item or
  missing source file throws during build or render (fails fast, no
  half-rendered page). Unknown routes get the default 404. The clipboard has
  idle, copied, and failed states. `PropsTable` has an empty state.

## Testing

- No test command is configured, so there are no unit tests. Logic is a small
  registry lookup and a file read, verified by the build failing on bad input.
- Gates: `npm run lint`, `npx tsc --noEmit`, `npm run build` (this runs
  `registry:build` first).
- Manual dev check at `/docs/components/hard-offset-button`:
  - visual match to tokens
  - tab keyboard behaviour (Tab into the tablist, ←/→, Home/End)
  - both copy buttons, including the failure path (for example, on a non-secure
    origin or after denying clipboard permission)
  - screen-reader announcement of the copy result via a polite live region
  - `prefers-reduced-motion` (the template adds no animation)
- No browser harness exists, so there's no automated visual or a11y evidence.
  Don't claim any.

## Notes for the AI

- Read `node_modules/next/dist/docs/01-app/02-guides/mdx.md` before step 1.
  Under Turbopack, remark/rehype plugins can only be given as strings (none
  are needed here).
- Keep the docs-only code in `app/docs/_components` and `app/docs/_lib`. It
  isn't a registry item, so don't add it to `registry.json`.
- Use colour tokens only. Use radius 0 and solid borders. Copy buttons are
  small mono controls (not `HardOffsetButton`, which is a large CTA) with
  `focus-visible:outline-signal`. Respect the contrast rules in the overview UI
  section. For example, `--signal` text sits only on `--bg`.
- `CopyButton`: an `aria-label` names what it copies ("Copy install command",
  "Copy source"). The status goes in a visually hidden `aria-live="polite"`
  region. Clear the reset timer on unmount. Catch `navigator.clipboard`
  absence or rejection and show the failed state. Never throw.
- Don't add `"use client"` to MDX pages or server pieces. Only `tabs.tsx` and
  `copy-button.tsx` are client components.
- `HardOffsetButton` is used inside the MDX demo directly from
  `@/registry/ui/hard-offset-button`.
- At `/complete`, the user-owned plans should record the three decisions above.
  They replace the overview TODOs on Docs tooling, Docs URL structure, and the
  "Docs page (MDX)" lock. Propose this. Don't edit the plans silently.

## Verification evidence

Recorded by `/check` on 2026-11-02. Browser evidence came from headless Google
Chrome driven over the DevTools protocol against the running `next dev` on :3000
(Playwright is not installed): real mouse and key events, clipboard read-back,
computed styles, screenshots, console and network capture.

- **Gates:** `npm run lint`, `npx tsc --noEmit`, `npm run build` (runs
  `registry:build` first) all exit 0 with no warnings.
  `/docs/components/hard-offset-button` is prerendered static (30d revalidate,
  1y expire). An earlier build warned that the source read traced the whole
  project; scoping the read to `registry/` removed it.
- **Reachability:** clicking the home specimen's section 08 link lands on
  `/docs/components/hard-offset-button`. `/docs/components/does-not-exist`
  returns 404 and renders Next's not-found page.
- **Page:** the h1, description and `<title>` ("Hard-Offset Button · CYBR//UI")
  match `registry.json`. Section order is Install > Preview > Props > Usage >
  Accessibility. The install command and the `components.json` setup snippet
  match exactly.
- **Tabs:** Preview is selected by default, the Code panel is `hidden`, and
  `aria-controls`/`aria-labelledby` are wired. Tab lands on the selected tab;
  ArrowRight goes to Code and wraps back to Preview; End, Home and ArrowLeft
  work. Keyboard focus is `:focus-visible` with a solid 3px `--signal` outline.
- **Code tab:** the Shiki output's text equals `registry/ui/hard-offset-button.tsx`
  (1421/1421 chars), and its spans use `--shiki-token-*` variables.
- **Copy:** source, install command and setup snippet each copy exact text
  (clipboard read back: 1421, 46 and 64 chars). Each shows COPIED, the polite
  live region reads "Copied", and each resets to COPY after about 2s. With
  clipboard-write denied through CDP, it shows COPY FAILED, announces "Copy
  failed", resets, and throws nothing.
- **Props table:** has a `<caption>`, all `<th scope="col">`, 4 rows, and "—"
  for missing defaults. The empty-rows state is not exercised on this page.
- **Reduced motion (emulated):** `document.getAnimations()` is empty; the demo
  button's `transition-property` is `none`.
- **Console/network:** no errors except the expected 404 from the
  unknown-route test.
- **Not covered:** a real screen reader (only the live region's contents and
  attributes were checked).


<!-- blueprint:completion {"schemaVersion":2,"specBytes":15217,"specSha256":"4ed99ea84b180411536ffa3be506faaa7d9fe9ac5e6a2b80280db95da8cd4be8","branch":"refs/heads/feature/docs-component-page-template","head":"b2c23db09efaddf45694851c07735c5df5ba9bd8","baseRef":"refs/heads/main","baseCommit":"b2c23db09efaddf45694851c07735c5df5ba9bd8","sourceTree":"2208857684a4b06632fdb8ab7d77285e79eb53a9","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run or do:

`npm run dev`, then open http://localhost:3000/docs/components/hard-offset-button. Click **Code**, then click the **COPY** button in the code header.

Expected:

The Code tab shows `registry/ui/hard-offset-button.tsx` with token-coloured syntax on a near-black panel. The button changes to **COPIED** in signal orange for about 2 seconds, and pasting gives the exact file contents.

This proves:

The template reads the registry item source, highlights it in token colours, and the copy-source control copies that exact text.
