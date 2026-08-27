"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

const BRANDS = [
  { name: "HÄFELE", link: "/collections?brand=hafele" },
  { name: "DORSET", link: "/collections?brand=dorset" },
  { name: "LABACHA", link: "/collections?brand=labacha" },
  { name: "GODREJ", link: "/collections?brand=godrej" },
  { name: "HETTICH", link: "/collections?brand=hettich" },
  { name: "KICH", link: "/collections?brand=kich" },
];

export default function BrandStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section ref={containerRef} className="py-16 lg:py-24 bg-zinc-950 border-b border-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 mb-10 lg:mb-12">
        <p className="text-[#C8A96E] font-medium tracking-widest text-[11px] lg:text-sm uppercase">
          AUTHORIZED BY DESIGN
        </p>
      </div>

      {/* Mobile: editorial 2×3 grid — no pills, no borders, no rounded corners */}
      <div className="block lg:hidden container mx-auto px-6">
        <div className="flex flex-wrap">
          {BRANDS.map((brand, i) => (
            <a
              key={i}
              href={brand.link}
              style={{ width: "50%" }}
              className="group flex items-center justify-center py-6 text-zinc-400 tracking-[0.2em] text-[13px] uppercase font-light hover:text-white transition-colors duration-300"
            >
              {brand.name}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop: parallax ticker — unchanged */}
      <div className="hidden lg:flex w-full overflow-hidden whitespace-nowrap">
        <motion.div 
          style={{ x: shouldReduceMotion ? 0 : x }}
          className="flex gap-32 px-12 items-center"
        >
          {BRANDS.map((brand, i) => (
            <a 
              key={i} 
              href={brand.link}
              className="group relative inline-block text-5xl font-light text-zinc-600 hover:text-white transition-colors duration-500"
            >
              {brand.name}
              
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C8A96E] transition-all duration-500 group-hover:w-full" />
              
              <div className="absolute top-full left-0 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <span className="text-xs tracking-widest text-[#C8A96E] uppercase">Preview Collection</span>
              </div>
            </a>
          ))}
          
          {/* Duplicate for infinite feel */}
          {BRANDS.map((brand, i) => (
            <a 
              key={`dup-${i}`} 
              href={brand.link}
              className="group relative inline-block text-5xl font-light text-zinc-600 hover:text-white transition-colors duration-500"
            >
              {brand.name}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C8A96E] transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
