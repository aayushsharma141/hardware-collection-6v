"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import CatalogViewerModal, { type CatalogueMatchContext } from "@/components/catalog/CatalogViewerModal";
import BrandsDirectoryView from "@/components/catalog/BrandsDirectoryView";
import { AnimatePresence } from "motion/react";
import { Brand, ResolvedBrand, SiteSettings } from "@/types/catalog";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";
import { parseMatchParams } from "@/lib/catalog/search/matchLink";

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
  // `brands` is already limited to the owner-approved list, so a canonical
  // brand that is not in it must not resolve from a guessed ?brand= value.
  if (!matchedBrand) return null;
  return {
    ...(matchedBrand || {}),
    name: canonical?.name || matchedBrand?.name || brandParam,
    logoUrl: matchedBrand?.logoUrl ?? matchedBrand?.logo ?? canonical?.logo ?? null,
    website: matchedBrand?.website ?? canonical?.website ?? null,
    tagline:
      matchedBrand?.tagline ?? canonical?.tagline ?? "Authorized Architectural Hardware Partner",
  };
}

/**
 * The /collections match context on the URL (`cat`, `page`, `pages`, `q`, `v`),
 * kept only if it still describes the PDF this brand serves at that position.
 * A link made before the catalogue was replaced opens the catalogue normally
 * rather than at a page number that now belongs to a different file.
 */
function resolveMatchFromParams(params: URLSearchParams, brand: ResolvedBrand): CatalogueMatchContext | null {
  const parsed = parseMatchParams(params, brand.catalogues?.length ?? 0);
  if (!parsed) return null;
  const served = brand.catalogues?.[parsed.catalogue]?.pdfVersion;
  if (!served || !parsed.version || served !== parsed.version) return null;
  return { catalogue: parsed.catalogue, page: parsed.page, query: parsed.query, pages: parsed.pages };
}

export default function CatalogsClient({ brands, settings, showroomGroups }: CatalogsClientProps) {
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | null>(null);
  const [match, setMatch] = useState<CatalogueMatchContext | null>(null);

  // Synchronize ?brand= query param without triggering SSG bailout
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const syncBrand = () => {
      const params = new URLSearchParams(window.location.search);
      const brandParam = params.get("brand");
      if (brandParam) {
        const nextBrand = resolveBrandFromParam(brandParam, brands);
        if (nextBrand) {
          setSelectedCatalogBrand(nextBrand);
          setMatch(resolveMatchFromParams(params, nextBrand));
        }
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
          onSelectBrand={(brand) => {
            setMatch(null);
            setSelectedCatalogBrand(brand);
          }}
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
            key={`${normalizeBrandKey(selectedCatalogBrand)}:${match ? `${match.catalogue}-${match.page}` : ""}`}
            brand={selectedCatalogBrand}
            match={match}
            onClose={() => {
              setSelectedCatalogBrand(null);
              setMatch(null);
            }}
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

