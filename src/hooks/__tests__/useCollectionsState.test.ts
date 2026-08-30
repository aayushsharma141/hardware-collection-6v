import { describe, it, expect } from "vitest";
import { SHOWROOM_FAMILIES_NAV } from "../useCollectionsState";

// D-12: reference implementation of the image resolution chain that replaces
// the hardcoded PNG fallback map in getProductDisplayImage().
// This plan proves the chain in isolation; 09-09 wires it into the real hook.
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

describe("SHOWROOM_FAMILIES_NAV", () => {
  it("defines top-level discovery showroom families", () => {
    expect(SHOWROOM_FAMILIES_NAV).toHaveLength(6);
    expect(SHOWROOM_FAMILIES_NAV[0].id).toBe("all");
    expect(SHOWROOM_FAMILIES_NAV.map(f => f.id)).toEqual([
      "all",
      "handles-knobs",
      "door-hardware",
      "bathroom",
      "kitchen-wardrobes",
      "furniture-hardware",
    ]);
  });

  it("assigns appropriate filter slugs to each family", () => {
    const doorHardware = SHOWROOM_FAMILIES_NAV.find(f => f.id === "door-hardware");
    expect(doorHardware?.filterSlugs).toContain("digital-locks");
    expect(doorHardware?.filterSlugs).toContain("mortise-door-locks");

    const kitchen = SHOWROOM_FAMILIES_NAV.find(f => f.id === "kitchen-wardrobes");
    expect(kitchen?.filterSlugs).toContain("modular-kitchen-hardware");
    expect(kitchen?.filterSlugs).toContain("wardrobe-hardware-sliding");
  });
});

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
