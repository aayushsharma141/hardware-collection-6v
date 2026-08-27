"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SHOWROOM_FAMILIES } from "@/data/catalog";
import { Product, Category, getSlugString } from "@/types/catalog";

export interface MobileFiltersProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  activeCategory: string;
  activeBrand: string;
  activeFamilySlug: string | null;
  products: Product[];
  availableBrands: string[];
  onSelectCategory: (category: string) => void;
  onSelectBrand: (brand: string) => void;
  getFamilyCollections: (familySlug: string) => Category[];
}

export default function MobileFilters({
  isOpen,
  onOpen,
  onClose,
  activeCategory,
  activeBrand,
  activeFamilySlug,
  products,
  availableBrands,
  onSelectCategory,
  onSelectBrand,
  getFamilyCollections,
}: MobileFiltersProps) {
  return (
    <>
      {/* ── Mobile Sticky Quick Filter Bar ── */}
      <div className="lg:hidden sticky top-[68px] z-30 w-full px-4 py-2.5 bg-[#11100f]/95 backdrop-blur-xl border-b border-white/[0.12] shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpen}
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
              onClick={() => onSelectBrand("all")}
              className="px-3 py-2.5 rounded-none bg-[#c8a96e]/15 border border-[#c8a96e]/40 text-[10px] hc-mono text-[#c8a96e] flex items-center gap-1.5 shrink-0"
            >
              <span>{activeBrand.toUpperCase()}</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer Sheet ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-sm h-full bg-[#110F0F] border-r border-white/[0.1] p-6 overflow-y-auto z-10 flex flex-col space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="font-dmsans text-xs font-semibold uppercase tracking-wider text-white">
                  Filter Catalog
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/[0.04] text-[#A39E93] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Collections & Families */}
              <div>
                <span className="font-dmsans text-[11px] uppercase tracking-wider text-[#C8A96E] font-bold block mb-3">
                  Showroom Families
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectCategory("all");
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-dmsans text-left ${
                      activeCategory === "all"
                        ? "bg-[#C8A96E] text-[#0E0C0C] font-bold"
                        : "text-[#A39E93] hover:text-white bg-white/[0.02]"
                    }`}
                  >
                    <span>All Collections</span>
                    <span className="text-[11px]">{products.length}</span>
                  </button>

                  {SHOWROOM_FAMILIES.map((family) => {
                    const isFamilyActive = activeFamilySlug === family.slug || activeCategory === family.slug;
                    const familyCollections = getFamilyCollections(family.slug);

                    return (
                      <div key={family.slug} className="space-y-1">
                        <button
                          onClick={() => {
                            onSelectCategory(family.slug);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-dmsans text-left ${
                            isFamilyActive
                              ? "bg-[#C8A96E] text-[#0E0C0C] font-bold"
                              : "text-[#A39E93] hover:text-white bg-white/[0.02]"
                          }`}
                        >
                          <span>{family.name}</span>
                          <span className="text-[11px] font-mono">{family.collectionSlugs.length}</span>
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
                                    onSelectCategory(colSlug);
                                    onClose();
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
                        onSelectBrand(b.toLowerCase());
                        onClose();
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
    </>
  );
}
