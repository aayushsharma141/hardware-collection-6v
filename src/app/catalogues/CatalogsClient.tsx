"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import BrandsDirectoryView from "@/components/catalog/BrandsDirectoryView";
import { AnimatePresence } from "motion/react";
import { Brand, ResolvedBrand, SiteSettings } from "@/types/catalog";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";

export interface CatalogsClientProps {
  brands: Brand[];
  settings?: SiteSettings | null;
  /** Showroom groups with products, for the footer's collection links. */
  showroomGroups?: { id: string; title: string }[];
}

/**
 * Resolve the `?brand=` query parameter to a displayable brand.
 * Extracted so the mount-time initializer and the on-change adjustment share one
 * implementation — the two were previously duplicated, and the copy inside a
 * useEffect tripped react-hooks/set-state-in-effect.
 */
function resolveBrandFromParam(
  brandParam: string | null,
  brands: Brand[]
): ResolvedBrand | null {
  if (!brandParam) return null;
  const targetKey = brandParam.toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchedBrand = (brands || []).find((b) => normalizeBrandKey(b) === targetKey);
  const canonical = CANONICAL_BRANDS_BY_ID[targetKey];
  if (!matchedBrand && !canonical) return null;
  return {
    ...(matchedBrand || {}),
    name: canonical?.name || matchedBrand?.name || brandParam,
    logoUrl: matchedBrand?.logoUrl ?? matchedBrand?.logo ?? canonical?.logo ?? null,
    website: matchedBrand?.website ?? canonical?.website ?? null,
    tagline:
      matchedBrand?.tagline ?? canonical?.tagline ?? "Authorized Architectural Hardware Partner",
  };
}

export default function CatalogsClient({ brands, settings, showroomGroups }: CatalogsClientProps) {
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | null>(null);

  // Synchronize ?brand= query param without triggering SSG bailout
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const syncBrand = () => {
      const params = new URLSearchParams(window.location.search);
      const brandParam = params.get("brand");
      if (brandParam) {
        const nextBrand = resolveBrandFromParam(brandParam, brands);
        if (nextBrand) setSelectedCatalogBrand(nextBrand);
      }
    };

    syncBrand();
    window.addEventListener("popstate", syncBrand);
    return () => window.removeEventListener("popstate", syncBrand);
  }, [brands]);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] hc-root font-dmsans selection:bg-[var(--color-brass)]/30 pt-[104px]">
      <main className="w-full">
        <BrandsDirectoryView 
          brands={brands || []} 
          settings={settings}
          onSelectBrand={setSelectedCatalogBrand} 
          selectedBrandSlug={selectedCatalogBrand ? normalizeBrandKey(selectedCatalogBrand) : null}
        />

        {/* Contextual Cross-Link Bridge to Collections */}
        <div className="border-t border-[var(--border)] py-10 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">Showroom Collections</p>
            <p className="text-lg sm:text-xl font-light text-[var(--text-primary)] mt-1">Not sure which brand you need? Start with our curated spaces.</p>
          </div>
          <Link
            href="/collections"
            className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline inline-flex items-center gap-2 shrink-0"
          >
            <span>Explore Architectural Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Official Catalog Viewer Modal */}
      <AnimatePresence>
        {selectedCatalogBrand && (
          <CatalogViewerModal
            // Keyed by brand so switching brands opens a fresh viewer rather
            // than carrying the previous catalog's page and zoom across.
            key={normalizeBrandKey(selectedCatalogBrand)}
            brand={selectedCatalogBrand}
            onClose={() => setSelectedCatalogBrand(null)}
          />
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <Footer 
        settings={settings || undefined}
        brands={brands}
        showroomGroups={showroomGroups}
      />
    </div>
  );
}

