/**
 * Centralized scroll-lock utility.
 *
 * Uses a reference counter so multiple callers can independently lock/unlock
 * without clobbering each other. The page scroll is restored only once every
 * caller has unlocked.
 *
 * Usage:
 *   import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
 *   lockScroll();   // in useEffect
 *   unlockScroll(); // in cleanup / on close
 */

let lockCount = 0;

export function lockScroll(): void {
  lockCount++;
  if (lockCount === 1) {
    if (typeof document !== "undefined" && document.body) {
      if (typeof window !== "undefined" && document.documentElement) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
      document.body.style.overflow = "hidden";
      if (document.documentElement?.classList) {
        document.documentElement.classList.add("lenis-stopped");
      }
    }
    if (typeof window !== "undefined") {
      const lenis = (window as unknown as { __lenis?: { stop: () => void } }).__lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      }
    }
  }
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    if (typeof document !== "undefined" && document.body) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (document.documentElement?.classList) {
        document.documentElement.classList.remove("lenis-stopped");
      }
    }
    if (typeof window !== "undefined") {
      const lenis = (window as unknown as { __lenis?: { start: () => void } }).__lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
    }
  }
}
