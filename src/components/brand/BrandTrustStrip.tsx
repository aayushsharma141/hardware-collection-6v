"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CANONICAL_BRANDS } from "@/content/fallback/brands";

export interface BrandItem {
  name: string;
  id?: string;
  logo?: string;
  href: string;
  imageClass?: string;
  imageStyle?: React.CSSProperties;
}

import { Brand } from "@/types/catalog";

export interface BrandInputItem {
  slug?: string | { current?: string } | null;
  id?: string | null;
  name?: string | null;
  brandName?: string | null;
  logo?: string | null;
  logoUrl?: string | null;
}

interface BrandTrustStripProps {
  brands?: (Brand | BrandInputItem)[];
  hideHeader?: boolean;
  singleRow?: boolean;
}

const FEATURED_BRANDS: BrandItem[] = [
  {
    name: "Hafele",
    id: "hafele",
    logo: "/brands/Hafele.png",
    href: "/catalogues?brand=hafele",
  },
  {
    name: "Dorset",
    id: "dorset",
    logo: "/brands/dorset-seeklogo.svg",
    href: "/catalogues?brand=dorset",
  },
  {
    name: "Tattva",
    id: "tattva",
    logo: "/brands/TATTVA_cropped.png",
    href: "/catalogues?brand=tattva",
  },
  {
    name: "Ozone",
    id: "ozone",
    logo: "/brands/ozone.webp",
    href: "/catalogues?brand=ozone",
  },
  {
    name: "Blum",
    id: "blum",
    logo: "/brands/Blum_logo.svg",
    href: "/catalogues?brand=blum",
  },
  {
    name: "Hettich",
    id: "hettich",
    logo: "/brands/Hettich.svg",
    href: "/catalogues?brand=hettich",
  },
  {
    name: "Godrej",
    id: "godrej",
    logo: "/brands/Godrej.svg",
    href: "/catalogues?brand=godrej",
  },
  {
    name: "Yale",
    id: "yale",
    logo: "/brands/Yale_logo.svg",
    href: "/catalogues?brand=yale",
  },
  {
    name: "GEZE",
    id: "geze",
    logo: "/brands/GEZE_Logo_RGB.png",
    href: "/catalogues?brand=geze",
  },
];

