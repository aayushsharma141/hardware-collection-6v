/**
 * How the /collections catalogue is grouped.
 *
 * The public site has two content routes — `/` and `/collections` — so a
 * category is never a URL. Products are grouped into seven showroom families,
 * the ones a visitor thinks in ("I need something for my kitchen"), and each
 * family is an in-page section (`/collections#kitchen`):
 *
 *     product.categorySlug  ->  category  ->  showroom family
 *
 * A category's family is decided, in order, by:
 *
 *   1. its Sanity `primaryRail`, when the owner has set one of the seven ids
 *      below — so regrouping a category is an edit in Studio, not in code;
 *   2. the default for the 13 canonical categories (CANONICAL_CATEGORY_FAMILY);
 *   3. the family that replaced its old `primaryRail` (LEGACY_FAMILY), for the
 *      five-family values every category carried before 2026-10-06;
 *   4. otherwise `other`, a visible section, so no product ever disappears.
 *
 * The seven ids deliberately differ from the five old ones ("door" not
 * "door-hardware") so an old value and a deliberate new one are never confused:
 * Digital Locks still says `door-hardware` in Sanity, but belongs in Smart &
 * Security now.
 *
 * Deliberately free of imports so client components, server components and
 * next.config.ts can all use it.
 */

export interface ShowroomGroup {
  /** The `primaryRail` value, also the anchor id on /collections. */
  id: string;
  title: string;
  /** Two or three words under the tile title ("Handles • Locks • Closers"). */
  tagline: string;
  description: string;
}

/** The seven showroom families, in the order the page shows them. */
export const SHOWROOM_GROUPS: readonly ShowroomGroup[] = [
  {
    id: "door",
    title: "Door Hardware",
    tagline: "Handles • Locks • Closers",
    description: "Main door handles, mortise locks, door closers and stoppers.",
  },
  {
    id: "smart-security",
    title: "Smart & Security",
    tagline: "Digital Locks • Safes",
    description: "Digital and biometric locks, smart access and safes.",
  },
  {
    id: "kitchen",
    title: "Kitchen Hardware",
    tagline: "Fittings • Sinks • Faucets",
    description: "Modular kitchen fittings, sinks and faucets.",
  },
  {
    id: "wardrobe-furniture",
    title: "Wardrobe & Furniture",
    tagline: "Sliding • Handles • Fittings",
    description: "Wardrobe sliding systems, cabinet and wardrobe handles, and fittings.",
  },
  {
    id: "bathroom-hardware",
    title: "Bathroom Hardware",
    tagline: "Accessories • Fittings",
    description: "Bathroom accessories, mirrors and fittings.",
  },
  {
    id: "glass",
    title: "Glass Hardware",
    tagline: "Shower • Partitions",
    description: "Fittings for glass doors, shower enclosures and partitions.",
  },
  {
    id: "furniture-fittings",
    title: "Furniture Fittings",
    tagline: "Hinges • Drawers",
    description: "Concealed hinges, drawer runners and joinery fittings.",
  },
];

/**
 * Where a product goes when its category has no recognisable family — a new
 * CMS category nobody has placed yet, or a product with no category at all. It
 * is a visible section rather than a silent drop: a product the owner published
 * must never vanish from the catalogue.
 */
export const OTHER_GROUP: ShowroomGroup = {
  id: "other",
  title: "More Hardware",
  tagline: "From the showroom",
  description: "Further architectural hardware from the showroom.",
};

const GROUP_IDS: ReadonlySet<string> = new Set(SHOWROOM_GROUPS.map((group) => group.id));

/** Default family for the 13 canonical categories (and the two family-named ones). */
export const CANONICAL_CATEGORY_FAMILY: Readonly<Record<string, string>> = {
  "main-door-handles": "door",
  "mortise-door-locks": "door",
  "door-closers-stoppers": "door",
  "door-hardware": "door",
  "digital-locks": "smart-security",
  safes: "smart-security",
  "modular-kitchen-hardware": "kitchen",
  "kitchen-sinks-faucets": "kitchen",
  "kitchen-wardrobes": "kitchen",
  "cabinet-wardrobe-handles": "wardrobe-furniture",
  "wardrobe-hardware-sliding": "wardrobe-furniture",
  "bathroom-accessories": "bathroom-hardware",
  "glass-hardware": "glass",
  "hinges-soft-close": "furniture-fittings",
  "drawer-channels": "furniture-fittings",
};

/** The five families used until 2026-10-06, and the family each became. */
export const LEGACY_FAMILY: Readonly<Record<string, string>> = {
  "handles-knobs": "wardrobe-furniture",
  "door-hardware": "door",
  bathroom: "bathroom-hardware",
  "kitchen-wardrobes": "kitchen",
  "furniture-hardware": "furniture-fittings",
};

/** A category slug mapped to its showroom family. */
export type CategoryRails = ReadonlyMap<string, string>;

interface CategoryLike {
  slug?: string | { current?: string } | null;
  primaryRail?: string | null;
}

function slugOf(slug: CategoryLike["slug"]): string {
  if (!slug) return "";
  return typeof slug === "string" ? slug : (slug.current ?? "");
}

/**
 * A category's showroom family from its `primaryRail` and slug, by the order in
 * the header comment. Anything unrecognised is `other`.
 */
export function railGroupId(primaryRail?: string | null, categorySlug?: string | null): string {
  if (primaryRail && GROUP_IDS.has(primaryRail)) return primaryRail;
  if (categorySlug && CANONICAL_CATEGORY_FAMILY[categorySlug]) return CANONICAL_CATEGORY_FAMILY[categorySlug];
  if (primaryRail && LEGACY_FAMILY[primaryRail]) return LEGACY_FAMILY[primaryRail];
  return OTHER_GROUP.id;
}

/**
 * The family an in-page anchor names: a current id, or an old one still in
 * bookmarks and the homepage (`#handles-knobs` opens Wardrobe & Furniture).
 */
export function familyForAnchor(anchor: string): string | null {
  if (GROUP_IDS.has(anchor) || anchor === OTHER_GROUP.id) return anchor;
  return LEGACY_FAMILY[anchor] ?? null;
}

/**
 * A category named after a whole family ("Door Hardware", "Kitchen & Wardrobes")
 * is the family itself, not a narrower collection, so it is never offered as one.
 */
export function isFamilyNamedCategory(slug: string): boolean {
  return GROUP_IDS.has(slug) || slug in LEGACY_FAMILY;
}

/** Indexes categories by slug, ready for `showroomGroupId`. */
export function categoryRails(categories: readonly CategoryLike[]): CategoryRails {
  const rails = new Map<string, string>();
  for (const category of categories) {
    const slug = slugOf(category.slug);
    if (slug) rails.set(slug, railGroupId(category.primaryRail, slug));
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
    if (!slug || !name || slug === groupId || isFamilyNamedCategory(slug) || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, name });
  }
  return out;
}

/**
 * Every showroom family in page order, with its products — empty families
 * included, so /collections can show the whole range and invite an enquiry
 * where nothing is photographed yet. The `other` section is added only when it
 * holds something. Products are sorted as in `groupProducts`.
 */
export function allShowroomSections<T extends ProductLike>(
  products: readonly T[],
  rails: CategoryRails
): ShowroomSection<T>[] {
  const filled = new Map(groupProducts(products, rails).map((section) => [section.group.id, section]));
  const sections = SHOWROOM_GROUPS.map((group) => filled.get(group.id) ?? { group, products: [] as T[] });
  const other = filled.get(OTHER_GROUP.id);
  return other ? [...sections, other] : sections;
}

