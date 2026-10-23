"use client";

import React, { useRef, useState, useCallback } from "react";
import { LazyImage as Image } from "@/components/ui/lazy-image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "@/types/hero";

interface HeroMobileProps {
  slides: HeroSlide[];
}

export default function HeroMobile({ slides }: HeroMobileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = slides?.length || 0;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  if (!slides || slides.length === 0) return null;
  const slide = slides[currentSlideIndex] || slides[0];

  const heading = slide.title || "The Art of\nthe Finish.";
  const ctaLabel = slide.primaryCta || "Explore Collections";
  const ctaHref = slide.ctaTarget || "/collections";
  const isExternalCta = /^https?:\/\//.test(ctaHref);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      data-nav-hero
      className="relative w-full pt-[104px] sm:pt-[112px] pb-9 px-5 sm:px-6 lg:hidden bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden"
    >
      {/* ── Top Editorial Block ─────────────────────────────────── */}
      <div className="w-full flex flex-col mb-6">
        {/* Headline */}
        <p aria-hidden="true" className="hc-serif text-[40px] sm:text-[46px] leading-[1.02] font-light text-[var(--text-primary)] whitespace-pre-line mb-3 tracking-tight text-balance">
          {heading}
        </p>

        {/* Subtitle / Description */}
        <p className="text-[13px] sm:text-[14px] leading-relaxed font-light text-[var(--text-secondary)] mb-6 max-w-[38ch] text-pretty">
          {slide.description ||
            "Curated hardware for modern spaces. Explore global brands, unmatched quality and expert guidance at our Sakchi showroom."}
        </p>

        {/* Dual CTAs matching Luxury Pill Geometry */}
        <div className="flex flex-wrap items-center gap-3">
          {isExternalCta ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3.5 rounded-full bg-gradient-to-r from-[var(--color-wine)] to-[#4a1824] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(42,14,23,0.22)] border border-white/20"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="group relative px-6 py-3.5 rounded-full bg-gradient-to-r from-[var(--color-wine)] to-[#4a1824] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(42,14,23,0.22)] border border-white/20"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          <a
            href="#showroom"
            className="px-5 py-3.5 rounded-full bg-white/70 hover:bg-white text-[var(--text-primary)] text-[11px] font-semibold uppercase tracking-[0.15em] inline-flex items-center gap-1.5 transition-all shadow-sm border border-[var(--border)] active:scale-[0.98] backdrop-blur-md"
          >
            <span>Visit Showroom</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--color-wine)]" />
          </a>
        </div>
      </div>

      {/* ── Visual Showcase Card matching Reference Mockup ─────── */}
      <div
        className="relative aspect-[16/10] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/80 shadow-[0_16px_36px_rgba(26,16,23,0.12)] bg-neutral-900 mb-6 select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Specular top rim highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-20 pointer-events-none" />

        <Image
          key={`hero-mob-${currentSlideIndex}`}
          src={slide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
          alt="Architectural hardware finish detail at Hardware Collection"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover transition-opacity duration-500"
        />

        {/* Ambient bottom shade */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-end justify-between gap-2 z-10">
          <div className="min-w-0 pr-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brass)]" />
              <p className="hc-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[var(--color-brass)] leading-tight truncate">
                {slide.specimenLabel || "Specimen Architecture"}
              </p>
            </div>
            <p className="hc-mono text-[10px] text-white/80 tracking-wider truncate">
              Sakchi Showroom Collection
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hc-mono text-[10px] text-white/90 tracking-[0.18em] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              0{currentSlideIndex + 1} / 0{totalSlides}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous hero slide"
                className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 motion-safe:active:scale-[0.97] transition-[background-color,scale] duration-150 ease-[var(--ease-out)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next hero slide"
                className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 motion-safe:active:scale-[0.97] transition-[background-color,scale] duration-150 ease-[var(--ease-out)]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 Stats Row elevated with frosted cards ─────────────── */}
      <div className="grid grid-cols-3 gap-2.5 pt-5 border-t border-[var(--border)]/70">
        <div className="rounded-2xl bg-white/50 backdrop-blur-sm border border-white/70 p-3 shadow-[0_2px_8px_rgba(26,16,23,0.03)]">
          <p className="hc-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] leading-none">
            10+
          </p>
          <p className="hc-mono text-[8px] sm:text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mt-1.5 leading-snug">
            Years in Sakchi
          </p>
        </div>
        <div className="rounded-2xl bg-white/50 backdrop-blur-sm border border-white/70 p-3 shadow-[0_2px_8px_rgba(26,16,23,0.03)]">
          <p className="hc-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] leading-none">
            20+
          </p>
          <p className="hc-mono text-[8px] sm:text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mt-1.5 leading-snug">
            Authorized Brands
          </p>
        </div>
        <div className="rounded-2xl bg-white/50 backdrop-blur-sm border border-white/70 p-3 shadow-[0_2px_8px_rgba(26,16,23,0.03)]">
          <p className="hc-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] leading-none">
            1000+
          </p>
          <p className="hc-mono text-[8px] sm:text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mt-1.5 leading-snug">
            Products in Our Showroom
          </p>
        </div>
      </div>
    </section>
  );
}

