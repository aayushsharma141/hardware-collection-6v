"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { HeroSlide } from "@/types/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroStageProps {
  slides: HeroSlide[];
}

export default function HeroStage({ slides }: HeroStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!slides || slides.length === 0 || shouldReduceMotion || !containerRef.current) return;

      const aperture = apertureRef.current;
      const heroText = containerRef.current.querySelector(".hero-text-col");
      const bottomBar = containerRef.current.querySelector(".hero-bottom-bar");

      gsap.fromTo(
        heroText,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      if (aperture) {
        gsap.fromTo(
          aperture,
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 1, delay: 0.2, ease: "power2.out" }
        );
      }

      if (bottomBar) {
        gsap.fromTo(
          bottomBar,
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
      }
    },
    { scope: containerRef, dependencies: [currentSlideIndex, shouldReduceMotion, slides] }
  );

  if (!slides || slides.length === 0) return null;
  const currentSlide = slides[currentSlideIndex] || slides[0];

  // The hero used to hardcode its headline and eyebrow, so cycling the
  // specimen swapped the photograph and the body copy while the H1 stayed put —
  // the slide changed underneath a headline that claimed it had not.
  const ctaLabel = currentSlide.primaryCta || "Explore collections";
  const ctaHref = currentSlide.ctaTarget || "/collections";
  const isExternalCta = ctaHref.startsWith("http");

  return (
    <section
      ref={containerRef}
      data-chapter="1"
      className="hidden lg:block relative min-h-[840px] h-[100dvh] w-full border-b border-[#1a1017]/[0.10] overflow-hidden bg-[#fdf8f0]"
    >
      {/* Background Image — bright treatment, high opacity */}
      <img
        alt="Architectural brass hardware in the Hardware Collection showroom"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.18] will-change-transform"
        decoding="async"
        src={currentSlide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
      />
      <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#fdf8f0]/[0.95] via-[#fdf8f0]/[0.70] to-transparent" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-[80px] h-full flex flex-col justify-between pt-[110px] pb-[70px]">
        <div className="grid grid-cols-[minmax(460px,540px)_1fr] items-end gap-12 my-auto">
          {/* Left Column: Typography & CTAs */}
          <div className="hero-text-col pb-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 bg-[#8b1a42] shrink-0 rounded-full" />
              <p className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[#8b1a42]">
                {currentSlide.eyebrow || "Hardware Collection · Sakchi, Jamshedpur"}
              </p>
            </div>

            <h1 className="hc-serif text-[88px] xl:text-[104px] 2xl:text-[116px] leading-[0.88] font-light tracking-[-0.01em] text-[#1a1017] whitespace-pre-line">
              {currentSlide.title || "The Art of\nthe Finish."}
            </h1>

            <p className="mt-8 max-w-[480px] text-lg xl:text-xl leading-[1.65] font-light text-[#2e232b]">
              {currentSlide.description ||
                "Architectural hardware chosen for spaces that deserve better details. Official partner for Häfele, Dorset, Labacha, Godrej & Hettich in Sakchi."}
            </p>

            <div className="mt-10 flex items-center gap-6">
              {isExternalCta ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brass-plate hc-focus h-[56px] px-8 bg-[#8b1a42] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] flex items-center gap-4 no-underline hover:bg-[#6b1432] btn-tactile transition-premium rounded shadow-lg"
                >
                  <span>{ctaLabel}</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  className="brass-plate hc-focus h-[56px] px-8 bg-[#8b1a42] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] flex items-center gap-4 no-underline hover:bg-[#6b1432] btn-tactile transition-premium rounded shadow-lg"
                >
                  <span>{ctaLabel}</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}

              <a
                href="#directions"
                className="rail-button h-[56px] text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1a1017] flex items-center gap-2.5 no-underline hover:text-[#8b1a42] transition-colors"
              >
                <span>Get showroom directions</span>
                <svg className="w-4 h-4 text-[#8b1a42]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Product Aperture Card */}
          <div
            ref={apertureRef}
            aria-label="Hero product aperture"
            className="aperture relative justify-self-end h-[520px] w-[460px] xl:h-[580px] xl:w-[500px] border-x border-[#1a1017]/[0.10] bg-[#f8f6f6] overflow-hidden focus-within:border-[#8b1a42]/[0.60] shadow-lg"
            tabIndex={0}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[#8b1a42]/[0.50]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#8b1a42]/[0.25]" />
            <div className="absolute inset-y-0 left-0 w-px bg-[#8b1a42]/[0.15]" />

            <div className="absolute top-6 left-6 right-6 flex items-center justify-between hc-mono text-[9px] uppercase tracking-[0.2em] text-[#7a6872]">
              <span>Selected specimen</span>
              <span className="text-[#8b1a42] tabular-nums">
                {pad2(currentSlideIndex + 1)} / {pad2(slides.length)}
              </span>
            </div>

            <img
              alt="Close detail of a brass hardware finish"
              className="aperture-image absolute inset-[44px_24px_80px] h-[380px] xl:h-[430px] w-[410px] xl:w-[450px] object-contain mix-blend-multiply opacity-[0.88]"
              decoding="async"
              src={currentSlide.productUrl || "/cinema/hero/HC-01-HERO-03.png"}
            />

            <div className="aperture-sweep" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-[#1a1017]/[0.10] pt-4">
              <div>
                <p className="hc-mono text-[9px] uppercase tracking-[0.18em] text-[#7a6872]">
                  Finish study
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1017]">
                  Solid brass · PVD satin gold
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                aria-label="Next specimen"
                className="hc-focus p-2 text-[#8b1a42] hover:text-[#6b1432] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section Bottom Status Bar */}
        <div className="hero-bottom-bar border-t border-[#1a1017]/[0.10] h-[54px] flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <span className="hc-mono text-[10px] tracking-[0.16em] text-[#8b1a42] tabular-nums">
              {pad2(currentSlideIndex + 1)}
            </span>
            <span className="hc-mono text-[10px] tracking-[0.18em] text-[#7a6872] tabular-nums">
              / {pad2(slides.length)}
            </span>
            <span className="h-px w-12 bg-[#8b1a42]/[0.35]" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#7a6872]">
              The threshold
            </span>
          </div>

          <a
            href="#categories"
            className="hc-mono text-[10px] uppercase tracking-[0.18em] text-[#7a6872] hover:text-[#8b1a42] transition-colors no-underline"
          >
            Scroll to showroom families ↓
          </a>
        </div>
      </div>
    </section>
  );
}

/** Two-digit specimen index. `0{n}` produced "010" once a tenth slide existed. */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
