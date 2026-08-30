"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Space } from "@/types/catalog";
import { SpaceInfo } from "@/data/spaces";

export interface SpaceIntentRailProps {
  spaces: Array<Space | SpaceInfo>;
}

const SPACE_FALLBACK_IMAGES: Record<string, string> = {
  kitchen: "/cinema/categories/HC-03-KITCHEN.png",
  bathroom: "/cinema/categories/HC-03-BATHROOM.png",
  wardrobe: "/cinema/categories/HC-03-WARDROBE.png",
  entrance: "/cinema/categories/HC-03-SECURITY.png",
  commercial: "/cinema/categories/HC-03-GLASS.png",
  "living-interior": "/cinema/categories/HC-03-DOORS.png",
};

export default function SpaceIntentRail({ spaces }: SpaceIntentRailProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="space-rail-heading" className="py-12 md:py-16">
      <div className="max-w-[1320px] mx-auto px-6 mb-8">
        <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#c8a96e] mb-2 block">
          CURATED SPACES
        </span>
        <h2
          id="space-rail-heading"
          className="hc-serif text-3xl sm:text-4xl font-normal tracking-[0.02em] text-[#e8e3d9]"
        >
          Explore by Architectural Space
        </h2>
      </div>

      <div className="max-w-[1320px] mx-auto px-6">
        <div
          data-lenis-prevent
          role="list"
          aria-label="Explore by space"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 -my-2"
        >
          {spaces.map((space) => {
            const slug =
              typeof space.slug === "string"
                ? space.slug
                : (space.slug as { current?: string })?.current || "";

            const heroImg: string =
              ("heroImageUrl" in space &&
              typeof space.heroImageUrl === "string" &&
              space.heroImageUrl
                ? space.heroImageUrl
                : null) ||
              SPACE_FALLBACK_IMAGES[slug] ||
              "/cinema/categories/HC-03-DOORS.png";

            return (
              <Link
                key={(" _id" in space && (space as { _id?: string })._id) || slug}
                role="listitem"
                href={`/collections/${slug}`}
                className="snap-start shrink-0 w-[82vw] sm:w-[46vw] lg:w-[30vw] aspect-[3/4] relative rounded-xl overflow-hidden group block threshold-card hc-focus border border-white/[0.08]"
              >
                {/* Background Photography */}
                <Image
                  src={heroImg}
                  alt={space.name}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 30vw"
                  className={`object-cover ${
                    shouldReduceMotion
                      ? ""
                      : "transition-transform duration-[180ms] ease-out group-hover:scale-105"
                  }`}
                />

                {/* Mandated Scrim for Text Legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/40 to-transparent pointer-events-none"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                  <h3 className="hc-serif text-2xl sm:text-3xl font-normal uppercase tracking-[0.02em] text-[#e8e3d9] mb-2">
                    {space.name}
                  </h3>

                  {space.description && (
                    <p className="text-xs sm:text-sm text-[#aaa49a] font-light line-clamp-2 leading-relaxed mb-4">
                      {space.description}
                    </p>
                  )}

                  <span className="text-xs uppercase tracking-widest text-[#c8a96e] inline-flex items-center gap-1.5 font-medium group-hover:text-white transition-colors duration-150">
                    Explore {space.name}
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
      </div>
    </section>
  );
}
