"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { HeroSlide } from "@/types/hero";
import { HeroControls } from "./HeroControls";
import { MagneticButton } from "@/components/animations/MagneticButton";

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
              <img
                src={slide.imageUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-50 will-change-transform"
                style={{ contentVisibility: isActive ? 'visible' : 'hidden' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-zinc-950/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Z=2: Products */}
      <div className="hero-product-wrapper absolute inset-0 flex items-center justify-end pr-[8%] opacity-0 invisible will-change-transform z-[2]">
        <div className="pointer-light absolute inset-0 pointer-events-none" aria-hidden="true" />
        
        {slides.map((slide, idx) => {
          if (!slide.productUrl) return null;
          const isActive = idx === activeIndex;
          
          return (
            <div 
              key={`prod-${idx}`}
              className={`absolute right-[8%] w-[40vw] max-w-[560px] h-[70vh] flex items-center justify-center transition-all ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
                isActive ? "opacity-100 translate-x-0 z-10 delay-[100ms]" : "opacity-0 translate-x-4 z-0"
              }`}
              style={{ transitionDuration: `${TRANSITION_DURATION - 200}ms` }}
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
                style={{ filter: "contrast(1.05) brightness(0.95) drop-shadow(0 32px 64px rgba(0,0,0,0.8))" }}
              />
              {slide.reflectionUrl && (
                <img
                  src={slide.reflectionUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-contain object-center z-20 light-sweep-overlay opacity-60"
                  style={{ mixBlendMode: "screen" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Z=3: Typography */}
      <div className="hero-typography-wrapper absolute inset-0 flex flex-col justify-end pb-24 lg:pb-32 px-6 lg:px-16 z-[3] pointer-events-none">
        <div className="relative max-w-3xl h-[320px]">
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            
            // Build the prefilled WhatsApp message
            const waMessage = encodeURIComponent(`Hi, I'm interested in the collection featured on the Hardware Collection website: ${slide.title.replace(/\n/g, ' ')}`);
            const waUrl = `https://wa.me/919835190738?text=${waMessage}`;

            return (
              <div 
                key={`text-${idx}`}
                className={`absolute bottom-0 left-0 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? "opacity-100 translate-y-0 z-10 pointer-events-auto delay-[200ms]" : "opacity-0 translate-y-4 z-0 pointer-events-none"
                }`}
                style={{ transitionDuration: `${TRANSITION_DURATION - 400}ms` }}
              >
                <p className="hero-eyebrow text-[#C8A96E] font-medium tracking-widest text-xs lg:text-sm uppercase mb-5 lg:mb-7 opacity-0 invisible">
                  {slide.eyebrow}
                </p>

                <h1 className="hero-title text-5xl lg:text-8xl xl:text-[6.5rem] font-light text-white leading-[1.05] mb-6 whitespace-pre-line font-cinzel opacity-0 invisible translate-y-[60px]">
                  {slide.title}
                </h1>

                <p className="hero-body text-lg lg:text-xl text-zinc-300 font-light mb-10 max-w-xl leading-relaxed opacity-0 invisible translate-y-[24px]">
                  {slide.description}
                </p>

                <div className="hero-cta flex flex-wrap items-center gap-4 opacity-0 invisible translate-y-[16px]">
                  <MagneticButton>
                    <a
                      href={slide.ctaTarget}
                      className="inline-flex items-center justify-center px-8 py-4 border border-zinc-600 text-white font-medium text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
                    >
                      {slide.primaryCta}
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-8 py-4 bg-[#C8A96E] text-black font-medium text-sm tracking-widest uppercase hover:bg-[#b0945b] transition-colors duration-300"
                    >
                      WHATSAPP →
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
