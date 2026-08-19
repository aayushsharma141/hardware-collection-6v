"use client";

import { MagneticButton } from "@/components/animations/MagneticButton";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";

/**
 * FloatingCTA — Chapter 07 "Come Feel It"
 * Visual tension: QUIET / CONVERSION ZONE
 *
 * Principle: The page deliberately slows down here.
 * No parallax, no skew, no clip-path drama, no pointer light.
 * Only opacity transitions. CTAs must feel stable and trustworthy.
 *
 * Layout:
 *   Top: 3 editorial testimonials (grid, not carousel)
 *   Rule: visual pause / horizontal line
 *   Editorial statement
 *   3 CTAs: WhatsApp (primary) · Call · Directions
 *
 * Absorbs ReviewsSlide.tsx — that component is deleted.
 */

const REVIEWS = [
  {
    text: "Best showroom in Jamshedpur for genuine Hafele and Dorset fittings. Mukesh ji understands technical blueprints and helped our team specify complete soft-close wardrobe channels and magnetic locks. Zero hassle.",
    author: "Rajiv Sharma",
    role: "Architect & Interior Consultant, Bistupur",
    date: "February 2026",
  },
  {
    text: "We renovated our modular kitchen and bought all Hafele tandem drawers and Labacha quartz sink from Hardware Collection Sakchi. The guidance on finish durability was spot on. Highly recommended.",
    author: "Anita Sen",
    role: "Homeowner, Circuit House Area",
    date: "January 2026",
  },
  {
    text: "Reliable bulk pricing and same-day availability for Dorset digital door locks and heavy mortise handles. Their showroom has the largest physical architectural stock display in the entire district.",
    author: "Vikramaditya Roy",
    role: "Civil Contractor & Builder, Adityapur",
    date: "December 2025",
  },
];

export default function FloatingCTA() {
  return (
    <section
      data-chapter="7"
      className="bg-zinc-950 border-t border-zinc-900"
    >
      {/* Reviews — editorial layout, not carousel */}
      <div className="container mx-auto px-6 lg:px-16 pt-24 pb-16">
        <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-1">
          CHAPTER 07
        </p>
        <p className="text-zinc-600 text-xs tracking-widest uppercase mb-16">
          WHAT OUR CLIENTS SAY
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {REVIEWS.map((review, i) => (
            <div key={i} className="flex flex-col gap-4">
              {/* Stars — understated */}
              <div className="flex gap-1" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-[#C8A96E] text-xs" aria-hidden="true">★</span>
                ))}
              </div>
              <blockquote className="text-zinc-300 font-light leading-relaxed text-sm italic">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <div className="border-t border-zinc-900 pt-4">
                <p className="text-white text-xs font-medium">{review.author}</p>
                <p className="text-zinc-600 text-xs">{review.role}</p>
                <p className="text-zinc-700 text-xs mt-0.5">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Google rating note */}
        <p className="text-zinc-700 text-xs mt-10">
          4.4 / 5 based on 55+ verified Google Maps reviews.
          <a
            href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-[#C8A96E] hover:underline"
          >
            View all reviews →
          </a>
        </p>
      </div>

      {/* Visual pause — horizontal rule */}
      <div className="border-t border-zinc-900 mx-6 lg:mx-16" aria-hidden="true" />

      {/* Quiet conversion zone — 2-Column Luxury Consultation Studio */}
      <div className="container mx-auto px-6 lg:px-16 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial & Heritage Authority */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10 lg:sticky lg:top-32">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C8A96E] font-semibold mb-3">
                PRIVATE CONSULTATION · SAKCHI, JAMSHEDPUR
              </p>
              <h2 
                className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.15] mb-6"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Let&apos;s discuss<br />
                <span className="text-zinc-500">your project.</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-8 max-w-md">
                Tell us what you&apos;re working on. Our technical team will help you navigate brands, tactile finishes, and architectural hardware specifications with zero guesswork.
              </p>
            </div>

            {/* Architectural Trust Indicators & Heritage Badges */}
            <div className="space-y-6 border-t border-zinc-900 pt-8">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-xl font-normal text-[#C8A96E] font-cormorant" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>20+</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Years in Sakchi</p>
                </div>
                <div>
                  <p className="text-xl font-normal text-[#C8A96E] font-cormorant" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>6</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Authorized Brands</p>
                </div>
                <div>
                  <p className="text-xl font-normal text-[#C8A96E] font-cormorant" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>SAKCHI</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Showroom Location</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  OFFICIAL SHOWROOM PARTNERS
                </p>
                <p className="text-xs text-zinc-300 font-light tracking-wide">
                  Hafele · Dorset · Labacha · Godrej · Hettich · Kich
                </p>
              </div>

              <div className="text-xs text-zinc-500 space-y-1">
                <p>📍 Hardware Collection, Sakchi, Jamshedpur, Jharkhand</p>
                <p>⏰ Open Monday – Sunday, 10:00 AM – 8:00 PM</p>
                <p>
                  📞 Direct Showroom Line:{" "}
                  <a href="tel:+919835190738" className="text-[#C8A96E] hover:underline font-medium">
                    +91 98351 90738
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Luxury Consultation Form */}
          <div className="lg:col-span-7 relative">
            <ConsultationForm inline={true} />
          </div>

        </div>
      </div>
    </section>
  );
}
