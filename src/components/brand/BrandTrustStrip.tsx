"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CANONICAL_BRANDS, BrandInfo } from "@/content/fallback/brands";

export interface BrandItem extends BrandInfo {
  href: string;
  containerClass?: string;
}

const half = Math.ceil(CANONICAL_BRANDS.length / 2);

const LANE_1_BRANDS: BrandItem[] = CANONICAL_BRANDS.slice(0, half).map(
  (brand) => ({
    ...brand,
    href: "/collections",
  })
);

const LANE_2_BRANDS: BrandItem[] = CANONICAL_BRANDS.slice(half).map(
  (brand) => ({
    ...brand,
    href: "/collections",
  })
);

/**
 * The roster is the source of truth for how many dealerships are authorized.
 * Derived dynamically from the canonical roster so it never drifts across components.
 */
export const AUTHORIZED_BRAND_COUNT = CANONICAL_BRANDS.length;

export default function BrandTrustStrip() {
  /**
   * Renders brand logo asset in authentic original color, or standard typography wordmark when logo is absent.
   */
  const renderBrandVisual = (brand: BrandItem) => {
    if (brand.logo) {
      return (
        <div
          className={`relative flex items-center justify-center ${
            brand.containerClass || "w-36 sm:w-44 md:w-52 lg:w-56 h-12 md:h-16 lg:h-18"
          }`}
        >
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 208px, 240px"
            className={`object-contain transition-transform duration-300 ease-out group-hover/item:scale-105 ${
              brand.imageClass || ""
            }`}
            unoptimized={brand.logo.endsWith(".svg")}
          />
        </div>
      );
    }

    return (
      <span className="font-sans font-medium uppercase tracking-[0.22em] text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap text-[var(--text-primary,#1a1017)] hover:text-[#8b1a42] transition-colors duration-300">
        {brand.name}
      </span>
    );
  };

  return (
    <section
      id="brands"
      className="py-20 lg:py-24 bg-[var(--surface,#11100f)] border-y border-[var(--border,rgba(232,227,217,0.14))] relative z-10 overflow-hidden scroll-mt-24"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-20">
        <p className="hc-mono text-[11px] sm:text-sm uppercase tracking-[0.25em] font-semibold text-brass-ink mb-4">
          Authorized partners
        </p>
        <h2 className="hc-serif text-[38px] sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary,#e8e3d9)] leading-tight mb-4">
          Authorized Brands
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary,#aaa49a)] font-light max-w-2xl mx-auto">
          German engineering and trusted Indian architectural manufacturers,
          curated under one roof in Sakchi.
        </p>
      </div>

      {/* 2-Lane Double Ticker Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-12 md:gap-16">
        {/* Soft edge gradient fades — must match --surface to prevent seam at ticker edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-60 bg-gradient-to-r from-[var(--surface,#11100f)] via-[var(--surface,#11100f)]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-60 bg-gradient-to-l from-[var(--surface,#11100f)] via-[var(--surface,#11100f)]/80 to-transparent z-20" />

        {/* ── LANE 1: Scrolling Left ─── */}
        <div className="flex w-max group/ticker hover:[animation-play-state:paused] select-none animate-ticker-left items-center">
          {/* Set 1 */}
          <div className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0">
            {LANE_1_BRANDS.map((brand) => (
              <Link
                key={`l1-a-${brand.id}`}
                href={brand.href}
                className="group/item flex items-center justify-center shrink-0"
                title={`${brand.name}${brand.tagline ? ` — ${brand.tagline}` : ""}`}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>

          {/* Set 2 for seamless infinite loop */}
          <div
            className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0"
            aria-hidden="true"
          >
            {LANE_1_BRANDS.map((brand) => (
              <Link
                key={`l1-b-${brand.id}`}
                href={brand.href}
                className="group/item flex items-center justify-center shrink-0"
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
          <div className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0">
            {LANE_2_BRANDS.map((brand) => (
              <Link
                key={`l2-a-${brand.id}`}
                href={brand.href}
                className="group/item flex items-center justify-center shrink-0"
                title={`${brand.name}${brand.tagline ? ` — ${brand.tagline}` : ""}`}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>

          {/* Set 2 for seamless infinite loop */}
          <div
            className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0"
            aria-hidden="true"
          >
            {LANE_2_BRANDS.map((brand) => (
              <Link
                key={`l2-b-${brand.id}`}
                href={brand.href}
                className="group/item flex items-center justify-center shrink-0"
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
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes ticker-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-ticker-left {
          animation: ticker-left 35s linear infinite;
        }
        .animate-ticker-right {
          animation: ticker-right 35s linear infinite;
        }
      `}</style>
    </section>
  );
}

