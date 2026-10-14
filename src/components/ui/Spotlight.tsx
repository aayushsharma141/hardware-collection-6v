import type { PointerEvent } from "react";

let frame = 0;

/**
 * Pointer handler for `.hc-spot` cards. Writes the cursor position, relative to
 * the card, into `--sx` / `--sy` so `.hc-spot-glow` can follow it. One write per
 * animation frame, mouse only: touch has no hover to follow.
 */
export function trackSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const { clientX, clientY } = event;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${clientX - rect.left}px`);
    el.style.setProperty("--sy", `${clientY - rect.top}px`);
  });
}

/** Light that follows the cursor across a card. Parent needs `hc-spot`. */
export function SpotlightGlow({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`hc-spot-glow ${className}`} />;
}
