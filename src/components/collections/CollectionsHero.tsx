"use client";

import Link from "next/link";
import Image from "next/image";
import { buildGeneralInquiryWhatsappLink } from "@/lib/integrations/whatsapp";

export interface CollectionsHeroProps {
  collectionCount: number;
  brandCount?: number;
  yearsClaimConfirmed?: boolean;
  whatsappNumber?: string;
}

// A real photograph of the showroom wall, not a render.
const SHOWROOM_WALL = "/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg";

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
      {/* lg+: copy left, real showroom photography right. Below lg the photo is
          dropped so the mobile hero stays one screen of text and CTAs. */}
      <div className="max-w-[1320px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center">
        <div className="max-w-4xl lg:col-span-7">
          {/* Eyebrow */}
          <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-brass-ink mb-4 block">
            ARCHITECTURAL HARDWARE · SAKCHI · JAMSHEDPUR
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
                  <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium text-brass-ink">
                    {stat}
                  </span>
                  {idx < stats.length - 1 && (
                    <span className="h-3.5 w-px bg-[var(--text-secondary)]/25" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <figure className="hidden lg:block lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded border border-[var(--border)] bg-[var(--surface-raised)] shadow-[0_24px_60px_rgba(26,16,23,0.10)]">
            <Image
              src={SHOWROOM_WALL}
              alt="Cabinet handles and pulls in brass, matte black and ivory finishes on the Hardware Collection showroom wall in Sakchi"
              fill
              priority
              sizes="(min-width: 1320px) 500px, 40vw"
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(1.03)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 via-35% to-transparent" aria-hidden="true" />
            <figcaption className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4 text-white">
              <span>
                <span className="hc-mono block text-[10px] uppercase tracking-[0.22em] text-white/75">On display</span>
                <span className="hc-serif block text-2xl leading-tight">The Sakchi showroom</span>
              </span>
              <Link
                href="/#showroom"
                className="hc-focus shrink-0 rounded border border-white/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-white hover:text-[#1a1017] transition-colors"
              >
                Visit
              </Link>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}


