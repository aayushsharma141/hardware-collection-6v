/**
 * Planner for the small content gaps the 2026-10-13 audit left open. Pure: it
 * takes what is stored in Sanity and returns the writes needed, so it can be
 * tested without a dataset. A write is planned only when the field is empty, so
 * running it twice, or after an editor fixed one by hand, changes nothing.
 */

/**
 * The homepage hero headline, with the line break the live page already shows.
 * The hero renders it with `white-space: pre-line`, and the code fallback it
 * replaces (`fallbackHeroSlides[0].title` in src/app/page.tsx) contains the
 * same "\n", so setting this keeps the page identical. Studio's single-line
 * string field shows the break as a space; retyping the headline there drops it.
 */
export const HERO_HEADLINE = "The Art of\nthe Finish.";

export const PULL_HANDLE_PRODUCT_ID = "3PbNCBB2cZv8B31WUkE8jD";
export const HAFELE_BRAND_ID = "brand-hafele";

export interface StoredDoc {
  _id: string;
  [field: string]: unknown;
}

export interface OpenItemsState {
  /** The "Pull Handle" product, if it exists. */
  product: StoredDoc | null;
  /** Brand documents by `_id`, published only. */
  brands: Record<string, StoredDoc | undefined>;
  /** Published `homePage` and its draft, if any. */
  homePage: StoredDoc | null;
  homePageDraft: StoredDoc | null;
}

/** Brand logo files that exist in the repo, by brand document id. */
export const LOGO_FILES: Record<string, string> = {
  "brand-becker": "public/brands/BECKER.webp",
  "brand-dorio": "public/brands/dorio.svg",
};

export type PlannedWrite =
  | { kind: "setProductBrand"; docId: string; brandId: string; note: string }
  | { kind: "setHeadline"; docId: string; value: string; note: string }
  | { kind: "setLogo"; docId: string; file: string; note: string };

export interface Plan {
  writes: PlannedWrite[];
  /** Things that would have been written but were already fine, or cannot be done safely. */
  skipped: string[];
}

const isEmpty = (value: unknown): boolean => value == null || (typeof value === "string" && value.trim() === "");

export function planOpenItems(state: OpenItemsState): Plan {
  const writes: PlannedWrite[] = [];
  const skipped: string[] = [];

  // 1. The product with no brand.
  if (!state.product) {
    skipped.push(`product ${PULL_HANDLE_PRODUCT_ID}: not found`);
  } else if (!isEmpty(state.product.brand)) {
    skipped.push(`product "${String(state.product.name)}": already has a brand`);
  } else if (!state.brands[HAFELE_BRAND_ID]) {
    skipped.push(`product "${String(state.product.name)}": brand ${HAFELE_BRAND_ID} does not exist, nothing to reference`);
  } else {
    writes.push({
      kind: "setProductBrand",
      docId: state.product._id,
      brandId: HAFELE_BRAND_ID,
      note: `"${String(state.product.name)}" -> Hafele`,
    });
  }

  // 2. The empty required headline. The draft is filled too, so Studio does not
  // reopen a copy that still blocks Publish.
  for (const [label, doc] of [
    ["published", state.homePage],
    ["draft", state.homePageDraft],
  ] as const) {
    if (!doc) continue;
    if (!isEmpty(doc.heroHeadline)) {
      skipped.push(`homePage (${label}): heroHeadline already set`);
    } else {
      writes.push({ kind: "setHeadline", docId: doc._id, value: HERO_HEADLINE, note: `homePage (${label}) heroHeadline` });
    }
  }

  // 3. Brands with no logo, where the repo has the file.
  for (const [brandId, file] of Object.entries(LOGO_FILES)) {
    const brand = state.brands[brandId];
    if (!brand) skipped.push(`${brandId}: brand not found`);
    else if (!isEmpty((brand.logo as { asset?: unknown } | undefined)?.asset)) skipped.push(`${brandId}: already has a logo`);
    else writes.push({ kind: "setLogo", docId: brandId, file, note: `${String(brand.name)} logo <- ${file}` });
  }

  return { writes, skipped };
}
