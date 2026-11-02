import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Destructive-action button framed in hazard stripes that march on hover. The
// 34px background-size matches hazard-march's travel, so the loop is seamless.
export function HazardButton({
  className,
  type = "button",
  children,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex cursor-pointer rounded-none p-1.5",
        "font-mono text-[0.9375rem] font-bold uppercase tracking-button",
        "border-0 hazard-stripes bg-size-[34px_34px]",
        "enabled:hover:hazard-march enabled:active:translate-(--offset-hard-hover)",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal",
        "disabled:cursor-not-allowed disabled:border-(length:--border-base) disabled:border-dashed disabled:border-dim disabled:bg-none disabled:bg-surface",
        className,
      )}
      {...props}
    >
      <span className="flex min-h-10 items-center gap-2.5 bg-ground-deep px-5.5 text-ink group-disabled:bg-surface group-disabled:text-label">
        {children}
      </span>
    </button>
  );
}
