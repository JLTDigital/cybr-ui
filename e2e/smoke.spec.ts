import { expect, test } from "@playwright/test";

test("landing page responds", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("registry index is served as JSON", async ({ request }) => {
  const response = await request.get("/r/registry.json");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.items)).toBe(true);
});
