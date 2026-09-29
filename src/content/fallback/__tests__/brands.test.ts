import { describe, it, expect } from "vitest";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/content/fallback/catalog";

describe("Canonical brand roster (D-05/D-07/D-26)", () => {
  it("has every brand referenced in CATEGORIES.brands and PRODUCTS.brand present in BRANDS", () => {
    const brandNames = new Set(BRANDS.map((b) => b.name.toLowerCase()));

    const referenced = new Set<string>();
    CATEGORIES.forEach((cat) => {
      (cat.brands || []).forEach((name) => referenced.add(name));
    });
    PRODUCTS.forEach((prod) => {
      if (prod.brand) referenced.add(prod.brand);
    });

    const missingNames = Array.from(referenced).filter(
      (name) => !brandNames.has(name.toLowerCase())
    );

    // EXPECTED RED today: "Hettich" is referenced by CATEGORIES/PRODUCTS
    // but absent from BRANDS. This goes green once 09-04 reconciles the roster.
    expect(missingNames).toEqual([]);
  });

  it("does not include the non-hardware brands rejected by D-26", () => {
    const nonHardwareBrands = ["Jaquar", "Asian Paints", "Philips"];
    const hasNonHardwareBrand = BRANDS.some((b) =>
      nonHardwareBrands.includes(b.name)
    );

    // Passes vacuously today — these three names are only present in
    // BrandTrustStrip.tsx, not in src/data/catalog.ts's BRANDS. This is a
    // forward-looking regression guard: if a future plan reintroduces one of
    // these names into BRANDS, this test catches it.
    expect(hasNonHardwareBrand).toBe(false);
  });

  it("carries at least 20 brands per D-05's floor", () => {
    expect(BRANDS.length).toBeGreaterThanOrEqual(20);
  });
});
