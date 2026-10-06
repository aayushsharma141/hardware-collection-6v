"use client";

import React from "react";
import { Testimonial, formatTestimonialDate, clampRating } from "@/types/testimonial";
import { StarRating } from "@/components/reviews/StarRating";
import { Star } from "lucide-react";

export default function ReviewsMobile({ reviews = [] }: { reviews?: Testimonial[] }) {
  // Withheld entirely until an editor approves real testimonials in Sanity.
  const validReviews = reviews.filter((r) => r.quote && r.quote.trim().length > 0);
  if (validReviews.length === 0) return null;

  const repeatedReviews =
    validReviews.length < 4
      ? [...validReviews, ...validReviews, ...validReviews, ...validReviews]
      : validReviews.length < 6
        ? [...validReviews, ...validReviews]
        : validReviews;

  return (
    <section className="w-full pt-[72px] pb-[96px] bg-[var(--surface)] border-t border-[var(--border)] lg:hidden overflow-hidden">
      <div className="flex flex-col space-y-unit-md">
        {/* Header in margin-padded container */}
        <div className="px-margin-mobile flex flex-col space-y-unit-xs">
          <p className="font-label-caps t-eyebrow text-[var(--color-wine)] font-semibold tracking-[0.2em] uppercase text-xs">
            Client Experiences
          </p>
          <h2 className="hc-serif t-h2 mt-3 text-[var(--text-primary)] text-3xl sm:text-4xl font-light">
            Voices of Trust
          </h2>
        </div>

        {/* Rating pill in margin-padded container */}
        <div className="px-margin-mobile">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="4.4 stars from 50+ Google reviews - view the listing on Maps"
            className="hc-focus flex items-center gap-2 min-h-[48px] bg-[var(--surface-raised)] border border-[var(--border)] px-3.5 py-2.5 rounded-none transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:border-[var(--color-wine)] active:scale-[0.985] motion-reduce:active:scale-100"
          >
            <span className="inline-flex items-center gap-1.5 text-[var(--color-wine)] font-bold text-[15px] whitespace-nowrap">
              <Star className="w-4 h-4 fill-current" strokeWidth={1.5} aria-hidden="true" />
              4.4
            </span>
            <span className="text-[var(--text-secondary)] t-body-sm whitespace-nowrap">
              50+ Google Reviews
            </span>
            <span
              aria-hidden="true"
              className="ml-auto shrink-0 text-[var(--color-wine)] text-[15px]"
            >
              &rarr;
            </span>
          </a>
        </div>

        {/* Sliding Infinite Marquee Track */}
        <div className="relative w-full overflow-hidden group/mobile-marquee pt-2">
          {/* Edge Fade Gradients */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[var(--surface)] to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[var(--surface)] to-transparent z-10"
            aria-hidden="true"
          />

          <div className="flex w-max animate-review-marquee-mobile active:[animation-play-state:paused] py-1">
            {/* Set 1 */}
            <div className="flex items-stretch gap-3.5 pr-3.5 shrink-0">
              {repeatedReviews.map((review, i) => (
                <MobileReviewCard key={`m1-${i}-${review._id || i}`} review={review} />
              ))}
            </div>

            {/* Set 2 for seamless loop */}
            <div className="flex items-stretch gap-3.5 pr-3.5 shrink-0" aria-hidden="true">
              {repeatedReviews.map((review, i) => (
                <MobileReviewCard key={`m2-${i}-${review._id || i}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes review-marquee-mobile {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-review-marquee-mobile {
          animation: review-marquee-mobile 32s linear infinite;
        }
        .animate-review-marquee-mobile:active,
        .animate-review-marquee-mobile:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function MobileReviewCard({ review }: { review: Testimonial }) {
  const rating = clampRating(review.rating);
  const dateStr = formatTestimonialDate(review.date);

  return (
    <div className="w-[300px] shrink-0 bg-[var(--surface-raised)] border border-[var(--border)] p-5 rounded-none flex flex-col justify-between gap-4 select-none cursor-pointer hover:border-[var(--color-wine)]/30 transition-colors duration-300">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <StarRating rating={rating} className="w-3.5 h-3.5" />
          <span className="hc-mono uppercase text-[var(--text-secondary)] bg-[var(--surface)] px-2 py-0.5 border border-[var(--border)] text-[10px] tracking-[0.2em] font-medium">
            {review.source || "Google"}
          </span>
        </div>
        <p className="text-[var(--text-secondary)] t-body-sm font-light italic line-clamp-4 leading-relaxed">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between gap-2">
        <p className="text-[var(--text-primary)] text-[14px] font-medium truncate">{review.customerName}</p>
        {dateStr && (
          <p className="text-[var(--text-secondary)] t-meta shrink-0 tracking-normal text-xs">{dateStr}</p>
        )}
      </div>
    </div>
  );
}

