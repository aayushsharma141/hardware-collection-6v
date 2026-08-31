"use client";

import React, { useState } from "react";
import Footer from "@/components/layout/Footer";
import CatalogLibrary from "@/components/catalog/CatalogLibrary";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import { AnimatePresence } from "motion/react";
import { Brand, ResolvedBrand, SiteSettings } from "@/types/catalog";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";

export interface CatalogsClientProps {
  brands: Brand[];
  settings?: SiteSettings | null;
}

export default function CatalogsClient({ brands, settings }: CatalogsClientProps) {
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | null>(null);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] hc-root font-dmsans selection:bg-[#c8a96e]/30 pt-[104px]">
      <main className="w-full">
        <div id="reference-library-section" className="w-full max-w-[1920px] mx-auto pb-6">
          <CatalogLibrary brands={brands || []} onSelectBrand={setSelectedCatalogBrand} />
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

