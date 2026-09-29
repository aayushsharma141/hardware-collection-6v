"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageArrowsProps {
  page: number;
  pages: number;
  /** Follows the viewer chrome: hidden while the customer is reading. */
  visible: boolean;
  onStep: (delta: number) => void;
}

const arrow =
  "v-press pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--v-line)] bg-[var(--v-panel)] text-[var(--v-text-dim)] shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:text-[var(--v-text)] disabled:pointer-events-none disabled:opacity-0 hc-focus";

/** Previous / next page buttons resting at the vertical middle of the viewer. */
export default function PageArrows({ page, pages, visible, onStep }: PageArrowsProps) {
  if (pages <= 1) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Previous page"
        tabIndex={visible ? 0 : -1}
        disabled={page <= 1}
        onClick={() => onStep(-1)}
        className={arrow}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next page"
        tabIndex={visible ? 0 : -1}
        disabled={page >= pages}
        onClick={() => onStep(1)}
        className={arrow}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
