import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

const GLYPHS = "01#%&@$*<>/\\|=+ΞΣ¥ア";

// Deterministic, so server and client markup always match.
function rainColumn(i: number) {
  const length = 14 + ((i * 7) % 12);
  let text = "";
  for (let j = 0; j < length; j++) {
    text += GLYPHS[(i * 13 + j * 5) % GLYPHS.length];
  }
  return {
    text,
    opacity: 0.25 + ((i * 3) % 5) * 0.12,
    duration: `${(3 + ((i * 5) % 7) * 0.6).toFixed(1)}s`,
    delay: `${(-((i * 11) % 9) * 0.5).toFixed(1)}s`,
  };
}

// Falling glyph columns in --label, with one --signal column, fading out into
// --ground-void at the bottom. Purely decorative: the whole layer is
// aria-hidden and sits behind the children. Under reduced motion the columns
// rest at the top.
export function DataRain({
  columns = 18,
  signalColumn = 7,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { columns?: number; signalColumn?: number }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-ground-void", className)} {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 font-mono text-sm leading-[1.15]">
        {Array.from({ length: columns }, (_, i) => {
          const column = rainColumn(i);
          const signal = i === signalColumn;
          return (
            <span
              key={i}
              className={cn("data-rain absolute top-0 w-3.5 break-all", signal ? "text-signal" : "text-label")}
              style={
                {
                  left: `calc(${i} * 100% / ${columns} + 4px)`,
                  opacity: signal ? 1 : column.opacity,
                  "--rain-duration": column.duration,
                  "--rain-delay": column.delay,
                } as CSSProperties
              }
            >
              {column.text}
            </span>
          );
        })}
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-ground-void" />
      </div>
      {children}
    </div>
  );
}
