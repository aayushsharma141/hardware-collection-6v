"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Compass } from "lucide-react";
import CatalogLibrary from "@/components/catalog/CatalogLibrary";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import { AnimatePresence } from "motion/react";
import {
  Product,
  Category,
  Subcategory,
  Brand,
  SiteSettings,
  getSlugString,
} from "@/types/catalog";
import { useCollectionsState, SHOWROOM_FAMILIES_NAV } from "@/hooks/useCollectionsState";

import CollectionFilterRail from "@/components/collections/CollectionFilterRail";
import CollectionSearchBar from "@/components/collections/CollectionSearchBar";
import ProductCard from "@/components/collections/ProductCard";
import ShortlistPill from "@/components/collections/ShortlistPill";
import MobileFilters from "@/components/collections/MobileFilters";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";

export interface CollectionsClientProps {
  categories: Category[];
  subcategories?: Subcategory[];
  products: Product[];
  brands: Brand[];
  settings?: SiteSettings | null;
}

export default function CollectionsClient({ 
  categories, 
  products, 
  brands, 
  settings 
}: CollectionsClientProps) {
  const {
    activeCategory,
    setActiveCategory,
    activeBrand,
    setActiveBrand,
    searchQuery,
    setSearchQuery,
    selectedProduct,
    handleProductSelect,
    selectedCatalogBrand,
    setSelectedCatalogBrand,
    shortlist,
    setShortlist,
    toggleShortlist,
    shortlistToast,
    isBrandDropdownOpen,
    setIsBrandDropdownOpen,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    brandDropdownRef,
    searchInputRef,
    availableBrands,
    displayCategories,
    totalSpecimensCount,
    activeFamilySlug,
    getFamilyCollections,
    getProductDisplayImage,
    getWhatsAppShortlistLink,
    handleResetFilters,
  } = useCollectionsState({
    categories,
    products,
    brands,
    settings,
  });

  return (
    <div className="hc-root min-h-screen w-full bg-[#090909] text-[#e8e3d9] selection:bg-[#c8a96e]/30 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar 
        primaryPhone={settings?.primaryPhone}
        whatsappNumber={settings?.whatsappNumber}
        defaultWhatsappMessage={settings?.defaultWhatsappMessage}
      />

      <main className="w-full pb-36">
        
        {/* ── Quiet Two-Axis Architectural Masthead ── */}
        <section className="border-b border-[#c8a96e] pt-28 sm:pt-32 pb-7">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              {/* Left Axis: Eyebrow + Large Editorial Serif */}
              <div className="lg:col-span-7">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c8a96e] animate-pulse" />
                  <span className="hc-mono text-[10px] uppercase tracking-[0.22em] text-[#aaa49a]">
                    Authorized Digital Showroom
                  </span>
                </div>
                <h1 
                  className="hc-serif m-0 text-4xl sm:text-7xl lg:text-[84px] font-normal uppercase leading-[0.92] tracking-[0.03em] text-[#e8e3d9]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  The <br className="hidden sm:block" />
                  Collection
                </h1>
              </div>

              {/* Right Axis: Description + Architectural Status Bar */}
              <div className="lg:col-span-5 flex flex-col justify-end pb-1 space-y-4">
                <p className="font-dmsans text-[13px] sm:text-[14px] leading-relaxed text-[#aaa49a] font-light max-w-lg">
                  Curated architectural hardware for considered residential and commercial interiors. Authorized partner for Häfele, Dorset, Labacha, Godrej, Hettich & Kich.
                </p>
                <div className="flex items-center justify-between border-t border-white/[0.12] pt-3 text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-[#aaa49a]">
                    Product specification wall
                  </span>
                  <span className="hc-mono text-[#c8a96e]">
                    Sakchi · Jamshedpur
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mobile Sticky Quick Filter Bar & Drawer ── */}
        <MobileFilters
          isOpen={isMobileFilterOpen}
          onOpen={() => setIsMobileFilterOpen(true)}
          onClose={() => setIsMobileFilterOpen(false)}
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          activeFamilySlug={activeFamilySlug}
          products={products}
          availableBrands={availableBrands}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onSelectBrand={(brand) => setActiveBrand(brand)}
          getFamilyCollections={getFamilyCollections}
        />

        {/* ── Desktop Specification Wall: Index Rail + Product Main ── */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 lg:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
            
            {/* ── Left Sticky Column: Architectural Collection Index ── */}
            <CollectionFilterRail
              products={products}
              activeCategory={activeCategory}
              activeBrand={activeBrand}
              activeFamilySlug={activeFamilySlug}
              availableBrands={availableBrands}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onSelectBrand={(brand) => setActiveBrand(brand)}
              getFamilyCollections={getFamilyCollections}
              showroomFamiliesNav={SHOWROOM_FAMILIES_NAV}
            />

            {/* ── Right Main Area: Instrument Strip + Specimen Wall ── */}
            <div className="min-w-0 space-y-10">
              
              {/* Flat Two-Row Instrument Strip */}
              <CollectionSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeBrand={activeBrand}
                onBrandChange={setActiveBrand}
                availableBrands={availableBrands}
                isBrandDropdownOpen={isBrandDropdownOpen}
                onToggleBrandDropdown={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                brandDropdownRef={brandDropdownRef}
                totalSpecimensCount={totalSpecimensCount}
                activeCategory={activeCategory}
                onResetFilters={handleResetFilters}
                searchInputRef={searchInputRef}
              />

              {/* ── Empty State: Showroom Inquire Fallback ── */}
              {displayCategories.length === 0 && (
                <div className="bg-[#11100f] border border-white/[0.12] p-12 text-center my-6">
                  <Compass className="w-10 h-10 text-[#c8a96e] mx-auto mb-3 stroke-[1.5]" />
                  <h2 
                    className="hc-serif text-3xl text-white mb-2 uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {activeBrand !== "all" 
                      ? `No ${activeBrand.toUpperCase()} specimens in this category`
                      : "No matching architectural specimens found"}
                  </h2>
                  <p className="font-dmsans text-xs md:text-sm text-[#aaa49a] max-w-md mx-auto mb-6 leading-relaxed font-light">
                    Our Sakchi showroom holds comprehensive specification catalogs and mockups for all authorized partner brands. Inquire directly with our specialist desk.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={`https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=Hi%20Hardware%20Collection%2C%20I%20am%20looking%20for%20${encodeURIComponent(activeBrand !== "all" ? activeBrand : "architectural hardware")}%20specifications.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brass-plate px-7 py-3.5 bg-[#c8a96e] text-[#090909] font-dmsans font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 no-underline"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Consult on WhatsApp</span>
                    </a>
                    <button
                      onClick={handleResetFilters}
                      className="rail-button px-6 py-3 text-xs uppercase tracking-wider text-[#e8e3d9]"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}

              {/* ── Category Shelves & Specimen Product Grids ── */}
              <div className="space-y-16">
                {displayCategories.map((cat) => (
                  <section key={getSlugString(cat.slug) || cat._id || cat.id} className="space-y-6">
                    
                    {/* Category Shelf Header */}
                    <div className="flex items-end justify-between border-b border-white/[0.16] pb-3">
                      <div>
                        <span className="hc-mono text-[9px] uppercase tracking-[0.20em] text-[#c8a96e]">
                          Showroom family · {cat.name}
                        </span>
                        <h2 
                          className="hc-serif m-0 mt-1.5 text-3xl sm:text-4xl lg:text-[42px] font-normal uppercase leading-none tracking-[0.03em] text-[#e8e3d9]"
                          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                        >
                          {cat.name}
                        </h2>
                      </div>
                      <span className="hc-mono pb-1 text-[10px] uppercase tracking-[0.16em] text-[#c8a96e] shrink-0">
                        {cat.products.length.toString().padStart(2, "0")} specimens available
                      </span>
                    </div>

                    {/* Controlled 12-Column Specimen Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      <AnimatePresence mode="popLayout">
                        {cat.products.map((prod: Product, idx: number) => {
                          const isShortlisted = shortlist.some(p => (p._id || p.id) === (prod._id || prod.id));
                          const displayImg = getProductDisplayImage(prod);

                          return (
                            <ProductCard
                              key={prod._id || prod.id}
                              product={prod}
                              index={idx}
                              totalInCategory={cat.products.length}
                              isShortlisted={isShortlisted}
                              onSelect={handleProductSelect}
                              onToggleShortlist={toggleShortlist}
                              displayImage={displayImg}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </div>

                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Official Brand Catalogs Strip ── */}
        {products.length > 0 && (
          <div id="reference-library-section" className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-16 pb-6 border-t border-white/[0.08] mt-16">
            <CatalogLibrary brands={brands || []} onSelectBrand={setSelectedCatalogBrand} />
          </div>
        )}
      </main>

      {/* ── Floating Shortlist Pill & Full Toast ── */}
      <ShortlistPill
        shortlist={shortlist}
        shortlistToast={shortlistToast}
        whatsappLink={getWhatsAppShortlistLink()}
        onClear={() => setShortlist([])}
      />

      {/* ── Lookbook Product Detail Drawer ─────────────────────── */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => handleProductSelect(null)}
        shortlist={shortlist}
        onToggleShortlist={toggleShortlist}
        displayImage={selectedProduct ? getProductDisplayImage(selectedProduct) : ""}
      />

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
