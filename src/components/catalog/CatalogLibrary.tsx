"use client";

import React from "react";
import { NormalizedLogo } from "@/components/brand/NormalizedLogo";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/config";
import { Brand, ResolvedBrand } from "@/types/catalog";

import { CANONICAL_BRANDS, CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";

interface CatalogLibraryProps {
  brands: Brand[];
  onSelectBrand?: (brand: ResolvedBrand) => void;
  selectedBrandSlug?: string | null;
}

const DEFAULT_BRANDS = CANONICAL_BRANDS.map((b) => ({
  name: b.name,
  slug: b.id,
}));

export default function CatalogLibrary({ brands, onSelectBrand, selectedBrandSlug }: CatalogLibraryProps) {
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

  React.useEffect(() => {
    if (!selectedBrandSlug) return;
    const targetKey = selectedBrandSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const el = document.getElementById(`brand-card-${targetKey}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedBrandSlug]);

  return (
    <section id="official-catalogs" className="py-20 md:py-28 bg-[var(--surface)] text-[var(--text-primary)] border-t border-[var(--border)]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-4xl mb-16 md:mb-20">
          <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-brass-ink mb-3 block">
            Authorized Reference Library
          </span>
          <h1 className="hc-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.0] mb-5">
            Official Brand Partners & Catalogs
          </h1>
          <p className="text-base sm:text-xl leading-relaxed text-[var(--text-secondary)] font-light max-w-3xl">
            Access the complete technical specifications and product lines of our authorized partners. 
            Click any brand card to view the official catalog or visit their manufacturer portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBrands.map((brand: Brand, idx: number) => {
            const key = normalizeBrandKey(brand);
            const meta = CANONICAL_BRANDS_BY_ID[key] ?? {
              name: brand.name ?? "Authorized Partner",
              logo: brand.logo ?? brand.logoUrl ?? null,
              website: brand.website ?? null,
              tagline: brand.tagline ?? brand.description ?? "Authorized Architectural Hardware Partner",
              country: brand.country ?? "India",
            };

            const logoSrc = meta.logo ?? brand.logoUrl ?? brand.logo;
            const websiteUrl = brand.website ?? meta.website;
            const displayName = meta.name ?? brand.name ?? "Authorized Brand";
            const tagline = brand.tagline ?? meta.tagline;
            const country = brand.country ?? meta.country;

            const catalogCount =
              brand.catalogues?.length || (brand.officialCatalogUrl ? 1 : 0);

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

            const isSelected = Boolean(
              selectedBrandSlug &&
              (key === selectedBrandSlug.toLowerCase().replace(/[^a-z0-9]/g, "") ||
               meta.name.toLowerCase().replace(/[^a-z0-9]/g, "") === selectedBrandSlug.toLowerCase().replace(/[^a-z0-9]/g, ""))
            );

            return (
              <div 
                id={`brand-card-${key}`}
                key={brand._id || brand.id || key || idx}
                onClick={handleCardClick}
                className={`bg-[var(--surface-raised)] border p-8 flex flex-col justify-between min-h-[340px] rounded-2xl group relative overflow-hidden cursor-pointer transition-all duration-300 hover:bg-[var(--surface-elevated)] ${
                  isSelected
                    ? "border-[#8b1a42] ring-2 ring-[#8b1a42]/30 shadow-[0_20px_45px_rgba(139,26,66,0.18)] bg-[var(--surface-elevated)]"
                    : "border-[var(--border)] hover:border-[var(--accent)]/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
                }`}
              >
                {/* Top Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-xs uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-full border ${
                    isSelected
                      ? "text-white bg-[#8b1a42] border-[#8b1a42]"
                      : "text-brass-ink bg-[#C8A96E]/10 border-[#C8A96E]/20"
                  }`}>
                    {isSelected ? "Selected Brand Partner" : "Authorized Partner"}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {country}
                  </span>
                </div>
                
                {/* Middle: Brand Logo & Tagline */}
                <div className="my-auto py-4">
                  <div className="h-16 w-full max-w-[220px] flex items-center justify-start transition-transform duration-300 group-hover:scale-105">
                    {logoSrc ? (
                      <NormalizedLogo
                        src={logoSrc}
                        alt={`${displayName} Logo`}
                        aspect={brand.logoUrl ? brand.logoAspect : null}
                        className={`${meta.imageClass || ""}`}
                        style={meta.imageStyle}
                      />
                    ) : (
                      <span className="font-display text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {displayName}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] mt-4 leading-relaxed line-clamp-2 font-normal">
                    {tagline}
                  </p>
                </div>
                
                {/* Bottom Actions: View Catalog + Visit Brand Website */}
                <div className="flex flex-wrap items-center justify-between pt-5 border-t border-[var(--border)] gap-x-3 gap-y-2">
                  {catalogCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] whitespace-nowrap rounded bg-[var(--accent)]/10 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white font-body text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{catalogCount > 1 ? `View ${catalogCount} Catalogs` : "View Catalog"}</span>
                    </button>
                  )}

                  {websiteUrl ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 min-h-[44px] whitespace-nowrap px-1 py-2 text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider transition-colors group/link"
                    >
                      <span>Visit Website</span>
                      <ArrowUpRight className="w-4 h-4 text-[#c8a96e] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      Showroom Partner
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center border border-[var(--border)] p-10 md:p-16 rounded-3xl bg-[var(--surface-raised)] shadow-sm">
          <h3 className="font-display text-3xl sm:text-4xl text-[var(--text-primary)] mb-4 font-light">Need a Physical Copy?</h3>
          <p className="font-body text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed font-light">
            We maintain physical copies of all official catalogs in our Sakchi showroom for architects, designers, and contractors.
          </p>
          <a
            href={buildWhatsAppUrl("Hi Hardware Collection, I would like to request a physical catalog.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[var(--accent)] text-white px-9 py-4 rounded font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors hover:bg-[var(--accent-hover)] shadow-md"
          >
            Request via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}





