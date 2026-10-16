"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand, ResolvedBrand, SiteSettings } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/config";
import { normalizeBrandKey } from "@/content/fallback/brands";
import BrandTrustStrip from "@/components/brand/BrandTrustStrip";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface BrandsDirectoryViewProps {
  brands: Brand[];
  settings?: SiteSettings | null;
  onSelectBrand: (brand: ResolvedBrand) => void;
  selectedBrandSlug?: string | null;
}

interface BrandDirectoryMeta {
  id: string;
  name: string;
  letter: string;
  featured?: boolean;
  featuredDescription?: string;
  directoryDescription: string;
  website: string | null;
  accentColor?: string;
  initial: string;
  country?: string;
}

const BRAND_APPLICATION_IMAGES: Record<string, string> = {
  blum: "/cinema/categories/HC-03-KITCHEN.png",
  dorset: "/cinema/categories/HC-03-DOORS.png",
  hafele: "/cinema/categories/HC-03-FURNITURE.png",
  hettich: "/cinema/categories/HC-03-WARDROBE.png",
};

const BRAND_DESCRIPTORS: Record<string, string> = {
  blum: "Lift systems & functional kitchen fittings",
  dorset: "Architectural door hardware & digital locks",
  hafele: "Architectural hardware & wardrobe accessories",
  hettich: "Drawer systems & sliding wardrobe fittings",
};

const DIRECTORY_ROSTER: BrandDirectoryMeta[] = [
  // B (2 brands)
  {
    id: "becker",
    name: "Becker",
    letter: "B",
    initial: "B",
    directoryDescription: "Quality architectural hardware.",
    website: "https://mpghardware.com/brands/becker",
  },
  {
    id: "blum",
    name: "Blum",
    letter: "B",
    initial: "B",
    featured: true,
    accentColor: "#f37021",
    featuredDescription: "Lift systems, premium drawer boxes, and soft-close hinges.",
    directoryDescription: "Lift systems (Aventos), premium drawer boxes (Legrabox/Tandembox), and soft-close hinges.",
    website: "https://www.blum.com/in/en/",
    country: "Austria",
  },
  // D (2 brands)
  {
    id: "dorio",
    name: "Dörio",
    letter: "D",
    initial: "D",
    directoryDescription: "Architectural glass hardware and patch fittings.",
    website: "https://www.dorioindia.com/",
    country: "India",
  },
  {
    id: "dorset",
    name: "Dorset",
    letter: "D",
    initial: "D",
    featured: true,
    accentColor: "#2a2b72",
    featuredDescription: "Digital locks, mortise handles, and architectural door hardware.",
    directoryDescription: "Digital locks, mortise handles, and architectural door hardware.",
    website: "https://www.dorsetindia.com/",
    country: "India",
  },
  // F (1 brand)
  {
    id: "furnipart",
    name: "Furnipart",
    letter: "F",
    initial: "F",
    directoryDescription: "Danish minimalist designer handles and profiles.",
    website: "https://www.furnipart.com/",
    country: "Denmark",
  },
  // G (2 brands)
  {
    id: "geze",
    name: "Geze",
    letter: "G",
    initial: "G",
    directoryDescription: "Door closers and building access systems.",
    website: "https://www.geze.in/",
    country: "Germany",
  },
  {
    id: "godrej",
    name: "Godrej",
    letter: "G",
    initial: "G",
    directoryDescription: "Smart biometric locks, security cylinders, and safes.",
    website: "https://www.godrejlocks.com/",
    country: "India",
  },
  // H (2 brands)
  {
    id: "hafele",
    name: "Häfele",
    letter: "H",
    initial: "H",
    featured: true,
    accentColor: "#e30613",
    featuredDescription: "Architectural door hardware, kitchen fittings, wardrobe accessories.",
    directoryDescription: "Architectural door hardware, kitchen fittings, wardrobe accessories, and furniture lighting.",
    website: "https://www.hafeleindia.com/",
    country: "Germany",
  },
  {
    id: "hettich",
    name: "Hettich",
    letter: "H",
    initial: "H",
    featured: true,
    accentColor: "#004b93",
    featuredDescription: "Drawer systems, sliding wardrobe systems, and hinges.",
    directoryDescription: "Drawer systems (InnoTech/AvanTech YOU), sliding wardrobe systems, and hinges.",
    website: "https://www.hettich.com/en-in/",
    country: "Germany",
  },
  // L (2 brands)
  {
    id: "labacha",
    name: "Labacha",
    letter: "L",
    initial: "L",
    directoryDescription: "Luxury quartz composite granite sinks and workstation bath faucets.",
    website: "https://labachaindia.com/",
  },
  {
    id: "liftor",
    name: "Liftor",
    letter: "L",
    initial: "L",
    directoryDescription: "Ergonomic furniture hardware.",
    website: null,
  },
  // M (1 brand)
  {
    id: "madhuram",
    name: "Madhuram",
    letter: "M",
    initial: "M",
    directoryDescription: "Reliable architectural hardware.",
    website: "https://madhuramoverseas.com/",
    country: "India",
  },
  // O (1 brand)
  {
    id: "ozone",
    name: "Ozone",
    letter: "O",
    initial: "O",
    directoryDescription: "Frameless glass patch fittings, glass sliding systems, and shower hardware.",
    website: "https://www.ozone-india.com/",
    country: "India",
  },
  // P (1 brand)
  {
    id: "pans",
    name: "Pans",
    letter: "P",
    initial: "P",
    directoryDescription: "Premium hardware solutions.",
    website: "https://mpghardware.com/brands/pans",
  },
  // R (1 brand)
  {
    id: "rexton",
    name: "Rexton",
    letter: "R",
    initial: "R",
    directoryDescription: "Hardware excellence for interiors.",
    website: "https://rextontechnologies.in/",
  },
  // S (1 brand)
  {
    id: "shapes",
    name: "Shapes",
    letter: "S",
    initial: "S",
    directoryDescription: "Hardware defined by design.",
    website: "https://shapeshw.com/",
    country: "India",
  },
  // T (2 brands)
  {
    id: "taco",
    name: "Taco",
    letter: "T",
    initial: "T",
    directoryDescription: "Quality architectural hardware.",
    website: "https://tacoworld.in/",
    country: "India",
  },
  {
    id: "tattva",
    name: "Tattva",
    letter: "T",
    initial: "T",
    directoryDescription: "Luxury artisanal cast-brass statement handles.",
    website: "https://mukulgoyal.com/",
    country: "India",
  },
  // Y (1 brand)
  {
    id: "yale",
    name: "Yale",
    letter: "Y",
    initial: "Y",
    directoryDescription: "Digital locks, mortise handles, and high-security solutions.",
    website: "https://www.yalehome.com/in/en",
    country: "Sweden",
  },
];

