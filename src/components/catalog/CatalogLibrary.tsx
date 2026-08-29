"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/config";
import { Brand, ResolvedBrand } from "@/types/catalog";

interface CatalogLibraryProps {
  brands: Brand[];
  onSelectBrand?: (brand: ResolvedBrand) => void;
}

interface BrandMeta {
  name: string;
  logo: string | null;
  website: string | null;
  tagline: string;
  country: string;
  imageClass?: string;
}

const BRAND_REGISTRY: Record<string, BrandMeta> = {
  hafele: {
    name: "Häfele",
    logo: "/brands/Haefele_Logo.png",
    website: "https://www.hafeleindia.com/",
    tagline: "German Architectural & Modular Kitchen Hardware",
    country: "Germany",
  },
  dorset: {
    name: "Dorset",
    logo: "/brands/dorset-seeklogo.svg",
    website: "https://www.dorsetindia.com/",
    tagline: "Digital Locks & Architectural Mortise Systems",
    country: "India / Global",
  },
  labacha: {
    name: "Labacha",
    logo: "/brands/labacha_logo_clean.png",
    website: "https://labachaindia.com/",
    tagline: "Luxury Granite Sinks & Precision Bath Mixers",
    country: "Italy / India",
  },
  godrej: {
    name: "Godrej",
    logo: "/brands/Godrej.svg",
    website: "https://www.godrejlocks.com/",
    tagline: "Enterprise & High-Trust Smart Biometric Security",
    country: "India",
  },
  hettich: {
    name: "Hettich",
    logo: "/brands/Hettich.svg",
    website: "https://www.hettich.com/en-in/",
    tagline: "Fascin[action] German Furniture & Kitchen Fittings",
    country: "Germany",
  },
  kich: {
    name: "Kich",
    logo: "/brands/kich_logo.svg",
    website: "https://www.kichindia.com/",
    tagline: "Architectural SS Hardware & Balustrade Systems",
    country: "India",
  },
  blum: {
    name: "Blum",
    logo: "/brands/Blum_logo.svg",
    website: "https://www.blum.com/in/en/",
    tagline: "Perfecting Motion Furniture Fittings",
    country: "Austria",
  },
  geze: {
    name: "GEZE",
    logo: "/brands/GEZE_Logo_RGB_clean.png",
    website: "https://www.geze.in/",
    tagline: "Door, Window & Safety Technology",
    country: "Germany",
  },
  yale: {
    name: "Yale",
    logo: "/brands/Yale_logo.svg",
    website: "https://www.yalehome.com/in/en",
    tagline: "Smart Security & The World's Favorite Lock",
    country: "Global",
  },
  ozone: {
    name: "Ozone",
    logo: "/brands/ozone.webp",
    website: "https://www.ozone-india.com/",
    tagline: "Architectural Glass & Security Systems",
    country: "India",
    imageClass: "brightness-0 invert opacity-90",
  },
  pans: {
    name: "Pans",
    logo: null,
    website: null,
    tagline: "Architectural Brass Hardware & Fittings",
    country: "India",
  },
  backer: {
    name: "Backer",
    logo: null,
    website: null,
    tagline: "Precision Engineered Hardware & Fasteners",
    country: "India",
  },
  tattva: {
    name: "Tattva",
    logo: null,
    website: null,
    tagline: "Artisanal Cast Brass Hardware & Accents",
    country: "India",
  },
  rexton: {
    name: "Rexton",
    logo: null,
    website: null,
    tagline: "Architectural Profiles & Sliding Hardware",
    country: "India",
  },
  madhuram: {
    name: "Madhuram",
    logo: null,
    website: null,
    tagline: "Premium Brass Architectural Hardware",
    country: "India",
  },
  furnipart: {
    name: "Furnipart",
    logo: null,
    website: "https://www.furnipart.com/",
    tagline: "Danish Design Furniture Handles & Knobs",
    country: "Denmark",
  },
  marnello: {
    name: "Marnello",
    logo: null,
    website: null,
    tagline: "Bespoke Door Pulls & Luxury Architectural Details",
    country: "Italy / India",
  },
  helix: {
    name: "Helix",
    logo: "/brands/heliex.webp",
    website: null,
    tagline: "Next-Gen Hardware",
    country: "Global",
  },
  liftor: {
    name: "Liftor",
    logo: "/brands/Liftor.png",
    website: null,
    tagline: "Ergonomic Excellence",
    country: "Global",
  },
  taco: {
    name: "Taco",
    logo: null,
    website: null,
    tagline: "Quality Hardware",
    country: "Global",
  },
  shapes: {
    name: "Shapes",
    logo: "/brands/Shapes_logo_dark-1-768x224.png",
    website: null,
    tagline: "Defined by Design",
    country: "Global",
  },
  decore: {
    name: "Decore",
    logo: "/brands/decore.png",
    website: null,
    tagline: "Premium Finishes",
    country: "Global",
  },
};

