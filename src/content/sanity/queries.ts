import { groq } from "next-sanity";
import { client } from "./client";
import { Testimonial } from "@/types/testimonial";

export const getCategoriesQuery = groq`
  *[_type == "category"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    "imageUrl": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    featured,
    seo,
    cta
  }
`;

export const getBrandsQuery = groq`
  *[_type == "brand"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    "logoUrl": logo.asset->url,
    "logoLqip": logo.asset->metadata.lqip,
    description,
    authorizedStatus,
    website,
    // No asset URL here on purpose: catalogs are streamed through
    // /api/catalog/<slug>/<index> so no CDN link reaches the browser.
    "officialCatalogs": officialCatalogs[]{
      "title": assetTitle,
      "type": assetType,
      version,
      releaseDate,
      "size": asset->size
    },
    officialCatalogUrl,
    featured,
    seo,
    cta
  }
`;

export const getFeaturedProductsQuery = groq`
  *[_type == "product" && featured == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "brandName": brand->name,
    "categorySlug": category->slug.current,
    shortDescription,
    "imageUrl": images[0].asset->url,
    "imageLqip": images[0].asset->metadata.lqip,
    "subcategorySlug": subcategory->slug.current,
    "collectionSlugs": curatedCollections[]->slug.current,
    "officialFiles": officialFiles[].asset->url,
    seo,
    cta
  }
`;

export const getTestimonialsQuery = groq`
  *[_type == "testimonial" && approved == true] | order(date desc) {
    _id,
    customerName,
    quote,
    rating,
    source,
    date
  }
`;

export const getProductsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "brandName": brand->name,
    "categorySlug": category->slug.current,
    shortDescription,
    "imageUrl": images[0].asset->url,
    "imageLqip": images[0].asset->metadata.lqip,
    catalogReference,
    "subcategorySlug": subcategory->slug.current,
    "collectionSlugs": curatedCollections[]->slug.current,
    "officialFiles": officialFiles[].asset->url,
    seo,
    cta
  }
`;

export const getAllProductsQuery = groq`
  *[_type == "product"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "brandName": brand->name,
    "categorySlug": category->slug.current,
    shortDescription,
    "imageUrl": images[0].asset->url,
    "imageLqip": images[0].asset->metadata.lqip,
    catalogReference,
    showroomDisplay,
    specifications,
    "officialFiles": officialFiles[].asset->url,
    "subcategorySlug": subcategory->slug.current,
    "collectionSlugs": curatedCollections[]->slug.current,
    seo,
    cta
  }
`;

export const getSubcategoriesQuery = groq`
  *[_type == "subcategory"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    "parentCategorySlug": parentCategory->slug.current,
    description,
    "imageUrl": image.asset->url,
    "imageLqip": image.asset->metadata.lqip
  }
`;

export const getCuratedCollectionsQuery = groq`
  *[_type == "curatedCollection" && featured == true] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url,
    "imageLqip": image.asset->metadata.lqip
  }
`;

export async function getCategories() {
  try {
    return await client.fetch(getCategoriesQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getSubcategories() {
  try {
    return await client.fetch(getSubcategoriesQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getCuratedCollections() {
  try {
    return await client.fetch(getCuratedCollectionsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getBrands() {
  try {
    return await client.fetch(getBrandsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await client.fetch(getAllProductsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    return await client.fetch(getFeaturedProductsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch<Testimonial[]>(getTestimonialsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getHomePage() {
  const query = groq`*[_type == "homePage"][0] {
    heroSlides[] {
      eyebrow,
      title,
      description,
      primaryCta,
      ctaTarget,
      "imageUrl": image.asset->url,
      "imageLqip": image.asset->metadata.lqip
    },
    legacyHeading,
    legacyDescription,
    featuresHeading,
    featuresDescription,
    featuresList,
    "featuresImageUrl": featuresImage.asset->url,
    "featuresImageLqip": featuresImage.asset->metadata.lqip,
    showroomHeading,
    showroomDescription,
    seo,
    "trustedBrandRefs": trustedBrands[]->{ name, "slug": slug.current, "logoUrl": logo.asset->url },
    "featuredCategoryRefs": featuredCategories[]->{ name, "slug": slug.current, "imageUrl": image.asset->url },
    "featuredProductRefs": featuredProducts[]->{ name, "slug": slug.current, "imageUrl": images[0].asset->url, "brandName": brand->name },
    "showroomGalleryUrls": showroomGallery[].asset->url,
    "testimonialRefs": testimonials[]->{ _id, customerName, quote, rating, source, date },
    finalCTA
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error (getHomePage):", error);
    return null;
  }
}

export async function getSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0] {
    whatsappNumber,
    defaultWhatsappMessage,
    primaryPhone,
    secondaryPhone,
    showroomAddress,
    showroomHours,
    googleMapsUrl,
    googleMapsEmbedUrl,
    "defaultCategoryImageUrl": defaultCategoryImage.asset->url,
    seo
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error (getSiteSettings):", error);
    return null;
  }
}

export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, eyebrow, description, overview,
    cardVariant, families, primaryRail, suitableFor, keyFeatures, icon,
    "imageUrl": image.asset->url, "imageLqip": image.asset->metadata.lqip,
    "heroImageUrl": heroImage.asset->url, "heroImageLqip": heroImage.asset->metadata.lqip,
    "galleryUrls": gallery[].asset->url,
    "brandRefs": brands[]->{ name, "slug": slug.current, "logoUrl": logo.asset->url },
    searchKeywords, whatsappMessage, featured, displayOrder, seo, cta
  }
`;
export async function getCategoryBySlug(slug: string) {
  try {
    return await client.fetch(getCategoryBySlugQuery, { slug });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export const getSpaceBySlugQuery = groq`
  *[_type == "space" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, description,
    "imageUrl": image.asset->url, "imageLqip": image.asset->metadata.lqip, displayOrder,
    "linkedCategories": linkedCategories[]-> {
      _id, name, "slug": slug.current, eyebrow, description,
      "imageUrl": image.asset->url, "imageLqip": image.asset->metadata.lqip
    }
  }
`;
export async function getSpaceBySlug(slug: string) {
  try {
    return await client.fetch(getSpaceBySlugQuery, { slug });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export const getSpacesQuery = groq`
  *[_type == "space"] | order(displayOrder asc) {
    _id, name, "slug": slug.current, description,
    "imageUrl": image.asset->url, "imageLqip": image.asset->metadata.lqip, displayOrder,
    "linkedCategorySlugs": linkedCategories[]->slug.current
  }
`;
export async function getSpaces() {
  try {
    return await client.fetch(getSpacesQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export const getCategorySlugsQuery = groq`*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`;
export async function getCategorySlugs() {
  try {
    return await client.fetch(getCategorySlugsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export const getSpaceSlugsQuery = groq`*[_type == "space" && defined(slug.current)]{ "slug": slug.current }`;
export async function getSpaceSlugs() {
  try {
    return await client.fetch(getSpaceSlugsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export const getCollectionCountsQuery = groq`{
  "categoryCount": count(*[_type == "category"]),
  "brandCount": count(*[_type == "brand"])
}`;
export async function getCollectionCounts() {
  try {
    return await client.fetch(getCollectionCountsQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return { categoryCount: 0, brandCount: 0 };
  }
}

