import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/content/fallback/catalog";
import {
  CANONICAL_CATEGORY_FAMILY,
  LEGACY_FAMILY,
  OTHER_GROUP,
  SHOWROOM_GROUPS,
  allShowroomSections,
  categoriesByFamily,
  categoryRails,
  familyForAnchor,
  groupProducts,
  inSubcategory,
  isFamilyNamedCategory,
  productCategorySlug,
  railGroupId,
  sectionCategories,
  sectionDensity,
  showroomGroupId,
  showroomHref,
  showroomHrefForCategory,
  subcategoriesOf,
} from "../showroom";

/** Products as Sanity returns them: a `categorySlug`, no `category` label. */
const sanityShaped = (name: string, categorySlug: string, featured = false) => ({
  name,
  categorySlug,
  featured,
});

/**
 * Categories as Sanity returns them. The `primaryRail` values are the real ones
 * the owner set before the seven-family catalogue — the five old family ids —
 * for the categories the eleven live products use.
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
  it("are the seven families a visitor shops by, in page order", () => {
    expect(SHOWROOM_GROUPS.map((g) => g.id)).toEqual([
      "door",
      "smart-security",
      "kitchen",
      "wardrobe-furniture",
      "bathroom-hardware",
      "glass",
      "furniture-fittings",
    ]);
  });

  it("have unique, URL-safe ids that cannot collide with the unplaced section", () => {
    const ids = [...SHOWROOM_GROUPS.map((g) => g.id), OTHER_GROUP.id];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it("never reuse one of the five old ids for a different family", () => {
    // `door-hardware` once named the whole door family; as a *current* id it would
    // be indistinguishable from an old Sanity value that now means something else.
    const ids = SHOWROOM_GROUPS.map((g) => g.id);
    for (const old of Object.keys(LEGACY_FAMILY)) expect(ids).not.toContain(old);
  });

  it("each carry a tagline and description for their tile and panel", () => {
    for (const group of [...SHOWROOM_GROUPS, OTHER_GROUP]) {
      expect(group.tagline.length, group.id).toBeGreaterThan(0);
      expect(group.description.length, group.id).toBeGreaterThan(0);
    }
  });
});

describe("the fallback categories", () => {
  it("each land in one of the seven families, so none falls through to 'other'", () => {
    expect(CATEGORIES).toHaveLength(13);
    for (const category of CATEGORIES) {
      expect(railGroupId(category.primaryRail, category.slug), category.slug).not.toBe(OTHER_GROUP.id);
    }
  });

  it("every canonical default names a real family", () => {
    const ids = new Set(SHOWROOM_GROUPS.map((g) => g.id));
    for (const [slug, family] of Object.entries(CANONICAL_CATEGORY_FAMILY)) {
      expect(ids.has(family), slug).toBe(true);
    }
    for (const [old, family] of Object.entries(LEGACY_FAMILY)) {
      expect(ids.has(family), old).toBe(true);
    }
  });
});

describe("railGroupId", () => {
  it("uses a current family id set in the CMS, whatever the category", () => {
    expect(railGroupId("glass")).toBe("glass");
    expect(railGroupId("kitchen", "digital-locks")).toBe("kitchen");
  });

  it("falls back to the canonical default for the category", () => {
    // Sanity still says `door-hardware` for Digital Locks; it belongs in Smart & Security now.
    expect(railGroupId("door-hardware", "digital-locks")).toBe("smart-security");
    expect(railGroupId(null, "glass-hardware")).toBe("glass");
    expect(railGroupId(undefined, "cabinet-wardrobe-handles")).toBe("wardrobe-furniture");
  });

  it("maps an old five-family value, for a category that has no canonical default", () => {
    expect(railGroupId("handles-knobs", "kids-collection")).toBe("wardrobe-furniture");
    expect(railGroupId("bathroom", "mail-box")).toBe("bathroom-hardware");
    expect(railGroupId("kitchen-wardrobes")).toBe("kitchen");
    expect(railGroupId("furniture-hardware")).toBe("furniture-fittings");
  });

  it("sends anything else to 'other'", () => {
    expect(railGroupId("nonsense")).toBe("other");
    expect(railGroupId("")).toBe("other");
    expect(railGroupId(null)).toBe("other");
    expect(railGroupId(undefined)).toBe("other");
    expect(railGroupId(null, "never-heard-of-it")).toBe("other");
  });
});

describe("familyForAnchor", () => {
  it("opens a current family by its id", () => {
    expect(familyForAnchor("kitchen")).toBe("kitchen");
    expect(familyForAnchor("other")).toBe("other");
  });

  it("opens the replacement for an old anchor still in bookmarks or the homepage", () => {
    expect(familyForAnchor("handles-knobs")).toBe("wardrobe-furniture");
    expect(familyForAnchor("door-hardware")).toBe("door");
    expect(familyForAnchor("kitchen-wardrobes")).toBe("kitchen");
  });

  it("ignores an anchor that is not a family", () => {
    expect(familyForAnchor("")).toBeNull();
    expect(familyForAnchor("explorer")).toBeNull();
  });
});

describe("isFamilyNamedCategory", () => {
  it("recognises the categories that are a whole family, current or old", () => {
    expect(isFamilyNamedCategory("door-hardware")).toBe(true);
    expect(isFamilyNamedCategory("kitchen-wardrobes")).toBe(true);
    expect(isFamilyNamedCategory("kitchen")).toBe(true);
  });

  it("does not hide a real narrower category", () => {
    expect(isFamilyNamedCategory("digital-locks")).toBe(false);
    expect(isFamilyNamedCategory("mortise-door-locks")).toBe(false);
  });
});

describe("showroomGroupId", () => {
  it("follows the category's rail and slug, never its name", () => {
    expect(showroomGroupId("digital-locks", rails)).toBe("smart-security");
    // A "wardrobe handle" lives under Wardrobe & Furniture because the data says so.
    expect(showroomGroupId("cabinet-wardrobe-handles", rails)).toBe("wardrobe-furniture");
    expect(showroomGroupId("mail-box", rails)).toBe("bathroom-hardware");
    // Contains "door" and "handle"; keyword matching would have claimed it.
    expect(showroomGroupId("some-door-handle-collection", rails)).toBe(OTHER_GROUP.id);
  });

  it("sends unknown and missing slugs to the visible 'other' group", () => {
    expect(showroomGroupId("never-heard-of-it", rails)).toBe("other");
    expect(showroomGroupId("", rails)).toBe("other");
    expect(showroomGroupId(undefined, rails)).toBe("other");
    expect(showroomGroupId(null, rails)).toBe("other");
  });

  it("moves a category when its family is edited, with no code change", () => {
    const before = categoryRails([{ slug: "safes", primaryRail: "door" }]);
    const after = categoryRails([{ slug: "safes", primaryRail: "kitchen" }]);
    expect(showroomGroupId("safes", before)).toBe("door");
    expect(showroomGroupId("safes", after)).toBe("kitchen");
  });
});

describe("categoryRails", () => {
  it("accepts Sanity's object-shaped slug as well as a plain string", () => {
    const index = categoryRails([
      { slug: { current: "a" }, primaryRail: "bathroom-hardware" },
      { slug: "b", primaryRail: "door" },
      { slug: undefined, primaryRail: "glass" },
    ]);
    expect(index.get("a")).toBe("bathroom-hardware");
    expect(index.get("b")).toBe("door");
    expect(index.size).toBe(2);
  });

  it("files a category with no rail under 'other' rather than dropping it", () => {
    expect(categoryRails([{ slug: "x", primaryRail: null }]).get("x")).toBe("other");
  });
});

describe("hrefs", () => {
  it("point at an in-page anchor on the one catalogue route", () => {
    expect(showroomHref("door")).toBe("/collections#door");
    expect(showroomHrefForCategory("drawer-channels", rails)).toBe("/collections#furniture-fittings");
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

  it("splits the eleven into the seven-family layout, in page order", () => {
    expect(groupProducts(eleven, rails).map((s) => [s.group.id, s.products.length])).toEqual([
      ["door", 3],
      ["smart-security", 3],
      ["kitchen", 3],
      ["wardrobe-furniture", 2],
    ]);
  });

  it("keeps a family with one product as a family — it is not folded into another", () => {
    const sections = groupProducts([sanityShaped("Cabinet Knob", "cabinet-wardrobe-handles")], rails);
    expect(sections.map((s) => s.group.id)).toEqual(["wardrobe-furniture"]);
    expect(sections[0].products.map((p) => p.name)).toEqual(["Cabinet Knob"]);
  });

  it("never files a product under two groups", () => {
    const names = groupProducts(eleven, rails).flatMap((s) => s.products.map((p) => p.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it("omits empty families (allShowroomSections is the one that keeps them)", () => {
    const ids = groupProducts(eleven, rails).map((s) => s.group.id);
    expect(ids).not.toContain("bathroom-hardware");
    expect(ids).not.toContain("glass");
    expect(ids).not.toContain("other");
  });

  it("puts featured products first within a family, preserving the rest of the order", () => {
    const security = groupProducts(eleven, rails).find((s) => s.group.id === "smart-security")!;
    expect(security.products.map((p) => p.name)).toEqual([
      "Dorset Biometric Smart Digital Lock X1",
      "Godrej Advantis Revolution Biometric Door Lock",
      "Biometric Lock",
    ]);
    const door = groupProducts(eleven, rails).find((s) => s.group.id === "door")!;
    expect(door.products.map((p) => p.name)).toEqual(["Hafele Mortise Lock", "Mortice Handle", "Pull Handle"]);
  });

  it("shows unplaced and uncategorised products in a trailing 'other' section", () => {
    const uncategorised: { name: string; categorySlug?: string } = { name: "No category at all" };
    const sections = groupProducts(
      [sanityShaped("Wooden Pull", "wooden-collection"), uncategorised, sanityShaped("Mail Box", "mail-box")],
      rails
    );
    expect(sections.map((s) => s.group.id)).toEqual(["bathroom-hardware", "other"]);
    expect(sections[1].products).toHaveLength(2);
  });

  it("returns nothing for an empty catalogue", () => {
    expect(groupProducts([], rails)).toEqual([]);
  });
});

describe("allShowroomSections", () => {
  const products = [sanityShaped("Mortice Handle", "door-hardware"), sanityShaped("Mail Box", "mail-box")];

  it("lists all seven families in page order, including those with no products", () => {
    const sections = allShowroomSections(products, rails);
    expect(sections.map((s) => s.group.id)).toEqual(SHOWROOM_GROUPS.map((g) => g.id));
    expect(sections.filter((s) => s.products.length === 0).map((s) => s.group.id)).toEqual([
      "smart-security",
      "kitchen",
      "wardrobe-furniture",
      "glass",
      "furniture-fittings",
    ]);
  });

  it("shows the same products groupProducts does", () => {
    const filled = allShowroomSections(products, rails).filter((s) => s.products.length > 0);
    expect(filled).toEqual(groupProducts(products, rails));
  });

  it("still shows all seven for an empty catalogue, and no 'other'", () => {
    const sections = allShowroomSections([], rails);
    expect(sections).toHaveLength(SHOWROOM_GROUPS.length);
    expect(sections.every((s) => s.products.length === 0)).toBe(true);
  });

  it("adds a trailing 'other' only when a product is unplaced", () => {
    const sections = allShowroomSections([sanityShaped("Mystery", "no-such-category")], rails);
    expect(sections.at(-1)?.group.id).toBe("other");
    expect(sections.at(-1)?.products).toHaveLength(1);
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
    ["mortise-door-locks", "Mortise & Door Locks"],
    ["door-hardware", "Door Hardware"],
  ]);

  it("lists each detailed category in a family once, in product order", () => {
    const products = [
      sanityShaped("a", "mortise-door-locks"),
      sanityShaped("b", "digital-locks"),
      sanityShaped("c", "mortise-door-locks"),
    ];
    expect(sectionCategories(products, labels)).toEqual([
      { slug: "mortise-door-locks", name: "Mortise & Door Locks" },
      { slug: "digital-locks", name: "Digital Locks" },
    ]);
  });

  it("leaves out a category that is a whole family rather than a narrower collection", () => {
    const products = [sanityShaped("a", "door-hardware"), sanityShaped("b", "digital-locks")];
    expect(sectionCategories(products, labels)).toEqual([{ slug: "digital-locks", name: "Digital Locks" }]);
  });

  it("leaves out the category named after the section it sits in", () => {
    const products = [sanityShaped("a", "digital-locks"), sanityShaped("b", "mortise-door-locks")];
    expect(sectionCategories(products, labels, "digital-locks")).toEqual([
      { slug: "mortise-door-locks", name: "Mortise & Door Locks" },
    ]);
  });

  it("skips a category it has no display name for", () => {
    expect(sectionCategories([sanityShaped("a", "mystery")], labels)).toEqual([]);
  });
});

describe("subcategoriesOf", () => {
  const p = (subcategory?: string | null) => ({ subcategory });

  it("lists each sub-category once, in the order products first use it", () => {
    expect(subcategoriesOf([p("Biometric"), p("Fingerprint"), p("Biometric")])).toEqual(["Biometric", "Fingerprint"]);
  });

  it("treats spellings that differ only in case or spacing as one, keeping the first", () => {
    expect(subcategoriesOf([p("Long Bar"), p("long  bar"), p(" LONG BAR ")])).toEqual(["Long Bar"]);
  });

  it("ignores products with no sub-category, so an unsorted category yields none", () => {
    expect(subcategoriesOf([p(), p(null), p(""), p("   ")])).toEqual([]);
    expect(subcategoriesOf([])).toEqual([]);
  });
});

describe("inSubcategory", () => {
  it("matches the chosen label regardless of case and spacing", () => {
    expect(inSubcategory({ subcategory: "Long Bar" }, "long  bar")).toBe(true);
    expect(inSubcategory({ subcategory: "Long Bar" }, "Knobs")).toBe(false);
  });

  it("never matches a product that has no sub-category", () => {
    expect(inSubcategory({}, "Knobs")).toBe(false);
    expect(inSubcategory({ subcategory: null }, "Knobs")).toBe(false);
  });
});

describe("categoriesByFamily", () => {
  const cat = (slug: string, name: string, primaryRail: string | null, extra: object = {}) => ({
    slug,
    name,
    primaryRail,
    ...extra,
  });
  const categories = [
    cat("digital-locks", "Digital Locks", "door-hardware", { shortDesc: "Biometric locks", imageUrl: "/dl.png" }),
    cat("hotel-locks", "Hotel Locks", "door-hardware"),
    cat("door-hardware", "Door Hardware", "door-hardware"),
    cat("kids-collection", "Kids Collection", "handles-knobs"),
    cat("mail-box", "Mail Box", "bathroom"),
  ];
  const byFamily = categoriesByFamily(categories, categoryRails(categories));

  it("files each category under the family the rails put it in", () => {
    expect(byFamily.get("smart-security")?.map((c) => c.name)).toEqual(["Digital Locks"]);
    expect(byFamily.get("door")?.map((c) => c.name)).toEqual(["Hotel Locks"]);
    expect(byFamily.get("wardrobe-furniture")?.map((c) => c.name)).toEqual(["Kids Collection"]);
    expect(byFamily.get("bathroom-hardware")?.map((c) => c.name)).toEqual(["Mail Box"]);
  });

  it("leaves out the category that is a whole family rather than an item in it", () => {
    const all = [...byFamily.values()].flat().map((c) => c.slug);
    expect(all).not.toContain("door-hardware");
  });

  it("carries the description and image for the item's own panel", () => {
    expect(byFamily.get("smart-security")?.[0]).toEqual({
      slug: "digital-locks",
      name: "Digital Locks",
      blurb: "Biometric locks",
      image: "/dl.png",
    });
  });

  it("keeps the order given, drops duplicates and nameless or slugless entries", () => {
    const messy = [
      cat("hotel-locks", "Hotel Locks", "door-hardware"),
      cat("hotel-locks", "Hotel Locks again", "door-hardware"),
      cat("door-sliding", "Door Sliding", "door-hardware"),
      { slug: "no-name", name: "  ", primaryRail: "door-hardware" },
      { name: "No slug", primaryRail: "door-hardware" },
    ];
    const result = categoriesByFamily(messy, categoryRails(messy));
    expect(result.get("door")?.map((c) => c.name)).toEqual(["Hotel Locks", "Door Sliding"]);
  });

  it("returns nothing for no categories", () => {
    expect(categoriesByFamily([], categoryRails([])).size).toBe(0);
  });
});
