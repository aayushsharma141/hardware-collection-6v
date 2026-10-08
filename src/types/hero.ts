export interface HeroSlide {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  ctaTarget: string;
  imageUrl: string;
  productUrl?: string;
  /** "Selected specimen" card label and caption; fall back to built-in copy when absent. */
  specimenLabel?: string;
  specimenCaption?: string;
  macroUrl?: string;
  reflectionUrl?: string;
}

export type HeroSlideKind = "offer" | "collection" | "brand" | "promotional" | "custom";

/** One entry of the Hero Manager document, with its references already resolved by the query. */
export interface HeroManagerSlide {
  slideType: HeroSlideKind;
  /** 1-based slot to pin the slide to; absent means it sits between the page's own slides. */
  position?: number | null;
  title?: string | null;
  subtitle?: string | null;
  link?: string | null;
  imageDesktop?: string | null;
  offer?: {
    _id: string;
    title: string;
    type?: "store" | "brand" | "seasonal" | "occasional";
    description?: string | null;
    validUntil?: string | null;
    imageUrl?: string | null;
    brandName?: string | null;
  } | null;
  collection?: {
    name: string;
    slug?: string | null;
    primaryRail?: string | null;
    description?: string | null;
    imageUrl?: string | null;
  } | null;
  brand?: { name: string; slug?: string | null } | null;
}

/** What the Studio's Hero Manager holds for each page's carousel. */
export interface HeroManagerData {
  home?: HeroManagerSlide[] | null;
  collections?: HeroManagerSlide[] | null;
}
