import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tier. Unit tests live in src/**\/__tests__ and run under
 * Vitest via `npm test`; these browser specs run separately via
 * `npm run test:e2e` because they need a live server.
 *
 * See docs/architectural-notes/MOTION_TEST_PROTOCOL.md for the rules
 * these specs assert.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-pixel", use: { ...devices["Pixel 7"] } },
    { name: "mobile-iphone", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