/**
 * Explicit alias table — each registry key maps to the set of strings that
 * unambiguously identify that brand in a Sanity slug/id/name field.
 * Aliases are matched with full-string equality after cleaning, not substring
 * matching, to prevent accidental collisions (e.g. a brand called "kich-pro"
 * should not match "kich" unless "kichpro" is a registered alias).
 */
const BRAND_ALIASES: Record<string, string[]> = {
  hafele:   ["hafele", "haefele", "hfele", "hafeleindia"],
  dorset:   ["dorset", "dorsetindia"],
  labacha:  ["labacha", "labachaindia"],
  godrej:   ["godrej", "godrejlocks"],
  hettich:  ["hettich"],
  kich:     ["kich", "kichindia"],
  blum:     ["blum"],
  geze:     ["geze"],
  yale:     ["yale", "yalehome"],
  ozone:    ["ozone", "ozoneindia"],
  pans:     ["pans"],
  backer:   ["backer"],
  tattva:   ["tattva"],
  rexton:   ["rexton"],
  madhuram: ["madhuram"],
  furnipart:["furnipart"],
  marnello: ["marnello"],
  helix:    ["helix"],
  liftor:   ["liftor"],
  taco:     ["taco"],
  shapes:   ["shapes"],
  decore:   ["decore"],
};

/** Build a reverse lookup: cleaned alias → registry key. Computed once at module load. */
const ALIAS_TO_KEY: Record<string, string> = Object.entries(BRAND_ALIASES).reduce(
  (acc, [key, aliases]) => {
    for (const alias of aliases) acc[alias] = key;
    return acc;
  },
  {} as Record<string, string>,
);

/**
 * Resolves a Sanity brand document to a BRAND_REGISTRY key.
 * Uses explicit alias matching — no substring matching — so new brands
 * only require a registry entry and an alias row, not a new if-arm.
 */
const normalizeBrandKey = (brand: Brand): string => {
  const raw =
    (brand?.slug as { current?: string })?.current ??
    (brand?.slug as string) ??
    brand?.id ??
    brand?.name ??
    "";
  const cleaned = String(raw).toLowerCase().replace(/[^a-z0-9]/g, "");
  return ALIAS_TO_KEY[cleaned] ?? cleaned;
};

const DEFAULT_BRANDS = Object.entries(BRAND_REGISTRY).map(([key, meta]) => ({
  name: meta.name,
  slug: key
}));

