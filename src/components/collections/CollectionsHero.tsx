"use client";

import Link from "next/link";
import { buildGeneralInquiryWhatsappLink } from "@/lib/whatsapp";

export interface CollectionsHeroProps {
  collectionCount: number;
  brandCount: number;
  yearsClaimConfirmed?: boolean;
  whatsappNumber?: string;
}

export default function CollectionsHero({
  collectionCount,
  brandCount,
  yearsClaimConfirmed = false,
  whatsappNumber,
}: CollectionsHeroProps) {
  const whatsappUrl = buildGeneralInquiryWhatsappLink(whatsappNumber);

  const stats = [
    collectionCount > 0 ? `${collectionCount} COLLECTIONS` : null,
    brandCount > 0 ? `${brandCount} AUTHORIZED BRANDS` : null,
    yearsClaimConfirmed ? "20+ YEARS OF EXPERTISE" : null,
  ].filter(Boolean) as string[];

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/[0.08]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-3 block">
            ARCHITECTURAL HARDWARE · SAKCHI · JAMSHEDPUR
          </span>

          {/* Title */}
          <h1 className="hc-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.02em] text-[#e8e3d9] uppercase leading-tight mb-5">
            THE COLLECTION
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base md:text-lg text-[#aaa49a] font-light leading-relaxed mb-8 max-w-2xl">
            Explore Jamshedpur&apos;s finest curated collection of architectural hardware,
            precision locking systems, and luxury modular fittings for prestigious residential
            and commercial spaces.
          </p>

          {/* Named CTAs (D-20) — Exactly one filled brass button */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              href="#explore-collections"
              className="brass-plate hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-[#090909] rounded transition-transform duration-150 active:scale-95"
            >
              EXPLORE COLLECTIONS
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rail-button hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-[#e8e3d9] border border-white/[0.15] hover:border-[#c8a96e] rounded transition-colors duration-150"
            >
              ASK OUR HARDWARE EXPERT
            </a>
          </div>

          {/* Live Stat Row (Omit-on-zero) */}
          {stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.08]">
              {stats.map((stat, idx) => (
                <div key={stat} className="flex items-center gap-4">
                  <span className="hc-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#c8a96e]">
                    {stat}
                  </span>
                  {idx < stats.length - 1 && (
                    <span className="h-3 w-px bg-white/[0.15]" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
