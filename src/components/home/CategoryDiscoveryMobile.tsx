"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type FeaturedCategory } from "./families";

interface CategoryDiscoveryMobileProps {
  categories?: FeaturedCategory[];
  populatedGroupIds?: string[];
}

interface CuratedSpace {
  name: string;
  subtitle: string;
  href: string;
  image: string;
}

const CURATED_SPACES: CuratedSpace[] = [
  {
    name: "Doors",
    subtitle: "Handles · Locks · Closers",
    href: "/collections#door",
    image: "/cinema/hero/HC-01-HERO-01.png",
  },
  {
    name: "Smart Security",
    subtitle: "Digital Locks · Safes",
    href: "/collections#smart-security",
    image: "/cinema/categories/HC-03-SECURITY.png",
  },
  {
    name: "Kitchen",
    subtitle: "Fittings · Sinks · Faucets",
    href: "/collections#kitchen",
    image: "/cinema/categories/HC-03-KITCHEN.png",
  },
  {
    name: "Wardrobe",
    subtitle: "Handles · Sliding · Systems",
    href: "/collections#wardrobe-furniture",
    image: "/cinema/categories/HC-03-WARDROBE.png",
  },
  {
    name: "Bathroom",
    subtitle: "Accessories · Fittings",
    href: "/collections#bathroom-hardware",
    image: "/cinema/categories/HC-03-BATHROOM.png",
  },
  {
    name: "Glass",
    subtitle: "Shower · Partitions",
    href: "/collections#glass",
    image: "/cinema/categories/HC-03-GLASS.png",
  },
  {
    name: "Furniture",
    subtitle: "Handles · Hinges · Drawers",
    href: "/collections#furniture-fittings",
    image: "/cinema/categories/HC-03-FURNITURE.png",
  },
];

export default function CategoryDiscoveryMobile(_props?: CategoryDiscoveryMobileProps) {
  const spaces = CURATED_SPACES;

  return (
    <section className="w-full px-5 py-10 bg-[var(--surface)] border-b border-[var(--border)] lg:hidden">
      {/* Header matching Reference Mockup */}
      <div className="flex flex-col mb-6">
        <p className="hc-mono text-[10.5px] uppercase tracking-[0.24em] font-semibold text-[var(--color-wine)] mb-1.5">
          Collections
        </p>
        <h2 className="hc-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] leading-tight tracking-tight">
          What are you working on?
        </h2>
        <div className="flex items-end justify-between gap-3 mt-2">
          <p className="text-xs text-[var(--text-secondary)] font-light max-w-[32ch] leading-relaxed">
            Explore by space and find the right hardware for your home or project.
          </p>
          <Link
            href="/collections"
            className="shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-wine)] inline-flex items-center gap-1 hover:underline pb-0.5"
          >
            <span>View All</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 2-Column Responsive Card Grid matching Reference Mockup */}
      <div className="grid grid-cols-2 gap-3">
        {spaces.map((space, idx) => {
          const isLastOdd = idx === spaces.length - 1 && spaces.length % 2 !== 0;

          return (
            <Link
              key={space.name}
              href={space.href}
              className={`group block bg-[var(--surface-raised)] border border-[var(--border)] overflow-hidden transition-all duration-300 active:scale-[0.98] ${
                isLastOdd ? "col-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden bg-neutral-900 ${isLastOdd ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
                <Image
                  src={space.image}
                  alt={`${space.name} architectural hardware`}
                  fill
                  sizes={isLastOdd ? "(max-width: 768px) 100vw, 480px" : "(max-width: 768px) 50vw, 240px"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3 bg-[var(--surface)] flex items-center justify-between border-t border-[var(--border)]/70">
                <div className="min-w-0 pr-1">
                  <h3 className="hc-serif text-base sm:text-lg font-normal text-[var(--text-primary)] leading-tight truncate">
                    {space.name}
                  </h3>
                  <p className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.1em] text-[var(--text-secondary)] truncate mt-0.5 font-light">
                    {space.subtitle}
                  </p>
                </div>
                <svg
                  className="w-3.5 h-3.5 text-[var(--color-wine)] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
