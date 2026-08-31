"use client";

import React from "react";
import { Testimonial, formatTestimonialDate, clampRating } from "@/types/testimonial";
import { StarRating } from "@/components/reviews/StarRating";
import { Star } from "lucide-react";

export default function MobileReviews({ reviews = [] }: { reviews?: Testimonial[] }) {
  // Withheld entirely until an editor approves real testimonials in Sanity.
  if (reviews.length === 0) return null;

  const repeatedReviews =
    reviews.length < 4
      ? [...reviews, ...reviews, ...reviews, ...reviews]
      : reviews.length < 6
        ? [...reviews, ...reviews]
        : reviews;

  return (
    <section className="w-full py-unit-xl bg-surface-obsidian border-t border-outline-variant lg:hidden overflow-hidden">
      <div className="flex flex-col space-y-unit-md">
        {/* Header in margin-padded container */}
        <div className="px-margin-mobile flex flex-col space-y-unit-xs">
          <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest text-[11px]">
            Verified Experiences
          </p>
          <h2 className="font-headline-md text-2xl text-text-bone">
            What Our Clients Say
          </h2>
        </div>

        {/* Rating pill in margin-padded container */}
        <div className="px-margin-mobile">
          <div className="flex items-center gap-2 bg-surface-graphite border border-outline-variant px-3.5 py-2.5 rounded-lg">
            <span className="inline-flex items-center gap-1.5 text-primary font-bold text-sm">
              <Star className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} aria-hidden="true" />
              4.4
            </span>
            <span className="text-text-muted text-xs">50+ Google Reviews</span>
            <a
              href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-xs font-medium ml-auto inline-flex items-center gap-1"
            >
              <span>View on Maps</span>
              <span aria-hidden="true">â†’</span>
            </a>
          </div>
        </div>

        {/* Sliding Infinite Marquee Track */}
        <div className="relative w-full overflow-hidden group/mobile-marquee pt-2">
          {/* Edge Fade Gradients */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-surface-obsidian to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-surface-obsidian to-transparent z-10"
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
    <div className="w-[280px] shrink-0 bg-surface-graphite border border-outline-variant p-4 rounded-xl flex flex-col justify-between gap-3 shadow-md select-none">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <StarRating rating={rating} className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-wider text-text-muted bg-surface-obsidian px-2 py-0.5 rounded border border-outline-variant">
            {review.source || "Google"}
          </span>
        </div>
        <p className="text-text-bone text-xs font-light leading-relaxed italic line-clamp-3">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      <div className="border-t border-outline-variant/60 pt-2.5 flex items-center justify-between gap-2">
        <p className="text-text-bone text-xs font-medium truncate">{review.customerName}</p>
        {dateStr && (
          <p className="text-text-muted text-[10px] shrink-0">{dateStr}</p>
        )}
      </div>
    </div>
  );
}

