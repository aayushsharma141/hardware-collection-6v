"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Category, getSlugString } from "@/types/catalog";
import { selectFeaturedCategories } from "@/lib/collections/tiers";

export interface FeaturedChaptersProps {
  categories: Category[];
}

export default function FeaturedChapters({ categories }: FeaturedChaptersProps) {
  const shouldReduceMotion = useReducedMotion();

  const featured = selectFeaturedCategories(
    categories.map((c) => ({
      ...c,
      slug: getSlugString(c.slug),
    }))
  );

  if (featured.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-chapters-heading" className="py-16 md:py-24">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-4xl mb-14 md:mb-20">
          <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
            CURATED SPOTLIGHT
          </span>
          <h2
            id="featured-chapters-heading"
            className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary)]"
          >
            Featured Chapters
          </h2>
        </div>

        <div className="space-y-16 md:space-y-24">
          {featured.map((category, index) => {
            const slug = getSlugString(category.slug);
            const isPatternA = index % 2 === 0;
            const chapterOrdinal = `CHAPTER ${String(index + 1).padStart(2, "0")}`;
            const imageUrl =
              category.heroImageUrl ||
              category.imageUrl ||
              "/cinema/categories/HC-03-DOORS.png";

            const brandLine =
              category.brandRefs && category.brandRefs.length > 0
                ? category.brandRefs.join(" · ")
                : null;

            if (isPatternA) {
              // ── Pattern A: Full-Bleed Overlay Chapter ──
              return (
                <div
                  key={category._id || category.id || slug}
                  className="threshold-card hc-focus relative w-full aspect-[16/9] min-h-[460px] md:min-h-[540px] rounded-3xl overflow-hidden group border border-[var(--border)] shadow-md"
                >
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1320px"
                    className={`object-cover ${
                      shouldReduceMotion
                        ? ""
                        : "transition-transform duration-[180ms] ease-out group-hover:scale-105"
                    }`}
                  />

                  {/* Mandatory Gradient Scrim for Legibility */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#090909]/95 via-[#090909]/60 to-[#090909]/20 pointer-events-none"
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-8 md:p-14 lg:p-16 flex flex-col justify-end text-left max-w-4xl">
                    <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
                      {chapterOrdinal}
                    </span>
                    <h3 className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-[0.01em] text-white mb-4 leading-tight">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-base sm:text-lg md:text-xl text-[#e0dedc] font-light leading-relaxed mb-4 max-w-2xl">
                        {category.description}
                      </p>
                    )}
                    {brandLine && (
                      <p className="text-xs sm:text-sm text-[#c8a96e]/90 tracking-wider uppercase hc-mono mb-6">
                        {brandLine}
                      </p>
                    )}
                    <Link
                      href={`/collections/${slug}`}
                      className="text-xs sm:text-sm uppercase tracking-widest text-[#c8a96e] inline-flex items-center gap-2.5 font-semibold hover:text-white transition-colors duration-150 w-fit"
                    >
                      Explore {category.name}
                      <span
                        aria-hidden="true"
                        className={
                          shouldReduceMotion
                            ? ""
                            : "transition-transform duration-[180ms] group-hover:translate-x-1"
                        }
                      >
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              );
            }

            // ── Pattern B: Split-Frame on Obsidian ──
            return (
              <div
                key={category._id || category.id || slug}
                className="threshold-card hc-focus grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--surface-raised)] rounded-3xl border border-[var(--border)] p-8 md:p-14 group shadow-sm"
              >
                {/* Text Column */}
                <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
                  <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
                    {chapterOrdinal}
                  </span>
                  <h3 className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-normal uppercase tracking-[0.01em] text-[var(--text-primary)] mb-4 leading-tight">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-light leading-relaxed mb-4 max-w-xl">
                      {category.description}
                    </p>
                  )}
                  {brandLine && (
                    <p className="text-xs sm:text-sm text-[#c8a96e]/90 tracking-wider uppercase hc-mono mb-6">
                      {brandLine}
                    </p>
                  )}
                  <Link
                    href={`/collections/${slug}`}
                    className="text-xs sm:text-sm uppercase tracking-widest text-[#c8a96e] inline-flex items-center gap-2.5 font-semibold hover:text-[var(--text-primary)] transition-colors duration-150 w-fit"
                  >
                    Explore {category.name}
                    <span
                      aria-hidden="true"
                      className={
                        shouldReduceMotion
                          ? ""
                          : "transition-transform duration-[180ms] group-hover:translate-x-1"
                      }
                    >
                      &rarr;
                    </span>
                  </Link>
                </div>

                {/* Image Column — pinned to aspect-[4/5] (CLS gate) */}
                <div className="lg:col-span-5 relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--surface-raised)] order-1 lg:order-2">
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className={`object-cover ${
                      shouldReduceMotion
                        ? ""
                        : "transition-transform duration-[180ms] ease-out group-hover:scale-105"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



