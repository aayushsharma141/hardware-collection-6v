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
    <section id="official-catalogues" className="py-20 md:py-28 bg-[var(--surface)] text-[var(--text-primary)] border-t border-[var(--border)]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-4xl mb-16 md:mb-20">
          <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-brass-ink mb-3 block">
            Authorized Reference Library
          </span>
          <h1 className="hc-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.0] mb-5 text-balance">
            Official Brand Partners & Catalogues
          </h1>
          <p className="text-base sm:text-xl leading-relaxed text-[var(--text-secondary)] font-light max-w-3xl">
            Access the complete technical specifications and product lines of our authorized partners. 
            Click any brand card to view the official catalogue or visit their manufacturer portal.
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
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick();
                  }
                }}
                className={`p-7 sm:p-8 flex flex-col justify-between min-h-[360px] rounded-2xl group relative overflow-hidden cursor-pointer transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(26,16,23,0.03)] hover:shadow-[0_20px_48px_rgba(91,30,49,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wine)] ${
                  isSelected
                    ? "border border-[var(--color-wine)] ring-1 ring-[var(--color-wine)]/30 bg-white"
                    : "border border-[var(--border)] bg-white hover:border-[var(--color-wine)]/40"
                }`}
              >
                {/* Subtle Top Brass/Wine Accent Line */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brass)]/40 to-transparent group-hover:via-[var(--color-wine)] transition-colors duration-500"
                />

                {/* Top Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-[10px] hc-mono uppercase font-semibold tracking-[0.16em] px-3 py-1 rounded-full border ${
                    isSelected
                      ? "text-white bg-[var(--color-wine)] border-[var(--color-wine)]"
                      : "text-[var(--color-brass-ink)] bg-[var(--surface-raised)] border-[var(--color-brass)]/30 group-hover:border-[var(--color-wine)]/30 group-hover:text-[var(--color-wine)] transition-colors"
                  }`}>
                    {isSelected ? "Selected Partner" : "Authorized Partner"}
                  </span>
                  <span className="text-[10px] hc-mono font-medium text-[var(--text-secondary)] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)]">
                    {country}
                  </span>
                </div>
                
                {/* Middle: Brand Logo Pedestal & Tagline */}
                <div className="my-auto py-3">
                  <div className="h-20 w-full rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)]/70 flex items-center justify-center p-3 group-hover:bg-white group-hover:border-[var(--color-wine)]/30 group-hover:shadow-xs transition-[border-color,background-color,box-shadow] duration-300">
                    {logoSrc ? (
                      <NormalizedLogo
                        src={logoSrc}
                        alt={`${displayName} Logo`}
                        aspect={brand.logoUrl ? brand.logoAspect : null}
                        className={`${meta.imageClass || ""}`}
                        style={meta.imageStyle}
                      />
                    ) : (
                      <span className="hc-serif text-3xl font-light text-[var(--color-wine)]">
                        {displayName}
                      </span>
                    )}
                  </div>
                  <h3 className="hc-serif text-2xl font-light text-[var(--text-primary)] mt-3 group-hover:text-[var(--color-wine)] transition-colors">
                    {displayName}
                  </h3>
                  <p className="text-[13.5px] text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2 font-light">
                    {tagline}
                  </p>
                </div>
                
                {/* Bottom Actions: View Catalog + Visit Brand Website */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[var(--border)]/70 gap-x-3 gap-y-2">
                  {catalogCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] whitespace-nowrap rounded-full bg-[var(--color-wine)] text-white text-xs hc-mono font-medium tracking-wider uppercase hover:bg-[var(--color-wine-deep)] shadow-xs transition duration-200"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{catalogCount > 1 ? `View ${catalogCount} Catalogues` : "View Catalogue"}</span>
                    </button>
                  )}

                  {websiteUrl ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 min-h-[40px] whitespace-nowrap px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-xs hc-mono font-medium text-[var(--text-primary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] uppercase tracking-wider transition-colors group/link"
                    >
                      <span>Website</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-brass-ink)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                    </a>
                  ) : (
                    <span className="text-[10px] hc-mono text-[var(--text-secondary)] uppercase tracking-wider">
                      Showroom Partner
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center border border-[var(--border)] p-10 md:p-16 rounded-none bg-[var(--surface-raised)]">
          <h3 className="font-display text-3xl sm:text-4xl text-[var(--text-primary)] mb-4 font-light">Need a Physical Copy?</h3>
          <p className="font-body text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed font-light">
            We maintain physical copies of all official catalogues in our Sakchi showroom for architects, designers, and contractors.
          </p>
          <a
            href={buildWhatsAppUrl("Hi Hardware Collection, I would like to request a physical catalogue.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[var(--accent)] text-[var(--surface)] px-9 py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors duration-300 hover:bg-[var(--accent-hover)]"
          >
            Request via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}





