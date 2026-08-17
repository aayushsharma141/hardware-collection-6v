import React, { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";
import { getCategories, getSubcategories, getAllProducts, getBrands, getSiteSettings } from "@/sanity/queries";

// Use Next.js revalidation strategy for Sanity content
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CollectionsPage() {
  const categories = await getCategories();
  const subcategories = await getSubcategories();
  const products = await getAllProducts();
  const brands = await getBrands();
  const settings = await getSiteSettings();

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center font-body text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Loading collections...</div>}>
      <CollectionsClient 
        categories={categories} 
        subcategories={subcategories}
        products={products} 
        brands={brands} 
        settings={settings}
      />
    </Suspense>
  );
}
