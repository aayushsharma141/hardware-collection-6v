import React, { Suspense } from "react";
import CatalogsClient from "./CatalogsClient";
import { getBrands, getSiteSettings } from "@/sanity/queries";
import { BRANDS } from "@/data/catalog";
import { Brand } from "@/types/catalog";

export const revalidate = 60;

export default async function CatalogsPage() {
  const sanityBrands = await getBrands();
  const settings = await getSiteSettings();

  const brands: Brand[] = sanityBrands && sanityBrands.length > 0 ? sanityBrands : [];

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#0E0C0C] flex items-center justify-center font-dmsans text-xs uppercase tracking-widest text-[#A39E93]">Loading catalogs...</div>}>
      <CatalogsClient 
        brands={brands} 
        settings={settings}
      />
    </Suspense>
  );
}
