import { getRegistryItem } from "@/app/docs/_lib/registry";

export function ComponentDocHeader({ item }: { item: string }) {
  const { name, title, description } = getRegistryItem(item);

  return (
    <header className="flex flex-col gap-4 border-b-(length:--border-base) border-line pb-8">
      <p className="text-xs tracking-label uppercase text-label">
        COMPONENT / <span className="text-ink">{name}</span>
      </p>
      <h1 className="font-display text-display-md uppercase">
        {title}
        <span className="text-signal">_</span>
      </h1>
      <p className="max-w-prose text-sm leading-relaxed text-ink">{description}</p>
    </header>
  );
}
