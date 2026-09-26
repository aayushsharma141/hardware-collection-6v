"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HeroSlide } from "@/types/hero";
import { SHOWROOM_MAP_URL } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MobileHeroProps {
  slides: HeroSlide[];
}

/**
 * MobileHero &mdash; the first viewport for most of the audience.
 *
 * The photograph carries the frame. An earlier version laid a 42%-wide panel
 * and a hard-edged product rectangle over it; both cut visible seams straight
 * through the headline and the primary button, so the composition is now a
 * single full-bleed image under a bottom-weighted scrim, with one horizontal
 * brass hairline as the only drawn geometry.
 */
export default function MobileHero({ slides }: MobileHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const heroImage = containerRef.current.querySelector(".mobile-hero-bg");
      const heroH1 = containerRef.current.querySelector(".mobile-hero-h1");
      const heroContent = containerRef.current.querySelectorAll(".mobile-hero-fade");

      // Scroll-linked parallax
      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { scale: 1.03, y: 0 },
          {
            scale: 1.0,
            y: "5%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Entrance animation
      const tl = gsap.timeline();

      if (heroH1) {
        tl.fromTo(
          heroH1,
          { y: "100%" },
          { y: "0%", duration: 1.2, ease: "power4.out" },
          0.1
        );
      }

      if (heroContent.length > 0) {
        tl.fromTo(
          heroContent,
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
          0.3
        );
      }
    },
    { scope: containerRef, dependencies: [currentSlideIndex] }
  );

  if (!slides || slides.length === 0) return null;
  const slide = slides[currentSlideIndex] || slides[0];

  const heading = slide.title || "The Art of\nthe Finish.";
  const ctaLabel = slide.primaryCta || "Explore Collections";
  const ctaHref = slide.ctaTarget || "/collections";
  const isExternalCta = /^https?:\/\//.test(ctaHref);

  return (
    <section ref={containerRef} data-nav-hero className="relative w-full min-h-[92svh] flex flex-col justify-end pt-16 pb-10 px-6 lg:hidden overflow-hidden bg-[var(--surface)]">
      {/* Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          key={`mob-bg-${currentSlideIndex}`}
          src={slide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
          alt="Brass lever handle on a dark door in the Hardware Collection showroom"
          fill
          priority
          sizes="100vw"
          className="mobile-hero-bg object-cover will-change-transform transition-opacity duration-500
            sepia-[0.22] saturate-[1.25] contrast-[1.04] brightness-[1.02]"
        />
        {/* The photograph is a cold blue-grey macro; the sepia grade above pulls it
            into the ivory palette and this scrim seats it, rather than leaving the top
            of the screen reading as fog behind the navbar. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/85 via-45% to-[var(--surface)]/28" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="mobile-hero-fade h-px w-full bg-gradient-to-r from-[#c8a96e]/70 to-transparent mb-5" />

        <div className="flex items-center justify-between mb-4">
          <p className="mobile-hero-fade hc-mono t-eyebrow text-brass-ink">
            {slide.eyebrow || "Architectural Hardware Experts · 10+ Years"}
          </p>
          {slides.length > 1 && (
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                /* The visible bar is 6px tall. The pseudo-element carries the
                   touch target out to a comfortable size without changing the
                   layout or the mark itself. */
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`hc-focus relative h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] before:absolute before:-inset-x-1.5 before:-inset-y-5 before:content-[''] ${
                    currentSlideIndex === idx ? "w-6 bg-[#8b1a42]" : "w-2 bg-[#1a1017]/20"
                  }`}
                  aria-label={`Show slide ${idx + 1} of ${slides.length}`}
                  aria-current={currentSlideIndex === idx}
                />
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden mb-6 pb-1">
          <h1 className="mobile-hero-h1 hc-serif t-display font-light text-[var(--text-primary)] whitespace-pre-line">
            {heading}
          </h1>
        </div>

        <p className="mobile-hero-fade t-body max-w-[45ch] font-light text-[var(--text-secondary)] mb-9">
          {slide.description ||
            "Architectural hardware chosen for spaces that deserve better details."}
        </p>

        <div className="mobile-hero-fade flex flex-col gap-4">
          {isExternalCta ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="brass-plate hc-focus h-[56px] w-full bg-[#8b1a42] text-white t-button uppercase tracking-[0.16em] flex items-center justify-center gap-3 no-underline hover:bg-[#6b1432] rounded shadow-[0_10px_28px_-12px_rgba(139,26,66,0.55)] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] motion-reduce:active:scale-100"
            >
              <span>{ctaLabel}</span>
              <ArrowRight />
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="brass-plate hc-focus h-[56px] w-full bg-[#8b1a42] text-white t-button uppercase tracking-[0.16em] flex items-center justify-center gap-3 no-underline hover:bg-[#6b1432] rounded shadow-[0_10px_28px_-12px_rgba(139,26,66,0.55)] transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] motion-reduce:active:scale-100"
            >
              <span>{ctaLabel}</span>
              <ArrowRight />
            </Link>
          )}

          <a
            href={SHOWROOM_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rail-button hc-focus min-h-[44px] self-start text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] flex items-center gap-2 no-underline transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <span>Get showroom directions</span>
            <svg
              className="w-4 h-4 text-[#8b1a42]"
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
      className="w-4 h-4 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}


