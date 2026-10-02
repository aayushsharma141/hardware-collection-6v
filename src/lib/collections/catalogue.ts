import { getSlugString, type Category, type Product } from "@/types/catalog";

/**
 * Lays Sanity products over the built-in fallback set, keyed by slug, with the
 * Sanity values winning. This is the one place the catalogue's product list is
 * assembled: the /collections page renders it, and the footer and homepage ask
 * it which showroom families have anything in them. Two copies of this merge
 * would eventually disagree about which products exist.
 */
export function mergeProducts(fallback: readonly Product[], sanity: readonly Product[] | null | undefined): Product[] {
  const byId = new Map<string, Product>();
  for (const p of fallback) byId.set(p.id || getSlugString(p.slug) || p._id || p.name, p);
  for (const p of sanity ?? []) {
    const id = getSlugString(p.slug) || p._id || p.id;
    if (id) byId.set(id, { ...(byId.get(id) ?? {}), ...p });
  }
  return Array.from(byId.values());
}

/**
 * The same merge for categories, which is what carries `primaryRail` — the
 * showroom family each category belongs to. A Sanity category that has no
 * `primaryRail` set keeps the fallback's rather than blanking it, since an
 * unset field arrives as `null` and would otherwise win the spread.
 */
export function mergeCategories(
  fallback: readonly Category[],
  sanity: readonly Category[] | null | undefined
): Category[] {
  const bySlug = new Map<string, Category>();
  fallback.forEach((c, index) => {
    const slug = getSlugString(c.slug);
    if (slug) bySlug.set(slug, { ...c, name: c.name || c.title || "", displayOrder: index });
  });
  for (const c of sanity ?? []) {
    const slug = getSlugString(c.slug) || c._id;
    if (!slug) continue;
    const previous = bySlug.get(slug);
    bySlug.set(slug, {
      ...(previous ?? {}),
      ...c,
      name: c.name || previous?.name || c.title || "",
      primaryRail: c.primaryRail || previous?.primaryRail,
    });
  }
  return Array.from(bySlug.values());
}
