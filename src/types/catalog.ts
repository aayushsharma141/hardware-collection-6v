import { SanitySeo, SanityCta } from "./sanity";

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductImage {
  asset?: {
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
    };
  };
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug?: string | { current: string };
  category?: string;
  categorySlug?: string;
  categoryLabel?: string;
  subcategory?: string;
  subcategorySlug?: string;
  collectionSlugs?: string[];
  brand?: string;
  brandName?: string;
  model?: string;
  catalogReference?: string;
  shortDescription?: string;
  description?: string;
  overview?: unknown[];
  features?: string[];
  finishes?: string[];
  searchKeywords?: string[];
  application?: string;
  applications?: string[];
  imageUrl?: string;
  imageLqip?: string;
  images?: Array<ProductImage | string>;
  featured?: boolean;
  showroomDisplay?: boolean;
  whatsappMessage?: string;
  material?: string;
  durability?: string;
  dimensions?: string;
  showroomBay?: string;
  displayStatus?: "Live Display" | "Available on Order" | "Exclusive Demo Unit" | string;
  specifications?: ProductSpecification[];
  officialFiles?: string[];
  seo?: SanitySeo;
  cta?: SanityCta;
}

export interface Category {
  _id?: string;
  id?: string;
  title?: string;
  name: string;
  slug?: string | { current: string };
  description?: string;
  eyebrow?: string;
  shortDesc?: string;
  overview?: string;
  icon?: string;
  iconName?: string;
  imageUrl?: string;
  imageLqip?: string;
  featured?: boolean;
  itemCount?: number;
  primaryRail?: string;
  familySlugs?: string[];
  cardVariant?: "standard" | "wide" | "feature";
  suitableFor?: string[];
  brands?: string[];
  keyFeatures?: string[];
  verificationStatus?: string;
  whatsappMessage?: string;
  heroImageUrl?: string;
  heroImageLqip?: string;
  galleryUrls?: string[];
  searchKeywords?: string[];
  brandRefs?: Array<{ name: string; slug: string; logoUrl: string | null }>;
  displayOrder?: number;
  seo?: SanitySeo;
  cta?: SanityCta;
}

export interface Space {
  _id?: string;
  name: string;
  slug?: string | { current: string };
  description?: string;
  imageUrl?: string;
  imageLqip?: string;
  heroImageUrl?: string;
  heroImageLqip?: string;
  displayOrder?: number;
  linkedCategories?: Category[];
  linkedCategorySlugs?: string[];
  seo?: SanitySeo;
}

export interface Subcategory {
  _id?: string;
  name: string;
  slug?: string | { current: string };
  parentCategorySlug?: string;
  description?: string;
  imageUrl?: string;
  imageLqip?: string;
}

export interface CatalogueDocument {
  _id: string;
  catalogueName: string;
  title?: string | null;
  version?: string | null;
  releaseDate?: string | null;
  size?: number | null;
  pdfUrl?: string | null;
  coverUrl?: string | null;
}

export interface Brand {
  _id?: string;
  id?: string;
  name: string;
  slug?: string | { current?: string };
  logoUrl?: string | null;
  logoLqip?: string;
  /** Logo width / height from Sanity asset metadata; used to size logos optically. */
  logoAspect?: number | null;
  logo?: string;
  description?: string;
  authorizedStatus?: string;
  authorized?: boolean;
  website?: string | null;
  catalogues?: CatalogueDocument[];

  officialCatalogUrl?: string | null;
  featured?: boolean;
  country?: string;
  tagline?: string;
  tier?: string;
  establishedYear?: string;
  heroImage?: string;
  keyHighlights?: string[];
  seo?: SanitySeo;
  cta?: SanityCta;
}

export interface ResolvedBrand extends Brand {
  name: string;
  logoUrl: string | null;
  website: string | null;
  tagline: string;
  country?: string;
  [key: string]: unknown;
}

/** Utility to safely extract a string slug from either a string or Sanity slug object */
export function getSlugString(slug?: string | { current?: string }): string {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
}

export interface SiteSettings {
  whatsappNumber?: string;
  defaultWhatsappMessage?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  showroomAddress?: string;
  showroomHours?: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  defaultCategoryImageUrl?: string;
  authorizedBrandRefs?: { brandName: string; slug: string; logoUrl?: string }[];
}

export interface ShowroomFamilyNav {
  id: string;
  label: string;
  shortLabel: string;
  filterSlugs: string[];
}

/** A showroom offer from the Sanity `offer` document (see schemaTypes/offer.ts). */
export interface Offer {
  _id: string;
  title: string;
  type: "store" | "brand" | "seasonal" | "occasional";
  description?: string;
  validUntil?: string;
  imageUrl?: string;
  brandName?: string;
  /** Pages whose hero carousel this offer is ticked for in the Studio. */
  heroPlacement?: ("home" | "collections")[];
  /** Lower shows first when more offers are ticked than the hero has room for. */
  heroOrder?: number;
}
