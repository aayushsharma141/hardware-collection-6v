/**
 * Centralized scroll-lock utility.
 *
 * Uses a reference counter so multiple callers can independently lock/unlock
 * without clobbering each other. The page scroll is restored only once every
 * caller has unlocked.
 *
 * Usage:
 *   import { lockScroll, unlockScroll } from "@/lib/scrollLock";
 *   lockScroll();   // in useEffect
 *   unlockScroll(); // in cleanup / on close
 */

let lockCount = 0;

export function lockScroll(): void {
  lockCount++;
  if (lockCount === 1) {
    document.body.style.overflow = "hidden";
  }
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
  }
}
