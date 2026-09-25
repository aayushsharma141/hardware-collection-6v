"use client";

import React from "react";
import { Minus, Plus, Scan, Sparkles } from "lucide-react";
import WhatsAppGlyph from "./WhatsAppGlyph";
import type { FitMode } from "./types";

/**
 * Browse-state controls.
 *
 * Two conversion routes sit here side by side: "Mark & Share" for a customer
 * who wants to point at a specific product, and "Enquire" for one who would
 * rather just ask about the page they are on. Mark & Share is the primary and
 * looks it, but not so loudly that it competes with the catalogue — the page
 * is what the customer came to read.
 *
 * Zoom buttons are desktop-only: on touch the gesture is pinch or double-tap,
 * and the buttons would only crowd the page.
 */

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
  onToggleFit: () => void;
  onResetZoom: () => void;
  onOpenPageJump: () => void;
  onMark: () => void;
  onEnquire: () => void;
}

const chip =
  "flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white disabled:opacity-30 hc-focus";

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
  onToggleFit,
  onResetZoom,
  onOpenPageJump,
  onMark,
  onEnquire,
}: ViewerControlsProps) {
  const chrome = `transition-opacity duration-300 ${
    visible ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  // Zoomed away from the fit, the middle control reports the level and offers
  // the way back; at the fit it names the fit it would switch to.
  const zoomed = Math.abs(zoom - 1) > 0.01;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Position survives the fade: it is orientation, not a control, and
          losing it in a 264-page catalogue is disorienting. */}
      <button
        type="button"
        onClick={onOpenPageJump}
        disabled={!ready}
        aria-label={`Page ${page} of ${pages || "unknown"}. Go to a page.`}
        className={`rounded-full border bg-[#0E0C0C]/80 px-4 py-1.5 font-body text-xs tabular-nums backdrop-blur-md transition-opacity duration-300 hover:border-[#C8A96E]/50 hover:text-white disabled:opacity-40 hc-focus ${
          visible ? "border-white/15 text-white/75" : "border-white/8 text-white/45"
        }`}
      >
        <span className={visible ? "text-white" : "text-white/70"}>{ready ? page : "–"}</span>
        <span className="text-white/40"> / {pages || "–"}</span>
      </button>

      <div className={`flex w-full items-center justify-center gap-2 ${chrome}`}>
        <div className="hidden items-center rounded-full border border-white/10 bg-[#0E0C0C]/80 backdrop-blur-md sm:flex">
          <button
            type="button"
            onClick={() => onZoom(-0.25)}
            disabled={zoom <= minZoom || !ready}
            aria-label="Zoom out"
            className={chip}
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={zoomed ? onResetZoom : onToggleFit}
            disabled={!ready}
            aria-label={
              zoomed
                ? `Zoomed to ${Math.round(zoom * 100)} percent. Reset to fit.`
                : fit === "width"
                  ? "Switch to fit whole page"
                  : "Switch to fit width"
            }
            className="flex min-h-11 min-w-[7.5rem] items-center justify-center gap-2 px-3 font-body text-[10px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hc-focus"
          >
            {zoomed ? (
              <span className="tabular-nums text-white">{Math.round(zoom * 100)}%</span>
            ) : (
              <>
                <Scan className="h-4 w-4" />
                {fit === "width" ? "Fit width" : "Fit page"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onZoom(0.25)}
            disabled={zoom >= maxZoom || !ready}
            aria-label="Zoom in"
            className={chip}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onEnquire}
          // The accessible name says where the enquiry goes and never depends
          // on the visible word, which the narrowest phones drop.
          aria-label="Enquire on WhatsApp about this page"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-[#0E0C0C]/80 px-3 font-body text-[11px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-md transition-colors hover:border-white/25 hover:text-white max-[359px]:flex-none sm:flex-none sm:px-5 hc-focus"
        >
          <WhatsAppGlyph className="h-4 w-4 shrink-0" />
          {/* Below ~360px the primary needs the room more than this label does. */}
          <span className="max-[359px]:sr-only">Enquire</span>
        </button>

        <button
          type="button"
          onClick={onMark}
          disabled={!ready}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#C8A96E] px-3 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E0C0C] transition-colors hover:bg-[#d8bb84] disabled:opacity-40 sm:flex-none sm:px-5 hc-focus"
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          Mark &amp; Share
        </button>
      </div>
    </div>
  );
}
