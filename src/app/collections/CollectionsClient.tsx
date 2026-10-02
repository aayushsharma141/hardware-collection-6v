"use client";

import React from "react";
import Link from "next/link";
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
import { useConsultationStore } from "@/components/consultation/store";
import { buildWhatsAppLink, buildGeneralInquiryWhatsappLink } from "@/lib/integrations/whatsapp";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";

import CollectionsHero from "@/components/collections/CollectionsHero";
import CollectionSearch from "@/components/collections/CollectionSearch";

import ShortlistPill from "@/components/collections/ShortlistPill";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";
import ProductCard from "@/components/collections/ProductCard";
import { INTENT_ZONES } from "@/content/fallback/intent";

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
  brands: rawBrands,
  liveCounts,
  settings,
}: CollectionsClientProps) {
  const brands = Array.from(new Map(rawBrands.map(b => {
    const normalizedKey = normalizeBrandKey(b);
    const enrichedBrand = { ...b };
    if (!enrichedBrand.logoUrl && CANONICAL_BRANDS_BY_ID[normalizedKey]?.logo) {
      enrichedBrand.logoUrl = CANONICAL_BRANDS_BY_ID[normalizedKey].logo;
    }
    return [normalizedKey, enrichedBrand];
  })).values());

  const { openDrawer } = useConsultationStore();

  const {
    activeCategorySlug,
    activeIntentId,
    activeBrandSlug,
    displayCategories,
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

  const bottomConsultationWhatsapp = buildWhatsAppLink(
    buildGeneralInquiryWhatsappLink(settings?.whatsappNumber),
    settings
  );

  return (
    <div className="hc-root min-h-screen w-full bg-[var(--surface)] text-[var(--text-primary)] selection:bg-[var(--color-brass)]/30 selection:text-white">
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

        {/* Quiet Discovery Bar */}
        <div className="w-full border-y border-[var(--border)] bg-[var(--surface-raised)] py-4 sticky top-0 z-40 backdrop-blur-md bg-[var(--surface-raised)]/90">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 flex flex-wrap gap-6 items-center justify-center md:justify-start">
            <span className="hc-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mr-2">EXPLORE</span>
            <Link href="#catalogue" scroll={false} className="hc-mono text-[10px] uppercase tracking-widest hover:text-[var(--color-brass)] transition-colors">ALL</Link>
            <Link href="?intent=door-entry#catalogue" scroll={false} className="hc-mono text-[10px] uppercase tracking-widest hover:text-[var(--color-brass)] transition-colors">DOOR</Link>
            <Link href="?intent=kitchen#catalogue" scroll={false} className="hc-mono text-[10px] uppercase tracking-widest hover:text-[var(--color-brass)] transition-colors">KITCHEN</Link>
            <Link href="?intent=wardrobe-furniture#catalogue" scroll={false} className="hc-mono text-[10px] uppercase tracking-widest hover:text-[var(--color-brass)] transition-colors">WARDROBE</Link>
            <Link href="?intent=glass-architectural#catalogue" scroll={false} className="hc-mono text-[10px] uppercase tracking-widest hover:text-[var(--color-brass)] transition-colors">BATHROOM</Link>
          </div>
        </div>



        {/* 7. Catalogue Exploration (Progressive Disclosure) */}
        <section id="catalogue" className="w-full py-12 scroll-mt-24">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col mb-12">
              <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass)] mb-3 block">
                Catalogue
              </span>
              
              {(() => {
                const intentName = activeIntentId ? INTENT_ZONES.find(z => z.id === activeIntentId)?.name : null;
                const catName = activeCategorySlug ? categories.find(c => getSlugString(c.slug) === activeCategorySlug)?.name : null;
                const brandName = activeBrandSlug ? brands.find(b => getSlugString(b.slug) === activeBrandSlug)?.name : null;
                
                let title = "Complete Collection";
                if (brandName && intentName) title = `${brandName} · ${intentName}`;
                else if (brandName && catName) title = `${brandName} · ${catName}`;
                else if (intentName) title = intentName;
                else if (catName) title = catName;
                else if (brandName) title = `${brandName} Collection`;

                return (
                  <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] mb-6 capitalize">
                    {title}
                  </h2>
                );
              })()}

              {/* Active Filters */}
              {(activeCategorySlug || activeIntentId || activeBrandSlug) && (
                <div className="flex flex-wrap items-center gap-3">
                  {activeBrandSlug && (
                    <Link 
                      href={`?${activeIntentId ? `intent=${activeIntentId}` : activeCategorySlug ? `category=${activeCategorySlug}` : ''}#catalogue`} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-ivory)] border border-[var(--border)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-[var(--color-brass)] transition-colors"
                      scroll={false}
                    >
                      {brands.find(b => getSlugString(b.slug) === activeBrandSlug)?.name || activeBrandSlug} 
                      <span className="text-[14px] leading-none mb-[2px]">×</span>
                    </Link>
                  )}
                  {activeIntentId && (
                    <Link 
                      href={`?${activeBrandSlug ? `brand=${activeBrandSlug}` : ''}#catalogue`} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-ivory)] border border-[var(--border)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-[var(--color-brass)] transition-colors"
                      scroll={false}
                    >
                      {INTENT_ZONES.find(z => z.id === activeIntentId)?.name || activeIntentId} 
                      <span className="text-[14px] leading-none mb-[2px]">×</span>
                    </Link>
                  )}
                  {activeCategorySlug && !activeIntentId && (
                    <Link 
                      href={`?${activeBrandSlug ? `brand=${activeBrandSlug}` : ''}#catalogue`} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-ivory)] border border-[var(--border)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-[var(--color-brass)] transition-colors"
                      scroll={false}
                    >
                      {categories.find(c => getSlugString(c.slug) === activeCategorySlug)?.name || activeCategorySlug} 
                      <span className="text-[14px] leading-none mb-[2px]">×</span>
                    </Link>
                  )}
                  
                  <Link href="?#catalogue" scroll={false} className="text-xs hc-mono tracking-widest uppercase border-b border-transparent text-[var(--color-brass)] hover:border-[var(--color-brass)] hover:text-[var(--text-primary)] transition-colors ml-2">
                    Clear All
                  </Link>
                </div>
              )}
            </div>

            {/* Display Categories / Grid */}
            {(() => {
              const filteredCategories = displayCategories.map((cat) => {
                if (!cat.products || cat.products.length === 0) return null;
                const catSlug = getSlugString(cat.slug);

                if (activeIntentId) {
                  const intentZone = INTENT_ZONES.find(z => z.id === activeIntentId);
                  if (intentZone) {
                    const intentCatSlugs = intentZone.keywords.map(k => {
                      const match = k.href.match(/category=([^&#]+)/);
                      return match ? match[1] : "";
                    });
                    if (!intentCatSlugs.some(s => s === catSlug || catSlug.includes(s) || s.includes(catSlug))) {
                      return null;
                    }
                  }
                }

                if (activeCategorySlug && catSlug !== activeCategorySlug && !catSlug.includes(activeCategorySlug)) return null;

                const filteredProducts = activeBrandSlug 
                  ? cat.products.filter(p => (p.brandName || p.brand || "").toLowerCase().includes(activeBrandSlug.toLowerCase()))
                  : cat.products;

                if (filteredProducts.length === 0) return null;

                return { ...cat, products: filteredProducts };
              }).filter(Boolean) as typeof displayCategories;

              if (filteredCategories.length === 0) {
                return (
                  <div className="py-24 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-ivory)] border border-[var(--border)] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--text-secondary)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="hc-serif text-2xl mb-4 text-[var(--text-primary)]">Nothing matched this combination.</h3>
                    <p className="text-[var(--text-secondary)] font-light mb-8">
                      We couldn&apos;t find any products matching your current filters.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                      {activeBrandSlug && (
                        <Link href={`?brand=${activeBrandSlug}#catalogue`} scroll={false} className="hc-mono text-xs uppercase tracking-widest text-[var(--color-brass)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--color-brass)] pb-1">
                          Explore all {brands.find(b => getSlugString(b.slug) === activeBrandSlug)?.name || activeBrandSlug}
                        </Link>
                      )}
                      <Link href="?#catalogue" scroll={false} className="hc-mono text-xs uppercase tracking-widest text-[var(--color-brass)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--color-brass)] pb-1">
                        Browse Complete Collection
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-24">
                  {filteredCategories.map((cat, categoryIndex) => {
                    const catSlug = getSlugString(cat.slug);
                    return (
                      <React.Fragment key={cat._id || catSlug}>
                        <div className="space-y-8 mt-12 md:mt-24 first:mt-0">
                          <div className="border-b border-[var(--border)] pb-6 mb-8 flex flex-col">
                            <span className="hc-mono text-[10px] text-[var(--color-brass)] uppercase tracking-[0.25em] mb-3">
                              {String(categoryIndex + 1).padStart(2, '0')}
                            </span>
                            <h3 className="hc-serif text-3xl md:text-4xl lg:text-5xl font-light text-[var(--text-primary)] uppercase">
                              {cat.name}
                            </h3>
                          </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {cat.products.map((product, idx) => (
                            <ProductCard
                              key={product._id || product.id || product.name}
                              product={product}
                              index={idx}
                              totalInCategory={cat.products.length}
                              isShortlisted={shortlist.some((p) => (p._id || p.id) === (product._id || product.id))}
                              onSelect={(p) => handleProductSelect(p)}
                              onToggleShortlist={toggleShortlist}
                              displayImage={getProductDisplayImage(product)}
                            />
                          ))}
                        </div>
                      </div>

                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>

        {/* 7. Bottom Showroom Consultation CTA */}
        <section id="collections-bottom-cta" className="py-16 border-t border-[var(--border)] bg-[var(--surface-raised)]">
          <div className="max-w-[1320px] mx-auto px-6 text-center">
            <MessageSquare
              className="w-8 h-8 text-[var(--color-brass)] mx-auto mb-4 opacity-80"
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
                className="rail-button hc-focus inline-flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-medium text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--color-brass)] rounded transition-colors duration-150"
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

