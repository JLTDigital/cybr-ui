import { expect, test } from "@playwright/test";

import { FROZEN_TIME, PAGE_TARGETS } from "./pages";

// The project runs with prefers-reduced-motion: reduce. getAnimations() sees CSS and Web
// Animations only; JS-driven motion (canvas, rAF) is caught by the visual spec, whose
// toHaveScreenshot waits for two identical consecutive frames.
for (const target of PAGE_TARGETS) {
  test(`reduced motion: ${target.name}`, async ({ page }) => {
    await page.clock.setFixedTime(FROZEN_TIME);
    await page.goto(target.path);
    await page.evaluate(() => document.fonts.ready);

    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === "running")
        .map((animation) => {
          const target = (animation.effect as KeyframeEffect | null)?.target;
          const name = animation instanceof CSSAnimation ? animation.animationName : animation.id || "web-animation";
          return `${name} on ${target ? `${target.tagName.toLowerCase()}.${target.className}` : "unknown"}`;
        }),
    );

    expect(running, "animations still running under reduced motion").toEqual([]);
  });
}
