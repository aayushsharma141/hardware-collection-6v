import { CATEGORY_TERMS } from "./categoryTerms";
import { compileTerms, matchPages } from "./score";
import type { BrandMatch, CatalogueIndex, CatalogueMatch, CategoryMatches, CategoryTerms } from "./types";
import { versionOfAsset } from "./matchLink";

/** Pages beyond the best few add confidence, but with diminishing weight. */
const SUPPORT_PAGES = 4;
const SUPPORT_WEIGHT = 0.5;

/**
 * Which brands' catalogues actually contain each category's products.
 *
 * Every catalogue is searched page by page; a brand appears under a category
 * only if at least one of its pages is a credible match, so a brand is never
 * listed for what it merely might stock. Brands are ordered by strength (best
 * page, plus the next few at half weight, plus how many pages matched), then by
 * key, so the order is stable between runs.
 */
export function rankCategories(
  catalogues: readonly CatalogueIndex[],
  brandKeyOf: (brandSlug: string) => string,
  terms: Readonly<Record<string, CategoryTerms>> = CATEGORY_TERMS
): CategoryMatches {
  const result: CategoryMatches = {};

  for (const [slug, categoryTerms] of Object.entries(terms)) {
    const compiled = compileTerms(categoryTerms);
    const brands = new Map<string, { brand: string; catalogues: CatalogueMatch[] }>();

    for (const catalogue of catalogues) {
      const pages = matchPages(catalogue.pages, compiled);
      if (pages.length === 0) continue;
      const key = brandKeyOf(catalogue.brandSlug);
      if (!key) continue;
      const entry = brands.get(key) ?? { brand: catalogue.brand, catalogues: [] };
      entry.catalogues.push({
        catalogueIndex: catalogue.catalogueIndex,
        title: catalogue.title,
        version: versionOfAsset(catalogue.assetId),
        pages,
      });
      brands.set(key, entry);
    }

    const ranked: BrandMatch[] = [...brands.entries()].map(([brandKey, { brand, catalogues: list }]) => {
      list.sort((a, b) => b.pages[0].score - a.pages[0].score || a.catalogueIndex - b.catalogueIndex);
      const scores = list.flatMap((c) => c.pages.map((p) => p.score)).sort((a, b) => b - a);
      const strength =
        scores[0] +
        scores.slice(1, 1 + SUPPORT_PAGES).reduce((sum, s) => sum + s * SUPPORT_WEIGHT, 0) +
        scores.length;
      return { brandKey, brand, catalogues: list, strength };
    });

    ranked.sort((a, b) => b.strength - a.strength || a.brandKey.localeCompare(b.brandKey));
    if (ranked.length > 0) result[slug] = ranked;
  }

  return result;
}
