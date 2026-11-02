# Feature: Quality gates in CI

**From build-plan:** feature 14
**Build attempt:** 1
**Branch:** feature/quality-gates-in-ci
**Status:** verified

## Goal

Every pull request and every push to `main` runs, on GitHub Actions: lint, type-check,
the registry build, the production build, and a Playwright suite. The suite covers visual
snapshots, reduced motion, and keyboard behaviour. Developers get the same checks locally
through documented npm commands. Linux snapshot baselines are made by a manually started
CI workflow, so nobody needs Docker or a Linux machine.

## In scope

- Install `@playwright/test` (devDependency, Chromium only) and add a `playwright.config.ts`.
- npm scripts `typecheck`, `verify`, `test:browser`. Record them in the `AGENTS.md`
  Commands section as `Typecheck`, `Verify` and `Browser tests`.
- Visual snapshot specs with reduced motion and the default theme: `/`,
  `/docs/components`, and every `/docs/components/<item>` page (38 today). Also `/` once
  under each alternate preset (`acid-terminal`, `ice-neon`). About 42 baselines.
- Reduced-motion checks: with `prefers-reduced-motion: reduce`, no page in the visual set
  has a running animation after load.
- Keyboard checks for the interactive surfaces listed under Build steps, asserting only
  behaviour that the current code already implements.
- `.github/workflows/ci.yml`, triggered by `pull_request` and `push` to `main`.
- `.github/workflows/update-snapshots.yml` (`workflow_dispatch`) regenerates the Linux
  baselines and uploads them as an artifact for the maintainer to commit.
- The committed Linux baselines from the first run of that workflow.

## Out of scope

- Prettier or format checks (not named in the build-plan line).
- A unit test runner or Vitest (`/tests` owns that).
- Branch protection rules and required-check settings on GitHub. These are repo settings
  the maintainer changes by hand.
- Vercel deploy, preview deployments, README and launch docs (Feature 15).
- Snapshots of every page in every theme, or of more than one viewport.
- Firefox and WebKit projects.
- Fixing component bugs these checks expose. Report each one and route it through `/fix`
  (see Notes).

## Build loop

`workflow.stepReview` is `feature`: implement all steps, then one review at the end of the
feature. `workflow.checkpointCommits` is `disabled`: no commits between steps. `/complete`
makes the single feature commit. After each step, run that step's `Done when` check and
report the result before moving on.

## Build steps

- [x] **1. Playwright harness and scripts.** First read the Next.js testing guide under
  `node_modules/next/dist/docs/01-app/**/testing/` (Playwright section) and follow its
  current guidance. Run `npm i -D @playwright/test`, then `npx playwright install chromium`.
  Add `playwright.config.ts`:
  - `testDir: "e2e"`
  - one `chromium` project, `use.reducedMotion: "reduce"`, a fixed viewport of 1280×800
  - `webServer`: `npm run start` on port 3000, with `reuseExistingServer: !process.env.CI`
  - `forbidOnly`, `retries: 2`, `workers: 1` and the `github` reporter on CI; `list` locally
  - an HTML report in `playwright-report/`

  Add scripts `"typecheck": "tsc --noEmit"`, `"verify": "npm run lint && npm run typecheck && npm run build"`
  and `"test:browser": "playwright test"`. Add `/playwright-report/` and `/test-results/`
  to `.gitignore`, and exclude `e2e` output from ESLint only if lint flags generated files.
  Add one smoke spec, `e2e/smoke.spec.ts`: `/` returns 200, and `/r/registry.json`
  returns 200 with JSON.
  **Done when:** `npm run verify` exits 0, and `npm run test:browser` (after the build)
  passes the smoke spec locally.

- [x] **2. Visual snapshot spec.** Add `e2e/pages.ts`. It lists the component slugs by
  reading the directory names under `app/docs/components/*/page.mdx` with `node:fs`, so a
  new docs page is picked up automatically. Add `e2e/visual.spec.ts`:
  - Skip it with a clear reason when `process.platform !== "linux"`, because the
    baselines are Linux-only.
  - For each target, clear `localStorage`, freeze time with `page.clock` (the Status Bar
    renders a live UTC clock), wait for `document.fonts.ready`, then take
    `toHaveScreenshot({ fullPage: true })`.
  - For the two alternate-theme shots of `/`, set `localStorage["cybr-theme"]` in
    `addInitScript` before navigation. The `THEME_STORAGE_KEY` and preset ids come from
    `app/_lib/themes.ts`. Import them, don't copy them.
  - Use `mask` only for an element proven nondeterministic after time is frozen. List
    each mask with a one-line reason.

  **Done when:** `npx playwright test --list` shows about 42 visual tests, and on macOS
  they are reported as skipped, not failed.

