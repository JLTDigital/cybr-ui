import { expect, test, type Page } from "@playwright/test";

import { ALTERNATE_THEME_IDS, THEME_STORAGE_KEY } from "@/app/_lib/themes";

import { FROZEN_TIME, PAGE_TARGETS } from "./pages";

// Baselines are generated on Linux by the "Update snapshots" workflow; font rendering
// differs on other platforms, so comparisons there would always fail.
test.skip(process.platform !== "linux", "Visual baselines are Linux-only; they run in CI.");

async function openFrozen(page: Page, path: string, theme?: string) {
  await page.clock.setFixedTime(FROZEN_TIME);
  await page.addInitScript(
    ([key, value]) => {
      localStorage.clear();
      if (value) localStorage.setItem(key, value);
    },
    [THEME_STORAGE_KEY, theme ?? ""] as const,
  );
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

for (const target of PAGE_TARGETS) {
  test(`visual: ${target.name}`, async ({ page }) => {
    await openFrozen(page, target.path);
    await expect(page).toHaveScreenshot(`${target.name}.png`, { fullPage: true });
  });
}

for (const theme of ALTERNATE_THEME_IDS) {
  test(`visual: landing (${theme})`, async ({ page }) => {
    await openFrozen(page, "/", theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page).toHaveScreenshot(`landing-${theme}.png`, { fullPage: true });
  });
}
