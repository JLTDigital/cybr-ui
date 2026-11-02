"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Tab = { id: string; label: string; content: ReactNode };

// WAI-ARIA tabs with automatic activation: arrows and Home/End move and select.
export function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function select(index: number) {
    setActive(index);
    refs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  }

  return (
    <div className="flex flex-col">
      <div role="tablist" aria-label={label} className="flex gap-px self-start bg-line">
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "cursor-pointer px-4 py-2 text-xs tracking-button uppercase",
                "focus-visible:relative focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal",
                selected ? "bg-ink text-ground-deep" : "bg-bg text-label hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="border-(length:--border-base) border-line focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
