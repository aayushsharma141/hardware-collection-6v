import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchSpy = vi.fn();
vi.mock("../client", () => ({ client: { fetch: (...args: unknown[]) => fetchSpy(...args) } }));
vi.mock("@/lib/catalog/viewOnly", () => ({ withPdfVersions: (brands: unknown) => brands ?? [] }));

const queries = await import("../queries");

/**
 * Every Sanity read is cached by tag, and the publish webhook (/api/revalidate)
 * clears the tag. If that webhook is ever missing, misconfigured or failing,
 * nothing else refreshes the cache: the site serves the content from the last
 * deploy indefinitely and edits in Studio never appear. A time limit on every
 * read is the safety net, so the worst case is a few minutes of lag, not forever.
 */
describe("Sanity read caching", () => {
  beforeEach(() => {
    fetchSpy.mockReset().mockResolvedValue(null);
  });

  const reads: [string, () => Promise<unknown>][] = [
    ["getCategories", () => queries.getCategories()],
    ["getCuratedCollections", () => queries.getCuratedCollections()],
    ["getBrands", () => queries.getBrands()],
    ["getAllProducts", () => queries.getAllProducts()],
    ["getFeaturedProducts", () => queries.getFeaturedProducts()],
    ["getTestimonials", () => queries.getTestimonials()],
    ["getHomePage", () => queries.getHomePage()],
    ["getSiteSettings", () => queries.getSiteSettings()],
    ["getNavigation", () => queries.getNavigation()],
    ["getLegalPageBySlug", () => queries.getLegalPageBySlug("privacy-policy")],
    ["getFaqs", () => queries.getFaqs()],
    ["getActiveOffers", () => queries.getActiveOffers()],
    ["getHeroManager", () => queries.getHeroManager()],
  ];

  it.each(reads)("%s keeps its webhook tag and also expires on a timer", async (_name, read) => {
    await read();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const options = fetchSpy.mock.calls[0][2] as { next?: { tags?: string[]; revalidate?: number } };
    expect(options.next?.tags?.length, "webhook tag").toBeGreaterThan(0);
    // A number first: comparing two undefineds would pass even with no timer at all.
    expect(typeof options.next?.revalidate, "time-based refresh").toBe("number");
    expect(options.next?.revalidate).toBe(queries.SANITY_REVALIDATE_SECONDS);
  });

  it("refreshes within minutes, not hours", () => {
    expect(queries.SANITY_REVALIDATE_SECONDS).toBeGreaterThanOrEqual(60);
    expect(queries.SANITY_REVALIDATE_SECONDS).toBeLessThanOrEqual(600);
  });
});
