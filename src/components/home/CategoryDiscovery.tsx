"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * CategoryDiscovery — Chapter 03 "Form & Function"
 * Visual tension: MEDIUM
 * Effects: Horizontal GSAP scroll (desktop), parallax, diagonal clip-path exit.
 * No Material Lens, no pinned macro, no pointer light.
 *
 * Each category panel answers: What is it? → Specimen → Material → Application → Explore →
 */

const CATEGORIES = [
  {
    index: "01",
    name: "HANDLES & KNOBS",
    sub: "Modern, Classical, Luxury, Italian, Wooden, Ceramic, Profile & Flush",
    application: "Main Entrance · Bespoke Joinery · Luxury Wardrobes",
    specimen: "Solid forged brass pull handle, PVD Rose Gold",
    img: "/cinema/categories/HC-03-DOORS.png",
    href: "/collections?category=handles-knobs",
    accent: "#C8A96E",
    status: "ready",
  },
  {
    index: "02",
    name: "DOOR HARDWARE",
    sub: "Digital Locks, Mortise Locksets, Door Closers, Glass Patch Fittings",
    application: "Residential · Commercial · Luxury Hospitality",
    specimen: "Dorset biometric deadbolt & SS 304 mortise lockset",
    img: "/cinema/categories/HC-03-SECURITY.png",
    href: "/collections?category=door-hardware",
    accent: "#C8A96E",
    status: "ready",
  },
  {
    index: "03",
    name: "BATHROOM",
    sub: "Thermostatic Showers, Mirrors, Mirror Cabinets, SS 304 Accessories",
    application: "Master Suites · Luxury Residences · Spas",
    specimen: "Solid brass thermostatic shower suite, Matte Black",
    img: "/cinema/categories/HC-03-BATHROOM.png",
    href: "/collections?category=bathroom",
    accent: "#999",
    status: "ready",
  },
  {
    index: "04",
    name: "KITCHEN & WARDROBES",
    sub: "Modular Hardware, Sinks, Faucets, Wardrobe Sliding Systems, Safes",
    application: "Modular Kitchens · Walk-In Closets · Living Joinery",
    specimen: "Hafele Matrix Box tandem drawer & Labacha quartz sink",
    img: "/cinema/categories/HC-03-KITCHEN.png",
    href: "/collections?category=kitchen-wardrobes",
    accent: "#C8A96E",
    status: "ready",
  },
  {
    index: "05",
    name: "FURNITURE HARDWARE",
    sub: "Concealed 3D Hinges, Heavy-Duty Drawer Runners, Bed & Table Fittings",
    application: "Fine Cabinetry · Architectural Joinery · Office Systems",
    specimen: "Hettich Sensys integrated soft-close hinge system",
    img: "/cinema/categories/HC-03-WARDROBE.png",
    href: "/collections?category=furniture-hardware",
    accent: "#aaa",
    status: "ready",
  },
];

