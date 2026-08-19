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
}: { 
  categories: any[]; 
  subcategories?: any[];
  products: any[]; 
  brands: any[]; 
  settings: any;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<any | null>(null);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
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
  const handleProductSelect = useCallback((product: any | null, event?: React.MouseEvent | HTMLElement) => {
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
      params.set("product", product.slug || product.id || product._id);
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
  const toggleShortlist = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHasInteracted(true);
    const id = product._id || product.id;
    if (shortlist.some(p => (p._id || p.id) === id)) {
      setShortlist(prev => prev.filter(p => (p._id || p.id) !== id));
    } else {
      if (shortlist.length >= 5) {
        alert("Your consultation shortlist holds up to 5 products at a time.");
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
  const uniqueCategories = useMemo(() => {
    const seen = new Set<string>();
    const list: any[] = [];
    (categories || []).forEach((c) => {
      const slugVal = c.slug?.current || c.slug || c._id;
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
    const parentCategory = uniqueCategories.find(c => c.slug === activeCategory);
    if (parentCategory && parentCategory.familySlugs && parentCategory.familySlugs.length > 0) {
      return parentCategory.familySlugs[0];
    }
    return null;
  }, [activeCategory, uniqueCategories]);

  const getFamilyCollections = useCallback((familySlug: string) => {
    const family = SHOWROOM_FAMILIES.find(f => f.slug === familySlug || f.id === familySlug);
    if (!family) return [];
    return uniqueCategories.filter(c => {
      const cSlug = c.slug.toLowerCase();
      const cFamilySlugs = (c.familySlugs || []).map((s: string) => s.toLowerCase());
      return family.collectionSlugs.includes(cSlug) || cFamilySlugs.includes(family.slug);
    });
  }, [uniqueCategories]);

  // Remaining specific collections for MORE panel
  const moreCategories = useMemo(() => {
    const familyIds = new Set(SHOWROOM_FAMILIES_NAV.map(f => f.id));
    return uniqueCategories.filter(c => !familyIds.has(c.slug.toLowerCase()));
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

    let targetCategories: any[] = [];
    if (activeCategory === "all") {
      targetCategories = uniqueCategories;
    } else if (familyMatch && familyMatch.filterSlugs.length > 0) {
      targetCategories = uniqueCategories.filter(c => {
        const cSlug = c.slug.toLowerCase();
        const cFamilySlugs = (c.familySlugs || []).map((s: string) => s.toLowerCase());
        return familyMatch.filterSlugs.includes(cSlug) || cFamilySlugs.includes(familyMatch.id);
      });
      if (targetCategories.length === 0) {
        targetCategories = uniqueCategories;
      }
    } else {
      targetCategories = uniqueCategories.filter(c => c.slug === activeCategory.toLowerCase() || c.slug.includes(activeCategory.toLowerCase()));
      if (targetCategories.length === 0) {
        targetCategories = [{ slug: activeCategory, name: activeCategory.replace(/-/g, " ").toUpperCase() }];
      }
    }

    const catMap = new Map<string, any>();
    targetCategories.forEach(cat => {
      const key = cat.slug;
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

  return (
    <div className="min-h-screen bg-[#0E0C0C] text-[#F3EFEA] selection:bg-[#C8A96E]/30 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar 
        primaryPhone={settings?.primaryPhone}
        whatsappNumber={settings?.whatsappNumber}
        defaultWhatsappMessage={settings?.defaultWhatsappMessage}
      />

      <main className="w-full pb-36">
        
        {/* ── Architectural Editorial Hero Header (With Proper Navbar Clearance) ── */}
        <section className="relative w-full border-b border-white/[0.08] pt-36 sm:pt-44 md:pt-48 pb-12 md:pb-16 overflow-hidden">
          {/* Subtle Volumetric Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#C8A96E]/15 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 text-center relative z-10">
            {/* Showroom Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
              <span className="font-dmsans text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em] text-[#C8A96E] font-medium">
                Authorized Digital Showroom • Sakchi · Jamshedpur
              </span>
            </div>

            {/* Editorial Title */}
            <h1 
              className="font-cormorant text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-[0.05em] uppercase mb-4 leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              The Collection
            </h1>

            {/* Subtitle */}
            <p className="font-dmsans text-[#A39E93] max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed font-light">
              Curated architectural hardware for considered residential and commercial interiors. Authorized partner for Hafele, Dorset, Labacha, Godrej, Hettich & Kich.
            </p>
          </div>
        </section>

        {/* ── Mobile Sticky Quick Bar (lg:hidden) ── */}
        <div className="lg:hidden sticky top-[72px] z-30 w-full px-3 py-2 bg-[#0E0C0C]/90 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#141212] border border-white/[0.1] text-white font-dmsans text-xs uppercase tracking-wider shadow-md"
              aria-label="Open collection index menu"
            >
              <div className="flex items-center gap-2 truncate">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A96E] shrink-0" />
                <span className="truncate">
                  {activeCategory === "all" ? "All Collections" : activeCategory.replace(/-/g, " ")}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A39E93] shrink-0 ml-1" />
            </button>

            {activeBrand !== "all" && (
              <button
                onClick={() => setActiveBrand("all")}
                className="px-2.5 py-2.5 rounded-xl bg-[#C8A96E]/15 border border-[#C8A96E]/30 text-[11px] font-dmsans text-[#C8A96E] flex items-center gap-1 shrink-0"
              >
                <span>{activeBrand.toUpperCase()}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── Main Two-Column Layout (Full-Wide Left Index + Right Product Canvas) ── */}
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-6 md:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 2xl:gap-12 items-start">
            
            {/* ── Left Sticky Column: Architectural Collection Index (Desktop) ── */}
            <aside 
              aria-label="Collection Index" 
              className="hidden lg:block lg:col-span-4 xl:col-span-3 2xl:col-span-2 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-2 space-y-6"
            >
              <div className="bg-[#141212]/95 border border-white/[0.08] rounded-2xl p-4 shadow-2xl backdrop-blur-2xl space-y-5">
                
                {/* Index Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C8A96E] font-medium">
                      Collection Index
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#A39E93]">
                    {products.length} Total
                  </span>
                </div>

                {/* All Collections Button */}
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setHasInteracted(true);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-dmsans uppercase tracking-wider text-left transition-all ${
                    activeCategory === "all"
                      ? "bg-[#C8A96E]/15 border border-[#C8A96E]/40 text-[#C8A96E] font-bold shadow-sm"
                      : "text-[#D1CCC4] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span>All Collections</span>
                  <span className="font-mono text-[10.5px] text-[#A39E93]">({products.length})</span>
                </button>

                {/* Showroom Families Tree */}
                <div className="space-y-1.5">
                  <div className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#6E6A62] px-2 pt-1 font-semibold">
                    Showroom Families
                  </div>
                  
                  {SHOWROOM_FAMILIES.map((family, idx) => {
                    const isFamilyActive = activeFamilySlug === family.slug;
                    const familyCollections = getFamilyCollections(family.slug);
                    const familyProductCount = products.filter(p => {
                      const pCat = (p.categorySlug || p.category || "").toLowerCase();
                      return family.collectionSlugs.includes(pCat);
                    }).length;

                    return (
                      <div key={family.slug} className="space-y-1">
                        {/* Family Parent Trigger */}
                        <button
                          onClick={() => {
                            setActiveCategory(family.slug);
                            setHasInteracted(true);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-dmsans transition-all text-left group ${
                            isFamilyActive && (activeCategory === family.slug || activeCategory === "all")
                              ? "bg-[#C8A96E]/15 border border-[#C8A96E]/40 text-[#C8A96E] font-semibold"
                              : isFamilyActive
                              ? "text-white font-medium bg-white/[0.04]"
                              : "text-[#B8B2A7] hover:bg-white/[0.03] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#C8A96E]/70">{`0${idx + 1}`}</span>
                            <span className="uppercase tracking-wider text-[11px]">{family.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-[#A39E93] group-hover:text-white">
                            {familyCollections.length}
                          </span>
                        </button>

                        {/* Progressive Disclosure: Inline Canonical Collections */}
                        {isFamilyActive && familyCollections.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="pl-5 pr-1 py-1 space-y-0.5 border-l border-white/[0.08] ml-4"
                          >
                            {familyCollections.map((col, colIdx) => {
                              const isColSelected = activeCategory === col.slug;
                              const isLast = colIdx === familyCollections.length - 1;
                              const colProductCount = products.filter(p => {
                                const pCat = (p.categorySlug || p.category || "").toLowerCase();
                                return pCat === col.slug || pCat.includes(col.slug) || col.slug.includes(pCat);
                              }).length;

                              return (
                                <button
                                  key={col.slug}
                                  onClick={() => {
                                    setActiveCategory(col.slug);
                                    setHasInteracted(true);
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-dmsans text-left transition-colors ${
                                    isColSelected
                                      ? "bg-[#C8A96E] text-[#0E0C0C] font-bold shadow-sm"
                                      : "text-[#A39E93] hover:text-white hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate mr-2">
                                    <span className="text-white/30 font-mono text-[9px]">
                                      {isLast ? "└" : "├"}
                                    </span>
                                    <span className="truncate">{col.name}</span>
                                  </div>
                                  <span className={`font-mono text-[9.5px] ${isColSelected ? "text-[#0E0C0C]" : "text-[#6E6A62]"}`}>
                                    {colProductCount}
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

                {/* Authorized Brands Filter Section */}
                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  <div className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#6E6A62] px-2 font-semibold">
                    Authorized Brands
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableBrands.map((b) => {
                      const isSelected = activeBrand === b.toLowerCase();
                      return (
                        <button
                          key={b}
                          onClick={() => {
                            setActiveBrand(b.toLowerCase());
                            setHasInteracted(true);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-dmsans uppercase tracking-wider text-left transition-colors truncate ${
                            isSelected
                              ? "bg-[#C8A96E] text-[#0E0C0C] font-bold"
                              : "bg-white/[0.03] text-[#A39E93] hover:text-white hover:bg-white/[0.06] border border-white/[0.04]"
                          }`}
                        >
                          {b === "all" ? "All Brands" : b}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </aside>

            {/* ── Right Column: Product Canvas ── */}
            <div className="lg:col-span-8 xl:col-span-9 2xl:col-span-10 space-y-8">
              
              {/* Search Instrument & Canvas Header */}
              <div className="bg-[#141212]/95 border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Full-width Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#A39E93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search specimens, part references, materials..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setHasInteracted(true);
                      }}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-9 text-xs sm:text-sm font-dmsans text-white placeholder:text-[#6E6A62] focus:outline-none focus:border-[#C8A96E]/70 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39E93] hover:text-white p-1"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Brand Filter Selector for Tablet/Desktop */}
                  <div className="relative shrink-0" ref={brandDropdownRef}>
                    <button
                      onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                      aria-expanded={isBrandDropdownOpen}
                      aria-haspopup="listbox"
                      className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-dmsans uppercase tracking-[0.14em] transition-all duration-150 ${
                        activeBrand !== "all"
                          ? "bg-[#C8A96E]/15 border-[#C8A96E]/50 text-[#C8A96E] font-medium"
                          : "bg-white/[0.04] border-white/[0.08] text-[#A39E93] hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span>{activeBrand === "all" ? "BRAND: ALL" : `BRAND: ${activeBrand.toUpperCase()}`}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isBrandDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isBrandDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-[#141212] border border-white/[0.12] rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-2xl"
                        >
                          <div className="py-1 px-2.5 text-[9.5px] uppercase tracking-[0.18em] text-[#6E6A62] font-semibold">
                            Authorized Brands
                          </div>
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
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-dmsans transition-colors ${
                                  isSelected
                                    ? "bg-[#C8A96E] text-[#0E0C0C] font-semibold"
                                    : "text-[#D1CCC4] hover:bg-white/[0.06] hover:text-white"
                                }`}
                              >
                                <span>{b === "all" ? "All Brands" : b}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Contextual Active Summary Bar */}
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#C8A96E] font-medium">
                      {totalSpecimensCount} {totalSpecimensCount === 1 ? 'Specimen' : 'Specimens'} Available
                    </span>
                    <span className="text-white/20 hidden sm:inline">•</span>
                    <span className="font-dmsans text-[#A39E93] uppercase text-[11px] tracking-wider truncate">
                      {activeCategory === "all" ? "All Showroom Collections" : activeCategory.replace(/-/g, " ")}
                    </span>
                  </div>

                  {(activeCategory !== "all" || activeBrand !== "all" || searchQuery) && (
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setActiveBrand("all");
                        setSearchQuery("");
                      }}
                      className="text-[11px] font-dmsans text-[#A39E93] hover:text-white underline underline-offset-4 transition-colors shrink-0"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* ── Empty State: Showroom Inquire Fallback ────────────── */}
              {displayCategories.length === 0 && (
                <div className="max-w-xl mx-auto px-4 py-16 text-center my-6">
                  <div className="bg-[#141212] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
                    <Compass className="w-10 h-10 text-[#C8A96E] mx-auto mb-3 stroke-[1.5]" />
                    <h2 
                      className="font-cormorant text-2xl md:text-3xl text-white mb-2"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      {activeBrand !== "all" 
                        ? `No ${activeBrand.toUpperCase()} specimens in this category`
                        : "No matching architectural hardware found"}
                    </h2>
                    <p className="font-dmsans text-xs md:text-sm text-[#A39E93] max-w-md mx-auto mb-6 leading-relaxed font-light">
                      Our Sakchi showroom holds comprehensive specification catalogs and mockups for all authorized partner brands. Inquire directly with our specification desk.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={`https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=Hi%20Hardware%20Collection%2C%20I%20am%20looking%20for%20${encodeURIComponent(activeBrand !== "all" ? activeBrand : "architectural hardware")}%20specifications.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 bg-[#C8A96E] text-[#0E0C0C] font-dmsans font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors rounded-full shadow-md flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        Ask on WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("all");
                          setActiveBrand("all");
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white font-dmsans text-xs uppercase tracking-wider rounded-full border border-white/[0.1] transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 12-Column Rigid Blueprint Grid ────────────────────── */}
              <div className="space-y-16">
                {displayCategories.map((cat) => (
                  <section key={cat.slug} className="space-y-6">
                    
                    {/* Category Editorial Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-white/[0.08] pb-3">
                      <div>
                        <h2 
                          className="font-cormorant text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-[0.03em] uppercase"
                          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                        >
                          {cat.name}
                        </h2>
                        {cat.description && (
                          <p className="font-dmsans text-xs md:text-sm text-[#A39E93] max-w-2xl mt-1 leading-relaxed font-light">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#C8A96E] shrink-0">
                        {cat.products.length} {cat.products.length === 1 ? 'Specimen' : 'Specimens'} Available
                      </span>
                    </div>

                    {/* 12-Column Controlled Asymmetric Grid */}
              <motion.div 
                layout
                className="grid grid-cols-12 gap-4 sm:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {cat.products.length === 0 ? (
                    <div className="col-span-12 bg-[#131111] border border-white/[0.08] rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                      <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C8A96E]">
                        <Compass className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <div>
                        <span className="font-dmsans text-[10.5px] uppercase tracking-[0.22em] text-[#C8A96E] font-medium block mb-1">
                          Collection Under Curation
                        </span>
                        <h3 
                          className="font-cormorant text-2xl sm:text-3xl text-white uppercase mb-2"
                          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                        >
                          {cat.name}
                        </h3>
                        <p className="font-dmsans text-xs sm:text-sm text-[#A39E93] max-w-lg mx-auto font-light leading-relaxed">
                          This collection is available through our Sakchi showroom and specialist desk. For current models, finishes, official catalogs, and project availability:
                        </p>
                      </div>
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=Hardware%20Collection%20%E2%80%94%20Inquiry%0A%0AI%20am%20looking%20for%20specifications%20and%20catalogs%20for%20${encodeURIComponent(cat.name)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A96E] hover:bg-white text-[#0E0C0C] font-dmsans text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Consult on WhatsApp →</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    cat.products.map((prod: any, idx: number) => {
                    const isShortlisted = shortlist.some(p => (p._id || p.id) === (prod._id || prod.id));
                    const isFeatured = prod.featured === true;
                    
                    // Assign card span classes: feature (12-col), wide (8-col / 6-col), standard (3-col / 4-col desktop)
                    let spanClass = "col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3";
                    if (isFeatured) {
                      spanClass = "col-span-12";
                    } else if (idx % 7 === 0 && cat.products.length > 3) {
                      spanClass = "col-span-12 lg:col-span-12 xl:col-span-8 2xl:col-span-6";
                    }

                    return (
                      <motion.article
                        layout
                        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        key={prod._id || prod.id}
                        onClick={(e) => handleProductSelect(prod, e)}
                        className={`group relative bg-[#131111] border border-white/[0.08] hover:border-[#C8A96E]/50 rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] ${spanClass}`}
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
                          {/* Image Specimen Container */}
                          <div className={`relative w-full bg-[#1A1818] rounded-xl mb-5 overflow-hidden border border-white/[0.06] flex items-center justify-center ${
                            isFeatured ? "aspect-[21/9]" : "aspect-[16/11]"
                          }`}>
                            {prod.imageUrl ? (
                              <Image
                                src={prod.imageUrl}
                                alt={prod.name || "Product Specimen"}
                                fill
                                placeholder={prod.imageLqip ? "blur" : "empty"}
                                blurDataURL={prod.imageLqip}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center p-6 text-center">
                                <ShieldCheck className="w-7 h-7 text-[#C8A96E]/70 mb-2" />
                                <span 
                                  className="font-cormorant text-sm uppercase tracking-wider text-white"
                                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                                >
                                  {prod.brandName || prod.brand || "Authorized Partner"}
                                </span>
                                <span className="text-[10px] text-[#A39E93] font-dmsans uppercase tracking-widest mt-1">
                                  Showroom Specimen
                                </span>
                              </div>
                            )}

                            {/* Shortlist Badge */}
                            {isShortlisted && (
                              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#C8A96E] text-[#0E0C0C] font-dmsans font-bold text-[9.5px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>In Shortlist</span>
                              </div>
                            )}
                          </div>

                          {/* Brand & Reference Monospace Header */}
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-dmsans text-[11px] font-bold text-[#C8A96E] uppercase tracking-[0.16em]">
                              {prod.brandName || prod.brand}
                            </span>
                            {(prod.catalogReference || prod.model) && (
                              <span className="font-mono text-[10px] text-[#6E6A62]">
                                {prod.catalogReference || prod.model}
                              </span>
                            )}
                          </div>

                          {/* Product Title */}
                          <h3 className="font-dmsans font-semibold text-base sm:text-lg text-white group-hover:text-[#C8A96E] transition-colors mb-2 leading-snug">
                            {prod.name}
                          </h3>

                          {/* Short Description */}
                          {(prod.shortDescription || prod.description) && (
                            <p className="font-dmsans text-xs text-[#A39E93] mb-5 line-clamp-2 leading-relaxed font-light">
                              {prod.shortDescription || prod.description}
                            </p>
                          )}
                        </div>

                        {/* Card Action Strip */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-3">
                          {/* Shortlist Button */}
                          <button 
                            onClick={(e) => toggleShortlist(prod, e)}
                            className={`flex items-center gap-1.5 font-dmsans text-[11px] font-medium uppercase tracking-[0.12em] transition-all px-3 py-1.5 rounded-lg ${
                              isShortlisted 
                                ? 'text-[#0E0C0C] bg-[#C8A96E] font-semibold' 
                                : 'text-[#D1CCC4] hover:text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]'
                            }`}
                            aria-label={isShortlisted ? `Remove ${prod.name} from shortlist` : `Add ${prod.name} to consultation shortlist`}
                          >
                            {isShortlisted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
                            {isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
                          </button>
                          
                          {/* View Specs Trigger */}
                          <span className="font-dmsans text-[11px] uppercase tracking-[0.12em] text-[#A39E93] group-hover:text-white transition-colors flex items-center gap-1">
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3 transition-transform duration-180 group-hover:translate-x-1" />
                          </span>
                        </div>

                      </motion.article>
                    );
                  }))}
                </AnimatePresence>
              </motion.div>

            </section>
          ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Official Brand Catalogs Strip ─────────────────────── */}
        {products.length > 0 && (
          <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-12 pb-6">
            <CatalogLibrary brands={brands || []} onSelectBrand={setSelectedCatalogBrand} />
          </div>
        )}
      </main>

      {/* ── Floating Consultation Shortlist Pill (Bottom Right/Center) */}
      <aside aria-label="Consultation Shortlist">
        <motion.div
          layout
          className="fixed bottom-6 right-4 sm:right-8 z-40 max-w-sm sm:max-w-md w-auto"
        >
          {shortlist.length > 0 ? (
            /* State C: Selected Shortlist Pill */
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
          ) : hasInteracted ? (
            /* State B: Browsing State Pill */
            <a
              href={getWhatsAppShortlistLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#141212]/90 border border-white/[0.12] hover:border-[#C8A96E]/50 rounded-full py-2.5 px-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex items-center gap-2.5 text-xs text-[#D1CCC4] hover:text-white transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96E]" />
              <span className="font-dmsans">Comparing options? <strong>Consult an expert</strong></span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8A96E] transition-transform duration-180 group-hover:translate-x-1" />
            </a>
          ) : (
            /* State A: Passive State Pill */
            <a
              href={getWhatsAppShortlistLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#141212]/90 border border-white/[0.1] hover:border-[#C8A96E]/40 rounded-full py-2.5 px-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex items-center gap-2 text-xs text-[#A39E93] hover:text-white transition-all group"
            >
              <span className="text-[#C8A96E]">✦</span>
              <span className="font-dmsans">Need help choosing? <strong>Consult an expert</strong></span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8A96E] transition-transform duration-180 group-hover:translate-x-1" />
            </a>
          )}
        </motion.div>
      </aside>

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
                <div className="relative w-full aspect-[16/11] bg-[#1A1818] border border-white/[0.08] rounded-2xl overflow-hidden flex items-center justify-center">
                  {selectedProduct.imageUrl ? (
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name || "Product Image"}
                      fill
                      placeholder={selectedProduct.imageLqip ? "blur" : "empty"}
                      blurDataURL={selectedProduct.imageLqip}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-6"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <ShieldCheck className="w-10 h-10 text-[#C8A96E] mb-2 stroke-[1.5]" />
                      <span 
                        className="font-cormorant text-base uppercase text-white"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        {selectedProduct.brandName || selectedProduct.brand}
                      </span>
                    </div>
                  )}
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
                      {selectedProduct.specifications.map((spec: any, idx: number) => (
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
                          slug: selectedProduct.slug || selectedProduct.id || "",
                          name: selectedProduct.name,
                        },
                        category: selectedProduct.category ? {
                          slug: selectedProduct.category,
                          name: selectedProduct.category,
                        } : undefined,
                        brand: (selectedProduct.brandName || selectedProduct.brand) ? {
                          slug: selectedProduct.brandName || selectedProduct.brand,
                          name: selectedProduct.brandName || selectedProduct.brand,
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
                              const isColSelected = activeCategory === col.slug;
                              return (
                                <button
                                  key={col.slug}
                                  onClick={() => {
                                    setActiveCategory(col.slug);
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
        settings={settings}
        brands={brands}
      />
    </div>
  );
}
