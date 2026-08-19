"use client";

import { useState } from "react";
import { motion } from "motion/react";

/**
 * InteractiveBrandWall — Chapter 02 "Specified By"
 * Visual tension: LOW
 * Effect level: opacity + scale only. No pinning, no clip-path drama.
 *
 * Architecture:
 * - Brand names at typographic scale (7xl–9xl)
 * - Behind each name: faint product photograph at 8% opacity (always visible)
 * - On hover: active brand brightens, siblings dim to 15% opacity
 * - Active brand faint photo fades to 28% opacity
 * - Hover reveals: thumbnail + material label + "Explore [Brand] Collection →"
 *
 * This section is a visual discovery moment, not an animation demo.
 */

const BRANDS = [
  {
    name: "HÄFELE",
    tagline: "German engineering & precision hardware.",
    material: "Zinc · Aluminium · Steel",
    finish: "Chrome · Satin · Antique",
    img: "/cinema/brands/HC-02-HAFELE.png",
    href: "/collections?brand=hafele",
  },
  {
    name: "DORSET",
    tagline: "Architectural hardware solutions for considered spaces.",
    material: "Brass · Stainless Steel",
    finish: "Antique Brass · Satin Nickel · PVD",
    img: "/cinema/brands/HC-02-DORSET.png",
    href: "/collections?brand=dorset",
  },
  {
    name: "LABACHA",
    tagline: "Premium handle and knob collections.",
    material: "Solid Brass · Zinc Alloy",
    finish: "Gold · Matte Black · Chrome",
    img: "/cinema/brands/HC-02-LABACHA.png",
    href: "/collections?brand=labacha",
  },
  {
    name: "GODREJ",
    tagline: "Advanced digital and mechanical locks.",
    material: "Stainless Steel · ABS",
    finish: "Silver · Graphite · Gold",
    img: "/cinema/brands/HC-02-GODREJ.png",
    href: "/collections?brand=godrej",
  },
  {
    name: "HETTICH",
    tagline: "Intelligent furniture and kitchen systems.",
    material: "Steel · Aluminium",
    finish: "Galvanised · White · Silver",
    img: "/cinema/brands/HC-02-HETTICH.png",
    href: "/collections?brand=hettich",
  },
  {
    name: "KICH",
    tagline: "Architectural stainless steel hardware.",
    material: "304 & 316 Stainless Steel",
    finish: "Satin · Mirror · PVD Brass",
    img: "/cinema/brands/HC-02-KICH.png",
    href: "/collections?brand=kich",
  },
];

export default function InteractiveBrandWall() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      data-chapter="2"
      className="py-28 lg:py-36 bg-transparent relative overflow-hidden border-t border-zinc-900 z-10"
    >
      {/* Z=1: Background photo atmosphere — always present at low opacity */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {BRANDS.map((brand, i) => (
          <motion.img
            key={`bg-${i}`}
            src={brand.img}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{
              opacity: hoveredIndex === i ? 0.28 : hoveredIndex === null ? 0.05 : 0,
              scale: hoveredIndex === i ? 1 : 1.04,
            }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}
        {/* Dark overlay — always on top of photos */}
        <div className="absolute inset-0 bg-zinc-950/75" />
      </div>

      {/* Z=3: Brand list — editorial type layer */}
      <div
        className="container mx-auto px-6 lg:px-16 relative"
        style={{ zIndex: 3 }}
      >
        <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-4">
          CHAPTER 02
        </p>
        <p className="text-zinc-600 text-xs tracking-widest uppercase mb-16">
          AUTHORIZED PARTNERS
        </p>

        <div className="flex flex-col">
          {BRANDS.map((brand, i) => {
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && hoveredIndex !== i;

            return (
              <div
                key={i}
                className="group relative border-b border-zinc-900"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between py-7 lg:py-8">
                  {/* Brand name — the primary typographic element */}
                  <motion.h3
                    animate={{
                      color: isHovered
                        ? "#ffffff"
                        : isDimmed
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.35)",
                      x: isHovered ? 12 : 0,
                    }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-5xl lg:text-7xl xl:text-8xl font-light tracking-tight cursor-default leading-none"
                  >
                    {brand.name}
                  </motion.h3>

                  {/* Hover reveal: material info + CTA */}
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      x: isHovered ? 0 : 12,
                    }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`lg:max-w-xs mt-4 lg:mt-0 flex flex-col gap-3 ${!isHovered ? "pointer-events-none" : ""}`}
                    aria-hidden={!isHovered}
                  >
                    <p className="text-zinc-300 font-light text-sm leading-relaxed">
                      {brand.tagline}
                    </p>
                    <div className="text-zinc-500 text-xs space-y-0.5">
                      <p>Material: {brand.material}</p>
                      <p>Finish: {brand.finish}</p>
                    </div>
                    <a
                      href={brand.href}
                      tabIndex={isHovered ? 0 : -1}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200 w-fit mt-1"
                    >
                      Explore Collection
                      <span aria-hidden="true">→</span>
                    </a>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
