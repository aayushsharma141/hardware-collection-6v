"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Compass } from "lucide-react";
import CatalogLibrary from "@/components/catalog/CatalogLibrary";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import { SHOWROOM_FAMILIES } from "@/data/catalog";
import { AnimatePresence } from "motion/react";
import { useSearchParams, usePathname } from "next/navigation";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import {
  Product,
  Category,
  Subcategory,
  Brand,
  ResolvedBrand,
  SiteSettings,
  getSlugString
} from "@/types/catalog";

import CollectionFilterRail from "@/components/collections/CollectionFilterRail";
import CollectionSearchBar from "@/components/collections/CollectionSearchBar";
import ProductCard from "@/components/collections/ProductCard";
import ShortlistPill from "@/components/collections/ShortlistPill";
import MobileFilters from "@/components/collections/MobileFilters";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";

export interface DisplayCategory extends Category {
  products: Product[];
  isDraftCategory?: boolean;
}

export interface CollectionsClientProps {
  categories: Category[];
  subcategories?: Subcategory[];
  products: Product[];
  brands: Brand[];
  settings?: SiteSettings | null;
}

// 5 Showroom Families Top-Level Discovery Architecture
const SHOWROOM_FAMILIES_NAV = [
  { id: "all", label: "ALL", shortLabel: "ALL", filterSlugs: [] },
  { id: "handles-knobs", label: "HANDLES & KNOBS", shortLabel: "HANDLES", filterSlugs: ["handles-knobs", "main-door-handles", "cabinet-wardrobe-handles"] },
  { id: "door-hardware", label: "DOOR HARDWARE", shortLabel: "DOOR", filterSlugs: ["door-hardware", "door", "digital-locks", "mortise-door-locks", "main-door-handles", "glass-hardware", "door-closers-stoppers", "safes"] },
  { id: "bathroom", label: "BATHROOM", shortLabel: "BATHROOM", filterSlugs: ["bathroom", "bathroom-accessories"] },
  { id: "kitchen-wardrobes", label: "KITCHEN & WARDROBES", shortLabel: "KITCHEN & WARDROBES", filterSlugs: ["kitchen-wardrobes", "kitchen", "wardrobe", "modular-kitchen-hardware", "kitchen-sinks-faucets", "wardrobe-hardware-sliding", "hinges-soft-close", "drawer-channels", "safes"] },
  { id: "furniture-hardware", label: "FURNITURE HARDWARE", shortLabel: "FURNITURE", filterSlugs: ["furniture-hardware", "drawer-channels", "hinges-soft-close", "cabinet-wardrobe-handles"] },
];

