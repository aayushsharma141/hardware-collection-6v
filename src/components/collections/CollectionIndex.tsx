"use client";

import Link from "next/link";
import { Category, getSlugString } from "@/types/catalog";

export interface CollectionIndexProps {
  categories: Category[];
}

export default function CollectionIndex({ categories }: CollectionIndexProps) {
  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = typeof a.displayOrder === "number" ? a.displayOrder : 999;
    const orderB = typeof b.displayOrder === "number" ? b.displayOrder : 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.name || "").localeCompare(b.name || "");
  });

  return (
    <nav
      aria-label="Collection index"
      className="py-16 md:py-24 border-t border-[var(--border)]"
    >
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-4xl mb-14 md:mb-18">
          <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
            Complete Index
          </span>
          <h2 className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary)]">
            All Curated Collections
          </h2>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {sortedCategories.map((category, i) => {
            const slug = getSlugString(category.slug);

            return (
              <Link
                key={category._id || category.id || slug}
                href={`/collections/${slug}`}
                className="index-row architecture-rule hc-focus group flex items-center justify-between py-6 md:py-8 transition-colors duration-150"
              >
                <div className="flex items-center min-w-0 pr-6">
                  <span className="hc-mono text-base md:text-lg font-medium text-[#c8a96e] mr-5 md:mr-10 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hc-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.01em] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-150 truncate">
                    {category.name}
                  </span>
                </div>

                <div className="flex items-center shrink-0 gap-4">
                  {category.itemCount && (
                    <span className="text-sm md:text-base text-[var(--text-secondary)] font-light hc-mono hidden sm:inline-block">
                      {category.itemCount}
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="text-[#c8a96e] text-lg transition-transform duration-150 group-hover:translate-x-1.5"
                  >
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

