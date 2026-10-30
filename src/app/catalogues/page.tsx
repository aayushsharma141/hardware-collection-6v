import React from "react";
import CatalogsClient from "./CatalogsClient";
import { getBrands, getSiteSettings, getShowroomGroups } from "@/content/sanity/queries";
import { BRANDS } from "@/content/fallback/catalog";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";
import { Brand } from "@/types/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Brands & Catalogues | Authorized Hardware in Jamshedpur",
  },
  description:
    "Official architectural hardware catalogues and authorised brand directory for Häfele, Blum, Dorset, Hettich and global partners at Hardware Collection, Sakchi, Jamshedpur.",
  alternates: {
    canonical: 'https://www.hardwarecollection.co/catalogues',
  },
};

export default async function CatalogsPage() {
  const [sanityBrands, settings, showroomGroups] = await Promise.all([
    getBrands(),
    getSiteSettings(),
    getShowroomGroups(),
  ]);

  let brands: Brand[] =
    sanityBrands && sanityBrands.length > 0
      ? sanityBrands
      : (BRANDS as unknown as Brand[]);

  // Fail closed: only brands the owner approved in Business Settings are listed
  // or reachable through ?brand=. With no approved list the directory shows its
  // "being updated" state and a WhatsApp fallback instead of unverified claims.
  const authorizedSlugs = new Set(
    (settings?.authorizedBrandRefs ?? [])
      .map((ref) => ref.slug?.toLowerCase())
      .filter((slug): slug is string => Boolean(slug))
  );
  brands = brands.filter((b) => {
    const slug = typeof b.slug === "object" ? b.slug?.current : b.slug;
    return Boolean(slug && authorizedSlugs.has(slug.toLowerCase()));
  });

  // Deduplicate by normalized key and inject fallback logo
  brands = Array.from(new Map(brands.map(b => {
    const normalizedKey = normalizeBrandKey(b);
    const enrichedBrand = { ...b };
    if (!enrichedBrand.logoUrl && CANONICAL_BRANDS_BY_ID[normalizedKey]?.logo) {
      enrichedBrand.logoUrl = CANONICAL_BRANDS_BY_ID[normalizedKey].logo;
    }
    return [normalizedKey, enrichedBrand];
  })).values());

  const breadcrumbLd = {
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
        "name": "Brands & Catalogues",
        "item": "https://www.hardwarecollection.co/catalogues"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CatalogsClient
        brands={brands}
        settings={settings}
        showroomGroups={showroomGroups}
      />
    </>
  );
}
