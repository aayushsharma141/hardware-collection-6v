"use client";

import React from "react";
import Image from "next/image";
import { 
  Building, 
  MessageCircle, 
  Sparkles, 
  Navigation, 
  Check,
  Compass
} from "lucide-react";
import { SHOWROOM_STATS, SERVICE_AREAS } from "../data/catalog";

export default function ShowroomExperience() {
  return (
    <section id="showroom" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 border border-[var(--color-accent)]/50 rounded-none px-4 py-1.5 text-xs font-bold text-[var(--color-accent)] tracking-widest bg-black/60 uppercase mb-4">
          <Building className="w-3.5 h-3.5" />
          The Ground Reality & Experience
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
          Visit Our Flagship Sakchi Showroom
        </h2>
        <p className="font-body text-sm md:text-base text-[#ACACAC] max-w-2xl mx-auto">
          Experience the physical touch and silent operation of German soft-close drawers, live biometric lock demos, and custom luxury kitchen setups in Sakchi.
        </p>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {SHOWROOM_STATS.map((stat, i) => (
          <div
            key={i}
            className="bg-zinc-950/80 border border-zinc-800 p-6 rounded-sm text-center backdrop-blur-xl relative overflow-hidden group hover:border-[var(--color-accent)]/50 transition-all"
          >
            <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-1">
              {stat.value}
            </div>
            <div className="font-body font-bold text-xs uppercase text-white tracking-wider mb-1">
              {stat.label}
            </div>
            <div className="font-body text-[0.7rem] text-zinc-400">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Showroom Narrative & Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        
        {/* Left Column: Visual Photos */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative h-64 sm:h-80 rounded-sm overflow-hidden border border-zinc-800 shadow-2xl group">
            <Image
              src="/Hardware Collection/hardware_collection_sakchi_shop_exterior_view.png"
              alt="Hardware Collection Sakchi Exterior Showroom View"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
              <span className="font-body font-bold text-xs text-white">Sakchi Flagship Façade</span>
              <span className="font-body text-[0.65rem] text-[var(--color-accent)]">Near Durga Puja Maidan, Kashidih</span>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 rounded-sm overflow-hidden border border-zinc-800 shadow-2xl group sm:mt-6">
            <Image
              src="/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg"
              alt="Hardware Collection Sakchi Interior Display"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
              <span className="font-body font-bold text-xs text-white">Live Consultation Gallery</span>
              <span className="font-body text-[0.65rem] text-[var(--color-accent)]">Hafele & Dorset Live Experience</span>
            </div>
          </div>
        </div>

        {/* Right Column: Founder & Story */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-zinc-950/80 border border-zinc-800/90 rounded-sm p-8 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 text-xs font-body font-bold uppercase text-[var(--color-accent)] tracking-wider">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            20+ Years in Sakchi
          </div>

          <h3 className="font-display text-2xl md:text-3xl text-white font-semibold leading-snug">
            From a 113 sq ft shop in 2002 to Jamshedpur&apos;s leading architectural destination.
          </h3>

          <p className="font-body text-sm text-zinc-300 leading-relaxed">
            Founded by <strong className="text-white">Mukesh Khandelwal</strong>, Hardware Collection was built on a single steadfast principle: <em className="text-[var(--color-accent)]">never sell grey-market hardware; only deliver genuine, authorized brand engineering with hands-on consultation</em>.
          </p>

          <p className="font-body text-xs text-zinc-400 leading-relaxed">
            Today, homeowners, leading architects, and top builders from across East Singhbhum visit our Sakchi showroom to test live biometric locks, slide German-engineered wardrobes, and finalize modular kitchen blueprints before installation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-200">
              <Check className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>Full Live Mockup Kitchens</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-200">
              <Check className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>Working Smart Deadbolt Demos</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-200">
              <Check className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>Architect Blueprint Consultation</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-200">
              <Check className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>Comprehensive Physical Displays</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-900">
            <a
              href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-zinc-900 border border-zinc-700 hover:border-[var(--color-accent)] text-white font-body font-bold text-xs tracking-wide transition-all hover:scale-105"
            >
              <Navigation className="w-4 h-4 text-[#ff3b5c]" />
              GET SHOWROOM DIRECTIONS
            </a>

            <a
              href="https://wa.me/919835190738?text=Hi%20Mukesh%20ji%2C%20I%20would%20like%20to%20book%20a%20showroom%20consultation%20visit."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)] to-[var(--color-accent)] text-black font-body font-bold text-xs tracking-wide shadow-lg hover:scale-105 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              BOOK CONSULTATION VISIT
            </a>
          </div>

        </div>

      </div>

      {/* Service Coverage Radius in Jamshedpur */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-sm p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[var(--color-accent)]" />
            <div>
              <h4 className="font-body font-bold text-sm text-white uppercase tracking-wider">
                Direct Supply & Installation Coverage
              </h4>
              <p className="font-body text-xs text-zinc-400">
                Serving residential & commercial architectural hardware throughout Jamshedpur & surrounding industrial nodes
              </p>
            </div>
          </div>
          <span className="text-[0.65rem] font-bold font-body text-zinc-300 bg-zinc-900/60 border border-zinc-700/60 px-3 py-1 rounded-none uppercase tracking-wider">
            Authorized Showroom Supply
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SERVICE_AREAS.map((area, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-body text-zinc-300 hover:border-[var(--color-accent)]/50 hover:text-white transition-colors"
            >
              📍 {area}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
