"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  UserCheck,
  Package,
  Headphones,
  MapPin,
} from "lucide-react";

interface TrustPillar {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    id: "dealer",
    title: "AUTHORISED DEALER",
    subtitle: "100% Genuine Products",
    icon: ShieldCheck,
  },
  {
    id: "brands",
    title: "PREMIUM BRANDS",
    subtitle: "World-class Hardware",
    icon: Award,
  },
  {
    id: "guidance",
    title: "EXPERT GUIDANCE",
    subtitle: "Personalised Consultation",
    icon: UserCheck,
  },
  {
    id: "range",
    title: "WIDE RANGE",
    subtitle: "Complete Solutions",
    icon: Package,
  },
  {
    id: "support",
    title: "RELIABLE SUPPORT",
    subtitle: "After-sales Assistance",
    icon: Headphones,
  },
  {
    id: "showroom",
    title: "VISIT SHOWROOM",
    subtitle: "Sakchi, Jamshedpur",
    icon: MapPin,
  },
];

export default function HeroTrustBadges() {
  return (
    <section
      aria-label="Showroom Trust Indicators"
      className="w-full bg-[#fbf5ea] border-b border-[#1a1017]/[0.08] py-8 lg:py-10 relative z-10"
    >
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-0 lg:divide-x lg:divide-[#1a1017]/[0.08]">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="flex flex-col items-center text-center px-3 lg:px-4 group"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#c8a96e]/10 text-[#c8a96e] group-hover:bg-[#8b1a42]/10 group-hover:text-[#8b1a42] group-hover:scale-110 transition-all duration-300 mb-3.5">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="hc-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#1a1017] mb-1 group-hover:text-[#8b1a42] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#7a6872] font-light leading-relaxed">
                  {pillar.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
