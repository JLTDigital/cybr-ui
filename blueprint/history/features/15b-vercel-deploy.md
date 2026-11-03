# Feature: Vercel deploy

**From build-plan:** feature 15b
**Build attempt:** 1
**Branch:** feature/vercel-deploy
**Status:** verified

## Goal

Put CYBR//UI live at `https://cybr-ui.com` on Vercel, with
`NEXT_PUBLIC_SITE_URL` set for production. Then prove from outside the repo
that the live registry serves and that `npx shadcn add @cybr/<item>` installs
into a clean Next.js app. This closes parent feature 15 (Launch).

This is mostly an operations feature. Importing the repo, attaching the domain,
changing DNS and setting env vars are outward-facing actions in the user's
Vercel and registrar accounts. **The user does them** (no Vercel CLI is
installed, and the agent must not act on those accounts). The agent prepares
exact instructions, then verifies the result with read-only HTTP checks and a
scratch-directory install.

## In scope

- Pre-deploy check that the repo builds the way Vercel will build it:
  `npm ci` then `npm run build`, which runs `shadcn build` into `public/r/`
  before `next build`. `public/r/` is gitignored, so Vercel must regenerate it.
  The local check already passes; see Testing.
- The user imports `JLTDigital/cybr-ui` into Vercel with the default Next.js
  framework preset. No overrides: install `npm ci` (from `package-lock.json`),
  build `npm run build`, default output. Production branch `main`.
- The user sets `NEXT_PUBLIC_SITE_URL=https://cybr-ui.com` for the
  **Production** environment only. Preview deployments leave it unset and fall
  back to `registry.json` `homepage` (`https://cybr-ui.com`) through
  `getRegistryOrigin()` in `app/docs/_lib/registry.ts`. That is the same value,
  so install commands on previews still point at the canonical registry.
- The user attaches `cybr-ui.com` as the primary production domain and adds
  `www.cybr-ui.com` as a redirect to the apex. The user also sets the DNS
  records Vercel shows at the registrar and waits for the TLS certificate.
- Live smoke test, run by the agent once the user confirms the domain is
  active (see Build step 4).
- Clean-app install test in the session scratchpad, never inside this repo
  (see Build step 5).
- Record the deployment URL, the commit it was built from, and the smoke and
  install results in this spec's Testing section as evidence.

## Out of scope

- Static export (`output: "export"`). This is an open question in the
  overview. The default Vercel Next.js runtime serves the current build with
  no config change, so static export is not needed now.
- Analytics (`NEXT_PUBLIC_ANALYTICS_ID`), OG images, sitemap, robots.
- Vercel config files (`vercel.json`), GitHub deploy workflows, or making
  Vercel checks required in CI. The Vercel Git integration handles deploys.
- Changing the registry namespace, item names, README install docs or
  licence. All of these are locked by 15a.
- Paid tier, the Pro plan or monetisation. Hobby is fine while the library is
  free and MIT. The overview notes to re-check Hobby terms if it is ever
  monetised.
- Repo or product code changes. If deployment exposes a code defect, stop and
  route it to `/fix` rather than patching it inside this feature.

## Build loop

- `workflow.stepReview` is `feature`: work through all steps, then hand off
  for one review at the end. Pause sooner only at the user-action gates
  (steps 2 and 3), where the agent waits for the user to confirm.
- `workflow.checkpointCommits` is `disabled`: no intermediate commits.
  `/complete` creates the feature commit.
- Never run `vercel`, DNS or registrar commands, and never push, on the
  user's behalf. Verification is read-only (`curl`, a browser fetch, and
  `npx shadcn` in the scratchpad).

## Build steps

- [x] **1. Pre-deploy parity check.** On `feature/vercel-deploy`, run
  `npm ci && npm run verify` from a clean tree. Confirm `public/r/registry.json`,
  `public/r/all.json` and `public/r/hard-offset-button.json` are regenerated,
  and that `git status` shows no tracked changes.
  Confirm that `main` on `origin` is at or after `77c0485`, the 15a launch
  commit, because Vercel deploys from the remote, not the local branch. If
  `origin/main` is behind, tell the user. Pushing is their decision.
  *Done when:* Verify passes, the three registry files exist after the
  build, and the agent has reported the `origin/main` commit Vercel will
  build.

