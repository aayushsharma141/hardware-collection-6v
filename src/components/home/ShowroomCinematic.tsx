"use client";

import { useRef, type RefObject } from "react";
import Image from "next/image";
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

interface ShowroomCinematicProps {
  images?: string[];
}

export default function ShowroomCinematic({ images }: ShowroomCinematicProps) {
  const activeScenes = SCENES.map((scene, i) => {
    if (images && images[i]) {
      return { ...scene, img: images[i] };
    }
    return scene;
  });

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

      {/* â”€â”€ Desktop Layout (>= lg): Scenes 01â€“02 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="hidden lg:block">
        {activeScenes.slice(0, 2).map((scene, i) => (
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
        {/* unoptimized preserves the exact src path that GSAP ScrollTrigger
            targets via the .scene-img selector â€” Next.js image transforms
            would change the URL and break the animation binding. */}
        {/* The bleed box is oversized so the GSAP pan/scale never reveals an
            edge; `fill` forbids sizing the <Image> itself, so the wrapper owns it. */}
        <div className="absolute" style={{ top: "-10%", left: "-5%", width: "110%", height: "120%" }}>
          <Image
            src={scene.img}
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            className="scene-img object-cover will-change-transform"
            style={{
              opacity: isLast ? 0.8 : 0.95,
              filter: "contrast(1.06) saturate(1.04)",
            }}
          />
        </div>

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
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-raised)]/90 via-[var(--surface-raised)]/45 via-45% to-transparent to-80% pointer-events-none" />
      </div>

      {/* Z=3: Typography */}
      <div
        className="relative max-w-[1320px] mx-auto w-full px-8 lg:px-16 flex flex-col items-start justify-end pb-24 lg:pb-32 h-full"
        style={{ zIndex: 3 }}
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface-raised)]/20 backdrop-blur-md mb-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <span className="hc-mono text-brass-ink font-medium tracking-[0.2em] text-[10px] sm:text-xs uppercase">
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
                className="group inline-flex items-center justify-between pl-7 pr-2 py-2 bg-[var(--text-primary)] text-[var(--surface)] rounded transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] hover:bg-black dark:hover:bg-white"
              >
                <span className="font-medium text-xs tracking-[0.2em] uppercase mr-6">Get Directions</span>
                <div className="w-10 h-10 rounded bg-[var(--surface)]/20 dark:bg-black/10 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
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
                className="group inline-flex items-center justify-between pl-7 pr-2 py-2 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm text-[var(--text-primary)] rounded transition-[transform,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] hover:bg-black/10 dark:hover:bg-white/10"
              >
                <span className="font-medium text-xs tracking-[0.2em] uppercase mr-6">WhatsApp</span>
                <div className="w-10 h-10 rounded border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
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



