"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedItem {
  category: string;
  subtitle: string;
  image: string;
  href: string;
}

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    category: "DOOR HARDWARE",
    subtitle: "Precision, security and elegance for modern living.",
    image: "/cinema/categories/HC-03-DOORS.png",
    href: "/collections#door",
  },
  {
    category: "MODULAR KITCHEN",
    subtitle: "German-engineered lift systems and soft-close channels.",
    image: "/cinema/categories/HC-03-KITCHEN.png",
    href: "/collections#kitchen",
  },
  {
    category: "DIGITAL ACCESS",
    subtitle: "Biometric and smart locks for architectural entrances.",
    image: "/cinema/categories/HC-03-SECURITY.png",
    href: "/collections#smart-security",
  },
  {
    category: "WARDROBE SYSTEMS",
    subtitle: "Precision sliding systems and knurled architectural handles.",
    image: "/cinema/categories/HC-03-WARDROBE.png",
    href: "/collections#wardrobe-furniture",
  },
];

export default function ProductReelMobile(_props?: { products?: unknown }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_ITEMS.length) % FEATURED_ITEMS.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_ITEMS.length);
  };

  const current = FEATURED_ITEMS[currentIndex];

  return (
    <section className="w-full px-5 py-10 bg-[var(--surface)] border-b border-[var(--border)] lg:hidden">
      {/* Header Info */}
      <div className="mb-6">
        <p className="hc-mono text-[10.5px] uppercase tracking-[0.25em] font-semibold text-[var(--color-wine)] mb-1.5">
          Featured
        </p>
        <h2 className="hc-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] leading-tight tracking-tight mb-2.5">
          Hardware that
          <br />
          completes the space.
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-[36ch] mb-5">
          From doors to kitchens, every detail matters. Explore our handpicked selection of premium hardware, designed for function, durability and style.
        </p>
        <Link
          href="/collections"
          className="px-5 py-3.5 bg-[#1a1017] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 rounded-none hover:bg-[#3d2e38] transition-colors"
        >
          <span>Explore Featured Pieces</span>
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Featured Showcase Card with Overlay & Arrows */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--border)] bg-neutral-900 mt-6">
        <Image
          key={`feat-${currentIndex}`}
          src={current.image}
          alt={current.category}
          fill
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover transition-opacity duration-500"
        />

        {/* Bottom Dark Scrim Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-5 flex items-end justify-between gap-3">
          <div>
            <p className="hc-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--color-brass)] mb-0.5">
              {current.category}
            </p>
            <p className="text-xs text-white/90 font-light leading-snug line-clamp-2">
              {current.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous featured"
              className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next featured"
              className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
