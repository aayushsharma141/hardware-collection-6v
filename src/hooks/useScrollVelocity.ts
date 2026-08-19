"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollVelocity
 *
 * Reads scroll velocity from wheel/scroll events, applies a clamped + lerped skewY
 * to `--scroll-skew` on :root. Applied only to elements with `cinema-skew-layer` class.
 *
 * NEVER applies to: body, nav, CTAs, product specs, form elements.
 *
 * Guards:
 *   - Only on pointer:fine (desktop)
 *   - Max ±1.5deg
 *   - Lerp factor: 0.08 (soft spring feel)
 *   - Snap-to-zero threshold prevents infinite micro-animation
 */
export function useScrollVelocity() {
  const currentSkewRef = useRef(0);
  const targetSkewRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isActiveRef = useRef(false);
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const MAX_SKEW = 1.5;
    const LERP = 0.08;
    const VELOCITY_SCALE = 0.0015; // px/ms → degrees

    const root = document.documentElement;

    // Derive velocity from scroll position delta / time delta
    const handleScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const dt = now - lastTimestamp.current;
      const dy = scrollY - lastScrollY.current;

      if (dt > 0) {
        const velocityPxMs = dy / dt; // px per millisecond
        const rawSkew = Math.min(
          MAX_SKEW,
          Math.max(-MAX_SKEW, velocityPxMs * VELOCITY_SCALE * -1)
        );
        targetSkewRef.current = rawSkew;
      }

      lastScrollY.current = scrollY;
      lastTimestamp.current = now;
    };

    const tick = () => {
      if (!isActiveRef.current) return;

      // Lerp toward target
      currentSkewRef.current +=
        (targetSkewRef.current - currentSkewRef.current) * LERP;

      // Decay target toward zero (scroll ended)
      targetSkewRef.current *= 0.9;

      // Snap to zero below threshold
      if (Math.abs(currentSkewRef.current) < 0.005) currentSkewRef.current = 0;
      if (Math.abs(targetSkewRef.current) < 0.005) targetSkewRef.current = 0;

      root.style.setProperty(
        "--scroll-skew",
        `${currentSkewRef.current.toFixed(3)}deg`
      );

      rafRef.current = requestAnimationFrame(tick);
    };

    isActiveRef.current = true;
    lastScrollY.current = window.scrollY;
    lastTimestamp.current = performance.now();

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      isActiveRef.current = false;
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
}
