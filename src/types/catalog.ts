/**
 * Shared domain types for the Hardware Collection catalog.
 * Represents runtime data from Sanity CMS and static catalog registry.
 */

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
  subcategories?: string[];
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
  status?: "draft" | "review" | "published";
  brandRefs?: Array<{ name: string; slug: string; logoUrl: string | null }>;
  displayOrder?: number;
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

export interface Brand {
  _id?: string;
  id?: string;
  name: string;
  slug?: string | { current?: string };
  logoUrl?: string | null;
  logoLqip?: string;
  logo?: string;
  description?: string;
  authorizedStatus?: string;
  authorized?: boolean;
  website?: string | null;
  officialCatalogPdf?: string | null;
  officialCatalogUrl?: string | null;
  featured?: boolean;
  country?: string;
  tagline?: string;
  tier?: string;
  establishedYear?: string;
  heroImage?: string;
  keyHighlights?: string[];
}

export interface ResolvedBrand extends Brand {
  name: string;
  logoUrl: string | null;
  website: string | null;
  tagline: string;
  country?: string;
  officialCatalogPdf?: string | null;
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
}

export interface ShowroomFamilyNav {
  id: string;
  label: string;
  shortLabel: string;
  filterSlugs: string[];
}
