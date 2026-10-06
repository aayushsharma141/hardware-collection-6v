"use client";

import { useReducedMotion } from "motion/react";

interface HeroControlsProps {
  totalSlides: number;
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export function HeroControls({ totalSlides, activeIndex, onNext, onPrev }: HeroControlsProps) {
  const shouldReduceMotion = useReducedMotion();

  if (totalSlides <= 1) return null;

  const currentDisplay = (activeIndex + 1).toString().padStart(2, "0");
  const totalDisplay = totalSlides.toString().padStart(2, "0");

  return (
    <div className="absolute bottom-8 lg:bottom-12 left-6 lg:left-16 flex items-center gap-6 z-[20]">
      <button 
        onClick={onPrev}
        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)]"
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-4 text-xs tracking-widest font-medium">
        <span className="text-white w-5 text-right">{currentDisplay}</span>
        <div className="w-16 lg:w-32 h-[1px] bg-zinc-800 relative overflow-hidden">
          {/* Progress Indicator Line */}
          {!shouldReduceMotion && (
            <div 
              className="absolute top-0 bottom-0 left-0 bg-[var(--color-brass)] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${((activeIndex + 1) / totalSlides) * 100}%` }}
            />
          )}
        </div>
        <span className="text-zinc-500 w-5">{totalDisplay}</span>
      </div>

      <button 
        onClick={onNext}
        className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)]"
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
