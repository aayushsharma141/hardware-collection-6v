"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BrandItem {
  id: string;
  name: string;
  logo?: string;
  href: string;
  tagline?: string;
  containerClass?: string;
  imageClass?: string;
}

// ── LANE 1: Original Manufacturer Brand Logos ────────────────────
const LANE_1_BRANDS: BrandItem[] = [
  {
    id: "hafele",
    name: "Häfele",
    logo: "/brands/Haefele_Logo.png",
    href: "/collections?brand=hafele",
    tagline: "German Architectural & Kitchen Hardware",
    containerClass: "w-44 md:w-56 lg:w-64 h-12 md:h-16 lg:h-20",
  },
  {
    id: "blum",
    name: "Blum",
    logo: "/brands/Blum_logo.svg",
    href: "/collections?brand=blum",
    tagline: "Perfecting Motion",
    containerClass: "w-36 md:w-48 lg:w-52 h-10 md:h-14 lg:h-16",
  },
  {
    id: "hettich",
    name: "Hettich",
    logo: "/brands/Hettich.svg",
    href: "/collections?brand=hettich",
    tagline: "Fascin[action] German Hardware",
    containerClass: "w-36 md:w-48 lg:w-56 h-12 md:h-16 lg:h-20",
  },
  {
    id: "dorset",
    name: "Dorset",
    logo: "/brands/dorset-seeklogo.svg",
    href: "/collections?brand=dorset",
    tagline: "Digital Locks & Architectural Mortise",
    containerClass: "w-44 md:w-56 lg:w-64 h-12 md:h-16 lg:h-20",
  },
  {
    id: "geze",
    name: "GEZE",
    logo: "/brands/GEZE_Logo_RGB_clean.png",
    href: "/collections?brand=geze",
    tagline: "Door, Window & Safety Technology",
    containerClass: "w-44 md:w-56 lg:w-64 h-12 md:h-16 lg:h-20",
  },
  {
    id: "godrej",
    name: "Godrej",
    logo: "/brands/Godrej.svg",
    href: "/collections?brand=godrej",
    tagline: "Enterprise & High-Trust Security",
    containerClass: "w-36 md:w-48 lg:w-56 h-12 md:h-16 lg:h-20",
  },
  {
    id: "yale",
    name: "Yale",
    logo: "/brands/Yale_logo.svg",
    href: "/collections?brand=yale",
    tagline: "The World's Favorite Lock",
    containerClass: "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24",
  },
  {
    id: "jaquar",
    name: "Jaquar",
    logo: "/brands/Jaquar.svg",
    href: "/collections?brand=jaquar",
    tagline: "Complete Bathroom & Lighting Solutions",
    containerClass: "w-44 md:w-56 lg:w-64 h-12 md:h-16 lg:h-20",
  },
  {
    id: "asian_paint",
    name: "Asian Paints",
    logo: "/brands/asian_paint.svg",
    href: "/collections?brand=asian_paint",
    tagline: "Luxury Surface & Wall Finishes",
    containerClass: "w-48 md:w-60 lg:w-72 h-20 md:h-28 lg:h-32",
    imageClass: "scale-125",
  },
  {
    id: "philips",
    name: "Philips",
    logo: "/brands/philips.png",
    href: "/collections?brand=philips",
    tagline: "Smart Lighting & Automation",
    containerClass: "w-36 md:w-48 lg:w-56 h-10 md:h-14 lg:h-16",
    imageClass: "brightness-0 invert opacity-80",
  },
];

// ── LANE 2: Original Architectural & Hardware Partners ────────────
const LANE_2_BRANDS: BrandItem[] = [
  {
    id: "ozone",
    name: "Ozone",
    logo: "/brands/ozone.webp",
    href: "/collections?brand=ozone",
    tagline: "Architectural Glass & Security Systems",
    containerClass: "w-36 md:w-48 lg:w-56 h-10 md:h-14 lg:h-16",
    imageClass: "brightness-0 invert opacity-80",
  },
  {
    id: "helix",
    name: "Helix",
    logo: "/brands/heliex_clean.png",
    href: "/collections?brand=helix",
    tagline: "Next-Gen Architectural Systems",
    containerClass: "w-40 md:w-52 lg:w-60 h-12 md:h-16 lg:h-20",
  },
  {
    id: "labacha",
    name: "Labacha",
    logo: "/brands/labacha_logo_clean.png",
    href: "/collections?brand=labacha",
    tagline: "Luxury Granite Sinks & Bath Mixers",
    containerClass: "w-40 md:w-52 lg:w-60 h-12 md:h-16 lg:h-20",
  },
  {
    id: "liftor",
    name: "Liftor",
    logo: "/brands/Liftor_clean.png",
    href: "/collections?brand=liftor",
    tagline: "Smart Ergonomic Furniture Solutions",
    containerClass: "w-20 md:w-24 lg:w-28 h-20 md:h-24 lg:h-28",
  },
  {
    id: "shapes",
    name: "Shapes",
    logo: "/brands/Shapes_logo_clean.png",
    href: "/collections?brand=shapes",
    tagline: "Defined by Design Architectural Accents",
    containerClass: "w-40 md:w-52 lg:w-60 h-12 md:h-16 lg:h-20",
  },
  {
    id: "decore",
    name: "Decore",
    logo: "/brands/decore_clean.png",
    href: "/collections?brand=decore",
    tagline: "Designer Architectural Finishes",
    containerClass: "w-40 md:w-52 lg:w-60 h-12 md:h-16 lg:h-20",
  },
  {
    id: "furnipart",
    name: "Furnipart",
    href: "/collections?brand=furnipart",
    tagline: "Danish Designer Cabinet Handles",
  },
  {
    id: "pans",
    name: "Pans",
    href: "/collections?brand=pans",
    tagline: "Precision Architectural Hardware",
  },
  {
    id: "backer",
    name: "Backer",
    href: "/collections?brand=backer",
    tagline: "Heavy-Duty Hardware Systems",
  },
  {
    id: "tattva",
    name: "Tattva",
    href: "/collections?brand=tattva",
    tagline: "Artisanal Luxury Hardware",
  },
  {
    id: "rexton",
    name: "Rexton",
    href: "/collections?brand=rexton",
    tagline: "Engineered Architectural Solutions",
  },
  {
    id: "madhuram",
    name: "Madhuram",
    href: "/collections?brand=madhuram",
    tagline: "Crafted Brass & Metal Fittings",
  },
  {
    id: "marnello",
    name: "Marnello",
    href: "/collections?brand=marnello",
    tagline: "Italian-Inspired Luxury Accents",
  },
];

