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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0E0C0C]/70 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Go to page"
        className="w-full max-w-xs rounded-2xl border border-white/10 bg-[#171414] p-6 text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]"
      >
        <h2 className="font-body text-[11px] uppercase tracking-[0.18em] text-white/55">
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
          className="mt-4 w-full rounded-xl border border-white/12 bg-[#0E0C0C] py-3 text-center font-display text-3xl tabular-nums text-white hc-focus"
        />
        <p className="mt-2 font-body text-xs text-white/45">of {pages || "–"} pages</p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-xl border border-white/12 font-body text-[11px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hc-focus"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={commit}
            className="min-h-11 flex-1 rounded-xl bg-[#C8A96E] font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E0C0C] transition-colors hover:bg-[#d8bb84] hc-focus"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
