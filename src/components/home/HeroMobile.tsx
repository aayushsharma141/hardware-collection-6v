"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
      className="relative w-full pt-20 pb-8 px-5 lg:hidden bg-[var(--surface)] border-b border-[var(--border)] overflow-hidden"
    >
      {/* ── Top Editorial Block ─────────────────────────────────── */}
      <div className="w-full flex flex-col mb-6">
        {/* Eyebrow */}
        <p className="hc-mono text-[10.5px] uppercase tracking-[0.24em] font-semibold text-[var(--color-wine)] mb-2.5">
          Architectural Hardware
        </p>

        {/* Headline */}
        <p aria-hidden="true" className="hc-serif text-[40px] sm:text-[46px] leading-[1.02] font-light text-[var(--text-primary)] whitespace-pre-line mb-3 tracking-tight">
          {heading}
        </p>

        {/* Subtitle / Description */}
        <p className="text-[13px] sm:text-[14px] leading-relaxed font-light text-[var(--text-secondary)] mb-6 max-w-[38ch]">
          {slide.description ||
            "Curated hardware for modern spaces. Explore global brands, unmatched quality and expert guidance — at our Sakchi showroom."}
        </p>

        {/* Dual CTAs matching Reference Mockup */}
        <div className="flex items-center gap-3">
          {isExternalCta ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[var(--color-wine)] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 hover:bg-[var(--color-wine-deep)] active:scale-[0.98] transition-all shadow-sm rounded-none"
            >
              <span>{ctaLabel}</span>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="px-5 py-3.5 bg-[var(--color-wine)] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 hover:bg-[var(--color-wine-deep)] active:scale-[0.98] transition-all shadow-sm rounded-none"
            >
              <span>{ctaLabel}</span>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}

          <a
            href="#showroom"
            className="px-3 py-3.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-primary)] hover:text-[var(--color-wine)] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Visit Showroom</span>
            <svg className="w-3.5 h-3.5 text-[var(--color-wine)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Visual Showcase Card matching Reference Mockup ─────── */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border border-[var(--border)] bg-neutral-900 mb-6 select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={`hero-mob-${currentSlideIndex}`}
          src={slide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
          alt="Architectural hardware finish detail at Hardware Collection"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover transition-opacity duration-500"
        />

        {/* Bottom Bar: Label, Counter & Nav Controls */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3.5 flex items-end justify-between gap-2">
          <div>
            <p className="hc-mono text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[var(--color-brass)] leading-tight">
              {slide.specimenLabel || "Premium Hardware for Timeless Spaces"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hc-mono text-[10px] text-white/80 tracking-[0.15em]">
              0{currentSlideIndex + 1} / 0{slides.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous hero slide"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next hero slide"
                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 Stats Row matching Reference Mockup ──────────────── */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border)]">
        <div>
          <p className="hc-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] leading-none">
            10+
          </p>
          <p className="hc-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mt-1">
            Years in Sakchi
          </p>
        </div>
        <div>
          <p className="hc-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] leading-none">
            20+
          </p>
          <p className="hc-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mt-1">
            Authorized Brands
          </p>
        </div>
        <div>
          <p className="hc-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)] leading-none">
            1000+
          </p>
          <p className="hc-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium mt-1">
            Homes & Projects
          </p>
        </div>
      </div>
    </section>
  );
}
