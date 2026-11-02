# Feature: Launch-ready repo

**From build-plan:** feature 15a
**Build attempt:** 1
**Branch:** feature/launch-ready-repo
**Status:** verified

## Goal

Make the repository ready to ship under its final identity: `CYBR//UI` with
install namespace `@cybr`, served from `https://cybr-ui.com`. Every install
command and registry URL points at the production domain. The repo has an MIT
licence and a README that explains what the library is and how to install it.
The Vercel deploy itself is Feature 15b.

## In scope

- Lock `CYBR//UI` and `@cybr` as the final name and namespace. They are already
  in use everywhere, so no rename. Remove wording that calls them placeholders
  from user-facing files (README, site copy), not from `blueprint/` history.
- Production origin:
  - `registry.json` `homepage` becomes `https://cybr-ui.com`.
  - `getRegistryOrigin()` in `app/docs/_lib/registry.ts` returns
    `NEXT_PUBLIC_SITE_URL`, with any trailing `/` stripped, when that variable
    is set and not empty. Otherwise it returns `registry.homepage`.
  - Install commands (per-component pages and the landing `#install` block)
    then show `https://cybr-ui.com/r/{name}.json` by default.
- `metadataBase: new URL(getRegistryOrigin())` in `app/layout.tsx` so that
  absolute metadata URLs resolve against the production origin.
- `LICENSE` with the standard MIT text, plus `"license": "MIT"` in
  `package.json`.
- Replace the create-next-app `README.md` with project docs: what it is; a
  quick install (the `components.json` `registries` mapping for `@cybr`, then
  `npx shadcn@latest add @cybr/<item>` and `@cybr/all`); what tokens and fonts
  require (wording consistent with the `tokens` registry item description);
  the docs site link (`https://cybr-ui.com`); local development commands
  (from AGENTS.md Commands); `NEXT_PUBLIC_SITE_URL`; and the licence.

## Out of scope

- Vercel project, domain DNS, env var set in Vercel, live smoke test (15b).
- A new `/docs/installation` route. The landing `#install` block and the
  per-component install sections already carry the install docs on the site.
- OG images, sitemap, robots, analytics (`NEXT_PUBLIC_ANALYTICS_ID`).
- Paid tier, blocks namespace, publishing to npm.
- Re-running `/overview` (recommended separately after the plan edits).

## Build loop

`workflow.stepReview` is `feature`: build all steps, then review the feature as
a whole. `workflow.checkpointCommits` is `disabled`: no commits between steps.
`/complete` creates the single feature commit.

## Build steps

- [x] 1. **Production origin.** Set `registry.json` `homepage` to
  `https://cybr-ui.com`. Update `getRegistryOrigin()` to prefer a non-empty
  `process.env.NEXT_PUBLIC_SITE_URL` with trailing slashes stripped, falling
  back to `registry.homepage`. Add `metadataBase` in `app/layout.tsx` from the
  same function.
  **Done when:** `npm run build` passes; the generated
  `.next/server/app/docs/components/hard-offset-button.html` (or equivalent
  prerender output) contains `https://cybr-ui.com/r/{name}.json` and no
  `localhost:3000`; `grep -rn "localhost:3000" app registry lib registry.json`
  returns nothing; a build run with `NEXT_PUBLIC_SITE_URL=https://example.test/`
  renders `https://example.test/r/{name}.json` (no double slash).
- [x] 2. **Licence.** Add `LICENSE` (MIT, `Copyright (c) 2026 JLTDigital and Jonathan Taft`) and
  `"license": "MIT"` to `package.json`.
  **Done when:** both files show MIT; `npm run lint` and `npm run typecheck`
  pass.
- [x] 3. **README and install docs.** Rewrite `README.md` per In scope. Commands
  and namespace strings must match the code exactly (`npx shadcn@latest add
  @cybr/<name>`, the `"registries"` mapping string rendered by
  `InstallCommand`). Remove the "placeholder" wording from any user-facing site
  copy if found (`grep -rni placeholder app` limited to name/namespace mentions).
  **Done when:** README has no create-next-app text; every command in it is
  copy-pasteable and matches `install-command.tsx`; `npm run verify` passes.
- [x] 4. **Final gate.** Run `npm run verify` and `npm run test:browser`
  (after `npx playwright install chromium` if needed).
  **Done when:** both pass. Visual snapshots report skipped on macOS, as
  documented.

## Files / areas

- `registry.json`: `homepage`
- `app/docs/_lib/registry.ts`: `getRegistryOrigin()`
- `app/docs/_components/install-command.tsx`: unchanged; consumes the origin
- `app/layout.tsx`: `metadataBase`
- `LICENSE` (new), `package.json`, `README.md`

## Data / contracts

- Registry item URL shape stays `<origin>/r/<name>.json`. `<origin>` is
  `https://cybr-ui.com` unless `NEXT_PUBLIC_SITE_URL` overrides it. It has no
  trailing slash.
- `NEXT_PUBLIC_SITE_URL` is build-time, owner-set config, not user input. Its
  only normalization is stripping trailing slashes. An invalid URL fails the
  build through `new URL()` in `metadataBase`, which is acceptable for owner
  config.
- The `components.json` mapping users copy is
  `"registries": { "@cybr": "https://cybr-ui.com/r/{name}.json" }`.

## Testing

- No unit test command is configured, so the origin logic is checked through
  the build output (step 1) and not through a unit test.
- The existing `e2e/smoke.spec.ts` keeps covering `/r/registry.json`. No new
  browser test: the change is static text, and adding a Playwright assertion
  for the install string would not be proportionate. No visual baselines are
  committed yet (`e2e/visual.spec.ts-snapshots/` is absent), so there is
  nothing to refresh.
- No live-deploy evidence is claimed. That belongs to 15b.

## Notes for the AI

- Read the relevant `node_modules/next/dist/docs/` guide on `metadataBase` and
  `NEXT_PUBLIC_` env inlining before editing `app/layout.tsx`. This Next.js
  version differs from training data.
- `next.config.ts` enables `cacheComponents`. Reading `process.env.NEXT_PUBLIC_*`
  is inlined at build time, so prerendered pages stay static. Confirm the build
  still reports the docs routes as static.
- `public/r/` is generated and untracked. Do not commit it.
- Do not touch `blueprint/history/` or rename anything. The name is kept.
- Verify at spec time: `npm run verify` passed on clean `main` (2026-11-02).


<!-- blueprint:completion {"schemaVersion":2,"specBytes":6221,"specSha256":"26fbf32a97a205e98d2e625a23d39537383e2ef5ffdf4ac657c8bf9026aed7c9","branch":"refs/heads/feature/launch-ready-repo","head":"b18b6f5c9226bcec98934088d5d3e14dd12e479f","baseRef":"refs/heads/main","baseCommit":"b18b6f5c9226bcec98934088d5d3e14dd12e479f","sourceTree":"b0ac0dd6e3ced6e1b82c8abc204d2cf653081749","landing":"local-merge","absentOptional":[]} -->
