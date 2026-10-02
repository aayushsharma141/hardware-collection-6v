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

  it("are the five business families, one tile each", () => {
    expect(CATEGORY_FAMILIES.map((f) => f.groupId)).toEqual([
      "handles-knobs",
      "door-hardware",
      "bathroom",
      "kitchen-wardrobes",
      "furniture-hardware",
    ]);
  });

  it("drops a family whose group has no products", () => {
    const shown = resolveFamilies(undefined, ["handles-knobs", "door-hardware", "kitchen-wardrobes"]);
    expect(shown.map((f) => f.groupId)).toEqual(["handles-knobs", "door-hardware", "kitchen-wardrobes"]);
  });

  it("brings a family back as soon as its group has a product", () => {
    const shown = resolveFamilies(undefined, ["door-hardware", "bathroom"]);
    expect(shown.map((f) => f.groupId)).toEqual(["door-hardware", "bathroom"]);
  });

  it("keeps a family that has a single product — it is not folded away", () => {
    expect(resolveFamilies(undefined, ["handles-knobs"]).map((f) => f.groupId)).toEqual(["handles-knobs"]);
  });

  it("filters nothing when the populated groups are unknown", () => {
    expect(resolveFamilies(undefined)).toHaveLength(CATEGORY_FAMILIES.length);
  });

  it("collapses CMS categories that share a showroom group into one tile", () => {
    const shown = resolveFamilies(
      [
        featured("Digital Locks", "digital-locks", "door-hardware"),
        featured("Mortise & Door Locks", "mortise-door-locks", "door-hardware"),
        featured("Door Hardware", "door-hardware", "door-hardware"),
        featured("Drawer Channels", "drawer-channels", "furniture-hardware"),
      ],
      ALL
    );
    expect(shown.map((f) => f.groupId)).toEqual(["door-hardware", "furniture-hardware"]);
    // Named for the section it opens, not for the first category that mapped there.
    expect(shown.map((f) => f.name)).toEqual(["Door Hardware", "Furniture Hardware"]);
    expect(shown[0].href).toBe("/collections#door-hardware");
  });

  it("never links to a path under /collections", () => {
    const shown = resolveFamilies([featured("Anything", "not-a-mapped-category", null)], [
      ...ALL,
      "other",
    ]);
    for (const family of shown) expect(family.href).toMatch(/^\/collections#[a-z-]+$/);
  });

  it("numbers the families it actually shows, from 01", () => {
    const shown = resolveFamilies(undefined, ["kitchen-wardrobes", "bathroom"]);
    expect(shown.map((f) => f.index)).toEqual(["01", "02"]);
  });
});
