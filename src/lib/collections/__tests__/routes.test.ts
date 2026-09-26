import { describe, it, expect } from "vitest";
import nextConfig from "../../../../next.config";
import {
  FAMILY_ROUTE_SLUGS,
  SPACE_ROUTE_SLUGS,
  ROUTABLE_COLLECTION_SLUGS,
  collectionHref,
  categoryHref,
  familyRouteSlug,
} from "../routes";
import { CATEGORIES, PRODUCTS, SHOWROOM_FAMILIES } from "../../../content/fallback/catalog";

/**
 * Phase 12 routing contract. /collections/[slug] sets `dynamicParams = false`,
 * so any link or redirect that targets a slug outside ROUTABLE_COLLECTION_SLUGS
 * is a hard 404. These tests are the guard.
 */
describe("Phase 12 collection routes", () => {
  it("serves exactly 11 slugs: 5 families and 6 spaces, no duplicates", () => {
    expect(FAMILY_ROUTE_SLUGS).toHaveLength(5);
    expect(SPACE_ROUTE_SLUGS).toHaveLength(6);
    expect(new Set(ROUTABLE_COLLECTION_SLUGS).size).toBe(11);
  });

  it("never gives a family and a space the same slug (D-27, B-2)", () => {
    const spaces = new Set<string>(SPACE_ROUTE_SLUGS);
    expect(FAMILY_ROUTE_SLUGS.filter((s) => spaces.has(s))).toEqual([]);
  });

  it("maps every showroom family to one of its routes", () => {
    const families = new Set<string>(FAMILY_ROUTE_SLUGS);
    for (const family of SHOWROOM_FAMILIES) {
      expect(families.has(familyRouteSlug(family.id))).toBe(true);
    }
  });

  it("routes the Bathroom family to bathroom-hardware, leaving bathroom to the space", () => {
    expect(familyRouteSlug("bathroom")).toBe("bathroom-hardware");
    expect(collectionHref("bathroom")).toBe("/collections/bathroom");
    expect(collectionHref("bathroom-accessories", "bathroom")).toBe(
      "/collections/bathroom-hardware#bathroom-accessories"
    );
  });

  it("links a routable slug to its own page", () => {
    expect(collectionHref("door-hardware")).toBe("/collections/door-hardware");
    expect(collectionHref("entrance")).toBe("/collections/entrance");
  });

  it("links every other category to a section of its family page", () => {
    expect(collectionHref("shaving-mirrors", "bathroom")).toBe(
      "/collections/bathroom-hardware#shaving-mirrors"
    );
    expect(collectionHref("digital-locks", "door-hardware")).toBe(
      "/collections/door-hardware#digital-locks"
    );
  });

  it("falls back to the collections hub rather than minting an unroutable URL", () => {
    expect(collectionHref("orphan-slug")).toBe("/collections");
    expect(collectionHref("orphan-slug", "more")).toBe("/collections");
  });

  it("resolves a category object under its home family", () => {
    expect(
      categoryHref({ slug: "drawer-channels", familySlugs: ["kitchen-wardrobes", "furniture-hardware"] })
    ).toBe("/collections/kitchen-wardrobes#drawer-channels");
    expect(categoryHref({ slug: { current: "hooks" }, primaryRail: "bathroom" })).toBe(
      "/collections/bathroom-hardware#hooks"
    );
  });

  it("places every category on at least one family page", () => {
    // A category with no family appears on no family page, and collectionHref
    // can only send its links to the collections hub.
    const familyIds = new Set(SHOWROOM_FAMILIES.map((f) => f.id));
    const homeless = CATEGORIES.filter((c) => !c.familySlugs.some((f) => familyIds.has(f)));
    expect(homeless.map((c) => c.slug)).toEqual([]);
  });

  it("keeps every product reachable once its category stops being a route", () => {
    // Regression: when the 13 original categories began redirecting to family
    // pages, those pages only looked up products for their own slug, so every
    // product on the site appeared on no collection page. A family page now
    // gathers products across its members; that only works if each product's
    // category belongs to a family.
    const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
    for (const product of PRODUCTS) {
      const category = categoryBySlug.get(product.categorySlug ?? "");
      expect(category, `${product.name}: unknown category`).toBeDefined();
      const href = collectionHref(product.categorySlug ?? "", category?.familySlugs[0]);
      expect(href, product.name).toMatch(/^\/collections\/[a-z0-9-]+#[a-z0-9-]+$/);
    }
  });

  it("only redirects legacy collection URLs to routable pages", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const collectionRedirects = redirects.filter((r) => r.source.startsWith("/collections/"));

    expect(collectionRedirects.length).toBeGreaterThan(0);
    for (const r of collectionRedirects) {
      const target = r.destination.replace(/^\/collections\//, "").split("#")[0];
      expect(ROUTABLE_COLLECTION_SLUGS, `${r.source} -> ${r.destination}`).toContain(target);
      expect(r.permanent, `${r.source} should be permanent`).toBe(true);
    }
  });
});
