"use client";

import Link from "next/link";
import { buildGeneralInquiryWhatsappLink } from "@/lib/whatsapp";

export interface CollectionsHeroProps {
  collectionCount: number;
  brandCount?: number;
  yearsClaimConfirmed?: boolean;
  whatsappNumber?: string;
}

export default function CollectionsHero({
  collectionCount,
  brandCount: _brandCount,
  yearsClaimConfirmed = false,
  whatsappNumber,
}: CollectionsHeroProps) {
  const whatsappUrl = buildGeneralInquiryWhatsappLink(whatsappNumber);

  const stats = [
    collectionCount > 0 ? `${collectionCount} COLLECTIONS` : null,
    "AUTHORIZED GLOBAL BRANDS",
    yearsClaimConfirmed ? "10+ YEARS OF EXPERTISE" : null,
  ].filter(Boolean) as string[];

  return (
    <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 border-b border-[var(--border)]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-4 block">
            ARCHITECTURAL HARDWARE &middot; SAKCHI &middot; JAMSHEDPUR
          </span>

          {/* Title */}
          <h1 className="hc-serif text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-light tracking-[-0.01em] text-[var(--text-primary)] uppercase leading-[0.95] mb-6">
            THE COLLECTION
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed mb-10 max-w-3xl">
            Explore Jamshedpur&apos;s finest curated collection of architectural hardware,
            precision locking systems, and luxury modular fittings for prestigious residential
            and commercial spaces.
          </p>

          {/* Named CTAs — Exactly one filled brass button */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-12">
            <Link
              href="#explore-collections"
              className="brass-plate hc-focus inline-flex items-center justify-center px-8 py-4 text-xs sm:text-sm tracking-widest uppercase font-semibold text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
            >
              EXPLORE COLLECTIONS
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rail-button hc-focus inline-flex items-center justify-center px-8 py-4 text-xs sm:text-sm tracking-widest uppercase font-semibold text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent)] rounded transition-colors duration-150"
            >
              ASK OUR HARDWARE EXPERT
            </a>
          </div>

          {/* Live Stat Row (Omit-on-zero) */}
          {stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[var(--border)]">
              {stats.map((stat, idx) => (
                <div key={stat} className="flex items-center gap-6">
                  <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium text-[#c8a96e]">
                    {stat}
                  </span>
                  {idx < stats.length - 1 && (
                    <span className="h-3.5 w-px bg-white/[0.20]" aria-hidden="true" />
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


