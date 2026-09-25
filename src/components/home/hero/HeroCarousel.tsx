"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { HeroSlide } from "@/types/hero";
import { HeroControls } from "./HeroControls";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { generateWhatsAppUrl } from "@/lib/config";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = slides.length;
  const AUTOPLAY_DELAY = 6000;
  const TRANSITION_DURATION = 1200;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || totalSlides <= 1) return;
    
    setIsTransitioning(true);
    let newIndex = index;
    if (newIndex < 0) newIndex = totalSlides - 1;
    if (newIndex >= totalSlides) newIndex = 0;
    
    setActiveIndex(newIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  }, [isTransitioning, totalSlides]);

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Autoplay
  useEffect(() => {
    if (shouldReduceMotion || isPaused || totalSlides <= 1) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeIndex, isPaused, shouldReduceMotion, handleNext, totalSlides]);

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) handleNext(); // swipe left -> next
      else handlePrev(); // swipe right -> prev
    }
    touchStartX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        The structural layers:
        1. Backgrounds (Camera A - GSAP scales this wrapper)
        2. Products (Camera C - GSAP counter-drifts this wrapper)
        3. Typography (GSAP opacity/translateY on these wrappers)
      */}
      
      {/* Z=1: Backgrounds */}
      <div className="hero-bg-wrapper absolute inset-0 z-[1]">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div 
              key={`bg-${idx}`}
              className={`absolute inset-0 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
                isActive ? "opacity-100 scale-100 translate-x-0 z-10" : "opacity-0 scale-[1.015] -translate-x-2 z-0"
              }`}
              style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
            >
              <Image
                src={slide.imageUrl}
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                priority={idx === 0}
                className="object-cover opacity-[0.85] will-change-transform"
                style={{ contentVisibility: isActive ? 'visible' : 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-zinc-950/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Z=2: Products (Camera C — Desktop side-by-side floating hardware) */}
      <div className="hero-product-wrapper absolute inset-0 hidden lg:flex items-center justify-end lg:pr-[8%] opacity-0 invisible will-change-transform z-[2]">
        <div className="pointer-light absolute inset-0 pointer-events-none" aria-hidden="true" />
        
        {slides.map((slide, idx) => {
          if (!slide.productUrl) return null;
          const isActive = idx === activeIndex;
          
          return (
            <div 
              key={`prod-${idx}`}
              className={`absolute w-[80vw] xs:w-[70vw] lg:w-[40vw] max-w-[480px] lg:max-w-[560px] flex items-center justify-center transition-all ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none lg:right-[8%] ${
                isActive ? "opacity-100 translate-x-0 z-10 delay-[100ms]" : "opacity-0 translate-x-4 z-0"
              }`}
              style={{
                transitionDuration: `${TRANSITION_DURATION - 200}ms`,
                // Single clamp covers all mobile sizes; desktop height is set by lg:h-[70vh] on desktop path
                height: "clamp(220px, 38svh, 380px)",
              }}
            >
              {slide.macroUrl && (
                <img
                  src={slide.macroUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 rounded-sm hero-macro-texture"
                  style={{ mixBlendMode: "luminosity" }}
                />
              )}
              <img
                src={slide.productUrl}
                alt={slide.title}
                className="w-full h-full object-contain object-center relative z-10"
                style={{ filter: "contrast(1.05) drop-shadow(0 32px 64px rgba(0,0,0,0.8))" }}
              />
              {slide.reflectionUrl && (
                <img
                  src={slide.reflectionUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-contain object-center z-20 light-sweep-overlay"
                  style={{ mixBlendMode: "screen" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Z=3: Typography */}
      {/*
        Mobile: bottom-aligned, generous padding above product
        Desktop: unchanged GSAP-orchestrated entrance
      */}
      <div className="hero-typography-wrapper absolute inset-0 flex flex-col justify-end pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-16 z-[3] pointer-events-none">
        {/* No fixed height — let content determine size on mobile */}
        <div className="relative max-w-3xl">
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            
            // WhatsApp URL from config with slide-contextual message
            const waUrl = generateWhatsAppUrl("general-enquiry");

            return (
              <div 
                key={`text-${idx}`}
                className={`absolute bottom-0 left-0 w-full transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "opacity-100 translate-y-0 z-10 pointer-events-auto delay-[200ms]" : "opacity-0 translate-y-4 z-0 pointer-events-none"
                }`}
                style={{ transitionDuration: `${TRANSITION_DURATION - 400}ms` }}
              >
                <p className="hero-eyebrow hc-mono text-[#C8A96E] font-medium tracking-[0.22em] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4 lg:mb-6 opacity-0 invisible">
                  {slide.eyebrow}
                </p>

                {/* Standardized Hero Title */}
                <h1
                  className="hero-title hc-serif font-normal text-[#e8e3d9] leading-[0.95] mb-4 sm:mb-6 lg:mb-7 whitespace-pre-line opacity-0 invisible translate-y-[60px] text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] tracking-[0.015em]"
                >
                  {slide.title}
                </h1>

                {/* Body text */}
                <p className="hero-body text-xs sm:text-[14px] lg:text-[16px] text-[#d1ccc4] font-light mb-6 sm:mb-8 lg:mb-10 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-none opacity-0 invisible translate-y-[24px]">
                  {slide.description}
                </p>

                {/* CTAs — stacked on mobile, side-by-side sm+ */}
                <div className="hero-cta flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 opacity-0 invisible translate-y-[16px] w-full sm:w-auto">
                  {/* Primary: border only, full-width on mobile */}
                  <MagneticButton>
                    <a
                      href={slide.ctaTarget}
                      className="flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-5 lg:px-8 py-2.5 sm:py-3 border border-zinc-600 text-white font-medium text-xs sm:text-[13px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 w-full sm:w-auto"
                    >
                      {slide.primaryCta}
                    </a>
                  </MagneticButton>

                  {/* Secondary: lower visual weight — text + subtle border */}
                  <MagneticButton>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-cta-secondary flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-5 lg:px-8 py-2.5 sm:py-3 border border-zinc-700/60 text-zinc-300 font-medium text-xs sm:text-[13px] tracking-widest uppercase hover:text-white hover:border-zinc-500 transition-colors duration-300 w-full sm:w-auto"
                    >
                      WhatsApp →
                    </a>
                  </MagneticButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <HeroControls 
        totalSlides={totalSlides}
        activeIndex={activeIndex}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
