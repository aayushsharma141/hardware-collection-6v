import { describe, it, expect } from "vitest";
import { CATEGORY_FAMILIES, SIGNATURE_PIECES } from "@/content/fallback/home";
import { CATEGORIES } from "@/content/fallback/catalog";

// Anticipated D-02 space slugs — pending final naming by 09-08. Not yet backed
// by any code (no `@/content/fallback/spaces` module exists at Wave 0). Declared inline so
// this test never imports a module that doesn't exist yet.
const ANTICIPATED_SPACE_SLUGS = [
  "kitchen",
  "entrance",
  "wardrobe",
  "bathroom",
  "living-interior",
  "commercial",
];

const ALL_HOME_LINKS = [...CATEGORY_FAMILIES, ...SIGNATURE_PIECES];

describe("Homepage deep links resolve to real routes (D-25/F-05)", () => {
  it("uses a real single-segment /collections/[slug] route, not a query-string filter", () => {
    const routeShape = /^\/collections\/[a-z0-9-]+$/;

    // EXPECTED RED today: every href in CATEGORY_FAMILIES/SIGNATURE_PIECES is
    // still `/collections?category=...` (optionally with `&brand=...`). This
    // goes green once 09-17 repoints the links to real routes.
    ALL_HOME_LINKS.forEach((link) => {
      expect(link.href).toMatch(routeShape);
    });
  });

  it("resolves the slug segment of any real-route href to a known category or space", () => {
    const routeShape = /^\/collections\/([a-z0-9-]+)$/;
    const knownSlugs = [
      ...CATEGORIES.map((c) => c.slug),
      ...ANTICIPATED_SPACE_SLUGS,
    ];

    // Vacuously passes today: no href in ALL_HOME_LINKS currently matches the
    // route-shape regex (case 1 above fails for all of them), so this filter
    // yields an empty array. Becomes the real dangling-slug guard once 09-17
    // repoints the links to /collections/[slug].
    const realRouteLinks = ALL_HOME_LINKS.filter((link) =>
      routeShape.test(link.href)
    );

    realRouteLinks.forEach((link) => {
      const match = link.href.match(routeShape);
      const slug = match?.[1];
      expect(knownSlugs).toContain(slug);
    });
  });
});
