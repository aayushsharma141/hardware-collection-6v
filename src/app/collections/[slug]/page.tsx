import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/content/sanity/client";
import {
  getFamilySections,
  getProductsByCategoryQuery,
  getSiteSettings,
} from "@/content/sanity/queries";
import { resolveCollectionSlug } from "@/lib/collections/routing";
import {
  FAMILY_ROUTE_SLUGS,
  ROUTABLE_COLLECTION_SLUGS,
  categoryFamily,
} from "@/lib/collections/routes";
import { getSlugString, type Category, type Product } from "@/types/catalog";
import { PRODUCTS } from "@/content/fallback/catalog";
import CategoryDetailClient from "@/components/collections/CategoryDetailClient";
import type { FamilySection } from "@/components/collections/FamilySections";
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
    const title = seo?.metaTitle || `Premium ${resolution.category.name || "Hardware Collections"} in Jamshedpur | Hardware Collection`;
    const description =
      seo?.metaDescription ||
      resolution.category.description ||
      `Discover premium ${resolution.category.name?.toLowerCase() || "architectural hardware"} in Sakchi, Jamshedpur. Browse our showroom for genuine brands like Hafele, Blum & Dorset.`;
    return { 
      title, 
      description,
      alternates: {
        canonical: `https://hardwarecollection.co/collections/${slug}`,
      },
    };
  }

  if (resolution.kind === "space") {
    const seo = resolution.space.seo;
    const title = seo?.metaTitle || `Architectural Hardware for ${resolution.space.name}s | Hardware Collection Jamshedpur`;
    const description =
      seo?.metaDescription ||
      resolution.space.description ||
      `Transform your ${resolution.space.name?.toLowerCase()} with premium architectural hardware. Explore curated fittings in our Sakchi, Jamshedpur showroom.`;
    return { 
      title, 
      description,
      alternates: {
        canonical: `https://hardwarecollection.co/collections/${slug}`,
      },
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
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hardwarecollection.co/" },
        { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://hardwarecollection.co/collections" },
        { "@type": "ListItem", "position": 3, "name": resolution.space.name, "item": `https://hardwarecollection.co/collections/${slug}` }
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <SpaceLandingClient space={resolution.space} settings={settings} />
      </>
    );
  }

  // Phase 12: a family page carries one section per member category. Each
  // section takes its Sanity products and falls back to the curated PRODUCTS
  // for that category — the same per-category fallback the old category pages
  // used — so no product disappears when its category stops being a route.
  if ((FAMILY_ROUTE_SLUGS as readonly string[]).includes(slug)) {
    const family = categoryFamily(resolution.category) || slug;
    const rows: Array<Category & { products?: Product[] }> = family
      ? await getFamilySections(family, FAMILY_ROUTE_SLUGS)
      : [];
    const sections: FamilySection[] = rows.map(({ products: sanity, ...category }) => {
      const memberSlug = getSlugString(category.slug);
      return {
        category,
        products: sanity?.length
          ? sanity
          : PRODUCTS.filter((p) => p.categorySlug === memberSlug),
      };
    });

    // A family has no brands of its own; they sit on its members. Show every
    // authorised brand across the family, ranked by brand priority.
    type BrandRef = NonNullable<Category["brandRefs"]>[number] & { displayOrder?: number };
    const familyBrands = new Map<string, BrandRef>();
    for (const { category } of sections) {
      for (const brand of (category.brandRefs ?? []) as BrandRef[]) familyBrands.set(brand.slug, brand);
    }
    const brandRefs = [...familyBrands.values()].sort(
      (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
    );

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hardwarecollection.co/" },
        { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://hardwarecollection.co/collections" },
        { "@type": "ListItem", "position": 3, "name": resolution.category.name, "item": `https://hardwarecollection.co/collections/${slug}` }
      ]
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": resolution.category.name,
      "itemListElement": sections.flatMap((section, sIdx) => 
        (section.products || []).map((product, pIdx) => ({
          "@type": "ListItem",
          "position": sIdx * 100 + pIdx + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description || product.name,
            "brand": { "@type": "Brand", "name": product.brand || "Hardware Collection" }
          }
        }))
      ).slice(0, 30) // Limit to top 30 for SEO payload
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <CategoryDetailClient
          category={{ ...resolution.category, brandRefs }}
          products={[]}
          sections={sections}
          settings={settings}
        />
      </>
    );
  }

  // Parameterized GROQ fetch (T-9-02) with fallback to curated PRODUCTS
  const sanityProducts = await client.fetch(getProductsByCategoryQuery, {
    categorySlug: slug,
  });
  const fallbackCategoryProducts = PRODUCTS.filter((p) => p.categorySlug === slug);
  const products = (sanityProducts && sanityProducts.length > 0)
    ? sanityProducts
    : fallbackCategoryProducts;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hardwarecollection.co/" },
      { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://hardwarecollection.co/collections" },
      { "@type": "ListItem", "position": 3, "name": resolution.category.name, "item": `https://hardwarecollection.co/collections/${slug}` }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": resolution.category.name,
    "itemListElement": (products || []).slice(0, 30).map((product: { name: string, description?: string, brand?: string }, pIdx: number) => ({
      "@type": "ListItem",
      "position": pIdx + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description || product.name,
        "brand": { "@type": "Brand", "name": product.brand || "Hardware Collection" }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <CategoryDetailClient
        category={resolution.category}
        products={products || []}
        settings={settings}
      />
    </>
  );
}
