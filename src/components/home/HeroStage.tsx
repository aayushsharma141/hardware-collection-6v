"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { LazyImage as Image } from "@/components/ui/lazy-image";
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight } from "lucide-react";
import { HeroSlide } from "@/types/hero";
import { generateWhatsAppUrl, SHOWROOM_YEARS_OF_TRUST } from "@/lib/config";

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

  // Auto-advance every 8 seconds if reduced motion is not enabled (resets on slide change)
  useEffect(() => {
    if (shouldReduceMotion || !slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [handleNextSlide, shouldReduceMotion, slides, currentSlideIndex]);

  useGSAP(
    () => {
      if (!slides || slides.length === 0 || shouldReduceMotion || !containerRef.current) return;

      const heroH1 = containerRef.current.querySelector(".hero-h1");
      const heroP = containerRef.current.querySelector(".hero-p");
      const heroImage = containerRef.current.querySelector(".hero-bg-image");
      const aperture = apertureRef.current;
      const apertureImage = containerRef.current.querySelector(".aperture-image");
      const apertureMeta = containerRef.current.querySelector(".aperture-meta");

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
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.2, ease: "power4.out" },
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

      if (apertureImage) {
        tl.fromTo(
          apertureImage,
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 0.88, scale: 1.0, duration: 0.65, ease: "power2.out" },
          0.05
        );
      }

      if (apertureMeta) {
        tl.fromTo(
          apertureMeta,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.15
        );
      }
    },
    { scope: containerRef, dependencies: [currentSlideIndex, shouldReduceMotion, slides] }
  );

  if (!slides || slides.length === 0) return null;
  const currentSlide = slides[currentSlideIndex] || slides[0];
  // Studio's per-slide captions win; the built-in pair covers slides that leave them blank.
  const builtInStudy = SPECIMEN_STUDIES[currentSlideIndex] || SPECIMEN_STUDIES[0];
  const specimenStudy = {
    study: currentSlide.specimenLabel || builtInStudy.study,
    spec: currentSlide.specimenCaption || builtInStudy.spec,
  };

  const ctaLabel = currentSlide.primaryCta || "Explore Collections";
  const ctaHref = currentSlide.ctaTarget || "/collections";
  const isExternalCta = ctaHref.startsWith("http");

  return (
    <section
      ref={containerRef}
      data-chapter="1"
      data-nav-hero
      className="hidden lg:block relative min-h-[860px] h-[100dvh] w-full border-b border-[var(--border)] overflow-hidden bg-[var(--surface)]"
    >
      {/* Background Image — alpha-masked photographic depth, zero milky smoke */}
      <div
        className="hero-bg-container absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, transparent 46%, rgba(0, 0, 0, 0.15) 54%, rgba(0, 0, 0, 0.7) 66%, black 82%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, transparent 46%, rgba(0, 0, 0, 0.15) 54%, rgba(0, 0, 0, 0.7) 66%, black 82%, black 100%)",
        }}
      >
        {currentSlide.imageUrl ? (
          <Image
            key={`bg-${currentSlideIndex}`}
            alt="Architectural brass hardware in the Hardware Collection showroom"
            className="hero-bg-image absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-700 will-change-transform"
            fill
            priority
            sizes="(min-width: 1024px) 100vw, 1px"
            src={currentSlide.imageUrl}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] opacity-50">
            <span className="text-[12px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending Background</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-6 lg:mx-10 xl:mx-[80px] 2xl:mx-[100px] h-full flex flex-col justify-between pt-[110px] pb-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(460px,580px)_1fr] items-end gap-8 xl:gap-14 my-auto">
          {/* Left Column: Typography & CTAs */}
          <div className="hero-text-col pb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex items-center justify-center shrink-0">
                <span className="absolute h-3 w-3 bg-[var(--color-wine)]/30 rounded-full animate-ping opacity-75" />
                <span className="relative h-2 w-2 bg-[var(--color-wine)] rounded-full" />
              </div>
              <p className="hc-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] font-semibold text-[var(--color-wine)]">
                {currentSlide.eyebrow || `Architectural Hardware Experts · ${SHOWROOM_YEARS_OF_TRUST}+ Years`}
              </p>
            </div>

            <div className="overflow-hidden mb-6 pb-2">
              <p aria-hidden="true" className="hero-h1 hc-serif text-[64px] lg:text-[72px] xl:text-[96px] 2xl:text-[110px] leading-[0.94] font-light tracking-[-0.01em] text-[var(--text-primary)] whitespace-pre-line">
                {currentSlide.title || "The Art of\nthe Finish."}
              </p>
            </div>

            <p className="hero-p mt-4 max-w-[500px] text-base lg:text-lg xl:text-xl leading-[1.65] font-light text-[var(--text-secondary)]">
              {currentSlide.description ||
                "Premium architectural hardware and modular solutions, curated for contemporary spaces."}
            </p>

            {/* Dual CTAs with physical tactile feedback & pill geometry */}
            <div className="mt-8 xl:mt-10 flex flex-wrap items-center gap-4">
              {isExternalCta ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hc-focus h-[52px] xl:h-[56px] px-7 xl:px-9 rounded-full bg-gradient-to-b from-[#9b1f4c] via-[#8b1a42] to-[#781537] hover:from-[#a82453] hover:via-[#951c47] hover:to-[#83183d] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] inline-flex items-center gap-3 no-underline border border-[#b23260]/40 shadow-[0_4px_16px_rgba(139,26,66,0.28),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.38),inset_0_1px_0_rgba(255,255,255,0.55)] active:scale-[0.98] transition-all duration-200 shrink-0"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.4] text-white transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  className="group hc-focus h-[52px] xl:h-[56px] px-7 xl:px-9 rounded-full bg-gradient-to-b from-[#9b1f4c] via-[#8b1a42] to-[#781537] hover:from-[#a82453] hover:via-[#951c47] hover:to-[#83183d] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] inline-flex items-center gap-3 no-underline border border-[#b23260]/40 shadow-[0_4px_16px_rgba(139,26,66,0.28),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_6px_22px_rgba(139,26,66,0.38),inset_0_1px_0_rgba(255,255,255,0.55)] active:scale-[0.98] transition-all duration-200 shrink-0"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.4] text-white transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              )}

              {/* Secondary WhatsApp CTA with frosted glass pill styling */}
              <a
                href={generateWhatsAppUrl("general-enquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="group hc-focus h-[52px] xl:h-[56px] px-6 xl:px-8 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 hover:border-[#8b1a42]/30 text-[#2d1b26] hover:text-[#8b1a42] text-xs sm:text-[13px] font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2.5 shadow-[0_2px_8px_rgba(26,16,23,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md active:scale-[0.98] transition-all duration-200 shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-[#8b1a42] transition-transform duration-200 group-hover:scale-110" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Right Column: Museum Specimen Pedestal Showcase */}
          <div
            ref={apertureRef}
            aria-label="Hero product aperture"
            className="aperture relative justify-self-end h-[490px] w-[390px] xl:h-[590px] xl:w-[510px] rounded-[32px] xl:rounded-[40px] bg-gradient-to-b from-[#fbf7f0]/95 via-[#faf5eb]/95 to-[#f7f0e4]/95 backdrop-blur-2xl border border-white/90 shadow-[0_24px_60px_rgba(26,16,23,0.14),0_4px_16px_rgba(26,16,23,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] overflow-hidden shrink-0 flex flex-col justify-between p-6 xl:p-8"
            tabIndex={0}
          >
            {/* Specular top rim flare */}
            <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Ambient radial finish glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.16)_0%,transparent_70%)] pointer-events-none" />

            {/* Top Bar: Specimen Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/90 shadow-[0_2px_6px_rgba(26,16,23,0.02)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b1a42]" />
                <span className="hc-mono text-[9px] uppercase tracking-[0.22em] text-[#7a6872] font-semibold">
                  Selected Specimen
                </span>
              </div>
              <span className="hc-mono text-[10px] uppercase tracking-[0.2em] text-[#8b1a42] font-semibold tabular-nums px-2.5 py-1 rounded-full bg-[#8b1a42]/10 border border-[#8b1a42]/20">
                {pad2(currentSlideIndex + 1)} / {pad2(slides.length)}
              </span>
            </div>

            {/* Center Product Image Showcase */}
            <div className="relative z-10 flex-1 my-2 flex items-center justify-center min-h-0">
              {currentSlide.productUrl ? (
                <Image
                  key={`aperture-${currentSlideIndex}`}
                  alt="Close detail of a brass hardware finish"
                  className="aperture-image h-auto max-h-[300px] xl:max-h-[380px] w-auto max-w-full object-contain mix-blend-multiply drop-shadow-md will-change-transform transition-transform duration-500 hover:scale-[1.03]"
                  src={currentSlide.productUrl}
                  width={450}
                  height={450}
                  style={{ width: "auto", height: "auto" }}
                />
              ) : (
                <div className="flex items-center justify-center mix-blend-multiply">
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-40 hc-mono text-[var(--text-secondary)]">Pending Product</span>
                </div>
              )}
            </div>

            {/* Bottom Meta & Tactile Controls */}
            <div className="relative z-10 pt-4 border-t border-[#e8ded1]/80 flex items-end justify-between">
              <div className="aperture-meta min-w-0 pr-3">
                <p className="hc-mono text-[9px] uppercase tracking-[0.2em] text-[#7a6872] font-medium">
                  {specimenStudy.study}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#1a1017] font-semibold truncate">
                  {specimenStudy.spec}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous specimen"
                  className="w-9 h-9 rounded-full bg-white/80 hover:bg-[#8b1a42] text-[#4a3442] hover:text-white border border-white/90 shadow-[0_2px_6px_rgba(26,16,23,0.04)] flex items-center justify-center motion-safe:active:scale-[0.97] transition-[background-color,color,scale] duration-150 ease-[var(--ease-out)]"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next specimen"
                  className="w-9 h-9 rounded-full bg-white/80 hover:bg-[#8b1a42] text-[#4a3442] hover:text-white border border-white/90 shadow-[0_2px_6px_rgba(26,16,23,0.04)] flex items-center justify-center motion-safe:active:scale-[0.97] transition-[background-color,color,scale] duration-150 ease-[var(--ease-out)]"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Minimal Stepper — Floating Frosted Capsule with Refill Progress */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(26,16,23,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]">
        {slides.map((s, idx) => {
          const isActive = currentSlideIndex === idx;
          return (
            <button
              key={s.id || idx}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className="group py-1 cursor-pointer hc-focus flex items-center"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`h-[3px] rounded-full transition-all duration-300 ease-out overflow-hidden relative ${
                  isActive
                    ? "w-12 sm:w-14 bg-[#1a1017]/15"
                    : "w-3 bg-[#1a1017]/25 hover:bg-[#1a1017]/50 hover:w-5"
                }`}
              >
                {isActive && (
                  <span
                    key={`refill-${currentSlideIndex}`}
                    className="absolute inset-0 bg-[#8b1a42] rounded-full origin-left animate-hero-refill"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Two-digit specimen index. */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
