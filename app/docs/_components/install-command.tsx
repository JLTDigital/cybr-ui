import { CopyButton } from "@/app/docs/_components/copy-button";
import { getRegistryItem, getRegistryOrigin } from "@/app/docs/_lib/registry";

export function InstallCommand({ item }: { item: string }) {
  const { name } = getRegistryItem(item);
  const command = `npx shadcn@latest add @cybr/${name}`;
  const setup = `"registries": { "@cybr": "${getRegistryOrigin()}/r/{name}.json" }`;

  return (
    <section aria-labelledby="install-heading" className="flex flex-col gap-4">
      <h2 id="install-heading" className="text-xs tracking-label uppercase text-label">
        Install
      </h2>
      <div className="flex items-center justify-between gap-4 border-(length:--border-base) border-line bg-ground-void py-3 pr-3 pl-4">
        <code className="overflow-x-auto text-sm whitespace-nowrap text-ink">
          <span className="text-signal">$</span> {command}
        </code>
        <CopyButton text={command} label="Copy install command" />
      </div>
      <p className="max-w-prose text-caption leading-relaxed text-label">
        One-time setup: map the <code className="text-ink">@cybr</code> namespace in your{" "}
        <code className="text-ink">components.json</code>.
      </p>
      <div className="flex items-center justify-between gap-4 border-(length:--border-hair) border-line bg-ground-void py-2 pr-3 pl-4">
        <code className="overflow-x-auto text-xs whitespace-nowrap text-ink">{setup}</code>
        <CopyButton text={setup} label="Copy registry setup" />
      </div>
    </section>
  );
}
