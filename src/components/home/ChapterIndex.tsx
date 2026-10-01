"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { index: "01", label: "THE FINISH" },
  { index: "02", label: "PARTNERS" },
  { index: "03", label: "CATEGORIES" },
  { index: "04", label: "MATERIALS" },
  { index: "05", label: "COLLECTION" },
  { index: "06", label: "SHOWROOM" },
  { index: "07", label: "CONTACT" },
];

/**
 * ChapterIndex
 * Persistent left-rail chapter navigator for desktop (pointer: fine, ≥1024px).
 * Active chapter is tracked via GSAP ScrollTrigger onEnter/onLeave.
 * Uses CSS to hide entirely on touch/mobile — no JS breakpoint checks needed.
 */
export function ChapterIndex() {
  const [activeIndex, setActiveIndex] = useState(0);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const setActive = useCallback((i: number) => setActiveIndex(i), []);

  useEffect(() => {
    // Wait one frame for all chapter elements to mount
    const raf = requestAnimationFrame(() => {
      CHAPTERS.forEach((_, i) => {
        const els = document.querySelectorAll(`[data-chapter="${i + 1}"]`);
        // Find the one that isn't hidden by CSS (display: none)
        const el = Array.from(els).find(
          (e) => window.getComputedStyle(e).display !== "none"
        );
        if (!el) return;

        const trigger = ScrollTrigger.create({
          trigger: el as HTMLElement,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });

        triggersRef.current.push(trigger);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [setActive]);

  return (
    // Hidden on mobile/touch — only fine-pointer desktops see this
    <nav
      aria-label="Chapter navigation"
      className="
        fixed left-6 top-1/2 -translate-y-1/2
        z-50 flex flex-col gap-5
        hidden pointer-events-none
        [@media(pointer:fine)_and_(min-width:1024px)]:flex
      "
    >
      {CHAPTERS.map((ch, i) => {
        const isActive = activeIndex === i;
        return (
          <button
            key={i}
            aria-label={`Chapter ${ch.index}: ${ch.label}`}
            onClick={() => {
              const els = document.querySelectorAll(`[data-chapter="${i + 1}"]`);
              const el = Array.from(els).find(
                (e) => window.getComputedStyle(e).display !== "none"
              );
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="pointer-events-auto flex items-center gap-3 group text-left"
          >
            {/* Tick mark */}
            <span
              className="block h-[1px] transition-all duration-500 ease-out"
              style={{
                width: isActive ? "20px" : "8px",
                backgroundColor: isActive
                  ? "rgba(200, 169, 110, 1)"
                  : "rgba(255, 255, 255, 0.2)",
              }}
            />
            {/* Chapter label — only visible when active or on group hover */}
            <span
              className="text-[10px] tracking-widest uppercase font-medium transition-all duration-300"
              style={{
                color: isActive
                  ? "rgba(200, 169, 110, 1)"
                  : "rgba(255, 255, 255, 0.2)",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateX(0)" : "translateX(-4px)",
              }}
            >
              {ch.index}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