export default function CategoryDiscovery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const showStatus = process.env.NEXT_PUBLIC_SHOW_ASSET_STATUS === "true";
  const displayCategories = showStatus ? CATEGORIES : CATEGORIES.filter(c => c.status === "ready");

  useGSAP(
    () => {
      if (shouldReduceMotion || !containerRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".cat-panel");
        if (!panels.length) return;

        // Accurate xPercent: translates by (N-1)/N of track width so last panel rests exactly at 100%
        const totalPanels = panels.length;
        const targetPercent = -((100 * (totalPanels - 1)) / totalPanels);

        const hScroll = gsap.to(trackRef.current, {
          xPercent: targetPercent,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${(totalPanels - 1) * window.innerHeight * 0.75}`,
            invalidateOnRefresh: true,
          },
        });

        // Per-panel image parallax — images move slightly slower than the panel
        panels.forEach((panel) => {
          const img = panel.querySelector<HTMLImageElement>(".cat-img");
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: hScroll,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });

    },
    { scope: containerRef, dependencies: [shouldReduceMotion] }
  );

  // Mobile / reduced-motion: editorial card stack
  const mobileFallback = (
    <section
      data-chapter="3"
      className="py-24 bg-transparent border-t border-zinc-900"
    >
      <div className="container mx-auto px-6">
        <ChapterLabel />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {displayCategories.map((cat, i) => (
            <a
              key={i}
              href={cat.href}
              className="group block relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors duration-300"
            >
              <div className="h-56 overflow-hidden bg-zinc-950 flex items-center justify-center relative">
                {cat.status === "ready" ? (
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase mb-1">Visual Asset</span>
                    <span className="text-xs tracking-widest text-zinc-600 uppercase border border-zinc-800 px-3 py-1">In Production</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-zinc-600 text-xs tracking-widest uppercase mb-1">{cat.index}</p>
                <h3 className="text-2xl font-light text-white mb-1">{cat.name}</h3>
                <p className="text-zinc-400 text-sm mb-3">{cat.sub}</p>
                <p className="text-zinc-600 text-xs">{cat.application}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );

  if (shouldReduceMotion) return mobileFallback;

  return (
    <>
      {/* Mobile layout */}
      <div className="block lg:hidden">{mobileFallback}</div>

      {/* Desktop horizontal cinema */}
      <div
        ref={containerRef}
        data-chapter="3"
        className="hidden lg:block relative overflow-hidden border-t border-zinc-900"
        style={{ height: "100vh" }}
      >
        {/* Label — absolute, outside the scrolling track */}
        <div className="absolute top-8 left-16 z-20 pointer-events-none">
          <ChapterLabel />
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${displayCategories.length * 100}vw` }}
        >
          {displayCategories.map((cat, i) => (
            <div
              key={i}
              className="cat-panel w-screen h-full flex items-end pb-20 px-16 shrink-0 relative overflow-hidden"
            >
              {/* Z=1: Background image */}
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                {cat.status === "ready" ? (
                  <img
                    src={cat.img}
                    alt=""
                    aria-hidden="true"
                    className="cat-img w-full h-full object-cover opacity-45 will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0A0A0C] flex flex-col items-center justify-center">
                    <div className="opacity-20 flex flex-col items-center gap-2">
                      <span className="text-xs tracking-widest text-zinc-500 uppercase">Visual Asset</span>
                      <span className="text-sm tracking-widest text-zinc-600 uppercase border border-zinc-800 px-6 py-2">In Production</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/50 to-zinc-950/20" />
                {/* Diagonal clip-path separator on right edge */}
                {i < displayCategories.length - 1 && (
                  <div
                    className="absolute top-0 right-0 w-24 h-full bg-zinc-950/80 pointer-events-none"
                    style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }}
                  />
                )}
              </div>

              {/* Z=3: Typography */}
              <div className="relative max-w-lg" style={{ zIndex: 3 }}>
                <p className="text-zinc-600 text-xs tracking-widest uppercase mb-2">
                  {cat.index} / {displayCategories.length.toString().padStart(2, "0")}
                </p>
                <h2 className="text-6xl xl:text-7xl font-light text-white leading-none mb-3">
                  {cat.name}
                </h2>
                <p className="text-zinc-400 font-light mb-2 text-lg">{cat.sub}</p>
                <p className="text-zinc-600 text-sm mb-1">Application: {cat.application}</p>
                <p className="text-zinc-600 text-xs mb-8 italic">{cat.specimen}</p>
                <a
                  href={cat.href}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200"
                >
                  Explore Category <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-12 z-20 opacity-30 flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-white uppercase">scroll</span>
          <span className="text-white text-lg">→</span>
        </div>
      </div>
    </>
  );
}

function ChapterLabel() {
  return (
    <>
      <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-1">
        CHAPTER 03
      </p>
      <p className="text-zinc-600 text-xs tracking-widest uppercase">
        FORM & FUNCTION
      </p>
    </>
  );
}
