"use client";

import { useId, useSyncExternalStore } from "react";

import { ALTERNATE_THEME_IDS, THEME_STORAGE_KEY, THEMES, type ThemeId } from "@/app/_lib/themes";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeId {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme && ALTERNATE_THEME_IDS.includes(theme) ? (theme as ThemeId) : "default";
}

function getServerSnapshot(): ThemeId {
  return "default";
}

function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  if (theme === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);

  // Storage can be blocked; the theme still applies for this visit.
  try {
    if (theme === "default") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

// `labelClassName` lets a cramped host hide the visible label; keep it in the
// accessibility tree (sr-only) so the select stays named.
export function ThemeSwitcher({ labelClassName }: { labelClassName?: string }) {
  const id = useId();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className={cn("text-micro tracking-label uppercase text-label", labelClassName)}>
        Theme
      </label>
      <select
        id={id}
        value={theme}
        onChange={(event) => applyTheme(event.target.value as ThemeId)}
        className="cursor-pointer rounded-none border-(length:--border-base) border-line bg-ground-deep px-2 py-1 text-micro tracking-label uppercase text-ink focus-visible:outline-(length:--focus-width) focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-signal"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
