"use client";

import React, { useRef } from "react";
import type { NormRect } from "./types";

/**
 * The adjustable capture region.
 *
 * The region is suggested from where the customer marked, so the common case
 * is confirm-and-send. Dragging the body moves it, the four corners resize it,
 * and the whole thing is operable from the keyboard for anyone who reached
 * this step without drawing.
 */

const MIN = 0.06;

interface CaptureSelectorProps {
  region: NormRect;
  onChange: (region: NormRect) => void;
}

type Corner = "nw" | "ne" | "sw" | "se";

function clampRect(rect: NormRect): NormRect {
  const w = Math.min(1, Math.max(MIN, rect.w));
  const h = Math.min(1, Math.max(MIN, rect.h));
  return {
    w,
    h,
    x: Math.min(1 - w, Math.max(0, rect.x)),
    y: Math.min(1 - h, Math.max(0, rect.y)),
  };
}

export default function CaptureSelector({ region, onChange }: CaptureSelectorProps) {
  const drag = useRef<{
    mode: "move" | Corner;
    startX: number;
    startY: number;
    origin: NormRect;
    boundsW: number;
    boundsH: number;
  } | null>(null);

  const begin = (
    event: React.PointerEvent<HTMLElement>,
    mode: "move" | Corner
  ) => {
    event.stopPropagation();
    const host = event.currentTarget.closest("[data-capture-host]") as HTMLElement | null;
    const bounds = host?.getBoundingClientRect();
    if (!bounds) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* the drag still tracks via the element's own events */
    }
    drag.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: region,
      boundsW: bounds.width,
      boundsH: bounds.height,
    };
  };

  const move = (event: React.PointerEvent<HTMLElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = (event.clientX - state.startX) / state.boundsW;
    const dy = (event.clientY - state.startY) / state.boundsH;
    const o = state.origin;

    if (state.mode === "move") {
      onChange(clampRect({ ...o, x: o.x + dx, y: o.y + dy }));
      return;
    }

    const east = state.mode === "ne" || state.mode === "se";
    const south = state.mode === "se" || state.mode === "sw";
    const next: NormRect = {
      x: east ? o.x : o.x + dx,
      y: south ? o.y : o.y + dy,
      w: east ? o.w + dx : o.w - dx,
      h: south ? o.h + dy : o.h - dy,
    };
    onChange(clampRect(next));
  };

  const end = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    drag.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!arrows.includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();

    const step = event.shiftKey ? 0.01 : 0.04;
    const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
    const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;

    onChange(
      event.altKey
        ? clampRect({ ...region, w: region.w + dx, h: region.h + dy })
        : clampRect({ ...region, x: region.x + dx, y: region.y + dy })
    );
  };

  const handleClass =
    "absolute h-11 w-11 touch-none flex items-center justify-center";
  const dotClass = "h-3.5 w-3.5 rounded-full border-2 border-[#0E0C0C] bg-[#C8A96E]";

  return (
    <div className="absolute inset-0 touch-none" data-capture-host>
      <div
        role="group"
        aria-label="Capture area. Arrow keys move it, Alt with arrow keys resizes it."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => begin(e, "move")}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className="absolute cursor-move hc-focus"
        style={{
          left: `${region.x * 100}%`,
          top: `${region.y * 100}%`,
          width: `${region.w * 100}%`,
          height: `${region.h * 100}%`,
          boxShadow: "0 0 0 9999px rgba(14,12,12,0.62)",
          outline: "2px solid #C8A96E",
        }}
      >
        {(["nw", "ne", "sw", "se"] as Corner[]).map((corner) => (
          <span
            key={corner}
            onPointerDown={(e) => begin(e, corner)}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            className={`${handleClass} ${
              corner === "nw"
                ? "-left-5 -top-5 cursor-nwse-resize"
                : corner === "ne"
                  ? "-right-5 -top-5 cursor-nesw-resize"
                  : corner === "sw"
                    ? "-bottom-5 -left-5 cursor-nesw-resize"
                    : "-bottom-5 -right-5 cursor-nwse-resize"
            }`}
          >
            <span className={dotClass} />
          </span>
        ))}
      </div>
    </div>
  );
}
