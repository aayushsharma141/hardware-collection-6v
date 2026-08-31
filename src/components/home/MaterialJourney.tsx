"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * MaterialJourney &mdash; Chapter 04 "The Finish"
 * Visual tension: VERY HIGH &mdash; the primary material showcase.
 *
 * Desktop (pinned, GSAP scrub):
 *   Each material occupies 100vh of scroll.
 *   Image: begins 40% viewport width, scale 1.4 â†’ opens to full bleed (clip-path).
 *   Material name: 8xl serif, z=1 (behind image), low opacity ghost text.
 *   Specification copy: slides in from below, z=3.
 *   Scroll sequence per material: surface â†’ grain â†’ reflection â†’ edge â†’ complete piece.
 *
 * Material Lens interaction:
 *   pointermove â†’ shifts radial highlight mask (simulates light on metal surface)
 *   + micro-zoom on the image (scale 1.0 â†’ 1.015)
 *   User feels: "I am inspecting this metal."
 *
 * Reflective light sweep: .light-sweep-overlay &mdash; subtly loops, pauses on pointer enter.
 *
 * Mobile: Static vertical editorial cards, no pinning, no Material Lens.
 */

const MATERIALS = [
  {
    name: "SATIN",
    subName: "Satin Steel",
    desc: "Restrained. Architectural. Timeless. Satin finish diffuses light without glare &mdash; the professional's choice for contemporary residential and commercial specification.",
    spec: "Surface: 180-grit satin brush &middot; Sheen: Low reflectance &middot; Application: Interior door & cabinet hardware",
    img: "/cinema/materials/HC-04-SATIN.png",
    sweepDelay: "0s",
  },
  {
    name: "BRASS",
    subName: "Living Brass",
    desc: "Warm, breathing finish that deepens with time. Each handle develops a unique patina &mdash; the mark of architectural confidence and material honesty.",
    spec: "Alloy: C26000 cartridge brass &middot; Treatment: Lacquer-free, living finish &middot; Note: Patination expected and valued",
    img: "/cinema/materials/HC-04-PVD-BRASS.png",
    sweepDelay: "2s",
  },
  {
    name: "MATTE BLACK",
    subName: "Architectural Black",
    desc: "Crisp contrast. Modern spatial definition. Matte black hardware reads as a deliberate decision &mdash; geometry made visible.",
    spec: "Process: Powder-coat or PVD black &middot; Sheen: 0â€“5Â° gloss units &middot; Application: Contemporary & industrial interiors",
    img: "/cinema/materials/HC-04-MATTE.png",
    sweepDelay: "4s",
  },
  {
    name: "CHROME",
    subName: "Polished Chrome",
    desc: "Brilliant precision. Chrome reflects its environment without apology &mdash; for spaces designed to impress at every surface.",
    spec: "Process: Triple-layered PVD chrome &middot; Hardness: 9H surface &middot; Application: Bathrooms, hospitality, feature entrances",
    img: "/cinema/materials/HC-04-BRUSHED.png", // Reusing Brushed as Chrome stand-in for now
    sweepDelay: "1s",
  },
  {
    name: "BRONZE",
    subName: "Oil-Rubbed Bronze",
    desc: "Deep heritage. Rich transitional character. Bronze hardware speaks of a space that considers its history and its future simultaneously.",
    spec: "Base: Solid brass &middot; Treatment: Chemical patina, sealed &middot; Application: Heritage, luxury residential, hospitality",
    img: "/cinema/materials/HC-04-DARK-METAL.png",
    sweepDelay: "3s",
  },
];

