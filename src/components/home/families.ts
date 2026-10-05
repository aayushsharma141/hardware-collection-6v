import { CATEGORY_FAMILIES, type CategoryFamily } from "@/content/fallback/home";
import { railGroupId, showroomGroupTitle, showroomHref } from "@/lib/collections/showroom";

/** A category the CMS has chosen to feature on the homepage. */
export interface FeaturedCategory {
  categoryName: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  /** The category's showroom family, as set in the CMS. */
  primaryRail?: string | null;
}

/**
 * The families the homepage shows, desktop and mobile alike.
 *
 * Each family leads to one showroom group, and no two lead to the same one — two
 * tiles with different names and the same destination promise two things and
 * deliver one. A family is also left out when its group has no products, since
 * its anchor on /collections would not exist and the link would land on the top
 * of the page. Both rules apply to the CMS-chosen categories as well as the
 * built-in set: several categories map onto one group, and the first wins.
 *
 * `populatedGroupIds` omitted means "unknown", and nothing is filtered out.
 */
export function resolveFamilies(
  featured: readonly FeaturedCategory[] | undefined,
  populatedGroupIds?: readonly string[]
): CategoryFamily[] {
  const candidates: CategoryFamily[] =
    featured && featured.length > 0
      ? featured.map((category, position) => {
          const groupId = railGroupId(category.primaryRail, category.slug);
          // The built-in family for the same group lends its photograph and copy
          // where the CMS entry has none. Explicit, not guessed from the slug.
          const base =
            CATEGORY_FAMILIES.find((family) => family.groupId === groupId) ??
            CATEGORY_FAMILIES[position % CATEGORY_FAMILIES.length];
          return {
            id: category.slug,
            groupId,
            index: "",
            // Named for the section it opens, not for the CMS category: several
            // categories can open the same section, and "Handles & Knobs" over a
            // section that also holds locks would undersell it.
            name: showroomGroupTitle(groupId),
            subtitle: category.description || base.subtitle,
            detail: base.detail,
            image: category.imageUrl || base.image,
            href: showroomHref(groupId),
            isFocal: base.isFocal,
          };
        })
      : CATEGORY_FAMILIES;

  const seen = new Set<string>();
  const families = candidates.filter((family) => {
    if (seen.has(family.groupId)) return false;
    if (populatedGroupIds && !populatedGroupIds.includes(family.groupId)) return false;
    seen.add(family.groupId);
    return true;
  });

  return families.map((family, position) => ({
    ...family,
    index: String(position + 1).padStart(2, "0"),
  }));
}
