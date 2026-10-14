"use client";

import { SpotlightGlow, trackSpotlight } from "@/components/ui/Spotlight";
import React, { useState, useSyncExternalStore, useEffect, useCallback } from "react";
import { LazyImage as Image } from "@/components/ui/lazy-image";
import { ArrowRight, BookOpen, ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import { Product } from "@/types/catalog";
import {
  familyForAnchor,
  type FamilyCategory,
  type ShowroomSection,
} from "@/lib/collections/showroom";
import { Button } from "@/components/ui/button";
import CategoryDetailModal from "./CategoryDetailModal";

/** A brand whose catalogue has pages for a category, ready to render as a link to the best one. */
export interface CategoryBrandChip {
  key: string;
  name: string;
  logo?: string;
  href: string;
  /** Best-matching page in the brand's catalogue. */
  bestPage: number;
  /** Other pages in that catalogue that matched. */
  morePages: number;
}

export interface CollectionExplorerProps {
  sections: ShowroomSection<Product>[];
  familyCategories: ReadonlyMap<string, FamilyCategory[]>;
  familyImage: (familyId: string, products: Product[]) => string | undefined;
  categoryBrands: ReadonlyMap<string, CategoryBrandChip[]>;
  /** Products entered in the CMS under each category slug (featured first). */
  categoryProducts: ReadonlyMap<string, Product[]>;
  /** False when catalogue search is not configured or unreachable, so brand rows cannot be shown. */
  catalogueSearchAvailable: boolean;
  getImage: (product: Product) => string;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  enquiryHref: (label: string) => string;
  catalogueHrefFor: (brandName: string) => string | undefined;
  activeProduct: Product | null;
  groupIdOf: (product: Product) => string;
}

/* ── hash-based deep linking ─────────────────────────────────────────── */
function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const readHash = () => (typeof window !== "undefined" ? window.location.hash.slice(1) : "");
const readServerHash = () => "";

export default function CollectionExplorer({
  sections,
  familyCategories,
  familyImage,
  categoryBrands,
  categoryProducts,
  catalogueSearchAvailable,
  getImage,
  onOpenProduct,
  enquiryHref,
}: CollectionExplorerProps) {
  const hash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);
  const defaultFamily = sections[0]?.group.id ?? null;
  const hashFamily = familyForAnchor(hash);
  const activeHashFamily = hashFamily && sections.some((s) => s.group.id === hashFamily) ? hashFamily : null;

  const [userToggled, setUserToggled] = useState<Map<string, boolean>>(() => new Map());

  const [activeCategoryModal, setActiveCategoryModal] = useState<{
    category: FamilyCategory;
    familyTitle: string;
  } | null>(null);

  // Cross-component listener from hero "Explore" button
  useEffect(() => {
    const onOpenShowroomFamily = (e: Event) => {
      const customEvent = e as CustomEvent<{ familyId: string }>;
      const id = customEvent.detail?.familyId;
      if (id && sections.some((s) => s.group.id === id)) {
        setUserToggled((prev) => {
          const next = new Map(prev);
          next.set(id, true);
          return next;
        });
      }
    };
    window.addEventListener("open-showroom-family", onOpenShowroomFamily);
    return () => window.removeEventListener("open-showroom-family", onOpenShowroomFamily);
  }, [sections]);

  const isFamilyOpen = useCallback(
    (familyId: string) => {
      if (userToggled.has(familyId)) {
        return userToggled.get(familyId)!;
      }
      return familyId === activeHashFamily || familyId === defaultFamily;
    },
    [userToggled, activeHashFamily, defaultFamily]
  );

  const toggleFamily = useCallback(
    (familyId: string, forcedState?: boolean) => {
      let willOpen = false;
      setUserToggled((prev) => {
        const currentlyOpen = prev.has(familyId)
          ? prev.get(familyId)!
          : familyId === activeHashFamily || familyId === defaultFamily;
        const shouldOpen = forcedState !== undefined ? forcedState : !currentlyOpen;
        willOpen = shouldOpen;
        const next = new Map(prev);
        next.set(familyId, shouldOpen);
        return next;
      });

      if (willOpen && typeof window !== "undefined" && window.location.hash !== `#${familyId}`) {
        window.history.replaceState(null, "", `#${familyId}`);
      }
    },
    [activeHashFamily, defaultFamily]
  );

  if (sections.length === 0) return null;

  return (
    <section className="w-full bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 py-12 md:py-20">
        {/* Section Header */}
        <div className="mb-10 md:mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] block mb-3">
            Showroom Taxonomy
          </span>
          <h2 className="hc-serif text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)] leading-[1.1] font-normal tracking-tight max-w-2xl text-balance">
            Find the hardware
            <br />
            for your space.
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-[var(--text-secondary)] font-light max-w-lg">
            Explore our curated collections by application. Expand any space to see the full category specification.
          </p>
          {!catalogueSearchAvailable && (
            <p
              role="status"
              className="mt-5 max-w-xl text-[13px] text-[var(--text-secondary)] font-light border-l-2 border-[var(--color-brass)] pl-3"
            >
              Brand matching from our catalogues is temporarily unavailable. Ask us on WhatsApp which brands supply a product.
            </p>
          )}
        </div>

        {/* 7 Canonical Showroom Families Rendered in Server HTML */}
        <div className="w-full border-t border-[var(--border)] flex flex-col">
          {sections.map((section, index) => {
            const image = familyImage(section.group.id, section.products);
            const numStr = String(index + 1).padStart(2, "0");
            const isOpen = isFamilyOpen(section.group.id);
            const categories = familyCategories.get(section.group.id) ?? [];

            return (
              <details
                key={section.group.id}
                id={section.group.id}
                open={isOpen}
                className="group border-b border-[var(--border)] overflow-hidden transition-colors"
              >
                <summary
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFamily(section.group.id);
                  }}
                  className="list-none flex flex-row items-stretch w-full min-h-[88px] md:min-h-[110px] text-left cursor-pointer hover:bg-black/[0.015] transition-colors duration-300 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {/* Left Metadata & Title */}
                  <div className="flex-1 flex flex-row items-center gap-4 sm:gap-6 pl-1 pr-4 sm:pr-8 py-4">
                    <span className="hc-mono text-[11px] text-[var(--color-brass)] font-medium shrink-0 w-6 text-right tabular-nums">
                      {numStr}
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span
                        className={`hc-serif text-xl sm:text-2xl md:text-[28px] transition-colors truncate ${
                          isOpen ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        {section.group.title}
                      </span>
                      <span className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-light tracking-wide truncate">
                        {section.group.tagline}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-3 shrink-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)] hidden sm:inline-block">
                        {isOpen ? "Collapse" : "Explore"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Right Image Thumbnail */}
                  <div className="w-[32%] sm:w-[30%] md:w-[28%] lg:w-[24%] shrink-0 relative bg-[var(--surface-elevated)] overflow-hidden">
                    {image && (
                      <Image
                        src={image}
                        alt={section.group.title}
                        fill
                        sizes="(min-width: 1024px) 24vw, (min-width: 768px) 28vw, 32vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>
                </summary>

                {/* Expanded Family Detail & Crawlable Category Directory */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="pt-6 pb-12 px-2 sm:px-6 md:px-8 bg-[var(--surface)]">
                      <div className="max-w-3xl mb-8">
                        <p className="text-[15px] sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                          {section.group.description}
                        </p>
                      </div>

                  {/* Use-Case & Category Cards */}
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
                      {categories.map((category, catIndex) => {
                        const catNumStr = String(catIndex + 1).padStart(2, "0");
                        const brands = categoryBrands.get(category.slug) ?? [];
                        const products = categoryProducts.get(category.slug) ?? [];

                        return (
                          <div
                            key={category.slug}
                            onPointerMove={trackSpotlight}
                            className="hc-spot hc-press-card group/card flex flex-col text-left rounded-2xl border border-[var(--border)] bg-white hover:border-[var(--accent)]/40 hover:shadow-[0_12px_32px_-16px_rgba(26,16,23,0.18)] overflow-hidden"
                          >
                            <SpotlightGlow />
                            {/* Category Image - Opens Detail Modal */}
                            <button
                              type="button"
                              onClick={() =>
                                setActiveCategoryModal({
                                  category,
                                  familyTitle: section.group.title,
                                })
                              }
                              aria-label={`View ${category.name} specification and brand catalogues`}
                              className="w-full aspect-[4/3] bg-[var(--surface-elevated)] relative overflow-hidden border-b border-[var(--border)] text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent)] outline-none"
                            >
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                                  className="object-cover group-hover/card:scale-[1.045] transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-[var(--surface-elevated)]" />
                              )}
                            </button>

                            {/* Card Body */}
                            <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
                              <span className="hc-mono text-[10px] text-[var(--color-brass)] font-medium">
                                {catNumStr}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveCategoryModal({
                                    category,
                                    familyTitle: section.group.title,
                                  })
                                }
                                className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent)] outline-none"
                              >
                                <span className="hc-serif text-base sm:text-lg text-[var(--text-primary)] group-hover/card:text-[var(--accent)] transition-colors leading-snug line-clamp-1">
                                  {category.name}
                                </span>
                              </button>
                              {category.blurb && (
                                <p className="text-[12px] text-[var(--text-secondary)] font-light line-clamp-2 leading-relaxed">
                                  {category.blurb}
                                </p>
                              )}

                              {/* Specimen & Brand Count Teasers */}
                              {(brands.length > 0 || products.length > 0) && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1 mt-auto">
                                  {brands.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--surface-elevated)] px-2 py-0.5 border border-[var(--border)]">
                                      <BookOpen className="w-3 h-3 text-[var(--color-brass)] shrink-0" />
                                      <span>
                                        {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
                                      </span>
                                    </span>
                                  )}
                                  {products.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--color-brass)] bg-[var(--surface-elevated)] px-2 py-0.5 border border-[var(--border)]">
                                      <Sparkles className="w-3 h-3 shrink-0" />
                                      <span>
                                        {products.length} {products.length === 1 ? "Specimen" : "Specimens"}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Card Actions: Primary Explore Range modal trigger + Direct Enquire */}
                              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveCategoryModal({
                                      category,
                                      familyTitle: section.group.title,
                                    })
                                  }
                                  className="min-h-11 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:opacity-80 transition-opacity cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                >
                                  <span>Explore Range</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
                                </button>

                                <a
                                  href={enquiryHref(category.name)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="min-h-11 flex items-center text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                >
                                  Enquire
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)] font-light mb-8">
                      Full catalogue samples and finishes available on display at our Sakchi showroom.
                    </p>
                  )}

                  {/* WhatsApp Consultation Banner */}
                  <div className="w-full border border-[var(--border)] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="hc-serif text-2xl sm:text-3xl text-[var(--text-primary)]">
                        Need guidance on {section.group.title}?
                      </h3>
                      <p className="text-[14px] text-[var(--text-secondary)] font-light max-w-md">
                        Share your drawings or requirement with our Sakchi showroom team on WhatsApp.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-[var(--accent)] hover:opacity-90 text-white h-12 rounded-full px-6 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors shrink-0"
                    >
                      <a
                        href={enquiryHref(section.group.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ask an expert on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </details>
            );
          })}
        </div>
      </div>

      {/* Architectural Subcategory Detail Modal */}
      <CategoryDetailModal
        isOpen={activeCategoryModal !== null}
        onClose={() => setActiveCategoryModal(null)}
        category={activeCategoryModal?.category ?? null}
        familyTitle={activeCategoryModal?.familyTitle ?? ""}
        products={
          activeCategoryModal
            ? (categoryProducts.get(activeCategoryModal.category.slug) ?? [])
            : []
        }
        brands={
          activeCategoryModal
            ? (categoryBrands.get(activeCategoryModal.category.slug) ?? [])
            : []
        }
        onOpenProduct={onOpenProduct}
        enquiryHref={enquiryHref}
        getImage={getImage}
      />
    </section>
  );
}
