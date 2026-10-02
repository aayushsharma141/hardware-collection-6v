"use client";

import { ConsultationSection } from "./ConsultationSection";
import { SHOWROOM_MAP_URL } from "@/lib/config";
import { Star } from "lucide-react";
import { Testimonial, formatTestimonialDate, clampRating } from "@/types/testimonial";
import { StarRating } from "@/components/reviews/StarRating";
import { motion, Variants } from "motion/react";

const quietFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
  }
};

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


export default function FloatingCTA({ reviews = [], heading, description }: { reviews?: Testimonial[], heading?: string, description?: string }) {
  const validReviews = reviews.filter((r) => r.quote && r.quote.trim().length > 0);

  return (
    <section
      data-chapter="7"
      className="relative z-10"
    >
      {/* ── REVIEWS ZONE — theme-ivory ─────────────────────────── */}
      {validReviews.length > 0 && (
      <motion.div 
        data-zone="reviews" 
        className="theme-ivory border-t border-[var(--border)]"
        variants={quietFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="relative z-10 w-full pt-20 sm:pt-24 pb-14 sm:pb-16 overflow-hidden">
        {/* Section Header */}
        <div className="container mx-auto px-6 lg:px-16 mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[var(--accent,#C8A96E)] font-medium tracking-widest text-xs uppercase mb-2">
                Verified reviews
              </p>
              <h2
                className="text-3xl sm:text-4xl font-normal text-[var(--text-primary,#201d19)]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                What Our Clients Say
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-[var(--text-primary,#201d19)]/[0.04] border border-[var(--border)] px-4 py-2 rounded-full w-fit backdrop-blur-sm">
              <span className="inline-flex items-center gap-1.5 text-[var(--accent,#C8A96E)] font-bold text-sm">
                <Star className="w-3.5 h-3.5 fill-[var(--accent,#C8A96E)] text-[var(--accent,#C8A96E)]" strokeWidth={1.5} aria-hidden="true" />
                4.4
              </span>
              <span className="text-[var(--text-secondary,#5a5550)] text-xs">50+ Google Reviews</span>
              <span className="text-[var(--text-secondary,#5a5550)]">·</span>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent,#C8A96E)] hover:text-[var(--accent,#9a7a42)] text-xs font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>View on Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Track with Edge Fade Gradients */}
        <div className="relative w-full overflow-hidden group/marquee">
          {/* Left / Right Vignette Shadows — must match --surface to prevent seam */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-r from-[var(--surface,#f5f2ec)] to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-l from-[var(--surface,#f5f2ec)] to-transparent z-10"
            aria-hidden="true"
          />

          {/* Scrolling Content Track */}
          <div className="flex w-max animate-review-marquee group-hover/marquee:[animation-play-state:paused] py-2">
            {/* Set 1 */}
            <div className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0">
              {getRepeatedReviews(validReviews).map((review, i) => (
                <ReviewCard key={`r1-${i}-${review._id || i}`} review={review} />
              ))}
            </div>

            {/* Set 2 (for seamless loop) */}
            <div className="flex items-stretch gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0" aria-hidden="true">
              {getRepeatedReviews(validReviews).map((review, i) => (
                <ReviewCard key={`r2-${i}-${review._id || i}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual pause — horizontal rule inside reviews zone (renders as warm-dark line on ivory) */}
      <div className="border-t border-[var(--border)] mx-6 lg:mx-16" aria-hidden="true" />
      <div className="border-t border-[var(--border)] mx-6 lg:mx-16" aria-hidden="true" />
      </motion.div>
      )}

      {/* ── 50/50 LUXURY CONSULTATION SECTION — MATCHING REFERENCE ── */}
      <motion.div 
        data-zone="cta" 
        variants={quietFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <ConsultationSection heading={heading} description={description} showMap={true} />
      </motion.div>

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
    <div className="w-[310px] sm:w-[360px] lg:w-[400px] shrink-0 flex flex-col justify-between gap-5 bg-[var(--text-primary,#201d19)]/[0.03] hover:bg-[var(--text-primary,#201d19)]/[0.05] border border-[var(--border)] hover:border-[var(--accent,#9a7a42)]/40 p-6 rounded-2xl transition-all duration-300 shadow-[0_4px_16px_rgba(32,29,25,0.08)] select-none">
      <div className="space-y-3.5">
        {/* Stars + Verified Tag */}
        <div className="flex items-center justify-between">
          <StarRating rating={rating} className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary,#5a5550)] bg-[var(--text-primary,#201d19)]/[0.05] px-2.5 py-0.5 rounded-full border border-[var(--border)] font-medium">
            {review.source || "Google Review"}
          </span>
        </div>

        <blockquote className="text-[var(--text-primary,#201d19)] font-light leading-relaxed text-[13.5px] sm:text-sm italic line-clamp-4">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
      </div>

      <div className="border-t border-[var(--border)] pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[var(--accent,#9a7a42)]/15 border border-[var(--accent,#9a7a42)]/30 flex items-center justify-center text-[var(--accent,#9a7a42)] font-semibold text-xs shrink-0">
            {review.customerName ? review.customerName.charAt(0).toUpperCase() : "C"}
          </div>
          <p className="text-[var(--text-primary,#201d19)] text-xs sm:text-[13px] font-semibold truncate">
            {review.customerName}
          </p>
        </div>
        {dateStr && (
          <p className="text-[var(--text-secondary,#5a5550)] text-[11px] shrink-0 font-medium">
            {dateStr}
          </p>
        )}
      </div>
    </div>
  );
}


