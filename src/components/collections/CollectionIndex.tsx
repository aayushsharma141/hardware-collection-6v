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
      className="py-16 md:py-24 border-t border-white/[0.08]"
    >
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-3 block">
            Complete Index
          </span>
          <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.02em] text-[#e8e3d9]">
            All Curated Collections
          </h2>
        </div>

        <div className="divide-y divide-white/[0.08]">
          {sortedCategories.map((category, i) => {
            const slug = getSlugString(category.slug);

            return (
              <Link
                key={category._id || category.id || slug}
                href={`/collections/${slug}`}
                className="index-row architecture-rule hc-focus group flex items-center justify-between py-5 md:py-6 transition-colors duration-150"
              >
                <div className="flex items-center min-w-0 pr-4">
                  <span className="hc-mono text-sm md:text-base text-[#c8a96e] mr-4 md:mr-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hc-serif text-xl sm:text-2xl md:text-3xl font-normal uppercase tracking-[0.02em] text-[#e8e3d9] group-hover:text-white transition-colors duration-150 truncate">
                    {category.name}
                  </span>
                </div>

                <div className="flex items-center shrink-0">
                  {category.itemCount && (
                    <span className="text-xs md:text-sm text-[#aaa49a] font-light hc-mono hidden sm:inline-block">
                      {category.itemCount}
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="text-[#c8a96e] ml-4 transition-transform duration-150 group-hover:translate-x-1"
                  >
                    →
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
