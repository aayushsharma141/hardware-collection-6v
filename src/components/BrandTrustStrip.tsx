"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Award, CheckCircle2 } from "lucide-react";

export default function BrandTrustStrip() {
  const brands = [
    {
      name: "Hafele",
      logo: "/brands/Hafele.png",
      tagline: "German Architectural & Kitchen Hardware",
      authorized: "Authorized Partner",
      scale: "w-28 h-10",
      paddings: "p-3"
    },
    {
      name: "Dorset",
      logo: "/brands/dorset-seeklogo.svg",
      tagline: "Digital Locks & Architectural Mortise",
      authorized: "Authorized Dealer",
      scale: "w-28 h-10",
      paddings: "p-4"
    },
    {
      name: "Labacha",
      logo: "/brands/labacha_logo.webp",
      tagline: "Luxury Granite Sinks & Bath Mixers",
      authorized: "Authorized Distributor",
      scale: "w-28 h-10",
      paddings: "p-3"
    },
    {
      name: "Hettich",
      logo: "/brands/Hettich.svg",
      tagline: "Sliding Systems & German Drawer Fittings",
      authorized: "Authorized Dealer",
      scale: "w-28 h-10",
      paddings: "p-3"
    },
    {
      name: "Godrej",
      logo: "/brands/Godrej.svg",
      tagline: "India's Trusted Smart Biometric Security",
      authorized: "Authorized Distributor",
      scale: "w-28 h-10",
      paddings: "p-3"
    },
    {
      name: "Kich",
      logo: "", // [NEEDS INPUT — Mukesh] Please provide Kich logo
      tagline: "Architectural Hardware & Balustrade Systems",
      authorized: "Authorized Dealer",
      scale: "w-28 h-10",
      paddings: "p-3"
    }
  ];

  return (
    <section className="py-12 border-y border-[var(--color-accent)]/20 bg-zinc-950/90 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-body font-bold text-xs uppercase tracking-widest text-[var(--color-accent)]">
                The Authorized Advantage
              </div>
              <h3 className="font-display text-xl md:text-2xl text-white font-semibold">
                Official Multi-Brand Showroom in Jamshedpur
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-body">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-zinc-300" /> 100% Genuine Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-zinc-300" /> Direct Manufacturer Pricing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-zinc-300" /> On-Site Installation Support
            </span>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-[var(--color-accent)]/40 rounded-sm p-4 transition-all duration-300 flex flex-col items-center text-center group hover:bg-zinc-900"
            >
              <div className="bg-white rounded-sm p-3 w-full h-16 flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <div className="relative w-full h-full">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} Authorized Dealer Jamshedpur`}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-zinc-400 font-display font-semibold text-lg">{brand.name}</div>
                  )}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold font-body uppercase text-[var(--color-accent)] tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3 text-[var(--color-accent)]" /> {brand.authorized}
              </span>
              <p className="font-body text-[0.7rem] text-zinc-400 leading-tight line-clamp-1">
                {brand.tagline}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
