"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useGSAP, gsap, ScrollTrigger, DURATION, EASE, prefersReducedMotion } from "@/lib/animations";
import { Space } from "@/types/catalog";
import { SpaceInfo } from "@/content/fallback/spaces";

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
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    ScrollTrigger.batch(".rail-card-reveal", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { opacity: 0, x: 30 },
          { 
            opacity: 1, 
            x: 0, 
            stagger: 0.1, 
            duration: DURATION.SLOW, 
            ease: EASE.LUXURY 
          }
        );
      },
      once: true,
    });
  }, { scope: sectionRef });

  const [isDragging, setIsDragging] = useState(false);
  
  const dragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false
  });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    dragState.current.isDown = true;
    dragState.current.dragged = false;
    setIsDragging(true);
    dragState.current.startX = e.pageX - scrollRef.current.offsetLeft;
    dragState.current.scrollLeft = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  const onMouseUp = () => {
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5; // Smooth drag speed
    
    if (Math.abs(walk) > 10) {
      dragState.current.dragged = true;
    }
    
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section ref={sectionRef} aria-labelledby="space-rail-heading" className="py-16 md:py-24">
      <div className="max-w-[1320px] mx-auto px-6 mb-10">
        <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-brass-ink mb-3 block">
          CURATED SPACES
        </span>
        <h2
          id="space-rail-heading"
          className="hc-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary)]"
        >
          Explore by Architectural Space
        </h2>
      </div>

      <div className="max-w-[1320px] mx-auto px-6">
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onClickCapture={onClickCapture}
          data-lenis-prevent
          role="list"
          aria-label="Explore by space"
          className={`flex gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 -my-2 select-none ${
            isDragging ? "snap-none cursor-grabbing" : "snap-x snap-mandatory cursor-grab"
          }`}
        >
          {spaces.map((space, index) => {
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
              "";

            return (
              <Link
                key={("_id" in space && (space as { _id?: string })._id) || slug}
                role="listitem"
                href={`/collections/${slug}`}
                draggable={false}
                className="rail-card-reveal snap-start shrink-0 w-[85vw] sm:w-[46vw] lg:w-[30vw] aspect-[3/4] relative rounded-2xl overflow-hidden group block threshold-card hc-focus border border-[var(--border)] shadow-sm opacity-0"
              >
                {/* Background Photography */}
                {heroImg ? (
                  <Image
                    src={heroImg}
                    alt={space.name}
                    fill
                    draggable={false}
                    // The first card is the page's largest paint.
                    priority={index === 0}
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 46vw, 30vw"
                    className={`object-cover pointer-events-none ${
                      shouldReduceMotion
                        ? ""
                        : "transition-transform duration-[180ms] ease-out group-hover:scale-105"
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] pointer-events-none">
                    <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending</span>
                  </div>
                )}

                {/* Mandated Scrim for Text Legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#090909]/95 via-[#090909]/45 to-transparent pointer-events-none"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end text-left pointer-events-none">
                  <h3 className="hc-serif text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-[0.01em] text-white mb-2.5">
                    {space.name}
                  </h3>

                  {space.description && (
                    <p className="text-sm sm:text-base text-[#e0dedc] font-light line-clamp-2 leading-relaxed mb-4">
                      {space.description}
                    </p>
                  )}

                  <span className="text-xs sm:text-sm uppercase tracking-widest text-[#c8a96e] inline-flex items-center gap-2 font-semibold group-hover:text-white transition-colors duration-150">
                    Explore {space.name}
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
      </div>
    </section>
  );
}


