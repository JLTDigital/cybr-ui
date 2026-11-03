import { CopyButton } from "@/app/docs/_components/copy-button";
import { getRegistryItem, getRegistryOrigin } from "@/app/docs/_lib/registry";

const box =
  "flex items-center justify-between gap-4 border-(length:--border-base) border-line bg-ground-void py-3 pr-3 pl-4";
const step = "flex flex-col gap-2";
const stepLabel = "m-0 max-w-prose text-caption leading-relaxed text-label";

export function InstallCommand({ item }: { item: string }) {
  const { name } = getRegistryItem(item);
  const command = `npx shadcn@latest add @cybr/${name}`;
  const setup = `"registries": { "@cybr": "${getRegistryOrigin()}/r/{name}.json" }`;

  return (
    <section aria-labelledby="install-heading" className="flex flex-col gap-4">
      <h2 id="install-heading" className="text-xs tracking-label uppercase text-label">
        Install
      </h2>
      {/* Setup comes first: without it shadcn fails with Unknown registry "@cybr". */}
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        <li className={step}>
          <p className={stepLabel}>
            <span className="text-signal">1.</span> Map the <code className="text-ink">@cybr</code> namespace,
            once per project. Add this inside your <code className="text-ink">components.json</code>, or into its
            existing <code className="text-ink">&quot;registries&quot;</code> object. No{" "}
            <code className="text-ink">components.json</code> yet? Run{" "}
            <code className="text-ink">npx shadcn@latest init</code> first to create one.
          </p>
          <div className={box}>
            <code className="overflow-x-auto text-sm whitespace-nowrap text-ink">{setup}</code>
            <CopyButton text={setup} label="Copy registry setup" />
          </div>
        </li>
        <li className={step}>
          <p className={stepLabel}>
            <span className="text-signal">2.</span> Add components:
          </p>
          <div className={box}>
            <code className="overflow-x-auto text-sm whitespace-nowrap text-ink">
              <span className="text-signal">$</span> {command}
            </code>
            <CopyButton text={command} label="Copy install command" />
          </div>
        </li>
      </ol>
      <p className={stepLabel}>
        If shadcn reports <code className="text-ink">Unknown registry &quot;@cybr&quot;</code>, step 1 is missing
        from that project&apos;s <code className="text-ink">components.json</code>.
      </p>
    </section>
  );
}
