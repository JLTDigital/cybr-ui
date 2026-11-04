import { readFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";
import { codeToHtml, createCssVariablesTheme } from "shiki";

import { getRegistryItem } from "@/app/docs/_lib/registry";

const REGISTRY_DIR = "registry/";

const theme = createCssVariablesTheme({ name: "cybr-tokens", variablePrefix: "--shiki-" });

// Repo source for a registry item, as shown in the Code tab. A missing file
// throws, so a broken registry path fails the build instead of rendering.
export async function getItemSource(item: string): Promise<string> {
  "use cache";
  cacheLife("max");
  const file = getRegistryItem(item).files[0].path;
  if (!file.startsWith(REGISTRY_DIR)) {
    throw new Error(`Registry source must live under ${REGISTRY_DIR}: ${file}`);
  }
  // Scoped to registry/ so output tracing doesn't pull in the whole project.
  return readFile(path.join(process.cwd(), "registry", file.slice(REGISTRY_DIR.length)), "utf8");
}

export async function highlight(code: string, lang: "tsx" | "css" = "tsx"): Promise<string> {
  "use cache";
  cacheLife("max");
  return codeToHtml(code, { lang, theme });
}
