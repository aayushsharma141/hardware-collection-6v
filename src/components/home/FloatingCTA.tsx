"use client";

import React, { useState } from "react";
import { LazyImage as Image } from "@/components/ui/lazy-image";
import { MapPin, Clock } from "lucide-react";
import {
  SHOWROOM_MAP_URL,
  SHOWROOM_PHONE_HREF,
  generateWhatsAppUrl,
  SHOWROOM_ADDRESS,
} from "@/lib/config";
import { Testimonial, clampRating } from "@/types/testimonial";
import { StarRating } from "@/components/reviews/StarRating";

interface FloatingCTAProps {
  reviews?: Testimonial[];
  heading?: string;
  description?: string;
  /** "Get Directions" target; the Studio value when set, else the configured default. */
  mapUrl?: string;
}

export default function FloatingCTA({ reviews = [], mapUrl }: FloatingCTAProps) {
  const validReviews = (reviews || []).filter(
    (r) => r && r.quote && r.quote.trim().length > 0 && r.customerName && r.customerName.trim().length > 0
  );

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const prevReview = () => {
    if (validReviews.length === 0) return;
    setActiveReviewIndex(
      (prev) => (prev - 1 + validReviews.length) % validReviews.length
    );
  };

  const nextReview = () => {
    if (validReviews.length === 0) return;
    setActiveReviewIndex((prev) => (prev + 1) % validReviews.length);
  };

  return (
    <div className="w-full">
      {/* ── 06 VOICES OF TRUST ("What our customers say.") ─────────── */}
      {/* Withheld entirely when no approved testimonials exist in Sanity */}
      {validReviews.length > 0 && (
        <section className="py-12 lg:py-20 bg-transparent border-b border-[var(--border)] relative z-10">
          <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight text-balance">
                  What our customers say.
                </h2>
              </div>

              {/* Circular Arrows */}
              {validReviews.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevReview}
                    aria-label="Previous review"
                    className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] motion-safe:active:scale-95 transition-[border-color,color,scale] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-wine)]"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextReview}
                    aria-label="Next review"
                    className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] motion-safe:active:scale-95 transition-[border-color,color,scale] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-wine)]"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Review Cards Grid (Desktop: 3 cols or dynamic cols, Mobile: active card) */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-5">
              {validReviews.slice(0, 3).map((rev, idx) => {
                const rating = clampRating(rev.rating || 5);

                return (
                  <div
                    key={rev._id || idx}
                    className="bg-white border border-[var(--border)] p-7 sm:p-8 flex flex-col justify-between rounded-2xl shadow-[0_1px_3px_rgba(26,16,23,0.02)] hover:border-[var(--color-brass)]/60 transition-colors duration-200"
                  >
                    <div>
                      {/* Prominent Architectural Opening Quote */}
                      <span
                        aria-hidden="true"
                        className="hc-serif text-3xl sm:text-4xl text-[var(--color-brass)] leading-none mb-3 block select-none"
                      >
                        &ldquo;
                      </span>

                      {/* Customer Review Quote: 2-4 lines of reassuring editorial text */}
                      <p className="hc-serif text-[16px] sm:text-[17px] font-light leading-[1.6] text-[var(--text-primary)] text-pretty mb-6">
                        {rev.quote}
                      </p>
                    </div>

                    {/* Attribution & Restrained Rating */}
                    <div className="border-t border-[var(--border)]/70 pt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">
                          {rev.customerName}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] hc-mono uppercase tracking-wider">
                          {rev.source ? `Verified · ${rev.source}` : "Verified Client"}
                        </p>
                      </div>

                      {rating > 0 && (
                        <div className="shrink-0" aria-label={`${rating} out of 5 stars`}>
                          <StarRating rating={rating} className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile View: Clean Active Card */}
            {validReviews[activeReviewIndex] && (
              <div className="block sm:hidden">
                <div className="bg-white border border-[var(--border)] p-6 sm:p-7 flex flex-col justify-between rounded-2xl shadow-[0_1px_3px_rgba(26,16,23,0.02)]">
                  <div>
                    <span
                      aria-hidden="true"
                      className="hc-serif text-3xl text-[var(--color-brass)] leading-none mb-3 block select-none"
                    >
                      &ldquo;
                    </span>

                    <p className="hc-serif text-[15.5px] sm:text-[16.5px] font-light leading-[1.6] text-[var(--text-primary)] text-pretty mb-5">
                      {validReviews[activeReviewIndex].quote}
                    </p>
                  </div>

                  <div className="border-t border-[var(--border)]/70 pt-3.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13.5px] font-medium text-[var(--text-primary)]">
                        {validReviews[activeReviewIndex].customerName}
                      </p>
                      <p className="text-[10.5px] text-[var(--text-secondary)] hc-mono uppercase tracking-wider">
                        {validReviews[activeReviewIndex].source
                          ? `Verified · ${validReviews[activeReviewIndex].source}`
                          : "Verified Client"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StarRating
                        rating={clampRating(validReviews[activeReviewIndex].rating || 5)}
                        className="w-2.5 h-2.5"
                      />
                      {validReviews.length > 1 && (
                        <span className="text-[10px] hc-mono font-medium text-[var(--text-secondary)] shrink-0 px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                          0{activeReviewIndex + 1} / 0{validReviews.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 07 VISIT OUR SHOWROOM ("Experience it in person.") ─────── */}
      <section
        id="showroom"
        className="py-12 lg:py-20 bg-transparent border-b border-[var(--border)] relative z-10 scroll-mt-20"
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 4 Cols: Title, Copy & Directions Button */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight mb-4 text-balance">
                  Visit our Sakchi
                  <br />
                  showroom.
                </h2>
                <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] font-light leading-relaxed max-w-[36ch] mb-6 text-pretty">
                  See, touch and compare a wide range of architectural hardware at our Sakchi showroom.
                </p>
              </div>

              <a
                href={mapUrl ?? SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3.5 rounded-full bg-[var(--color-wine)] text-white text-[11px] font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 hover:bg-[var(--color-wine-deep)] shadow-[0_4px_16px_rgba(139,26,66,0.2)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.3)] motion-safe:active:scale-[0.98] transition-[background-color,box-shadow,scale] duration-200 w-fit mb-6 lg:mb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wine)] focus-visible:ring-offset-2"
              >
                <span>Get Directions</span>
                <svg className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Center 4 Cols: Showroom Photograph */}
            <div className="lg:col-span-4 relative aspect-[16/10] sm:aspect-auto sm:min-h-[260px] overflow-hidden rounded-2xl border border-[var(--border)] bg-neutral-900 shadow-[0_8px_30px_rgba(26,16,23,0.04)]">
              <Image
                src="/cinema/showroom/exterior-2.png"
                alt="Hardware Collection Sakchi showroom storefront"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
            </div>

            {/* Right 4 Cols: Location & Hours Card with CTAs */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[var(--border)] p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(26,16,23,0.04)]">
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-brass-ink)] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[var(--text-primary)]">
                      Sakchi, Jamshedpur
                    </h3>
                    <address className="not-italic text-[12px] sm:text-[12.5px] font-light text-[var(--text-secondary)] leading-relaxed mt-1">
                      {SHOWROOM_ADDRESS}
                    </address>
                  </div>
                </div>

                <div className="border-t border-[var(--border)]/70 pt-4 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[var(--color-brass-ink)] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="text-[12px] sm:text-[12.5px] font-light text-[var(--text-secondary)] leading-relaxed tabular-nums">
                    <p className="font-medium text-[var(--text-primary)]">
                      Wed – Mon: 10:00 AM – 8:00 PM
                    </p>
                    <p>Tuesday: 10:00 AM – 2:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row with Pill Geometry */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[var(--border)]/70 mt-6">
                <a
                  href={generateWhatsAppUrl("showroom-visit")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-[var(--color-wine)] text-white text-[11px] font-semibold uppercase tracking-[0.16em] text-center hover:bg-[var(--color-wine-deep)] shadow-[0_4px_14px_rgba(139,26,66,0.2)] hover:shadow-[0_6px_20px_rgba(139,26,66,0.28)] motion-safe:active:scale-[0.98] transition-[background-color,box-shadow,scale] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wine)] focus-visible:ring-offset-2"
                >
                  WhatsApp
                </a>
                <a
                  href={SHOWROOM_PHONE_HREF}
                  className="py-3 px-4 rounded-full bg-white/70 hover:bg-white border border-[var(--border)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-[11px] font-semibold uppercase tracking-[0.16em] text-center motion-safe:active:scale-[0.98] transition-[background-color,border-color,scale] duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)]"
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