export default function MaterialJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Material Lens: pointer tracking per panel
  const handleLensMove = useCallback((e: React.PointerEvent<HTMLDivElement>, panelEl: HTMLElement) => {
    const rect = panelEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    panelEl.style.setProperty("--lens-x", `${x.toFixed(1)}%`);
    panelEl.style.setProperty("--lens-y", `${y.toFixed(1)}%`);
    // Micro-zoom on pointer enter via CSS var
    panelEl.style.setProperty("--lens-scale", "1.015");
  }, []);

  const handleLensLeave = useCallback((panelEl: HTMLElement) => {
    panelEl.style.setProperty("--lens-scale", "1");
  }, []);

  useGSAP(
    () => {
      if (shouldReduceMotion || !containerRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".mat-panel");
        if (!panels.length) return;

        // Accurate xPercent: translates by (N-1)/N of track width so last panel rests exactly at 100%
        const totalPanels = panels.length;
        const targetPercent = -((100 * (totalPanels - 1)) / totalPanels);

        // Main horizontal scroll &mdash; store the tween for containerAnimation references
        const hScroll = gsap.to(trackRef.current, {
          xPercent: targetPercent,
          ease: "none",
          scrollTrigger: {
            id: "mat-h-scroll",
            trigger: containerRef.current,
            pin: true,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${(totalPanels - 1) * window.innerHeight * 0.75}`,
            invalidateOnRefresh: true,
          },
        });

        // Per-panel: image clip-path opens from 40% to full as the panel enters
        panels.forEach((panel) => {
          const imgWrap = panel.querySelector<HTMLElement>(".mat-img-wrap");
          const ghostText = panel.querySelector<HTMLElement>(".mat-ghost");
          const specText = panel.querySelector<HTMLElement>(".mat-spec");
          if (!imgWrap || !ghostText || !specText) return;

          // containerAnimation expects a gsap.core.Animation (the tween, not ScrollTrigger)
          gsap.fromTo(
            imgWrap,
            { clipPath: "inset(0% 30% 0% 30%)", scale: 1.4 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: hScroll,
                start: "left right",
                end: "left left",
                scrub: 1,
              },
            }
          );

          gsap.fromTo(
            ghostText,
            { autoAlpha: 0, x: -30 },
            {
              autoAlpha: 0.08,
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: hScroll,
                start: "left right",
                end: "left left",
                scrub: 1,
              },
            }
          );

          gsap.fromTo(
            specText,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: hScroll,
                start: "left 60%",
                end: "left left",
                scrub: 1,
              },
            }
          );
        });
      });
    },
    { scope: containerRef, dependencies: [shouldReduceMotion] }
  );

  // Reduced-motion: static editorial layout
  if (shouldReduceMotion) {
    return (
      <section data-chapter="4" className="py-16 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-[var(--accent)] font-medium tracking-widest text-[11px] uppercase mb-1">
            The finish
          </p>
          <h2 className="hc-serif text-[32px] sm:text-4xl font-normal tracking-[0.015em] text-[var(--text-primary)] leading-[1.05] mb-4">
            The details define<br />
            <span className="text-[var(--text-secondary)]">the architecture.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-lg mb-8">
            Genuine solid brass, surgical stainless steel, and triple-PVD coatings engineered for tactile longevity.
          </p>

          <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-raised)] rounded-sm mb-6 border border-[var(--border)]">
            <img
              src={MATERIALS[1].img}
              alt="Architectural Brass Finish"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-[var(--accent)] text-[10px] tracking-widest uppercase font-medium">FEATURED SPECIMEN</p>
                <p className="hc-serif text-lg text-[var(--text-primary)]">Living Cartridge Brass</p>
              </div>
              <span className="text-[var(--text-secondary)]/70 text-xs tracking-wider">Unlacquered</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {MATERIALS.map((mat, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-light"
              >
                {mat.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Mobile editorial transition moment */}
      <div className="block lg:hidden">
        <section data-chapter="4" className="py-16 bg-[var(--surface)] border-t border-[var(--border)]">
          <div className="container mx-auto px-6">
            <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase mb-2">
              The finish
            </p>
            <h2 className="hc-serif text-4xl sm:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.05] mb-4">
              The details define<br />
              <span className="text-[var(--text-secondary)]">the architecture.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-lg mb-8 font-light">
              Genuine solid brass, surgical stainless steel, and triple-PVD coatings engineered for tactile longevity.
            </p>

            {/* Featured Material Visual with Light Sweep */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-raised)] rounded-2xl mb-6 border border-[var(--border)] shadow-md">
              <img
                src={MATERIALS[1].img}
                alt="Architectural Brass Finish"
                className="w-full h-full object-cover opacity-90"
              />
              <div
                className="light-sweep-overlay"
                aria-hidden="true"
                style={{ "--sweep-delay": "1s" } as React.CSSProperties}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/85 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="hc-mono text-[#c8a96e] text-xs tracking-widest uppercase font-semibold">FEATURED SPECIMEN</p>
                  <p className="hc-serif text-2xl text-[var(--text-primary)] font-normal">Living Cartridge Brass</p>
                </div>
                <span className="text-xs tracking-wider uppercase font-semibold text-[var(--text-secondary)]">Unlacquered</span>
              </div>
            </div>

            {/* 5 Architectural Finishes Strip */}
            <div className="flex flex-wrap gap-2 pt-2">
              {MATERIALS.map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-light"
                >
                  {mat.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop horizontal pinned cinema */}
      <div
        ref={containerRef}
        data-chapter="4"
        className="hidden lg:block relative overflow-hidden border-t border-[var(--border)]"
        style={{ height: "100vh" }}
      >
        {/* Chapter label &mdash; fixed above */}
        <div className="absolute top-8 left-16 z-20 pointer-events-none">
          <ChapterLabel />
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${MATERIALS.length * 100}vw` }}
        >
          {MATERIALS.map((mat, i) => (
            <MaterialPanel
              key={i}
              mat={mat}
              index={i}
              total={MATERIALS.length}
              onLensMove={handleLensMove}
              onLensLeave={handleLensLeave}
            />
          ))}
        </div>
      </div>
    </>
  );
}

interface MaterialPanelProps {
  mat: (typeof MATERIALS)[number];
  index: number;
  total: number;
  onLensMove: (e: React.PointerEvent<HTMLDivElement>, el: HTMLElement) => void;
  onLensLeave: (el: HTMLElement) => void;
}

function MaterialPanel({ mat, index, total, onLensMove, onLensLeave }: MaterialPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      className="mat-panel w-screen h-full relative shrink-0 flex items-center justify-center overflow-hidden"
      style={
        {
          "--lens-x": "50%",
          "--lens-y": "50%",
          "--lens-scale": "1",
        } as React.CSSProperties
      }
      onPointerMove={(e) => panelRef.current && onLensMove(e, panelRef.current)}
      onPointerLeave={() => panelRef.current && onLensLeave(panelRef.current)}
    >
      {/* Z=1: Ghost text &mdash; material name behind image */}
      <p
        className="mat-ghost hc-serif absolute inset-0 flex items-center justify-center text-[22vw] text-[var(--border)] leading-none select-none pointer-events-none"
        style={{ zIndex: 1, opacity: 0 }}
        aria-hidden="true"
      >
        {mat.name}
      </p>

      {/* Z=2: Primary visual &mdash; image with Material Lens */}
      <div className="grid grid-cols-2 gap-0 w-full h-full items-center">
        {/* Left: Full-bleed image */}
        <div
          className="mat-img-wrap relative h-full overflow-hidden"
          style={{
            zIndex: 2,
            transform: "scale(var(--lens-scale))",
            transition: "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          <img
            src={mat.img}
            alt={mat.subName}
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.05) brightness(0.85)" }}
          />
          {/* Material Lens highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 4,
              backgroundImage: `radial-gradient(
                circle 300px at var(--lens-x) var(--lens-y),
                rgba(0, 0, 0, 0.05),
                transparent 70%
              )`,
            }}
            aria-hidden="true"
          />
          {/* Reflective light sweep */}
          <div
            className="light-sweep-overlay"
            aria-hidden="true"
            style={{ "--sweep-delay": mat.sweepDelay } as React.CSSProperties}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--surface)]/50" />
        </div>

        {/* Right: Typography */}
        <div className="flex flex-col justify-center px-16 relative" style={{ zIndex: 3 }}>
          <p className="hc-mono text-[#c8a96e] text-xs tracking-[0.25em] font-semibold uppercase mb-4">
            FINISH 0{index + 1} / 0{total}
          </p>
          <h3 className="hc-serif text-7xl xl:text-8xl 2xl:text-9xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[0.9] mb-3">
            {mat.name}
          </h3>
          <p className="text-[var(--accent)] text-xl xl:text-2xl font-light mb-6">{mat.subName}</p>
          <p className="text-[var(--text-primary)] font-light text-xl xl:text-2xl leading-relaxed max-w-xl mb-8">
            {mat.desc}
          </p>
          <p
            className="mat-spec text-[var(--text-secondary)] text-sm leading-relaxed max-w-md font-normal opacity-0"
            style={{ whiteSpace: "pre-line" }}
          >
            {mat.spec.replace(" &middot; ", "\n")}
          </p>
          <Link
            href="/collections"
            className="mt-8 inline-flex items-center gap-2.5 text-[#c8a96e] text-xs sm:text-sm tracking-widest uppercase font-semibold hover:text-[var(--accent)] hover:gap-4 transition-all duration-200"
          >
            Explore finishes <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChapterLabel() {
  return (
    <>
      <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase">
        The finish
      </p>
    </>
  );
}




