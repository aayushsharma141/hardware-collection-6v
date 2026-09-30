"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CANONICAL_BRANDS, BrandInfo } from "@/content/fallback/brands";

export interface BrandItem {
  name: string;
  id?: string;
  logo?: string;
  href: string;
}

interface BrandTrustStripProps {
  brands?: {
    brandName: string;
    slug: string;
    logoUrl?: string;
  }[];
}

export default function BrandTrustStrip({ brands }: BrandTrustStripProps) {
  // If we have sanity brands, map them to BrandItem. Otherwise use fallback.
  const activeBrands: BrandItem[] = brands && brands.length > 0 
    ? brands.map(b => {
        const canonical = CANONICAL_BRANDS.find(c => c.id === b.slug);
        return {
          name: b.brandName,
          id: b.slug,
          logo: b.logoUrl || canonical?.logo,
          href: `/catalogs?brand=${b.slug}`
        };
      })
    : CANONICAL_BRANDS.map(b => ({ ...b, href: `/catalogs?brand=${b.id}` }));

  const half = Math.ceil(activeBrands.length / 2);
  const lane1 = activeBrands.slice(0, half);
  const lane2 = activeBrands.slice(half);

  const renderBrandVisual = (brand: BrandItem) => {
    if (brand.logo) {
      return (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={400}
          height={160}
          sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
          className={`
            object-contain
            h-10 sm:h-12 md:h-14 lg:h-16
            w-auto
            max-w-[128px] sm:max-w-[152px] md:max-w-[176px] lg:max-w-[200px]
            opacity-90
            transition-all duration-500 ease-out
            group-hover/item:opacity-100
            group-hover/item:scale-105
            group-hover/item:drop-shadow-[0_4px_16px_rgba(0,0,0,0.12)]
          `}
          unoptimized={brand.logo.endsWith(".svg")}
        />
      );
    }

    return (
      <span className="
        font-sans font-semibold uppercase tracking-[0.22em]
        text-base sm:text-lg md:text-xl lg:text-2xl
        whitespace-nowrap
        text-[#1A1017] opacity-60
        transition-all duration-500 ease-out
        group-hover/item:opacity-100
        group-hover/item:text-[#8b1a42]
        group-hover/item:scale-110
      ">
        {brand.name}
      </span>
    );
  };

  const linkClass =
    "group/item flex items-center justify-center shrink-0 h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-xl bg-white/90 border border-[#E7E0D4] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#D9CCC6]";

  return (
    <section
      id="brands"
      className="py-24 lg:py-32 bg-[#FAF7F2] border-y border-[#EAE4D9] relative z-10 overflow-hidden scroll-mt-24"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 md:mb-24">
        <p className="hc-mono text-[11px] sm:text-sm uppercase tracking-[0.28em] font-semibold text-[#8B1A42] mb-5">
          Authorized partners
        </p>
        <h2 className="hc-serif text-[40px] sm:text-5xl lg:text-[64px] font-light tracking-[-0.02em] text-[#1A1017] leading-tight mb-5">
          Specified By
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-[#6B5E68] font-light max-w-2xl mx-auto">
          German engineering and trusted Indian architectural manufacturers,
          curated under one roof in Sakchi.
        </p>
      </div>

      {/* 2-Lane Double Ticker Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-14 md:gap-18">
        {/* Soft edge gradient fades — wider for more luxury feel */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-72 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-72 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent z-20" />

        {/* ── LANE 1: Scrolling Left ─── */}
        <div className="flex w-max group/ticker hover:[animation-play-state:paused] select-none animate-ticker-left items-center">
          {/* Set 1 */}
          <div className="flex items-center gap-6 md:gap-8 lg:gap-12 pr-6 md:pr-8 lg:pr-12 shrink-0">
            {lane1.map((brand, idx) => (
              <Link
                key={`l1-a-${brand.id || idx}`}
                href={brand.href}
                className={linkClass}
                title={brand.name}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>

          {/* Set 2 for seamless infinite loop */}
          <div
            className="flex items-center gap-6 md:gap-8 lg:gap-12 pr-6 md:pr-8 lg:pr-12 shrink-0"
            aria-hidden="true"
          >
            {lane1.map((brand, idx) => (
              <Link
                key={`l1-b-${brand.id || idx}`}
                href={brand.href}
                className={linkClass}
                tabIndex={-1}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>
        </div>

        {/* ── LANE 2: Scrolling Right ── */}
        <div className="flex w-max group/ticker hover:[animation-play-state:paused] select-none animate-ticker-right items-center">
          {/* Set 1 */}
          <div className="flex items-center gap-6 md:gap-8 lg:gap-12 pr-6 md:pr-8 lg:pr-12 shrink-0">
            {lane2.map((brand, idx) => (
              <Link
                key={`l2-a-${brand.id || idx}`}
                href={brand.href}
                className={linkClass}
                title={brand.name}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>

          {/* Set 2 for seamless infinite loop */}
          <div
            className="flex items-center gap-6 md:gap-8 lg:gap-12 pr-6 md:pr-8 lg:pr-12 shrink-0"
            aria-hidden="true"
          >
            {lane2.map((brand, idx) => (
              <Link
                key={`l2-b-${brand.id || idx}`}
                href={brand.href}
                className={linkClass}
                tabIndex={-1}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker-left {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ticker-right {
          0%   { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-ticker-left {
          animation: ticker-left 50s linear infinite;
        }
        .animate-ticker-right {
          animation: ticker-right 50s linear infinite;
        }
      `}</style>
    </section>
  );
}
