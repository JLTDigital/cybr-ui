import { readdirSync } from "node:fs";
import path from "node:path";

const COMPONENT_DOCS_DIR = path.join(process.cwd(), "app/docs/components");

// One entry per docs route, read from the filesystem so a new component page is covered automatically.
export const COMPONENT_SLUGS: string[] = readdirSync(COMPONENT_DOCS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && readdirSync(path.join(COMPONENT_DOCS_DIR, entry.name)).includes("page.mdx"))
  .map((entry) => entry.name)
  .sort();

export type PageTarget = { name: string; path: string };

export const PAGE_TARGETS: PageTarget[] = [
  { name: "landing", path: "/" },
  { name: "component-index", path: "/docs/components" },
  ...COMPONENT_SLUGS.map((slug) => ({ name: `component-${slug}`, path: `/docs/components/${slug}` })),
];

// A fixed instant for every run, so the Status Bar's live UTC clock renders the same text.
export const FROZEN_TIME = new Date("2026-01-01T00:00:00Z");
