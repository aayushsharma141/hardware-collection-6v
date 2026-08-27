"use client";

import React from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface CollectionSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeBrand: string;
  onBrandChange: (brand: string) => void;
  availableBrands: string[];
  isBrandDropdownOpen: boolean;
  onToggleBrandDropdown: () => void;
  brandDropdownRef: React.RefObject<HTMLDivElement | null>;
  totalSpecimensCount: number;
  activeCategory: string;
  onResetFilters: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function CollectionSearchBar({
  searchQuery,
  onSearchChange,
  activeBrand,
  onBrandChange,
  availableBrands,
  isBrandDropdownOpen,
  onToggleBrandDropdown,
  brandDropdownRef,
  totalSpecimensCount,
  activeCategory,
  onResetFilters,
  searchInputRef,
}: CollectionSearchBarProps) {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="hc-focus h-full w-full border-0 bg-transparent px-3 text-[12px] text-[#e8e3d9] outline-none placeholder:text-[#aaa49a]/50"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
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
            onClick={onToggleBrandDropdown}
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
                      onClick={() => onBrandChange(b.toLowerCase())}
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
            onClick={onResetFilters}
            className="hc-focus architecture-rule text-[#e8e3d9] hover:text-white text-[10px] uppercase tracking-[0.16em] cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>
    </section>
  );
}
