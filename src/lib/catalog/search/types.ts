/** One page of a catalogue's extracted (or OCR'd) text. */
export interface IndexedPage {
  page: number;
  text: string;
}

/**
 * A searchable catalogue. `catalogueIndex` is the catalogue's position in its
 * brand's list (`_createdAt` ascending), the same order `/api/catalog/<slug>/<n>`
 * serves, so a page number here is a page of that exact PDF.
 */
export interface CatalogueIndex {
  catalogId: string;
  brandSlug: string;
  brand: string;
  catalogueIndex: number;
  title: string;
  /** Sanity asset id of the PDF this index was built from. */
  assetId: string;
  pages: IndexedPage[];
}

/** Words that say a page is about a showroom category. */
export interface CategoryTerms {
  /** Terms that identify the category's products on their own. */
  strong: readonly string[];
  /** Supporting vocabulary: it raises a page's score but cannot qualify one. */
  weak?: readonly string[];
  /** Vocabulary of neighbouring categories, to push their pages down. */
  exclude?: readonly string[];
}

export interface PageMatch {
  page: number;
  score: number;
  snippet: string;
}

export interface CatalogueMatch {
  catalogueIndex: number;
  title: string;
  /**
   * Fingerprint of the PDF the match was found in (`versionOfAsset`). Matches
   * are sent to the browser, and the full asset id rebuilds the PDF's CDN URL,
   * so only these 12 characters travel.
   */
  version: string;
  /** Best page first. */
  pages: PageMatch[];
}

export interface BrandMatch {
  brandKey: string;
  brand: string;
  /** Best catalogue first. */
  catalogues: CatalogueMatch[];
  strength: number;
}

/** Category slug -> the brands whose catalogues actually contain its products. */
export type CategoryMatches = Record<string, BrandMatch[]>;
