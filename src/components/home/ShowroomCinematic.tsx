"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { buildWhatsAppUrl, SHOWROOM_MAP_URL } from "@/lib/config";

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
    sub: "7,500 sq ft of architectural hardware, security, and kitchen systems on physical display.",
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
    sub: "Authorized partner for 23 architectural hardware, security, and kitchen brands. Open 7 days.",
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
    <div ref={containerRef} id="showroom" data-chapter="6" className="border-t border-zinc-900 scroll-mt-24">
      {/* Pointer lighting scoped to this chapter */}
      <div
        className="pointer-light absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      {/* ── Mobile Layout (< lg): Cohesive Showroom Narrative ──── */}
      <div className="block lg:hidden">
        {/* Scene 1: Flagship Showroom */}
        <div className="relative min-h-[55svh] flex items-end p-6 border-b border-zinc-900 overflow-hidden">
          <div className="absolute inset-0 bg-[#0A0A0C]">
            <img
              src="/cinema/showroom/exterior.png"
              alt="Hardware Collection Showroom Exterior"
              className="w-full h-full object-cover opacity-50 filter contrast-110 brightness-90 sepia-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          </div>
          <div className="relative z-10 space-y-2 pb-4">
            <p className="text-[#C8A96E] font-medium tracking-widest text-[11px] uppercase">
              CHAPTER 06 · FLAGSHIP SHOWROOM
            </p>
            <h2 className="text-[28px] sm:text-3xl font-light text-white leading-tight">
              Flagship Showroom<br />
              <span className="text-zinc-500">Sakchi, Jamshedpur.</span>
            </h2>
            <p className="text-zinc-300 text-sm font-light leading-relaxed max-w-md pt-1">
              7,500 sq ft of architectural hardware, security, and kitchen systems — on display, and in your hands before you specify.
            </p>
          </div>
        </div>

        {/* Scene 2: Live Experience Narrative */}
        <div className="relative min-h-[55svh] flex items-end p-6 border-b border-zinc-900 overflow-hidden">
          <div className="absolute inset-0 bg-[#0A0A0C]">
            <img
              src="/cinema/showroom/interior.png"
              alt="Showroom Interior Displays"
              className="w-full h-full object-cover opacity-45 filter contrast-110 brightness-85 sepia-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          </div>
          <div className="relative z-10 space-y-2 pb-4">
            <p className="text-[#C8A96E] font-medium tracking-widest text-[11px] uppercase">
              LIVE DEMONSTRATIONS
            </p>
            <h2 className="text-[28px] sm:text-3xl font-light text-white leading-tight">
              Touch Before<br />
              <span className="text-zinc-500">You Decide.</span>
            </h2>
            <div className="text-zinc-300 text-sm font-light space-y-1 pt-1">
              <p>• See the living and PVD finishes under gallery lighting.</p>
              <p>• Compare German soft-close and biometric mechanisms.</p>
              <p>• Experience the tactile weight before specification.</p>
            </div>
          </div>
        </div>

        {/* Scene 3: Come Feel the Difference */}
        <div className="relative min-h-[50svh] flex items-end p-6 overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 bg-[#0A0A0C]">
            <img
              src="/cinema/showroom/exterior-2.png"
              alt="Showroom Location Entrance"
              className="w-full h-full object-cover opacity-35 filter contrast-110 brightness-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          </div>
          <div className="relative z-10 space-y-3 pb-6">
            <p className="text-[#C8A96E] font-medium tracking-widest text-[11px] uppercase">
              VISIT SAKCHI SHOWROOM
            </p>
            <h2 className="text-[28px] sm:text-3xl font-light text-white leading-tight">
              Come Feel<br />
              <span className="text-zinc-500">the Difference.</span>
            </h2>
            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
              Hardware is experienced before it is specified. Open Monday to Sunday, 10:00 AM – 8:00 PM.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-700 text-white text-xs font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop Layout (≥ lg): GSAP Cinematic Scenes ────────── */}
      <div className="hidden lg:block">
        {SCENES.map((scene, i) => {
          const isLast = i === SCENES.length - 1;
          return (
            <div
              key={scene.id}
              ref={sceneRefs[i]}
              className="relative overflow-hidden flex items-center justify-center"
              style={{
                height: "100dvh",
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
                    filter: "contrast(1.15) saturate(0.65) brightness(0.9) sepia(0.15)",
                    mixBlendMode: "luminosity",
                  }}
                />
                
                <div
                  className="absolute inset-0 mix-blend-multiply pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at center, transparent 0%, rgba(10,10,12,0.9) 100%)",
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
                <p className="hc-mono text-[#c8a96e] font-medium tracking-[0.22em] text-[10px] sm:text-xs uppercase mb-4">
                  {scene.eyebrow}
                </p>
                <h2 className="hc-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal text-[#e8e3d9] leading-[0.98] mb-6 whitespace-pre-line tracking-[0.015em]">
                  {scene.title}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-[#d1ccc4] font-light max-w-xl leading-relaxed mb-10">
                  {scene.sub}
                </p>

                {/* CTAs only on last scene — quiet zone begins */}
                {isLast && (
                  <div className="flex flex-wrap gap-4" style={{ zIndex: 5 }}>
                    <MagneticButton>
                      <a
                        href={SHOWROOM_MAP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-white text-black font-medium text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors duration-200"
                      >
                        GET DIRECTIONS →
                      </a>
                    </MagneticButton>
                    <MagneticButton>
                      <a
                        href={buildWhatsAppUrl("Hi Hardware Collection, I would like to visit the Sakchi showroom.")}
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
    </div>
  );
}
