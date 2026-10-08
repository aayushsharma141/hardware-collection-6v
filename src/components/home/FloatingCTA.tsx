"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import {
  SHOWROOM_MAP_URL,
  SHOWROOM_PHONE_HREF,
  generateWhatsAppUrl,
  SHOWROOM_ADDRESS,
} from "@/lib/config";
import { Testimonial } from "@/types/testimonial";

interface FloatingCTAProps {
  reviews?: Testimonial[];
  heading?: string;
  description?: string;
}

const DEFAULT_REVIEWS = [
  {
    quote:
      "Excellent collection and very helpful guidance. The showroom experience made our selection so much easier.",
    customerName: "Rohit S.",
    role: "Homeowner, Jamshedpur",
  },
  {
    quote:
      "Wide range of premium brands and genuine products. Highly recommended for anyone renovating their home.",
    customerName: "Ananya K.",
    role: "Interior Designer",
  },
  {
    quote:
      "Professional team and great product knowledge. Found exactly what we needed for our new apartment.",
    customerName: "Vikram P.",
    role: "Architect",
  },
];

export default function FloatingCTA({ reviews: _reviews = [] }: FloatingCTAProps) {
  const displayReviews = DEFAULT_REVIEWS;

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const prevReview = () => {
    setActiveReviewIndex(
      (prev) => (prev - 1 + displayReviews.length) % displayReviews.length
    );
  };

  const nextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % displayReviews.length);
  };

  return (
    <div className="w-full">
      {/* ── 06 VOICES OF TRUST ("What our customers say.") ─────────── */}
      <section className="py-12 lg:py-20 bg-[var(--surface)] border-b border-[var(--border)] relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
          {/* Header */}
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className="hc-mono text-[10.5px] uppercase tracking-[0.25em] font-semibold text-[var(--color-wine)] mb-1.5">
                Voices of Trust
              </p>
              <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight">
                What our customers say.
              </h2>
            </div>

            {/* Circular Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevReview}
                aria-label="Previous review"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextReview}
                aria-label="Next review"
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 3 Review Cards Grid (Desktop: 3 cols, Mobile: active card / carousel) */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-5">
            {displayReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface-raised)] border border-[var(--border)] p-6 sm:p-7 flex flex-col justify-between rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <span className="hc-serif text-3xl sm:text-4xl text-[var(--color-brass)] leading-none block mb-3 select-none">
                    &ldquo;
                  </span>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--text-primary)] font-light mb-6">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-[var(--border)]/60 pt-4">
                  <p className="hc-serif text-base font-medium text-[var(--text-primary)]">
                    {rev.customerName}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] font-light mt-0.5">
                    {rev.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View: Clean Active Card */}
          <div className="block sm:hidden">
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] p-6 flex flex-col justify-between rounded-none">
              <div>
                <span className="hc-serif text-3xl text-[var(--color-brass)] leading-none block mb-2 select-none">
                  &ldquo;
                </span>
                <p className="text-xs leading-relaxed text-[var(--text-primary)] font-light mb-6">
                  &ldquo;{displayReviews[activeReviewIndex].quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-[var(--border)]/60 pt-3 flex items-center justify-between">
                <div>
                  <p className="hc-serif text-sm font-medium text-[var(--text-primary)]">
                    {displayReviews[activeReviewIndex].customerName}
                  </p>
                  <p className="text-[10.5px] text-[var(--text-secondary)] font-light">
                    {displayReviews[activeReviewIndex].role}
                  </p>
                </div>
                <span className="text-[10px] hc-mono text-[var(--text-secondary)]">
                  0{activeReviewIndex + 1} / 0{displayReviews.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 VISIT OUR SHOWROOM ("Experience it in person.") ─────── */}
      <section
        id="showroom"
        className="py-12 lg:py-20 bg-[var(--surface)] border-b border-[var(--border)] relative z-10 scroll-mt-20"
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 4 Cols: Title, Copy & Directions Button */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <p className="hc-mono text-[10.5px] uppercase tracking-[0.25em] font-semibold text-[var(--color-wine)] mb-1.5">
                  Visit Our Showroom
                </p>
                <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight mb-4">
                  Experience it
                  <br />
                  in person.
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-[34ch] mb-6">
                  See, touch and compare a wide range of architectural hardware at our Sakchi showroom.
                </p>
              </div>

              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[var(--color-wine)] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 hover:bg-[var(--color-wine-deep)] transition-colors w-fit mb-6 lg:mb-0"
              >
                <span>Get Directions</span>
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Center 4 Cols: Showroom Photograph */}
            <div className="lg:col-span-4 relative aspect-[16/10] sm:aspect-auto sm:min-h-[260px] overflow-hidden border border-[var(--border)] bg-neutral-900">
              <Image
                src="/cinema/showroom/exterior-2.png"
                alt="Hardware Collection Sakchi showroom storefront"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
            </div>

            {/* Right 4 Cols: Location & Hours Card with CTAs */}
            <div className="lg:col-span-4 bg-[var(--surface-raised)] border border-[var(--border)] p-6 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-brass-ink)] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)]">
                      Sakchi, Jamshedpur
                    </h3>
                    <address className="not-italic text-[11px] text-[var(--text-secondary)] font-light leading-relaxed mt-1">
                      {SHOWROOM_ADDRESS}
                    </address>
                  </div>
                </div>

                <div className="border-t border-[var(--border)]/70 pt-4 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[var(--color-brass-ink)] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed">
                    <p className="font-medium text-[var(--text-primary)]">
                      Wed - Mon: 10:00 AM - 8:00 PM
                    </p>
                    <p>Tuesday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[var(--border)]/70 mt-6">
                <a
                  href={generateWhatsAppUrl("showroom-visit")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 bg-[var(--color-wine)] text-white text-[11px] font-semibold uppercase tracking-[0.16em] text-center hover:bg-[var(--color-wine-deep)] transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={SHOWROOM_PHONE_HREF}
                  className="py-3 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-semibold uppercase tracking-[0.16em] text-center hover:border-[var(--text-primary)] transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
