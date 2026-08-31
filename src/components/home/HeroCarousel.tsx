"use client";

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type HeroSlide = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: string;
  ctaTarget?: string;
  imageUrl: string;
  imageLqip?: string;
};

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const subscribeToReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getReducedMotionServerSnapshot = () => false;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const isReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const isAutoplayActive = !isManuallyPaused && !isHovered && !isReducedMotion;

  useEffect(() => {
    if (isAutoplayActive && totalSlides > 1) {
      timerRef.current = setInterval(nextSlide, 6000); // 6 seconds per slide
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplayActive, nextSlide, totalSlides]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-[var(--surface)] focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsHovered(false);
        }
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Highlighted Showroom Collections"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                placeholder={slide.imageLqip ? "blur" : "empty"}
                blurDataURL={slide.imageLqip}
                className={`object-cover transition-transform duration-[20s] ease-out brightness-[0.7] ${
                  isActive && !isReducedMotion ? "scale-105" : "scale-100"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
            </div>

            <div className="relative z-20 w-full max-w-[1320px] mx-auto px-6 flex flex-col items-start justify-center h-full">
              <div className="max-w-4xl space-y-6">
                {slide.eyebrow && (
                  <p className="font-body text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    {slide.eyebrow}
                  </p>
                )}
                
                <h2 className="text-hero text-[var(--color-text-inverse)] whitespace-pre-line">
                  {slide.title}
                </h2>
                
                {slide.description && (
                  <p className="font-body text-base md:text-xl text-[var(--color-text-inverse)]/90 max-w-xl leading-relaxed">
                    {slide.description}
                  </p>
                )}

                {(slide.primaryCta || slide.ctaTarget) && (
                  <div className="pt-6">
                    <Link
                      href={slide.ctaTarget || "/collections"}
                      className="btn-primary bg-white text-black hover:bg-[var(--surface)] hover:text-[var(--text-primary)] inline-flex"
                    >
                      {slide.primaryCta || "Explore Collection"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      {totalSlides > 1 && (
        <>
          {/* Desktop Arrows */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 z-30 p-2 rounded-full bg-black/30 text-[var(--text-primary)] hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 z-30 p-2 rounded-full bg-black/30 text-[var(--text-primary)] hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Pagination & Play/Pause */}
          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsManuallyPaused(!isManuallyPaused)}
              className="p-1.5 text-[var(--text-primary)]/80 hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label={isManuallyPaused ? "Start autoplay" : "Pause autoplay"}
            >
              {isManuallyPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            
            <div className="flex gap-2" role="tablist" aria-label="Slide indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                    index === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60 w-2"
                  }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

