// Docs-only theme presets. The default palette lives on :root; alternates apply under [data-theme].

export const THEMES = [
  { id: "default", label: "Default" },
  { id: "acid-terminal", label: "Acid Terminal" },
  { id: "ice-neon", label: "Ice Neon" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_STORAGE_KEY = "cybr-theme";

export const ALTERNATE_THEME_IDS: readonly string[] = THEMES.filter((t) => t.id !== "default").map((t) => t.id);

// Runs in <head> before first paint. Applies a saved preset only when it is a known alternate.
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(ALTERNATE_THEME_IDS)}.indexOf(t)!==-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
