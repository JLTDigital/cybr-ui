import type { ReactNode } from "react";

import { CodeBlock } from "@/app/docs/_components/code-block";
import { CopyButton } from "@/app/docs/_components/copy-button";
import { Tabs } from "@/app/docs/_components/tabs";
import { getRegistryItem } from "@/app/docs/_lib/registry";
import { getItemSource } from "@/app/docs/_lib/source";

export async function ComponentPreview({ item, children }: { item: string; children: ReactNode }) {
  const { title, files } = getRegistryItem(item);
  const source = await getItemSource(item);

  const preview = (
    <div className="relative grain flex min-h-72 items-center justify-center bg-surface p-12 crosshair">
      {children}
    </div>
  );

  const code = (
    <div className="flex flex-col bg-ground-void">
      <div className="flex items-center justify-between gap-4 border-b-(length:--border-hair) border-line py-2 pr-3 pl-4">
        <span className="text-caption text-label">{files[0].path}</span>
        <CopyButton text={source} label="Copy source" />
      </div>
      <CodeBlock code={source} />
      <p className="border-t-(length:--border-hair) border-line px-4 py-2 text-caption text-label">
        Repo source. The shadcn CLI rewrites import aliases to match your project.
      </p>
    </div>
  );

  return (
    <section aria-labelledby="preview-heading" className="flex flex-col gap-4">
      <h2 id="preview-heading" className="text-xs tracking-label uppercase text-label">
        Preview
      </h2>
      <Tabs
        label={`${title} preview and code`}
        tabs={[
          { id: "preview", label: "Preview", content: preview },
          { id: "code", label: "Code", content: code },
        ]}
      />
    </section>
  );
}
