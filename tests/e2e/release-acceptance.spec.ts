import { test, expect } from "@playwright/test";

/**
 * Release-critical checks for the three public content routes: /, /collections
 * and /catalogues.
 * These run against the production build in CI; they intentionally avoid
 * creating a real lead in the live database.
 */
test.describe("Release acceptance: public routes and catalogue delivery", () => {
  test("home, collections and catalogues are separate pages", async ({ page }) => {
    const home = await page.goto("/");
    expect(home?.status()).toBe(200);
    await expect(page.locator("body")).toContainText("Hardware Collection");

    const collections = await page.goto("/collections");
    expect(collections?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Architectural Hardware Collections" })).toBeVisible();
    await expect(page.locator("#brand-catalogues")).toHaveCount(0);

    const catalogues = await page.goto("/catalogues");
    expect(catalogues?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/catalogues");
    await expect(page.getByRole("heading", { name: "Brands & Catalogues" })).toBeVisible();
  });

  test("catalogue deep links open the viewer on /catalogues", async ({ page }) => {
    await page.goto("/catalogues?brand=hafele&cat=0&page=1&pages=1&v=000000000000");
    expect(new URL(page.url()).pathname).toBe("/catalogues");
    await expect(page.getByRole("dialog", { name: /Häfele|Hafele/i })).toBeVisible({ timeout: 15000 });
  });

  test("an unknown ?brand= value does not open a viewer or claim a partnership", async ({ page }) => {
    await page.goto("/catalogues?brand=not-a-real-brand");
    await expect(page.getByRole("heading", { name: "Brands & Catalogues" })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByText("not-a-real-brand")).toHaveCount(0);
  });

  test("catalogue endpoint supports byte ranges and rejects stale or unknown assets", async ({ request }) => {
    const rangeResponse = await request.get("/api/catalog/hafele/0", {
      headers: { Range: "bytes=0-1023" },
    });

    // A configured public Sanity dataset with a published Häfele PDF must
    // serve a genuine partial response for PDF.js on mobile Safari/Chromium.
    expect(rangeResponse.status()).toBe(206);
    expect(rangeResponse.headers()["accept-ranges"]).toContain("bytes");
    expect(rangeResponse.headers()["content-range"]).toMatch(/^bytes 0-\d+\//);
    expect(rangeResponse.headers()["content-type"]).toContain("application/pdf");

    const staleResponse = await request.get("/api/catalog/brand-that-does-not-exist/0");
    expect(staleResponse.status()).toBe(404);

    const invalidIndexResponse = await request.get("/api/catalog/hafele/999");
    expect(invalidIndexResponse.status()).toBe(404);
  });

  test("mobile catalogue viewer stays within the viewport and remains usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/catalogues?brand=hafele");
    const dialog = page.getByRole("dialog", { name: /Häfele|Hafele/i });
    await expect(dialog).toBeVisible({ timeout: 15000 });
    const box = await dialog.boundingBox();
    if (!box) throw new Error("Mobile catalogue dialog has no layout box");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.width).toBeLessThanOrEqual(390);
    expect(box.height).toBeLessThanOrEqual(844);
  });

  test("viewer presents a recoverable message when a PDF asset request fails", async ({ page }) => {
    await page.route("**/api/catalog/hafele/0", (route) =>
      route.fulfill({
        status: 502,
        contentType: "text/plain",
        body: "Catalogue temporarily unavailable",
      })
    );
    await page.goto("/catalogues?brand=hafele");
    await expect(page.getByRole("dialog", { name: /Häfele|Hafele/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Catalogue temporarily unavailable.")).toBeVisible({ timeout: 20000 });
  });

  test("contact actions point to the showroom's configured phone, WhatsApp and map destinations", async ({ page }) => {
    await page.goto("/");
    const phone = page.locator('a[href^="tel:"]:visible').first();
    const whatsapp = page.locator('a[href*="wa.me"]:visible').first();
    const map = page.locator('a[href*="maps"]:visible').first();

    await expect(phone).toBeVisible();
    await expect(whatsapp).toBeVisible();
    await expect(map).toBeVisible();
    expect(await phone.getAttribute("href")).toMatch(/^tel:\+/);
    expect(await whatsapp.getAttribute("href")).toMatch(/wa\.me\//);
    expect(await map.getAttribute("href")).toMatch(/maps\.app\.goo\.gl|google\.com\/maps/);
  });
});
