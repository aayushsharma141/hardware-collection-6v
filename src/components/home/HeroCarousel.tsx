"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides.length;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      timerRef.current = setInterval(nextSlide, 6000); // 6 seconds
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide, totalSlides]);

  const handleInteraction = () => {
    if (isPlaying && !isReducedMotion) {
      setIsPlaying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handleInteraction();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      handleInteraction();
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
      handleInteraction();
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      handleInteraction();
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
      className="relative w-full h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-black"
      onMouseEnter={() => { if (!isReducedMotion) setIsPlaying(false); }}
      onMouseLeave={() => { if (!isReducedMotion) setIsPlaying(true); }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Highlighted Content"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10"></div>
            </div>

            <div className="relative z-20 w-full max-w-[1320px] mx-auto px-6 flex flex-col items-start justify-center h-full">
              <div className="max-w-4xl space-y-6">
                {slide.eyebrow && (
                  <p className="font-body text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    {slide.eyebrow}
                  </p>
                )}
                
                <h2 className="text-hero text-[var(--color-text-inverse)] whitespace-pre-line">
                  {slide.title}
                </h2>
                
                {slide.description && (
                  <p className="font-body text-lg md:text-xl text-[var(--color-text-inverse)]/90 max-w-xl leading-relaxed">
                    {slide.description}
                  </p>
                )}

                {(slide.primaryCta || slide.ctaTarget) && (
                  <div className="pt-6">
                    <Link
                      href={slide.ctaTarget || "/collections"}
                      className="btn-primary bg-white text-black hover:bg-black hover:text-white inline-flex"
                      onClick={handleInteraction}
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
            onClick={() => { handleInteraction(); prevSlide(); }}
            className="hidden md:flex absolute left-4 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => { handleInteraction(); nextSlide(); }}
            className="hidden md:flex absolute right-4 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Pagination & Play/Pause */}
          <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <div className="flex gap-2" role="tablist">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleInteraction();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                    index === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
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
