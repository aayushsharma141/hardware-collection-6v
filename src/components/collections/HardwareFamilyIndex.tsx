"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { Category, getSlugString } from "@/types/catalog";
import { SHOWROOM_FAMILIES } from "@/content/fallback/catalog";

export interface HardwareFamilyIndexProps {
  categories: Category[];
}

/**
 * HardwareFamilyIndex — the "Explore by Hardware" entry point.
 *
 * The showroom board in Sakchi groups everything under five families, and the
 * CMS has carried a `families` field all along, but nothing rendered it: the
 * page listed every category flat, three times over, under catalogue-voiced
 * headings. This is the one section that presents the taxonomy the way the
 * physical showroom does.
 *
 * Grouping, not filtering (D-18): a visitor reads five families and picks one.
 * There is no control here that narrows a result set.
 */
export default function HardwareFamilyIndex({ categories }: HardwareFamilyIndexProps) {
  const shouldReduceMotion = useReducedMotion();

  const groups = useMemo(() => {
    const byFamily = new Map<string, Category[]>();

    for (const category of categories) {
      // `familySlugs` is the normalised name across both content sources.
      // `primaryRail` is the older single-value field and still the only
      // signal on categories that predate the families rollout.
      const keys = category.familySlugs?.length
        ? category.familySlugs
        : category.primaryRail
          ? [category.primaryRail]
          : [];

      for (const key of keys) {
        byFamily.set(key, [...(byFamily.get(key) ?? []), category]);
      }
    }

    return SHOWROOM_FAMILIES.map((family) => {
      const members = (byFamily.get(family.id) ?? []).sort((a, b) => {
        const orderA = typeof a.displayOrder === "number" ? a.displayOrder : 999;
        const orderB = typeof b.displayOrder === "number" ? b.displayOrder : 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || "").localeCompare(b.name || "");
      });
      return { family, members };
    }).filter((group) => group.members.length > 0);
  }, [categories]);

  if (groups.length === 0) return null;

  return (
    <nav
      aria-labelledby="hardware-family-index-heading"
      className="py-16 md:py-24 border-t border-[var(--border)]"
    >
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-3xl mb-14 md:mb-18">
          <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
            Or explore by hardware
          </span>
          <h2
            id="hardware-family-index-heading"
            className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary)]"
          >
            Five families, as they sit on the showroom wall.
          </h2>
        </div>

        <ol className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {groups.map(({ family, members }, i) => (
            <li key={family.id} className="py-8 md:py-12">
              <div className="flex flex-col lg:flex-row lg:gap-16">
                {/* Family marker */}
                <div className="lg:w-[38%] lg:shrink-0 mb-5 lg:mb-0">
                  <div className="flex items-baseline gap-5 md:gap-8">
                    <span className="hc-mono text-base md:text-lg font-medium text-[#c8a96e] shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="hc-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.01em] text-[var(--text-primary)]">
                      {family.name}
                    </h3>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base font-light leading-relaxed mt-3 lg:ml-[calc(1rem+1.25rem)] max-w-md">
                    {family.tagline}
                  </p>
                </div>

                {/* Member collections — each one a real route */}
                <ul className="flex flex-wrap gap-x-2 gap-y-1 lg:flex-1 lg:content-start">
                  {members.map((category) => {
                    const slug = getSlugString(category.slug);
                    return (
                      <li key={category._id || category.id || slug}>
                        <Link
                          href={`/collections/${slug}`}
                          className={`hc-focus inline-flex min-h-[44px] items-center rounded-sm px-3 py-2 text-sm md:text-base font-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] ${
                            shouldReduceMotion ? "" : "transition-colors duration-150"
                          }`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
