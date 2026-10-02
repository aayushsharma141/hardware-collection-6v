import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/content/fallback/catalog";
import {
  OTHER_GROUP,
  SHOWROOM_GROUPS,
  groupProducts,
  productCategorySlug,
  showroomGroupId,
  showroomHref,
  showroomHrefForCategory,
} from "../showroom";

/** Products as Sanity returns them: a `categorySlug`, no `category` label. */
const sanityShaped = (name: string, categorySlug: string, featured = false) => ({
  name,
  categorySlug,
  featured,
});

describe("SHOWROOM_GROUPS", () => {
  it("assigns every category slug to exactly one group", () => {
    const seen = new Map<string, string>();
    for (const group of SHOWROOM_GROUPS) {
      for (const slug of group.categories) {
        expect(seen.get(slug), `${slug} is in both ${seen.get(slug)} and ${group.id}`).toBeUndefined();
        seen.set(slug, group.id);
      }
    }
  });

  it("covers all 13 canonical categories, so none falls through to 'other'", () => {
    expect(CATEGORIES).toHaveLength(13);
    for (const category of CATEGORIES) {
      expect(showroomGroupId(category.slug), category.slug).not.toBe(OTHER_GROUP.id);
    }
  });

  it("uses unique, URL-safe ids that cannot collide with the unmapped section", () => {
    const ids = [...SHOWROOM_GROUPS.map((g) => g.id), OTHER_GROUP.id];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });
});

describe("showroomGroupId", () => {
  it("maps by slug, with no word-matching on names", () => {
    expect(showroomGroupId("digital-locks")).toBe("door-entry");
    expect(showroomGroupId("cabinet-wardrobe-handles")).toBe("kitchen-wardrobe");
    expect(showroomGroupId("safes")).toBe("security-storage");
    // Contains "handle" and "door", which keyword matching would have claimed.
    expect(showroomGroupId("some-door-handle-collection")).toBe(OTHER_GROUP.id);
  });

  it("sends unknown and missing slugs to the visible 'other' group", () => {
    expect(showroomGroupId("wooden-collection")).toBe("other");
    expect(showroomGroupId("")).toBe("other");
    expect(showroomGroupId(undefined)).toBe("other");
    expect(showroomGroupId(null)).toBe("other");
  });
});

describe("hrefs", () => {
  it("point at an in-page anchor on the one catalogue route", () => {
    expect(showroomHref("door-entry")).toBe("/collections#door-entry");
    expect(showroomHrefForCategory("hinges-soft-close")).toBe("/collections#kitchen-wardrobe");
    expect(showroomHrefForCategory("unmapped")).toBe("/collections#other");
  });
});

describe("productCategorySlug", () => {
  it("reads the slug and never the display label", () => {
    expect(productCategorySlug({ categorySlug: "digital-locks" })).toBe("digital-locks");
    expect(productCategorySlug({})).toBe("");
  });
});

describe("groupProducts", () => {
  // The eleven products in Sanity when the page was found hiding six of them.
  const eleven = [
    sanityShaped("Biometric Lock", "digital-locks"),
    sanityShaped("Cabinet Knob", "cabinet-wardrobe-handles"),
    sanityShaped("Dorset Biometric Smart Digital Lock X1", "digital-locks", true),
    sanityShaped("Godrej Advantis Revolution Biometric Door Lock", "digital-locks", true),
    sanityShaped("Hafele Matrix Box Tandem Drawer", "modular-kitchen-hardware", true),
    sanityShaped("Hafele Mortise Lock", "mortise-door-locks"),
    sanityShaped("Hettich TopLine XL Wardrobe Sliding System", "wardrobe-hardware-sliding", true),
    sanityShaped("Labacha Double Bowl Kitchen Sink", "kitchen-sinks-faucets", true),
    sanityShaped("Mortice Handle", "door-hardware"),
    sanityShaped("Pull Handle", "door-hardware"),
    sanityShaped("Soft-Close Channel", "kitchen-wardrobes"),
  ];

  it("keeps every product — none is dropped for lacking a `category` label", () => {
    const sections = groupProducts(eleven);
    expect(sections.flatMap((s) => s.products)).toHaveLength(11);
  });

  it("splits the eleven into the groups the owner expects", () => {
    const sections = groupProducts(eleven);
    expect(sections.map((s) => [s.group.id, s.products.length])).toEqual([
      ["door-entry", 6],
      ["kitchen-wardrobe", 5],
    ]);
  });

  it("never files a product under two groups", () => {
    const names = groupProducts(eleven).flatMap((s) => s.products.map((p) => p.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it("omits empty groups rather than rendering a heading over nothing", () => {
    const ids = groupProducts(eleven).map((s) => s.group.id);
    expect(ids).not.toContain("bathroom-glass");
    expect(ids).not.toContain("security-storage");
    expect(ids).not.toContain("other");
  });

  it("puts featured products first within a group, preserving the rest of the order", () => {
    const door = groupProducts(eleven).find((s) => s.group.id === "door-entry")!;
    expect(door.products.map((p) => p.name)).toEqual([
      "Dorset Biometric Smart Digital Lock X1",
      "Godrej Advantis Revolution Biometric Door Lock",
      "Biometric Lock",
      "Hafele Mortise Lock",
      "Mortice Handle",
      "Pull Handle",
    ]);
  });

  it("shows unmapped and uncategorised products in a trailing 'other' section", () => {
    const uncategorised: { name: string; categorySlug?: string } = { name: "No category at all" };
    const sections = groupProducts([
      sanityShaped("Wooden Pull", "wooden-collection"),
      uncategorised,
      sanityShaped("Safe", "safes"),
    ]);
    expect(sections.map((s) => s.group.id)).toEqual(["security-storage", "other"]);
    expect(sections[1].products).toHaveLength(2);
  });

  it("returns nothing for an empty catalogue", () => {
    expect(groupProducts([])).toEqual([]);
  });
});
