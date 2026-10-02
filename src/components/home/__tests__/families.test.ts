import { describe, it, expect } from "vitest";
import { resolveFamilies } from "../families";
import { CATEGORY_FAMILIES } from "@/content/fallback/home";
import { SHOWROOM_GROUPS } from "@/lib/collections/showroom";

const ALL = SHOWROOM_GROUPS.map((g) => g.id);

describe("resolveFamilies", () => {
  it("built-in families lead to distinct showroom groups", () => {
    const groups = CATEGORY_FAMILIES.map((f) => f.groupId);
    expect(new Set(groups).size).toBe(groups.length);
    expect(new Set(CATEGORY_FAMILIES.map((f) => f.href)).size).toBe(CATEGORY_FAMILIES.length);
  });

  it("each built-in family's href is the anchor of its own group", () => {
    for (const family of CATEGORY_FAMILIES) {
      expect(family.href).toBe(`/collections#${family.groupId}`);
      expect(ALL).toContain(family.groupId);
    }
  });

  it("drops a family whose group has no products", () => {
    const shown = resolveFamilies(undefined, ["door-entry", "kitchen-wardrobe"]);
    expect(shown.map((f) => f.groupId)).toEqual(["door-entry", "kitchen-wardrobe"]);
  });

  it("brings a family back as soon as its group has a product", () => {
    const shown = resolveFamilies(undefined, ["door-entry", "kitchen-wardrobe", "bathroom-glass"]);
    expect(shown.map((f) => f.groupId)).toContain("bathroom-glass");
  });

  it("filters nothing when the populated groups are unknown", () => {
    expect(resolveFamilies(undefined)).toHaveLength(CATEGORY_FAMILIES.length);
  });

  it("collapses CMS categories that share a showroom group into one tile", () => {
    const shown = resolveFamilies(
      [
        { categoryName: "Digital Locks", slug: "digital-locks" },
        { categoryName: "Mortise & Door Locks", slug: "mortise-door-locks" },
        { categoryName: "Door Hardware", slug: "door-hardware" },
        { categoryName: "Hinges", slug: "hinges-soft-close" },
      ],
      ALL
    );
    expect(shown.map((f) => f.groupId)).toEqual(["door-entry", "kitchen-wardrobe"]);
    // Named for the section it opens, not for the first category that mapped there.
    expect(shown.map((f) => f.name)).toEqual(["Door & Entry", "Kitchen & Wardrobe"]);
    expect(shown[0].href).toBe("/collections#door-entry");
  });

  it("never links to a path under /collections", () => {
    const shown = resolveFamilies([{ categoryName: "Anything", slug: "not-a-mapped-category" }], [
      ...ALL,
      "other",
    ]);
    for (const family of shown) expect(family.href).toMatch(/^\/collections#[a-z-]+$/);
  });

  it("numbers the families it actually shows, from 01", () => {
    const shown = resolveFamilies(undefined, ["kitchen-wardrobe", "bathroom-glass"]);
    expect(shown.map((f) => f.index)).toEqual(["01", "02"]);
  });
});
