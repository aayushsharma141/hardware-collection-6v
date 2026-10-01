"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Category, getSlugString } from "@/types/catalog";
import { categoryHref } from "@/lib/collections/routes";
import { useGSAP, gsap, ScrollTrigger, DURATION, EASE, prefersReducedMotion } from "@/lib/animations";

export interface CompactCollectionGridProps {
  categories: Category[];
  className?: string;
}

export default function CompactCollectionGrid({
  categories,
  className = "",
}: CompactCollectionGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Use ScrollTrigger.batch to stagger cards as they enter the viewport
    ScrollTrigger.batch(".grid-card-reveal", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1, 
            duration: DURATION.SLOW, 
            ease: EASE.LUXURY 
          }
        );
      },
      once: true,
    });
  }, { scope: gridRef });

  return (
    <div
      ref={gridRef}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {categories.map((category) => {
        const slug = getSlugString(category.slug);
        const imageUrl =
          category.imageUrl ||
          "";

        return (
          <Link
            key={category._id || category.id || slug}
            href={categoryHref(category)}
            className="grid-card-reveal threshold-card hc-focus group block rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] p-5 md:p-6 transition-colors duration-150 hover:border-[var(--accent)] shadow-sm opacity-0"
          >
            {/* Image Container — pinned to aspect-[4/3] (CLS gate) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--surface-raised)] mb-5">
              {imageUrl ? (
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
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] pointer-events-none">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending</span>
                </div>
              )}
            </div>

            {/* Content block */}
            <div className="flex flex-col">
              <h3 className="hc-serif text-xl sm:text-2xl font-normal uppercase tracking-[0.01em] text-[var(--text-primary)] mb-2">
                {category.name}
              </h3>

              {category.description && (
                <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light line-clamp-2 leading-relaxed mb-4">
                  {category.description}
                </p>
              )}

              <span className="text-xs sm:text-sm uppercase tracking-widest text-brass-ink inline-flex items-center gap-2 font-semibold group-hover:text-[var(--text-primary)] transition-colors duration-150 mt-auto pt-1">
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
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}



