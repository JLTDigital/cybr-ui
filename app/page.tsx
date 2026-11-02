import { THEMES } from "@/app/_lib/themes";
import { InstallCommand } from "@/app/docs/_components/install-command";
import { CATALOG, CATALOG_ITEMS } from "@/app/docs/_lib/catalog";
import { BentoGrid, BentoGridItem } from "@/registry/ui/bento-grid";
import { BlueprintGrid } from "@/registry/ui/blueprint-grid";
import { GlitchHeading } from "@/registry/ui/glitch-heading";
import { HardOffsetButton } from "@/registry/ui/hard-offset-button";
import { NeonEdgeCard } from "@/registry/ui/neon-edge-card";
import { SegmentedProgress } from "@/registry/ui/segmented-progress";
import { StatBand } from "@/registry/ui/stat-band";
import { TelemetryCounter } from "@/registry/ui/telemetry-counter";
import { TerminalButton } from "@/registry/ui/terminal-button";

const focus =
  "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal";

function SectionLabel({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <h2 id={id} className="text-xs tracking-label uppercase text-label">
      <span className="text-signal">{index}</span> / {title}
    </h2>
  );
}

function DocsLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className={`mt-auto self-start text-caption tracking-label uppercase text-signal underline underline-offset-4 ${focus}`}
    >
      {children} →
    </a>
  );
}

export default function Home() {
  return (
    <main id="main" className="flex flex-col">
      <BlueprintGrid className="border-b-(length:--border-base) border-line">
        <div className="flex flex-col gap-8 px-6 py-20 sm:px-10 sm:py-28">
          <p className="m-0 text-xs tracking-label uppercase text-label">
            CYBR//UI · SHADCN REGISTRY · REV 0.1 · SYS:OK
          </p>
          <GlitchHeading as="h1" className="text-display-lg sm:text-display-xl">
            Cyberpunk
            <br />
            Brutalism<span className="text-signal">_</span>
          </GlitchHeading>
          <p className="m-0 max-w-xl text-base leading-relaxed text-ink">
            Animated React components for Next.js and Tailwind. Hard edges, offset shadows, mechanical motion. Copy
            the source or install one at a time with the shadcn CLI.
          </p>
          <a
            href="/docs/components"
            className={`self-start border-(length:--border-heavy) border-ink bg-signal px-6 py-4 text-sm font-bold tracking-button uppercase text-ground-deep shadow-hard transition-[translate,box-shadow] duration-(--duration-fast) ease-step-2 hover:translate-x-(--offset-hard-hover) hover:translate-y-(--offset-hard-hover) hover:shadow-hard-hover motion-reduce:transition-none ${focus}`}
          >
            Browse components →
          </a>
        </div>
      </BlueprintGrid>

      <StatBand
        stats={[
          { value: CATALOG_ITEMS.length, label: "COMPONENTS" },
          { value: CATALOG.length, label: "SETS" },
          { value: THEMES.length, label: "THEME PRESETS" },
        ]}
      />

      <div className="flex flex-col gap-20 px-6 py-16 sm:px-10">
        <div id="install" className="flex scroll-mt-6 flex-col gap-4">
          <InstallCommand item="all" />
          <p className="m-0 max-w-prose text-caption leading-relaxed text-label">
            Installs all {CATALOG_ITEMS.length} components with the tokens, effects and helpers they need. To add
            one at a time, pick it from the{" "}
            <a href="/docs/components" className={`text-signal underline underline-offset-4 ${focus}`}>
              component index
            </a>{" "}
            and use the install command on its page.
          </p>
        </div>

        <section aria-labelledby="sets-heading" className="flex flex-col gap-6">
          <SectionLabel id="sets-heading" index="01" title="Sets" />
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {CATALOG.map((set) => (
              <li key={set.id} className="flex">
                <NeonEdgeCard
                  href={`/docs/components#${set.id}`}
                  eyebrow={`${set.code} · ${set.items.length} UNITS`}
                  title={set.label}
                  cta="VIEW SET →"
                  className="w-full"
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="specimens-heading" className="flex flex-col gap-6">
          <SectionLabel id="specimens-heading" index="02" title="Live specimens" />
          <BentoGrid>
            <BentoGridItem span={2}>
              <span className="text-caption tracking-label uppercase text-label">BTN-01 · BTN-04</span>
              <div className="flex flex-wrap items-center gap-8 py-4">
                <HardOffsetButton>Deploy now</HardOffsetButton>
                <TerminalButton>run --build</TerminalButton>
              </div>
              <div className="flex flex-wrap gap-6">
                <DocsLink href="/docs/components/hard-offset-button">Hard-Offset Button</DocsLink>
                <DocsLink href="/docs/components/terminal-button">Terminal Button</DocsLink>
              </div>
            </BentoGridItem>
            <BentoGridItem>
              <span className="text-caption tracking-label uppercase text-label">TXT-04 · UPTIME HRS</span>
              <TelemetryCounter value={8760} className="font-display text-display-md" />
              <DocsLink href="/docs/components/telemetry-counter">Telemetry Counter</DocsLink>
            </BentoGridItem>
            <BentoGridItem>
              <span className="text-caption tracking-label uppercase text-label">NAV-06</span>
              <SegmentedProgress value={72} label="UPLINK" phase="SYNCING" />
              <DocsLink href="/docs/components/segmented-progress">Segmented Progress</DocsLink>
            </BentoGridItem>
          </BentoGrid>
        </section>
      </div>
    </main>
  );
}
