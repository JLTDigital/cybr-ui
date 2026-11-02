"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { useId, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type MegaMenuColumn = { heading: string; links: { label: string; href: string }[] };
export type MegaMenuFeature = { eyebrow: string; title: string; href: string };

const focus =
  "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-[-3px] focus-visible:outline-solid focus-visible:outline-signal";

// One navigation trigger that opens a hairline grid of link columns plus an
// optional hazard-striped promo tile, on Base UI's NavigationMenu. The root is
// a <div>, not a <nav>, so it can sit inside a TerminalNavbar (or your own
// <nav>) without a nested landmark. Panels open and close instantly.
export function MegaMenu({
  label,
  columns,
  feature,
  className,
  render = <div />,
  ...props
}: Omit<NavigationMenu.Root.Props, "className" | "children"> & {
  label: ReactNode;
  columns: MegaMenuColumn[];
  feature?: MegaMenuFeature;
  className?: string;
}) {
  const id = useId();
  const cells = columns.length + (feature ? 1 : 0);

  return (
    <NavigationMenu.Root render={render} className={cn("flex font-mono", className)} {...props}>
      <NavigationMenu.List className="m-0 flex grow list-none p-0">
        <NavigationMenu.Item className="flex grow">
          <NavigationMenu.Trigger
            className={cn(
              "group flex min-h-15.5 grow cursor-pointer items-center gap-2.5 border-0 border-l-(length:--border-base) border-line bg-transparent px-5 text-[0.8125rem] font-bold tracking-label whitespace-nowrap text-label hover:bg-bg hover:text-ink data-popup-open:bg-bg data-popup-open:text-ink",
              focus,
            )}
          >
            {label}
            <span aria-hidden="true" className="text-signal">
              <span className="group-data-popup-open:hidden">+</span>
              <span className="hidden group-data-popup-open:inline">−</span>
            </span>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            className="grid w-[min(72rem,calc(100vw-2rem))] grid-cols-1 gap-(--border-base) bg-line sm:grid-cols-2 lg:grid-cols-(--mega-cells)"
            style={{ "--mega-cells": `repeat(${cells}, minmax(0, 1fr))` } as CSSProperties}
          >
            {columns.map((column, i) => (
              <div key={column.heading} className="bg-bg px-6 py-4.5">
                <p
                  id={`${id}-${i}`}
                  className={cn(
                    "m-0 mb-2 border-b-(length:--border-base) pb-1.5 text-caption font-bold tracking-[0.16em] text-ink",
                    i === 0 ? "border-signal" : "border-line",
                  )}
                >
                  {column.heading}
                </p>
                <ul aria-labelledby={`${id}-${i}`} className="m-0 list-none p-0">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <NavigationMenu.Link
                        href={link.href}
                        className={cn("block py-1.25 text-xs tracking-[0.08em] text-label hover:text-signal", focus)}
                      >
                        {link.label}
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {feature && (
              <NavigationMenu.Link
                href={feature.href}
                className={cn("flex min-h-32 bg-bg p-3.5 hazard-stripes", focus)}
              >
                <span className="flex grow flex-col justify-between gap-4 bg-ground-deep px-4 py-3.5 text-ink">
                  <span className="text-micro tracking-[0.16em] text-label">{feature.eyebrow}</span>
                  <span className="font-display text-[1.375rem] leading-[0.95]">{feature.title}</span>
                </span>
              </NavigationMenu.Link>
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          side="bottom"
          align="start"
          collisionPadding={16}
          className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)"
        >
          <NavigationMenu.Popup className="h-(--popup-height) w-(--popup-width) border-(length:--border-base) border-line bg-line outline-none">
            <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
