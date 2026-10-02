"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { buildGeneralInquiryWhatsappLink } from "@/lib/integrations/whatsapp";
import { useGSAP, gsap, DURATION, EASE, prefersReducedMotion } from "@/lib/animations";

export interface CollectionsHeroProps {
  collectionCount: number;
  brandCount?: number;
  yearsClaimConfirmed?: boolean;
  whatsappNumber?: string;
}

// A real photograph of the showroom wall, not a render.
const SHOWROOM_WALL = "/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg";

export default function CollectionsHero({
  collectionCount,
  yearsClaimConfirmed = false,
  whatsappNumber,
}: CollectionsHeroProps) {
  const whatsappUrl = buildGeneralInquiryWhatsappLink(whatsappNumber);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    const tl = gsap.timeline({ defaults: { ease: EASE.LUXURY, duration: DURATION.SLOW } });
    
    tl.fromTo(
      ".hero-reveal",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, delay: 0.15 }
    );
    
    tl.fromTo(
      ".hero-image",
      { scale: 0.95, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: DURATION.HERO },
      "-=0.4"
    );
  }, { scope: containerRef });

  const stats = [
    collectionCount > 0 ? `${collectionCount} COLLECTIONS` : null,
    "AUTHORIZED GLOBAL BRANDS",
    yearsClaimConfirmed ? "10+ YEARS OF EXPERTISE" : null,
  ].filter(Boolean) as string[];

  return (
    <section ref={containerRef} className="relative pt-16 pb-20 md:pt-28 md:pb-32 border-b border-[var(--border)] overflow-hidden">
      {/* lg+: copy left, real showroom photography right. Below lg the photo is
          dropped so the mobile hero stays one screen of text and CTAs. */}
      <div className="max-w-[1320px] mx-auto px-6 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center">
        <div className="max-w-4xl lg:col-span-7">
          {/* Eyebrow */}
          <span className="hero-reveal hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-brass-ink mb-4 block">
            ARCHITECTURAL HARDWARE · SAKCHI · JAMSHEDPUR
          </span>

          {/* Title */}
          <h1 className="hero-reveal hc-serif text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-light tracking-[-0.01em] text-[var(--text-primary)] uppercase leading-[0.95] mb-6">
            COLLECTIONS
          </h1>

          {/* Supporting Copy */}
          <p className="hero-reveal text-base sm:text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed mb-10 max-w-3xl">
            Hardware for considered spaces.
            <br />
            Explore the showroom.
          </p>

          {/* Quiet control instead of giant buttons */}
          <div className="hero-reveal flex mb-12">
            <Link
              href="#catalogue"
              className="hc-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium text-[var(--color-brass)] hover:text-[var(--text-primary)] transition-colors border-b border-[var(--color-brass)] pb-1"
            >
              EXPLORE &darr;
            </Link>
          </div>

          {/* Live Stat Row (Omit-on-zero) */}
          {stats.length > 0 && (
            <div className="hero-reveal flex flex-wrap items-center gap-6 pt-6 border-t border-[var(--border)]">
              {stats.map((stat, idx) => (
                <div key={stat} className="flex items-center gap-6">
                  <span className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.2em] font-medium text-brass-ink">
                    {stat}
                  </span>
                  {idx < stats.length - 1 && (
                    <span className="h-3.5 w-px bg-[var(--text-secondary)]/25" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <figure className="hero-image hidden lg:block lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded border border-[var(--border)] bg-[var(--surface-raised)] shadow-[0_24px_60px_rgba(26,16,23,0.10)]">
            <Image
              src={SHOWROOM_WALL}
              alt="Cabinet handles and pulls in brass, matte black and ivory finishes on the Hardware Collection showroom wall in Sakchi"
              fill
              priority
              sizes="(min-width: 1320px) 500px, 40vw"
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(1.03)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 via-35% to-transparent" aria-hidden="true" />
            <figcaption className="absolute left-5 bottom-5 right-5 flex items-end justify-between gap-4 text-white">
              <span>
                <span className="hc-mono block text-[10px] uppercase tracking-[0.22em] text-white/75">On display</span>
                <span className="hc-serif block text-2xl leading-tight">The Sakchi showroom</span>
              </span>
              <Link
                href="/#showroom"
                className="hc-focus shrink-0 rounded border border-white/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-white hover:text-[#1a1017] transition-colors"
              >
                Visit
              </Link>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}


