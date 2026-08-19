import React, { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";
import { getCategories, getSubcategories, getAllProducts, getBrands, getSiteSettings } from "@/sanity/queries";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/data/catalog";

// Use Next.js revalidation strategy for Sanity content
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CollectionsPage() {
  const sanityCategories = await getCategories();
  const sanitySubcategories = await getSubcategories();
  const sanityProducts = await getAllProducts();
  const sanityBrands = await getBrands();
  const settings = await getSiteSettings();

  // Merge 13 canonical categories with any Sanity-fetched categories
  const categoryMap = new Map<string, any>();
  CATEGORIES.forEach(c => categoryMap.set(c.slug, { ...c, name: c.title }));
  if (sanityCategories && Array.isArray(sanityCategories)) {
    sanityCategories.forEach(c => {
      const slug = c.slug?.current || c.slug || c._id;
      if (slug) {
        categoryMap.set(slug, { ...(categoryMap.get(slug) || {}), ...c, name: c.name || categoryMap.get(slug)?.name || c.title });
      }
    });
  }
  const categories = Array.from(categoryMap.values());

  // Merge canonical products with Sanity products
  const productMap = new Map<string, any>();
  PRODUCTS.forEach(p => productMap.set(p.id, p));
  if (sanityProducts && Array.isArray(sanityProducts)) {
    sanityProducts.forEach(p => {
      const id = p.slug || p._id || p.id;
      if (id) {
        productMap.set(id, { ...(productMap.get(id) || {}), ...p });
      }
    });
  }
  const products = Array.from(productMap.values());

  const brands = sanityBrands && sanityBrands.length > 0 ? sanityBrands : BRANDS;

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#0E0C0C] flex items-center justify-center font-dmsans text-xs uppercase tracking-widest text-[#A39E93]">Loading collections...</div>}>
      <CollectionsClient 
        categories={categories} 
        subcategories={sanitySubcategories}
        products={products} 
        brands={brands} 
        settings={settings}
      />
    </Suspense>
  );
}

