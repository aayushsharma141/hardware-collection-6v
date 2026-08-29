"use client";

import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { SHOWROOM_PHONE_HREF, SHOWROOM_PHONE_DISPLAY, SHOWROOM_MAP_URL } from "@/lib/config";
import { PhoneCall, Navigation, Star } from "lucide-react";
import { Testimonial, formatTestimonialDate, clampRating } from "@/types/testimonial";
import { AUTHORIZED_BRAND_COUNT } from "@/components/BrandTrustStrip";
import { StarRating } from "@/components/reviews/StarRating";

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

export default function FloatingCTA({ reviews = [] }: { reviews?: Testimonial[] }) {
  return (
    <section
      data-chapter="7"
      className="relative z-10 bg-zinc-950 border-t border-zinc-900"
    >
      {/* Reviews — Sliding Infinite Marquee Track with pause-on-hover */}
      {reviews.length > 0 && (
      <>
      <div className="relative z-10 w-full pt-20 sm:pt-24 pb-14 sm:pb-16 overflow-hidden">
        {/* Section Header */}
        <div className="container mx-auto px-6 lg:px-16 mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-2">
                Verified reviews
              </p>
              <h2 
                className="text-3xl sm:text-4xl font-normal text-white"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                What Our Clients Say
              </h2>
            </div>
            
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full w-fit backdrop-blur-sm">
              <span className="inline-flex items-center gap-1.5 text-[#C8A96E] font-bold text-sm">
                <Star className="w-3.5 h-3.5 fill-[#C8A96E] text-[#C8A96E]" strokeWidth={1.5} aria-hidden="true" />
                4.4
              </span>
              <span className="text-zinc-400 text-xs">50+ Google Reviews</span>
              <span className="text-zinc-600">·</span>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8A96E] hover:text-[#e5c487] text-xs font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>View on Maps</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Track with Edge Fade Gradients */}
        <div className="relative w-full overflow-hidden group/marquee">
          {/* Left / Right Vignette Shadows for smooth infinite fade */}
          <div 
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-r from-zinc-950 to-transparent z-10" 
            aria-hidden="true" 
          />
          <div 
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-l from-zinc-950 to-transparent z-10" 
            aria-hidden="true" 
          />

          {/* Scrolling Content Track */}
          <div className="flex w-max animate-review-marquee group-hover/marquee:[animation-play-state:paused] py-2">
            {/* Set 1 */}
            <div className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0">
              {getRepeatedReviews(reviews).map((review, i) => (
                <ReviewCard key={`r1-${i}-${review._id || i}`} review={review} />
              ))}
            </div>

            {/* Set 2 (for seamless loop) */}
            <div className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0" aria-hidden="true">
              {getRepeatedReviews(reviews).map((review, i) => (
                <ReviewCard key={`r2-${i}-${review._id || i}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual pause — horizontal rule */}
      <div className="border-t border-zinc-900 mx-6 lg:mx-16" aria-hidden="true" />
      </>
      )}

      {/* Quiet conversion zone — 2-Column Luxury Consultation Studio */}
      <div id="directions" className="container mx-auto px-6 lg:px-16 py-20 lg:py-28 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Editorial & Heritage Authority */}
          <div className="lg:col-span-5 flex flex-col space-y-10 lg:pt-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C8A96E] font-semibold mb-3">
                Private consultation · Sakchi, Jamshedpur
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
                  <p className="text-xl font-normal text-[#C8A96E] font-cormorant tabular-nums" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{AUTHORIZED_BRAND_COUNT}</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Authorized Brands</p>
                </div>
                <div>
                  <p className="text-xl font-normal text-[#C8A96E] font-cormorant" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>SAKCHI</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Showroom Location</p>
                </div>
              </div>

              {/* Direct Click-to-Call & Map Links */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={SHOWROOM_PHONE_HREF}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#C8A96E] text-white hover:text-[#C8A96E] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#C8A96E]" />
                  <span>Call {SHOWROOM_PHONE_DISPLAY}</span>
                </a>
                <a
                  href={SHOWROOM_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white text-zinc-300 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  <Navigation className="w-4 h-4 text-zinc-400" />
                  <span>Open in Maps</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Refined Luxury Consultation Form */}
          <div className="lg:col-span-7 relative flex">
            <ConsultationForm inline={true} />
          </div>

        </div>

        {/* The map sits beneath both columns rather than inside the left one. Kept
            in-column it made that column ~160-210px taller than the form card, which
            is what left the two sides visibly out of balance; full width it also
            reads better than the narrow crop it had before. */}
        <div className="mt-12 lg:mt-16 relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl h-[320px] lg:h-[380px]">
          <iframe
            title="Hardware Collection Sakchi Showroom Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.674844391696!2d86.20150000000001!3d22.8028401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e3035e707e07%3A0x8f8ee13c908afec6!2sHardware%20Collection%20-%20Best%20Dorset%20Lock%20Dealer%20%7C%20Hafele%20Hardware%20%7C%20Modular%20Kitchen%20%7C%20Labacha%20Dealer%20in%20Jamshedpur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-full border-0"
            style={{ width: "100%", height: "100%", border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes review-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-review-marquee {
          animation: review-marquee 45s linear infinite;
        }
        .animate-review-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function getRepeatedReviews(reviews: Testimonial[]): Testimonial[] {
  if (reviews.length === 0) return [];
  if (reviews.length < 4) return [...reviews, ...reviews, ...reviews, ...reviews];
  if (reviews.length < 6) return [...reviews, ...reviews];
  return reviews;
}

function ReviewCard({ review }: { review: Testimonial }) {
  const rating = clampRating(review.rating);
  const dateStr = formatTestimonialDate(review.date);

  return (
    <div className="w-[310px] sm:w-[360px] lg:w-[400px] shrink-0 flex flex-col justify-between gap-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-[#C8A96E]/40 p-6 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.35)] select-none">
      <div className="space-y-3.5">
        {/* Stars + Verified Tag */}
        <div className="flex items-center justify-between">
          <StarRating rating={rating} className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08] font-medium">
            {review.source || "Google Review"}
          </span>
        </div>

        <blockquote className="text-zinc-200 font-light leading-relaxed text-[13.5px] sm:text-sm italic line-clamp-4">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
      </div>

      <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#C8A96E]/15 border border-[#C8A96E]/30 flex items-center justify-center text-[#C8A96E] font-semibold text-xs shrink-0">
            {review.customerName ? review.customerName.charAt(0).toUpperCase() : "C"}
          </div>
          <p className="text-white text-xs sm:text-[13px] font-semibold truncate">
            {review.customerName}
          </p>
        </div>
        {dateStr && (
          <p className="text-zinc-500 text-[11px] shrink-0 font-medium">
            {dateStr}
          </p>
        )}
      </div>
    </div>
  );
}
