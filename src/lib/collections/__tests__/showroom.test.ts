import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/content/fallback/catalog";
import {
  OTHER_GROUP,
  SHOWROOM_GROUPS,
  categoryRails,
  groupProducts,
  productCategorySlug,
  railGroupId,
  sectionCategories,
  sectionDensity,
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

/**
 * Categories as Sanity returns them, each with the `primaryRail` the owner set.
 * These are the real rails for the categories the eleven live products use.
 */
const rails = categoryRails([
  { slug: "digital-locks", primaryRail: "door-hardware" },
  { slug: "mortise-door-locks", primaryRail: "door-hardware" },
  { slug: "door-hardware", primaryRail: "door-hardware" },
  { slug: "cabinet-wardrobe-handles", primaryRail: "handles-knobs" },
  { slug: "kitchen-wardrobes", primaryRail: "kitchen-wardrobes" },
  { slug: "modular-kitchen-hardware", primaryRail: "kitchen-wardrobes" },
  { slug: "kitchen-sinks-faucets", primaryRail: "kitchen-wardrobes" },
  { slug: "wardrobe-hardware-sliding", primaryRail: "kitchen-wardrobes" },
  { slug: "kids-collection", primaryRail: "handles-knobs" },
  { slug: "mail-box", primaryRail: "bathroom" },
  { slug: "drawer-channels", primaryRail: "furniture-hardware" },
]);

describe("SHOWROOM_GROUPS", () => {
  it("are the business's five showroom families, in its own order", () => {
    expect(SHOWROOM_GROUPS.map((g) => g.id)).toEqual([
      "handles-knobs",
      "door-hardware",
      "bathroom",
      "kitchen-wardrobes",
      "furniture-hardware",
    ]);
  });

  it("have unique, URL-safe ids that cannot collide with the unplaced section", () => {
    const ids = [...SHOWROOM_GROUPS.map((g) => g.id), OTHER_GROUP.id];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it("do not include the four-group names the business never used", () => {
    const ids = SHOWROOM_GROUPS.map((g) => g.id);
    for (const invented of ["door-entry", "kitchen-wardrobe", "bathroom-glass", "security-storage"]) {
      expect(ids).not.toContain(invented);
    }
  });
});

describe("the fallback categories", () => {
  it("each name one of the five families, so none falls through to 'other'", () => {
    expect(CATEGORIES).toHaveLength(13);
    for (const category of CATEGORIES) {
      expect(railGroupId(category.primaryRail), category.slug).not.toBe(OTHER_GROUP.id);
    }
  });
});

describe("railGroupId", () => {
  it("accepts the five rails and nothing else", () => {
    expect(railGroupId("handles-knobs")).toBe("handles-knobs");
    expect(railGroupId("kitchen-wardrobes")).toBe("kitchen-wardrobes");
    expect(railGroupId("kitchen")).toBe("other"); // a legacy value, not a family
    expect(railGroupId("")).toBe("other");
    expect(railGroupId(null)).toBe("other");
    expect(railGroupId(undefined)).toBe("other");
  });
});

describe("showroomGroupId", () => {
  it("follows the category's primaryRail, never its name", () => {
    expect(showroomGroupId("digital-locks", rails)).toBe("door-hardware");
    // A "wardrobe handle" lives under Handles & Knobs because the CMS says so.
    expect(showroomGroupId("cabinet-wardrobe-handles", rails)).toBe("handles-knobs");
    expect(showroomGroupId("mail-box", rails)).toBe("bathroom");
    // Contains "door" and "handle"; keyword matching would have claimed it.
    expect(showroomGroupId("some-door-handle-collection", rails)).toBe(OTHER_GROUP.id);
  });

  it("sends unknown and missing slugs to the visible 'other' group", () => {
    expect(showroomGroupId("never-heard-of-it", rails)).toBe("other");
    expect(showroomGroupId("", rails)).toBe("other");
    expect(showroomGroupId(undefined, rails)).toBe("other");
    expect(showroomGroupId(null, rails)).toBe("other");
  });

  it("moves a category when its primaryRail is edited, with no code change", () => {
    const before = categoryRails([{ slug: "safes", primaryRail: "door-hardware" }]);
    const after = categoryRails([{ slug: "safes", primaryRail: "kitchen-wardrobes" }]);
    expect(showroomGroupId("safes", before)).toBe("door-hardware");
    expect(showroomGroupId("safes", after)).toBe("kitchen-wardrobes");
  });
});

describe("categoryRails", () => {
  it("accepts Sanity's object-shaped slug as well as a plain string", () => {
    const index = categoryRails([
      { slug: { current: "a" }, primaryRail: "bathroom" },
      { slug: "b", primaryRail: "door-hardware" },
      { slug: undefined, primaryRail: "bathroom" },
    ]);
    expect(index.get("a")).toBe("bathroom");
    expect(index.get("b")).toBe("door-hardware");
    expect(index.size).toBe(2);
  });

  it("files a category with no rail under 'other' rather than dropping it", () => {
    expect(categoryRails([{ slug: "x", primaryRail: null }]).get("x")).toBe("other");
  });
});

describe("hrefs", () => {
  it("point at an in-page anchor on the one catalogue route", () => {
    expect(showroomHref("door-hardware")).toBe("/collections#door-hardware");
    expect(showroomHrefForCategory("drawer-channels", rails)).toBe("/collections#furniture-hardware");
    expect(showroomHrefForCategory("unmapped", rails)).toBe("/collections#other");
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
    expect(groupProducts(eleven, rails).flatMap((s) => s.products)).toHaveLength(11);
  });

  it("splits the eleven into the families the CMS puts them in", () => {
    expect(groupProducts(eleven, rails).map((s) => [s.group.id, s.products.length])).toEqual([
      ["handles-knobs", 1],
      ["door-hardware", 6],
      ["kitchen-wardrobes", 4],
    ]);
  });

  it("keeps a family with one product as a family — it is not folded into another", () => {
    const handles = groupProducts(eleven, rails).find((s) => s.group.id === "handles-knobs");
    expect(handles?.products.map((p) => p.name)).toEqual(["Cabinet Knob"]);
  });

  it("never files a product under two groups", () => {
    const names = groupProducts(eleven, rails).flatMap((s) => s.products.map((p) => p.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it("omits empty families rather than rendering a heading over nothing", () => {
    const ids = groupProducts(eleven, rails).map((s) => s.group.id);
    expect(ids).not.toContain("bathroom");
    expect(ids).not.toContain("furniture-hardware");
    expect(ids).not.toContain("other");
  });

  it("puts featured products first within a family, preserving the rest of the order", () => {
    const door = groupProducts(eleven, rails).find((s) => s.group.id === "door-hardware")!;
    expect(door.products.map((p) => p.name)).toEqual([
      "Dorset Biometric Smart Digital Lock X1",
      "Godrej Advantis Revolution Biometric Door Lock",
      "Biometric Lock",
      "Hafele Mortise Lock",
      "Mortice Handle",
      "Pull Handle",
    ]);
  });

  it("shows unplaced and uncategorised products in a trailing 'other' section", () => {
    const uncategorised: { name: string; categorySlug?: string } = { name: "No category at all" };
    const sections = groupProducts(
      [sanityShaped("Wooden Pull", "wooden-collection"), uncategorised, sanityShaped("Mail Box", "mail-box")],
      rails
    );
    expect(sections.map((s) => s.group.id)).toEqual(["bathroom", "other"]);
    expect(sections[1].products).toHaveLength(2);
  });

  it("returns nothing for an empty catalogue", () => {
    expect(groupProducts([], rails)).toEqual([]);
  });
});

describe("sectionDensity", () => {
  it("lets content decide how much room a family takes", () => {
    expect(sectionDensity(1)).toBe("specimen");
    expect(sectionDensity(2)).toBe("composition");
    expect(sectionDensity(4)).toBe("composition");
    expect(sectionDensity(5)).toBe("chapter");
    expect(sectionDensity(20)).toBe("chapter");
  });
});

describe("sectionCategories", () => {
  const labels = new Map([
    ["digital-locks", "Digital Locks"],
    ["door-hardware", "Door Hardware"],
  ]);

  it("lists each detailed category in a family once, in product order", () => {
    const products = [
      sanityShaped("a", "door-hardware"),
      sanityShaped("b", "digital-locks"),
      sanityShaped("c", "door-hardware"),
    ];
    expect(sectionCategories(products, labels)).toEqual([
      { slug: "door-hardware", name: "Door Hardware" },
      { slug: "digital-locks", name: "Digital Locks" },
    ]);
  });

  it("leaves out the category that is the family itself", () => {
    const products = [sanityShaped("a", "door-hardware"), sanityShaped("b", "digital-locks")];
    expect(sectionCategories(products, labels, "door-hardware")).toEqual([
      { slug: "digital-locks", name: "Digital Locks" },
    ]);
  });

  it("skips a category it has no display name for", () => {
    expect(sectionCategories([sanityShaped("a", "mystery")], labels)).toEqual([]);
  });
});
