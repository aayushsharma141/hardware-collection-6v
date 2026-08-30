import { describe, it, expect } from "vitest";
import { resolveCollectionRoute, SpaceRef } from "@/lib/collectionRouting";

describe("resolveCollectionRoute (D-24)", () => {
  const spaces: SpaceRef[] = [
    {
      slug: "kitchen",
      linkedCategories: [{ slug: "kitchen-hinges" }, { slug: "kitchen-handles" }],
    },
    {
      slug: "entrance",
      linkedCategories: [{ slug: "door-hardware" }],
    },
    {
      slug: "wardrobe",
      linkedCategories: [],
    },
  ];

  const categorySlugs = ["door-hardware", "bathroom-fittings", "kitchen"];

  it("space with exactly 2 linkedCategories resolves to the space landing", () => {
    expect(resolveCollectionRoute("kitchen", spaces, categorySlugs)).toEqual({
      kind: "space",
      spaceSlug: "kitchen",
    });
  });

  it("space with exactly 1 linkedCategories entry skips its landing page and resolves to that category", () => {
    expect(resolveCollectionRoute("entrance", spaces, categorySlugs)).toEqual({
      kind: "category",
      categorySlug: "door-hardware",
    });
  });

  it("space with 0 linkedCategories still resolves to a space landing, not a dead end", () => {
    expect(resolveCollectionRoute("wardrobe", spaces, categorySlugs)).toEqual({
      kind: "space",
      spaceSlug: "wardrobe",
    });
  });

  it("no matching space, but categorySlugs contains it, resolves to a category", () => {
    expect(resolveCollectionRoute("bathroom-fittings", spaces, categorySlugs)).toEqual({
      kind: "category",
      categorySlug: "bathroom-fittings",
    });
  });

  it("no matching space and no matching category resolves to not-found", () => {
    expect(resolveCollectionRoute("does-not-exist", spaces, categorySlugs)).toEqual({
      kind: "not-found",
    });
  });

  it("space-then-category precedence: a slug existing in both resolves as a space", () => {
    // "kitchen" exists both as a space slug and (deliberately, for this test) as a
    // category slug in categorySlugs above — space resolution must win.
    expect(resolveCollectionRoute("kitchen", spaces, categorySlugs)).toEqual({
      kind: "space",
      spaceSlug: "kitchen",
    });
  });
});
