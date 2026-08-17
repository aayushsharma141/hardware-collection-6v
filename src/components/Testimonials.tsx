"use client";

import React from "react";
import { Star, MessageSquareQuote, CheckCircle2, Award, Users } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      author: "Rajiv Sharma",
      role: "Architect & Interior Consultant, Bistupur",
      rating: 5,
      date: "February 2026",
      verified: true,
      text: "Best showroom in Jamshedpur for genuine Hafele and Dorset fittings. Mukesh ji understands technical blueprints and helped our team specify complete soft-close wardrobe channels and magnetic locks. Zero hassle."
    },
    {
      author: "Anita Sen",
      role: "Homeowner, Circuit House Area",
      rating: 5,
      date: "January 2026",
      verified: true,
      text: "We renovated our modular kitchen and bought all Hafele tandem drawers and Labacha quartz sink from Hardware Collection Sakchi. The guidance on finish durability was spot on. Highly recommended!"
    },
    {
      author: "Vikramaditya Roy",
      role: "Civil Contractor & Builder, Adityapur",
      rating: 5,
      date: "December 2025",
      verified: true,
      text: "Reliable bulk pricing and same-day availability for Dorset digital door locks and heavy mortise handles. Their 7,500 sq ft showroom has the largest physical stock display in the entire district."
    }
  ];

  return (
    <section id="reviews" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-[var(--color-accent)]/50 rounded-none px-4 py-1.5 text-xs font-bold text-[var(--color-accent)] tracking-widest bg-black/60 uppercase mb-4">
          <Star className="w-3.5 h-3.5 fill-[var(--color-accent)]" />
          Verified Google Reviews & Ratings
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
          Trusted by Jamshedpur Since 2002
        </h2>
        <p className="font-body text-sm md:text-base text-[#ACACAC] max-w-2xl mx-auto">
          Over two decades of genuine service, transparent pricing, and direct manufacturer relationships in Sakchi.
        </p>
      </div>

      {/* Aggregate Score Bar */}
      <div className="max-w-3xl mx-auto bg-zinc-950/80 border border-[var(--color-accent)]/30 rounded-sm p-6 md:p-8 backdrop-blur-xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl md:text-5xl font-bold font-display text-[var(--color-accent)]">
            4.4
          </div>
          <div>
            <div className="flex items-center gap-1 text-[var(--color-accent)] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[var(--color-accent)]" />
              ))}
            </div>
            <div className="font-body text-xs text-zinc-400">
              Based on <strong>55+ Verified Customer Reviews</strong> on Google Maps
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-center sm:justify-start">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-zinc-300" />
          </div>
          <div className="text-left">
            <div className="font-body font-bold text-xs text-white">100% Genuine Brands</div>
            <div className="font-body text-[0.7rem] text-zinc-400">Authorized Dealer Protection</div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="bg-zinc-950/80 border border-zinc-800/90 rounded-sm p-6 backdrop-blur-xl flex flex-col justify-between hover:border-[var(--color-accent)]/40 transition-all group"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1 text-[var(--color-accent)]">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[var(--color-accent)]" />
                  ))}
                </div>
                <span className="text-[0.7rem] text-zinc-500 font-body">{rev.date}</span>
              </div>

              <p className="font-body text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 italic">
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
              <div>
                <div className="font-body font-bold text-xs text-white group-hover:text-[var(--color-accent)] transition-colors">
                  {rev.author}
                </div>
                <div className="font-body text-[0.65rem] text-zinc-400">
                  {rev.role}
                </div>
              </div>

              {rev.verified && (
                <span className="inline-flex items-center gap-1 text-[0.6rem] text-zinc-300 font-body font-semibold bg-zinc-900/50 px-2 py-0.5 rounded border border-zinc-700/50">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
