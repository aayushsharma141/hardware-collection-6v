"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  label: string;
  href: string;
}

const SHOWROOM_HOTSPOTS: Hotspot[] = [
  { id: "wardrobe", x: 65, y: 35, label: "Wardrobe & Furniture", href: "#wardrobe-furniture" },
  { id: "door", x: 82, y: 55, label: "Door & Entry", href: "#door-entry" },
  { id: "kitchen", x: 25, y: 70, label: "Kitchen", href: "#kitchen" },
  { id: "glass", x: 45, y: 20, label: "Glass & Architectural", href: "#glass-architectural" },
];

export default function ShowroomLens() {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Context */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="hc-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-[#c8a96e] mb-3 block">
              Showroom Lens
            </span>
            <h2 className="hc-serif text-3xl sm:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] mb-6">
              Explore by space
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-md">
              Hardware doesn&apos;t exist in isolation. Experience how our collections integrate seamlessly across the architectural spaces of your home.
            </p>
          </div>

          {/* Interactive Cinematic Image */}
          <div className="lg:col-span-8 relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm border border-[var(--border)]">
            <Image
              src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=85&w=1600"
              alt="Architectural Showroom Interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Subtle Overlay to ensure contrast */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Hotspots */}
            {SHOWROOM_HOTSPOTS.map((hotspot) => {
              const isHovered = hoveredHotspot === hotspot.id;
              
              return (
                <div
                  key={hotspot.id}
                  className="absolute z-10"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  {/* Dot */}
                  <Link
                    href={hotspot.href}
                    className="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-4 group cursor-pointer"
                    aria-label={`Explore ${hotspot.label}`}
                  >
                    <span className="absolute w-3 h-3 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.4)] z-20" />
                    <span className="absolute w-3 h-3 bg-white rounded-full animate-ping opacity-50 z-10" />
                    <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                  </Link>

                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0, 
                      y: isHovered ? 0 : 10,
                      scale: isHovered ? 1 : 0.95
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`absolute left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-md shadow-xl pointer-events-none ${!isHovered ? 'hidden' : ''}`}
                  >
                    <span className="hc-mono text-[10px] sm:text-xs uppercase tracking-widest text-white">
                      {hotspot.label}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
