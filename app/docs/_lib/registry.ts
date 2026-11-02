import registry from "@/registry.json";

export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  files: { path: string }[];
};

// Throws on an unknown name so a typo in a docs page fails the build.
export function getRegistryItem(name: string): RegistryItem {
  const item = registry.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Unknown registry item: ${name}`);
  }
  return item;
}

// NEXT_PUBLIC_SITE_URL overrides the production origin at build time; no trailing slash.
export function getRegistryOrigin(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  return override || registry.homepage;
}
