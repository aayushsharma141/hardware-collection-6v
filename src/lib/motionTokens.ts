export const motionTokens = {
  duration: {
    micro: 0.2,
    standard: 0.45,
    editorial: 0.8,
    cinematic: 1.2,
  },
  ease: {
    standard: [0.25, 0.1, 0.25, 1.0], // cubic-bezier equivalent to power2.out
    editorial: [0.16, 1, 0.3, 1],      // power3.out
    cinematic: [0.22, 1, 0.36, 1],     // power4.out
    gsap: {
      standard: "power2.out",
      editorial: "power3.out",
      cinematic: "power4.out",
    }
  },
  distance: {
    small: 12,
    medium: 32,
    large: 72,
  },
  stagger: {
    tight: 0.04,
    standard: 0.08,
    editorial: 0.12,
  },
} as const;

export type MotionTokens = typeof motionTokens;

/**
 * Z-Axis Depth Contract — permanent project rule.
 * All 7 chapters follow this spatial language to feel like one website.
 *
 * ATMOSPHERE    z-index: 0   — fixed canvas, dark gradient, ambient colour shifts
 * ENVIRONMENT   z-index: 1   — background photography, textures
 * PRIMARY VISUAL z-index: 2  — product images, hardware specimens
 * EDITORIAL TYPE z-index: 3  — headlines, finish names, body copy
 * INTERACTION   z-index: 4   — Material Lens overlay, light sweep, hover states
 * CONVERSION    z-index: 5   — WhatsApp, Call, Directions CTAs
 */
export const zLayers = {
  atmosphere: 0,
  environment: 1,
  primaryVisual: 2,
  editorialType: 3,
  interaction: 4,
  conversion: 5,
} as const;

/**
 * Visual Tension Map — controls which chapters receive which effect levels.
 * Not every chapter gets every effect. This creates the tension→release rhythm.
 *
 * CH01 HIGH         — pinned film, parallax, clip-path, light sweep
 * CH02 LOW          — opacity + scale only, no pinning, no clip-path
 * CH03 MEDIUM       — horizontal scroll, parallax
 * CH04 VERY HIGH    — pinned macro, material lens, light sweep (primary showcase)
 * CH05 MEDIUM       — horizontal reel, hover only
 * CH06 HIGH         — pinned scenes, camera pan
 * CH07 QUIET        — opacity only, no parallax, no skew, stable CTAs
 */
export const visualTension = {
  ch01: "high",
  ch02: "low",
  ch03: "medium",
  ch04: "very-high",
  ch05: "medium",
  ch06: "high",
  ch07: "quiet",
} as const;