export default function CollectionsClient({ 
  categories, 
  products, 
  brands, 
  settings 
}: CollectionsClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | Brand | null>(null);
  const [shortlist, setShortlist] = useState<Product[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [shortlistToast, setShortlistToast] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const brandDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize brand and category from query parameters if present
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      setActiveBrand(brandParam.toLowerCase());
    }
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam.toLowerCase());
    }
  }, [searchParams]);

  // Read deep-link ?product=<slug> from URL
  useEffect(() => {
    const productSlug = searchParams.get("product");
    if (productSlug) {
      const prod = products.find(p => p.slug === productSlug || p.id === productSlug || p._id === productSlug);
      if (prod && (!selectedProduct || (selectedProduct.slug !== productSlug && selectedProduct.id !== productSlug))) {
        setSelectedProduct(prod);
      }
    } else {
      if (selectedProduct) setSelectedProduct(null);
    }
  }, [searchParams, products, selectedProduct]);

  // Close brand dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Handle product selection & deep-link update without full page refresh
  const handleProductSelect = useCallback((product: Product | null, event?: React.MouseEvent | HTMLElement) => {
    if (product) {
      if (event && "currentTarget" in event && event.currentTarget instanceof HTMLElement) {
        triggerElementRef.current = event.currentTarget;
      } else if (event instanceof HTMLElement) {
        triggerElementRef.current = event;
      } else if (document.activeElement instanceof HTMLElement) {
        triggerElementRef.current = document.activeElement;
      }
      setSelectedProduct(product);
      const params = new URLSearchParams(window.location.search);
      params.set("product", getSlugString(product.slug) || product.id || product._id || "");
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    } else {
      setSelectedProduct(null);
      const params = new URLSearchParams(window.location.search);
      params.delete("product");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      window.history.replaceState(null, "", newUrl);

      const elToFocus = triggerElementRef.current;
      triggerElementRef.current = null;
      if (elToFocus) {
        setTimeout(() => {
          elToFocus.focus();
        }, 50);
      }
    }
  }, [pathname]);

  // Centralized scroll lock using scrollLock.ts
  useEffect(() => {
    if (selectedProduct || isMobileFilterOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [selectedProduct, isMobileFilterOpen]);

  // Toggle Consultation Shortlist (Max 5 items)
  const toggleShortlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = product._id || product.id;
    if (shortlist.some(p => (p._id || p.id) === id)) {
      setShortlist(prev => prev.filter(p => (p._id || p.id) !== id));
    } else {
      if (shortlist.length >= 5) {
        setShortlistToast("Shortlist is full — up to 5 products at a time.");
        setTimeout(() => setShortlistToast(null), 3000);
        return;
      }
      setShortlist(prev => [...prev, product]);
    }
  };

  // Structured pre-filled WhatsApp consultation message
  const getWhatsAppShortlistLink = () => {
    const defaultNumber = settings?.whatsappNumber || "919835190738";
    if (shortlist.length === 0) {
      const genericMsg = "Hardware Collection — Product Consultation\n\nHi, I would like to consult with an expert regarding architectural hardware and digital lock specifications for my project.";
      return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(genericMsg)}`;
    }

    const itemsList = shortlist
      .map((p, i) => `${i + 1}. ${p.brandName || p.brand || "Hardware Collection"} — ${p.name}`)
      .join("\n");

    const message = `Hardware Collection — Product Consultation\n\nI'm interested in:\n\n${itemsList}\n\nI'd like to know about suitability, availability and specifications.`;
    return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(message)}`;
  };

  // Normalized Categories list
  const uniqueCategories = useMemo<Category[]>(() => {
    const seen = new Set<string>();
    const list: Category[] = [];
    (categories || []).forEach((c) => {
      const slugVal = getSlugString(c.slug) || c._id;
      const normalizedSlug = String(slugVal).toLowerCase().trim();
      if (normalizedSlug && !seen.has(normalizedSlug)) {
        seen.add(normalizedSlug);
        list.push({
          ...c,
          slug: normalizedSlug,
          name: c.name || "Category"
        });
      }
    });
    return list;
  }, [categories]);

  // Active showroom family if one is selected or active collection belongs to it
  const activeFamilySlug = useMemo(() => {
    if (activeCategory === "all") return null;
    const directFamily = SHOWROOM_FAMILIES.find(f => f.slug === activeCategory || f.id === activeCategory);
    if (directFamily) return directFamily.slug;
    const parentCategory = uniqueCategories.find(c => getSlugString(c.slug) === activeCategory);
    if (parentCategory && parentCategory.familySlugs && parentCategory.familySlugs.length > 0) {
      return parentCategory.familySlugs[0];
    }
    return null;
  }, [activeCategory, uniqueCategories]);

  const getFamilyCollections = useCallback((familySlug: string) => {
    const family = SHOWROOM_FAMILIES.find(f => f.slug === familySlug || f.id === familySlug);
    if (!family) return [];
    return uniqueCategories.filter(c => {
      const cSlug = getSlugString(c.slug).toLowerCase();
      const cFamilySlugs = (c.familySlugs || []).map((s: string) => s.toLowerCase());
      return family.collectionSlugs.includes(cSlug) || cFamilySlugs.includes(family.slug);
    });
  }, [uniqueCategories]);

  // Authorized Brands list (Standardizing Hafele and authorized brands)
  const availableBrands = useMemo(() => {
    const brandNames = new Set<string>();
    (brands || []).forEach(b => {
      if (b.name) brandNames.add(b.name);
    });
    (products || []).forEach(p => {
      const bName = p.brandName || p.brand;
      if (bName) brandNames.add(bName);
    });

    const standardBrands = ["Hafele", "Dorset", "Labacha", "Godrej", "Hettich", "Kich"];
    const merged = Array.from(brandNames);
    const sorted = standardBrands.filter(sb => 
      merged.some(b => b.toLowerCase().replace(/ä/g, "a") === sb.toLowerCase())
    );
    
    merged.forEach(b => {
      if (!sorted.some(s => s.toLowerCase() === b.toLowerCase())) {
        sorted.push(b);
      }
    });

    return ["all", ...sorted];
  }, [brands, products]);

  // Filtered products & categories hierarchy
  const displayCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const matchingProducts = products.filter(p => {
      const pName = (p.name || "").toLowerCase();
      const pBrand = (p.brandName || p.brand || "").toLowerCase().replace(/ä/g, "a");
      const pDesc = (p.shortDescription || p.description || "").toLowerCase();
      const pModel = (p.catalogReference || p.model || "").toLowerCase();
      
      const matchSearch = !query || pName.includes(query) || pBrand.includes(query) || pDesc.includes(query) || pModel.includes(query);
      const matchBrand = activeBrand === "all" || pBrand === activeBrand.toLowerCase() || pBrand.includes(activeBrand.toLowerCase());

      return matchSearch && matchBrand;
    });

    // Check if activeCategory matches one of the 5 Showroom Families
    const familyMatch = SHOWROOM_FAMILIES_NAV.find(p => p.id === activeCategory);

    let targetCategories: Category[] = [];
    if (activeCategory === "all") {
      targetCategories = uniqueCategories;
    } else if (familyMatch && familyMatch.filterSlugs.length > 0) {
      targetCategories = uniqueCategories.filter(c => {
        const cSlug = String(typeof c.slug === "object" ? c.slug?.current : c.slug).toLowerCase();
        const cFamilySlugs = ((c as any).familySlugs || []).map((s: string) => s.toLowerCase());
        return familyMatch.filterSlugs.includes(cSlug) || cFamilySlugs.includes(familyMatch.id);
      });
      if (targetCategories.length === 0) {
        targetCategories = uniqueCategories;
      }
    } else {
      targetCategories = uniqueCategories.filter(c => {
        const cSlug = String(typeof c.slug === "object" ? c.slug?.current : c.slug).toLowerCase();
        return cSlug === activeCategory.toLowerCase() || cSlug.includes(activeCategory.toLowerCase());
      });
      if (targetCategories.length === 0) {
        targetCategories = [{ name: activeCategory.replace(/-/g, " ").toUpperCase(), slug: activeCategory }];
      }
    }

    const catMap = new Map<string, DisplayCategory>();
    targetCategories.forEach(cat => {
      const key = String(typeof cat.slug === "object" ? cat.slug?.current : cat.slug);
      if (!catMap.has(key)) {
        const catProducts = matchingProducts.filter(p => {
          const pCat = String(p.categorySlug || p.category || "").toLowerCase();
          if (activeCategory === "all") {
            return pCat === key || pCat.includes(key) || key.includes(pCat);
          }
          if (familyMatch && familyMatch.filterSlugs.length > 0) {
            return pCat === key || pCat.includes(key) || key.includes(pCat) || familyMatch.filterSlugs.includes(pCat);
          }
          return pCat === key || pCat.includes(key) || key.includes(pCat);
        });

        if (catProducts.length > 0) {
          catMap.set(key, {
            ...cat,
            products: catProducts
          });
        } else if (activeCategory !== "all" && !query && activeBrand === "all") {
          catMap.set(key, {
            ...cat,
            products: [],
            isDraftCategory: true
          });
        }
      }
    });

    if (catMap.size === 0 && matchingProducts.length > 0) {
      catMap.set("results", {
        slug: "results",
        name: activeCategory === "all" ? "Curated Collection" : activeCategory.replace(/-/g, " ").toUpperCase(),
        products: matchingProducts
      });
    }

    return Array.from(catMap.values());
  }, [uniqueCategories, products, activeCategory, activeBrand, searchQuery]);

  const totalSpecimensCount = useMemo(() => {
    return displayCategories.reduce((acc, cat) => acc + (cat.products?.length || 0), 0);
  }, [displayCategories]);

  // Helper to guarantee crisp image fallback for every product
  const getProductDisplayImage = useCallback((prod: Product) => {
    if (prod.imageUrl) return prod.imageUrl;
    const cat = String(prod.categorySlug || prod.category || "").toLowerCase();
    if (cat.includes("lock") || cat.includes("security") || cat.includes("safe")) return "/cinema/categories/HC-03-SECURITY.png";
    if (cat.includes("bath")) return "/cinema/categories/HC-03-BATHROOM.png";
    if (cat.includes("kitchen") || cat.includes("sink")) return "/cinema/categories/HC-03-KITCHEN.png";
    if (cat.includes("wardrobe") || cat.includes("furniture") || cat.includes("slide") || cat.includes("hinge")) return "/cinema/categories/HC-03-WARDROBE.png";
    if (cat.includes("glass")) return "/cinema/categories/HC-03-GLASS.png";
    return "/cinema/categories/HC-03-DOORS.png";
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveCategory("all");
    setActiveBrand("all");
    setSearchQuery("");
  }, []);

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
