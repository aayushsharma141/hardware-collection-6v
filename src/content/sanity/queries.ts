import { groq } from "next-sanity";
import { client } from "./client";
import { Testimonial } from "@/types/testimonial";


/** Fields every product card and list needs, in both old and new image shapes. */
const PRODUCT_LIST_FIELDS = `
    _id,
    name,
    "slug": slug.current,
    "brandName": brand->name,
    "categorySlug": category->slug.current,
    shortDescription,
    catalogReference,
    showroomDisplay,
    featured,
    "imageUrl": coalesce(heroImage, images[0]).asset->url,
    "imageLqip": coalesce(heroImage, images[0]).asset->metadata.lqip,
    seo
`;

export const getCategoriesQuery = groq`
  *[_type == "category"] | order(displayOrder asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    eyebrow,
    description,
    icon,
    cardVariant,
    featured,
    displayOrder,
    primaryRail,
    // Stored as \`families\`; the app-wide name is \`familySlugs\`.
    "familySlugs": coalesce(families, []),
    searchKeywords,
    whatsappMessage,
    // \`image\` / \`heroImage\` are the pre-migration field names; documents
    // that have not been re-saved still carry the photograph there.
    "imageUrl": coalesce(categoryImage, image, heroImage).asset->url,
    "imageLqip": coalesce(categoryImage, image, heroImage).asset->metadata.lqip,
    seo
  }
`;

export const getBrandsQuery = groq`
  *[_type == "brand"] | order(displayOrder asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    authorizedStatus,
    featured,
    displayOrder,
    "logoUrl": logo.asset->url,
    "logoLqip": logo.asset->metadata.lqip,
    "logoAspect": logo.asset->metadata.dimensions.aspectRatio,
    "description": coalesce(description, brandPositioning),
    country,
    website,
    "officialCatalogUrl": officialCatalogue.asset->url,
    "catalogues": *[_type == "catalogue" && references(^._id)] | order(_createdAt asc) { _id, catalogueName, "title": catalogueName, version, releaseDate, "size": pdfFile.asset->size, "pdfUrl": pdfFile.asset->url, "coverUrl": coverImage.asset->url },
    "marketingAssets": marketingAssets[].asset->url,
    seo
  }
`;

export const getFeaturedProductsQuery = groq`
  *[_type == "product" && featured == true] | order(name asc) {
    ${PRODUCT_LIST_FIELDS}
  }
`;

export const getTestimonialsQuery = groq`
  *[_type == "testimonial" && (!defined(approved) || approved == true) && (!defined(editorial) || editorial.needsReview != true)] | order(date desc) {
    _id,
    customerName,
    "quote": testimonialText,
    rating,
    source,
    date
  }
`;

export const getProductsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(name asc) {
    ${PRODUCT_LIST_FIELDS}
  }
`;

export const getAllProductsQuery = groq`
  *[_type == "product"] | order(name asc) {
    ${PRODUCT_LIST_FIELDS},
    specifications
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
    heroEyebrow,
    heroHeadline,
    heroDescription,
    primaryCta { label, "url": destination },
    secondaryCta { label, "url": destination },
    "heroImageDesktopUrl": heroImageDesktop.asset->url,
    "heroImageDesktopLqip": heroImageDesktop.asset->metadata.lqip,
    "heroImageMobileUrl": heroImageMobile.asset->url,
    "heroImageMobileLqip": heroImageMobile.asset->metadata.lqip,
    
    valuePropositions,
    materialFinishes,
    legacyYearsOfTrust,
    legacyBrandsCount,
    "legacyShowroomImageUrl": legacyShowroomImage.asset->url,
    "legacyShowroomImageLqip": legacyShowroomImage.asset->metadata.lqip,
    legacyPillars,
    
    seo,
    "trustedBrandRefs": trustedBrands[]->{ 
      "brandName": name, 
      "slug": slug.current, 
      "logoUrl": logo.asset->url 
    },
    "featuredCategoryRefs": featuredCategories[]->{ 
      "categoryName": name, 
      "slug": slug.current, 
      "imageUrl": categoryImage.asset->url 
    },
    "featuredProductRefs": featuredProducts[]->{ 
      "productName": name, 
      "slug": slug.current, 
      "imageUrl": heroImage.asset->url, 
      "brandName": brand->name 
    },
    "showroomGalleryUrls": showroomGallery[].asset->url,
    "testimonialRefs": testimonials[]->{ 
      _id, 
      customerName, 
      testimonialText, 
      rating, 
      customerType 
    },
    ctaHeading,
    ctaDescription,
    cta
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
    "whatsappNumber": whatsapp,
    defaultWhatsappMessage,
    "primaryPhone": phone,
    secondaryPhone,
    email,
    "showroomAddress": address,
    "showroomHours": openingHours,
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

export async function getNavigation() {
  const query = groq`*[_type == "navigation"][0] {
    announcementBar,
    "mainMenu": mainMenu[] { label, path },
    "footerLegalLinks": footerLegalLinks[] { label, path }
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error (getNavigation):", error);
    return null;
  }
}

export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, eyebrow, description, overview,
    suitableFor, keyFeatures, icon,
    "imageUrl": coalesce(categoryImage, image, heroImage).asset->url,
    "imageLqip": coalesce(categoryImage, image, heroImage).asset->metadata.lqip,
    "galleryUrls": gallery[].asset->url,
    primaryRail, "familySlugs": coalesce(families, []),
    searchKeywords, whatsappMessage, featured, displayOrder, seo
  }
`;

/**
 * Phase 12: a family page renders one section per member category, in board
 * order, each carrying its own products. The five family landing pages are
 * themselves category documents that list their own family, so they are
 * excluded through $exclude.
 */
export const getFamilySectionsQuery = groq`
  *[_type == "category" && primaryRail == $family && !(slug.current in $exclude)]
    | order(displayOrder asc, name asc) {
    _id, name, "slug": slug.current, eyebrow, description, keyFeatures, whatsappMessage,
    "brandRefs": brands[]->{ name, "slug": slug.current, "logoUrl": logo.asset->url, displayOrder },
    "products": *[_type == "product" && category._ref == ^._id] | order(name asc) {
      ${PRODUCT_LIST_FIELDS}
    }
  }
`;
export async function getFamilySections(family: string, exclude: readonly string[]) {
  try {
    return await client.fetch(getFamilySectionsQuery, { family, exclude });
  } catch (error) {
    console.error("Sanity fetch error (getFamilySections):", error);
    return [];
  }
}
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

export const getLegalPageBySlugQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    lastUpdated,
    content,
    seo
  }
`;

export async function getLegalPageBySlug(slug: string) {
  try {
    return await client.fetch(getLegalPageBySlugQuery, { slug });
  } catch (error) {
    console.error(`Sanity fetch error (getLegalPageBySlug for ${slug}):`, error);
    return null;
  }
}

export const getFaqsQuery = groq`
  *[_type == "faq"] | order(_createdAt asc) {
    _id,
    question,
    answer,
    featured,
    "categorySlug": category->slug.current
  }
`;

export async function getFaqs() {
  try {
    return await client.fetch(getFaqsQuery);
  } catch (error) {
    console.error("Sanity fetch error (getFaqs):", error);
    return [];
  }
}




