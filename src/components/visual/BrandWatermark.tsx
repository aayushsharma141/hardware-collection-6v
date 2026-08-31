"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function BrandWatermark() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return;

    let rafId: number;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = elapsed * 0.00002; // Very slow
      
      // Extremely subtle 15px horizontal drift over a long period using sine wave
      if (containerRef.current) {
        const xOffset = Math.sin(progress) * 15;
        containerRef.current.style.transform = `translateX(${xOffset}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceMotion]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center select-none"
      aria-hidden="true"
    >
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center will-change-transform"
      >
        {/* Desktop: Single line, bleeding off edges */}
        <h2 
          className="hidden md:block text-[14vw] lg:text-[12vw] font-cormorant leading-none tracking-[0.02em] whitespace-nowrap text-[var(--text-primary)]/5 opacity-40 mix-blend-overlay select-none"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          HARDWARE COLLECTION
        </h2>
        
        {/* Mobile: Stacked, compositional element */}
        <h2 
          className="md:hidden text-[22vw] font-cormorant leading-[0.85] tracking-[0.02em] text-center text-[var(--text-primary)]/5 opacity-40 mix-blend-overlay flex flex-col select-none"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          <span>HARDWARE</span>
          <span>COLLECTION</span>
        </h2>
      </div>
    </div>
  );
}