export default function BrandTrustStrip({ brands, hideHeader, singleRow }: BrandTrustStripProps) {
  const activeBrands: BrandItem[] =
    brands && brands.length > 0
      ? brands.map((b) => {
          const slugStr = typeof b.slug === "object" ? b.slug?.current : b.slug;
          const key = slugStr || b.id || (typeof b.name === "string" ? b.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");
          const canonical = CANONICAL_BRANDS.find((c) => c.id === key);
          const brandName = ("brandName" in b && b.brandName ? b.brandName : b.name) || "Brand";
          const brandLogo = canonical?.logo || (typeof b.logoUrl === "string" ? b.logoUrl : undefined) || (typeof b.logo === "string" ? b.logo : undefined);
          return {
            name: brandName,
            id: key,
            logo: brandLogo,
            href: `/catalogues?brand=${key}`,
          };
        })
      : FEATURED_BRANDS;

  // Split activeBrands into two rows for the dual-marquee effect
  const half = Math.ceil(activeBrands.length / 2);
  const row1Items = singleRow ? activeBrands : activeBrands.slice(0, half);
  const row2Items = singleRow ? [] : activeBrands.slice(half);

  // Repeat brands to ensure smooth infinite loop on all screen widths
  const row1 = row1Items.length < 8 ? [...row1Items, ...row1Items, ...row1Items] : row1Items;
  const row2 = row2Items.length < 8 ? [...row2Items, ...row2Items, ...row2Items] : row2Items;

  return (
    <section
      id="brands"
      className={`py-8 sm:py-12 bg-[var(--surface)] ${hideHeader ? "border-y" : "border-b"} border-[var(--border)] relative z-10 scroll-mt-20 overflow-hidden`}
    >
      {!hideHeader && (
        <div className="max-w-[1440px] mx-auto px-5 lg:px-16 mb-6 sm:mb-8">
          {/* Header matching Reference Mockup */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="hc-mono text-[10.5px] uppercase tracking-[0.24em] font-semibold text-[var(--color-wine)] mb-1.5">
                Trusted Brands
              </p>
              <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[var(--text-primary)] leading-tight">
                Authorized Brands.
                <br />
                Genuine Products.
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 max-w-md">
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed md:text-right">
                Experience a curated range of architectural hardware from leading global brands, all under one roof.
              </p>
              <Link
                href="/catalogues"
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-wine)] inline-flex items-center gap-1.5 hover:underline"
              >
                <span>View All Brands</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Seamless Infinite Right-to-Left Marquee with Smooth Feathering ── */}
      <div className="brand-marquee-wrapper relative w-full overflow-hidden group/brand-marquee py-2">
        {/* Edge gradient overlays for additional smooth fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--surface)] to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--surface)] to-transparent z-10"
          aria-hidden="true"
        />

        {/* Row 1: Right to Left */}
        <div className={`brand-marquee-track flex w-max hover:[animation-play-state:paused] active:[animation-play-state:paused] ${!singleRow ? 'mb-4 sm:mb-8' : ''}`}>
          <div className="brand-marquee-set flex items-center gap-10 sm:gap-16 pr-10 sm:pr-16 shrink-0">
            {row1.map((brand, idx) => (
              <Link
                key={`brand-1-${brand.id || idx}-${idx}`}
                href={brand.href}
                className="shrink-0 h-10 sm:h-14 w-28 sm:w-36 flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105 select-none"
                title={brand.name}
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={140}
                    height={50}
                    unoptimized={brand.logo.endsWith(".svg")}
                    className="max-h-7 sm:max-h-12 w-auto object-contain transform-gpu"
                  />
                ) : (
                  <span className="hc-serif text-base sm:text-lg font-medium text-[var(--text-primary)]">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="brand-marquee-set flex items-center gap-10 sm:gap-16 pr-10 sm:pr-16 shrink-0" aria-hidden="true">
            {row1.map((brand, idx) => (
              <Link
                key={`brand-1-dup-${brand.id || idx}-${idx}`}
                href={brand.href}
                className="shrink-0 h-10 sm:h-14 w-28 sm:w-36 flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105 select-none"
                title={brand.name}
                tabIndex={-1}
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={140}
                    height={50}
                    unoptimized={brand.logo.endsWith(".svg")}
                    className="max-h-7 sm:max-h-12 w-auto object-contain transform-gpu"
                  />
                ) : (
                  <span className="hc-serif text-base sm:text-lg font-medium text-[var(--text-primary)]">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        {!singleRow && (
          <div className="brand-marquee-track-reverse flex w-max hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            <div className="brand-marquee-set flex items-center gap-10 sm:gap-16 pr-10 sm:pr-16 shrink-0">
              {row2.map((brand, idx) => (
                <Link
                  key={`brand-2-${brand.id || idx}-${idx}`}
                  href={brand.href}
                  className="shrink-0 h-10 sm:h-14 w-28 sm:w-36 flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105 select-none"
                  title={brand.name}
                >
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={140}
                      height={50}
                      unoptimized={brand.logo.endsWith(".svg")}
                      className="max-h-7 sm:max-h-12 w-auto object-contain transform-gpu"
                    />
                  ) : (
                    <span className="hc-serif text-base sm:text-lg font-medium text-[var(--text-primary)]">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="brand-marquee-set flex items-center gap-10 sm:gap-16 pr-10 sm:pr-16 shrink-0" aria-hidden="true">
              {row2.map((brand, idx) => (
                <Link
                  key={`brand-2-dup-${brand.id || idx}-${idx}`}
                  href={brand.href}
                  className="shrink-0 h-10 sm:h-14 w-28 sm:w-36 flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105 select-none"
                  title={brand.name}
                  tabIndex={-1}
                >
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={140}
                      height={50}
                      unoptimized={brand.logo.endsWith(".svg")}
                      className="max-h-7 sm:max-h-12 w-auto object-contain transform-gpu"
                    />
                  ) : (
                    <span className="hc-serif text-base sm:text-lg font-medium text-[var(--text-primary)]">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .brand-marquee-wrapper {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
        }

        .brand-marquee-track {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          animation: brand-marquee-glide 42s linear infinite;
        }

        .brand-marquee-track-reverse {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          animation: brand-marquee-glide-reverse 45s linear infinite;
        }

        @keyframes brand-marquee-glide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes brand-marquee-glide-reverse {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-marquee-track, .brand-marquee-track-reverse {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}
