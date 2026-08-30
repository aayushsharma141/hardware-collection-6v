import { describe, it, expect } from "vitest";

// D-12: reference implementation of the image resolution chain that replaces
// the hardcoded PNG fallback map in getProductDisplayImage().
export function resolveProductDisplayImage(
  product: { imageUrl?: string },
  category?: { imageUrl?: string },
  settings?: { defaultCategoryImageUrl?: string }
): string {
  if (product.imageUrl) return product.imageUrl;
  if (category?.imageUrl) return category.imageUrl;
  if (settings?.defaultCategoryImageUrl) return settings.defaultCategoryImageUrl;
  return "";
}

describe("Product display image resolution chain (D-12)", () => {
  it("returns product.imageUrl when present, ignoring category/settings", () => {
    const result = resolveProductDisplayImage(
      { imageUrl: "/products/pull-handle.jpg" },
      { imageUrl: "/categories/door-hardware.jpg" },
      { defaultCategoryImageUrl: "/site-default.jpg" }
    );
    expect(result).toBe("/products/pull-handle.jpg");
  });

  it("falls back to category.imageUrl when product.imageUrl is absent", () => {
    const result = resolveProductDisplayImage(
      {},
      { imageUrl: "/categories/door-hardware.jpg" },
      { defaultCategoryImageUrl: "/site-default.jpg" }
    );
    expect(result).toBe("/categories/door-hardware.jpg");
  });

  it("falls back to settings.defaultCategoryImageUrl when product and category images are absent", () => {
    const result = resolveProductDisplayImage({}, {}, { defaultCategoryImageUrl: "/site-default.jpg" });
    expect(result).toBe("/site-default.jpg");
  });

  it("returns an empty string when all three are absent, never a hardcoded /cinema/ path", () => {
    const result = resolveProductDisplayImage({}, {}, {});
    expect(result).toBe("");
    expect(result).not.toMatch(/^\/cinema\//);
  });
});
