"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import AboutStory from "@/components/home/AboutStory";
import { buildWhatsAppUrl, SHOWROOM_MAP_URL } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * ShowroomCinematic &mdash; Chapter 06 "Inside the Showroom"
 * Visual tension: HIGH
 *
 * Desktop (GSAP, pinned, 3 scenes):
 *   Scene 1 &mdash; Entrance: Exterior photograph, scale 1.15â†’1.0, "20+ AUTHORIZED BRANDS &middot; SAKCHI"
 *   Scene 2 &mdash; Product Wall: Interior horizontal pan (translateX), door hardware display
 *   Scene 3 &mdash; Location: Atmosphere dims, CTAs appear as quiet zone transition begins
 *
 * Pointer lighting active in this chapter.
 * gsap.matchMedia &mdash; mobile gets static vertical photography sequence, no pinning.
 */

const SCENES = [
  {
    id: "entrance",
    eyebrow: "THE SHOWROOM",
    title: "FLAGSHIP SHOWROOM\nSAKCHI",
    sub: "Architectural hardware, security, and kitchen systems from leading authorized brands, on physical display.",
    img: "/cinema/showroom/exterior.png",
    panType: "scale" as const,
  },
  {
    id: "interior",
    eyebrow: "LIVE DEMONSTRATIONS",
    title: "Touch Before\nYou Decide.",
    sub: "Experience soft-close drawer systems, live biometric lock demos, and full-scale luxury kitchen setups.",
    img: "/cinema/showroom/interior.png",
    panType: "horizontal" as const,
  },
];

