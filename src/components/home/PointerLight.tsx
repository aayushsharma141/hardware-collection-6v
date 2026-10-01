"use client";

import { useEffect, useRef } from "react";

/**
 * PointerLight
 * Scoped to: CH01 Hero, CH04 Material Cinema, CH05 Product Reel, CH06 Showroom.
 * NOT applied globally — cursor is not a constant visual distraction.
 *
 * Approach: write --pointer-x and --pointer-y to :root on pointermove.
 * Each chapter that wants the effect adds `.pointer-light` to a cover div.
 * Pure CSS custom property approach — no React state, no re-renders.
 *
 * Guard: only activates on @media (pointer: fine) devices.
 */
export function PointerLight() {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only run on fine-pointer (mouse) devices
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const root = document.documentElement;

    const handleMove = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const x = ((e.clientX / window.innerWidth) * 100).toFixed(1);
        const y = ((e.clientY / window.innerHeight) * 100).toFixed(1);
        root.style.setProperty("--pointer-x", `${x}%`);
        root.style.setProperty("--pointer-y", `${y}%`);
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // This component renders nothing — it only registers the event listener
  return null;
}
