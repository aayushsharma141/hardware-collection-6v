"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";

/**
 * AtmosphericBackground
 * z-index: 0 — sits behind all 7 chapters.
 * Scroll progress drives CSS custom property colour shifts:
 *   0%–20%  → deep charcoal #0a0a0c
 *   35%–55% → warm graphite (CH04 material peak)
 *   70%–80% → subtle bronze haze (showroom)
 *   90%–100%→ quiet black (conversion zone)
 *
 * Uses document.documentElement.style.setProperty to avoid React render cycles.
 */
export function AtmosphericBackground() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rafRef = useRef<number>(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (shouldReduceMotion || typeof window === "undefined") return;

    // Cancel any pending RAF to avoid stacking
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const r = lerp(latest,
        [0,    0.15,  0.3,   0.5,   0.65,  0.8,   1.0],
        [10,   10,    14,    16,    14,    12,    10],
      );
      const g = lerp(latest,
        [0,    0.15,  0.3,   0.5,   0.65,  0.8,   1.0],
        [10,   10,    12,    13,    12,    10,    10],
      );
      const b = lerp(latest,
        [0,    0.15,  0.3,   0.5,   0.65,  0.8,   1.0],
        [12,   12,    13,    12,    12,    12,    12],
      );

      const root = document.documentElement;
      root.style.setProperty("--atm-r", String(Math.round(r)));
      root.style.setProperty("--atm-g", String(Math.round(g)));
      root.style.setProperty("--atm-b", String(Math.round(b)));
    });
  });

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        backgroundColor: "rgb(var(--atm-r), var(--atm-g), var(--atm-b))",
        // Smooth value transitions via CSS — no flicker
        transition: "background-color 1.2s ease",
      }}
    />
  );
}

/**
 * Piecewise linear interpolation.
 * Given a progress value [0–1] and matching input/output keyframe arrays,
 * returns the interpolated output value.
 */
function lerp(
  progress: number,
  inputs: number[],
  outputs: number[],
): number {
  const n = inputs.length;
  if (progress <= inputs[0]) return outputs[0];
  if (progress >= inputs[n - 1]) return outputs[n - 1];

  for (let i = 0; i < n - 1; i++) {
    if (progress >= inputs[i] && progress <= inputs[i + 1]) {
      const t = (progress - inputs[i]) / (inputs[i + 1] - inputs[i]);
      return outputs[i] + t * (outputs[i + 1] - outputs[i]);
    }
  }
  return outputs[n - 1];
}
