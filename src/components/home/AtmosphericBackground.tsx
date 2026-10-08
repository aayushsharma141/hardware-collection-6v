"use client";

import { useReducedMotion } from "motion/react";

/**
 * AtmosphericBackground
 * z-index: 0 — sits behind all 7 chapters.
 * CSS-only scroll-driven background replacing JS requestAnimationFrame.
 */
export function AtmosphericBackground() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-10 bg-[var(--surface)]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="atmospheric-bg fixed inset-0 pointer-events-none -z-10"
      style={{
        // Smooth value transitions via CSS — no flicker
        transition: "background-color 1.2s ease",
      }}
    />
  );
}

