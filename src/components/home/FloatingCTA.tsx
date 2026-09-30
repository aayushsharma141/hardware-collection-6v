"use client";

import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { SHOWROOM_PHONE_HREF, SHOWROOM_PHONE_DISPLAY, SHOWROOM_MAP_URL, generateWhatsAppUrl, SHOWROOM_YEARS_OF_TRUST, SHOWROOM_BRAND_COUNT } from "@/lib/config";
import { MessageCircle, PhoneCall, Navigation, Star } from "lucide-react";
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

import { SanityCta } from "@/types/sanity";

export default function FloatingCTA({ reviews = [], cta, heading, description }: { reviews?: Testimonial[], cta?: SanityCta, heading?: string, description?: string }) {
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
                <span aria-hidden="true">→</span>
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

      {/* —— CTA ZONE — theme-dark — quiet conversion zone ────── */}
      <motion.div 
        data-zone="cta" 
        className="theme-ivory"
        variants={quietFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Quiet conversion zone — 2-Column Luxury Consultation Studio */}
        <div id="directions" className="container mx-auto px-6 lg:px-16 py-20 lg:py-28 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

            {/* Left Column: Editorial & Heritage Authority */}
            <div className="lg:col-span-5 flex flex-col space-y-10 lg:pt-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-3">
                  Private consultation · Sakchi, Jamshedpur
                </p>
                <h2
                  className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)] leading-[1.15] mb-6"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  dangerouslySetInnerHTML={{ __html: heading ? heading.replace('\n', '<br />') : "Let's discuss<br /><span class=\"text-[var(--text-secondary)]\">your project.</span>" }}
                />
                <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed mb-8 max-w-md">
                  {description || "Tell us what you're working on. Our technical team will help you navigate brands, tactile finishes, and architectural hardware specifications with zero guesswork."}
                </p>
              </div>

              {/* Architectural Trust Indicators & Heritage Badges */}
              <div className="space-y-6 border-t border-[var(--border)] pt-8">
                <div className="grid grid-cols-3 gap-4 text-left">
                  <div>
                    <p className="text-xl font-normal text-[var(--accent)] font-cormorant" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{SHOWROOM_YEARS_OF_TRUST}+</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Years in Sakchi</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[var(--accent)] font-cormorant tabular-nums" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{SHOWROOM_BRAND_COUNT}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Authorized Brands</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[var(--accent)] font-cormorant" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>SAKCHI</p>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Showroom Location</p>
                  </div>
                </div>

                {/* Direct Click-to-Call & Map Links */}
                <div className="flex flex-col gap-3">
                  <a
                    href={cta ? generateWhatsAppUrl(cta.type) : generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366] hover:bg-[#25D366]/20 text-[#0b6b36] text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{cta?.label || "WhatsApp Us"}</span>
                  </a>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={SHOWROOM_PHONE_HREF}
                      className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-[var(--accent)]" />
                      <span>Call {SHOWROOM_PHONE_DISPLAY}</span>
                    </a>
                    <a
                      href={SHOWROOM_MAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium uppercase tracking-wider transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span>Open in Maps</span>
                    </a>
                  </div>
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
          <div className="mt-12 lg:mt-16 relative w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl h-[320px] lg:h-[380px]">
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


