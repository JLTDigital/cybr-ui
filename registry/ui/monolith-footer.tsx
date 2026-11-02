import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type MonolithFooterItem = { label: string; href: string } | { text: string };
export type MonolithFooterColumn = { heading: string; items: MonolithFooterItem[] };

// Footer with up to four columns of links or plain text lines over a giant
// wordmark that the footer's bottom and right edges crop. The wordmark is
// decorative and aria-hidden; overflow-hidden keeps it from widening the page.
export function MonolithFooter({
  columns,
  wordmark,
  className,
  ...props
}: Omit<ComponentProps<"footer">, "children"> & {
  columns: MonolithFooterColumn[];
  wordmark?: ReactNode;
}) {
  const id = useId();

  return (
    <footer
      className={cn("relative overflow-hidden bg-ground-deep px-6 pt-5.5 font-mono sm:px-10", className)}
      {...props}
    >
      <div className="grid max-w-225 grid-cols-2 gap-8 sm:grid-cols-4">
        {columns.map((column, i) => (
          <div key={column.heading}>
            <p id={`${id}-${i}`} className="m-0 mb-2 text-caption tracking-[0.16em] text-signal">
              {column.heading}
            </p>
            <ul aria-labelledby={`${id}-${i}`} className="m-0 list-none p-0 text-xs tracking-[0.08em]">
              {column.items.map((entry, j) => (
                <li key={j} className="py-1">
                  {"href" in entry ? (
                    <a
                      href={entry.href}
                      className="text-label hover:text-ink focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal"
                    >
                      {entry.label}
                    </a>
                  ) : (
                    <span className="text-label">{entry.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none mt-10 -mb-[0.12em] -ml-2 font-display text-[clamp(4.5rem,17vw,13.375rem)] leading-[0.8] tracking-[-0.03em] whitespace-nowrap text-ink select-none"
      >
        {wordmark ?? (
          <>
            CYBR<span className="text-signal">{"//"}</span>UI
          </>
        )}
      </div>
    </footer>
  );
}
