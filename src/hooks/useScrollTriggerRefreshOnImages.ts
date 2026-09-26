"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Keeps ScrollTrigger's cached measurements honest while images inside a
 * GSAP-driven section are still arriving.
 *
 * ScrollTrigger measures start/end positions once, when the trigger is
 * created. While every image was an eager `<img>` that was usually accurate by
 * the time a scene mattered. `next/image` lazy-loads by default and decodes
 * off the main thread, so an image can settle *after* its trigger was
 * measured. The migrated containers all carry a fixed aspect ratio, so this is
 * insurance rather than a fix for an observed shift — but a single late
 * reflow is enough to leave a pinned scene ending in the wrong place, and a
 * refresh is far cheaper than that failure.
 *
 * Refreshes are collapsed into one frame so a section of twelve images
 * triggers one recalculation, not twelve.
 */
export function useScrollTriggerRefreshOnImages(
  ref: React.RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root) return;

    let frame = 0;
    const scheduleRefresh = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        ScrollTrigger.refresh();
      });
    };

    const pending = Array.from(root.querySelectorAll("img")).filter(
      (img) => !img.complete,
    );
    if (pending.length === 0) return;

    pending.forEach((img) => {
      img.addEventListener("load", scheduleRefresh);
      img.addEventListener("error", scheduleRefresh);
    });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      pending.forEach((img) => {
        img.removeEventListener("load", scheduleRefresh);
        img.removeEventListener("error", scheduleRefresh);
      });
    };
  }, [ref, enabled]);
}
