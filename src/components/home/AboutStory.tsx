"use client";

import React from "react";
import { LazyImage as Image } from "@/components/ui/lazy-image";
import { Award, Compass, ShieldCheck, Store } from "lucide-react";
import { pillarGridClass, resolvePillars, type StudioPillar } from "./pillars";

interface AboutStoryProps {
  id?: string;
  showroomHours?: string;
  legacyYearsOfTrust?: number;
  legacyBrandsCount?: number;
  legacyShowroomImageUrl?: string;
  /** Studio: Home Page > Legacy Pillars. */
  legacyPillars?: StudioPillar[];
}

/** Icons are not editable in Studio: they follow the pillar's position. */
const PILLAR_ICONS = [Award, Compass, Store, ShieldCheck];

export default function AboutStory({
  id = "about",
  legacyShowroomImageUrl,
  legacyPillars,
}: AboutStoryProps) {
  const pillars = resolvePillars(legacyPillars);
  const imageUrl = legacyShowroomImageUrl || "/cinema/hero/HC-01-HERO-02.png";

  return (
    <section
      id={id}
      className="py-12 lg:py-20 bg-transparent border-b border-[var(--border)] relative z-10 scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Architectural Photograph */}
          <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-[0_8px_30px_rgba(26,16,23,0.04)]">
            <Image
              src={imageUrl}
              alt="Architectural brass hardware detail"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] hc-mono text-white/90 select-none">
              Sakchi Showroom Detail
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-[1.08] tracking-tight mb-5 sm:mb-8 text-balance">
              More than hardware.
              <br />
              A better experience.
            </h2>

            {/* Pillars with refined architectural marks */}
            <div className={`grid grid-cols-1 ${pillarGridClass(pillars.length)} gap-1 sm:gap-6 pt-1 divide-y sm:divide-y-0 divide-[var(--border)]/60`}>
              {pillars.map((pillar, idx) => {
                const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
                return (
                  <div
                    key={pillar.key}
                    className="flex flex-row sm:flex-col items-start gap-3.5 sm:gap-0 py-3.5 sm:py-0"
                  >
                    <div className="text-[var(--color-brass-ink)] shrink-0 sm:mb-3.5 mt-0.5 sm:mt-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="hc-serif text-base sm:text-xl font-normal text-[var(--text-primary)] mb-0.5 sm:mb-1">
                        {pillar.title}
                      </h3>
                      {pillar.description ? (
                        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed max-w-[32ch] text-pretty">
                          {pillar.description}
                        </p>
                      ) : null}
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