- [x] **3. Reduced-motion spec.** Add `e2e/reduced-motion.spec.ts`. It uses the same
  targets from `e2e/pages.ts`, runs on every platform, and uses the default theme. After
  load and `document.fonts.ready`, it asserts that
  `document.getAnimations().filter(a => a.playState === "running")` is empty. On failure
  it prints the animation targets. JavaScript-driven motion such as canvas or rAF is not
  covered by `getAnimations`. The visual spec's screenshot-stability check covers it, so
  say so in a comment.
  **Done when:** the spec passes locally on every target. If a page fails, stop and report
  the component and animation, per Notes.

- [x] **4. Keyboard spec.** Add `e2e/keyboard.spec.ts`. Before writing each assertion,
  read the component source and its docs demo, and assert only the behaviour it already
  implements:
  - **Site-wide, on `/`:** pressing Tab moves focus to a visible element whose computed
    `outline-style` is not `none`.
  - **HUD Tooltip:** focusing the trigger shows the tooltip, and Escape hides it.
  - **Classified FAQ Accordion:** Enter or Space on a trigger toggles `aria-expanded` and
    the panel.
  - **Command Palette:** `Control+K` opens it (CI runs on Linux; use `Meta+K` only on
    darwin), focus moves into it, and Escape closes it and returns focus.
  - **Terminal Navbar:** the menu toggle opens and closes from the keyboard, and its
    `aria-expanded` changes to match.
  - **Brutal Mega Menu:** it opens from the keyboard and Escape closes it.
  - **Data-Readout Carousel:** keyboard controls change the active slide.
  - **Theme switcher:** it is reachable and operable with the keyboard, and the selected
    preset sets `data-theme` on `<html>`.

  Leave out any surface whose current code has no keyboard path. Report it instead of
  adding behaviour.
  **Done when:** the spec passes locally, and every listed surface is either asserted or
  reported as lacking keyboard support.

- [x] **5. CI workflows.** Add `.github/workflows/ci.yml`:
  - triggers: `pull_request` and `push` to `main`
  - `ubuntu-latest`, `actions/checkout`, `actions/setup-node` with Node 22 and an npm cache
  - `npm ci`, `npm run verify`, `npx playwright install --with-deps chromium`, then
    `npm run test:browser`
  - upload `playwright-report/` and `test-results/` as artifacts when the job fails
  - `concurrency` that cancels superseded runs on the same ref

  Add `.github/workflows/update-snapshots.yml` (`workflow_dispatch` only). It uses the same
  setup and runs `npm run build`, then
  `npx playwright test e2e/visual.spec.ts --update-snapshots`. It uploads the snapshot
  directory as an artifact. It never commits or pushes.
  **Done when:** `actionlint` passes, or a careful read if `actionlint` isn't available.
  Run every command in `ci.yml` locally in order, and each must exit 0. The workflows
  have not run on GitHub yet; say so plainly.

- [x] **6. Commands and docs.** Update `AGENTS.md` Commands:
  - add `Typecheck: npm run typecheck`, `Verify: npm run verify` and
    `Browser tests: npm run test:browser` (needs `npm run build` first, plus
    `npx playwright install chromium` once)
  - note that visual snapshots run only on Linux CI
  - explain how to refresh baselines: run "Update snapshots", download the artifact and
    commit it to `e2e/`
  - remove the outdated "No combined Verify command" and "Browser testing is opt-in"
    lines

  In `blueprint/context/coding-standards.md`, update only the Browser Verification
  stack-binding facts that are now false. The user explicitly chose browser tests in CI
  through this feature.
  **Done when:** `AGENTS.md` matches the scripts in `package.json`, and `npm run verify`
  still exits 0.

Follow-up after landing (was step 7; revised at `/complete`). GitHub only dispatches
"Update snapshots" once the workflow is on the default branch, and `ci.yml` does not run
on plain feature-branch pushes, so baselines cannot be made before landing. After `main`
is pushed, its first CI run fails only because the visual baselines are missing. The
maintainer then runs "Update snapshots" on `main`, and a `/fix` commits the Linux
baselines and confirms a green CI run. This feature does not claim CI is green.

