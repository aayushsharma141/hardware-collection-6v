import React, { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";
import {
  getCategories,
  getAllProducts,
  getBrands,
  getSiteSettings,
  getActiveOffers,
  getHeroManager,
} from "@/content/sanity/queries";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/content/fallback/catalog";
import { mergeCategories, mergeProducts } from "@/lib/collections/catalogue";
import { Category, Brand } from "@/types/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Hardware Collections | Door, Kitchen, Wardrobe | Jamshedpur",
  },
  description:
    "Explore curated architectural hardware collections in Sakchi, Jamshedpur. Premium door handles, digital locks, modular kitchen systems, and luxury fittings from top brands.",
  alternates: {
    canonical: 'https://www.hardwarecollection.co/collections',
  },
};

export default async function CollectionsPage() {
  const [sanityCategories, sanityProducts, sanityBrands, settings, offers, heroManager] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getBrands(),
    getSiteSettings(),
    getActiveOffers(),
    getHeroManager(),
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
        "item": "https://www.hardwarecollection.co/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": "https://www.hardwarecollection.co/collections"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionsClient
        categories={categories}
        products={products}
        brands={brands}
        offers={offers}
        settings={settings}
        heroManager={heroManager}
      />
    </>
  );
}
