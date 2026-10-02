/**
 * How the /collections catalogue is grouped.
 *
 * The public site has two content routes — `/` and `/collections` — so a
 * category is never a URL. The business already has a hierarchy for its
 * merchandise: five showroom families, recorded on every Sanity category as
 * `primaryRail`. This file does not invent a second one. A product's family is
 *
 *     product.categorySlug  ->  category.primaryRail  ->  showroom family
 *
 * and the families are in-page sections (`/collections#door-hardware`).
 *
 * Nothing here guesses. An earlier version looked for words like "handle" or
 * "cabinet" in a category name, and a later one kept its own four-group table
 * ("Door & Entry", "Bathroom & Glass"…) that the business never used. The only
 * input now is the field the CMS owner sets, so regrouping a category is an
 * edit in Studio, not in code.
 *
 * Deliberately free of imports so client components, server components and
 * next.config.ts can all use it.
 */

export interface ShowroomGroup {
  /** The `primaryRail` value, also the anchor id on /collections. */
  id: string;
  title: string;
  description: string;
}

/** The five showroom families, in the business's own order. */
export const SHOWROOM_GROUPS: readonly ShowroomGroup[] = [
  {
    id: "handles-knobs",
    title: "Handles & Knobs",
    description: "Handles and knobs, from contemporary profiles to classical detailing.",
  },
  {
    id: "door-hardware",
    title: "Door Hardware",
    description: "Locks, handles and the fittings that make up a door.",
  },
  {
    id: "bathroom",
    title: "Bathroom",
    description: "Accessories, mirrors and fittings for the bathroom.",
  },
  {
    id: "kitchen-wardrobes",
    title: "Kitchen & Wardrobes",
    description: "Mechanisms and fittings for kitchens, wardrobes and sliding systems.",
  },
  {
    id: "furniture-hardware",
    title: "Furniture Hardware",
    description: "Hinges, drawer runners and joinery fittings.",
  },
];

/**
 * Where a product goes when its category has no (or an unrecognised)
 * `primaryRail` — a new CMS category nobody has placed yet, or a product with no
 * category at all. It is a visible section rather than a silent drop: a product
 * the owner published must never vanish from the catalogue.
 */
export const OTHER_GROUP: ShowroomGroup = {
  id: "other",
  title: "More Hardware",
  description: "Further architectural hardware from the showroom.",
};

const GROUP_IDS: ReadonlySet<string> = new Set(SHOWROOM_GROUPS.map((group) => group.id));

/** A category slug mapped to the showroom family its `primaryRail` names. */
export type CategoryRails = ReadonlyMap<string, string>;

interface CategoryLike {
  slug?: string | { current?: string } | null;
  primaryRail?: string | null;
}

function slugOf(slug: CategoryLike["slug"]): string {
  if (!slug) return "";
  return typeof slug === "string" ? slug : (slug.current ?? "");
}

/** A raw `primaryRail` value as a showroom group id; anything unrecognised is `other`. */
export function railGroupId(primaryRail?: string | null): string {
  return primaryRail && GROUP_IDS.has(primaryRail) ? primaryRail : OTHER_GROUP.id;
}

/** Indexes categories by slug, ready for `showroomGroupId`. */
export function categoryRails(categories: readonly CategoryLike[]): CategoryRails {
  const rails = new Map<string, string>();
  for (const category of categories) {
    const slug = slugOf(category.slug);
    if (slug) rails.set(slug, railGroupId(category.primaryRail));
  }
  return rails;
}

/** The group a category slug belongs to, or `other` when it is unknown. */
export function showroomGroupId(categorySlug: string | null | undefined, rails: CategoryRails): string {
  return (categorySlug && rails.get(categorySlug)) || OTHER_GROUP.id;
}

/** A group's display title, for anything named after the section it opens. */
export function showroomGroupTitle(groupId: string): string {
  return (SHOWROOM_GROUPS.find((group) => group.id === groupId) ?? OTHER_GROUP).title;
}

/** In-page link to a group on the catalogue. */
export function showroomHref(groupId: string): string {
  return `/collections#${groupId}`;
}

/** In-page link to the group a category is shown under. */
export function showroomHrefForCategory(categorySlug: string | null | undefined, rails: CategoryRails): string {
  return showroomHref(showroomGroupId(categorySlug, rails));
}

/** The fields read from a product — structural, so this module stays import-free. */
interface ProductLike {
  categorySlug?: string | null;
  featured?: boolean;
}

/**
 * A product's canonical category: the slug, never the display label. `category`
 * on a product is a human-readable name ("Digital Locks") in the fallback data
 * and absent from Sanity, which is how six published products once went missing
 * from the page.
 */
export function productCategorySlug(product: ProductLike): string {
  return product.categorySlug ?? "";
}

export interface ShowroomSection<T> {
  group: ShowroomGroup;
  products: T[];
}

/**
 * Sorts products into their showroom families.
 *
 * Every product lands in exactly one section, so the sections always add up to
 * the input. Empty families are omitted — a heading over nothing is worse than no
 * heading — and the unplaced section, when present, comes last. Within a
 * section, products the CMS marks `featured` come first.
 *
 * A family with a single product is still a family. It is not folded into a
 * neighbour to look fuller; how much room it takes is the layout's business.
 */
export function groupProducts<T extends ProductLike>(
  products: readonly T[],
  rails: CategoryRails
): ShowroomSection<T>[] {
  const buckets = new Map<string, T[]>();
  for (const product of products) {
    const id = showroomGroupId(productCategorySlug(product), rails);
    const bucket = buckets.get(id);
    if (bucket) bucket.push(product);
    else buckets.set(id, [product]);
  }

  return [...SHOWROOM_GROUPS, OTHER_GROUP]
    .map((group) => ({
      group,
      products: (buckets.get(group.id) ?? [])
        .map((product, index) => ({ product, index }))
        .sort(
          (a, b) =>
            Number(b.product.featured === true) - Number(a.product.featured === true) ||
            a.index - b.index
        )
        .map(({ product }) => product),
    }))
    .filter((section) => section.products.length > 0);
}

/**
 * How much room a section should take, from how many products it holds. Layout
 * follows content: a family with one product is a single quiet specimen, not an
 * empty chapter, and it grows into a full chapter as stock is entered.
 */
export type SectionDensity = "specimen" | "composition" | "chapter";

export function sectionDensity(productCount: number): SectionDensity {
  if (productCount <= 1) return "specimen";
  if (productCount <= 4) return "composition";
  return "chapter";
}

/**
 * The detailed categories that have products inside one section, in the order
 * their products appear — the section's discovery vocabulary ("Digital Locks",
 * "Long Bar Handles"). `labels` maps a category slug to its display name.
 *
 * `groupId` is the section's own id. Each family also has a category of the same
 * name ("Door Hardware" inside Door Hardware); it is the family itself, not a
 * narrower collection, so it is not offered as one.
 */
export function sectionCategories<T extends ProductLike>(
  products: readonly T[],
  labels: ReadonlyMap<string, string>,
  groupId?: string
): { slug: string; name: string }[] {
  const seen = new Set<string>();
  const out: { slug: string; name: string }[] = [];
  for (const product of products) {
    const slug = productCategorySlug(product);
    const name = labels.get(slug);
    if (!slug || !name || slug === groupId || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, name });
  }
  return out;
}
