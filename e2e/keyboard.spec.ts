import { expect, test } from "@playwright/test";

// Keyboard paths the components already implement. Each test drives the docs demo
// with keys only (focus() stands in for tabbing to the control).

test("Tab moves focus to an element with a visible focus outline", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    return { outline: getComputedStyle(el).outlineStyle, visible: el.getBoundingClientRect().width > 0 };
  });

  expect(focused, "Tab focused nothing").not.toBeNull();
  expect(focused?.visible).toBe(true);
  expect(focused?.outline).not.toBe("none");
});

test("HUD Tooltip opens on focus and closes on Escape", async ({ page }) => {
  await page.goto("/docs/components/hud-tooltip");
  const trigger = page.getByRole("main").getByRole("button", { name: "NODE 07" });

  await trigger.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toBeHidden();
});

test("Classified Accordion toggles with Enter and Space", async ({ page }) => {
  await page.goto("/docs/components/classified-accordion");
  const trigger = page.getByRole("main").getByRole("button", { name: /WHAT DOES IT NEED/ });

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Next.js App Router, React, Tailwind CSS and Motion.")).toBeVisible();

  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("Command Palette opens with the shortcut and Escape returns focus", async ({ page }) => {
  await page.goto("/docs/components/command-palette");
  const trigger = page.getByRole("main").getByRole("button", { name: /SEARCH/ });

  await trigger.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("combobox", { name: "Search commands" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test.describe("Terminal Navbar at a narrow width", () => {
  // The menu toggle only shows when the navbar's container is under 48rem.
  test.use({ viewport: { width: 600, height: 800 } });

  test("menu toggle opens with Enter and closes with Escape", async ({ page }) => {
    await page.goto("/docs/components/terminal-navbar");
    const toggle = page.getByRole("navigation", { name: "Demo" }).getByRole("button", { name: "MENU" });

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: "Demo" }).getByRole("link", { name: "DOCS" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });
});

test("Brutal Mega Menu opens with Enter and closes with Escape", async ({ page }) => {
  await page.goto("/docs/components/mega-menu");
  const trigger = page.getByRole("navigation", { name: "Standalone demo" }).getByRole("button", { name: "COMPONENTS" });

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("Data-Readout Carousel changes slide with arrow keys and the Next button", async ({ page }) => {
  await page.goto("/docs/components/data-readout-carousel");
  const carousel = page.getByRole("region", { name: "SYSTEM READOUT" });
  const slide = (n: number) => carousel.getByRole("group", { name: `${n} of 4` });

  await carousel.getByRole("button", { name: "Next slide" }).focus();
  await page.keyboard.press("Enter");
  await expect(slide(2)).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(slide(3)).toBeVisible();

  await page.keyboard.press("ArrowLeft");
  await expect(slide(2)).toBeVisible();
  await expect(slide(3)).toBeHidden();
});

test("Theme switcher changes the preset from the keyboard", async ({ page }) => {
  await page.goto("/");
  const select = page.getByRole("combobox", { name: "Theme" });

  await select.focus();
  // Typeahead on a focused, closed select picks the matching option without a pointer.
  await page.keyboard.type("Acid");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "acid-terminal");
});
