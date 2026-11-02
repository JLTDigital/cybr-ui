import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

// Hairline logo grid: a label cell, then equal logo cells. 2 columns on small
// screens, 3 from sm, and one row from lg. Gaps over a --line parent become the
// borders.
export function LogoWall({ label, className, children, ...props }: ComponentProps<"div"> & { label?: ReactNode }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-(--border-base) border-b-(length:--border-base) border-line bg-line font-mono sm:grid-cols-3 lg:flex",
        className,
      )}
      {...props}
    >
      {label ? (
        <div className="col-span-full flex items-center bg-bg px-8 py-4 text-xs tracking-label text-label lg:w-55 lg:shrink-0">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}

// One logo cell. Renders a link when `href` is set, otherwise a plain cell.
// Logo images and their alt text are the caller's.
export function LogoWallItem({ href, className, children, ...props }: ComponentProps<"a">) {
  const cell = cn(
    "flex w-full items-center justify-center border-(length:--border-base) border-transparent text-xs font-bold tracking-[0.16em] text-label no-underline",
    href &&
      "transition-colors duration-(--duration-snap) ease-step-2 hover:border-signal hover:text-signal focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-[-3px] focus-visible:outline-signal motion-reduce:transition-none",
    className,
  );

  return (
    <div className="flex min-h-18 bg-bg lg:h-24 lg:min-w-0 lg:flex-1">
      {href ? (
        <a href={href} className={cell} {...props}>
          {children}
        </a>
      ) : (
        <div className={cell}>{children}</div>
      )}
    </div>
  );
}
