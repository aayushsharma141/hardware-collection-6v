"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  Search, 
  X, 
  Check, 
  Plus, 
  ShieldCheck, 
  MessageCircle, 
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import CatalogLibrary from "@/components/catalog/CatalogLibrary";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import { useConsultationStore } from "@/components/consultation/store";
import { SHOWROOM_FAMILIES } from "@/data/catalog";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Product,
  Category,
  Subcategory,
  Brand,
  ResolvedBrand,
  SiteSettings,
  ProductSpecification,
  getSlugString
} from "@/types/catalog";

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
  subcategories,
  products, 
  brands, 
  settings 
}: CollectionsClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | Brand | null>(null);
  const [shortlist, setShortlist] = useState<Product[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shortlistToast, setShortlistToast] = useState<string | null>(null);
  
  const { openDrawer } = useConsultationStore();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const brandDropdownRef = useRef<HTMLDivElement | null>(null);
  const moreCategoriesRef = useRef<HTMLDivElement | null>(null);
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
      if (moreCategoriesRef.current && !moreCategoriesRef.current.contains(e.target as Node)) {
        setIsMoreCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

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
      setHasInteracted(true);
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

  // Keyboard navigation & Focus Trap inside lookbook drawer
  useEffect(() => {
    if (!selectedProduct) return;

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleProductSelect(null);
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct, handleProductSelect]);

  // Lock body scroll when drawer or mobile filter sheet is open
  useEffect(() => {
    if (selectedProduct || isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct, isMobileFilterOpen]);

  // Toggle Consultation Shortlist (Max 5 items)
  const toggleShortlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasInteracted(true);
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

  // Remaining specific collections for MORE panel
  const moreCategories = useMemo(() => {
    const familyIds = new Set(SHOWROOM_FAMILIES_NAV.map(f => f.id));
    return uniqueCategories.filter(c => !familyIds.has(getSlugString(c.slug).toLowerCase()));
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
          // If specific category is selected and has no products yet (e.g., Draft awaiting verification)
          catMap.set(key, {
            ...cat,
            products: [],
            isDraftCategory: true
          });
        }
      }
    });

    // If still empty but we have matching products for the filter, group under a general section
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

        {/* ── Mobile Sticky Quick Filter Bar ── */}
        <div className="lg:hidden sticky top-[68px] z-30 w-full px-4 py-2.5 bg-[#11100f]/95 backdrop-blur-xl border-b border-white/[0.12] shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-none bg-[#181716] border border-white/[0.14] text-[#e8e3d9] hc-mono text-[11px] uppercase tracking-wider"
              aria-label="Open collection index menu"
            >
              <div className="flex items-center gap-2 truncate">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                <span className="truncate">
                  {activeCategory === "all" ? "All Collections" : activeCategory.replace(/-/g, " ")}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#aaa49a] shrink-0 ml-1" />
            </button>

            {activeBrand !== "all" && (
              <button
                onClick={() => setActiveBrand("all")}
                className="px-3 py-2.5 rounded-none bg-[#c8a96e]/15 border border-[#c8a96e]/40 text-[10px] hc-mono text-[#c8a96e] flex items-center gap-1.5 shrink-0"
              >
                <span>{activeBrand.toUpperCase()}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── Desktop Specification Wall: Index Rail + Product Main ── */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-8 lg:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
            
            {/* ── Left Sticky Column: Architectural Collection Index ── */}
            <aside 
              aria-label="Collection index" 
              className="hidden lg:block sticky top-28 h-[calc(100vh-8.5rem)] overflow-y-auto pr-6 border-r border-white/[0.12] space-y-7 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Index Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.10]">
                <span className="hc-mono text-[10px] uppercase tracking-[0.20em] text-[#c8a96e]">
                  Collection index
                </span>
                <span className="hc-mono text-[10px] text-[#aaa49a]">
                  {products.length} Total
                </span>
              </div>

              {/* All Collections Link */}
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setHasInteracted(true);
                }}
                className={`index-row hc-focus flex w-full items-center justify-between text-[11px] uppercase tracking-[0.14em] text-left transition-colors cursor-pointer ${
                  activeCategory === "all" ? "is-active text-[#e8e3d9] font-semibold" : "text-[#aaa49a] hover:text-[#e8e3d9]"
                }`}
              >
                <span>All collections</span>
                <span className="hc-mono text-[10px] text-[#aaa49a]">
                  {products.length}
                </span>
              </button>

              {/* Showroom Families Group */}
              <div>
                <p className="hc-mono mb-3 text-[9px] uppercase tracking-[0.20em] text-[#aaa49a]">
                  Showroom families
                </p>
                <div className="space-y-1">
                  {SHOWROOM_FAMILIES.map((family, idx) => {
                    const isFamilyActive = activeFamilySlug === family.slug || activeCategory === family.slug;
                    const familyCollections = getFamilyCollections(family.slug);
                    const familyNavMatch = SHOWROOM_FAMILIES_NAV.find(
                      (f) => f.id === family.slug || f.id.includes(family.slug) || family.slug.includes(f.id)
                    );
                    const familyProductCount = products.filter((p) => {
                      const pCat = String(p.categorySlug || p.category || "").toLowerCase();
                      if (family.collectionSlugs.includes(pCat)) return true;
                      if (familyNavMatch && familyNavMatch.filterSlugs.some((s) => pCat.includes(s) || s.includes(pCat))) return true;
                      return false;
                    }).length;

                    return (
                      <div key={family.slug} className="space-y-0.5">
                        <button
                          onClick={() => {
                            setActiveCategory(family.slug);
                            setHasInteracted(true);
                          }}
                          className={`index-row hc-focus flex w-full items-center gap-2.5 text-[11px] uppercase tracking-[0.12em] text-left cursor-pointer transition-colors ${
                            isFamilyActive ? "is-active text-[#e8e3d9]" : "text-[#aaa49a] hover:text-[#e8e3d9]"
                          }`}
                        >
                          <span className="hc-mono w-5 text-[10px] text-[#c8a96e]">
                            0{idx + 1}
                          </span>
                          {isFamilyActive && <span className="index-rule" />}
                          <span className={`flex-1 truncate ${isFamilyActive ? "font-semibold text-white" : ""}`}>
                            {family.name}
                          </span>
                          <span className={`hc-mono text-[10px] ${isFamilyActive ? "text-[#c8a96e]" : "text-[#aaa49a]"}`}>
                            {familyProductCount.toString().padStart(2, "0")}
                          </span>
                        </button>

                        {/* Indented Subcategories */}
                        {isFamilyActive && familyCollections.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-l border-[#c8a96e]/35 ml-7 pl-3.5 my-1.5 space-y-0.5"
                          >
                            {familyCollections.map((col) => {
                              const colSlug = getSlugString(col.slug);
                              const isColSelected = activeCategory === colSlug;
                              const colProductCount = products.filter((p) => {
                                const pCat = String(p.categorySlug || p.category || "").toLowerCase();
                                return pCat === colSlug || pCat.includes(colSlug) || colSlug.includes(pCat);
                              }).length;

                              return (
                                <button
                                  key={colSlug || col._id || col.id}
                                  onClick={() => {
                                    setActiveCategory(colSlug);
                                    setHasInteracted(true);
                                  }}
                                  className={`hc-focus flex w-full min-h-[30px] items-center justify-between text-[10px] text-left transition-colors cursor-pointer py-1 border-b border-white/[0.04] ${
                                    isColSelected ? "text-[#e8e3d9] font-semibold" : "text-[#aaa49a] hover:text-[#e8e3d9]"
                                  }`}
                                >
                                  <span className="truncate pr-2">{col.name}</span>
                                  <span className={`hc-mono text-[9px] ${isColSelected ? "text-[#c8a96e] font-bold" : "text-[#7a756d]"}`}>
                                    {colProductCount.toString().padStart(2, "0")}
                                  </span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Authorized Brands Checklist */}
              <div className="border-t border-white/[0.12] pt-5">
                <p className="hc-mono mb-3 text-[9px] uppercase tracking-[0.20em] text-[#aaa49a]">
                  Authorized brands
                </p>
                <div className="space-y-1">
                  {availableBrands.map((b) => {
                    const isSelected = activeBrand === b.toLowerCase();
                    return (
                      <button
                        key={b}
                        onClick={() => {
                          setActiveBrand(b.toLowerCase());
                          setHasInteracted(true);
                        }}
                        className={`hc-focus flex w-full min-h-[36px] items-center gap-3 border-b border-white/[0.04] text-[11px] text-left transition-colors cursor-pointer ${
                          isSelected ? "text-[#e8e3d9]" : "text-[#aaa49a] hover:text-[#e8e3d9]"
                        }`}
                      >
                        <span className={`check-box ${isSelected ? "is-checked" : ""}`}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-[#090909] stroke-[3]" />
                          )}
                        </span>
                        <span className="flex-1 truncate uppercase tracking-wider text-[10.5px]">
                          {b === "all" ? "All authorized brands" : b}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ── Right Main Area: Instrument Strip + Specimen Wall ── */}
            <div className="min-w-0 space-y-10">
              
              {/* Flat Two-Row Instrument Strip */}
              <section aria-label="Product search and filters" className="border-y border-white/[0.14] bg-[#11100f]/60 p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] items-end gap-4">
                  {/* Search Input */}
                  <label className="block">
                    <span className="hc-mono mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#aaa49a]">
                      Search products or part references
                    </span>
                    <span className="flex h-12 items-center border border-white/[0.18] bg-[#11100f] focus-within:border-[#c8a96e]">
                      <Search className="w-4 h-4 ml-4 text-[#c8a96e] shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products, brands, finishes, part codes..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setHasInteracted(true);
                        }}
                        className="hc-focus h-full w-full border-0 bg-transparent px-3 text-[12px] text-[#e8e3d9] outline-none placeholder:text-[#aaa49a]/50"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mr-3 text-[#aaa49a] hover:text-white p-1"
                          aria-label="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  </label>

                  {/* Brand Filter Selector for Quick Access */}
                  <div className="relative" ref={brandDropdownRef}>
                    <span className="hc-mono mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#aaa49a]">
                      Brand
                    </span>
                    <button
                      type="button"
                      aria-expanded={isBrandDropdownOpen}
                      aria-haspopup="listbox"
                      onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                      className="flex h-12 w-full items-center justify-between border border-white/[0.18] bg-[#11100f] px-4 text-[11px] uppercase tracking-[0.14em] text-[#e8e3d9] hover:border-[#c8a96e]"
                    >
                      <span className="truncate">{activeBrand === "all" ? "All brands" : activeBrand}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#c8a96e] transition-transform ${isBrandDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isBrandDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute right-0 mt-2 w-52 bg-[#11100f] border border-white/[0.14] p-1.5 shadow-2xl z-50"
                        >
                          {availableBrands.map((b) => {
                            const isSelected = activeBrand === b.toLowerCase();
                            return (
                              <button
                                key={b}
                                onClick={() => {
                                  setActiveBrand(b.toLowerCase());
                                  setIsBrandDropdownOpen(false);
                                  setHasInteracted(true);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-wider text-left transition-colors ${
                                  isSelected ? "bg-[#c8a96e] text-[#090909] font-bold" : "text-[#aaa49a] hover:text-white hover:bg-white/[0.04]"
                                }`}
                              >
                                <span>{b === "all" ? "All brands" : b}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Filter Summary & Breadcrumbs Bar */}
                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.10] text-[10px] uppercase tracking-[0.16em]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="hc-mono text-[#c8a96e]">
                      {totalSpecimensCount.toString().padStart(2, "0")} specimens available
                    </span>
                    <span className="text-[#aaa49a]">·</span>
                    <span className="text-[#aaa49a]">
                      {activeCategory === "all" ? "all collections" : activeCategory.replace(/-/g, " ")}
                    </span>
                    {activeBrand !== "all" && (
                      <>
                        <span className="text-[#aaa49a]">·</span>
                        <span className="text-[#c8a96e] border border-[#c8a96e]/40 px-2 py-0.5 bg-[#c8a96e]/10">
                          {activeBrand}
                        </span>
                      </>
                    )}
                  </div>

                  {(activeCategory !== "all" || activeBrand !== "all" || searchQuery) && (
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setActiveBrand("all");
                        setSearchQuery("");
                      }}
                      className="hc-focus architecture-rule text-[#e8e3d9] hover:text-white text-[10px] uppercase tracking-[0.16em] cursor-pointer"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </section>

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
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("all");
                        setActiveBrand("all");
                      }}
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
                    <motion.div 
                      layout
                      className="grid grid-cols-1 md:grid-cols-12 gap-5"
                    >
                      <AnimatePresence mode="popLayout">
                        {cat.products.map((prod: Product, idx: number) => {
                          const isShortlisted = shortlist.some(p => (p._id || p.id) === (prod._id || prod.id));
                          const isOnlyTwo = cat.products.length === 2;
                          const isFeatured = !isOnlyTwo && (prod.featured === true || (idx === 0 && cat.products.length > 2));
                          
                          // Grid spans: 2 items => 6 cols each; 3+ items => featured 8 cols, others 4 cols
                          const spanClass = isOnlyTwo
                            ? "md:col-span-6 lg:col-span-6"
                            : isFeatured
                            ? "md:col-span-12 lg:col-span-8"
                            : "md:col-span-6 lg:col-span-4";

                          const displayImg = getProductDisplayImage(prod);

                          return (
                            <motion.article
                              layout
                              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              key={prod._id || prod.id}
                              onClick={(e) => handleProductSelect(prod, e)}
                              className={`specimen-tray hc-focus p-3.5 flex flex-col justify-between cursor-pointer ${spanClass}`}
                              tabIndex={0}
                              role="button"
                              aria-label={`View specifications for ${prod.name} by ${prod.brandName || prod.brand}`}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleProductSelect(prod, e.currentTarget);
                                }
                              }}
                            >
                              <div>
                                {/* Image Specimen Frame with Glow & Sweep */}
                                <div className={`specimen-frame relative w-full mb-4 ${
                                  isFeatured ? "aspect-[21/9]" : isOnlyTwo ? "aspect-[16/10]" : "aspect-[16/11]"
                                }`}>
                                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(200,169,110,.18),transparent_45%)]" />
                                  <Image
                                    src={displayImg}
                                    alt={prod.name || "Product Specimen"}
                                    fill
                                    placeholder={prod.imageLqip ? "blur" : "empty"}
                                    blurDataURL={prod.imageLqip}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-contain p-4 relative z-[2] opacity-85 transition-transform duration-500 ease-out group-hover:scale-105"
                                  />

                                  {/* Live Display or Focal Badge */}
                                  {prod.displayStatus ? (
                                    <span className="absolute left-4 top-4 z-[3] border border-[#c8a96e]/60 bg-[#090909]/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[#c8a96e]">
                                      {prod.displayStatus}
                                    </span>
                                  ) : isFeatured ? (
                                    <span className="absolute left-4 top-4 z-[3] border border-[#c8a96e]/60 bg-[#090909]/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[#c8a96e]">
                                      Featured Specimen
                                    </span>
                                  ) : null}

                                  {/* Monospace Reference Code */}
                                  <span className="hc-mono absolute bottom-3 right-4 z-[3] text-[9px] tracking-[0.18em] text-[#aaa49a]">
                                    {prod.catalogReference || prod.model || `HC-${(prod.brand || 'SPEC').toUpperCase().slice(0, 3)}`}
                                  </span>
                                </div>

                                {/* Product Brand & Model Header */}
                                <div className="px-1.5">
                                  <div className="flex items-center justify-between gap-3 mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8a96e]">
                                      {prod.brandName || prod.brand}
                                    </span>
                                    <span className="hc-mono text-[9px] text-[#aaa49a]">
                                      {prod.model || prod.catalogReference || "SPEC-STD"}
                                    </span>
                                  </div>

                                  {/* Product Title */}
                                  <h3 className="m-0 mt-1.5 text-base sm:text-[17px] font-medium leading-snug text-[#e8e3d9] group-hover:text-white transition-colors">
                                    {prod.name}
                                  </h3>

                                  {/* Description */}
                                  {(prod.shortDescription || prod.description) && (
                                    <p className="m-0 mt-2 line-clamp-2 text-xs sm:text-[13px] leading-relaxed text-[#aaa49a] font-light">
                                      {prod.shortDescription || prod.description}
                                    </p>
                                  )}

                                  {/* Finishes Badges if Available */}
                                  {prod.finishes && prod.finishes.length > 0 && (
                                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                      {prod.finishes.slice(0, 3).map((f: string, fi: number) => (
                                        <span key={fi} className="hc-mono text-[9px] uppercase tracking-wider text-[#aaa49a] border border-white/[0.08] px-2 py-0.5 bg-white/[0.02]">
                                          {f}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Interactive Action Bar */}
                              <div className="mt-5 pt-3 px-1.5 border-t border-white/[0.10] flex items-center justify-between gap-3">
                                <button
                                  type="button"
                                  aria-pressed={isShortlisted}
                                  onClick={(e) => toggleShortlist(prod, e)}
                                  className={`shortlist-control hc-focus inline-flex min-h-[36px] items-center gap-2 border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.14em] font-medium transition-all ${
                                    isShortlisted 
                                      ? "border-[#c8a96e] bg-[#c8a96e] text-[#090909] font-bold" 
                                      : "border-white/[0.22] text-[#e8e3d9] hover:border-[#c8a96e]"
                                  }`}
                                >
                                  {isShortlisted ? (
                                    <Check className="w-3 h-3 text-[#090909] stroke-[3]" />
                                  ) : (
                                    <Plus className="w-3 h-3 text-[#c8a96e] shortlist-icon" />
                                  )}
                                  <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                                </button>

                                <span className="hc-focus architecture-rule inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#e8e3d9] group-hover:text-white">
                                  <span>Specifications</span>
                                  <ArrowRight className="w-3 h-3 text-[#c8a96e] transition-transform duration-180 group-hover:translate-x-1" />
                                </span>
                              </div>
                            </motion.article>
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>

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

      {/* ── Shortlist full toast (replaces blocking alert) */}
      <AnimatePresence>
        {shortlistToast && (
          <motion.div
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-[#1c1b1c] border border-[#3a3026] text-[#c8a96e] font-body text-xs uppercase tracking-wider px-5 py-3 shadow-2xl pointer-events-none"
          >
            {shortlistToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Consultation Shortlist Pill (Only shown when items are shortlisted) */}

      {shortlist.length > 0 && (
        <aside aria-label="Consultation Shortlist">
          <motion.div
            layout
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-4 sm:right-8 z-40 max-w-sm sm:max-w-md w-auto"
          >
            {/* Selected Shortlist Pill */}
            <div className="bg-[#141212]/95 border border-[#C8A96E]/40 rounded-full p-2 pl-4 pr-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8A96E] animate-pulse" />
                <span className="font-dmsans text-xs text-white font-medium whitespace-nowrap">
                  <span className="text-[#C8A96E] font-bold">{shortlist.length}</span> {shortlist.length === 1 ? 'Item' : 'Items'} for Consultation
                </span>
              </div>

              {/* Action: WhatsApp Pre-filled Specialist */}
              <a
                href={getWhatsAppShortlistLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C8A96E] hover:bg-white text-[#0E0C0C] font-dmsans text-[11px] font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                <span>WhatsApp Expert</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>

              {/* Clear shortlist button */}
              <button
                onClick={() => setShortlist([])}
                className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#A39E93] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Clear shortlist"
                title="Clear shortlist"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </aside>
      )}

      {/* ── Lookbook Product Detail Drawer ─────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 flex justify-end" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="drawer-title"
          >
            {/* Dark glass backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md" 
              onClick={() => handleProductSelect(null)}
              aria-hidden="true"
            />
            
            {/* Lookbook Drawer Panel */}
            <motion.div 
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#110F0F] h-full overflow-y-auto border-l border-white/[0.1] flex flex-col shadow-2xl z-10 focus:outline-none"
              tabIndex={-1}
            >
              {/* Sticky Architectural Drawer Header */}
              <div className="sticky top-0 flex items-center justify-between p-5 sm:p-6 bg-[#110F0F]/95 backdrop-blur-xl border-b border-white/[0.08] z-10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
                  <span className="font-dmsans text-[10.5px] uppercase tracking-[0.18em] text-[#C8A96E] font-medium">
                    Hardware Collection • Sakchi • Authorized Dealer
                  </span>
                </div>
                <button 
                  ref={closeButtonRef}
                  onClick={() => handleProductSelect(null)}
                  aria-label="Close product specifications"
                  className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A39E93] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Lookbook Content */}
              <div className="flex-1 p-6 sm:p-8 space-y-8">
                
                {/* Large Specimen Display Image */}
                <div className="relative w-full aspect-[16/11] bg-[#181716] border border-white/[0.12] rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(200,169,110,.25),transparent_50%)]" />
                  <Image
                    src={getProductDisplayImage(selectedProduct)}
                    alt={selectedProduct.name || "Product Image"}
                    fill
                    placeholder={selectedProduct.imageLqip ? "blur" : "empty"}
                    blurDataURL={selectedProduct.imageLqip}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6 relative z-[2] opacity-90"
                  />
                </div>

                {/* Product Metadata & Title */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-dmsans text-xs font-bold text-[#C8A96E] uppercase tracking-[0.16em]">
                      {selectedProduct.brandName || selectedProduct.brand}
                    </span>
                    {(selectedProduct.catalogReference || selectedProduct.model) && (
                      <span className="font-mono text-[11px] text-[#6E6A62] bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.06]">
                        Ref: {selectedProduct.catalogReference || selectedProduct.model}
                      </span>
                    )}
                  </div>

                  <h2 
                    id="drawer-title" 
                    className="font-cormorant text-3xl sm:text-4xl text-white font-normal mb-4 leading-tight uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {selectedProduct.name}
                  </h2>
                  
                  {(selectedProduct.shortDescription || selectedProduct.description) && (
                    <p className="font-dmsans text-sm text-[#A39E93] leading-relaxed mb-6 font-light">
                      {selectedProduct.shortDescription || selectedProduct.description}
                    </p>
                  )}
                </div>

                {/* Technical Specifications Table */}
                {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                  <div>
                    <h3 className="font-dmsans text-[11px] font-bold uppercase tracking-[0.16em] text-[#C8A96E] mb-3">
                      Verified Technical Specifications
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProduct.specifications.map((spec: ProductSpecification, idx: number) => (
                        <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                          <dt className="text-[10px] uppercase font-dmsans tracking-wider text-[#6E6A62] mb-1">{spec.key}</dt>
                          <dd className="font-dmsans text-xs font-medium text-white">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Showroom Physical Display Callout & Direct Actions */}
                <div className="bg-[#141212] border border-white/[0.08] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shrink-0 animate-pulse" />
                    <div>
                      <h4 className="font-dmsans text-xs font-semibold text-white uppercase tracking-wider">
                        Available for Physical Inspection
                      </h4>
                      <p className="font-dmsans text-xs text-[#A39E93] font-light">
                        Experience the live tactile finish and mechanics at our Sakchi, Jamshedpur showroom.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => openDrawer({
                        source: "product_drawer",
                        intent: "enquiry",
                        product: {
                          slug: getSlugString(selectedProduct.slug) || selectedProduct.id || selectedProduct._id || "",
                          name: selectedProduct.name,
                        },
                        category: selectedProduct.category ? {
                          slug: selectedProduct.category,
                          name: selectedProduct.category,
                        } : undefined,
                        brand: (selectedProduct.brandName || selectedProduct.brand) ? {
                          slug: selectedProduct.brandName || selectedProduct.brand || "",
                          name: selectedProduct.brandName || selectedProduct.brand || "",
                        } : undefined
                      })}
                      className="flex-1 text-center py-3.5 px-5 bg-[#C8A96E] hover:bg-white text-[#0E0C0C] font-dmsans font-bold uppercase tracking-widest text-xs rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Consult an Expert</span>
                    </button>
                    
                    <button
                      onClick={() => toggleShortlist(selectedProduct)}
                      className={`px-5 py-3.5 rounded-full font-dmsans text-xs font-semibold uppercase tracking-wider transition-all border ${
                        shortlist.some(p => (p._id || p.id) === (selectedProduct._id || selectedProduct.id))
                          ? 'bg-white/[0.1] border-[#C8A96E] text-[#C8A96E]'
                          : 'bg-white/[0.04] border-white/[0.1] text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {shortlist.some(p => (p._id || p.id) === (selectedProduct._id || selectedProduct.id))
                        ? "In Shortlist ✓"
                        : "Add to Shortlist"}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Filter Bottom Sheet ─────────────────────────── */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full bg-[#141212] border-t border-white/[0.12] rounded-t-3xl p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="font-dmsans text-sm font-bold uppercase tracking-wider text-white">
                  Filter Collections
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* All Collections */}
              <div>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setIsMobileFilterOpen(false);
                    setHasInteracted(true);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-dmsans uppercase tracking-wider text-left transition-all ${
                    activeCategory === "all"
                      ? "bg-[#C8A96E] text-[#0E0C0C] font-bold"
                      : "bg-white/[0.04] text-[#D1CCC4] border border-white/[0.08]"
                  }`}
                >
                  <span>All Collections</span>
                  <span className="font-mono text-[10.5px]">({products.length})</span>
                </button>
              </div>

              {/* Showroom Families with Progressive Disclosure */}
              <div>
                <span className="font-dmsans text-[11px] uppercase tracking-wider text-[#C8A96E] font-bold block mb-2">
                  Showroom Families
                </span>
                <div className="space-y-1.5">
                  {SHOWROOM_FAMILIES.map((family, idx) => {
                    const isFamilyActive = activeFamilySlug === family.slug;
                    const familyCollections = getFamilyCollections(family.slug);

                    return (
                      <div key={family.slug} className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveCategory(family.slug);
                            setIsMobileFilterOpen(false);
                            setHasInteracted(true);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-dmsans transition-all text-left ${
                            isFamilyActive && (activeCategory === family.slug || activeCategory === "all")
                              ? "bg-[#C8A96E]/20 border border-[#C8A96E]/50 text-[#C8A96E] font-bold"
                              : isFamilyActive
                              ? "text-white font-medium bg-white/[0.06]"
                              : "bg-white/[0.03] text-[#A39E93] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#C8A96E]">{`0${idx + 1}`}</span>
                            <span className="uppercase tracking-wider">{family.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-[#A39E93]">
                            {familyCollections.length}
                          </span>
                        </button>

                        {/* Inline Collections in Mobile */}
                        {isFamilyActive && familyCollections.length > 0 && (
                          <div className="pl-4 pr-1 py-1 space-y-1 border-l border-white/[0.08] ml-3">
                            {familyCollections.map((col) => {
                              const colSlug = getSlugString(col.slug);
                              const isColSelected = activeCategory === colSlug;
                              return (
                                <button
                                  key={colSlug || col._id || col.id}
                                  onClick={() => {
                                    setActiveCategory(colSlug);
                                    setIsMobileFilterOpen(false);
                                    setHasInteracted(true);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-dmsans text-left ${
                                    isColSelected
                                      ? "bg-[#C8A96E] text-[#0E0C0C] font-bold"
                                      : "text-[#A39E93] hover:text-white bg-white/[0.02]"
                                  }`}
                                >
                                  <span>{col.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div>
                <span className="font-dmsans text-[11px] uppercase tracking-wider text-[#C8A96E] font-bold block mb-3">
                  Authorized Brands
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map(b => (
                    <button
                      key={b}
                      onClick={() => {
                        setActiveBrand(b.toLowerCase());
                        setIsMobileFilterOpen(false);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-dmsans uppercase tracking-wider ${
                        activeBrand === b.toLowerCase()
                          ? "bg-[#C8A96E] text-[#0E0C0C] font-bold"
                          : "bg-white/[0.04] text-[#A39E93] border border-white/[0.08]"
                      }`}
                    >
                      {b === "all" ? "All Brands" : b}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
