import registry from "@/registry.json";

import { getRegistryItem } from "@/app/docs/_lib/registry";

export type CatalogItem = {
  name: string;
  title: string;
  description: string;
  code: string;
  href: string;
};

export type CatalogSet = {
  id: string;
  label: string;
  code: string;
  items: CatalogItem[];
};

// The component sets in build-plan order. Only registry:ui items belong here;
// tokens, themes, effects and hooks have no docs page.
const SETS = [
  {
    id: "buttons",
    label: "Buttons",
    code: "BTN",
    items: ["hard-offset-button", "glitch-button", "hud-bracket-button", "terminal-button", "hazard-button"],
  },
  {
    id: "text-motion",
    label: "Text & Motion",
    code: "TXT",
    items: ["decrypt-text", "typewriter-terminal", "glitch-heading", "telemetry-counter", "stepped-wipe-reveal"],
  },
  {
    id: "layout-cards",
    label: "Layout & Cards",
    code: "CRD",
    items: [
      "bento-grid",
      "spec-card",
      "access-card",
      "hardware-panel",
      "hud-image-frame",
      "neon-edge-card",
      "classified-card",
      "stat-band",
    ],
  },
  {
    id: "tooltip-marquee",
    label: "Tooltip & Marquee",
    code: "TIP",
    items: ["hud-tooltip", "classified-accordion", "ticker-marquee", "warning-tape", "logo-wall"],
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    code: "BG",
    items: ["blueprint-grid", "perspective-grid", "beton-brut", "crt-overlay", "data-rain", "exposed-wiring"],
  },
  {
    id: "navigation-loaders",
    label: "Navigation & Loaders",
    code: "NAV",
    items: [
      "status-bar",
      "terminal-navbar",
      "mega-menu",
      "monolith-footer",
      "boot-sequence-loader",
      "segmented-progress",
    ],
  },
  {
    id: "interactive",
    label: "Interactive",
    code: "INT",
    items: ["command-palette", "pixelated-image-trail", "data-readout-carousel"],
  },
];

function buildCatalog(): CatalogSet[] {
  const sets = SETS.map((set) => ({
    id: set.id,
    label: set.label,
    code: set.code,
    items: set.items.map((name, i) => {
      // Throws on an unknown name.
      const { title, description } = getRegistryItem(name);
      return {
        name,
        title,
        description,
        code: `${set.code}-${String(i + 1).padStart(2, "0")}`,
        href: `/docs/components/${name}`,
      };
    }),
  }));

  // Every UI item appears exactly once, so a new component cannot ship without
  // an index entry.
  const listed = sets.flatMap((set) => set.items.map((item) => item.name));
  const duplicate = listed.find((name, i) => listed.indexOf(name) !== i);
  if (duplicate) {
    throw new Error(`Catalog lists ${duplicate} twice`);
  }
  const missing = registry.items
    .filter((item) => item.type === "registry:ui" && !listed.includes(item.name))
    .map((item) => item.name);
  if (missing.length > 0) {
    throw new Error(`Catalog is missing registry:ui items: ${missing.join(", ")}`);
  }

  // The @cybr/all bundle must install exactly the catalogued components.
  const bundle = registry.items.find((item) => item.name === "all");
  const bundled = (bundle?.registryDependencies ?? []).map((dep) => dep.replace(/^@cybr\//, ""));
  const notBundled = listed.filter((name) => !bundled.includes(name));
  const extra = bundled.filter((name) => !listed.includes(name));
  if (!bundle || notBundled.length > 0 || extra.length > 0) {
    throw new Error(
      `@cybr/all must list every component. Missing: ${notBundled.join(", ") || "none"}; unexpected: ${extra.join(", ") || "none"}`,
    );
  }

  return sets;
}

export const CATALOG: CatalogSet[] = buildCatalog();

export const CATALOG_ITEMS: CatalogItem[] = CATALOG.flatMap((set) => set.items);
