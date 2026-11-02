import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Stat = { value: ReactNode; label: ReactNode };

// Signal-coloured band of big numbers. The 2px gaps over a ground-deep parent
// draw the rules, so they stay correct wherever the stats wrap. Each label is
// the <dt> and comes first in the DOM; flex-col-reverse puts the value on top.
export function StatBand({
  stats,
  className,
  ...props
}: Omit<ComponentProps<"dl">, "children"> & { stats: Stat[] }) {
  return (
    <dl
      className={cn("flex flex-wrap gap-(--border-base) bg-ground-deep", className)}
      {...props}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-1 basis-48 flex-col-reverse bg-signal px-8 py-5 text-ground-deep"
        >
          <dt className="mt-1.5 font-mono text-caption font-bold tracking-label">{stat.label}</dt>
          <dd className="font-display text-5xl [line-height:0.9]">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
