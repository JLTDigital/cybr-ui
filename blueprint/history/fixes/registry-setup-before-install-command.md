# Fix: Registry setup before install command

**Type:** Fix
**Status:** verified
**Branch:** fix/registry-setup-before-install-command

## The problem

A first-time user in a separate project ran `npx shadcn@latest add @cybr/all`
(the command shown on cybr-ui.com) and got:

```text
Unknown registry "@cybr". Make sure it is defined under "registries" in your components.json or package.json file
```

The live registry is fine (`https://cybr-ui.com/r/all.json` returns 200, and
the 15b clean-app test passed). The cause is the site's install UI.
`app/docs/_components/install-command.tsx` (`InstallCommand`, used by the
landing `#install` block in `app/page.tsx` and by every component docs page)
leads with the large `$ npx shadcn@latest add @cybr/<name>` box. The required
`registries` mapping comes *after* it, as a small hairline box labelled
"One-time setup". Users copy the prominent command first and hit the error.
The README already orders it correctly (step 1: map the namespace; step 2:
add components). The site contradicts that order.

## The fix

Make `InstallCommand` follow the README's order and make the prerequisite
equally visible:

1. **Step 1, map the `@cybr` namespace (once per project).** Show a short
   instruction to add this inside `components.json`, merging into an existing
   `"registries"` object if there is one, and to run `npx shadcn@latest init`
   first when the project has no `components.json` (user-requested
   revision; also in README step 1 and Troubleshooting). Below it, the existing copyable
   `setup` snippet
   (`"registries": { "@cybr": "<origin>/r/{name}.json" }`, origin still from
   `getRegistryOrigin()`), styled at the same weight as the command box
   (`--border-base`, `text-sm`).
2. **Step 2, add components.** The existing copyable `$ npx shadcn@latest add
   @cybr/<name>` box, unchanged in content.
3. One caption line under the steps naming the symptom: if shadcn reports
   `Unknown registry "@cybr"`, step 1 is missing. This makes the error text
   findable on the page.

Use an ordered list (`<ol>`) for the two steps so the order is semantic. Keep
the section's `Install` heading and `aria-labelledby`. Keep both copy buttons
and their distinct labels ("Copy registry setup", "Copy install command"). Use
existing tokens and classes only.

Also add a one-line **Troubleshooting** note to `README.md` under Install
with the same symptom and cause, pointing back to step 1.

Must not break:
- The copied text of both buttons stays byte-identical to today: the same
  `command` and `setup` strings.
- `NEXT_PUBLIC_SITE_URL` / `getRegistryOrigin()` behaviour.
- The landing `#install` anchor and its follow-on paragraph in
  `app/page.tsx`. No change is needed there.
- Keyboard order: setup copy button before command copy button, matching the
  visual order.

Out of scope: changing the registry, item names, `registryDependencies`, or
offering a URL-based install that bypasses the namespace; a new
`/docs/installation` page; the CLI's own error.

## Build steps

- [x] **1. Reorder and restyle `InstallCommand`, and add the README note.**
  Edit `app/docs/_components/install-command.tsx` as above, and add the
  README troubleshooting line.
  *Done when:*
  - `npm run lint` and `npm run typecheck` pass.
  - The `next build` HTML for `/` and `/docs/components/hard-offset-button`
    has the `registries` snippet before the `npx shadcn@latest add` command,
    inside an `<ol>`.
  - The page contains the text `Unknown registry "@cybr"`.

## Verify

- `npm run verify`, then `npm run test:browser` (smoke, keyboard and
  reduced-motion; visual snapshots skip off Linux). Visual baselines may
  need a refresh through the "Update snapshots" workflow if CI flags the
  landing or docs pages.
- Manual (`npm run dev`, or the Vercel preview after push):
  - Open `/` and `/docs/components/hard-offset-button`. Step 1 (registries)
    reads first and at equal weight to step 2 (add command).
  - Each copy button copies the same text as before.
  - Tab order reaches "Copy registry setup" before "Copy install command".
- End-to-end, optional: in a fresh Next.js + `shadcn init` project, follow
  the page top to bottom (paste step 1 into `components.json`, run step 2).
  `@cybr/all` installs without the `Unknown registry` error.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":4298,"specSha256":"c3c494a4c78d076d46347cad489fbe3be9697f099924fa395a0f1080620b11a8","branch":"refs/heads/fix/registry-setup-before-install-command","head":"751b6b224faca068f84a7defaad011345f72f366","baseRef":"refs/heads/main","baseCommit":"751b6b224faca068f84a7defaad011345f72f366","sourceTree":"8e76b0a76d4d5f2ac100b66dc2d35149db3a1959","landing":"local-merge","absentOptional":[]} -->

## Try it now

1. Run `npm run dev` and open http://localhost:3000/#install. Step 1 (map the
   `@cybr` namespace, with the `npx shadcn@latest init` note and the copyable
   `"registries"` snippet) comes before step 2 (`npx shadcn@latest add
   @cybr/all`), at the same size. The `Unknown registry "@cybr"` hint is
   below them.
2. Open http://localhost:3000/docs/components/hard-offset-button. It has the
   same two steps, and the command names `@cybr/hard-offset-button`.
3. Press Tab through the section. "Copy registry setup" is reached before
   "Copy install command", and each copies the same text as before.
4. In a separate Next.js project (after `npx shadcn@latest init`), paste step 1
   into `components.json`, then run step 2. `@cybr/all` installs without the
   `Unknown registry` error.
