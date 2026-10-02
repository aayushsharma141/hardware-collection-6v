import React, { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";
import {
  getCategories,
  getAllProducts,
  getBrands,
  getSiteSettings,
} from "@/content/sanity/queries";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/content/fallback/catalog";
import { mergeCategories, mergeProducts } from "@/lib/collections/catalogue";
import { Category, Brand } from "@/types/catalog";
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

export default async function CollectionsPage() {
  const [sanityCategories, sanityProducts, sanityBrands, settings] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getBrands(),
    getSiteSettings(),
  ]);

  const categories = mergeCategories(CATEGORIES as unknown as Category[], sanityCategories);

  const products = mergeProducts(PRODUCTS, sanityProducts);

  const brands: Brand[] = sanityBrands && sanityBrands.length > 0 ? sanityBrands : BRANDS;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hardwarecollection.co/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": "https://hardwarecollection.co/collections"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="w-full min-h-screen bg-[var(--surface)] flex items-center justify-center font-dmsans text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Loading collections...
          </div>
        }
      >
        <CollectionsClient
          categories={categories}
          products={products}
          brands={brands}
          settings={settings}
        />
      </Suspense>
    </>
  );
}