export default function ShowroomCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const sceneRefs = [scene1Ref, scene2Ref, scene3Ref];

  useGSAP(
    () => {
      if (shouldReduceMotion || !containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Scene 1: entrance scale animation
        const img1 = scene1Ref.current?.querySelector<HTMLImageElement>(".scene-img");
        if (img1) {
          gsap.from(img1, {
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: scene1Ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        // Scene 2: horizontal pan (camera-move feel)
        const img2 = scene2Ref.current?.querySelector<HTMLImageElement>(".scene-img");
        if (img2) {
          gsap.fromTo(
            img2,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: scene2Ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }

        // Removed Scene 3 animation
      });
    },
    { scope: containerRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <div ref={containerRef} id="showroom" data-chapter="6" className="border-t border-[var(--border)] scroll-mt-24">
      {/* Pointer lighting scoped to this chapter */}
      <div
        className="pointer-light absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {/* â”€â”€ Mobile Layout (< lg): Cohesive Showroom Narrative â”€â”€â”€â”€ */}
      <div className="block lg:hidden">
        {/* Scene 1: Flagship Showroom */}
        <div className="relative min-h-[55svh] flex items-end p-6 border-b border-[var(--border)] overflow-hidden">
          <div className="absolute inset-0 bg-[var(--surface-raised)]">
            <img
              src="/cinema/showroom/exterior.png"
              alt="Hardware Collection Showroom Exterior"
              className="w-full h-full object-cover opacity-50 filter contrast-110 brightness-90 sepia-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-raised)] via-[var(--surface-raised)]/60 to-transparent" />
          </div>
          <div className="relative z-10 space-y-3 pb-6">
            <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase">
              Flagship showroom
            </p>
            <h2 className="hc-serif text-4xl sm:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.02]">
              Flagship Showroom<br />
              <span className="text-[var(--text-secondary)]">Sakchi, Jamshedpur.</span>
            </h2>
            <p className="text-[var(--text-primary)] text-base font-light leading-relaxed max-w-md pt-1">
              Architectural hardware, security, and kitchen systems from leading authorized brands &mdash; on display, and in your hands before you specify.
            </p>
          </div>
        </div>

        {/* Scene 2: Live Experience Narrative */}
        <div className="relative min-h-[55svh] flex items-end p-6 border-b border-[var(--border)] overflow-hidden">
          <div className="absolute inset-0 bg-[var(--surface-raised)]">
            <img
              src="/cinema/showroom/interior.png"
              alt="Showroom Interior Displays"
              className="w-full h-full object-cover opacity-45 filter contrast-110 brightness-85 sepia-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-raised)] via-[var(--surface-raised)]/60 to-transparent" />
          </div>
          <div className="relative z-10 space-y-3 pb-6">
            <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs uppercase">
              LIVE DEMONSTRATIONS
            </p>
            <h2 className="hc-serif text-4xl sm:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.02]">
              Touch Before<br />
              <span className="text-[var(--text-secondary)]">You Decide.</span>
            </h2>
            <div className="text-[var(--text-primary)] text-sm sm:text-base font-light space-y-1.5 pt-1">
              <p>&bull; See the living and PVD finishes under gallery lighting.</p>
              <p>&bull; Compare German soft-close and biometric mechanisms.</p>
              <p>&bull; Experience the tactile weight before specification.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop Layout (>= lg): Scenes 01–02 ────────────────────────── */}
      <div className="hidden lg:block">
        {SCENES.slice(0, 2).map((scene, i) => (
          <CinematicScene
            key={scene.id}
            scene={scene}
            index={i}
            sceneRef={sceneRefs[i]}
          />
        ))}
      </div>

      {/* ── CH06.5 — Our Legacy ────────────────────────────────────────── */}
      <AboutStory />
    </div>
  );
}

function CinematicScene({
  scene,
  index,
  sceneRef,
}: {
  scene: (typeof SCENES)[number];
  index: number;
  sceneRef: RefObject<HTMLDivElement | null>;
}) {
  const isLast = index === SCENES.length - 1;

  return (
    <div
      ref={sceneRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        height: "100dvh",
        background: "transparent",
      }}
    >
      {/* Z=1: Background photography with Cinematic CSS Grading */}
      <div className="absolute inset-0 overflow-hidden bg-[var(--surface-raised)]" style={{ zIndex: 1 }}>
        <img
          src={scene.img}
          alt=""
          aria-hidden="true"
          className="scene-img w-full h-full object-cover will-change-transform"
          style={{
            opacity: isLast ? 0.4 : 0.65,
            filter: "contrast(1.15) saturate(0.65) brightness(0.9) sepia(0.15)",
            mixBlendMode: "luminosity",
          }}
        />
        
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, transparent 30%, rgba(248,246,246,0.55) 100%)",
          }}
        />

        <div
          className="absolute inset-0 mix-blend-overlay opacity-70 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top right, rgba(200, 169, 110, 0.45) 0%, transparent 60%)",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(248,246,246,0.80) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-raised)]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Z=3: Typography */}
      <div
        className="relative max-w-[1320px] mx-auto w-full px-8 lg:px-16 flex flex-col items-start justify-end pb-24 lg:pb-32 h-full"
        style={{ zIndex: 3 }}
      >
        <p className="hc-mono text-[#c8a96e] font-semibold tracking-[0.25em] text-xs sm:text-sm uppercase mb-4">
          {scene.eyebrow}
        </p>
        <h2 className="hc-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-light text-[var(--text-primary)] leading-[0.92] mb-6 whitespace-pre-line tracking-[-0.01em]">
          {scene.title}
        </h2>
        <p className="text-base sm:text-xl lg:text-2xl text-[var(--text-secondary)] font-light max-w-2xl leading-relaxed mb-10">
          {scene.sub}
        </p>

        {/* CTAs only on last scene &mdash; quiet zone begins */}
        {isLast && (
          <div className="flex flex-wrap gap-4" style={{ zIndex: 5 }}>
            <MagneticButton>
              <a
                href={SHOWROOM_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-medium text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors duration-200"
              >
                GET DIRECTIONS &rarr;
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={buildWhatsAppUrl("Hi Hardware Collection, I would like to visit the Sakchi showroom.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border border-zinc-600 text-[var(--text-primary)] font-medium text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200"
              >
                WHATSAPP &rarr;
              </a>
            </MagneticButton>
          </div>
        )}
      </div>

      {/* Scene number */}
      <div
        className="absolute top-8 right-8 lg:right-12 text-[var(--text-secondary)] text-xs tracking-widest"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        0{index + 1} / 0{SCENES.length}
      </div>
    </div>
  );
}



