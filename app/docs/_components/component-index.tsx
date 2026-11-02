"use client";

import { useId, useRef, useState } from "react";

import type { CatalogSet } from "@/app/docs/_lib/catalog";
import { NeonEdgeCard } from "@/registry/ui/neon-edge-card";

const focus =
  "focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal";

export function ComponentIndex({ sets }: { sets: CatalogSet[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const needle = query.trim().toLowerCase();
  const results = sets
    .map((set) => ({
      ...set,
      items: needle
        ? set.items.filter((item) =>
            [item.title, item.name, item.description, set.label].some((field) =>
              field.toLowerCase().includes(needle),
            ),
          )
        : set.items,
    }))
    .filter((set) => set.items.length > 0);
  const total = sets.reduce((sum, set) => sum + set.items.length, 0);
  const shown = results.reduce((sum, set) => sum + set.items.length, 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <label htmlFor={inputId} className="text-caption tracking-label uppercase text-label">
          Search components
        </label>
        <div className="flex items-center gap-3 border-(length:--border-base) border-line bg-ground-void px-4 focus-within:border-signal">
          <span aria-hidden="true" className="text-signal">
            &gt;
          </span>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="glitch, card, grid…"
            autoComplete="off"
            className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-label focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>
        <p aria-live="polite" className="m-0 text-caption tracking-label uppercase text-label">
          {shown} / {total} COMPONENTS
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border-(length:--border-base) border-dashed border-line px-6 py-10">
          <p className="m-0 text-sm tracking-label uppercase text-ink">NO MATCH FOR &quot;{query.trim()}&quot;</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className={`cursor-pointer border-(length:--border-base) border-line bg-ground-deep px-4 py-2 text-caption tracking-label uppercase text-ink hover:border-signal ${focus}`}
          >
            Clear search
          </button>
        </div>
      ) : (
        results.map((set) => (
          <section key={set.id} id={set.id} aria-labelledby={`${set.id}-heading`} className="flex scroll-mt-6 flex-col gap-4">
            <h2 id={`${set.id}-heading`} className="text-xs tracking-label uppercase text-label">
              <span className="text-signal">{set.code}</span> / {set.label}
            </h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {set.items.map((item) => (
                <li key={item.name} className="flex">
                  <NeonEdgeCard
                    href={item.href}
                    eyebrow={item.code}
                    title={item.title}
                    cta={
                      <span className="flex flex-col gap-3">
                        <span className="text-xs leading-relaxed tracking-normal text-label normal-case">
                          {item.description}
                        </span>
                        <span>OPEN DOCS →</span>
                      </span>
                    }
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
