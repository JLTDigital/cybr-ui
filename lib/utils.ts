import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom scales in styles/tokens.css so token classes
// such as `text-display-md` (size) and `text-signal` (colour) do not cancel out.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-xl", "display-lg", "display-md", "micro", "caption"],
      shadow: ["hard", "hard-hover"],
      tracking: ["label", "button"],
      ease: ["step-2", "step-3", "step-12"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