- [x] **2. User: import and configure the Vercel project.** Give the user a
  short checklist:
  1. Import `JLTDigital/cybr-ui` in Vercel and keep the Next.js preset with
     no build or install overrides.
  2. Under Settings → Environment Variables, add
     `NEXT_PUBLIC_SITE_URL` = `https://cybr-ui.com` for Production only.
  3. Deploy, or redeploy if the variable was added after the first build.
     `NEXT_PUBLIC_*` values are inlined at build time.

  The user reports the `*.vercel.app` production URL. The agent then checks
  `https://<project>.vercel.app/r/registry.json`, which must return 200 with
  JSON whose `name` is `cybr`, and checks `/` for a 200.
  *Done when:* the production deployment is Ready, built from the expected
  `main` commit, and both URLs return 200.
  *If the build fails:* capture the Vercel build log excerpt. If the cause is
  in the repo, stop and route to `/fix`. If it is a project setting, give the
  user the corrected setting.

- [x] **3. User: attach the domain.** In Vercel → Domains, add
  `cybr-ui.com` as the primary domain and `www.cybr-ui.com` redirecting to it.
  Set the DNS records Vercel shows at the registrar, then wait until Vercel
  reports Valid Configuration and the certificate is issued. The agent checks
  with `dig +short cybr-ui.com` and `curl -sI https://cybr-ui.com/`.
  *Done when:* `https://cybr-ui.com/` returns 200 over valid TLS and
  `https://www.cybr-ui.com/` redirects (301/308) to the apex. While DNS or
  certificates are still propagating, mark the activity `blocked` with resume
  `/implement` and do not retry in a tight loop.

- [x] **4. Live smoke test.** From the terminal (read-only):
  - `GET https://cybr-ui.com/` → 200.
  - `GET https://cybr-ui.com/docs/components` → 200.
  - `GET https://cybr-ui.com/docs/components/hard-offset-button` → 200, and
    the HTML contains the install command naming `@cybr/hard-offset-button`
    and the origin `https://cybr-ui.com`, not `localhost` or a
    `*.vercel.app` host.
  - `GET https://cybr-ui.com/r/registry.json` → 200, `content-type`
    contains `application/json`, and `name` is `cybr`. Its item names must
    match the local `public/r/registry.json` exactly (compare sorted name
    lists).
  - `GET https://cybr-ui.com/r/hard-offset-button.json` and `/r/all.json`
    → 200 JSON whose `files[].content` equals the local build output for the
    same commit.
  - `GET https://cybr-ui.com/r/does-not-exist.json` → 404, not a 200 HTML
    page.
  *Done when:* every check passes and the results are pasted into Testing.

- [x] **5. Clean-app install test.** In a new empty directory under the
  session scratchpad (never in this repo):
  1. `npx create-next-app@latest` with the defaults (TypeScript, Tailwind,
     App Router), then `npx shadcn@latest init` with the defaults.
  2. Add `"registries": { "@cybr": "https://cybr-ui.com/r/{name}.json" }`
     to `components.json`, exactly as the README shows.
  3. `npx shadcn@latest add @cybr/hard-offset-button`. Confirm the
     component, the tokens dependency and the `utils` helper are written, and
     that `npm run build` in the scratch app passes.
  4. `npx shadcn@latest add @cybr/all --overwrite`, then `npm run build`
     again.
  This follows the README path exactly, so any mismatch is a docs or
  registry defect. Do not work around it; route it to `/fix`.
  *Done when:* both installs succeed against the live domain, both scratch
  builds pass, and the commands and their outcomes are recorded in Testing.
  Delete the scratch app afterwards.

- [x] **6. Close out.** Update this spec's Testing section with the
  deployment URL, the built commit, and the step 4 and 5 results. At
  `/complete`, check 15b and its parent 15 in `blueprint/build-plan.md`.
  Also propose (not apply) a `project-plan.md` deployment edit that fills in
  the domain `cybr-ui.com` and "Vercel Next.js runtime (no static export)"
  so the user can re-run `/overview`.
  *Done when:* evidence is recorded and `npm run verify` still passes on
  the branch.

