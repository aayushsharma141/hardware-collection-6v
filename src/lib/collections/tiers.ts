/**
 * D-03: Collection hierarchy (Tier-1 cinematic chapters vs Tier-2 compact
 * grid) is CMS-driven off `category.featured` + `category.displayOrder`.
 * This module enforces the hard UPPER bound (5) in code so the page cannot
 * degrade back into all-large-cards if editors over-flag `featured`.
 *
 * The 3-5 range quoted in D-03 is an editorial target, not a code-enforced
 * floor — there is no sane way to synthesize a 3rd chapter from nothing if
 * fewer than 3 categories are flagged featured, so this function never pads.
 */

export interface FeaturableItem {
  slug: string;
  featured?: boolean;
  displayOrder?: number;
}

export const FEATURED_CHAPTER_CAP = 5;

// Do NOT add a minimum-padding branch here — the cap is an upper bound only.
export function selectFeaturedChapters<T extends FeaturableItem>(items: T[]): T[] {
  return items
    .filter((item) => item.featured === true)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .slice(0, FEATURED_CHAPTER_CAP);
}

export const selectFeaturedCategories = selectFeaturedChapters;
