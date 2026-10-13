import { unstable_cache } from "next/cache";
import { normalizeBrandKey } from "@/content/fallback/brands";
import type { Brand } from "@/types/catalog";
import { createUpstashStore, readMatches, type KeyValueStore } from "../indexing/store";
import { versionOfAsset } from "./matchLink";
import { rankCategories } from "./rank";
import { readStaticIndexes } from "./staticIndexes";
import type { CategoryMatches } from "./types";

/** Invalidated by /api/catalog/reindex whenever the matches are rebuilt. */
export const CATALOGUE_MATCHES_TAG = "catalogue-matches";

export interface LoadOptions {
  kv: KeyValueStore | null;
  staticDir?: string;
}

/**
 * Matches written to Redis before `version` replaced `assetId` still carry the
 * full asset id, which rebuilds the PDF's CDN URL. Swap it for the fingerprint
 * until the next reindex overwrites them.
 */
function withoutAssetIds(matches: CategoryMatches): CategoryMatches {
  return Object.fromEntries(
    Object.entries(matches).map(([slug, brands]) => [
      slug,
      brands.map((brand) => ({
        ...brand,
        catalogues: brand.catalogues.map((catalogue) => {
          const { assetId, ...rest } = catalogue as typeof catalogue & { assetId?: string };
          return assetId ? { ...rest, version: rest.version || versionOfAsset(assetId) } : catalogue;
        }),
      })),
    ])
  );
}

/**
 * Category -> brand matches from the best catalogue evidence available:
 *
 * 1. the live index in Redis, kept current by /api/catalog/reindex (and OCR);
 * 2. otherwise the page text extracted from the same PDFs at build time
 *    (`catalog-index/`), ranked by the same matcher.
 *
 * Both are searches of the uploaded catalogues; neither infers a brand from
 * CMS product records. `null` only when there is no catalogue text at all.
 */
export async function loadCategoryMatches({ kv, staticDir }: LoadOptions): Promise<CategoryMatches | null> {
  if (kv) {
    try {
      const stored = await readMatches(kv);
      if (stored) return withoutAssetIds(stored.matches);
    } catch {
      // Redis unreachable: the build-time index is the next best evidence.
    }
  }
  const indexes = await readStaticIndexes(staticDir);
  if (indexes.length === 0) return null;
  return rankCategories(indexes, (slug) => normalizeBrandKey({ slug } as Brand));
}

const readCached = unstable_cache(
  () => loadCategoryMatches({ kv: createUpstashStore() }),
  ["catalogue-matches"],
  { tags: [CATALOGUE_MATCHES_TAG], revalidate: 3600 }
);

/**
 * Which brands' uploaded catalogues contain each category's products, or `null`
 * when no catalogue text is available. Callers degrade to an honest "not
 * available" rather than showing an error or guessing.
 */
export async function getCategoryMatches(): Promise<CategoryMatches | null> {
  try {
    // Also outside the cache: an entry cached before the change (the data cache
    // can outlive a deploy) still holds full asset ids.
    const matches = await readCached();
    return matches && withoutAssetIds(matches);
  } catch {
    return null;
  }
}
