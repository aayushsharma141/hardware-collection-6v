"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS, Product } from "../data/catalog";

interface FamilyItem {
  id: string;
  num: string;
  name: string;
  count: string;
  subcategories?: { id: string; name: string; count: string }[];
}

const FAMILIES: FamilyItem[] = [
  { id: "handles", num: "01", name: "Handles & Knobs", count: "02" },
  {
    id: "door",
    num: "02",
    name: "Door Hardware",
    count: "06",
    subcategories: [
      { id: "digital-locks", name: "Digital Locks", count: "02" },
      { id: "mortise", name: "Mortise & Door Locks", count: "01" },
      { id: "glass", name: "Glass Hardware", count: "01" },
      { id: "closers", name: "Door Closers & Stoppers", count: "01" },
      { id: "safes", name: "Safes", count: "01" },
    ],
  },
  { id: "bathroom", num: "03", name: "Bathroom", count: "01" },
  { id: "kitchen", num: "04", name: "Kitchen & Wardrobes", count: "04" },
  { id: "furniture", num: "05", name: "Furniture Hardware", count: "02" },
];

const BRANDS = ["Hafele", "Dorset", "Labacha", "Godrej", "Hettich"];

export default function ProductCatalog() {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shortlist, setShortlist] = useState<Record<string, boolean>>({});

  const toggleShortlist = (id: string) => {
    setShortlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category / Family match
      let matchFamily = true;
      if (selectedFamily !== "all") {
        if (selectedFamily === "door") {
          matchFamily = item.category === "security-locks" || item.category === "doors";
        } else if (selectedFamily === "handles") {
          matchFamily = item.category === "doors";
        } else if (selectedFamily === "bathroom") {
          matchFamily = item.category === "bath";
        } else if (selectedFamily === "kitchen") {
          matchFamily = item.category === "kitchen";
        } else if (selectedFamily === "furniture") {
          matchFamily = item.category === "wardrobe";
        }
      }

      // Brand match
      const matchBrand = selectedBrand === "all" || item.brand.toLowerCase() === selectedBrand.toLowerCase();

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        (item.model || item.catalogReference || "").toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchFamily && matchBrand && matchSearch;
    });
  }, [selectedFamily, selectedBrand, searchQuery]);

  const resetFilters = () => {
    setSelectedFamily("all");
    setSelectedSubcategory("all");
    setSelectedBrand("all");
    setSearchQuery("");
  };

  return (
    <div id="collection" className="hc-root min-h-screen w-full bg-[#090909] text-[#e8e3d9] pt-12 pb-24">
      <div className="mx-auto max-w-[1380px] px-6 lg:px-8">
        {/* Quiet Two-Axis Masthead */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-[#c8a96e] pb-7 pt-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-[#c8a96e]" />
              <span className="hc-mono text-[10px] uppercase tracking-[0.22em] text-[#aaa49a]">
                Authorized digital showroom
              </span>
            </div>
            <h1 className="hc-serif m-0 text-[64px] lg:text-[86px] font-normal uppercase leading-[0.86] tracking-[0.04em] text-[#e8e3d9]">
              The
              <br />
              Collection
            </h1>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end pb-1">
            <p className="max-w-[42ch] text-[14px] leading-7 text-[#aaa49a] font-light">
              Curated architectural hardware for considered residential and commercial interiors. Authorized partner for Häfele, Dorset, Labacha, Godrej & Hettich.
            </p>
            <div className="mt-7 flex items-center justify-between border-t border-white/[0.12] pt-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#aaa49a]">
                Product specification wall
              </span>
              <span className="hc-mono text-[10px] uppercase tracking-[0.18em] text-[#c8a96e]">
                Sakchi · Jamshedpur
              </span>
            </div>
          </div>
        </section>

        {/* Specification Wall: Sidebar + Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10 pt-10">
          {/* Left Sidebar */}
          <aside aria-label="Collection index" className="border-b lg:border-b-0 lg:border-r border-white/[0.14] pb-8 lg:pb-0 lg:pr-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="hc-mono text-[10px] uppercase tracking-[0.20em] text-[#c8a96e]">
                Collection index
              </span>
              <span className="hc-mono text-[10px] text-[#aaa49a]">
                {PRODUCTS.length.toString().padStart(2, "0")} total
              </span>
            </div>

            <button
              onClick={() => { setSelectedFamily("all"); setSelectedSubcategory("all"); }}
              className={`index-row hc-focus flex w-full items-center justify-between text-[11px] uppercase tracking-[0.14em] text-left transition-colors ${
                selectedFamily === "all" ? "is-active text-[#e8e3d9]" : "text-[#aaa49a] hover:text-[#e8e3d9]"
              }`}
            >
              <span>All collections</span>
              <span className="hc-mono text-[10px] text-[#aaa49a]">
                {PRODUCTS.length.toString().padStart(2, "0")}
              </span>
            </button>

            {/* Showroom Families */}
            <div className="mt-8">
              <p className="hc-mono mb-3 text-[9px] uppercase tracking-[0.20em] text-[#aaa49a]">
                Showroom families
              </p>
              <div className="space-y-1">
                {FAMILIES.map((fam) => {
                  const isActive = selectedFamily === fam.id;
                  return (
                    <div key={fam.id}>
                      <button
                        onClick={() => {
                          setSelectedFamily(fam.id);
                          setSelectedSubcategory("all");
                        }}
                        className={`index-row hc-focus flex w-full items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-left ${
                          isActive ? "is-active text-[#e8e3d9]" : "text-[#aaa49a] hover:text-[#e8e3d9]"
                        }`}
                      >
                        <span className="hc-mono w-6 text-[10px] text-[#c8a96e]">
                          {fam.num}
                        </span>
                        {isActive && <span className="index-rule" />}
                        <span className={`flex-1 ${isActive ? "font-semibold text-white" : ""}`}>
                          {fam.name}
                        </span>
                        <span className={`hc-mono text-[10px] ${isActive ? "text-[#c8a96e]" : ""}`}>
                          {fam.count}
                        </span>
                      </button>

                      {/* Subcategories (if active) */}
                      {isActive && fam.subcategories && (
                        <div className="border-l border-[#c8a96e]/35 ml-9 pl-4 my-2 space-y-1">
                          {fam.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setSelectedSubcategory(sub.id)}
                              className={`hc-focus flex w-full min-h-[30px] items-center justify-between border-b border-white/[0.06] text-[10px] text-left ${
                                selectedSubcategory === sub.id ? "text-[#e8e3d9] font-medium" : "text-[#aaa49a] hover:text-[#e8e3d9]"
                              }`}
                            >
                              <span>{sub.name}</span>
                              <span className="hc-mono text-[9px] text-[#c8a96e]">
                                {sub.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Authorized Brands */}
            <div className="mt-9 border-t border-white/[0.12] pt-6">
              <p className="hc-mono mb-3 text-[9px] uppercase tracking-[0.20em] text-[#aaa49a]">
                Authorized brands
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className="hc-focus flex w-full min-h-[38px] items-center gap-3 border-b border-white/[0.06] text-[11px] text-left text-[#e8e3d9]"
                >
                  <span className={`check-box ${selectedBrand === "all" ? "is-checked" : ""}`}>
                    {selectedBrand === "all" && (
                      <svg className="w-3 h-3 text-[#090909]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span>All authorized brands</span>
                </button>

                {BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(selectedBrand === b ? "all" : b)}
                    className="hc-focus flex w-full min-h-[38px] items-center gap-3 border-b border-white/[0.06] text-[11px] text-left text-[#aaa49a] hover:text-[#e8e3d9]"
                  >
                    <span className={`check-box ${selectedBrand === b ? "is-checked" : ""}`}>
                      {selectedBrand === b && (
                        <svg className="w-3 h-3 text-[#090909]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span>{b}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="min-w-0">
            {/* Search and Filter Strip */}
            <section aria-label="Product search and filters" className="border-y border-white/[0.14] mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] items-end gap-5 py-4">
                <label className="block">
                  <span className="hc-mono mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#aaa49a]">
                    Search products or part references
                  </span>
                  <span className="flex h-12 items-center border border-white/[0.18] bg-[#11100f]">
                    <svg className="w-4 h-4 ml-4 text-[#aaa49a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      aria-label="Search products or part references"
                      className="hc-focus h-full w-full border-0 bg-transparent px-3 text-[12px] text-[#e8e3d9] outline-none placeholder:text-[#aaa49a]/60"
                      placeholder="Search products, brands, references..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </span>
                </label>

                <div className="block">
                  <span className="hc-mono mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#aaa49a]">
                    Brand Filter
                  </span>
                  <div className="flex h-12 items-center justify-between border border-white/[0.18] bg-[#11100f] px-4 text-[11px] uppercase tracking-[0.14em] text-[#e8e3d9]">
                    <span>{selectedBrand === "all" ? "All brands" : selectedBrand}</span>
                    <span className="hc-mono text-[9px] text-[#c8a96e]">•</span>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[44px] items-center justify-between border-t border-white/[0.10] text-[10px] uppercase tracking-[0.16em] py-2">
                <span className="hc-mono text-[#c8a96e]">
                  {filteredProducts.length.toString().padStart(2, "0")} products
                  <span className="text-[#aaa49a] mx-2">·</span>
                  {selectedFamily === "all" ? "all collections" : selectedFamily}
                </span>

                {(selectedFamily !== "all" || selectedBrand !== "all" || searchQuery !== "") && (
                  <button
                    onClick={resetFilters}
                    className="hc-focus architecture-rule text-[#e8e3d9] text-[10px] uppercase tracking-[0.16em] hover:text-white"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </section>

            {/* Specimen Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#11100f] border border-white/[0.12] p-12 text-center">
                <h3 className="hc-serif text-2xl text-[#e8e3d9] mb-2">No Matching Specimens Found</h3>
                <p className="text-xs text-[#aaa49a] mb-6">
                  Try adjusting your search criteria or reset filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="brass-plate h-10 px-6 bg-[#c8a96e] text-[#090909] text-[10px] font-bold uppercase tracking-[0.16em]"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                {filteredProducts.map((product, idx) => {
                  const isFeatured = idx === 0 && filteredProducts.length > 2;
                  const isShortlisted = !!shortlist[product.id];

                  return (
                    <article
                      key={product.id}
                      className={`specimen-tray hc-focus p-3 flex flex-col justify-between ${
                        isFeatured ? "lg:col-span-8" : "lg:col-span-4"
                      }`}
                      tabIndex={0}
                    >
                      <div className={`specimen-frame relative w-full ${isFeatured ? "aspect-[21/9]" : "aspect-[16/11]"}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(200,169,110,.18),transparent_45%)]" />
                        <img
                          alt={product.name}
                          className="relative z-[2] h-full w-full object-cover opacity-80 transition-transform duration-500 hover:scale-105"
                          decoding="async"
                          loading="lazy"
                          src={
                            product.category === "security-locks"
                              ? "/cinema/categories/HC-03-SECURITY.png"
                              : product.category === "kitchen"
                              ? "/cinema/categories/HC-03-KITCHEN.png"
                              : product.category === "bath"
                              ? "/cinema/categories/HC-03-BATHROOM.png"
                              : product.category === "wardrobe"
                              ? "/cinema/categories/HC-03-WARDROBE.png"
                              : "/cinema/categories/HC-03-DOORS.png"
                          }
                        />
                        {isFeatured && (
                          <span className="absolute left-4 top-4 z-[3] border border-[#c8a96e]/60 bg-[#090909]/80 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-[#c8a96e]">
                            Live Display
                          </span>
                        )}
                        <span className="hc-mono absolute bottom-3 right-4 z-[3] text-[9px] tracking-[0.18em] text-[#aaa49a]">
                          {product.catalogReference || product.model}
                        </span>
                      </div>

                      <div className="flex flex-col px-2 pb-1 pt-4 flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8a96e]">
                              {product.brand}
                            </span>
                            <span className="hc-mono text-[9px] text-[#aaa49a]">
                              {product.model}
                            </span>
                          </div>

                          <h3 className="m-0 mt-2 text-[16px] font-semibold leading-5 text-[#e8e3d9]">
                            {product.name}
                          </h3>

                          <p className="m-0 mt-2 line-clamp-2 text-[11px] leading-5 text-[#aaa49a] font-light">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/[0.10] flex items-center justify-between gap-3">
                          <button
                            type="button"
                            aria-pressed={isShortlisted}
                            onClick={() => toggleShortlist(product.id)}
                            className="shortlist-control hc-focus inline-flex min-h-[36px] items-center gap-2 border border-white/[0.22] px-3 text-[9px] uppercase tracking-[0.12em] text-[#e8e3d9] hover:border-[#c8a96e]"
                          >
                            <svg className="w-3 h-3 text-[#c8a96e] shortlist-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                          </button>

                          <a
                            href={`https://wa.me/919835190738?text=${encodeURIComponent(product.whatsappMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hc-focus architecture-rule inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-[#e8e3d9] no-underline"
                          >
                            <span>Inquire</span>
                            <svg className="w-3.5 h-3.5 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
