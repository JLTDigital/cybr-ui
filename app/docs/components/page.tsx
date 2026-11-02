import type { Metadata } from "next";

import { ComponentIndex } from "@/app/docs/_components/component-index";
import { CATALOG, CATALOG_ITEMS } from "@/app/docs/_lib/catalog";

export const metadata: Metadata = {
  title: "Components · CYBR//UI",
  description: "Every CYBR//UI component, grouped by set and searchable.",
};

export default function ComponentsIndexPage() {
  return (
    <>
      <header className="flex flex-col gap-4 border-b-(length:--border-base) border-line pb-8">
        <p className="m-0 text-caption tracking-label uppercase text-label">
          INDEX · {CATALOG_ITEMS.length} UNITS · {CATALOG.length} SETS
        </p>
        <h1 className="font-display text-display-md uppercase">
          Components<span className="text-signal">_</span>
        </h1>
        <p className="m-0 max-w-prose text-sm leading-relaxed text-ink">
          Every component in the library, grouped by set. Each one installs on its own with the shadcn CLI.
        </p>
      </header>
      <ComponentIndex sets={CATALOG} />
    </>
  );
}
