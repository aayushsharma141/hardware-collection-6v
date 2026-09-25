"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { generateWhatsAppUrl, SHOWROOM_MAP_URL } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * ShowroomCinematic &mdash; Chapter 06 "Inside the Showroom"
 * Visual tension: HIGH
 *
 * Desktop (GSAP, pinned, 3 scenes):
 *   Scene 1 &mdash; Entrance: Exterior photograph, scale 1.15→1.0, "20+ AUTHORIZED BRANDS &middot; SAKCHI"
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
          gsap.fromTo(img1, 
            { yPercent: -8, scale: 1.15 },
            {
              yPercent: 8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scene1Ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }

        // Scene 2: horizontal pan (camera-move feel)
        const img2 = scene2Ref.current?.querySelector<HTMLImageElement>(".scene-img");
        if (img2) {
          gsap.fromTo(
            img2,
            { xPercent: -5, yPercent: 0, scale: 1.05 },
            {
              xPercent: 5,
              yPercent: 0,
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: scene2Ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }

        // Removed Scene 3 animation
      });

      mm.add("(max-width: 1023px)", () => {
        // Mobile Parallax for Images
        gsap.utils.toArray<HTMLImageElement>(".mobile-scene-img").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -5, scale: 1.08 },
            {
              yPercent: 5,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        });
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
      <div className="block lg:hidden w-full max-w-md mx-auto">
        {/* Scene 1: Flagship Showroom */}
        <div className="p-4 pt-12 pb-3">
          <div className="relative min-h-[60svh] flex items-end p-6 overflow-hidden rounded-[2rem] ring-1 ring-black/5 dark:ring-white/10 bg-black/5 dark:bg-white/5">
            <div className="absolute inset-[6px] overflow-hidden rounded-[calc(2rem-6px)] bg-[var(--surface-raised)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <img
                src="/cinema/showroom/exterior.png"
                alt="Hardware Collection Showroom Exterior"
                className="mobile-scene-img w-[110%] h-[110%] absolute top-[-5%] left-[-5%] object-cover opacity-[0.85] filter contrast-105 saturate-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-raised)]/95 via-[var(--surface-raised)]/40 to-transparent pointer-events-none" />
            </div>
            
            <div className="relative z-10 pb-2 px-1 w-full">
              <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 backdrop-blur-md mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <span className="hc-mono text-[var(--text-primary)] font-medium tracking-[0.2em] text-[9px] uppercase">
                  Flagship showroom
                </span>
              </div>
              <h2 className="hc-serif text-5xl sm:text-6xl font-light tracking-[-0.02em] text-[var(--text-primary)] leading-[0.95]">
                Flagship Showroom<br />
                <span className="text-[var(--text-secondary)]">Sakchi, Jamshedpur.</span>
              </h2>
              <p className="text-[var(--text-primary)] text-sm font-light leading-relaxed pt-5 opacity-90 max-w-[280px]">
                Architectural hardware, security, and kitchen systems from leading authorized brands, on display and in your hands before you specify.
              </p>
            </div>
          </div>
        </div>

        {/* Scene 2: Live Experience Narrative */}
        <div className="p-4 pb-12 pt-3">
          <div className="relative min-h-[60svh] flex items-end p-6 overflow-hidden rounded-[2rem] ring-1 ring-black/5 dark:ring-white/10 bg-black/5 dark:bg-white/5">
            <div className="absolute inset-[6px] overflow-hidden rounded-[calc(2rem-6px)] bg-[var(--surface-raised)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <img
                src="/cinema/showroom/interior.png"
                alt="Showroom Interior Displays"
                className="mobile-scene-img w-[110%] h-[110%] absolute top-[-5%] left-[-5%] object-cover opacity-[0.85] filter contrast-105 saturate-105 will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-raised)]/95 via-[var(--surface-raised)]/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 pb-2 px-1 w-full">
              <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 backdrop-blur-md mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <span className="hc-mono text-[var(--text-primary)] font-medium tracking-[0.2em] text-[9px] uppercase">
                  LIVE DEMONSTRATIONS
                </span>
              </div>
              <h2 className="hc-serif text-5xl sm:text-6xl font-light tracking-[-0.02em] text-[var(--text-primary)] leading-[0.95]">
                Touch Before<br />
                <span className="text-[var(--text-secondary)]">You Decide.</span>
              </h2>
              <div className="text-[var(--text-primary)] text-sm font-light space-y-2 pt-5 opacity-90">
                <p>&bull; See the living and PVD finishes under gallery lighting.</p>
                <p>&bull; Compare German soft-close and biometric mechanisms.</p>
                <p>&bull; Experience the tactile weight before specification.</p>
              </div>
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
          className="scene-img absolute top-[-10%] left-[-5%] w-[110%] h-[120%] object-cover will-change-transform"
          style={{
            opacity: isLast ? 0.62 : 0.85,
            filter: "contrast(1.06) saturate(1.04)",
          }}
        />
        
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, transparent 45%, rgba(247, 240, 226,0.32) 100%)",
          }}
        />

        <div
          className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top right, rgba(200, 169, 110, 0.45) 0%, transparent 60%)",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(247, 240, 226,0.80) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-raised)]/95 via-[var(--surface-raised)]/65 to-transparent pointer-events-none" />
      </div>

      {/* Z=3: Typography */}
      <div
        className="relative max-w-[1320px] mx-auto w-full px-8 lg:px-16 flex flex-col items-start justify-end pb-24 lg:pb-32 h-full"
        style={{ zIndex: 3 }}
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface-raised)]/20 backdrop-blur-md mb-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <span className="hc-mono text-[#c8a96e] font-medium tracking-[0.2em] text-[10px] sm:text-xs uppercase">
            {scene.eyebrow}
          </span>
        </div>
        <h2 className="hc-serif text-6xl sm:text-7xl lg:text-[7.5rem] xl:text-[9rem] font-light text-[var(--text-primary)] leading-[0.9] mb-8 whitespace-pre-line tracking-[-0.02em]">
          {scene.title}
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-[var(--text-secondary)] font-light max-w-2xl leading-relaxed mb-12">
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
                className="group inline-flex items-center justify-between pl-7 pr-2 py-2 bg-[var(--text-primary)] text-[var(--surface-base)] rounded-full transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] hover:bg-black dark:hover:bg-white"
              >
                <span className="font-medium text-xs tracking-[0.2em] uppercase mr-6">Get Directions</span>
                <div className="w-10 h-10 rounded-full bg-[var(--surface-base)]/20 dark:bg-black/10 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href={generateWhatsAppUrl("showroom-visit")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between pl-7 pr-2 py-2 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[var(--text-primary)] rounded-full transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] hover:bg-black/10 dark:hover:bg-white/10"
              >
                <span className="font-medium text-xs tracking-[0.2em] uppercase mr-6">WhatsApp</span>
                <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </a>
            </MagneticButton>
          </div>
        )}
      </div>

      {/* Scene number */}
      <div
        className="absolute top-8 right-8 lg:right-12 flex items-center gap-4 text-[var(--text-secondary)]"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        <span className="w-8 lg:w-16 h-px bg-[var(--text-secondary)] opacity-30"></span>
        <span className="hc-mono text-[10px] tracking-[0.2em] font-medium">0{index + 1} / 0{SCENES.length}</span>
      </div>
    </div>
  );
}



