/**
 * D-24: Spaces and categories share one route family, `/collections/[slug]`.
 * The slug resolves against `space` documents first, then `category` documents.
 *
 * A space with exactly one linked category skips its own interstitial landing
 * page and resolves straight to that category (per RESEARCH.md's rejected
 * `/collections/spaces/[slug]` note: a single-category space landing adds a
 * click with no value). A space with zero or multiple linked categories
 * resolves to the space landing page.
 */

export interface CategoryRef {
  slug: string;
}

export interface SpaceRef {
  slug: string;
  linkedCategories: CategoryRef[];
}

export type CollectionRouteResult =
  | { kind: "category"; categorySlug: string }
  | { kind: "space"; spaceSlug: string }
  | { kind: "not-found" };

/**
 * Resolves a requested `/collections/[slug]` path segment to either a space
 * landing page, a category page, or not-found — enforcing D-24's
 * space-then-category precedence order.
 */
export function resolveCollectionRoute(
  requestedSlug: string,
  spaces: SpaceRef[],
  categorySlugs: string[]
): CollectionRouteResult {
  const space = spaces.find((s) => s.slug === requestedSlug);

  if (space) {
    if (space.linkedCategories.length === 1) {
      return { kind: "category", categorySlug: space.linkedCategories[0].slug };
    }
    return { kind: "space", spaceSlug: space.slug };
  }

  if (categorySlugs.includes(requestedSlug)) {
    return { kind: "category", categorySlug: requestedSlug };
  }

  return { kind: "not-found" };
}
