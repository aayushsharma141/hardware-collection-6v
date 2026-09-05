"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import CatalogLibrary from "@/components/catalog/CatalogLibrary";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import { AnimatePresence } from "motion/react";
import { Brand, ResolvedBrand, SiteSettings } from "@/types/catalog";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";

export interface CatalogsClientProps {
  brands: Brand[];
  settings?: SiteSettings | null;
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

export default function CatalogsClient({ brands, settings }: CatalogsClientProps) {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");

  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | null>(() =>
    resolveBrandFromParam(brandParam, brands)
  );

  // Synchronize ?brand= with the selected brand by adjusting state during render rather
  // than in an effect — the same pattern useCollectionsState.ts uses for its own
  // searchParams sync, and what React recommends over a setState-in-effect.
  // Only re-resolves when the param actually changes, so closing the modal does not
  // reopen it while ?brand= is still in the URL. A resolution that finds nothing leaves
  // the current selection untouched, matching the previous behaviour.
  const [prevBrandParam, setPrevBrandParam] = useState(brandParam);
  if (prevBrandParam !== brandParam) {
    setPrevBrandParam(brandParam);
    const nextBrand = resolveBrandFromParam(brandParam, brands);
    if (nextBrand && normalizeBrandKey(nextBrand) !== (selectedCatalogBrand ? normalizeBrandKey(selectedCatalogBrand) : null)) {
      setSelectedCatalogBrand(nextBrand);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] hc-root font-dmsans selection:bg-[#c8a96e]/30 pt-[104px]">
      <main className="w-full">
        <div id="reference-library-section" className="w-full max-w-[1920px] mx-auto pb-6">
          <CatalogLibrary 
            brands={brands || []} 
            onSelectBrand={setSelectedCatalogBrand} 
            selectedBrandSlug={brandParam}
          />
        </div>
      </main>

      {/* Official Catalog Viewer Modal */}
      <AnimatePresence>
        {selectedCatalogBrand && (
          <CatalogViewerModal 
            brand={selectedCatalogBrand} 
            onClose={() => setSelectedCatalogBrand(null)} 
          />
        )}
      </AnimatePresence>

      <FloatingConsultationCapsule />

      {/* Global Footer */}
      <Footer 
        settings={settings || undefined}
        brands={brands}
      />
    </div>
  );
}

