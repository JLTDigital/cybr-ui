import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

// Signal floor grid tilted toward a glowing horizon at 46% height, scrolling
// toward the viewer. Desaturated ground, no sunset gradient. The layers are
// aria-hidden and sit behind the children. Static under reduced motion.
export function PerspectiveGrid({
  cellSize = 48,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { cellSize?: number }) {
  const line = (to: string) =>
    `linear-gradient(${to}, var(--signal) var(--border-base), transparent var(--border-base))`;
  const floor = {
    "--perspective-cell": `${cellSize}px`,
    backgroundImage: `${line("to bottom")}, ${line("to right")}`,
    backgroundSize: `${cellSize}px ${cellSize}px`,
    transform: "rotateX(64deg)",
    maskImage: "linear-gradient(to bottom, transparent, black 35%)",
  } as CSSProperties;

  return (
    <div className={cn("relative isolate overflow-hidden bg-ground-void", className)} {...props}>
      {/* Perspective lives on this layer, not in the floor's transform: Chrome otherwise paints the tilted floor over the children. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 perspective-[240px] perspective-origin-[50%_46%]"
      >
        <div className="absolute inset-x-0 top-[46%] h-(--border-base) bg-signal shadow-[0_0_18px_var(--signal)]" />
        <div className="perspective-scroll absolute inset-x-[-60%] top-[46%] h-[120%] origin-top opacity-60" style={floor} />
      </div>
      {children}
    </div>
  );
}
