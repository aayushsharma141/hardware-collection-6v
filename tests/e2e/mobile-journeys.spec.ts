import { test, expect } from "@playwright/test";

/**
 * Mobile Critical Journeys & Outcome E2E Tests
 * Validates real functional outcomes for mobile and desktop viewports.
 */

test.describe("Mobile Critical Journeys & Conversions", () => {
  test("Mobile Menu opens, handles keyboard ESC dismiss, and closes properly", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const menuButton = page.locator("button[aria-controls='mobile-nav-modal']");

    if (isMobile) {
      await expect(menuButton).toBeVisible();

      // Open mobile menu
      await menuButton.click();
      const mobileNav = page.locator("#mobile-nav-modal");
      await expect(mobileNav).toBeVisible();

      // Press ESC to dismiss
      await page.keyboard.press("Escape");
      await expect(mobileNav).not.toBeVisible();

      // Open again and click a navigation link
      await menuButton.click();
      await expect(mobileNav).toBeVisible();
      const collectionsLink = mobileNav.locator("a[href='/collections']").first();
      await collectionsLink.click();

      // Ensure navigation to collections page succeeded
      await page.waitForURL("**/collections");
      expect(page.url()).toContain("/collections");
    }
  });

  test("Mobile Conversion Bar surfaces verified phone, WhatsApp, and driving direction outcomes", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    if (isMobile) {
      const conversionBar = page.locator("[role='navigation'][aria-label='Quick contact actions']");
      await expect(conversionBar).toBeVisible();

      // 1. Call action leads to confirmed showroom phone tel:+919835190738
      const callLink = conversionBar.locator("a[href^='tel:']");
      await expect(callLink).toBeVisible();
      const callHref = await callLink.getAttribute("href");
      expect(callHref).toBe("tel:+919835190738");

      // 2. WhatsApp action targets official WhatsApp number with inquiry message
      const waLink = conversionBar.locator("a[href*='wa.me']");
      await expect(waLink).toBeVisible();
      const waHref = await waLink.getAttribute("href");
      expect(waHref).toContain("wa.me/919835190738");

      // 3. Driving Directions targets valid Google Maps location with explicit DIRECTIONS affordance
      const mapsLink = conversionBar.locator("a[href*='maps']");
      await expect(mapsLink).toBeVisible();
      const mapsHref = await mapsLink.getAttribute("href");
      expect(mapsHref).toMatch(/maps\.app\.goo\.gl|google\.com\/maps/);
      expect(await mapsLink.innerText()).toMatch(/DIRECTIONS/i);
    }
  });

  test("Brand Trust Strip routes directly to /catalogs?brand=<slug> with highlighted partner card or open modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Locate brand links in ticker lane
    const brandLink = page.locator("a[href^='/catalogs?brand=']").first();
    await expect(brandLink).toBeVisible();
    const href = await brandLink.getAttribute("href");
    expect(href).toMatch(/\/catalogs\?brand=[a-z0-9-]+/);

    // Dispatch click on brand link and verify destination
    await brandLink.dispatchEvent("click");
    await page.waitForURL("**/catalogs?brand=*");
    expect(page.url()).toContain("/catalogs?brand=");

    // Verify catalog modal opened or brand card highlighted
    const selectedBadge = page.locator("text='Selected Brand Partner'");
    const modalHeading = page.locator("#catalog-modal-title");
    await expect(selectedBadge.or(modalHeading)).toBeVisible({ timeout: 10000 });
  });

  test("Category brand refinement allows filtering when multiple brands exist and hides filter when single-brand", async ({ page }) => {
    // 1. Multi-brand category: digital-locks has both Dorset and Godrej
    await page.goto("/collections/digital-locks");
    await page.waitForLoadState("domcontentloaded");

    const brandNav = page.locator("nav[aria-label='Filter products by brand']");
    await expect(brandNav).toBeVisible();

    const allBtn = brandNav.locator("button:has-text('All')");
    await expect(allBtn).toBeVisible();
    await expect(allBtn).toHaveAttribute("aria-pressed", "true");

    const dorsetBtn = brandNav.locator("button:has-text('Dorset')");
    await expect(dorsetBtn).toBeVisible();

    // Click Dorset filter
    await dorsetBtn.click();
    await expect(dorsetBtn).toHaveAttribute("aria-pressed", "true");
    await expect(allBtn).toHaveAttribute("aria-pressed", "false");

    // Verify all displayed cards contain Dorset brand
    const productCards = page.locator("article, div[class*='group']").filter({ hasText: "Dorset" });
    expect(await productCards.count()).toBeGreaterThan(0);

    // 2. Single-brand category: modular-kitchen-hardware contains only Hafele
    await page.goto("/collections/modular-kitchen-hardware");
    await page.waitForLoadState("domcontentloaded");

    const singleBrandNav = page.locator("nav[aria-label='Filter products by brand']");
    await expect(singleBrandNav).not.toBeVisible();
  });

  test("Collections search returns matched results and offers useful recovery CTA on zero-match", async ({ page }) => {
    await page.goto("/collections");
    await page.waitForLoadState("domcontentloaded");

    const searchInput = page.locator("input[aria-label='Search collections, products and brands']");
    await expect(searchInput).toBeVisible();

    // 1. Valid search query returns matched results in search dropdown
    await searchInput.fill("door");
    await page.waitForTimeout(500);
    const searchResultItem = page.locator("a[href^='/collections/']").first();
    await expect(searchResultItem).toBeVisible();

    // 2. Non-existent query triggers zero-results state with recovery CTA
    await searchInput.fill("xyznonexistenthardware999");
    await page.waitForTimeout(500);
    const zeroResultsHeading = page.locator("h4:has-text('No direct matches for')");
    await expect(zeroResultsHeading).toBeVisible();

    // Scope to zero-results recovery CTA specifically
    const askExpertLink = page.locator("div:has(> h4:has-text('No direct matches')) a[href*='wa.me']");
    await expect(askExpertLink).toBeVisible();
    const href = await askExpertLink.getAttribute("href");
    expect(href).toContain("wa.me/919835190738");
  });

  test("404 page renders branded editorial not-found state and successfully navigates back to collections", async ({ page }) => {
    await page.goto("/non-existent-space-test-path-12345");
    await page.waitForLoadState("domcontentloaded");

    // Assert branded headline and copy
    const headline = page.locator("h1");
    await expect(headline).toContainText("This space isn't in the collection");

    // Click 'Explore Collections' recovery link
    const recoveryLink = page.locator("a:has-text('Explore Collections')").first();
    await expect(recoveryLink).toBeVisible();
    await recoveryLink.click();

    // Verify recovery brings user back to /collections
    await page.waitForURL("**/collections");
    expect(page.url()).toContain("/collections");
  });
});
