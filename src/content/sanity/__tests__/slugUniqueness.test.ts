import { describe, it, expect } from "vitest";
import {
  findSlugCollisions,
  isSlugAvailable,
  isReservedSlug,
  RESERVED_SLUGS,
  SlugDoc,
} from "@/content/sanity/lib/slugUniqueness";

describe("Cross-type slug uniqueness (D-27 + Pitfall 5)", () => {
  it("detects a slug collision between a space doc and a category doc", () => {
    const docs: SlugDoc[] = [
      { id: "space-1", type: "space", slug: "kitchen" },
      { id: "category-1", type: "category", slug: "kitchen" },
    ];

    const collisions = findSlugCollisions(docs);

    expect(collisions).toHaveLength(1);
    expect(collisions[0]).toEqual(
      expect.arrayContaining([
        { id: "space-1", type: "space", slug: "kitchen" },
        { id: "category-1", type: "category", slug: "kitchen" },
      ])
    );
  });

  it("returns an empty array when all slugs are distinct", () => {
    const docs: SlugDoc[] = [
      { id: "space-1", type: "space", slug: "kitchen" },
      { id: "category-1", type: "category", slug: "bathroom" },
    ];

    expect(findSlugCollisions(docs)).toEqual([]);
  });

  it("groups 3+ docs sharing one slug into a single group, not one pair short", () => {
    const docs: SlugDoc[] = [
      { id: "space-1", type: "space", slug: "entrance" },
      { id: "category-1", type: "category", slug: "entrance" },
      { id: "category-2", type: "category", slug: "entrance" },
    ];

    const collisions = findSlugCollisions(docs);

    expect(collisions).toHaveLength(1);
    expect(collisions[0]).toHaveLength(3);
  });

  it("isSlugAvailable returns false for a different doc holding the slug, true when editing self", () => {
    const docs: SlugDoc[] = [{ id: "category-1", type: "category", slug: "kitchen" }];

    expect(isSlugAvailable("kitchen", "space-1", docs)).toBe(false);
    expect(isSlugAvailable("kitchen", "category-1", docs)).toBe(true);
  });

  it("flags the literal slug 'spaces' as reserved, but not an ordinary slug", () => {
    expect(isReservedSlug("spaces")).toBe(true);
    expect(isReservedSlug("kitchen")).toBe(false);
    expect(RESERVED_SLUGS).toContain("spaces");
  });
});
