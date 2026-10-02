import { groq } from "next-sanity";
import { client } from "./client";
import { Testimonial } from "@/types/testimonial";
import { PRODUCTS } from "@/content/fallback/catalog";
import { mergeProducts } from "@/lib/collections/catalogue";
import { groupProducts } from "@/lib/collections/showroom";


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
    "quote": coalesce(testimonialText, quote, text, content),
    rating,
    source,
    date
  }
`;

export const getAllProductsQuery = groq`
  *[_type == "product"] | order(name asc) {
    ${PRODUCT_LIST_FIELDS},
    specifications
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
    return await client.fetch(getCategoriesQuery, {}, { next: { tags: ["category"] } });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getCuratedCollections() {
  try {
    return await client.fetch(getCuratedCollectionsQuery, {}, { next: { tags: ["curatedCollection"] } });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getBrands() {
  try {
    return await client.fetch(getBrandsQuery, {}, { next: { tags: ["brand"] } });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await client.fetch(getAllProductsQuery, {}, { next: { tags: ["product"] } });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

/**
 * The showroom groups that have at least one product, in showroom order — the
 * groups the footer and homepage may link to. A group with nothing in it has no
 * section on /collections, so a link to it would land on the top of the page
 * with nothing at the anchor. Add a product in the Studio and its group appears
 * here, and in those links, on the next revalidation.
 */
export async function getShowroomGroups(): Promise<{ id: string; title: string }[]> {
  const products = mergeProducts(PRODUCTS, await getAllProducts());
  return groupProducts(products).map(({ group }) => ({ id: group.id, title: group.title }));
}

export async function getFeaturedProducts() {
  try {
    return await client.fetch(getFeaturedProductsQuery, {}, { next: { tags: ["product"] } });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch<Testimonial[]>(getTestimonialsQuery, {}, { next: { tags: ["testimonial"] } });
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
      "quote": coalesce(testimonialText, quote, text, content),
      testimonialText, 
      rating, 
      customerType 
    },
    ctaHeading,
    ctaDescription,
    cta
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ["homePage", "product", "category", "brand", "testimonial"] } });
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
    "authorizedBrandRefs": authorizedBrands[]->{ 
      "brandName": name, 
      "slug": slug.current, 
      "logoUrl": logo.asset->url 
    },
    seo
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ["siteSettings", "brand"] } });
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
    return await client.fetch(query, {}, { next: { tags: ["navigation"] } });
  } catch (error) {
    console.error("Sanity fetch error (getNavigation):", error);
    return null;
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
    return await client.fetch(getLegalPageBySlugQuery, { slug }, { next: { tags: ["legalPage"] } });
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
    return await client.fetch(getFaqsQuery, {}, { next: { tags: ["faq"] } });
  } catch (error) {
    console.error("Sanity fetch error (getFaqs):", error);
    return [];
  }
}




