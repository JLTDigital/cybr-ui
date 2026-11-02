import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Static class map so Tailwind sees every span. Spans of 3 and 4 fill the row
// at the 2-column breakpoint, then take their full width from lg.
const SPAN = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
} as const;

// Grid whose 2px gaps over a line-coloured parent become the borders: 1 column,
// then 2 from sm, then 4 from lg.
export function BentoGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-(--border-base) border-(length:--border-base) border-solid border-line bg-line sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

export function BentoGridItem({
  span = 1,
  className,
  ...props
}: ComponentProps<"div"> & { span?: 1 | 2 | 3 | 4 }) {
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-3.5 bg-bg px-7 py-8 sm:px-8", SPAN[span], className)}
      {...props}
    />
  );
}
