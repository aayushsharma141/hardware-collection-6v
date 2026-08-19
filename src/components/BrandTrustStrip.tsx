"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function BrandTrustStrip() {
  const brands = [
    {
      name: "Häfele",
      slug: "hafele",
      logo: "/brands/Hafele.png",
      tagline: "German Architectural & Kitchen Fittings",
      status: "Authorized Partner"
    },
    {
      name: "Dorset",
      slug: "dorset",
      logo: "/brands/dorset-seeklogo.svg",
      tagline: "Digital Locks & Architectural Mortise",
      status: "Authorized Dealer"
    },
    {
      name: "Labacha",
      slug: "labacha",
      logo: "/brands/labacha_logo.webp",
      tagline: "Quartz Sinks & Premium Bath Mixers",
      status: "Authorized Distributor"
    },
    {
      name: "Hettich",
      slug: "hettich",
      logo: "/brands/Hettich.svg",
      tagline: "Sliding Systems & German Drawer Hardware",
      status: "Authorized Dealer"
    },
    {
      name: "Godrej",
      slug: "godrej",
      logo: "/brands/Godrej.svg",
      tagline: "Smart Biometric & Digital Security",
      status: "Authorized Distributor"
    },
    {
      name: "Kich",
      slug: "kich",
      logo: "",
      tagline: "AISI 316 Stainless Architectural Fittings",
      status: "Authorized Dealer"
    }
  ];

  return (
    <section className="py-16 border-y border-zinc-800 bg-zinc-950/90 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b border-zinc-850">
          <div>
            <span className="font-body text-xs font-bold text-[var(--color-accent)] tracking-[0.25em] uppercase mb-2 block">
              The Authorized Advantage
            </span>
            <h2 className="font-display text-2xl md:text-4xl text-white font-bold tracking-tight">
              Official Multi-Brand Showroom in Jamshedpur
            </h2>
            <p className="font-body text-xs md:text-sm text-zinc-400 mt-2 max-w-xl">
              German engineering and trusted Indian manufacturers, curated under one roof with direct factory warranty.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-body font-bold text-white hover:text-[var(--color-accent)] uppercase tracking-widest transition-colors shrink-0"
          >
            Explore All Brands <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/collections?brand=${brand.slug}`}
              className="bg-zinc-900/60 border border-zinc-800/90 hover:border-[var(--color-accent)]/50 rounded-sm p-4 transition-all duration-300 flex flex-col justify-between group hover:bg-zinc-900"
            >
              <div className="bg-white rounded-sm p-3 w-full h-16 flex items-center justify-center mb-3 shadow group-hover:scale-105 transition-transform overflow-hidden">
                <div className="relative w-full h-full">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} Authorized Dealer`}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-zinc-800 font-display font-bold text-lg">{brand.name}</div>
                  )}
                </div>
              </div>
              
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold font-body uppercase text-[var(--color-accent)] tracking-wider mb-1">
                  <ShieldCheck className="w-3 h-3" /> {brand.status}
                </span>
                <p className="font-body text-[11px] text-zinc-400 leading-tight line-clamp-2">
                  {brand.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
