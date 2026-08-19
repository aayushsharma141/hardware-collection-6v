"use client";

import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * MaterialJourney — Chapter 04 "The Finish"
 * Visual tension: VERY HIGH — the primary material showcase.
 *
 * Desktop (pinned, GSAP scrub):
 *   Each material occupies 100vh of scroll.
 *   Image: begins 40% viewport width, scale 1.4 → opens to full bleed (clip-path).
 *   Material name: 8xl serif, z=1 (behind image), low opacity ghost text.
 *   Specification copy: slides in from below, z=3.
 *   Scroll sequence per material: surface → grain → reflection → edge → complete piece.
 *
 * Material Lens interaction:
 *   pointermove → shifts radial highlight mask (simulates light on metal surface)
 *   + micro-zoom on the image (scale 1.0 → 1.015)
 *   User feels: "I am inspecting this metal."
 *
 * Reflective light sweep: .light-sweep-overlay — subtly loops, pauses on pointer enter.
 *
 * Mobile: Static vertical editorial cards, no pinning, no Material Lens.
 */

const MATERIALS = [
  {
    name: "SATIN",
    subName: "Satin Steel",
    desc: "Restrained. Architectural. Timeless. Satin finish diffuses light without glare — the professional's choice for contemporary residential and commercial specification.",
    spec: "Surface: 180-grit satin brush · Sheen: Low reflectance · Application: Interior door & cabinet hardware",
    img: "/cinema/materials/HC-04-SATIN.png",
    sweepDelay: "0s",
  },
  {
    name: "BRASS",
    subName: "Living Brass",
    desc: "Warm, breathing finish that deepens with time. Each handle develops a unique patina — the mark of architectural confidence and material honesty.",
    spec: "Alloy: C26000 cartridge brass · Treatment: Lacquer-free, living finish · Note: Patination expected and valued",
    img: "/cinema/materials/HC-04-PVD-BRASS.png",
    sweepDelay: "2s",
  },
  {
    name: "MATTE BLACK",
    subName: "Architectural Black",
    desc: "Crisp contrast. Modern spatial definition. Matte black hardware reads as a deliberate decision — geometry made visible.",
    spec: "Process: Powder-coat or PVD black · Sheen: 0–5° gloss units · Application: Contemporary & industrial interiors",
    img: "/cinema/materials/HC-04-MATTE.png",
    sweepDelay: "4s",
  },
  {
    name: "CHROME",
    subName: "Polished Chrome",
    desc: "Brilliant precision. Chrome reflects its environment without apology — for spaces designed to impress at every surface.",
    spec: "Process: Triple-layered PVD chrome · Hardness: 9H surface · Application: Bathrooms, hospitality, feature entrances",
    img: "/cinema/materials/HC-04-BRUSHED.png", // Reusing Brushed as Chrome stand-in for now
    sweepDelay: "1s",
  },
  {
    name: "BRONZE",
    subName: "Oil-Rubbed Bronze",
    desc: "Deep heritage. Rich transitional character. Bronze hardware speaks of a space that considers its history and its future simultaneously.",
    spec: "Base: Solid brass · Treatment: Chemical patina, sealed · Application: Heritage, luxury residential, hospitality",
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

        // Main horizontal scroll — store the tween for containerAnimation references
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

  // Reduced-motion / mobile static layout
  if (shouldReduceMotion) {
    return (
      <section data-chapter="4" className="py-24 bg-transparent border-t border-zinc-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <ChapterLabel />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            {MATERIALS.map((mat, i) => (
              <div key={i} className="space-y-4">
                <div className="h-72 w-full overflow-hidden bg-zinc-900">
                  <img src={mat.img} alt={mat.subName} className="w-full h-full object-cover opacity-80" />
                </div>
                <p className="text-zinc-600 text-xs tracking-widest uppercase">FINISH 0{i + 1} / 05</p>
                <h3 className="text-4xl font-light text-white">{mat.subName}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{mat.desc}</p>
                <p className="text-zinc-600 text-xs leading-relaxed">{mat.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Mobile vertical layout */}
      <div className="block lg:hidden">
        <section data-chapter="4" className="py-24 bg-transparent border-t border-zinc-900">
          <div className="container mx-auto px-6">
            <ChapterLabel />
            <div className="space-y-20 mt-12">
              {MATERIALS.map((mat, i) => (
                <div key={i} className="space-y-5">
                  <div className="relative h-72 overflow-hidden bg-zinc-900 rounded-sm">
                    <img src={mat.img} alt={mat.subName} className="w-full h-full object-cover opacity-80" />
                    <div className="light-sweep-overlay" aria-hidden="true" style={{ "--sweep-delay": mat.sweepDelay } as React.CSSProperties} />
                  </div>
                  <p className="text-zinc-600 text-xs tracking-widest uppercase">FINISH 0{i + 1} / 0{MATERIALS.length}</p>
                  <h3 className="text-4xl font-light text-white">{mat.subName}</h3>
                  <p className="text-zinc-400 leading-relaxed">{mat.desc}</p>
                  <p className="text-zinc-600 text-xs leading-relaxed">{mat.spec}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop horizontal pinned cinema */}
      <div
        ref={containerRef}
        data-chapter="4"
        className="hidden lg:block relative overflow-hidden border-t border-zinc-900"
        style={{ height: "100vh" }}
      >
        {/* Chapter label — fixed above */}
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
      {/* Z=1: Ghost text — material name behind image */}
      <p
        className="mat-ghost absolute inset-0 flex items-center justify-center text-[22vw] font-serif text-white leading-none select-none pointer-events-none"
        style={{ zIndex: 1, opacity: 0 }}
        aria-hidden="true"
      >
        {mat.name}
      </p>

      {/* Z=2: Primary visual — image with Material Lens */}
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
                rgba(255, 255, 255, 0.07),
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
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/30" />
        </div>

        {/* Right: Typography */}
        <div className="flex flex-col justify-center px-16 relative" style={{ zIndex: 3 }}>
          <p className="text-zinc-600 text-xs tracking-widest uppercase mb-4">
            FINISH 0{index + 1} / 0{total}
          </p>
          <h3 className="text-6xl xl:text-8xl font-light text-white leading-none mb-2">
            {mat.name}
          </h3>
          <p className="text-zinc-500 text-lg font-light mb-8">{mat.subName}</p>
          <p className="text-zinc-300 font-light text-xl leading-relaxed max-w-md mb-8">
            {mat.desc}
          </p>
          <p
            className="mat-spec text-zinc-600 text-xs leading-relaxed max-w-sm opacity-0"
            style={{ whiteSpace: "pre-line" }}
          >
            {mat.spec.replace(" · ", "\n")}
          </p>
          <a
            href="/collections"
            className="mt-8 inline-flex items-center gap-2 text-[#C8A96E] text-xs tracking-widest uppercase hover:gap-4 transition-all duration-200"
          >
            Explore finishes <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ChapterLabel() {
  return (
    <>
      <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-1">
        CHAPTER 04
      </p>
      <p className="text-zinc-600 text-xs tracking-widest uppercase">
        THE FINISH
      </p>
    </>
  );
}


