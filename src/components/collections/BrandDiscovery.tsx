"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Brand, getSlugString } from "@/types/catalog";
import { useConsultationStore } from "@/components/consultation/store";

export interface BrandDiscoveryProps {
  brands: Brand[];
}

const FEATURED_CAP = 6;

export default function BrandDiscovery({ brands }: BrandDiscoveryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { openDrawer } = useConsultationStore();

  const featuredBrands = brands.filter((b) => b.featured).slice(0, FEATURED_CAP);
  const alphabeticalBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  const askAboutBrand = (brand: Brand) => {
    const slug = getSlugString(brand.slug) || brand.id || "";
    openDrawer({
      source: "collections",
      intent: "consultation",
      brand: { slug, name: brand.name },
    });
  };

  return (
    <section
      aria-labelledby="brand-discovery-heading"
      className="py-16 md:py-24 bg-[#0e0e0f] text-white border-t border-white/[0.08]"
    >
      <div className="max-w-[1320px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-3 block">
            AUTHORIZED PARTNERS
          </span>
          <h2
            id="brand-discovery-heading"
            className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#e8e3d9] leading-tight mb-4"
          >
            Brand Discovery
          </h2>
          <p className="text-[13px] sm:text-[15px] leading-relaxed text-[#aaa49a] font-light">
            Explore authentic collections from world-renowned architectural hardware manufacturers.
            Consult directly with our specialists for authorized catalog specifications and project availability.
          </p>
        </div>

        {/* ── Tier 1: Featured Editorial Brands ────── */}
        <div className="mb-20">
          {/* Mobile Layout (< lg): 2-Column Partner List */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-white/[0.08]">
              {featuredBrands.map((brand, i) => (
                <button
                  key={brand._id || brand.id || i}
                  type="button"
                  onClick={() => askAboutBrand(brand)}
                  className="text-[14px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-150 py-2.5 text-left"
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Layout (≥ lg): Interactive Ambient Typographic List */}
          <div className="hidden lg:block">
            <div className="flex flex-col">
              {featuredBrands.map((brand, i) => {
                const isHovered = hoveredIndex === i;
                const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

                return (
                  <div
                    key={brand._id || brand.id || i}
                    className="group relative border-b border-white/[0.08]"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex flex-row items-center justify-between py-6 lg:py-8">
                      {/* Brand Name */}
                      <motion.h3
                        animate={{
                          color: isHovered
                            ? "#ffffff"
                            : isDimmed
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.4)",
                          x: isHovered ? (shouldReduceMotion ? 0 : 12) : 0,
                        }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className="hc-serif text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight cursor-default leading-none"
                      >
                        {brand.name}
                      </motion.h3>

                      {/* Hover Reveal: Tagline + Consultation Action */}
                      <motion.div
                        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }}
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          x: isHovered ? 0 : shouldReduceMotion ? 0 : 12,
                        }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className={`max-w-xs flex flex-col gap-2.5 ${!isHovered ? "pointer-events-none" : ""}`}
                        aria-hidden={!isHovered}
                      >
                        {brand.description && (
                          <p className="text-zinc-300 font-light text-xs sm:text-sm leading-relaxed">
                            {brand.description}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => askAboutBrand(brand)}
                          tabIndex={isHovered ? 0 : -1}
                          className="inline-flex items-center gap-2 text-[#c8a96e] text-xs tracking-widest uppercase hover:text-white transition-colors duration-150 architecture-rule hc-focus w-fit mt-1 group/btn"
                        >
                          Explore Collection
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-150 group-hover/btn:translate-x-1"
                          >
                            →
                          </span>
                        </button>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Tier 2: Static Alphabetical Logo Wall ────── */}
        <div className="pt-12 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
            <div>
              <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-2 block">
                Full Manufacturer Directory
              </span>
              <h3 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[#e8e3d9]">
                All Authorized Partners
              </h3>
            </div>
            <p className="text-xs text-[#aaa49a] font-light">
              Alphabetical index · Tap any brand to request availability
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {alphabeticalBrands.map((brand) => (
              <button
                key={brand._id || brand.id || brand.name}
                type="button"
                onClick={() => askAboutBrand(brand)}
                aria-label={`Ask about ${brand.name} in a consultation`}
                title={`${brand.name} — Ask about availability`}
                className="relative aspect-[3/2] flex items-center justify-center p-3 sm:p-4 rounded-lg bg-[#141314] border border-white/[0.12] hover:border-[#c8a96e] focus-visible:border-[#c8a96e] transition-colors duration-150 group/cell overflow-hidden cursor-pointer"
              >
                {brand.logoUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      className="object-contain transition-transform duration-150 ease-out group-hover/cell:scale-105"
                      unoptimized={
                        typeof brand.logoUrl === "string" &&
                        brand.logoUrl.endsWith(".svg")
                      }
                    />
                  </div>
                ) : (
                  <span className="font-sans font-medium uppercase tracking-[0.28em] text-[11px] sm:text-xs md:text-sm text-[#e8e3d9]/55 group-hover/cell:text-[#e8e3d9] transition-colors duration-150 text-center px-1">
                    {brand.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