export default function BrandTrustStrip() {
  const renderBrandVisual = (brand: BrandItem) => {
    // Exact original logo rendering without complex mix-blend CSS filters
    if (brand.logo) {
      return (
        <div className={`relative flex items-center justify-center ${brand.containerClass || "w-40 md:w-52 lg:w-60 h-12 md:h-16 lg:h-20"}`}>
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className={`object-contain transition-transform duration-300 group-hover/item:scale-105 ${brand.imageClass || ""}`}
            unoptimized={brand.logo.endsWith(".svg")}
          />
        </div>
      );
    }

    // Authentic plain typography for brands without separate image files
    switch (brand.id) {
      case "furnipart":
        return (
          <span className="font-sans font-light tracking-[0.35em] text-base md:text-xl lg:text-2xl text-zinc-300 group-hover/item:text-white uppercase transition-colors">
            FURNIPART
          </span>
        );
      case "pans":
        return (
          <span className="font-sans font-black tracking-[0.25em] text-2xl md:text-3xl lg:text-4xl text-zinc-200 group-hover/item:text-white uppercase transition-colors">
            PANS
          </span>
        );
      case "backer":
        return (
          <span className="font-mono font-bold tracking-[0.2em] text-xl md:text-2xl lg:text-3xl text-zinc-200 group-hover/item:text-white uppercase transition-colors">
            BACKER
          </span>
        );
      case "tattva":
        return (
          <span className="font-serif tracking-[0.3em] text-2xl md:text-3xl lg:text-4xl font-normal text-zinc-200 group-hover/item:text-white uppercase transition-colors">
            Tattva
          </span>
        );
      case "rexton":
        return (
          <span className="font-sans font-black tracking-[0.22em] text-xl md:text-2xl lg:text-3xl text-zinc-200 group-hover/item:text-white uppercase transition-colors">
            REXTON
          </span>
        );
      case "madhuram":
        return (
          <span className="font-serif italic tracking-[0.18em] text-2xl md:text-3xl lg:text-4xl text-zinc-200 group-hover/item:text-white transition-colors">
            Madhuram
          </span>
        );
      case "marnello":
        return (
          <span className="font-serif tracking-[0.22em] text-2xl md:text-3xl lg:text-4xl font-medium text-zinc-200 group-hover/item:text-white transition-colors">
            Marnello
          </span>
        );
      default:
        return (
          <span className="font-sans font-medium tracking-widest text-xl md:text-2xl text-zinc-300 group-hover/item:text-white transition-colors">
            {brand.name}
          </span>
        );
    }
  };

  return (
    <section id="brands" className="py-24 bg-zinc-950 border-y border-zinc-900 relative z-10 overflow-hidden">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <p className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-3">
          Chapter 02 · Authorized Partners
        </p>
        <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#e8e3d9] leading-tight mb-3">
          Authorized Brands
        </h2>
        <p className="text-[13px] sm:text-[15px] leading-relaxed text-[#aaa49a] font-light max-w-xl mx-auto">
          German engineering and trusted Indian architectural manufacturers, curated under one roof in Sakchi.
        </p>
      </div>

      {/* 2-Lane Double Ticker Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-12 md:gap-16">
        
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-60 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-60 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent z-20" />

        {/* ── LANE 1: Scrolling Left (Original Manufacturer Logos) ─── */}
        <div className="flex w-max group/ticker hover:[animation-play-state:paused] select-none animate-ticker-left items-center">
          {/* Set 1 */}
          <div className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0">
            {LANE_1_BRANDS.map((brand) => (
              <Link
                key={`l1-a-${brand.id}`}
                href={brand.href}
                className="group/item flex items-center justify-center shrink-0"
                title={`${brand.name} — ${brand.tagline}`}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>

          {/* Set 2 for seamless infinite loop */}
          <div className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0" aria-hidden="true">
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

        {/* ── LANE 2: Scrolling Right (Original Architectural Logos) ── */}
        <div className="flex w-max group/ticker hover:[animation-play-state:paused] select-none animate-ticker-right items-center">
          {/* Set 1 */}
          <div className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0">
            {LANE_2_BRANDS.map((brand) => (
              <Link
                key={`l2-a-${brand.id}`}
                href={brand.href}
                className="group/item flex items-center justify-center shrink-0"
                title={`${brand.name} — ${brand.tagline}`}
              >
                {renderBrandVisual(brand)}
              </Link>
            ))}
          </div>

          {/* Set 2 for seamless infinite loop */}
          <div className="flex items-center gap-16 md:gap-24 lg:gap-32 pr-16 md:pr-24 lg:pr-32 shrink-0" aria-hidden="true">
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
          animation: ticker-left 90s linear infinite;
        }
        .animate-ticker-right {
          animation: ticker-right 90s linear infinite;
        }
        .animate-ticker-left:hover,
        .animate-ticker-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
