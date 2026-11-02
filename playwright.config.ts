import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

// Runs against the production server on port 3100 (clear of `next dev` on 3000):
// `npm run build` first, then `npm run test:browser`.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        reducedMotion: "reduce",
      },
    },
  ],
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !isCI,
  },
});
