import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/content/sanity/client";
import {
  getProductsByCategoryQuery,
  getSiteSettings,
} from "@/content/sanity/queries";
import { resolveCollectionSlug } from "@/lib/collections/routing";
import { ROUTABLE_COLLECTION_SLUGS } from "@/lib/collections/routes";
import { getSlugString } from "@/types/catalog";
import { PRODUCTS } from "@/content/fallback/catalog";
import CategoryDetailClient from "@/components/collections/CategoryDetailClient";
import SpaceLandingClient from "@/components/collections/SpaceLandingClient";


export const revalidate = 60;

/**
 * Phase 12: only the 11 slugs in ROUTABLE_COLLECTION_SLUGS are served — five
 * showroom families and six spaces. The 13 legacy category slugs redirect at
 * the Next.js layer (next.config.ts), which runs before this route.
 *
 * `dynamicParams = false` is what actually enforces that. generateStaticParams
 * alone only controls what is prerendered; with the default of `true`, every
 * other category slug still exists in Sanity and would render on demand, so
 * the 42 non-routable categories would stay live as pages of their own.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return ROUTABLE_COLLECTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolution = await resolveCollectionSlug(slug);

  if (resolution.kind === "category") {
    const seo = resolution.category.seo;
    const title = seo?.metaTitle || `${resolution.category.name || "Curated Collection"} | Hardware Collection Jamshedpur`;
    const description =
      seo?.metaDescription ||
      resolution.category.description ||
      `Explore genuine architectural hardware for ${resolution.category.name} in Sakchi, Jamshedpur.`;
    return { 
      title, 
      description,
    };
  }

  if (resolution.kind === "space") {
    const seo = resolution.space.seo;
    const title = seo?.metaTitle || `${resolution.space.name} Architectural Hardware | Hardware Collection`;
    const description =
      seo?.metaDescription ||
      resolution.space.description ||
      `Curated hardware solutions for ${resolution.space.name} in Sakchi, Jamshedpur.`;
    return { 
      title, 
      description,
    };
  }

  return {
    title: "Collection Not Found | Hardware Collection",
    description: "The requested architectural hardware collection could not be found.",
  };
}

export default async function CollectionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolution = await resolveCollectionSlug(slug);

  if (resolution.kind === "not-found") {
    notFound();
  }

  const settings = await getSiteSettings();

  if (resolution.kind === "space") {
    if (
      resolution.space.linkedCategories &&
      resolution.space.linkedCategories.length === 1
    ) {
      const catSlug = getSlugString(resolution.space.linkedCategories[0].slug);
      if (catSlug && catSlug !== slug) {
        redirect(`/collections/${catSlug}`);
      }
    }
    return <SpaceLandingClient space={resolution.space} settings={settings} />;
  }

  // Parameterized GROQ fetch (T-9-02) with fallback to curated PRODUCTS
  const sanityProducts = await client.fetch(getProductsByCategoryQuery, {
    categorySlug: slug,
  });
  const fallbackCategoryProducts = PRODUCTS.filter((p) => p.categorySlug === slug);
  const products = (sanityProducts && sanityProducts.length > 0)
    ? sanityProducts
    : fallbackCategoryProducts;

  return (
    <CategoryDetailClient
      category={resolution.category}
      products={products || []}
      settings={settings}
    />
  );
}
