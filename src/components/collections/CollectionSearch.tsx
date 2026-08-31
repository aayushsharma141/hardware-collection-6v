"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, X, Compass } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Category, Product, Brand, getSlugString } from "@/types/catalog";
import {
  buildWhatsAppLink,
  buildSearchZeroResultMessage,
} from "@/lib/integrations/whatsapp";
import { useConsultationStore } from "@/components/consultation/store";

export interface CollectionSearchProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  whatsappNumber?: string;
  onSelect?: (item: { kind: "category" | "product" | "brand"; slug: string }) => void;
}

const PLACEHOLDERS = [
  'Try "digital lock"',
  'Try "Hafele kitchen"',
  'Try "wardrobe sliding"',
  'Try "door handle"',
];

export default function CollectionSearch({
  categories,
  products,
  brands,
  whatsappNumber,
  onSelect,
}: CollectionSearchProps) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openDrawer } = useConsultationStore();

  // Debounce keystrokes (150ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 150);
    return () => clearTimeout(handler);
  }, [query]);

  // Rotate placeholder (suppressed under reduced motion)
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // In-memory pure client search (T-9-01)
  const results = useMemo(() => {
    if (!debouncedQuery) {
      return { categories: [], products: [], brands: [], total: 0 };
    }

    const q = debouncedQuery;

    const matchedCategories = categories
      .filter((c) => {
        const name = (c.name || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        const slug = getSlugString(c.slug).toLowerCase();
        const keywords = Array.isArray(c.searchKeywords)
          ? c.searchKeywords.map((k) => (k || "").toLowerCase())
          : [];
        return (
          name.includes(q) ||
          desc.includes(q) ||
          slug.includes(q) ||
          keywords.some((k) => k.includes(q))
        );
      })
      .slice(0, 4);

    const matchedProducts = products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brandName || p.brand || "").toLowerCase();
        const desc = (p.shortDescription || p.description || "").toLowerCase();
        const model = (p.catalogReference || p.model || "").toLowerCase();
        const keywords = Array.isArray(p.searchKeywords)
          ? p.searchKeywords.map((k) => (k || "").toLowerCase())
          : [];
        return (
          name.includes(q) ||
          brand.includes(q) ||
          desc.includes(q) ||
          model.includes(q) ||
          keywords.some((k) => k.includes(q))
        );
      })
      .slice(0, 6);

    const matchedBrands = brands
      .filter((b) => {
        const name = (b.name || "").toLowerCase();
        const desc = (b.description || "").toLowerCase();
        const slug = getSlugString(b.slug).toLowerCase();
        return name.includes(q) || desc.includes(q) || slug.includes(q);
      })
      .slice(0, 4);

    const total =
      matchedCategories.length + matchedProducts.length + matchedBrands.length;

    return {
      categories: matchedCategories,
      products: matchedProducts,
      brands: matchedBrands,
      total,
    };
  }, [debouncedQuery, categories, products, brands]);

  const hasQuery = query.length > 0;
  const showResults = isFocused && hasQuery;
  const whatsappUrl = buildWhatsAppLink(
    buildSearchZeroResultMessage(query),
    whatsappNumber ? { whatsappNumber } : undefined
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-8">
      {/* Search Input Container */}
      <div
        className={`relative flex items-center w-full bg-[var(--surface-raised)] rounded-lg border transition-colors duration-150 ${
          isFocused ? "border-[var(--accent)] ring-1 ring-[#c8a96e]" : "border-white/[0.12]"
        }`}
      >
        <Search
          className="w-4 h-4 text-[var(--accent)] ml-4 shrink-0 pointer-events-none"
          aria-hidden="true"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          aria-label="Search collections, products and brands"
          className="w-full px-3.5 py-3 bg-transparent text-sm text-[var(--text-primary)] placeholder-[#aaa49a]/60 focus:outline-none hc-focus"
        />

        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="p-2 mr-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150 hc-focus rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown Panel */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--surface-raised)] border border-white/[0.12] rounded-lg shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
          {results.total > 0 ? (
            <div className="p-4 space-y-6">
              {/* Group: Collections */}
              {results.categories.length > 0 && (
                <div>
                  <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] px-3 mb-2 block">
                    Collections ({results.categories.length})
                  </span>
                  <div className="divide-y divide-white/[0.04]">
                    {results.categories.map((cat) => {
                      const slug = getSlugString(cat.slug);
                      return (
                        <Link
                          key={cat._id || cat.id || slug}
                          href={`/collections/${slug}`}
                          onClick={() => {
                            setIsFocused(false);
                            onSelect?.({ kind: "category", slug });
                          }}
                          className="flex items-center justify-between px-3 py-2.5 rounded hover:bg-white/[0.04] transition-colors duration-150 group hc-focus"
                        >
                          <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                            {cat.name}
                          </span>
                          <span className="text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                            View Collection â†’
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group: Products */}
              {results.products.length > 0 && (
                <div>
                  <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] px-3 mb-2 block">
                    Products ({results.products.length})
                  </span>
                  <div className="divide-y divide-white/[0.04]">
                    {results.products.map((prod) => {
                      const catSlug = prod.categorySlug || prod.category || "";
                      return (
                        <Link
                          key={prod._id || prod.id || prod.name}
                          href={`/collections/${catSlug}`}
                          onClick={() => {
                            setIsFocused(false);
                            onSelect?.({ kind: "product", slug: catSlug });
                          }}
                          className="flex items-center justify-between px-3 py-2.5 rounded hover:bg-white/[0.04] transition-colors duration-150 group hc-focus"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                              {prod.name}
                            </span>
                            {prod.brand && (
                              <span className="text-xs text-[var(--text-secondary)]/70">
                                {prod.brand}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore â†’
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group: Brands */}
              {results.brands.length > 0 && (
                <div>
                  <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] px-3 mb-2 block">
                    Authorized Brands ({results.brands.length})
                  </span>
                  <div className="divide-y divide-white/[0.04]">
                    {results.brands.map((brand) => {
                      const slug = getSlugString(brand.slug) || brand.id || "";
                      return (
                        <button
                          key={brand._id || brand.id || brand.name}
                          type="button"
                          onClick={() => {
                            setIsFocused(false);
                            openDrawer({
                              source: "collections",
                              intent: "consultation",
                              brand: { slug, name: brand.name },
                            });
                            onSelect?.({ kind: "brand", slug });
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded hover:bg-white/[0.04] transition-colors duration-150 group hc-focus text-left"
                        >
                          <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                            {brand.name}
                          </span>
                          <span className="text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                            Ask Specialist â†’
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Designed Zero-Results State */
            <div className="p-8 text-center flex flex-col items-center">
              <Compass className="w-8 h-8 text-[var(--accent)] mb-3 opacity-80" aria-hidden="true" />
              <h4 className="hc-serif text-lg font-normal text-[var(--text-primary)] mb-2">
                No direct matches for &ldquo;{query}&rdquo;
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-light max-w-sm mb-6 leading-relaxed">
                Our showroom partners with leading world-class manufacturers. Connect directly with our
                specialists to source custom dimensions, unlisted models, or finishes.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--accent)] text-[var(--accent)] hover:bg-[#8b1a42] hover:text-white text-xs uppercase tracking-widest font-medium rounded transition-colors duration-150 hc-focus"
              >
                ASK OUR HARDWARE EXPERT
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


