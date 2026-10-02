/**
 * How the /collections catalogue is grouped.
 *
 * The public site has two content routes — `/` and `/collections` — so a
 * category is never a URL. Sanity keeps its detailed category taxonomy; this
 * file is the one place that says which showroom group each category is shown
 * under, and the groups are in-page sections (`/collections#door-entry`).
 *
 * The mapping is explicit on purpose. An earlier version guessed a product's
 * group by looking for words like "handle" or "cabinet" in its category name;
 * that put "Cabinet & Wardrobe Handles" in two groups at once and would have
 * mis-filed every new category. A lookup table is the opposite: boring, easy to
 * read, and wrong in exactly one place when it is wrong.
 *
 * Deliberately free of imports so client components, server components and
 * next.config.ts can all use it.
 */

export interface ShowroomGroup {
  id: string;
  title: string;
  description: string;
  /** Sanity category slugs shown under this group. */
  categories: readonly string[];
}

export const SHOWROOM_GROUPS: readonly ShowroomGroup[] = [
  {
    id: "door-entry",
    title: "Door & Entry",
    description: "Digital locks, mortise handles, and entryway hardware.",
    categories: [
      "digital-locks",
      "mortise-door-locks",
      "main-door-handles",
      "door-closers-stoppers",
      "door-hardware",
      "handles-knobs",
    ],
  },
  {
    id: "kitchen-wardrobe",
    title: "Kitchen & Wardrobe",
    description: "Premium mechanisms for cabinetry and sliding systems.",
    categories: [
      "modular-kitchen-hardware",
      "kitchen-sinks-faucets",
      "wardrobe-hardware-sliding",
      "cabinet-wardrobe-handles",
      "hinges-soft-close",
      "drawer-channels",
      "kitchen-wardrobes",
      "furniture-hardware",
    ],
  },
  {
    id: "bathroom-glass",
    title: "Bathroom & Glass",
    description: "Fittings and accessories for wet areas and glass architecture.",
    categories: ["bathroom-accessories", "bathroom-hardware", "glass-hardware"],
  },
  {
    id: "security-storage",
    title: "Security & Storage",
    description: "Safes and secure storage solutions.",
    categories: ["safes"],
  },
];

/**
 * Where a product goes when its category is not in the table above — a new CMS
 * category nobody has mapped yet, or a product with no category at all. It is a
 * visible section rather than a silent drop: a product the owner published must
 * never vanish from the catalogue because of a missing mapping.
 */
export const OTHER_GROUP: ShowroomGroup = {
  id: "other",
  title: "More Hardware",
  description: "Further architectural hardware from the showroom.",
  categories: [],
};

const GROUP_ID_BY_CATEGORY: ReadonlyMap<string, string> = new Map(
  SHOWROOM_GROUPS.flatMap((group) => group.categories.map((slug) => [slug, group.id] as const))
);

/** The group a category slug belongs to, or `other` when it is unmapped. */
export function showroomGroupId(categorySlug?: string | null): string {
  return (categorySlug && GROUP_ID_BY_CATEGORY.get(categorySlug)) || OTHER_GROUP.id;
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
export function showroomHrefForCategory(categorySlug?: string | null): string {
  return showroomHref(showroomGroupId(categorySlug));
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
 * Sorts products into their showroom groups.
 *
 * Every product lands in exactly one section, so the sections always add up to
 * the input. Empty groups are omitted — a section with nothing in it would be a
 * heading over a blank — and the unmapped section, when present, comes last.
 * Within a section, products the CMS marks `featured` come first.
 */
export function groupProducts<T extends ProductLike>(products: readonly T[]): ShowroomSection<T>[] {
  const buckets = new Map<string, T[]>();
  for (const product of products) {
    const id = showroomGroupId(productCategorySlug(product));
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
