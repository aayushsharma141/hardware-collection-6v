"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
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

  return (
    <section
      ref={containerRef}
      data-chapter="1"
      className="hidden lg:block relative min-h-[840px] h-[100dvh] w-full border-b border-white/[0.12] overflow-hidden bg-[#090909]"
    >
      {/* Background Image & Ambient Gradients */}
      <img
        alt="Architectural brass hardware in the Hardware Collection showroom"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.45] will-change-transform"
        decoding="async"
        src={currentSlide.imageUrl || "/cinema/hero/HC-01-HERO-01.png"}
      />
      <div className="absolute inset-0 bg-[#090909]/[0.55]" />
      <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#090909]/[0.9] via-[#090909]/[0.6] to-transparent" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-[80px] h-full flex flex-col justify-between pt-[110px] pb-[70px]">
        <div className="grid grid-cols-[minmax(460px,540px)_1fr] items-end gap-12 my-auto">
          {/* Left Column: Typography & CTAs */}
          <div className="hero-text-col pb-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-1.5 w-1.5 bg-[#c8a96e]" />
              <p className="hc-mono text-[11px] uppercase tracking-[0.22em] text-[#c8a96e]">
                Hardware Collection · Sakchi, Jamshedpur
              </p>
            </div>

            <h1 className="hc-serif text-[84px] xl:text-[96px] leading-[0.86] font-normal tracking-[0.015em] text-[#e8e3d9]">
              The Art of
              <br />
              <em className="not-italic text-[#e8e3d9]">the Finish.</em>
            </h1>

            <p className="mt-8 max-w-[420px] text-[15px] leading-[1.65] font-light text-[#d1ccc4]">
              {currentSlide.description ||
                "Architectural hardware chosen for spaces that deserve better details. Official partner for Häfele, Dorset, Labacha, Godrej & Hettich in Sakchi."}
            </p>

            <div className="mt-10 flex items-center gap-6">
              <a
                href="#collection"
                className="brass-plate h-[52px] px-7 bg-[#c8a96e] text-[#090909] text-[11px] font-bold uppercase tracking-[0.18em] flex items-center gap-6 no-underline hover:bg-[#e8e3d9]"
              >
                <span>Explore collections</span>
                <svg className="w-4 h-4 text-[#090909]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="#directions"
                className="rail-button h-[52px] text-[11px] uppercase tracking-[0.16em] text-[#e8e3d9] flex items-center gap-2 no-underline"
              >
                <span>Get showroom directions</span>
                <svg className="w-4 h-4 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Product Aperture Card */}
          <div
            ref={apertureRef}
            aria-label="Hero product aperture"
            className="aperture relative justify-self-end h-[520px] w-[460px] xl:h-[580px] xl:w-[500px] border-x border-white/[0.14] bg-[#090909]/[0.92] overflow-hidden focus-within:border-[#c8a96e]/[0.75] shadow-2xl"
            tabIndex={0}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[#c8a96e]/[0.8]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#c8a96e]/[0.4]" />
            <div className="absolute inset-y-0 left-0 w-px bg-[#c8a96e]/[0.22]" />

            <div className="absolute top-6 left-6 right-6 flex items-center justify-between hc-mono text-[9px] uppercase tracking-[0.2em] text-[#aaa49a]">
              <span>Selected specimen</span>
              <span className="text-[#c8a96e]">
                0{currentSlideIndex + 1} / 0{slides.length}
              </span>
            </div>

            <img
              alt="Close detail of a brass hardware finish"
              className="aperture-image absolute inset-[44px_24px_80px] h-[380px] xl:h-[430px] w-[410px] xl:w-[450px] object-contain mix-blend-screen opacity-[0.92]"
              decoding="async"
              src={currentSlide.productUrl || "/cinema/hero/HC-01-HERO-03.png"}
            />

            <div className="aperture-sweep" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-white/[0.12] pt-4">
              <div>
                <p className="hc-mono text-[9px] uppercase tracking-[0.18em] text-[#aaa49a]">
                  Finish study
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#e8e3d9]">
                  {currentSlide.title ? currentSlide.title.replace(/\n/g, ' · ') : 'Solid brass · PVD satin gold'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                aria-label="Next specimen"
                className="hc-focus p-2 text-[#c8a96e] hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section Bottom Status Bar */}
        <div className="hero-bottom-bar border-t border-white/[0.14] h-[54px] flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <span className="hc-mono text-[10px] tracking-[0.16em] text-[#c8a96e]">
              0{currentSlideIndex + 1}
            </span>
            <span className="hc-mono text-[10px] tracking-[0.18em] text-[#aaa49a]">
              / 0{slides.length}
            </span>
            <span className="h-px w-12 bg-[#c8a96e]/[0.55]" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#aaa49a]">
              The threshold
            </span>
          </div>

          <a
            href="#categories"
            className="hc-mono text-[10px] uppercase tracking-[0.18em] text-[#aaa49a] hover:text-[#c8a96e] transition-colors no-underline"
          >
            Scroll to showroom families ↓
          </a>
        </div>
      </div>
    </section>
  );
}
