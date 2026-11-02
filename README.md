# CYBR//UI

Animated React components in one Cyberpunk Brutalism design language. Hard
edges, offset shadows, mechanical motion. Built for Next.js and Tailwind CSS v4,
and distributed as a [shadcn registry](https://ui.shadcn.com/docs/registry) so
you install the source into your own project and own it from there.

Docs and live previews: **[cybr-ui.com](https://cybr-ui.com)**

## Install

### 1. Map the `@cybr` namespace

Add the registry to your project's `components.json`:

```json
"registries": { "@cybr": "https://cybr-ui.com/r/{name}.json" }
```

### 2. Add components

One at a time (each component's docs page shows its exact name):

```bash
npx shadcn@latest add @cybr/hard-offset-button
```

Or everything at once, with the tokens, effects and helpers they need:

```bash
npx shadcn@latest add @cybr/all
```

Browse every component at [cybr-ui.com/docs/components](https://cybr-ui.com/docs/components).

### 3. Import the tokens and effects

Components use design tokens and shared effect utilities, installed as
`styles/cybr-tokens.css` and `styles/cybr-effects.css`. Import them in
`app/globals.css`, after Tailwind:

```css
@import "tailwindcss";
@import "../styles/cybr-tokens.css";
@import "../styles/cybr-effects.css";
```

### Fonts

Display and UI text fall back to Impact and `ui-monospace` unless you define
`--font-archivo-black` and `--font-jetbrains-mono`. Load both with `next/font`:

```tsx
import { Archivo_Black, JetBrains_Mono } from "next/font/google";

const archivoBlack = Archivo_Black({ weight: "400", variable: "--font-archivo-black", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

// <html className={`${archivoBlack.variable} ${jetbrainsMono.variable}`}>
```

### Theme presets (optional)

Two alternate palettes are available: `@cybr/theme-acid-terminal` and
`@cybr/theme-ice-neon`. Install one, import its CSS after the tokens, then set
`data-theme="acid-terminal"` (or `"ice-neon"`) on `<html>` or on any element to
scope it to that subtree.

### Reduced motion

Every animated component has a static fallback under
`prefers-reduced-motion`.

## Develop

Requires Node.js 22 and npm.

```bash
npm install
npm run dev            # http://localhost:3000
npm run verify         # lint, typecheck, registry build, next build
npm run test:browser   # Playwright (run `npm run build` and `npx playwright install chromium` first)
```

`npm run build` runs `shadcn build` first, which writes the registry JSON to
`public/r/`. Registry items are declared in `registry.json`. Component source
lives in `registry/`, and tokens, effects and theme presets in `styles/`.

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional. Overrides the origin shown in install commands (default `https://cybr-ui.com`). Read at build time. |

## Licence

[MIT](LICENSE) © 2026 JLTDigital and Jonathan Taft
