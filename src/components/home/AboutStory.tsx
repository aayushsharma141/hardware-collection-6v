"use client";

import React from "react";
import Image from "next/image";
import { Award, Compass, Store } from "lucide-react";

interface AboutStoryProps {
  id?: string;
  showroomHours?: string;
  legacyYearsOfTrust?: number;
  legacyBrandsCount?: number;
  legacyShowroomImageUrl?: string;
}

const VALUE_PILLARS = [
  {
    icon: Award,
    title: "Curated Selection",
    description: "Premium brands, handpicked for modern spaces.",
  },
  {
    icon: Compass,
    title: "Expert Guidance",
    description: "Personalized advice for homes and projects.",
  },
  {
    icon: Store,
    title: "Physical Showroom",
    description: "Experience and compare before you decide.",
  },
];

export default function AboutStory({
  id = "about",
  legacyShowroomImageUrl: _legacyShowroomImageUrl,
}: AboutStoryProps) {
  const imageUrl = "/cinema/hero/HC-01-HERO-02.png";

  return (
    <section
      id={id}
      className="py-12 lg:py-20 bg-[var(--surface)] border-b border-[var(--border)] relative z-10 scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Architectural Photograph */}
          <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden border border-[var(--border)] bg-neutral-900">
            <Image
              src={imageUrl}
              alt="Architectural brass hardware detail"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
            />
          </div>

          {/* Right Column: Narrative & 3 Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="hc-mono text-[10.5px] uppercase tracking-[0.24em] font-semibold text-[var(--color-wine)] mb-1.5">
              Why Hardware Collection
            </p>
            <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-[1.05] tracking-tight mb-5 sm:mb-8">
              More than hardware.
              <br />
              A better experience.
            </h2>

            {/* 3 Pillars matching Reference Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pt-1 divide-y sm:divide-y-0 divide-[var(--border)]/60">
              {VALUE_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-row sm:flex-col items-start gap-3.5 sm:gap-0 py-3.5 sm:py-0"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-brass)]/15 border border-[var(--color-brass)]/30 flex items-center justify-center text-[var(--color-brass-ink)] shrink-0 sm:mb-3 mt-0.5 sm:mt-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="hc-serif text-base sm:text-xl font-normal text-[var(--text-primary)] mb-0.5 sm:mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-[32ch]">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
