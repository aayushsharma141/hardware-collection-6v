"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { HeroSlide } from "@/types/hero";
import { generateWhatsAppUrl } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroStageProps {
  slides: HeroSlide[];
}

const SPECIMEN_STUDIES = [
  { study: "Finish study", spec: "Solid brass · Knurled satin gold" },
  { study: "Live demonstration", spec: "German engineering · Flagship display" },
  { study: "Architectural security", spec: "SS 304 · Biometric & mortise systems" },
];

export default function HeroStage({ slides }: HeroStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  const handleNextSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const handlePrevSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  // Auto-advance every 8 seconds if reduced motion is not enabled
  useEffect(() => {
    if (shouldReduceMotion || !slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [handleNextSlide, shouldReduceMotion, slides]);

  useGSAP(
    () => {
      if (!slides || slides.length === 0 || shouldReduceMotion || !containerRef.current) return;

      const heroH1 = containerRef.current.querySelector(".hero-h1");
      const heroP = containerRef.current.querySelector(".hero-p");
      const heroImage = containerRef.current.querySelector(".hero-bg-image");
      const aperture = apertureRef.current;

      // Scroll-linked parallax for background
      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { scale: 1.03, y: 0 },
          {
            scale: 1.0,
            y: "8%",
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

      // Slide Change Transition Animation
      const tl = gsap.timeline();

      if (heroH1) {
        tl.fromTo(
          heroH1,
          { y: "60%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.9, ease: "power3.out" },
          0
        );
      }

      if (heroP) {
        tl.fromTo(
          heroP,
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.2
        );
      }

      if (aperture) {
        tl.fromTo(
          aperture,
          { autoAlpha: 0.7, scale: 0.98 },
          { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" },
          0.1
        );
      }
    },
    { scope: containerRef, dependencies: [currentSlideIndex, shouldReduceMotion, slides] }
  );

  if (!slides || slides.length === 0) return null;
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const specimenStudy = SPECIMEN_STUDIES[currentSlideIndex] || SPECIMEN_STUDIES[0];

  const ctaLabel = currentSlide.primaryCta || "Explore Collections";
  const ctaHref = currentSlide.ctaTarget || "/collections";
  const isExternalCta = ctaHref.startsWith("http");

  return (
    <section
      ref={containerRef}
      data-chapter="1"
      className="hidden lg:block relative min-h-[860px] h-[100dvh] w-full border-b border-[#1a1017]/[0.10] overflow-hidden bg-[#fdf8f0]"
    >
      {/* Background Image — scroll-linked cinematic parallax */}
      <img
        key={`bg-${currentSlideIndex}`}
        alt="Architectural brass hardware in the Hardware Collection showroom"
        className="hero-bg-image absolute inset-0 h-full w-full object-cover opacity-[0.20] transition-opacity duration-700 will-change-transform"
        decoding="async"
        src={currentSlide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
      />
      <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#fdf8f0] via-[#fdf8f0]/[0.85] to-transparent" />

      {/* Floating Left & Right Carousel Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-[#1a1017]/[0.12] bg-[#fdf8f0]/90 backdrop-blur-md text-[#1a1017] hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.75]" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-[#1a1017]/[0.12] bg-[#fdf8f0]/90 backdrop-blur-md text-[#1a1017] hover:bg-[#8b1a42] hover:text-white hover:border-[#8b1a42] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.75]" />
          </button>
        </>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 mx-[80px] xl:mx-[100px] h-full flex flex-col justify-between pt-[110px] pb-[60px]">
        <div className="grid grid-cols-[minmax(480px,580px)_1fr] items-end gap-12 my-auto">
          {/* Left Column: Typography & CTAs */}
          <div className="hero-text-col pb-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 bg-[#8b1a42] shrink-0 rounded-full" />
              <p className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[#8b1a42]">
                {currentSlide.eyebrow || "Architectural Hardware Experts Since 2002"}
              </p>
            </div>

            <div className="overflow-hidden mb-6 pb-2">
              <h1 className="hero-h1 hc-serif text-[84px] xl:text-[98px] 2xl:text-[112px] leading-[0.90] font-light tracking-[-0.01em] text-[#1a1017] whitespace-pre-line">
                {currentSlide.title || "The Art of\nthe Finish."}
              </h1>
            </div>

            <p className="hero-p mt-4 max-w-[500px] text-lg xl:text-xl leading-[1.65] font-light text-[#2e232b]">
              {currentSlide.description ||
                "Premium architectural hardware and modular solutions, curated for contemporary spaces."}
            </p>

            {/* Dual CTAs as requested in mockup */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {isExternalCta ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brass-plate hc-focus h-[54px] px-8 bg-[#8b1a42] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] flex items-center gap-3.5 no-underline hover:bg-[#6b1432] btn-tactile transition-premium rounded shadow-lg"
                >
                  <span>{ctaLabel}</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  className="brass-plate hc-focus h-[54px] px-8 bg-[#8b1a42] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] flex items-center gap-3.5 no-underline hover:bg-[#6b1432] btn-tactile transition-premium rounded shadow-lg"
                >
                  <span>{ctaLabel}</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}

              {/* Secondary WhatsApp CTA */}
              <a
                href={generateWhatsAppUrl("general-enquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="hc-focus h-[54px] px-7 bg-transparent border border-[#c8a96e]/70 hover:border-[#8b1a42] hover:bg-[#8b1a42] hover:text-white text-[#1a1017] text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] flex items-center gap-2.5 rounded transition-all duration-300 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#c8a96e] group-hover:text-white" />
                <span>WhatsApp The Showroom</span>
              </a>
            </div>

            {/* Carousel Stepper Bar: 01 —— 02 —— 03 */}
            <div className="mt-12 flex items-center gap-4">
              {slides.map((s, idx) => {
                const isActive = currentSlideIndex === idx;
                return (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span
                      className={`hc-mono text-xs font-semibold tabular-nums transition-colors duration-200 ${
                        isActive ? "text-[#8b1a42]" : "text-[#7a6872] group-hover:text-[#1a1017]"
                      }`}
                    >
                      {pad2(idx + 1)}
                    </span>
                    <div
                      className={`h-0.5 w-10 xl:w-14 rounded-full transition-all duration-400 ${
                        isActive
                          ? "bg-[#8b1a42]"
                          : "bg-[#1a1017]/[0.15] group-hover:bg-[#8b1a42]/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Product Aperture Card */}
          <div
            ref={apertureRef}
            aria-label="Hero product aperture"
            className="aperture relative justify-self-end h-[520px] w-[460px] xl:h-[580px] xl:w-[500px] border-x border-[#1a1017]/[0.10] bg-[#f8f6f6] overflow-hidden focus-within:border-[#8b1a42]/[0.60] shadow-xl rounded-sm"
            tabIndex={0}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[#8b1a42]/[0.50]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#8b1a42]/[0.25]" />
            <div className="absolute inset-y-0 left-0 w-px bg-[#8b1a42]/[0.15]" />

            <div className="absolute top-6 left-6 right-6 flex items-center justify-between hc-mono text-[9px] uppercase tracking-[0.2em] text-[#7a6872]">
              <span>Selected specimen</span>
              <span className="text-[#8b1a42] tabular-nums font-semibold">
                {pad2(currentSlideIndex + 1)} / {pad2(slides.length)}
              </span>
            </div>

            <img
              key={`aperture-${currentSlideIndex}`}
              alt="Close detail of a brass hardware finish"
              className="aperture-image absolute inset-[44px_24px_80px] h-[380px] xl:h-[430px] w-[410px] xl:w-[450px] object-contain mix-blend-multiply opacity-[0.88] transition-all duration-500"
              decoding="async"
              src={currentSlide.productUrl || "/cinema/hero/HC-01-HERO-03.png"}
            />

            <div className="aperture-sweep" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-[#1a1017]/[0.10] pt-4">
              <div>
                <p className="hc-mono text-[9px] uppercase tracking-[0.18em] text-[#7a6872]">
                  {specimenStudy.study}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1017] font-medium">
                  {specimenStudy.spec}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous specimen"
                  className="hc-focus p-2 text-[#8b1a42] hover:text-[#6b1432] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next specimen"
                  className="hc-focus p-2 text-[#8b1a42] hover:text-[#6b1432] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}

/** Two-digit specimen index. */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