## Files / areas

- `blueprint/context/current-feature.md`: evidence only.
- `blueprint/build-plan.md`: checkbox at `/complete`.
- Read-only references: `app/docs/_lib/registry.ts` (`getRegistryOrigin`),
  `registry.json` (`homepage`, item names), `README.md` (install path being
  smoke-tested), `package.json` (build script), `.gitignore` (`public/r/` is
  not committed, so it must be built on Vercel; `.vercel` is ignored).
- External: Vercel project settings, the registrar's DNS for `cybr-ui.com`,
  and the scratchpad directory. None of these are in the repo.
- No product code changes are expected.

## Data / contracts

- Registry URL contract (locked in 15a, unchanged):
  `https://cybr-ui.com/r/{name}.json` with namespace `@cybr`, and
  `https://cybr-ui.com/r/registry.json` as the index. These are public,
  unauthenticated static JSON files.
- `NEXT_PUBLIC_SITE_URL`: an absolute origin with no trailing slash. It is
  read at build time only. Production is `https://cybr-ui.com`. When unset,
  the origin falls back to `registry.json` `homepage`.
- Health check (from the overview): `/` and `/r/registry.json`.
- No secrets, auth, stored data or user input. The only trust boundary is
  public static content, so no new security mechanism is needed. Never
  commit the `.vercel/` directory or any Vercel token.

## Testing

- Pre-spec Verify (`npm run verify`, on `main` at `77c0485`): **passed**
  (lint, typecheck, `shadcn build`, `next build`; every route prerendered
  static).
- No unit test command is configured. Browser tests (`npm run test:browser`)
  run against a local `next start` on port 3100, not the live site. Run them
  once at `/check` to confirm nothing regressed. They do not prove the
  deployment.
- Live evidence comes from steps 2 to 5 only. Nothing about the live
  deployment is claimed until those checks are run and recorded here.

### Evidence (fill during /implement)

- Step 1 (2026-11-02, branch `feature/vercel-deploy`): `npm ci && npm run verify`
  exit 0; `public/r/registry.json`, `all.json`, `hard-offset-button.json`
  regenerated; no tracked changes besides this spec. `origin/main` =
  `77c04854` (includes the 15a commit), which is what Vercel will build.
- Production deployment (2026-11-02): served at `https://cybr-ui.com`
  (`server: Vercel`, `x-vercel-id: lhr1::…`). Built commit: `77c0485`,
  inferred because live `/r/hard-offset-button.json`, `/r/all.json` and
  `/r/registry.json` are byte-identical to the local build of that commit.
  The user gave the custom domain directly; the `*.vercel.app` URL was not
  separately checked.
- Domain + TLS: `cybr-ui.com` A → `216.198.79.1`; `https://cybr-ui.com/` 200
  with valid TLS and HSTS; `http://cybr-ui.com/` 308 → `https://cybr-ui.com/`.
- www (history):
  - 2026-11-02: HTTPS failed with no certificate for `www.cybr-ui.com`. The
    user added `www` to the Vercel project.
  - Recheck: valid TLS, but it served 200 directly instead of redirecting.
    The user set it to redirect.
  - 2026-11-03: `https://www.cybr-ui.com/` → **307** `https://cybr-ui.com/`
    (path kept: `/r/registry.json` → `https://cybr-ui.com/r/registry.json`).
    `http://www.cybr-ui.com/` 308 → `https://www.cybr-ui.com/`. TLS is
    valid. **The redirect is temporary (307); step 3 requires a permanent
    301/308.**
- Final Verify (2026-11-03, `feature/vercel-deploy`): `npm run verify` exit 0
  (lint, typecheck, registry build, next build, 43/43 static pages). Only
  this spec is changed in the tree.
- **Accepted deviation, step 3 (2026-11-03):** `www.cybr-ui.com` redirects
  with **307**, not 301/308. `www` is not a separate domain on the Vercel
  project; Vercel applies a built-in apex/www redirect. Adding `www` with a
  308 redirect fails with "cannot redirect to the same domain", and a
  `next.config.ts` redirect cannot run because Vercel answers first. The
  user chose to proceed by running `/complete` after being offered "accept
  307". Functionally every `www` URL lands on the same path at
  `https://cybr-ui.com` over valid TLS.
