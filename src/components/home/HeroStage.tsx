"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { HeroSlide } from "@/types/hero";
import { HeroCarousel } from "./hero/HeroCarousel";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { AtmosphericLayer } from "@/components/visual/AtmosphericLayer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroStageProps {
  slides: HeroSlide[];
}

export default function HeroStage({ slides }: HeroStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  // If no slides are provided, fallback safely
  if (!slides || slides.length === 0) return null;

  useGSAP(
    () => {
      if (shouldReduceMotion || !containerRef.current) return;

      const aperture = apertureRef.current;
      if (!aperture) return;

      // Select GSAP targets that HeroCarousel rendered
      const bgWrappers = gsap.utils.toArray(".hero-bg-wrapper");
      const productWrappers = gsap.utils.toArray(".hero-product-wrapper");
      const eyebrows = gsap.utils.toArray(".hero-eyebrow");
      const h1s = gsap.utils.toArray(".hero-title");
      const bodies = gsap.utils.toArray(".hero-body");
      const ctas = gsap.utils.toArray(".hero-cta");

      // Set initial states for all slide wrappers
      gsap.set(eyebrows, { autoAlpha: 0 });
      gsap.set(h1s, { autoAlpha: 0, y: 60 });
      gsap.set(bodies, { autoAlpha: 0, y: 24 });
      gsap.set(ctas, { autoAlpha: 0, y: 16 });
      gsap.set(productWrappers, { autoAlpha: 0 });
      gsap.set(aperture, { clipPath: "inset(0% 0% 100% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Camera A & B (Hero Stage): Slow push-in and lateral drift over the entire scroll
      gsap.to(bgWrappers, {
        scale: 1.08,
        xPercent: 3,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: true,
        },
      });

      // Entrance Choreography for whatever slide is active
      tl.to(eyebrows, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0);
      tl.to(h1s, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0.2);
      
      // Camera C (Depth separation) on the product overlay
      tl.to(
        productWrappers,
        { autoAlpha: 1, xPercent: -2, duration: 0.35, ease: "power4.out" },
        0.4
      );

      tl.to(bodies, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, 0.6);
      tl.to(ctas, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.75);
      tl.to(
        aperture,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.18, ease: "power2.inOut" },
        0.85
      );
    },
    { scope: containerRef, dependencies: [shouldReduceMotion, slides] }
  );

  if (shouldReduceMotion) {
    return (
      <section
        data-chapter="1"
        className="relative h-[100dvh] w-full overflow-hidden bg-zinc-950 flex items-end"
      >
        <img
          src={slides[0].imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-24">
          <StaticHeroContent slide={slides[0]} />
        </div>
      </section>
    );
  }

  return (
    <div ref={containerRef} data-chapter="1" className="relative">
      <div
        ref={pinRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-transparent"
      >
        <AtmosphericLayer preset="hero" />

        {/* The Carousel handles internal active-slide state independently of GSAP */}
        <HeroCarousel slides={slides} />

        {/* Aperture transition — reveals the next chapter through an opening */}
        <div
          ref={apertureRef}
          className="absolute bottom-0 left-0 right-0 h-24 bg-zinc-950 pointer-events-none"
          style={{ zIndex: 30, clipPath: "inset(0% 0% 100% 0%)" }}
          aria-hidden="true"
        />

        {/* Scroll indicator (Optional: could hide if user interacts with carousel) */}
        <div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40"
          style={{ zIndex: 10 }}
        >
          <span className="text-[10px] tracking-widest uppercase text-white rotate-90 origin-center mb-4">
            scroll
          </span>
          <div className="w-[1px] h-12 bg-white/30 overflow-hidden">
            <div className="w-full h-full bg-white/80 animate-[fadeInUp_2s_ease-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticHeroContent({ slide }: { slide: HeroSlide }) {
  return (
    <>
      <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-5">
        {slide.eyebrow}
      </p>
      <h1 className="text-5xl lg:text-7xl font-light text-white leading-[1.05] mb-6 whitespace-pre-line font-cinzel">
        {slide.title}
      </h1>
      <p className="text-lg text-zinc-300 font-light mb-10 max-w-xl">{slide.description}</p>
      <div className="flex flex-wrap gap-4">
        <MagneticButton>
          <a
            href={slide.ctaTarget}
            className="inline-flex items-center justify-center px-8 py-4 border border-zinc-600 text-white font-medium text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            {slide.primaryCta}
          </a>
        </MagneticButton>
        <MagneticButton>
          <a
            href="https://wa.me/919835190738"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#C8A96E] text-black font-medium text-sm tracking-widest uppercase hover:bg-[#b0945b] transition-colors duration-300"
          >
            WHATSAPP →
          </a>
        </MagneticButton>
      </div>
    </>
  );
}
