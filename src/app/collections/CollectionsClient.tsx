"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { MessageSquare } from "lucide-react";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import { Product, Category, Brand, SiteSettings, getSlugString } from "@/types/catalog";
import { useCollectionsState } from "@/hooks/useCollectionsState";
import { useConsultationStore } from "@/components/consultation/store";
import { buildGeneralInquiryWhatsappLink } from "@/lib/integrations/whatsapp";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";

import CollectionsHero from "@/components/collections/CollectionsHero";
import CollectionSearch from "@/components/collections/CollectionSearch";

import ShortlistPill from "@/components/collections/ShortlistPill";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";
import ProductCard from "@/components/collections/ProductCard";
import {
  categoryRails,
  groupProducts,
  productCategorySlug,
  sectionCategories,
  sectionDensity,
} from "@/lib/collections/showroom";
import { arrangeProducts } from "@/lib/collections/arrange";

export interface CollectionsClientProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  settings?: SiteSettings | null;
}

export default function CollectionsClient({
  categories,
  products,
  brands: rawBrands,
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
    activeBrandSlug,
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

  // Already a complete wa.me URL. Passing it through buildWhatsAppLink as well
  // wrapped the link inside another link's `text=`, so the customer's message
  // body was a URL rather than the greeting.
  const bottomConsultationWhatsapp = buildGeneralInquiryWhatsappLink(settings?.whatsappNumber);

  // Filters arrive from homepage links (?category=…, ?brand=…). The category is
  // compared by slug; products are never filtered on the display `category`
  // label, which Sanity products do not carry.
  const visibleProducts = products.filter((p) => {
    if (activeBrandSlug && !(p.brandName || p.brand || "").toLowerCase().includes(activeBrandSlug.toLowerCase())) {
      return false;
    }
    if (activeCategorySlug && productCategorySlug(p) !== activeCategorySlug) return false;
    return true;
  });
  // Product -> category -> `primaryRail` -> showroom family. The rail is the
  // CMS owner's own grouping, so the page has no table of its own.
  const rails = useMemo(() => categoryRails(categories), [categories]);
  const categoryNames = useMemo(
    () => new Map(categories.map((c) => [getSlugString(c.slug), c.name || c.title || ""] as const)),
    [categories]
  );
  const sections = groupProducts(visibleProducts, rails);

  return (
    <div className="hc-root min-h-screen w-full bg-[var(--surface)] text-[var(--text-primary)] selection:bg-[var(--color-brass)]/30 selection:text-white">
      <main className="w-full pb-24">
        {/* 1. Hero with Live Specimen & Brand Counts */}
        <CollectionsHero />

        {/* 2. Client-side Precision Search with Placeholder Rotation */}
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 mt-12 mb-8">
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

        {/* In-page navigation: one link per group that actually has products. */}
        {sections.length > 1 && (
          <nav
            aria-label="Showroom sections"
            className="w-full border-y border-[var(--border)] bg-[var(--surface-raised)]/90 py-0.5 sticky top-[76px] z-40 backdrop-blur-md mb-12"
          >
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 flex flex-nowrap gap-x-8 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="hc-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mr-2 shrink-0">EXPLORE</span>
              {sections.map(({ group }) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="hc-mono inline-flex min-h-11 items-center text-[10px] uppercase tracking-widest hover:text-[var(--color-brass)] transition-colors hc-focus shrink-0 whitespace-nowrap"
                >
                  {group.title}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Catalogue */}
        <section id="catalogue" className="w-full pb-24 scroll-mt-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-col mb-16 border-b border-[var(--border)] pb-8">
              <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass)] mb-3 block">
                COMPLETE COLLECTION
              </span>

              <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] mb-6">
                The Showroom Catalogue
              </h2>

              <p className="text-[var(--text-secondary)] font-light max-w-2xl text-base md:text-lg leading-relaxed mb-8">
                Explore architectural hardware across doors, kitchens, wardrobes, bathrooms and security.
              </p>

              {/* Active filters, set by links from the homepage */}
              {(activeCategorySlug || activeBrandSlug) && (
                <div className="flex flex-wrap items-center gap-3">
                  {activeBrandSlug && (
                    <Link
                      href={`?${activeCategorySlug ? `category=${activeCategorySlug}` : ""}#catalogue`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-ivory)] border border-[var(--border)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-[var(--color-brass)] transition-colors"
                      scroll={false}
                    >
                      {brands.find((b) => getSlugString(b.slug) === activeBrandSlug)?.name || activeBrandSlug}
                      <span className="text-[14px] leading-none mb-[2px]">×</span>
                    </Link>
                  )}
                  {activeCategorySlug && (
                    <Link
                      href={`?${activeBrandSlug ? `brand=${activeBrandSlug}` : ""}#catalogue`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-ivory)] border border-[var(--border)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-[var(--color-brass)] transition-colors"
                      scroll={false}
                    >
                      {categories.find((c) => getSlugString(c.slug) === activeCategorySlug)?.name || activeCategorySlug}
                      <span className="text-[14px] leading-none mb-[2px]">×</span>
                    </Link>
                  )}
                  <Link
                    href="?#catalogue"
                    scroll={false}
                    className="text-xs hc-mono tracking-widest uppercase border-b border-transparent text-[var(--color-brass)] hover:border-[var(--color-brass)] hover:text-[var(--text-primary)] transition-colors ml-2"
                  >
                    Clear All
                  </Link>
                </div>
              )}
            </div>

            {sections.length === 0 ? (
              <div className="py-24 text-center max-w-lg mx-auto">
                <h3 className="hc-serif text-2xl mb-4 text-[var(--text-primary)]">Nothing matched this combination.</h3>
                <p className="text-[var(--text-secondary)] font-light mb-8">
                  We couldn&apos;t find any products matching your current filters.
                </p>
                <Link
                  href="?#catalogue"
                  scroll={false}
                  className="hc-mono text-xs uppercase tracking-widest text-[var(--color-brass)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--color-brass)] pb-1"
                >
                  Browse Complete Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-24">
                {sections.map(({ group, products: items }, sectionIndex) => {
                  // Layout follows content: one product is a single quiet specimen, a
                  // handful a small composition, and a full stock a whole chapter.
                  const density = sectionDensity(items.length);
                  const vocabulary = sectionCategories(items, categoryNames, group.id);
                  return (
                    <section
                      key={group.id}
                      id={group.id}
                      aria-labelledby={`${group.id}-title`}
                      className={`scroll-mt-40 ${density === "specimen" ? "space-y-5" : "space-y-8"}`}
                    >
                      <div
                        className={`border-b border-[var(--border)] flex flex-col ${
                          density === "specimen" ? "pb-4" : "pb-6 mb-8"
                        }`}
                      >
                        <h3
                          id={`${group.id}-title`}
                          className="hc-mono text-[10px] text-[var(--color-brass)] uppercase tracking-[0.25em] mb-3 font-normal"
                        >
                          {String(sectionIndex + 1).padStart(2, "0")} / {group.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] font-light text-base md:text-lg">
                          {group.description}
                        </p>

                        {/* The detailed categories in this family, as vocabulary: choosing
                            one narrows the same page, it does not go anywhere else. */}
                        {vocabulary.length > 1 && (
                          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1" aria-label={`${group.title} collections`}>
                            {vocabulary.map((category) => (
                              <li key={category.slug}>
                                <Link
                                  href={`?category=${category.slug}#catalogue`}
                                  scroll={false}
                                  className="hc-mono hc-focus inline-flex min-h-11 items-center text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--color-brass)] transition-colors"
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Rows are planned so each one adds up to 12 columns: no gap beside a
                          featured card, whatever mix of products the section holds. */}
                      <div className="grid grid-cols-12 gap-4 sm:gap-6">
                        {arrangeProducts(items).map(({ product, lg, md }) => (
                          <ProductCard
                            key={product._id || product.id || product.name}
                            product={product}
                            lgSpan={lg}
                            mdSpan={md}
                            compact={density === "specimen"}
                            isShortlisted={shortlist.some((p) => (p._id || p.id) === (product._id || product.id))}
                            onSelect={(p) => handleProductSelect(p)}
                            displayImage={getProductDisplayImage(product)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
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
      <Footer
        settings={settings || undefined}
        brands={brands}
        showroomGroups={groupProducts(products, rails).map(({ group }) => ({ id: group.id, title: group.title }))}
      />
    </div>
  );
}

