"use client";

import React from "react";

const REVIEWS = [
  {
    text: "Best showroom in Jamshedpur for genuine Hafele and Dorset fittings. Mukesh ji understands technical blueprints and helped our team specify complete soft-close wardrobe channels and magnetic locks.",
    author: "Rajiv Sharma",
    role: "Architect & Interior Consultant, Bistupur",
    date: "February 2026",
  },
  {
    text: "We renovated our modular kitchen and bought all Hafele tandem drawers and Labacha quartz sink from Hardware Collection Sakchi. The guidance on finish durability was spot on.",
    author: "Anita Sen",
    role: "Homeowner, Circuit House Area",
    date: "January 2026",
  },
  {
    text: "Reliable bulk pricing and same-day availability for Dorset digital door locks and heavy mortise handles. Their showroom has the largest physical architectural stock display.",
    author: "Vikramaditya Roy",
    role: "Civil Contractor & Builder, Adityapur",
    date: "December 2025",
  },
];

export default function MobileReviews() {
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
          <span className="text-text-muted text-xs">55+ Verified Google Reviews</span>
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
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-surface-graphite border border-outline-variant p-5 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-primary text-xs" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted bg-surface-obsidian px-2 py-0.5 border border-outline-variant">
                    Verified
                  </span>
                </div>
                <p className="text-text-bone text-sm font-light leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="border-t border-outline-variant/60 pt-3">
                <p className="text-text-bone text-xs font-medium">{review.author}</p>
                <p className="text-text-muted text-[11px]">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