const ALPHABET_NAV = ["B", "D", "F", "G", "H", "L", "M", "O", "P", "R", "S", "T", "Y"];

export default function BrandsDirectoryView({
  brands,
  onSelectBrand,
}: BrandsDirectoryViewProps) {
  const brandLookup = useMemo(() => {
    const map = new Map<string, Brand>();
    (brands || []).forEach((b) => {
      const key = normalizeBrandKey(b);
      map.set(key, b);
    });
    return map;
  }, [brands]);

  const featuredBrands = useMemo(() => {
    return DIRECTORY_ROSTER.filter((b) => b.featured);
  }, []);

  const groupedDirectory = useMemo(() => {
    const groups: { letter: string; items: BrandDirectoryMeta[] }[] = [];

    ALPHABET_NAV.forEach((letter) => {
      const items = DIRECTORY_ROSTER.filter((b) => b.letter === letter);
      if (items.length > 0) {
        groups.push({ letter, items });
      }
    });
    return groups;
  }, []);

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-[var(--surface)] text-[var(--text-primary)]">
      {/* ── 01. Hero & Header Section ─────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-10 sm:pb-14 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="hc-serif text-5xl sm:text-6xl md:text-7xl font-light text-[var(--text-primary)] tracking-tight mb-4 text-balance">
          Brands & Catalogues
        </h1>
        <p className="text-[16px] sm:text-[18px] text-[var(--text-secondary)] font-light max-w-2xl mx-auto">
          Find official product catalogues, specifications and manufacturer references for the hardware you need.
        </p>
      </section>

      {/* ── 01b. Brand Marquee Strip ────────────────────────────────────────── */}
      <BrandTrustStrip brands={brands} hideHeader={true} />

      {/* ── 02. Featured Partners (Key Manufacturers) ──────────────────────────── */}
      <section id="featured" className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="hc-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight text-balance">
              Featured Brands
            </h2>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("all-brands");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="text-[13px] font-medium text-[var(--text-primary)] hover:text-[var(--color-wine)] inline-flex items-center gap-1 transition-colors"
          >
            <span>View all brands</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredBrands.map((brand) => {
            const resolved = brandLookup.get(brand.id) as ResolvedBrand | undefined;
            const logoSrc = resolved?.logoUrl || resolved?.logo;
            const applicationImage = BRAND_APPLICATION_IMAGES[brand.id] || "/cinema/categories/HC-03-DOORS.png";
            const descriptor = BRAND_DESCRIPTORS[brand.id] || brand.featuredDescription || "Architectural hardware & fittings";

            const handleBrandAction = () => {
              if (resolved && onSelectBrand && (resolved.catalogues?.length || resolved.officialCatalogUrl)) {
                onSelectBrand(resolved);
              } else {
                const el = document.getElementById(`brand-${brand.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  el.classList.add("ring-1", "ring-[var(--color-wine)]", "ring-offset-4");
                  setTimeout(() => el.classList.remove("ring-1", "ring-[var(--color-wine)]", "ring-offset-4"), 1500);
                } else {
                  scrollToLetter(brand.letter);
                }
              }
            };

            return (
              <div
                key={brand.id}
                onClick={handleBrandAction}
                className="group bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer hover:border-[var(--color-wine)]/50 transition-all duration-300 shadow-[0_1px_3px_rgba(26,16,23,0.02)] hover:-translate-y-1"
              >
                <div>
                  {/* Official Brand Logo as Main Identifier */}
                  <div className="h-10 mb-4 flex items-center justify-between">
                    {logoSrc ? (
                      <div className="h-8 flex items-center justify-start">
                        <Image
                          src={logoSrc as string}
                          alt={`${brand.name} logo`}
                          width={110}
                          height={28}
                          className="h-7 w-auto max-w-[110px] object-contain object-left"
                          unoptimized={typeof logoSrc === "string" && logoSrc.endsWith(".svg")}
                        />
                      </div>
                    ) : (
                      <span className="hc-serif text-xl font-normal text-[var(--text-primary)]">
                        {brand.name}
                      </span>
                    )}
                    {brand.country && (
                      <span className="text-[10px] hc-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        {brand.country}
                      </span>
                    )}
                  </div>

                  {/* Refined Product / Application Context Image */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3.5 bg-[var(--surface)] border border-[var(--border)]/70">
                    <Image
                      src={applicationImage}
                      alt={`${brand.name} architectural hardware application`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>

                  {/* Short Descriptor: establishes what the brand specializes in */}
                  <p className="text-[13px] text-[var(--text-secondary)] font-light leading-relaxed line-clamp-2 mb-4">
                    {descriptor}
                  </p>
                </div>

                {/* Simple Action: Explore Collection → */}
                <div className="border-t border-[var(--border)]/70 pt-3.5 flex items-center justify-between">
                  <span className="text-[11.5px] hc-mono font-medium uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--color-wine)] transition-colors">
                    Explore Collection
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--color-wine)] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 03. Official Catalogue Library ─────────────────── */}
      <section id="all-brands" className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="hc-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight text-balance">
              Official Catalogue Library
            </h2>
          </div>

          {/* Alphabet Jump Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[13px] font-medium tracking-widest text-[var(--text-secondary)]">
            {ALPHABET_NAV.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => scrollToLetter(letter)}
                className="hover:text-[var(--color-wine)] transition-colors duration-150 focus:outline-none"
                aria-label={`Jump to letter ${letter}`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {groupedDirectory.map(({ letter, items }) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-28">
              <div className="pb-3 mb-4 border-b border-[var(--border)]">
                <h3 className="hc-serif text-2xl font-light text-[var(--text-primary)]/50 leading-none">
                  {letter}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((brand) => (
                  <div
                    key={brand.id}
                    id={`brand-${brand.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 sm:p-6 lg:px-8 bg-white border border-[var(--border)] rounded-2xl hover:border-[var(--color-wine)]/40 hover:shadow-[0_12px_32px_rgba(91,30,49,0.06)] transition-all duration-300 hover:-translate-y-0.5 group/row"
                  >
                    {/* Left: Brand Identity */}
                    <div className="flex items-center gap-5 md:w-[35%] shrink-0 mb-4 md:mb-0">
                      <div className="w-20 h-14 bg-[var(--surface-raised)]/60 border border-[var(--border)] rounded-xl flex items-center justify-center shrink-0 p-2 group-hover/row:bg-white group-hover/row:border-[var(--color-wine)]/30 transition-colors">
                        {brandLookup.get(brand.id)?.logoUrl || brandLookup.get(brand.id)?.logo ? (
                          <Image
                            src={(brandLookup.get(brand.id)?.logoUrl || brandLookup.get(brand.id)?.logo) as string}
                            alt={`${brand.name} logo`}
                            width={80}
                            height={56}
                            className="max-w-full max-h-full object-contain"
                            unoptimized={typeof (brandLookup.get(brand.id)?.logoUrl || brandLookup.get(brand.id)?.logo) === "string" && ((brandLookup.get(brand.id)?.logoUrl || brandLookup.get(brand.id)?.logo) as string).endsWith(".svg")}
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center">
                            <span className="hc-serif text-xl font-light text-[var(--color-wine)]">
                              {brand.initial}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl hc-serif font-light text-[var(--text-primary)] mb-0.5 group-hover/row:text-[var(--color-wine)] transition-colors">
                          {brand.name}
                        </h4>
                        {brand.country && (
                          <span className="text-[10px] hc-mono text-[var(--text-secondary)] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                            {brand.country}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Specialization */}
                    <div className="md:w-[40%] mb-5 md:mb-0 md:pr-8">
                      <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed font-light">
                        {brand.directoryDescription}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-3 w-full md:w-[25%] shrink-0 mt-4 md:mt-0">
                      <Link
                        href={`/catalogues?brand=${brand.id}`}
                        onClick={(e) => {
                          const resolved = brandLookup.get(brand.id) as ResolvedBrand | undefined;
                          if (resolved && onSelectBrand && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                            e.preventDefault();
                            onSelectBrand(resolved);
                          }
                        }}
                        className="w-full sm:w-auto rounded-full px-5 py-2.5 bg-[var(--color-wine)] text-white text-[12px] hc-mono font-medium uppercase tracking-wider hover:bg-[var(--color-wine-deep)] transition-colors whitespace-nowrap shadow-sm text-center"
                      >
                        VIEW CATALOGUE
                      </Link>

                      {(() => {
                        const websiteUrl = brand.website || brandLookup.get(brand.id)?.website;
                        if (websiteUrl) {
                          return (
                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto rounded-full px-5 py-2.5 border border-[var(--border)] bg-white text-[var(--text-primary)] text-[12px] hc-mono font-medium uppercase tracking-wider hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors text-center whitespace-nowrap inline-flex items-center justify-center gap-1.5"
                            >
                              <span>VISIT WEBSITE</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          );
                        }
                        return (
                          <a
                            href={buildWhatsAppUrl(`Hi Hardware Collection, I would like to enquire about ${brand.name} hardware products.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto rounded-full px-5 py-2.5 border border-[var(--border)] bg-white text-[var(--text-primary)] text-[12px] hc-mono font-medium uppercase tracking-wider hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors text-center whitespace-nowrap inline-flex items-center justify-center gap-1.5"
                          >
                            <span>ENQUIRE BRAND</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04. How It Works Strip ────────────────── */}
      <section className="py-16 sm:py-20 bg-[var(--color-obsidian)] text-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="hc-mono text-[11px] font-medium tracking-[0.25em] text-[var(--color-bone)]/60 uppercase block mb-3">
              How to use the catalogue
            </span>
            <h2 className="hc-serif text-3xl sm:text-4xl font-light text-white tracking-tight text-balance">
              Find exactly what you need
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 max-w-4xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-white/10" />

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[var(--color-obsidian)] border border-white/20 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[var(--color-bone)]">01</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Browse</h4>
              <p className="text-[13px] text-[var(--color-bone)]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Open the official manufacturer catalogue.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[var(--color-obsidian)] border border-white/20 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[var(--color-bone)]">02</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Find</h4>
              <p className="text-[13px] text-[var(--color-bone)]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Search or jump to a specific reference page.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[var(--color-obsidian)] border border-white/20 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[var(--color-bone)]">03</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Mark</h4>
              <p className="text-[13px] text-[var(--color-bone)]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Circle the exact hardware you need.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[var(--color-obsidian)] border border-[var(--color-wine)] bg-[var(--color-wine)]/10 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[var(--color-wine)]">04</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Send</h4>
              <p className="text-[13px] text-[var(--color-bone)]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Send the reference to our team on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05. Need a printed copy? Showroom Section ────────────────── */}
      <section className="py-16 sm:py-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Ask an expert */}
          <div className="bg-white border border-[var(--border)] p-8 sm:p-12 text-center shadow-[0_2px_12px_rgba(26,16,23,0.02)]">
            <h2 className="hc-serif text-2xl font-light text-[var(--text-primary)] mb-3 text-balance">
              Need help identifying something?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light mb-8 max-w-[280px] mx-auto">
              Our showroom experts can help you specify the right hardware.
            </p>
            <a
              href={buildWhatsAppUrl("Hi Hardware Collection, I need some help identifying and specifying hardware.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-wide text-[var(--text-primary)] border border-[var(--border)] bg-white hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
            >
              <span>Ask an expert</span>
              <span>→</span>
            </a>
          </div>

          {/* Physical copy */}
          <div className="bg-[var(--color-obsidian)] p-8 sm:p-12 text-center border border-[var(--color-obsidian)]">
            <h2 className="hc-serif text-2xl font-light text-white mb-3 text-balance">
              Need a physical copy?
            </h2>
            <p className="text-sm text-white/60 font-light mb-8 max-w-[280px] mx-auto">
              We keep selected printed catalogues for architects and designers.
            </p>
            <a
              href={buildWhatsAppUrl("Hi Hardware Collection, I would like to request a physical manufacturer catalogue.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-wide text-white bg-[var(--color-wine)] hover:bg-[var(--color-wine-deep)] transition-colors"
            >
              <span>Request via WhatsApp</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
