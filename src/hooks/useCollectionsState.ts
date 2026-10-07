"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
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

export interface UseCollectionsStateProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  settings?: SiteSettings | null;
}

export function useCollectionsState({
  categories,
  products,
  settings,
}: UseCollectionsStateProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  // Seeded from ?product= so a deep link (the homepage product reel) opens the
  // product on arrival; the sync below only reacts to later URL changes.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const productSlug = searchParams.get("product");
    if (!productSlug) return null;
    return (
      products.find((p) => getSlugString(p.slug) === productSlug || p.id === productSlug || p._id === productSlug) ??
      null
    );
  });
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<ResolvedBrand | Brand | null>(null);
  const [shortlist, setShortlist] = useState<Product[]>([]);
  const [shortlistToast, setShortlistToast] = useState<string | null>(null);

  const triggerElementRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize selected product with URL searchParams (?product=...)
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
  if (prevSearchParams !== searchParams) {
    setPrevSearchParams(searchParams);

    const productSlug = searchParams.get("product");
    if (productSlug) {
      const prod = products.find(
        (p) => p.slug === productSlug || p.id === productSlug || p._id === productSlug
      );
      if (
        prod &&
        (!selectedProduct ||
          (selectedProduct.slug !== productSlug && selectedProduct.id !== productSlug))
      ) {
        setSelectedProduct(prod);
      }
    } else if (selectedProduct) {
      setSelectedProduct(null);
    }
  }

  // Handle product selection & deep-link update without full page refresh (S3E)
  const handleProductSelect = useCallback(
    (product: Product | null, event?: React.MouseEvent | HTMLElement) => {
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
    },
    [pathname]
  );

  // Centralized scroll lock for lookbook drawer
  useEffect(() => {
    if (selectedProduct) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [selectedProduct]);

  // Toggle Consultation Shortlist (Max 5 items — S3D / D-19)
  const toggleShortlist = useCallback((product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = product._id || product.id;
    setShortlist((prev) => {
      if (prev.some((p) => (p._id || p.id) === id)) {
        return prev.filter((p) => (p._id || p.id) !== id);
      } else {
        if (prev.length >= 5) {
          setShortlistToast("Consultation list is full — up to 5 specimens at a time.");
          setTimeout(() => setShortlistToast(null), 3000);
          return prev;
        }
        return [...prev, product];
      }
    });
  }, []);

  // Structured pre-filled WhatsApp consultation message (S3D)
  const getWhatsAppShortlistLink = useCallback(() => {
    const defaultNumber = settings?.whatsappNumber || "919835190738";
    if (shortlist.length === 0) {
      const genericMsg =
        "Hardware Collection — Architectural Consultation\n\nHi, I would like to consult with a specialist regarding architectural hardware and digital lock specifications for my project.";
      return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(genericMsg)}`;
    }

    const itemsList = shortlist
      .map(
        (p, i) =>
          `${i + 1}. ${p.brandName || p.brand || "Hardware Collection"} — ${p.name}`
      )
      .join("\n");

    const message = `Hardware Collection — Architectural Consultation\n\nI would like to consult on the following items:\n\n${itemsList}\n\nPlease share finish samples, availability, and technical sizing.`;
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
          name: c.name || "Category",
        });
      }
    });
    return list;
  }, [categories]);

  // Display categories with product search filtering (D-14)
  const displayCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const matchingProducts = products.filter((p) => {
      const pName = (p.name || "").toLowerCase();
      const pBrand = (p.brandName || p.brand || "").toLowerCase().replace(/ä/g, "a");
      const pDesc = (p.shortDescription || p.description || "").toLowerCase();
      const pModel = (p.catalogReference || p.model || "").toLowerCase();

      const matchSearch =
        !query ||
        pName.includes(query) ||
        pBrand.includes(query) ||
        pDesc.includes(query) ||
        pModel.includes(query) ||
        (Array.isArray(p.searchKeywords) &&
          p.searchKeywords.some((k) => (k || "").toLowerCase().includes(query)));

      return matchSearch;
    });

    const catMap = new Map<string, DisplayCategory>();
    uniqueCategories.forEach((cat) => {
      const key = String(typeof cat.slug === "object" ? cat.slug?.current : cat.slug);
      if (!catMap.has(key)) {
        const catProducts = matchingProducts.filter((p) => {
          const pCat = String(p.categorySlug || p.category || "").toLowerCase();
          return pCat === key || pCat.includes(key) || key.includes(pCat);
        });

        if (catProducts.length > 0) {
          catMap.set(key, {
            ...cat,
            products: catProducts,
          });
        }
      }
    });

    if (catMap.size === 0 && matchingProducts.length > 0) {
      catMap.set("results", {
        slug: "results",
        name: "Curated Collection",
        products: matchingProducts,
      });
    }

    return Array.from(catMap.values());
  }, [uniqueCategories, products, searchQuery]);

  const totalSpecimensCount = useMemo(() => {
    return displayCategories.reduce((acc, cat) => acc + (cat.products?.length || 0), 0);
  }, [displayCategories]);

  // D-12: Three-step image fallback chain: product image -> category image -> siteSettings default
  const getProductDisplayImage = useCallback(
    (prod: Product) => {
      // Guard against placeholder images (e.g. stock eucalyptus photo attached in CMS to lock products)
      const isPlaceholder = prod.imageUrl?.includes("42e0899cf4fd0e454721a832b9e34e214dcc71d9");
      if (prod.imageUrl && !isPlaceholder) return prod.imageUrl;

      const nameLower = (prod.name || "").toLowerCase();
      if (nameLower.includes("mortise") || nameLower.includes("door lock") || nameLower.includes("mortice")) {
        return "/cinema/collection/HC-05-01.png";
      }

      const catKey = String(prod.categorySlug || prod.category || "").toLowerCase();
      const matchedCategory = uniqueCategories.find((c) => {
        const cSlug = getSlugString(c.slug).toLowerCase();
        return (
          cSlug === catKey ||
          c._id?.toLowerCase() === catKey ||
          c.name?.toLowerCase() === catKey
        );
      });
      if (matchedCategory?.imageUrl) return matchedCategory.imageUrl;
      if (settings?.defaultCategoryImageUrl) return settings.defaultCategoryImageUrl;
      return "/cinema/categories/HC-03-DOORS.png";
    },
    [uniqueCategories, settings]
  );

  const activeCategorySlug = searchParams?.get("category") || "";
  const activeBrandSlug = searchParams?.get("brand") || "";

  return {
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
    searchInputRef,
    uniqueCategories,
    displayCategories,
    totalSpecimensCount,
    getProductDisplayImage,
    getWhatsAppShortlistLink,
    activeCategorySlug,
    activeBrandSlug,
  };
}
