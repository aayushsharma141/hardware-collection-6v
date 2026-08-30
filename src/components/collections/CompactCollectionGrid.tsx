"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Category, getSlugString } from "@/types/catalog";

export interface CompactCollectionGridProps {
  categories: Category[];
  className?: string;
}

export default function CompactCollectionGrid({
  categories,
  className = "",
}: CompactCollectionGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {categories.map((category) => {
        const slug = getSlugString(category.slug);
        const imageUrl =
          category.heroImageUrl ||
          category.imageUrl ||
          "/cinema/categories/HC-03-DOORS.png";

        return (
          <Link
            key={category._id || category.id || slug}
            href={`/collections/${slug}`}
            className="threshold-card hc-focus group block rounded-lg bg-[#141314] border border-white/[0.08] p-4 transition-colors duration-150 hover:border-[#c8a96e]"
          >
            {/* Image Container — pinned to aspect-[4/3] (CLS gate) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-zinc-900 mb-4">
              <Image
                src={imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover ${
                  shouldReduceMotion
                    ? ""
                    : "transition-transform duration-[180ms] ease-out group-hover:scale-105"
                }`}
              />
            </div>

            {/* Content block */}
            <div className="flex flex-col">
              <h3 className="hc-serif text-lg sm:text-xl font-normal uppercase tracking-[0.02em] text-[#e8e3d9] mb-1.5">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-xs sm:text-sm text-[#aaa49a] font-light line-clamp-2 leading-relaxed mb-3">
                  {category.description}
                </p>
              )}

              <span className="text-xs uppercase tracking-widest text-[#c8a96e] inline-flex items-center gap-1.5 font-medium group-hover:text-white transition-colors duration-150 mt-auto pt-1">
                Explore {category.name}
                <span
                  aria-hidden="true"
                  className={
                    shouldReduceMotion
                      ? ""
                      : "transition-transform duration-[180ms] group-hover:translate-x-1"
                  }
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
