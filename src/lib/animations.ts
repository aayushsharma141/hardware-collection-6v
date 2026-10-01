import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Motion Budget Constants (150ms - 250ms per Phase 9 constraints)
export const DURATION = {
  FAST: 0.15,
  BASE: 0.18,
  SLOW: 0.22,
  HERO: 0.25, // Only for exceptional cases like initial load
};

// Easing Constants
export const EASE = {
  // Luxurious, smooth out
  LUXURY: 'power3.out',
  // Snappier but still elegant
  BASE: 'power2.out',
  // For subtle continuous movements
  LINEAR: 'none',
};

/**
 * Utility to respect prefers-reduced-motion
 * We should check this before running complex animations.
 */
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }
  return false;
};

/**
 * Configure GSAP globally
 */
if (typeof window !== 'undefined') {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Set global defaults
  gsap.defaults({
    ease: EASE.BASE,
    duration: DURATION.BASE,
  });
}

// Re-export common GSAP utilities for convenience
export { gsap, useGSAP, ScrollTrigger };
