"use client";

import React, { useMemo } from "react";
import Footer from "@/components/layout/Footer";
import { MessageSquare } from "lucide-react";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import {
  Product,
  Category,
  Subcategory,
  Brand,
  Space,
  SiteSettings,
  getSlugString,
} from "@/types/catalog";
import { useCollectionsState } from "@/hooks/useCollectionsState";
import { selectFeaturedCategories } from "@/lib/collections/tiers";
import { useConsultationStore } from "@/components/consultation/store";
import { buildWhatsAppLink, buildGeneralInquiryWhatsappLink } from "@/lib/integrations/whatsapp";

import CollectionsHero from "@/components/collections/CollectionsHero";
import CollectionSearch from "@/components/collections/CollectionSearch";
import SpaceIntentRail from "@/components/collections/SpaceIntentRail";
import FeaturedChapters from "@/components/collections/FeaturedChapters";
import CompactCollectionGrid from "@/components/collections/CompactCollectionGrid";
import CollectionIndex from "@/components/collections/CollectionIndex";
import BrandDiscovery from "@/components/collections/BrandDiscovery";
import ShortlistPill from "@/components/collections/ShortlistPill";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";

export interface CollectionsClientProps {
  categories: Category[];
  subcategories?: Subcategory[];
  products: Product[];
  brands: Brand[];
  spaces?: Space[];
  liveCounts?: { categoryCount?: number; brandCount?: number };
  settings?: SiteSettings | null;
}

export default function CollectionsClient({
  categories,
  products,
  brands,
  spaces = [],
  liveCounts,
  settings,
}: CollectionsClientProps) {
  const { openDrawer } = useConsultationStore();

  const {
    selectedProduct,
    handleProductSelect,
    shortlist,
    setShortlist,
    toggleShortlist,
    shortlistToast,
    getProductDisplayImage,
    getWhatsAppShortlistLink,
  } = useCollectionsState({
    categories,
    products,
    brands,
    settings,
  });

  // Segregate Featured Chapters (Tier 1, capped at 5) vs Tier 2 compact grid
  const featuredCats = useMemo(
    () =>
      selectFeaturedCategories(
        categories.map((c) => ({
          ...c,
          slug: getSlugString(c.slug),
        }))
      ),
    [categories]
  );
  const featuredSlugs = useMemo(
    () => new Set(featuredCats.map((c) => getSlugString(c.slug))),
    [featuredCats]
  );
  const tier2Categories = useMemo(
    () => categories.filter((c) => !featuredSlugs.has(getSlugString(c.slug))),
    [categories, featuredSlugs]
  );

  const bottomConsultationWhatsapp = buildWhatsAppLink(
    buildGeneralInquiryWhatsappLink(settings?.whatsappNumber),
    settings
  );

  return (
    <div className="hc-root min-h-screen w-full bg-[var(--surface)] text-[var(--text-primary)] selection:bg-[#c8a96e]/30 selection:text-white">
      <main className="w-full pb-24 space-y-16 md:space-y-24">
        {/* 1. Hero with Live Specimen & Brand Counts */}
        <CollectionsHero
          collectionCount={Math.max(liveCounts?.categoryCount || 0, categories.length)}
          brandCount={liveCounts?.brandCount || brands.length}
          whatsappNumber={settings?.whatsappNumber}
        />

        {/* 2. Client-side Precision Search with Placeholder Rotation */}
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <CollectionSearch
            products={products}
            categories={categories}
            brands={brands}
            whatsappNumber={settings?.whatsappNumber}
            onSelect={(item) => {
              if (item.kind === "product") {
                const prod = products.find(
                  (p) => getSlugString(p.slug) === item.slug || (p._id || p.id) === item.slug
                );
                if (prod) handleProductSelect(prod);
              }
            }}
          />
        </div>

        {/* 3. Space-led Discovery Rail (Horizontal Scroll-Snap) */}
        {spaces.length > 0 && (
          <SpaceIntentRail spaces={spaces} />
        )}

        {/* 4. Tier-1 Featured Chapters (Cinematic Alternating Layout) */}
        {featuredCats.length > 0 && (
          <FeaturedChapters categories={categories} />
        )}

        {/* 5. Tier-2 Compact Collection Grid */}
        {tier2Categories.length > 0 && (
          <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="mb-8">
              <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-1 block">
                CATALOGUE SPECTRUM
              </span>
              <h2 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)]">
                All Architectural Hardware Collections
              </h2>
            </div>
            <CompactCollectionGrid categories={tier2Categories} />
          </div>
        )}

        {/* 6. Complete Numbered Editorial Index */}
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-6">
            <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-1 block">
              TAXONOMY INDEX
            </span>
            <h2 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)]">
              Complete Collections Index
            </h2>
          </div>
          <CollectionIndex categories={categories} />
        </div>

        {/* 7. Authorized Brand Discovery & Static Wall */}
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
          <BrandDiscovery brands={brands} />
        </div>

        {/* 8. Bottom Showroom Consultation CTA */}
        <section id="collections-bottom-cta" className="py-16 border-t border-[var(--border)] bg-[var(--surface-raised)]">
          <div className="max-w-[1320px] mx-auto px-6 text-center">
            <MessageSquare
              className="w-8 h-8 text-[#c8a96e] mx-auto mb-4 opacity-80"
              aria-hidden="true"
            />
            <h3 className="hc-serif text-3xl sm:text-4xl font-normal tracking-[0.02em] text-[var(--text-primary)] mb-3">
              Planning an Architectural Project in Jamshedpur?
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Visit our Sakchi showroom with your site plans, or consult with our technical team directly on WhatsApp for sizing, samples, and finish schedules.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  openDrawer({
                    source: "collections",
                    intent: "consultation",
                  })
                }
                className="brass-plate hc-focus inline-flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-medium text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
              >
                BOOK SHOWROOM CONSULTATION
              </button>
              <a
                href={bottomConsultationWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-button hc-focus inline-flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-medium text-[var(--text-primary)] border border-[var(--border)] hover:border-[#c8a96e] rounded transition-colors duration-150"
              >
                CONSULT ON WHATSAPP
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Shortlist Pill */}
      <ShortlistPill
        shortlist={shortlist}
        shortlistToast={shortlistToast}
        whatsappLink={getWhatsAppShortlistLink()}
        onClear={() => setShortlist([])}
      />

      {/* Lookbook Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => handleProductSelect(null)}
        shortlist={shortlist}
        onToggleShortlist={toggleShortlist}
        displayImage={selectedProduct ? getProductDisplayImage(selectedProduct) : ""}
      />

      <FloatingConsultationCapsule hasShortlist={shortlist.length > 0} />

      {/* Global Footer */}
      <Footer settings={settings || undefined} brands={brands} />
    </div>
  );
}

