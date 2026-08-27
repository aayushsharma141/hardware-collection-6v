"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { SHOWROOM_FAMILIES } from "@/data/catalog";
import {
  Product,
  Category,
  Brand,
  ResolvedBrand,
  SiteSettings,
  getSlugString,
} from "@/types/catalog";

export interface DisplayCategory extends Category {
  products: Product[];
  isDraftCategory?: boolean;
}

export const SHOWROOM_FAMILIES_NAV = [
  { id: "all", label: "ALL", shortLabel: "ALL", filterSlugs: [] },
  { id: "handles-knobs", label: "HANDLES & KNOBS", shortLabel: "HANDLES", filterSlugs: ["handles-knobs", "main-door-handles", "cabinet-wardrobe-handles"] },
  { id: "door-hardware", label: "DOOR HARDWARE", shortLabel: "DOOR", filterSlugs: ["door-hardware", "door", "digital-locks", "mortise-door-locks", "main-door-handles", "glass-hardware", "door-closers-stoppers", "safes"] },
  { id: "bathroom", label: "BATHROOM", shortLabel: "BATHROOM", filterSlugs: ["bathroom", "bathroom-accessories"] },
  { id: "kitchen-wardrobes", label: "KITCHEN & WARDROBES", shortLabel: "KITCHEN & WARDROBES", filterSlugs: ["kitchen-wardrobes", "kitchen", "wardrobe", "modular-kitchen-hardware", "kitchen-sinks-faucets", "wardrobe-hardware-sliding", "hinges-soft-close", "drawer-channels", "safes"] },
  { id: "furniture-hardware", label: "FURNITURE HARDWARE", shortLabel: "FURNITURE", filterSlugs: ["furniture-hardware", "drawer-channels", "hinges-soft-close", "cabinet-wardrobe-handles"] },
];

export interface UseCollectionsStateProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  settings?: SiteSettings | null;
}

export function useCollectionsState({
  categories,
  products,
  brands,
  settings,
}: UseCollectionsStateProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category")?.toLowerCase() || "all");
  const [activeBrand, setActiveBrand] = useState(() => searchParams.get("brand")?.toLowerCase() || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | Brand | null>(null);
  const [shortlist, setShortlist] = useState<Product[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [shortlistToast, setShortlistToast] = useState<string | null>(null);

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const brandDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize state with URL searchParams during render
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
  if (prevSearchParams !== searchParams) {
    setPrevSearchParams(searchParams);
    const brandParam = searchParams.get("brand")?.toLowerCase() || "all";
    const categoryParam = searchParams.get("category")?.toLowerCase() || "all";
    if (activeBrand !== brandParam) setActiveBrand(brandParam);
    if (activeCategory !== categoryParam) setActiveCategory(categoryParam);

    const productSlug = searchParams.get("product");
    if (productSlug) {
      const prod = products.find(p => p.slug === productSlug || p.id === productSlug || p._id === productSlug);
      if (prod && (!selectedProduct || (selectedProduct.slug !== productSlug && selectedProduct.id !== productSlug))) {
        setSelectedProduct(prod);
      }
    } else if (selectedProduct) {
      setSelectedProduct(null);
    }
  }

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
  const toggleShortlist = useCallback((product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = product._id || product.id;
    setShortlist(prev => {
      if (prev.some(p => (p._id || p.id) === id)) {
        return prev.filter(p => (p._id || p.id) !== id);
      } else {
        if (prev.length >= 5) {
          setShortlistToast("Shortlist is full — up to 5 products at a time.");
          setTimeout(() => setShortlistToast(null), 3000);
          return prev;
        }
        return [...prev, product];
      }
    });
  }, []);

  // Structured pre-filled WhatsApp consultation message
  const getWhatsAppShortlistLink = useCallback(() => {
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
  }, [settings?.whatsappNumber, shortlist]);

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
        const cSlug = getSlugString(c.slug).toLowerCase();
        const cFamilySlugs = (c.familySlugs || []).map((s: string) => s.toLowerCase());
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

  return {
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
    uniqueCategories,
    availableBrands,
    displayCategories,
    totalSpecimensCount,
    activeFamilySlug,
    getFamilyCollections,
    getProductDisplayImage,
    getWhatsAppShortlistLink,
    handleResetFilters,
  };
}
