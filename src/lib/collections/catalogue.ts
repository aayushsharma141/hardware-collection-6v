import { getSlugString, type Product } from "@/types/catalog";

/**
 * Lays Sanity products over the built-in fallback set, keyed by slug, with the
 * Sanity values winning. This is the one place the catalogue's product list is
 * assembled: the /collections page renders it, and the footer and homepage ask
 * it which showroom groups have anything in them. Two copies of this merge
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