- Step 6: evidence recorded above. Proposed (not applied) `project-plan.md`
  deployment edit: domain `cybr-ui.com`; hosting "Vercel Next.js runtime
  (no static export)"; then re-run `/overview`.
- Live smoke (step 4), all pass:
  - `/` 200 html; `/docs/components` 200 html;
    `/docs/components/hard-offset-button` 200 html. The page contains
    `@cybr/hard-offset-button` and the origin `https://cybr-ui.com/r/{name}.json`,
    with 0 occurrences of `localhost` or `vercel.app`.
  - `/r/registry.json` 200 `application/json`, `name: cybr`, 44 items, names
    identical to local.
  - `/r/hard-offset-button.json` and `/r/all.json` 200 `application/json`,
    deep-equal to the local build (including `files[].content`).
  - `/r/does-not-exist.json` 404.
- Clean-app install (step 5), all pass, in the scratchpad (since deleted):
  - `create-next-app@latest --yes`, then `shadcn@latest init --defaults`
    (style `base-nova`), then the README `registries` mapping in
    `components.json`.
  - `shadcn add @cybr/hard-offset-button`: created
    `styles/cybr-tokens.css` and `components/ui/hard-offset-button.tsx`;
    skipped the identical `lib/utils.ts`. The scratch `npm run build` passed.
  - `shadcn add @cybr/all --overwrite`: created 39 files (components,
    `styles/cybr-effects.css`, `lib/use-reduced-motion.ts`). Added the README
    step 3 imports to `app/globals.css` and rendered `<HardOffsetButton>` in
    `app/page.tsx`. `tsc --noEmit` (all 39 installed components) and
    `npm run build` both passed.
  - Observation (as designed, not a defect): the CSS import is a documented
    manual step (README §3 and the `tokens` item description). `shadcn add`
    does not wire it into `globals.css`.

## Notes for the AI

- Read `node_modules/next/dist/docs/` only if the Vercel build exposes a
  Next 16.4 behaviour question, such as `cacheComponents`,
  `partialPrefetching` or `experimental.agentFeedback` in
  `next.config.ts`. Do not change `next.config.ts` here. A config change
  needed to deploy is a `/fix`.
- Wait for explicit user confirmation at steps 2 and 3. Do not assume
  the domain or DNS is in place.
- The user owns `cybr-ui.com` per 15a. If the step 3 check shows they do
  not control its DNS, stop and ask. Do not pick another domain, because the
  domain is baked into `registry.json` and the README.
- Keep scratch installs out of the repo and out of `public/`.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":14848,"specSha256":"535d165062632076f7d85071a5ea3256c81a6f67ac8f013810ae9a69bb122ac5","branch":"refs/heads/feature/vercel-deploy","head":"77c04854c02f272881f075b40f45aadc1f3626ac","baseRef":"refs/heads/main","baseCommit":"77c04854c02f272881f075b40f45aadc1f3626ac","sourceTree":"5922f40bbbb732dba4acf898160f7dd18d3e677a","landing":"local-merge","absentOptional":[]} -->

## Try it now

1. Open https://cybr-ui.com/: the CYBR//UI landing page loads over HTTPS.
2. Open https://cybr-ui.com/docs/components/hard-offset-button: the install
   command names `@cybr/hard-offset-button`, and the registry origin is
   `https://cybr-ui.com`.
3. Open https://cybr-ui.com/r/registry.json: JSON with `"name": "cybr"`.
4. Open https://www.cybr-ui.com/: you land on https://cybr-ui.com/ (307,
   the accepted deviation).
5. Optional, in any empty folder: `npx create-next-app@latest app --yes`,
   then `cd app && npx shadcn@latest init --defaults`. Add
   `"registries": { "@cybr": "https://cybr-ui.com/r/{name}.json" }` to
   `components.json` and run `npx shadcn@latest add @cybr/hard-offset-button`.
   It writes `components/ui/hard-offset-button.tsx` and
   `styles/cybr-tokens.css`.
