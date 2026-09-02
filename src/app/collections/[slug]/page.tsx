import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/content/sanity/client";
import {
  getProductsByCategoryQuery,
  getCategorySlugs,
  getSpaceSlugs,
  getSiteSettings,
} from "@/content/sanity/queries";
import { resolveCollectionSlug } from "@/lib/collections/routing";
import { getSlugString } from "@/types/catalog";
import { CATEGORIES } from "@/content/fallback/catalog";
import { SPACES } from "@/content/fallback/spaces";
import CategoryDetailClient from "@/components/collections/CategoryDetailClient";
import SpaceLandingClient from "@/components/collections/SpaceLandingClient";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const [catDocs, spaceDocs] = await Promise.all([
      getCategorySlugs(),
      getSpaceSlugs(),
    ]);

    const catSlugs = (catDocs || []).map((d: string | { slug?: string }) =>
      typeof d === "string" ? d : d?.slug || ""
    );
    const spaceSlugs = (spaceDocs || []).map((d: string | { slug?: string }) =>
      typeof d === "string" ? d : d?.slug || ""
    );

    const fallbackSlugs = [
      ...CATEGORIES.map((c) => c.slug),
      ...SPACES.map((s) => s.slug),
    ];

    const allSlugs = Array.from(
      new Set([...catSlugs, ...spaceSlugs, ...fallbackSlugs])
    ).filter(Boolean);

    return allSlugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error("Error in generateStaticParams:", err);
    return CATEGORIES.map((c) => ({ slug: c.slug }));
  }
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

  // Parameterized GROQ fetch (T-9-02)
  const products = await client.fetch(getProductsByCategoryQuery, {
    categorySlug: slug,
  });

  return (
    <CategoryDetailClient
      category={resolution.category}
      products={products || []}
      settings={settings}
    />
  );
}
