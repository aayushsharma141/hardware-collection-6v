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
    featured
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
    "officialCatalogPdf": officialCatalog.asset->url,
    officialCatalogUrl,
    featured
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
    "collectionSlugs": curatedCollections[]->slug.current
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
    "collectionSlugs": curatedCollections[]->slug.current
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
    "collectionSlugs": curatedCollections[]->slug.current
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
    showroomDescription
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
    showroomAddress,
    showroomHours,
    googleMapsUrl,
    googleMapsEmbedUrl
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error (getSiteSettings):", error);
    return null;
  }
}
