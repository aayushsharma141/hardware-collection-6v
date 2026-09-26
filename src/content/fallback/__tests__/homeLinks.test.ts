import { describe, it, expect } from "vitest";
import { CATEGORY_FAMILIES, SIGNATURE_PIECES } from "@/content/fallback/home";
import { CATEGORIES } from "@/content/fallback/catalog";
import { ROUTABLE_COLLECTION_SLUGS } from "@/lib/collections/routes";

const ALL_HOME_LINKS = [...CATEGORY_FAMILIES, ...SIGNATURE_PIECES];

// A real /collections/[slug] route, optionally pointing at a section of that
// page by anchor. Never a query string: `?category=` was the filter UI that
// D-18/D-25 removed.
const ROUTE_SHAPE = /^\/collections\/([a-z0-9-]+)(?:#([a-z0-9-]+))?$/;

describe("Homepage deep links resolve to real routes (D-25/F-05)", () => {
  it("uses a real single-segment /collections/[slug] route, not a query-string filter", () => {
    ALL_HOME_LINKS.forEach((link) => {
      expect(link.href).toMatch(ROUTE_SHAPE);
      expect(link.href).not.toContain("?");
    });
  });

  it("targets one of the 11 routable slugs (Phase 12)", () => {
    // /collections/[slug] sets `dynamicParams = false`: any slug outside
    // ROUTABLE_COLLECTION_SLUGS is a hard 404, even if a category document by
    // that name exists in the CMS.
    ALL_HOME_LINKS.forEach((link) => {
      const slug = link.href.match(ROUTE_SHAPE)?.[1];
      expect(ROUTABLE_COLLECTION_SLUGS, link.href).toContain(slug);
    });
  });

  it("anchors only to sections that name a real category", () => {
    const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));
    ALL_HOME_LINKS.forEach((link) => {
      const anchor = link.href.match(ROUTE_SHAPE)?.[2];
      if (anchor) expect(categorySlugs.has(anchor), link.href).toBe(true);
    });
  });
});
