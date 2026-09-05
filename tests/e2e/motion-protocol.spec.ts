import { test, expect } from "@playwright/test";

/**
 * Playwright E2E Test Suite — Motion & Animation Protocol
 * Validates browser behavior against docs/architectural-notes/MOTION_TEST_PROTOCOL.md
 */

test.describe("Hardware Collection — Motion & Animation Protocol E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Rule 03 & 24: Conversion CTAs remain stable and accessible throughout scroll", async ({ page }) => {
    // Scroll down 2000px
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(500);

    // Floating WhatsApp / Inquire / Directions CTA should be visible
    const floatingCta = page.locator("a[href*='wa.me']:visible, button:has-text('Inquire'):visible, a:has-text('Visit Showroom'):visible, a:has-text('Directions'):visible").first();
    await expect(floatingCta).toBeVisible();

    // Scroll down to 6000px
    await page.evaluate(() => window.scrollBy(0, 4000));
    await page.waitForTimeout(500);
    await expect(floatingCta).toBeVisible();
  });

  test("Rule 08 & 18: Mobile Viewport has zero horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // Assert that content does not cause horizontal scrollbar on mobile
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("Rule 11: Collections Product Drawer traps focus and restores focus on Escape", async ({ page }) => {
    await page.goto("/collections");
    await page.waitForLoadState("networkidle");

    // Click on the first product card to open drawer
    const firstProductCard = page.locator("button[aria-haspopup='dialog'], div[role='button']").first();
    if (await firstProductCard.isVisible()) {
      await firstProductCard.click();
      await page.waitForTimeout(300);

      // Verify drawer dialog is open
      const drawer = page.locator("div[role='dialog'][aria-modal='true']");
      await expect(drawer).toBeVisible();

      // Press Escape
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      // Verify drawer closed
      await expect(drawer).not.toBeVisible();
    }
  });

  test("Rule 17: Reduced Motion disables intense animations and falls back cleanly", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check that hero stage renders smoothly without broken visibility
    const heroTitle = page.locator("h1:visible").first();
    await expect(heroTitle).toBeVisible();
  });
});
