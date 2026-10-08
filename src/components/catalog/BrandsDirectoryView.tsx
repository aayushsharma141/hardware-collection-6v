"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Brand, ResolvedBrand, SiteSettings } from "@/types/catalog";
import { buildWhatsAppUrl } from "@/lib/config";
import { normalizeBrandKey } from "@/content/fallback/brands";
import BrandTrustStrip from "@/components/brand/BrandTrustStrip";

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

const DIRECTORY_ROSTER: BrandDirectoryMeta[] = [
  // B (2 brands)
  {
    id: "becker",
    name: "Becker",
    letter: "B",
    initial: "B",
    directoryDescription: "Quality architectural hardware.",
    website: null,
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
    website: null,
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
    website: null,
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
    website: null,
  },
  // R (1 brand)
  {
    id: "rexton",
    name: "Rexton",
    letter: "R",
    initial: "R",
    directoryDescription: "Hardware excellence for interiors.",
    website: null,
  },
  // S (1 brand)
  {
    id: "shapes",
    name: "Shapes",
    letter: "S",
    initial: "S",
    directoryDescription: "Hardware defined by design.",
    website: null,
  },
  // T (2 brands)
  {
    id: "taco",
    name: "Taco",
    letter: "T",
    initial: "T",
    directoryDescription: "Quality architectural hardware.",
    website: null,
  },
  {
    id: "tattva",
    name: "Tattva",
    letter: "T",
    initial: "T",
    directoryDescription: "Luxury artisanal cast-brass statement handles.",
    website: null,
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
  const handleOpenCatalogue = (meta: BrandDirectoryMeta) => {
    const matched = brandLookup.get(meta.id);
    const resolved: ResolvedBrand = {
      ...(matched || {}),
      id: meta.id,
      name: meta.name,
      logoUrl: matched?.logoUrl || matched?.logo || null,
      website: meta.website || matched?.website || null,
      tagline: meta.directoryDescription,
    };
    onSelectBrand(resolved);
  };

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-[#fbfaf8] text-[#1a1017]">
      {/* ── 01. Hero & Header Section (Mockup 3 Split Design) ─────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="hc-mono text-[11px] font-medium tracking-[0.22em] text-[#8b1a42] uppercase block mb-3">
            MANUFACTURER REFERENCE LIBRARY
          </span>
          <h1 className="hc-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#1a1017] tracking-tight mb-4">
            Brands & Catalogues
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#635860] font-light max-w-2xl mx-auto">
            Official manufacturer catalogues, technical references and product specifications from our authorized partners.
          </p>
        </div>

        {/* The Two Entry Points */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto mb-16">
          {/* Left: I know the brand */}
          <div className="bg-white border border-[#1a1017]/[0.08] p-8 sm:p-10 shadow-[0_2px_12px_rgba(26,16,23,0.02)] relative overflow-hidden">
            <h2 className="hc-serif text-2xl font-normal text-[#1a1017] mb-2 relative z-10">I know the brand</h2>
            <p className="text-sm text-[#786e75] mb-8 relative z-10">Jump directly to a manufacturer to view their official catalogues.</p>
            <div className="relative z-10 flex flex-wrap gap-2">
              {ALPHABET_NAV.map((letter) => (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  className="w-10 h-10 flex items-center justify-center bg-[#fbfaf8] border border-[#1a1017]/[0.08] hover:border-[#8b1a42] hover:text-[#8b1a42] text-[#1a1017] transition-colors hc-serif text-lg"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Right: I'm looking for something */}
          <div className="bg-[#f8f6f3] border border-[#1a1017]/[0.05] p-8 sm:p-10 relative overflow-hidden">
            <h2 className="hc-serif text-2xl font-normal text-[#1a1017] mb-2 relative z-10">I&apos;m looking for something</h2>
            <p className="text-sm text-[#786e75] mb-8 relative z-10">Find hardware by application or category across all our brands.</p>
            
            <div className="flex flex-wrap gap-2.5 relative z-10">
              <Link href="/collections#doors" className="text-[13px] font-medium border border-[#1a1017]/10 bg-white px-4 py-2 hover:border-[#8b1a42] hover:text-[#8b1a42] transition-colors">Doors</Link>
              <Link href="/collections#kitchen" className="text-[13px] font-medium border border-[#1a1017]/10 bg-white px-4 py-2 hover:border-[#8b1a42] hover:text-[#8b1a42] transition-colors">Kitchen</Link>
              <Link href="/collections#wardrobe" className="text-[13px] font-medium border border-[#1a1017]/10 bg-white px-4 py-2 hover:border-[#8b1a42] hover:text-[#8b1a42] transition-colors">Wardrobe</Link>
              <Link href="/collections#security" className="text-[13px] font-medium border border-[#1a1017]/10 bg-white px-4 py-2 hover:border-[#8b1a42] hover:text-[#8b1a42] transition-colors">Security</Link>
              <Link href="/collections#bathroom" className="text-[13px] font-medium border border-[#1a1017]/10 bg-white px-4 py-2 hover:border-[#8b1a42] hover:text-[#8b1a42] transition-colors">Bathroom</Link>
              <Link href="/collections" className="text-[13px] font-medium border border-transparent bg-[#1a1017]/[0.04] px-4 py-2 hover:bg-[#1a1017]/[0.08] transition-colors flex items-center gap-1">
                Explore all <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 01b. Brand Marquee Strip ────────────────────────────────────────── */}
      <BrandTrustStrip brands={brands} hideHeader={true} />

      {/* ── 02. Featured Partners (Trimmed to 4) ──────────────────────────── */}
      <section id="featured" className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1a1017]/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="hc-mono text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#8b1a42] uppercase block mb-2">
                Featured
              </span>
              <h2 className="hc-serif text-3xl sm:text-4xl font-light text-[#1a1017] tracking-tight">
                Key manufacturers
              </h2>
            </div>
            <button 
              onClick={() => {
                const el = document.getElementById("all-brands");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-[13px] font-medium text-[#1a1017] hover:text-[#8b1a42] inline-flex items-center gap-1 transition-colors"
            >
              <span>View all brands</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredBrands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => {
                  const el = document.getElementById(`brand-${brand.id}`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.classList.add("ring-1", "ring-[#8b1a42]", "ring-offset-4");
                    setTimeout(() => el.classList.remove("ring-1", "ring-[#8b1a42]", "ring-offset-4"), 1500);
                  } else {
                    scrollToLetter(brand.letter);
                  }
                }}
                className="text-left bg-white border border-[#1a1017]/[0.09] p-6 sm:p-8 flex flex-col justify-between min-h-[160px] shadow-[0_1px_4px_rgba(26,16,23,0.02)] hover:shadow-[0_4px_12px_rgba(26,16,23,0.06)] hover:border-[#1a1017]/20 transition-all group"
              >
                <div>
                  <h3 className="hc-serif text-2xl font-normal text-[#1a1017] mb-2 group-hover:text-[#8b1a42] transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-[13px] text-[#635860] leading-relaxed font-light">
                    {brand.featuredDescription}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-[#1a1017]/40 group-hover:text-[#8b1a42] transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

      {/* ── 03. Official Catalogue Library (Mockup 1 List Rows) ─────────────────── */}
      <section id="all-brands" className="py-12 sm:py-16 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1a1017]/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="hc-mono text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#8b1a42] uppercase block mb-2">
              All Partners
            </span>
            <h2 className="hc-serif text-3xl sm:text-4xl font-light text-[#1a1017] tracking-tight">
              Official Catalogue Library
            </h2>
          </div>

          {/* Alphabet Jump Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[13px] font-medium tracking-widest text-[#786e75]">
            {ALPHABET_NAV.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => scrollToLetter(letter)}
                className="hover:text-[#8b1a42] transition-colors duration-150 focus:outline-none"
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
              <div className="pb-3 mb-4 border-b border-[#1a1017]/[0.08]">
                <h3 className="hc-serif text-2xl font-normal text-[#1a1017]/50 leading-none">
                  {letter}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((brand) => (
                  <div
                    key={brand.id}
                    id={`brand-${brand.id}`}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 sm:p-6 lg:px-8 bg-white border border-[#1a1017]/[0.08] hover:border-[#1a1017]/20 transition-all shadow-[0_1px_3px_rgba(26,16,23,0.02)]"
                  >
                    {/* Left: Brand Identity */}
                    <div className="flex items-center gap-5 md:w-[35%] shrink-0 mb-4 md:mb-0">
                      <div className="w-20 h-14 bg-white flex items-center justify-center shrink-0">
                        {brandLookup.get(brand.id)?.logoUrl || brandLookup.get(brand.id)?.logo ? (
                          <img
                            src={(brandLookup.get(brand.id)?.logoUrl || brandLookup.get(brand.id)?.logo) as string}
                            alt={`${brand.name} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-[#f4eee6]/80 flex items-center justify-center border border-[#1a1017]/[0.04]">
                            <span className="hc-serif text-2xl font-normal text-[#8c827a]">
                              {brand.initial}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl hc-serif text-[#1a1017] mb-0.5">
                          {brand.name}
                        </h4>
                        {brand.country && (
                          <span className="text-[11px] text-[#786e75] uppercase tracking-wider">
                            {brand.country}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Specialization */}
                    <div className="md:w-[40%] mb-5 md:mb-0 md:pr-8">
                      <p className="text-[13.5px] text-[#635860] leading-relaxed font-light">
                        {brand.directoryDescription}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 md:w-[25%] md:justify-end shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenCatalogue(brand)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#8b1a42] text-white text-[12px] font-medium hover:bg-[#6b1432] transition-colors whitespace-nowrap"
                      >
                        VIEW CATALOGUE
                      </button>

                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-5 py-2.5 border border-[#1a1017]/20 text-[#1a1017] text-[12px] font-medium hover:border-[#1a1017] transition-colors text-center whitespace-nowrap"
                        >
                          VISIT WEBSITE
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04. How It Works Strip (Mockup 2 Workflow) ────────────────── */}
      <section className="py-16 sm:py-20 bg-[#1a1017] text-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="hc-mono text-[11px] font-medium tracking-[0.25em] text-[#e3ded9]/60 uppercase block mb-3">
              How to use the catalogue
            </span>
            <h2 className="hc-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Find exactly what you need
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 max-w-4xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-white/10" />

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[#1a1017] border border-white/20 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[#e3ded9]">01</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Browse</h4>
              <p className="text-[13px] text-[#e3ded9]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Open the official manufacturer catalogue.
              </p>
            </div>
            
            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[#1a1017] border border-white/20 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[#e3ded9]">02</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Find</h4>
              <p className="text-[13px] text-[#e3ded9]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Search or jump to a specific reference page.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[#1a1017] border border-white/20 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[#e3ded9]">03</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Mark</h4>
              <p className="text-[13px] text-[#e3ded9]/70 font-light leading-relaxed max-w-[180px] mx-auto">
                Circle the exact hardware you need.
              </p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-14 h-14 mx-auto bg-[#1a1017] border border-[#8b1a42] bg-[#8b1a42]/10 flex items-center justify-center rounded-full mb-5">
                <span className="hc-mono text-sm text-[#8b1a42]">04</span>
              </div>
              <h4 className="text-[13px] font-medium mb-2 tracking-wide uppercase">Send</h4>
              <p className="text-[13px] text-[#e3ded9]/70 font-light leading-relaxed max-w-[180px] mx-auto">
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
          <div className="bg-white border border-[#1a1017]/[0.08] p-8 sm:p-12 text-center">
            <h2 className="hc-serif text-2xl font-normal text-[#1a1017] mb-3">
              Need help identifying something?
            </h2>
            <p className="text-sm text-[#786e75] font-light mb-8 max-w-[280px] mx-auto">
              Our showroom experts can help you specify the right hardware.
            </p>
            <a
              href={buildWhatsAppUrl("Hi Hardware Collection, I need some help identifying and specifying hardware.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-wide text-[#1a1017] border border-[#1a1017]/[0.15] hover:border-[#1a1017] transition-colors"
            >
              <span>Ask an expert</span>
              <span>→</span>
            </a>
          </div>

          {/* Physical copy */}
          <div className="bg-[#1a1017] p-8 sm:p-12 text-center border border-[#1a1017]">
            <h2 className="hc-serif text-2xl font-normal text-white mb-3">
              Need a physical copy?
            </h2>
            <p className="text-sm text-white/60 font-light mb-8 max-w-[280px] mx-auto">
              We keep selected printed catalogues for architects and designers.
            </p>
            <a
              href={buildWhatsAppUrl("Hi Hardware Collection, I would like to request a physical manufacturer catalogue.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium tracking-wide text-white bg-[#8b1a42] hover:bg-[#6b1432] transition-colors"
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
