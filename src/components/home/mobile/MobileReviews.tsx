"use client";

import React from "react";
import { Testimonial, formatTestimonialDate, clampRating } from "@/types/testimonial";

export default function MobileReviews({ reviews = [] }: { reviews?: Testimonial[] }) {
  // Withheld entirely until an editor approves real testimonials in Sanity.
  // Never hardcode review content here.
  if (reviews.length === 0) return null;

  return (
    <section className="w-full px-margin-mobile py-unit-xl bg-surface-obsidian border-t border-outline-variant lg:hidden">
      <div className="flex flex-col space-y-unit-lg">
        <div className="flex flex-col space-y-unit-xs">
          <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
            Verified Experiences
          </p>
          <h2 className="font-headline-md text-headline-md text-text-bone">
            What Our Clients Say
          </h2>
        </div>

        {/* Rating pill */}
        <div className="flex items-center gap-2 bg-surface-graphite border border-outline-variant p-3 rounded-none">
          <span className="text-primary font-bold text-sm">4.4 ★</span>
          <span className="text-text-muted text-xs">50+ Google Reviews</span>
          <a
            href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs font-medium ml-auto"
          >
            View on Maps →
          </a>
        </div>

        {/* Review Cards Carousel / Stack */}
        <div className="flex flex-col gap-4">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-surface-graphite border border-outline-variant p-5 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className="flex gap-1"
                    role="img"
                    aria-label={`${clampRating(review.rating)} out of 5 stars`}
                  >
                    {Array.from({ length: clampRating(review.rating) }).map((_, s) => (
                      <span key={s} className="text-primary text-xs" aria-hidden="true">★</span>
                    ))}
                  </div>
                  {review.source && (
                    <span className="text-[10px] uppercase tracking-wider text-text-muted bg-surface-obsidian px-2 py-0.5 border border-outline-variant">
                      {review.source}
                    </span>
                  )}
                </div>
                <p className="text-text-bone text-sm font-light leading-relaxed italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-outline-variant/60 pt-3">
                <p className="text-text-bone text-xs font-medium">{review.customerName}</p>
                {formatTestimonialDate(review.date) && (
                  <p className="text-text-muted text-[11px]">{formatTestimonialDate(review.date)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
