"use client";

import { MagneticButton } from "@/components/animations/MagneticButton";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { SHOWROOM_PHONE_HREF, SHOWROOM_PHONE_DISPLAY, SHOWROOM_MAP_URL } from "@/lib/config";
import { PhoneCall, Navigation, MapPin } from "lucide-react";

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
      className="relative z-10 bg-zinc-950 border-t border-zinc-900"
    >
      {/* Reviews — editorial layout, not carousel */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-2">
              CHAPTER 07 · VERIFIED REVIEWS
            </p>
            <h2 
              className="text-3xl sm:text-4xl font-normal text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              What Our Clients Say
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-md w-fit">
            <span className="text-[#C8A96E] font-bold text-sm">4.4 ★</span>
            <span className="text-zinc-400 text-xs">55+ Verified Google Reviews</span>
            <a
              href={SHOWROOM_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8A96E] hover:underline text-xs font-medium ml-1"
            >
              View Maps →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, i) => (
            <div 
              key={i} 
              className="flex flex-col justify-between gap-5 bg-white/[0.02] border border-white/[0.06] hover:border-[#C8A96E]/30 p-6 rounded-lg transition-all duration-300"
            >
              <div className="space-y-3">
                {/* Stars + Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-[#C8A96E] text-xs" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                    Verified
                  </span>
                </div>

                <blockquote className="text-zinc-200 font-light leading-relaxed text-sm italic">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
              </div>

              <div className="border-t border-zinc-900/80 pt-4">
                <p className="text-white text-xs font-semibold">{review.author}</p>
                <p className="text-[#aaa49a] text-xs mt-0.5">{review.role}</p>
                <p className="text-zinc-600 text-[11px] mt-1">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual pause — horizontal rule */}
      <div className="border-t border-zinc-900 mx-6 lg:mx-16" aria-hidden="true" />

      {/* Quiet conversion zone — 2-Column Luxury Consultation Studio */}
      <div id="directions" className="container mx-auto px-6 lg:px-16 py-20 lg:py-28 scroll-mt-24">
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

              {/* Google Maps Visual with Native Google Card */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl h-[340px] sm:h-[360px]">
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
