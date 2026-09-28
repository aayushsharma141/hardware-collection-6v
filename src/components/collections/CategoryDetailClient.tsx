"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass, CheckCircle2, ShieldCheck, Layers, MessageSquare } from "lucide-react";
import { Category, Product, SiteSettings, getSlugString } from "@/types/catalog";
import ProductCard from "@/components/collections/ProductCard";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";
import FamilySections, { type FamilySection } from "@/components/collections/FamilySections";
import { buildCategoryConsultMessage, buildEmptyCategoryMessage, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { generateWhatsAppUrl } from "@/lib/config";
import { useConsultationStore } from "@/components/consultation/store";
import Footer from "@/components/layout/Footer";

export interface CategoryDetailClientProps {
  category: Category;
  products: Product[];
  settings?: SiteSettings | null;
  /**
   * Set only on a showroom-family page (Phase 12): one entry per board item,
   * replacing the single product catalogue below.
   */
  sections?: FamilySection[];
}

export default function CategoryDetailClient({
  category,
  products,
  settings,
  sections,
}: CategoryDetailClientProps) {
  const { openDrawer } = useConsultationStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shortlist, setShortlist] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");

  // Derive unique brands strictly from actual category products (no hard-coded mappings)
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    (products || []).forEach((p) => {
      const b = p.brandName || p.brand;
      if (b && typeof b === "string" && b.trim()) {
        brandSet.add(b.trim());
      }
    });
    return Array.from(brandSet).sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Filtered product subset according to selected brand refinement
  const filteredProducts = useMemo(() => {
    if (selectedBrand === "ALL") return products;
    return products.filter((p) => {
      const b = (p.brandName || p.brand || "").trim().toLowerCase();
      return b === selectedBrand.toLowerCase();
    });
  }, [products, selectedBrand]);

  const slug = getSlugString(category.slug);
  const categoryTitle = category.name || category.title || "Curated Collection";
  const heroImage =
    category.heroImageUrl ||
    category.imageUrl ||
    "/cinema/categories/HC-03-DOORS.png";

  const galleryImages = category.galleryUrls || [];

  const handleToggleShortlist = useCallback((product: Product) => {
    setShortlist((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === (product._id || product.id));
      if (exists) {
        return prev.filter((p) => (p._id || p.id) !== (product._id || product.id));
      }
      return [...prev, product];
    });
  }, []);

  const getProductDisplayImage = useCallback(
    (prod: Product) => {
      if (prod.imageUrl) return prod.imageUrl;
      if (category.heroImageUrl) return category.heroImageUrl;
      if (category.imageUrl) return category.imageUrl;
      if (settings?.defaultCategoryImageUrl) return settings.defaultCategoryImageUrl;
      return "/cinema/categories/HC-03-DOORS.png";
    },
    [category, settings]
  );

  const consultMessage = buildCategoryConsultMessage(
    categoryTitle,
    category.whatsappMessage
  );
  const whatsappUrl = category.cta
    ? generateWhatsAppUrl(category.cta.type, categoryTitle, settings?.whatsappNumber)
    : buildWhatsAppLink(consultMessage, settings);

  const emptyCategoryMessage = buildEmptyCategoryMessage(categoryTitle);
  const emptyWhatsappUrl = buildWhatsAppLink(emptyCategoryMessage, settings);

  const overviewText =
    typeof category.overview === "string"
      ? category.overview
      : Array.isArray(category.overview)
      ? (category.overview as Array<string | { text?: string }>)
          .map((block) => (typeof block === "string" ? block : block?.text || ""))
          .join(" ")
      : category.description || category.shortDesc;

  return (
    <div className="min-h-screen bg-[#fbf5ea] text-[var(--text-primary)]">
      {/* Back Navigation */}
      <div className="max-w-[1320px] mx-auto px-6 pt-28 md:pt-32 pb-4">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-150 hc-focus py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Collections
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative w-full border-b border-[var(--border)] overflow-hidden">
        <div className="relative max-w-[1320px] mx-auto px-6 py-16 md:py-24">
          {/* Background image atmosphere */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <Image
              src={heroImage}
              alt={categoryTitle}
              fill
              priority
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#fbf5ea] via-[#fbf5ea]/80 to-transparent pointer-events-none"
            />
          </div>

          <div className="max-w-3xl">
            <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-3 block">
              {category.eyebrow || "CURATED COLLECTION"}
            </span>
            <h1 className="hc-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.02em] text-[var(--text-primary)] uppercase leading-tight mb-5">
              {categoryTitle}
            </h1>
            {category.description && (
              <p className="text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed mb-8 max-w-2xl">
                {category.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  openDrawer({
                    source: "category_page",
                    intent: "consultation",
                    category: { slug, name: categoryTitle },
                  })
                }
                className="brass-plate hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
              >
                REQUEST SPECIFICATION CONSULTATION
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-button hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-[var(--text-primary)] border border-[#1a1017]/[0.20] hover:border-[var(--accent)] rounded transition-colors duration-150"
              >
                WHATSAPP SPECIALIST
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Key Highlights Section */}
      {(overviewText ||
        (category.keyFeatures && category.keyFeatures.length > 0) ||
        (category.suitableFor && category.suitableFor.length > 0) ||
        (category.brandRefs && category.brandRefs.length > 0)) && (
        <section className="py-16 border-b border-[var(--border)] bg-[var(--surface-raised)]">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Overview text */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-3 block">
                  ARCHITECTURAL SPECIFICATIONS
                </span>
                <h2 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)] mb-4">
                  Overview & Engineering Standards
                </h2>
                {overviewText && (
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed mb-6">
                    {overviewText}
                  </p>
                )}
                {category.brandRefs && category.brandRefs.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <span className="text-xs text-[var(--text-secondary)] font-light">
                      Authorized Partners:{" "}
                      <strong className="text-[var(--text-primary)] font-normal">
                        {category.brandRefs.map((b) => b.name).join(", ")}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Specifications Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.keyFeatures && category.keyFeatures.length > 0 && (
                  <div className="p-6 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                      <h3 className="hc-mono text-xs uppercase tracking-widest text-[var(--text-primary)]">
                        Key Features
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {category.keyFeatures.map((feat) => (
                        <li
                          key={feat}
                          className="text-xs text-[var(--text-secondary)] font-light flex items-start gap-2"
                        >
                          <span className="text-[var(--accent)]">•</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {category.suitableFor && category.suitableFor.length > 0 && (
                  <div className="p-6 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-[var(--accent)]" />
                      <h3 className="hc-mono text-xs uppercase tracking-widest text-[var(--text-primary)]">
                        Suitable For
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {category.suitableFor.map((app) => (
                        <li
                          key={app}
                          className="text-xs text-[var(--text-secondary)] font-light flex items-start gap-2"
                        >
                          <span className="text-[var(--accent)]">•</span>
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Strip (if present) */}
      {galleryImages.length > 0 && (
        <section className="py-16 border-b border-[var(--border)]">
          <div className="max-w-[1320px] mx-auto px-6">
            <div className="mb-8">
              <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-2 block">
                VISUAL SHOWCASE
              </span>
              <h3 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)]">
                Installed Finishes & Details
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]"
                >
                  <Image
                    src={imgUrl}
                    alt={`${categoryTitle} visual detail ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Family pages list every board item as its own section (Phase 12) */}
      {sections && (
        <FamilySections
          familyName={categoryTitle}
          sections={sections}
          settings={settings}
          shortlist={shortlist}
          onSelectProduct={setSelectedProduct}
          onToggleShortlist={handleToggleShortlist}
          displayImageFor={getProductDisplayImage}
        />
      )}

      {/* Product Catalog Section */}
      {!sections && (
      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-2 block">
              CATALOGUE
            </span>
            <h2 className="hc-serif text-3xl sm:text-4xl font-normal tracking-[0.02em] text-[var(--text-primary)]">
              {products.length > 0
                ? `Products in ${categoryTitle}`
                : `Stock & Availability: ${categoryTitle}`}
            </h2>
          </div>

          {/* Progressive Brand Filter (Rendered ONLY if category contains multiple brands) */}
          {availableBrands.length > 1 && (
            <nav aria-label="Filter products by brand" className="mb-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-2 min-w-max" role="tablist" aria-label={`Filter ${categoryTitle} by brand`}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedBrand === "ALL"}
                  aria-pressed={selectedBrand === "ALL"}
                  onClick={() => setSelectedBrand("ALL")}
                  className={`hc-focus px-4 py-2 min-h-[44px] rounded-full text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-200 cursor-pointer ${
                    selectedBrand === "ALL"
                      ? "bg-[#8b1a42] text-white shadow-sm"
                      : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#8b1a42]/40"
                  }`}
                >
                  All ({products.length})
                </button>
                {availableBrands.map((b) => {
                  const count = products.filter(
                    (p) => (p.brandName || p.brand || "").trim().toLowerCase() === b.toLowerCase()
                  ).length;
                  const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
                  return (
                    <button
                      key={b}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedBrand(b)}
                      className={`hc-focus px-4 py-2 min-h-[44px] rounded-full text-xs uppercase tracking-[0.14em] font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#8b1a42] text-white shadow-sm"
                          : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#8b1a42]/40"
                      }`}
                    >
                      {b} ({count})
                    </button>
                  );
                })}
              </div>
            </nav>
          )}

          {products.length > 0 ? (
            filteredProducts.length > 0 ? (
              /* Product Grid */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product._id || product.id || product.name}
                    product={product}
                    index={idx}
                    totalInCategory={filteredProducts.length}
                    isShortlisted={shortlist.some(
                      (p) => (p._id || p.id) === (product._id || product.id)
                    )}
                    onSelect={(p) => setSelectedProduct(p)}
                    onToggleShortlist={handleToggleShortlist}
                    displayImage={getProductDisplayImage(product)}
                  />
                ))}
              </div>
            ) : (
              /* Zero Filter Result State */
              <div className="py-12 text-center p-8 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] max-w-md mx-auto">
                <p className="text-sm text-[var(--text-secondary)] mb-4 font-light">
                  No products matching &ldquo;{selectedBrand}&rdquo; in {categoryTitle}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedBrand("ALL")}
                  className="hc-focus px-5 py-2.5 min-h-[44px] rounded-full bg-[#8b1a42] text-white text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[#6b1432]"
                >
                  View All {categoryTitle} Products
                </button>
              </div>
            )
          ) : (
            /* D-13: Substantive Empty-Category Variant */
            <div className="p-12 md:p-16 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center flex flex-col items-center max-w-2xl mx-auto">
              <Compass
                className="w-10 h-10 text-[var(--accent)] mb-4 opacity-80"
                aria-hidden="true"
              />
              <h3 className="hc-serif text-2xl font-normal text-[var(--text-primary)] mb-3">
                Physical Display & Sourcing in Sakchi
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-light mb-8 leading-relaxed">
                We stock and specify genuine architectural hardware for{" "}
                <strong className="text-[var(--text-primary)] font-medium">{categoryTitle}</strong>.
                Connect directly with our showroom specialists for manufacturer cut-sheets, live demo bookings,
                and contractor volume pricing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    openDrawer({
                      source: "category_page",
                      intent: "consultation",
                      category: { slug, name: categoryTitle },
                    })
                  }
                  className="brass-plate hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
                >
                  REQUEST AVAILABILITY & QUOTE
                </button>
                <a
                  href={emptyWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rail-button hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-[var(--text-primary)] border border-[#1a1017]/[0.20] hover:border-[var(--accent)] rounded transition-colors duration-150"
                >
                  WHATSAPP SPECIALIST
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Bottom Consultation CTA Section */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <MessageSquare
            className="w-8 h-8 text-[var(--accent)] mx-auto mb-4 opacity-80"
            aria-hidden="true"
          />
          <h3 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)] mb-3">
            Need Expert Sizing or Specification?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-light max-w-lg mx-auto mb-8 leading-relaxed">
            Our architectural consultants in Sakchi assist architects, interior designers, and homeowners
            with precise technical recommendations and finish matching.
          </p>
          <button
            type="button"
            onClick={() =>
              openDrawer({
                source: "category_page",
                intent: "consultation",
                category: { slug, name: categoryTitle },
              })
            }
            className="brass-plate hc-focus inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-widest uppercase font-medium text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
          >
            BOOK SHOWROOM CONSULTATION
          </button>
        </div>
      </section>

      <Footer />

      {/* Product Detail Lookbook Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        shortlist={shortlist}
        onToggleShortlist={handleToggleShortlist}
        displayImage={
          selectedProduct
            ? getProductDisplayImage(selectedProduct)
            : "/cinema/categories/HC-03-DOORS.png"
        }
      />
    </div>
  );
}

