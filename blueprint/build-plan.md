# Build Plan: Cyberpunk Brutalism UI Library

> Rough build order. One line each; the details come later in `/feature`.
> Visual reference for every component: [design mockups canvas](https://claude.ai/artifact/CbDg2ZHiJ3VsDc6iSdTdzx). The palette is provisional, so use tokens only.

## Your features

- [x] 1. **Design tokens & fonts** - Provisional palette, type scale, borders, hard-shadow offsets and motion timings as CSS variables + Tailwind v4 theme, with Archivo Black + JetBrains Mono via `next/font`
- [x] 2. **Shared effects & motion helpers** - Reusable scanline, grain, HUD-corner, crosshair, hazard-stripe and glitch utilities, plus `cn()` and a `useReducedMotion` fallback
- [x] 3. **First component end-to-end (Hard-Offset Button)** - Build it, add it to `registry.json`, run `shadcn build`, and confirm `npx shadcn add` installs it into a clean Next.js app
- [x] 4. **Docs component page template** - Live preview, props table, code tab, copy-install and copy-source buttons, and accessibility notes, reused for every component
- [x] 5. **Buttons set** - Glitch, HUD Bracket, Terminal and Hazard buttons, plus documented idle/hover/pressed/disabled states
- [x] 6. **Text & Motion set** - Decrypt Text, Typewriter Terminal, Glitch Heading, Telemetry Counter (counts on scroll into view) and Stepped Wipe Reveal
- [x] 7. **Layout & Cards set** - Brutal Bento Grid, Spec Card, Access/ID Card, Hardware Panel, HUD Image Frame, Neon Edge Card, Classified Card and Stat Band
- [x] 8. **Accessible primitives decision + Tooltip & Marquee set** - Pick Radix or Base UI, then HUD Tooltip, Classified FAQ Accordion, Ticker Marquee, Warning Tape and Logo Wall
- [ ] 9. **Backgrounds set** - Blueprint Grid, Perspective Grid, Béton Brut, CRT Overlay, Data Rain and Exposed Wiring, all in CSS/SVG
- [ ] 10. **Navbar, Footer & Loader set** - Status Bar, Terminal Navbar, Brutal Mega Menu, Monolith Footer, Boot Sequence Loader and Segmented Progress
- [ ] 11. **Interactive set** - Command Palette (⌘K), Pixelated Image Trail and Data-Readout Carousel
- [ ] 12. **Theme presets & switching** - Lock the final palette, add 1–2 alternate presets, and check every component swaps cleanly and passes contrast
- [ ] 13. **Docs site built with the library** - Landing page, component index and search, using its own components as the showcase
- [ ] 14. **Quality gates in CI** - Lint, type-check, registry build, Playwright visual snapshots and reduced-motion and keyboard checks on every PR
- [ ] 15. **Launch** - Choose the name and domain, set the licence, deploy to Vercel, and publish the README and install docs

## Later (post-MVP, not in v1)

- [ ] 16. **Blocks & page templates** - Landing, portfolio, pricing and 404 pages in a separate registry namespace, ready for a possible paid tier
- [ ] 17. **Form primitives** - Inputs, selects, checkboxes and toggles in the same style
- [ ] 18. **3D pieces** - React Three Fiber wireframe and low-poly components as opt-in installs
- [ ] 19. **Theme builder** - Docs-site tool that generates a token file from chosen colours
- [ ] 20. **Figma kit** - The tokens and components as a Figma library
