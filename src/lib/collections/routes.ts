/**
 * Phase 12: the only slugs `/collections/[slug]` serves — five showroom
 * families and six spaces. Every other category is content inside one of these
 * pages, never a URL of its own.
 *
 * Deliberately free of imports: next.config.ts and client components can both
 * depend on it without pulling in the Sanity client.
 */

export const FAMILY_ROUTE_SLUGS = [
  "handles-knobs",
  "door-hardware",
  "bathroom-hardware",
  "kitchen-wardrobes",
  "furniture-hardware",
] as const;

export const SPACE_ROUTE_SLUGS = [
  "kitchen",
  "entrance",
  "wardrobe",
  "bathroom",
  "living-interior",
  "commercial",
] as const;

export const ROUTABLE_COLLECTION_SLUGS: readonly string[] = [
  ...FAMILY_ROUTE_SLUGS,
  ...SPACE_ROUTE_SLUGS,
];

/** Family ids as stored in the CMS `families` field. */
const FAMILY_IDS = new Set([
  "handles-knobs",
  "door-hardware",
  "bathroom",
  "kitchen-wardrobes",
  "furniture-hardware",
]);

/**
 * B-2: `bathroom` is already a space slug, and spaces resolve first, so the
 * Bathroom family routes as `bathroom-hardware`.
 */
export function familyRouteSlug(familyId: string): string {
  return familyId === "bathroom" ? "bathroom-hardware" : familyId;
}

/**
 * Where a category lives. Routable slugs get their own page; everything else
 * is a section of its family's page, addressed by anchor.
 *
 * `family` should be the family the link is shown under when there is one — a
 * category like Drawer Channels sits in two families, and the link should stay
 * in the family the visitor is browsing.
 */
export function collectionHref(slug: string, family?: string): string {
  if (ROUTABLE_COLLECTION_SLUGS.includes(slug)) return `/collections/${slug}`;
  if (family && FAMILY_IDS.has(family)) return `/collections/${familyRouteSlug(family)}#${slug}`;
  return "/collections";
}

/** The fields read below — structural, so this module stays import-free. */
interface CategoryLike {
  slug?: string | { current?: string };
  familySlugs?: string[];
  primaryRail?: string;
}

/** A category's home family: the normalised field first, the older rail second. */
export function categoryFamily(category: CategoryLike): string | undefined {
  return category.familySlugs?.[0] ?? category.primaryRail;
}

/** `collectionHref` for a category object, linked under its home family. */
export function categoryHref(category: CategoryLike): string {
  const slug = typeof category.slug === "string" ? category.slug : (category.slug?.current ?? "");
  return collectionHref(slug, categoryFamily(category));
}