export default function CatalogLibrary({ brands, onSelectBrand }: CatalogLibraryProps) {
  const displayBrands: any[] = [...DEFAULT_BRANDS];
  if (brands && brands.length > 0) {
    brands.forEach(b => {
      const bKey = normalizeBrandKey(b);
      const idx = displayBrands.findIndex(db => normalizeBrandKey(db as Brand) === bKey);
      if (idx !== -1) {
        displayBrands[idx] = { ...displayBrands[idx], ...b };
      } else {
        displayBrands.push(b);
      }
    });
  }
  return (
    <section id="official-catalogs" className="py-24 bg-[#0e0e0f] text-white border-t border-white/[0.08]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-3 block">
            Authorized Reference Library
          </span>
          <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#e8e3d9] leading-tight mb-4">
            Official Brand Partners & Catalogs
          </h2>
          <p className="text-[13px] sm:text-[15px] leading-relaxed text-[#aaa49a] font-light">
            Access the complete technical specifications and product lines of our authorized partners. 
            Click any brand card to view the official catalog or visit their manufacturer portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBrands.map((brand: Brand, idx: number) => {
            const key = normalizeBrandKey(brand);
            const meta = BRAND_REGISTRY[key] ?? {
              name: brand.name ?? "Authorized Partner",
              logo: brand.logoUrl ?? brand.logo ?? null,
              website: brand.website ?? null,
              tagline: brand.tagline ?? brand.description ?? "Authorized Architectural Hardware Partner",
              country: brand.country ?? "India",
            };

            const logoSrc = brand.logoUrl ?? brand.logo ?? meta.logo;
            const websiteUrl = brand.website ?? meta.website;
            const displayName = meta.name ?? brand.name ?? "Authorized Brand";
            const tagline = brand.tagline ?? meta.tagline;
            const country = brand.country ?? meta.country;

            const handleCardClick = () => {
              if (onSelectBrand) {
                onSelectBrand({
                  ...brand,
                  name: displayName,
                  logoUrl: logoSrc,
                  website: websiteUrl,
                  tagline,
                });
              }
            };

            return (
              <div 
                key={brand._id || brand.id || key || idx}
                onClick={handleCardClick}
                className="bg-[#181718] border border-white/[0.08] p-7 flex flex-col justify-between h-[320px] rounded-xl group relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#e5c487]/50 hover:bg-[#1f1d1f] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C8A96E] bg-[#C8A96E]/10 px-2.5 py-1 rounded-full border border-[#C8A96E]/20">
                    Authorized Partner
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                    {country}
                  </span>
                </div>
                
                {/* Middle: Brand Logo & Tagline */}
                <div className="my-auto py-2">
                  <div className="relative h-14 w-full max-w-[200px] flex items-center justify-start">
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={`${displayName} Logo`}
                        fill
                        className={`object-contain object-left transition-transform duration-300 group-hover:scale-105 ${meta.imageClass || ""}`}
                        unoptimized={typeof logoSrc === "string" && logoSrc.endsWith(".svg")}
                      />
                    ) : (
                      <span className="font-display text-2xl text-[#e5e2e3] group-hover:text-white transition-colors">
                        {displayName}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-[#d0c5b5] mt-3.5 leading-relaxed line-clamp-2">
                    {tagline}
                  </p>
                </div>
                
                {/* Bottom Actions: View Catalog + Visit Brand Website */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#C8A96E]/15 hover:bg-[#C8A96E] text-[#e5c487] hover:text-[#0e0e0f] font-body text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Catalog</span>
                  </button>

                  {websiteUrl ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors py-1 group/link"
                    >
                      <span>Visit Website</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#e5c487] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                      Showroom Partner
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center border border-[#262626] p-8 md:p-12 rounded-xl bg-[#141314]">
          <h3 className="font-display text-2xl text-[#e5e2e3] mb-4">Need a Physical Copy?</h3>
          <p className="font-body text-[#d0c5b5] max-w-xl mx-auto mb-8 text-sm">
            We maintain physical copies of all official catalogs in our Sakchi showroom for architects, designers, and contractors.
          </p>
          <a
            href={buildWhatsAppUrl("Hi Hardware Collection, I would like to request a physical catalog.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#e5c487] text-[#131314] px-8 py-3.5 rounded font-bold uppercase tracking-wider text-xs transition-colors hover:bg-white"
          >
            Request via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}


