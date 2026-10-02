"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Minus, Plus, Rows3, Search } from "lucide-react";
import WhatsAppGlyph from "./WhatsAppGlyph";
import type { FitMode } from "./types";

/**
 * Browse-state controls: everything that acts on the document.
 *
 * One surface, not five floating pills — and one that hugs its contents, so
 * it reads as a cluster resting on the page rather than a bar bracketing it. The catalogue page is the thing on
 * screen worth looking at, so the chrome under it is a single quiet strip —
 * neutral throughout, with the primary action carried by a light fill rather
 * than a colour. Gold would read as decoration competing with the artwork.
 *
 * Zoom is a menu rather than a toggle because "fit width" and "150%" are the
 * same decision; splitting them across two controls left the reader unable to
 * tell what they were currently looking at.
 */

const ZOOM_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

interface ViewerControlsProps {
  page: number;
  pages: number;
  zoom: number;
  fit: FitMode;
  ready: boolean;
  /** False once the customer has been reading for a while. */
  visible: boolean;
  minZoom: number;
  maxZoom: number;
  onZoom: (delta: number) => void;
  onSetFit: (fit: FitMode) => void;
  onSetZoom: (zoom: number) => void;
  onOpenPageJump: () => void;
  onOpenPages: () => void;
  onOpenSearch: () => void;
  searchable: boolean;
  onSelect: () => void;
  onActivity?: () => void;
}

const icon =
  "v-press flex h-10 w-10 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] disabled:opacity-25 hc-focus";

/** A labelled tool in the strip. */
function Tool({
  glyph,
  label,
  onClick,
  disabled,
}: {
  glyph: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="v-press v-hover flex min-h-10 items-center gap-2 rounded-md px-3 font-body text-xs text-[var(--v-text-dim)] disabled:opacity-25 hc-focus"
    >
      {glyph}
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  );
}

