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

export function getRegistryOrigin(): string {
  return registry.homepage;
}
