"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/config";
import { Brand, ResolvedBrand } from "@/types/catalog";

import { CANONICAL_BRANDS, CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/data/brands";

interface CatalogLibraryProps {
  brands: Brand[];
  onSelectBrand?: (brand: ResolvedBrand) => void;
}

const DEFAULT_BRANDS = CANONICAL_BRANDS.map((b) => ({
  name: b.name,
  slug: b.id,
}));

export default function CatalogLibrary({ brands, onSelectBrand }: CatalogLibraryProps) {
  const displayBrands: Brand[] = [...DEFAULT_BRANDS];
  if (brands && brands.length > 0) {
    brands.forEach(b => {
      const bKey = normalizeBrandKey(b);
      const idx = displayBrands.findIndex(db => normalizeBrandKey(db) === bKey);
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
            const meta = CANONICAL_BRANDS_BY_ID[key] ?? {
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
                  website: websiteUrl ?? null,
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


