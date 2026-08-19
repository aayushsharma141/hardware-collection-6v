"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * ShowroomCinematic — Chapter 06 "Inside the Showroom"
 * Visual tension: HIGH
 *
 * Desktop (GSAP, pinned, 3 scenes):
 *   Scene 1 — Entrance: Exterior photograph, scale 1.15→1.0, "7,500 SQ FT · SAKCHI"
 *   Scene 2 — Product Wall: Interior horizontal pan (translateX), door hardware display
 *   Scene 3 — Location: Atmosphere dims, CTAs appear as quiet zone transition begins
 *
 * Pointer lighting active in this chapter.
 * gsap.matchMedia — mobile gets static vertical photography sequence, no pinning.
 */

const SCENES = [
  {
    id: "entrance",
    eyebrow: "THE SHOWROOM",
    title: "FLAGSHIP SHOWROOM\nSAKCHI",
    sub: "Jamshedpur's most comprehensive architectural hardware destination.",
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
  {
    id: "location",
    eyebrow: "VISIT US",
    title: "Come Feel\nthe Difference.",
    sub: "Official partners for Häfele, Dorset, Labacha, Godrej & Hettich. Open 7 days.",
    img: "/cinema/showroom/exterior-2.png",
    panType: "scale" as const,
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

        // Scene 3: subtle y tilt — "camera" looks slightly down as it enters
        const img3 = scene3Ref.current?.querySelector<HTMLImageElement>(".scene-img");
        if (img3) {
          gsap.from(img3, {
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: scene3Ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });
    },
    { scope: containerRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <div ref={containerRef} data-chapter="6" className="border-t border-zinc-900">
      {/* Pointer lighting scoped to this chapter */}
      <div
        className="pointer-light absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {SCENES.map((scene, i) => {
        const isLast = i === SCENES.length - 1;
        return (
          <div
            key={scene.id}
            ref={sceneRefs[i]}
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              height: "100dvh",
              // Slight atmosphere shift into the quiet zone on last scene
              background: isLast ? "rgba(10,10,12,0.6)" : "transparent",
            }}
          >
            {/* Z=1: Background photography with Cinematic CSS Grading */}
            <div className="absolute inset-0 overflow-hidden bg-[#0A0A0C]" style={{ zIndex: 1 }}>
              <img
                src={scene.img}
                alt=""
                aria-hidden="true"
                className="scene-img w-full h-full object-cover will-change-transform"
                style={{
                  opacity: isLast ? 0.4 : 0.65,
                  // Grade the real photos: boost contrast, drop saturation, slight sepia warmth
                  filter: "contrast(1.15) saturate(0.65) brightness(0.9) sepia(0.15)",
                  mixBlendMode: "luminosity", // Strips harsh original colors, blends luminance into the dark BG
                }}
              />
              
              {/* Grading Layer 1: Heavy vignette & base darkness */}
              <div
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{
                  background: "radial-gradient(circle at center, transparent 0%, rgba(10,10,12,0.9) 100%)",
                }}
              />

              {/* Grading Layer 2: Warm ambient light simulation (gallery key light) */}
              <div
                className="absolute inset-0 mix-blend-overlay opacity-70 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top right, rgba(200, 169, 110, 0.45) 0%, transparent 60%)",
                }}
              />

              {/* Grading Layer 3: Contrast crush for typography readability */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isLast
                    ? "linear-gradient(to bottom, rgba(10,10,12,0.5) 0%, rgba(10,10,12,0.95) 100%)"
                    : "linear-gradient(to bottom, rgba(10,10,12,0.1) 0%, rgba(10,10,12,0.85) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />
            </div>

            {/* Z=3: Typography */}
            <div
              className="relative container mx-auto px-6 lg:px-16 flex flex-col items-start justify-end pb-24 lg:pb-32 h-full"
              style={{ zIndex: 3 }}
            >
              <p className="text-[#C8A96E] font-medium tracking-widest text-xs uppercase mb-4">
                {scene.eyebrow}
              </p>
              <h2 className="text-5xl lg:text-7xl xl:text-8xl font-light text-white leading-[1.05] mb-6 whitespace-pre-line">
                {scene.title}
              </h2>
              <p className="text-lg lg:text-xl text-zinc-300 font-light max-w-xl leading-relaxed mb-10">
                {scene.sub}
              </p>

              {/* CTAs only on last scene — quiet zone begins */}
              {isLast && (
                <div className="flex flex-wrap gap-4" style={{ zIndex: 5 }}>
                  <MagneticButton>
                    <a
                      href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-white text-black font-medium text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors duration-200"
                    >
                      GET DIRECTIONS →
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <a
                      href="https://wa.me/919835190738"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 border border-zinc-600 text-white font-medium text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      WHATSAPP →
                    </a>
                  </MagneticButton>
                </div>
              )}
            </div>

            {/* Scene number */}
            <div
              className="absolute top-8 right-8 lg:right-12 text-zinc-700 text-xs tracking-widest"
              style={{ zIndex: 10 }}
              aria-hidden="true"
            >
              0{i + 1} / 0{SCENES.length}
            </div>
          </div>
        );
      })}
    </div>
  );
}
