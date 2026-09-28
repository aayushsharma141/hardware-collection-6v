"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

interface TrustPillar {
  _key: string;
  title: string;
  description: string;
  icon: string;
}

interface HeroTrustBadgesProps {
  pillars?: TrustPillar[];
}

// Fallback just in case sanity data is missing
const DEFAULT_PILLARS = [
  { _key: "p1", title: "AUTHORIZED DEALER", description: "100% Genuine Products", icon: "ShieldCheck" },
  { _key: "p2", title: "PREMIUM BRANDS", description: "World-class Hardware", icon: "Award" },
];

export default function HeroTrustBadges({ pillars = DEFAULT_PILLARS }: HeroTrustBadgesProps) {
  const displayPillars = pillars?.length > 0 ? pillars : DEFAULT_PILLARS;

  return (
    <section
      aria-label="Showroom Trust Indicators"
      className="w-full bg-[#fbf5ea] border-b border-[#1a1017]/[0.08] py-8 lg:py-10 relative z-10"
    >
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-5 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-[#1a1017]/[0.08]">
          {displayPillars.map((pillar) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[pillar.icon] || LucideIcons.ShieldCheck;
            return (
              <div
                key={pillar._key}
                className="flex items-center gap-3 text-left sm:flex-col sm:gap-0 sm:text-center sm:px-3 lg:px-4 group"
              >
                <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center bg-[#c8a96e]/10 text-[#c8a96e] group-hover:bg-[#8b1a42]/10 group-hover:text-[#8b1a42] group-hover:scale-110 transition-all duration-300 sm:mb-3.5">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                </div>
                <div className="min-w-0">
                  <h3 className="hc-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#1a1017] mb-1 group-hover:text-[#8b1a42] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#7a6872] font-light leading-snug sm:leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
