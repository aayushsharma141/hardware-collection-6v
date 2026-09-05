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
    <section className="w-full pt-[72px] pb-[96px] bg-[#fbf5ea] border-t border-[#1a1017]/[0.08] lg:hidden overflow-hidden">
      <div className="flex flex-col space-y-unit-md">
        {/* Header in margin-padded container */}
        <div className="px-margin-mobile flex flex-col space-y-unit-xs">
          <p className="font-label-caps t-eyebrow text-[#8b1a42] font-semibold tracking-[0.22em] uppercase text-xs">
            Verified Experiences
          </p>
          <h2 className="font-headline-md t-h2 mt-3 text-[#1a1017] text-3xl sm:text-4xl font-light">
            What Our Clients Say
          </h2>
        </div>

        {/* Rating pill in margin-padded container */}
        <div className="px-margin-mobile">
          <a
            href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="4.4 stars from 50+ Google reviews - view the listing on Maps"
            className="hc-focus flex items-center gap-2 min-h-[48px] bg-[#f7f0e2] border border-[#1a1017]/[0.10] px-3.5 py-2.5 rounded-lg transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:border-[#8b1a42] active:scale-[0.985] motion-reduce:active:scale-100"
          >
            <span className="inline-flex items-center gap-1.5 text-[#8b1a42] font-bold text-[15px] whitespace-nowrap">
              <Star className="w-4 h-4 fill-current" strokeWidth={1.5} aria-hidden="true" />
              4.4
            </span>
            <span className="text-[#5a4854] t-body-sm whitespace-nowrap">
              50+ Google Reviews
            </span>
            <span
              aria-hidden="true"
              className="ml-auto shrink-0 text-[#8b1a42] text-[15px]"
            >
              &rarr;
            </span>
          </a>
        </div>

        {/* Sliding Infinite Marquee Track */}
        <div className="relative w-full overflow-hidden group/mobile-marquee pt-2">
          {/* Edge Fade Gradients */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#fbf5ea] to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#fbf5ea] to-transparent z-10"
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
    <div className="w-[300px] shrink-0 bg-[#f7f0e2] border border-[#1a1017]/[0.08] p-5 rounded-xl flex flex-col justify-between gap-4 select-none shadow-[0_4px_16px_rgba(26,16,23,0.03)]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <StarRating rating={rating} className="w-3.5 h-3.5" />
          <span className="t-meta uppercase text-[#7a6872] bg-[#fbf5ea] px-2 py-0.5 rounded border border-[#1a1017]/[0.08] text-[10px] tracking-wider font-medium">
            {review.source || "Google"}
          </span>
        </div>
        <p className="text-[#2e232b] t-body-sm font-light italic line-clamp-4 leading-relaxed">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>

      <div className="border-t border-[#1a1017]/[0.08] pt-3 flex items-center justify-between gap-2">
        <p className="text-[#1a1017] text-[14px] font-medium truncate">{review.customerName}</p>
        {dateStr && (
          <p className="text-[#7a6872] t-meta shrink-0 tracking-normal text-xs">{dateStr}</p>
        )}
      </div>
    </div>
  );
}

