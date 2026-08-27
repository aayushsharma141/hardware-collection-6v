import React from "react";
import Image from "next/image";
import { HeroSlide } from "@/types/hero";

interface MobileHeroProps {
  slides: HeroSlide[];
}

export default function MobileHero({ slides }: MobileHeroProps) {
  if (!slides || slides.length === 0) return null;
  const slide = slides[0];

  return (
    <section className="relative w-full min-h-[92svh] flex flex-col justify-between pt-16 pb-8 px-6 lg:hidden overflow-hidden bg-[#090909]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
          alt="Mobile hero showroom texture"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.56]"
        />
        <div className="absolute inset-0 bg-[#090909]/[0.45]"></div>
      </div>

      {/* Hero Accent Sidebar Graphic */}
      <div className="absolute top-0 right-0 h-full w-[42%] border-l border-[#c8a96e]/[0.4] bg-[#090909]/[0.85] z-[1]" />
      
      {/* Accent Specimen Image */}
      <div className="absolute top-[80px] right-[-10px] h-[280px] w-[180px] z-[2] pointer-events-none">
        <Image
          src={slide.productUrl || "/cinema/hero/HC-01-HERO-03.png"}
          alt="Mobile hero close detail of a brass finish"
          fill
          sizes="180px"
          className="object-contain opacity-[0.8] mix-blend-screen"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full mt-auto pt-24 text-left flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-1 w-1 bg-[#c8a96e]"></span>
          <span className="hc-mono text-[9px] uppercase tracking-[0.2em] text-[#c8a96e]">
            Sakchi · Jamshedpur
          </span>
        </div>
        
        <h1 className="hc-serif text-[44px] sm:text-[52px] leading-[0.88] font-normal tracking-[0.02em] text-[#e8e3d9] mb-4">
          The Art of<br />the Finish.
        </h1>
        
        <p className="max-w-[260px] text-[13px] leading-[1.55] font-light text-[#d1ccc4] mb-6">
          Architectural hardware chosen for spaces that deserve better details.
        </p>

        <div className="flex flex-col gap-3">
          <a 
            href="#collection"
            className="brass-plate h-[48px] w-full bg-[#c8a96e] text-[#090909] text-[11px] font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-3 no-underline shadow-sm hover:brightness-105 transition-all"
          >
            <span>Explore collections</span>
            <svg className="w-4 h-4 text-[#090909]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>

          <a 
            href="#directions"
            className="rail-button h-[38px] text-[10px] uppercase tracking-[0.16em] text-[#e8e3d9] flex items-center gap-2 no-underline"
          >
            <span>Get showroom directions</span>
            <svg className="w-3.5 h-3.5 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
