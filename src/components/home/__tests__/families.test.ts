import { describe, it, expect } from "vitest";
import { resolveFamilies } from "../families";
import { CATEGORY_FAMILIES } from "@/content/fallback/home";
import { SHOWROOM_GROUPS } from "@/lib/collections/showroom";

const ALL = SHOWROOM_GROUPS.map((g) => g.id);

/** A featured category as the homepage query returns it, with its CMS `primaryRail`. */
const featured = (categoryName: string, slug: string, primaryRail: string | null) => ({
  categoryName,
  slug,
  primaryRail,
});

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

  it("are five of the seven showroom families, one tile each", () => {
    expect(CATEGORY_FAMILIES.map((f) => f.groupId)).toEqual([
      "door",
      "smart-security",
      "kitchen",
      "wardrobe-furniture",
      "bathroom-hardware",
    ]);
  });

  it("name each tile for the family it opens", () => {
    for (const family of CATEGORY_FAMILIES) {
      const title = SHOWROOM_GROUPS.find((g) => g.id === family.groupId)!.title;
      const tileName = [family.name, family.nameBreak].filter(Boolean).join(" ");
      expect(tileName, family.groupId).toBe(title);
    }
  });

  it("drops a family whose group has no products", () => {
    const shown = resolveFamilies(undefined, ["wardrobe-furniture", "door", "kitchen"]);
    expect(shown.map((f) => f.groupId)).toEqual(["door", "kitchen", "wardrobe-furniture"]);
  });

  it("brings a family back as soon as its group has a product", () => {
    const shown = resolveFamilies(undefined, ["door", "bathroom-hardware"]);
    expect(shown.map((f) => f.groupId)).toEqual(["door", "bathroom-hardware"]);
  });

  it("keeps a family that has a single product — it is not folded away", () => {
    expect(resolveFamilies(undefined, ["wardrobe-furniture"]).map((f) => f.groupId)).toEqual(["wardrobe-furniture"]);
  });

  it("filters nothing when the populated groups are unknown", () => {
    expect(resolveFamilies(undefined)).toHaveLength(CATEGORY_FAMILIES.length);
  });

  it("collapses CMS categories that share a showroom group into one tile", () => {
    const shown = resolveFamilies(
      [
        // Sanity still carries the old five-family values on these; the slug and
        // the mapping decide the family, so two door categories share one tile.
        featured("Mortise & Door Locks", "mortise-door-locks", "door-hardware"),
        featured("Door Hardware", "door-hardware", "door-hardware"),
        featured("Digital Locks", "digital-locks", "door-hardware"),
        featured("Drawer Channels", "drawer-channels", "furniture-hardware"),
      ],
      ALL
    );
    expect(shown.map((f) => f.groupId)).toEqual(["door", "smart-security", "furniture-fittings"]);
    // Named for the section it opens, not for the first category that mapped there.
    expect(shown.map((f) => f.name)).toEqual(["Door Hardware", "Smart & Security", "Furniture Fittings"]);
    expect(shown[0].href).toBe("/collections#door");
  });

  it("never links to a path under /collections", () => {
    const shown = resolveFamilies([featured("Anything", "not-a-mapped-category", null)], [
      ...ALL,
      "other",
    ]);
    for (const family of shown) expect(family.href).toMatch(/^\/collections#[a-z-]+$/);
  });

  it("numbers the families it actually shows, from 01", () => {
    const shown = resolveFamilies(undefined, ["kitchen", "bathroom-hardware"]);
    expect(shown.map((f) => f.index)).toEqual(["01", "02"]);
  });
});
