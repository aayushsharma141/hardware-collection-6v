/**
 * D-27: Cross-type slug uniqueness is a blocking schema constraint. Because
 * D-24 puts `space` and `category` documents in one URL namespace
 * (`/collections/[slug]`), both Sanity schemas must validate that a slug is
 * unique across BOTH types — a collision would silently shadow one document
 * with the other.
 *
 * Also encodes RESEARCH.md's Pitfall 5 reserved-slug guard: the literal slug
 * "spaces" would collide with the (rejected but structurally instructive)
 * `/collections/spaces/[slug]` path segment, so it is never allowed.
 */

export interface SlugDoc {
  id: string;
  type: string;
  slug: string;
}

export const RESERVED_SLUGS = ["spaces"];

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug);
}

/**
 * Groups `docs` by `slug` value and returns only the groups with more than
 * one member. Deliberately NOT scoped by `type` — D-27 requires uniqueness
 * across BOTH `space` and `category` types, so two same-type docs sharing a
 * slug must also be flagged.
 */
export function findSlugCollisions(docs: SlugDoc[]): SlugDoc[][] {
  const bySlug = new Map<string, SlugDoc[]>();

  for (const doc of docs) {
    const group = bySlug.get(doc.slug);
    if (group) {
      group.push(doc);
    } else {
      bySlug.set(doc.slug, [doc]);
    }
  }

  return Array.from(bySlug.values()).filter((group) => group.length > 1);
}

/**
 * Returns true only if no document other than `currentId` already holds
 * `slug` — so editing an existing document does not flag itself as a
 * collision against its own prior value.
 */
export function isSlugAvailable(
  slug: string,
  currentId: string,
  existingDocs: SlugDoc[]
): boolean {
  return !existingDocs.some((doc) => doc.slug === slug && doc.id !== currentId);
}
