"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Product, Category, getSlugString } from "@/types/catalog";
import { SHOWROOM_FAMILIES } from "@/data/catalog";

export interface CollectionFilterRailProps {
  products: Product[];
  activeCategory: string;
  activeBrand: string;
  activeFamilySlug: string | null;
  availableBrands: string[];
  onSelectCategory: (categorySlug: string) => void;
  onSelectBrand: (brand: string) => void;
  getFamilyCollections: (familySlug: string) => Category[];
  showroomFamiliesNav: Array<{ id: string; label: string; shortLabel: string; filterSlugs: string[] }>;
}

export default function CollectionFilterRail({
  products,
  activeCategory,
  activeBrand,
  activeFamilySlug,
  availableBrands,
  onSelectCategory,
  onSelectBrand,
  getFamilyCollections,
  showroomFamiliesNav,
}: CollectionFilterRailProps) {
  return (
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
        onClick={() => onSelectCategory("all")}
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
            const familyNavMatch = showroomFamiliesNav.find(
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
                  onClick={() => onSelectCategory(family.slug)}
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
                          onClick={() => onSelectCategory(colSlug)}
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
                onClick={() => onSelectBrand(b.toLowerCase())}
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
  );
}