## Files / areas

- `package.json` / `package-lock.json`: the `@playwright/test` devDependency and the scripts
- `playwright.config.ts` (new)
- `e2e/pages.ts`, `e2e/smoke.spec.ts`, `e2e/visual.spec.ts`, `e2e/reduced-motion.spec.ts`,
  `e2e/keyboard.spec.ts` (new), plus `e2e/visual.spec.ts-snapshots/` (Linux baselines)
- `.github/workflows/ci.yml`, `.github/workflows/update-snapshots.yml` (new)
- `.gitignore`, and `eslint.config.mjs` only if needed
- `AGENTS.md` Commands, `blueprint/context/coding-standards.md` Browser Verification
- Read-only references: `app/_lib/themes.ts` (`THEME_STORAGE_KEY`, `THEMES`),
  `app/docs/components/*/page.mdx` (route list), `registry/ui/status-bar.tsx` (clock),
  `registry/ui/command-palette.tsx` (`metaKey || ctrlKey` + K),
  `registry/ui/hud-tooltip.tsx`, `classified-accordion.tsx`, `terminal-navbar.tsx`,
  `mega-menu.tsx`, `data-readout-carousel.tsx`, `app/_components/theme-switcher.tsx`

## Data / contracts

- No app runtime, persisted data or API changes. Tests read only public routes and
  `/r/registry.json`.
- Snapshot names use Playwright's default template (`<name>-chromium-linux.png`).
  Baselines are created only by `update-snapshots.yml` on `ubuntu-latest` with the same
  Playwright version as the lockfile.
- CI is the gate. It fails on any lint, type, registry build, build, smoke, visual,
  reduced-motion or keyboard failure.

## Testing

- No unit test command exists, and this feature adds none.
- New `Browser tests` command: `npm run test:browser`, after `npm run build`.
- Evidence the implementer can produce locally: `npm run verify` and
  `npm run test:browser` (smoke, reduced-motion and keyboard pass; visual is skipped on
  macOS); `npx playwright test --list`; and `actionlint` if available.
- Evidence that needs GitHub: the first "Update snapshots" run, a green `ci.yml` run, and
  any visual comparison at all. Do not claim these until they have been seen.

## Notes for the AI

- Baseline today: `npm run lint` and `npx tsc --noEmit` both exit 0 on `main`
  (eca7fe2). Playwright is not installed. There is no `.github/` directory.
- If the reduced-motion or keyboard checks expose a real component defect, don't fix it
  inside this feature and don't weaken the assertion. Stop, report the page and the
  behaviour, and let the user choose between `/fix` (then resume) and an explicit,
  documented `test.fixme` with the reason.
- `next.config.ts` enables `cacheComponents` and `partialPrefetching`. Test against
  `next start` after `next build`, not `next dev`.
- `next/font` downloads Google fonts at build time, so CI needs network access, which
  GitHub-hosted runners have.
- Keep Chromium the only browser. Don't add Docker or extra reporters or services.
- Pushing the branch and starting workflow runs are outward actions. Ask before each one.

## Open questions

None blocking. These were decided before the spec: this feature owns Playwright and CI,
not `/tests browser` or `/ci`; baselines are generated in CI and are Linux-only; snapshot
scope is every page in the default theme plus `/` in each alternate preset.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":12071,"specSha256":"76ea97bd4dd1570800c9332373d5d26d105b2b818de63ed38b8dc93ea89c6ab8","branch":"refs/heads/feature/quality-gates-in-ci","head":"eca7fe21e3226dc04bd0129343d83019ac173109","baseRef":"refs/heads/main","baseCommit":"eca7fe21e3226dc04bd0129343d83019ac173109","sourceTree":"35c5372516080c1db828a1fa7a8540dcc6741d66","landing":"local-merge","absentOptional":[]} -->

## Try it now

Safe local checks, nothing deployed:

1. `npm run verify`: lint, typecheck and build all exit 0.
2. `npm run test:browser`: smoke, reduced-motion and keyboard specs pass; the 42 visual tests report as skipped on macOS (Linux-only baselines).
3. `npx playwright show-report`: open the HTML report to see each check by name.
4. After `main` is pushed: open the Actions tab and watch the CI run. Visual tests fail only on missing baselines until "Update snapshots" runs and the follow-up `/fix` commits them.

Generated at completion as a manual try path; not `/check guide` output and not a record of a run.
