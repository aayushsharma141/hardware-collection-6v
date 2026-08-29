import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSlide } from "@/types/hero";
import { SHOWROOM_MAP_URL } from "@/lib/config";

interface MobileHeroProps {
  slides: HeroSlide[];
}

/**
 * MobileHero — the first viewport for most of the audience.
 *
 * The photograph carries the frame. An earlier version laid a 42%-wide panel
 * and a hard-edged product rectangle over it; both cut visible seams straight
 * through the headline and the primary button, so the composition is now a
 * single full-bleed image under a bottom-weighted scrim, with one horizontal
 * brass hairline as the only drawn geometry.
 */
export default function MobileHero({ slides }: MobileHeroProps) {
  if (!slides || slides.length === 0) return null;
  const slide = slides[0];

  const heading = slide.title || "The Art of\nthe Finish.";
  const ctaLabel = slide.primaryCta || "Explore collections";
  const ctaHref = slide.ctaTarget || "/collections";
  const isExternalCta = /^https?:\/\//.test(ctaHref);

  return (
    <section className="relative w-full min-h-[92svh] flex flex-col justify-end pt-16 pb-10 px-6 lg:hidden overflow-hidden bg-[#090909]">
      {/* Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
          alt="Brass lever handle on a dark door in the Hardware Collection showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Bottom-weighted scrim: the copy sits in the darkest part of the
            frame, so contrast holds regardless of which photograph an editor
            publishes from Sanity. Kept to a single pass — stacking a dimmed
            image under two gradients took the photograph to near-black and
            threw away the one thing carrying the viewport. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/85 via-45% to-[#090909]/15" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="h-px w-full bg-gradient-to-r from-[#c8a96e]/70 to-transparent mb-5" />

        <p className="hc-mono text-[10px] uppercase tracking-[0.22em] leading-[1.7] text-[#c8a96e] mb-4">
          {slide.eyebrow || "Sakchi · Jamshedpur"}
        </p>

        <h1 className="hc-serif text-[46px] xs:text-[52px] leading-[0.9] font-normal tracking-[0.02em] text-[#e8e3d9] mb-5 whitespace-pre-line">
          {heading}
        </h1>

        <p className="max-w-[320px] text-[13.5px] leading-[1.6] font-light text-[#d1ccc4] mb-8">
          {slide.description ||
            "Architectural hardware chosen for spaces that deserve better details."}
        </p>

        <div className="flex flex-col gap-4">
          {isExternalCta ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="brass-plate hc-focus h-[52px] w-full bg-[#c8a96e] text-[#090909] text-[11px] font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-3 no-underline"
            >
              <span>{ctaLabel}</span>
              <ArrowRight />
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="brass-plate hc-focus h-[52px] w-full bg-[#c8a96e] text-[#090909] text-[11px] font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-3 no-underline"
            >
              <span>{ctaLabel}</span>
              <ArrowRight />
            </Link>
          )}

          <a
            href={SHOWROOM_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rail-button hc-focus min-h-[44px] self-start text-[10px] uppercase tracking-[0.16em] text-[#e8e3d9] flex items-center gap-2 no-underline"
          >
            <span>Get showroom directions</span>
            <svg
              className="w-3.5 h-3.5 text-[#c8a96e]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      className="w-4 h-4 text-[#090909]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
