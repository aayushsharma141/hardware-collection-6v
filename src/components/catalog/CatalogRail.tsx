"use client";

import React from "react";

/**
 * The catalog viewer's controls live in two floating vertical rails rather
 * than full-width chrome, so the page itself keeps the whole viewport.
 *
 * Every control is an icon button, so each one carries both an `aria-label`
 * for assistive tech and a visible tooltip that appears on hover *and* on
 * keyboard focus — an icon-only rail is unusable otherwise.
 */

interface RailProps {
  side: "left" | "right";
  label: string;
  children: React.ReactNode;
}

export function Rail({ side, label, children }: RailProps) {
  return (
    <div
      role="toolbar"
      aria-orientation="vertical"
      aria-label={label}
      className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]/92 p-1.5 shadow-[0_18px_50px_-24px_rgba(26,16,23,0.65)] backdrop-blur-md max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain ${
        side === "left" ? "left-2 md:left-4" : "right-2 md:right-4"
      }`}
    >
      {children}
    </div>
  );
}

export function RailDivider() {
  return <span aria-hidden="true" className="my-1 h-px w-6 bg-[var(--border)]" />;
}

interface RailButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  side: "left" | "right";
  disabled?: boolean;
  pressed?: boolean;
  hint?: string;
  tone?: "default" | "accent";
}

export function RailButton({
  icon,
  label,
  onClick,
  side,
  disabled,
  pressed,
  hint,
  tone = "default",
}: RailButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={pressed === undefined ? undefined : pressed}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-150 hc-focus disabled:cursor-not-allowed disabled:opacity-35 ${
          tone === "accent"
            ? "border-transparent bg-[#e5c487] text-[#131314] hover:bg-[#8b1a42] hover:text-white"
            : pressed
              ? "border-[var(--accent)]/60 bg-[var(--surface-elevated)] text-[var(--text-primary)]"
              : "border-transparent text-[#7d7367] hover:border-[var(--border)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
        }`}
      >
        {icon}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[#131314] px-2 py-1 font-body text-[10px] uppercase tracking-wider text-[#f4ece0] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 ${
          side === "left" ? "left-full ml-2" : "right-full mr-2"
        }`}
      >
        {label}
        {hint && <span className="ml-2 text-[#998f81] normal-case tracking-normal">{hint}</span>}
      </span>
    </div>
  );
}

/** A compact non-interactive readout (page counter, zoom level). */
export function RailReadout({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span
      aria-label={label}
      className="block w-10 py-1 text-center font-body text-[10px] tabular-nums text-[var(--text-secondary)]"
    >
      {children}
    </span>
  );
}