export default function ViewerControls({
  page,
  pages,
  zoom,
  fit,
  ready,
  visible,
  minZoom,
  maxZoom,
  onZoom,
  onSetFit,
  onSetZoom,
  onOpenPageJump,
  onOpenPages,
  onOpenSearch,
  searchable,
  onSelect,
  onActivity,
}: ViewerControlsProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const zoomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!zoomOpen) return;
    const onAway = (event: MouseEvent) => {
      if (!zoomRef.current?.contains(event.target as Node)) setZoomOpen(false);
    };
    document.addEventListener("mousedown", onAway);
    return () => document.removeEventListener("mousedown", onAway);
  }, [zoomOpen]);

  const chrome = `transition-opacity duration-200 ease-[var(--v-ease)] ${
    visible || zoomOpen ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  // At a fit the label names the fit; zoomed away from it, the percentage.
  const zoomed = Math.abs(zoom - 1) > 0.01;
  const zoomLabel = zoomed
    ? `${Math.round(zoom * 100)}%`
    : fit === "width"
      ? "Fit width"
      : "Fit page";

  const choose = (apply: () => void) => {
    apply();
    setZoomOpen(false);
  };

  const menuItem =
    "v-press flex w-full min-h-9 items-center gap-2 rounded px-2.5 font-body text-xs text-[var(--v-text-dim)] hover:bg-black/5 hover:text-[var(--v-text)] hc-focus";

  return (
    <div 
      className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      onPointerMove={onActivity}
    >
      {/* Position survives the fade: it is orientation, not a control, and
          losing it in a 264-page catalogue is disorienting. */}
      <button
        type="button"
        onClick={onOpenPageJump}
        disabled={!ready}
        aria-label={`Page ${page} of ${pages || "unknown"}. Go to a page.`}
        className={`v-press rounded-md border border-[var(--v-line)] bg-[var(--v-chrome)] px-3 py-1 font-body text-xs tabular-nums backdrop-blur-md disabled:opacity-40 hc-focus ${
          visible ? "text-[var(--v-text-dim)]" : "text-[var(--v-text-faint)]"
        }`}
      >
        <span className={visible ? "text-[var(--v-text)]" : ""}>{ready ? page : "–"}</span>
        <span className="text-[var(--v-text-faint)]"> / {pages || "–"}</span>
      </button>

      {/* One strip, not five pills. */}
      <div
        className={`flex max-w-full items-center gap-1 overflow-x-auto sm:overflow-visible rounded-lg border border-[var(--v-line)] bg-[var(--v-chrome)] p-1 backdrop-blur-md ${chrome}`}
      >
        {/* Zoom — desktop only; touch has pinch and double-tap. */}
        <div ref={zoomRef} className="relative hidden items-center sm:flex">
          <button
            type="button"
            onClick={() => onZoom(-0.25)}
            disabled={zoom <= minZoom || !ready}
            aria-label="Zoom out"
            className={icon}
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoomOpen((open) => !open)}
            disabled={!ready}
            aria-haspopup="menu"
            aria-expanded={zoomOpen}
            aria-label={`Zoom: ${zoomLabel}. Change zoom.`}
            className="v-press flex min-h-10 min-w-[6.5rem] items-center justify-center gap-1.5 rounded-md px-2 font-body text-xs tabular-nums text-[var(--v-text)] hc-focus"
          >
            {zoomLabel}
            <ChevronDown
              className={`h-3.5 w-3.5 text-[var(--v-text-faint)] transition-transform duration-200 ease-[var(--v-ease)] ${
                zoomOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => onZoom(0.25)}
            disabled={zoom >= maxZoom || !ready}
            aria-label="Zoom in"
            className={icon}
          >
            <Plus className="h-4 w-4" />
          </button>

          {zoomOpen && (
            <div
              role="menu"
              aria-label="Zoom"
              className="v-menu absolute bottom-full left-1/2 mb-2 w-40 -translate-x-1/2 rounded-lg border border-[var(--v-line)] bg-[var(--v-panel)] p-1"
            >
              {(["width", "page"] as FitMode[]).map((mode) => {
                const on = !zoomed && fit === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    onClick={() => choose(() => onSetFit(mode))}
                    className={menuItem}
                  >
                    <Check
                      className={`h-3.5 w-3.5 ${on ? "text-[var(--v-state)]" : "opacity-0"}`}
                    />
                    {mode === "width" ? "Fit width" : "Fit page"}
                  </button>
                );
              })}
              <span aria-hidden="true" className="my-1 block h-px bg-[var(--v-line)]" />
              {ZOOM_PRESETS.map((preset) => {
                const on = zoomed && Math.abs(zoom - preset) < 0.01;
                return (
                  <button
                    key={preset}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    onClick={() => choose(() => onSetZoom(preset))}
                    className={`${menuItem} tabular-nums`}
                  >
                    <Check
                      className={`h-3.5 w-3.5 ${on ? "text-[var(--v-state)]" : "opacity-0"}`}
                    />
                    {Math.round(preset * 100)}%
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-[var(--v-line)] sm:block" />

        {searchable && (
          <Tool
            glyph={<Search className="h-4 w-4 shrink-0" />}
            label="Find"
            onClick={onOpenSearch}
            disabled={!ready}
          />
        )}
        <Tool
          glyph={<Rows3 className="h-4 w-4 shrink-0" />}
          label="Pages"
          onClick={onOpenPages}
          disabled={!ready}
        />

        <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-[var(--v-line)]" />

        {/* Primary by weight, not by colour. */}
        <button
          type="button"
          onClick={onSelect}
          disabled={!ready}
          className="v-press flex min-h-10 items-center gap-2 rounded-md bg-[var(--v-text)] px-3.5 font-body text-xs font-medium text-[var(--v-surface)] hover:bg-white disabled:opacity-30 sm:px-4 hc-focus"
        >
          <WhatsAppGlyph className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Enquire / Share</span>
          <span className="sm:hidden">Share</span>
        </button>
      </div>
    </div>
  );
}
