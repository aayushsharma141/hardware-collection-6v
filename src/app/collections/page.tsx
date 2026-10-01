import React, { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";
import {
  getCategories,
  getSubcategories,
  getAllProducts,
  getBrands,
  getSiteSettings,
  getSpaces,
  getCollectionCounts,
} from "@/content/sanity/queries";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/content/fallback/catalog";
import { SPACES } from "@/content/fallback/spaces";
import { Category, Product, Brand, Space } from "@/types/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Architectural Hardware Collections | Hardware Collection Jamshedpur",
  },
  description:
    "Explore curated architectural hardware collections in Sakchi, Jamshedpur. Premium door handles, digital locks, modular kitchen systems, and luxury fittings from top brands.",
  alternates: {
    canonical: 'https://hardwarecollection.co/collections',
  },
};

// Use Next.js revalidation strategy for Sanity content
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CollectionsPage() {
  const [
    sanityCategories,
    sanitySubcategories,
    sanityProducts,
    sanityBrands,
    settings,
    sanitySpaces,
    counts,
  ] = await Promise.all([
    getCategories(),
    getSubcategories(),
    getAllProducts(),
    getBrands(),
    getSiteSettings(),
    getSpaces(),
    getCollectionCounts(),
  ]);

  // Merge 13 canonical categories with any Sanity-fetched categories
  const categoryMap = new Map<string, Category>();
  CATEGORIES.forEach((c, idx) =>
    categoryMap.set(c.slug, { ...c, name: c.title, id: c.id, displayOrder: idx })
  );
  if (sanityCategories && Array.isArray(sanityCategories)) {
    sanityCategories.forEach((c: Category) => {
      const slug = (typeof c.slug === "object" ? c.slug?.current : c.slug) || c._id;
      if (slug) {
        categoryMap.set(slug, {
          ...(categoryMap.get(slug) || {}),
          ...c,
          name: c.name || categoryMap.get(slug)?.name || c.title || "",
        });
      }
    });
  }
  const categories = Array.from(categoryMap.values());

  // Merge canonical products with Sanity products
  const productMap = new Map<string, Product>();
  PRODUCTS.forEach((p) => productMap.set(p.id, p));
  if (sanityProducts && Array.isArray(sanityProducts)) {
    sanityProducts.forEach((p: Product) => {
      const id = (typeof p.slug === "object" ? p.slug?.current : p.slug) || p._id || p.id;
      if (id) {
        productMap.set(id, { ...(productMap.get(id) || {}), ...p });
      }
    });
  }
  const products = Array.from(productMap.values());

  const brands: Brand[] = sanityBrands && sanityBrands.length > 0 ? sanityBrands : BRANDS;

  // Merge spaces
  const spaceMap = new Map<string, Space>();
  SPACES.forEach((s) => {
    const linkedCats = s.linkedCategorySlugs
      .map((catSlug) => categoryMap.get(catSlug))
      .filter((c): c is Category => Boolean(c));
    spaceMap.set(s.slug, {
      name: s.name,
      slug: s.slug,
      description: s.description,
      displayOrder: s.displayOrder,
      linkedCategories: linkedCats,
      linkedCategorySlugs: s.linkedCategorySlugs,
    });
  });

  if (sanitySpaces && Array.isArray(sanitySpaces) && sanitySpaces.length > 0) {
    sanitySpaces.forEach((s: Space) => {
      const slug = typeof s.slug === "string" ? s.slug : s.slug?.current;
      if (slug) {
        const existing = spaceMap.get(slug) || ({} as Space);
        const linkedCats = (s.linkedCategorySlugs || existing.linkedCategorySlugs || [])
          .map((catSlug) => categoryMap.get(catSlug))
          .filter((c): c is Category => Boolean(c));

        spaceMap.set(slug, {
          ...existing,
          ...s,
          slug,
          linkedCategories: linkedCats.length > 0 ? linkedCats : existing.linkedCategories,
        });
      }
    });
  }
  const spaces = Array.from(spaceMap.values()).sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[var(--surface)] flex items-center justify-center font-dmsans text-xs uppercase tracking-widest text-[var(--text-secondary)]">
          Loading collections...
        </div>
      }
    >
      <CollectionsClient
        categories={categories}
        subcategories={sanitySubcategories}
        products={products}
        brands={brands}
        spaces={spaces}
        liveCounts={counts}
        settings={settings}
      />
    </Suspense>
  );
}
