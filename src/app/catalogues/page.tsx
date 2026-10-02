import React, { Suspense } from "react";
import CatalogsClient from "./CatalogsClient";
import { getBrands, getSiteSettings } from "@/content/sanity/queries";
import { BRANDS } from "@/content/fallback/catalog";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";
import { Brand } from "@/types/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Hardware Catalogues | Hardware Collection Jamshedpur",
  },
  description:
    "Download official architectural hardware catalogues from Hafele, Blum, Dorset and other premium brands available at Hardware Collection, Sakchi, Jamshedpur.",
  alternates: {
    canonical: 'https://hardwarecollection.co/catalogues',
  },
};



export default async function CatalogsPage() {
  const sanityBrands = await getBrands();
  const settings = await getSiteSettings();

  let brands: Brand[] =
    sanityBrands && sanityBrands.length > 0
      ? sanityBrands
      : (BRANDS as unknown as Brand[]);

  if (settings?.authorizedBrandRefs?.length) {
    brands = brands.filter((b) =>
      settings.authorizedBrandRefs!.some(
        (ab: { slug?: string | { current?: string } }) =>
          (typeof ab.slug === "object" ? ab.slug?.current : ab.slug) === (typeof b.slug === "object" ? b.slug?.current : b.slug)
      )
    );
  }

  // Deduplicate by normalized key and inject fallback logo
  brands = Array.from(new Map(brands.map(b => {
    const normalizedKey = normalizeBrandKey(b);
    const enrichedBrand = { ...b };
    if (!enrichedBrand.logoUrl && CANONICAL_BRANDS_BY_ID[normalizedKey]?.logo) {
      enrichedBrand.logoUrl = CANONICAL_BRANDS_BY_ID[normalizedKey].logo;
    }
    return [normalizedKey, enrichedBrand];
  })).values());

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[var(--surface)] flex items-center justify-center font-dmsans text-xs uppercase tracking-widest text-[var(--text-secondary)]">Loading catalogues...</div>}>
      <CatalogsClient 
        brands={brands} 
        settings={settings}
      />
    </Suspense>
  );
}
