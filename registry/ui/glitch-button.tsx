import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Outlined button whose label splits into two clipped RGB slices on hover. The
// slices are aria-hidden spans, not ::before/::after content, so they never leak
// into the accessible name. They only render when motion is allowed.
export function GlitchButton({
  className,
  type = "button",
  children,
  ...props
}: ComponentProps<"button">) {
  const slice =
    "pointer-events-none absolute inset-0 hidden motion-safe:group-enabled:group-hover:block";

  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-none px-7",
        "font-mono text-[0.9375rem] font-bold uppercase tracking-button",
        "border-(length:--border-base) border-solid border-ink bg-transparent text-ink",
        "enabled:hover:border-signal enabled:active:translate-(--offset-hard-hover)",
        "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-(--focus-offset) focus-visible:outline-solid focus-visible:outline-signal",
        "disabled:cursor-not-allowed disabled:border-dashed disabled:border-dim disabled:bg-surface disabled:text-label",
        className,
      )}
      {...props}
    >
      <span className="relative inline-block">
        {children}
        <span aria-hidden="true" className={cn(slice, "text-signal [clip-path:inset(0_0_55%_0)] glitch-slice-a")}>
          {children}
        </span>
        <span aria-hidden="true" className={cn(slice, "text-neon-2 [clip-path:inset(52%_0_0_0)] glitch-slice-b")}>
          {children}
        </span>
      </span>
    </button>
  );
}
