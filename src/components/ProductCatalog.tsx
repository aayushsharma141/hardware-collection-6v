"use client";

import React, { useState, useMemo } from "react";
import { 
  PRODUCTS, 
  CATEGORIES, 
  Product 
} from "../data/catalog";
import { 
  Search, 
  Filter, 
  MessageCircle, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Layers,
  Lock,
  ChefHat,
  Bath,
  Building2
} from "lucide-react";

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const brands = ["all", "Hafele", "Dorset", "Labacha", "Godrej", "Hettich"];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchBrand = selectedBrand === "all" || item.brand === selectedBrand;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = 
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.finishes.some(f => f.toLowerCase().includes(query));

      return matchCategory && matchBrand && matchSearch;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

  return (
    <section id="catalog" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-[var(--color-accent)]/50 rounded-none px-4 py-1.5 text-xs font-bold text-[var(--color-accent)] tracking-widest bg-black/60 uppercase mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Authorized Architectural Catalog
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
          Explore Authorized Brand Collections
        </h2>
        <p className="font-body text-sm md:text-base text-[#ACACAC] max-w-2xl mx-auto">
          Every product backed by 100% genuine manufacturer warranty and direct showroom consultation at our 7,500 sq ft facility in Sakchi.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-950/80 border border-zinc-800 rounded-sm p-4 mb-8 backdrop-blur-xl">
        
        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-sm text-xs font-body font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[var(--color-accent)] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            All Products ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-sm text-xs font-body font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[var(--color-accent)] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search locks, sinks, tandems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-sm pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Brand Filters Strip */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <span className="font-body text-xs text-zinc-500 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Brand:
        </span>
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-3 py-1 rounded-sm text-xs font-body tracking-wide transition-all capitalize cursor-pointer ${
              selectedBrand === b
                ? "bg-[var(--color-accent)]/20 border border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {b === "all" ? "All Authorized Brands" : b}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-sm p-12 text-center">
          <Sparkles className="w-8 h-8 text-[var(--color-accent)] mx-auto mb-3" />
          <h3 className="font-display text-xl text-white mb-2">No Matching Products Found</h3>
          <p className="font-body text-xs text-zinc-400 mb-4">
            Try adjusting your search query or selecting &quot;All Products&quot;.
          </p>
          <button
            onClick={() => { setSelectedCategory("all"); setSelectedBrand("all"); setSearchQuery(""); }}
            className="px-4 py-2 bg-zinc-800 text-white rounded-sm text-xs hover:bg-zinc-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-zinc-950/80 border border-zinc-800/90 hover:border-[var(--color-accent)]/50 rounded-sm p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[0.65rem] font-bold text-[var(--color-accent)] uppercase tracking-wider font-body">
                    {product.brand} • Authorized
                  </span>
                  <span className="text-[0.7rem] text-zinc-400 font-mono">
                    {product.model}
                  </span>
                </div>

                <h3 className="font-body font-bold text-base text-white group-hover:text-[var(--color-accent)] transition-colors mb-2">
                  {product.name}
                </h3>

                <p className="font-body text-xs text-zinc-400 mb-4 leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                <div className="mb-4 space-y-1.5 bg-black/40 p-3 rounded-sm border border-zinc-900">
                  <span className="text-[0.65rem] font-body uppercase font-bold text-zinc-500 block mb-1">
                    Key Features:
                  </span>
                  {product.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[0.72rem] text-zinc-300">
                      <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]"></span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-6">
                  <span className="text-[0.65rem] font-body text-zinc-500 uppercase mr-1">Finishes:</span>
                  {product.finishes.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[0.65rem] text-zinc-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-3">
                <span className="text-[0.7rem] text-zinc-400 font-body truncate">
                  App: {product.application}
                </span>
                
                <a
                  href={`https://wa.me/919835190738?text=${encodeURIComponent(product.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)] to-[var(--color-accent)] text-black font-body font-bold text-[0.7rem] rounded-sm shadow-[0_0_15px_rgba(227,185,106,0.25)] hover:scale-105 transition-all shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire</span>
                  <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
}
