import { describe, it, expect } from "vitest";
import { selectFeaturedChapters, FEATURED_CHAPTER_CAP } from "@/lib/collectionTiers";

interface TestItem {
  slug: string;
  featured?: boolean;
  displayOrder?: number;
}

describe("selectFeaturedChapters (D-03 cap)", () => {
  it("caps at 5 when 10 items are featured with distinct displayOrder, ordered ascending", () => {
    const items: TestItem[] = Array.from({ length: 10 }, (_, i) => ({
      slug: `cat-${i}`,
      featured: true,
      displayOrder: 10 - i, // descending input order, ascending expected output order
    }));

    const result = selectFeaturedChapters(items);

    expect(result).toHaveLength(FEATURED_CHAPTER_CAP);
    expect(result.map((r) => r.displayOrder)).toEqual([1, 2, 3, 4, 5]);
  });

  it("excludes items with featured: false or featured undefined even with a lower displayOrder", () => {
    const items: TestItem[] = [
      { slug: "not-featured", featured: false, displayOrder: 0 },
      { slug: "undefined-featured", displayOrder: -1 },
      { slug: "featured-one", featured: true, displayOrder: 5 },
    ];

    const result = selectFeaturedChapters(items);

    expect(result).toEqual([{ slug: "featured-one", featured: true, displayOrder: 5 }]);
  });

  it("does not pad to a minimum of 3 when only 2 items are featured", () => {
    const items: TestItem[] = [
      { slug: "a", featured: true, displayOrder: 1 },
      { slug: "b", featured: true, displayOrder: 2 },
    ];

    const result = selectFeaturedChapters(items);

    expect(result).toHaveLength(2);
  });

  it("returns an empty array with no throw when 0 items are featured", () => {
    const items: TestItem[] = [{ slug: "a", featured: false, displayOrder: 1 }];

    expect(() => selectFeaturedChapters(items)).not.toThrow();
    expect(selectFeaturedChapters(items)).toEqual([]);
  });

  it("treats missing displayOrder as 0 when sorting", () => {
    const items: TestItem[] = [
      { slug: "no-order", featured: true },
      { slug: "negative", featured: true, displayOrder: -1 },
      { slug: "positive", featured: true, displayOrder: 1 },
    ];

    const result = selectFeaturedChapters(items);

    expect(result.map((r) => r.slug)).toEqual(["negative", "no-order", "positive"]);
  });
});
