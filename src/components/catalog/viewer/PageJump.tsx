"use client";

import React, { useState } from "react";

interface PageJumpProps {
  page: number;
  pages: number;
  onGo: (page: number) => void;
  onCancel: () => void;
}

export default function PageJump({ page, pages, onGo, onCancel }: PageJumpProps) {
  const [value, setValue] = useState(String(page));

  const commit = () => {
    const target = Number.parseInt(value, 10);
    if (Number.isFinite(target)) onGo(Math.min(Math.max(target, 1), pages || 1));
    else onCancel();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--v-chrome)] px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Go to page"
        className="w-full max-w-xs rounded-2xl border border-[var(--v-line)] bg-[var(--v-panel)] p-6 text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.15)]"
      >
        <h2 className="font-body text-[11px] uppercase tracking-[0.18em] text-[var(--v-text-dim)]">
          Go to page
        </h2>
        <label className="sr-only" htmlFor="catalogue-page-jump">
          Page number, 1 to {pages || 1}
        </label>
        <input
          id="catalogue-page-jump"
          type="number"
          inputMode="numeric"
          min={1}
          max={pages || 1}
          value={value}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => setValue(e.target.value)}
          // Enter is handled here rather than left to implicit form submission,
          // which a number input does not reliably trigger.
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          className="v-press mt-4 w-full rounded-xl border border-[var(--v-line-strong)] bg-[var(--v-panel)] py-3 text-center font-display text-3xl tabular-nums text-[var(--v-text)] hc-focus"
        />
        <p className="mt-2 font-body text-xs text-[var(--v-text-faint)]">of {pages || "–"} pages</p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="v-press min-h-11 flex-1 rounded border border-[var(--v-line-strong)] bg-[var(--v-panel)] font-body text-[11px] text-[var(--v-text-dim)] hover:border-[var(--v-text)] hover:text-[var(--v-text)] hc-focus"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={commit}
            className="v-press min-h-11 flex-1 rounded bg-[var(--v-text)] font-body text-[11px] font-bold text-[var(--v-surface)] hover:bg-white hc-focus"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
