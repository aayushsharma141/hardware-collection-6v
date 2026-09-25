"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AnnotationTool, NormPoint, Stroke } from "./types";

/**
 * The drawing surface for Mark mode.
 *
 * Marks are stored in 0–1 page space, so zooming or re-fitting the page keeps
 * them exactly where the customer put them. The canvas is kept at the same
 * backing resolution as the page canvas so the capture step can composite the
 * two without rescaling.
 *
 * Pen strokes get a light halo underneath: catalogue pages are unpredictable —
 * white product shots, near-black lifestyle spreads — and a single-colour line
 * disappears on one or the other.
 */

/** Pointer capture throws when the pointer is already gone; drawing must not. */
function capturePointer(node: Element, pointerId: number): void {
  try {
    node.setPointerCapture(pointerId);
  } catch {
    /* the stroke still tracks via the element's own events */
  }
}

function releasePointer(node: Element, pointerId: number): void {
  try {
    node.releasePointerCapture(pointerId);
  } catch {
    /* already released */
  }
}

const PEN_COLOR = "#8B1A4A";
const PEN_HALO = "rgba(255,255,255,0.9)";
const HIGHLIGHT_COLOR = "#C8A96E";

interface AnnotationLayerProps {
  pageCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  annotationRef: React.RefObject<HTMLCanvasElement | null>;
  strokes: Stroke[];
  tool: AnnotationTool;
  /** Drawing is enabled only in Mark mode; the layer still paints in Capture. */
  drawable: boolean;
  /** Changes whenever the page canvas is redrawn, so sizes stay in step. */
  renderToken: number;
  onCommit: (stroke: Stroke) => void;
}

export default function AnnotationLayer({
  pageCanvasRef,
  annotationRef,
  strokes,
  tool,
  drawable,
  renderToken,
  onCommit,
}: AnnotationLayerProps) {
  const draftRef = useRef<NormPoint[] | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0, cssW: 0, cssH: 0 });
  const [, forceRepaint] = useState(0);

  // Match the page canvas exactly, in backing resolution and on screen.
  //
  // A ResizeObserver rather than the render token alone: the page canvas is
  // resized whenever page, zoom or fit changes, and the marks have to follow
  // it or they land somewhere the customer did not draw them.
  useEffect(() => {
    const page = pageCanvasRef.current;
    if (!page) return;

    const sync = () =>
      setSize((current) =>
        current.w === page.width &&
        current.h === page.height &&
        current.cssW === page.clientWidth &&
        current.cssH === page.clientHeight
          ? current
          : {
              w: page.width,
              h: page.height,
              cssW: page.clientWidth,
              cssH: page.clientHeight,
            }
      );

    sync();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(sync);
    observer.observe(page);
    return () => observer.disconnect();
  }, [renderToken, pageCanvasRef]);

  const paint = useCallback(() => {
    const canvas = annotationRef.current;
    if (!canvas || !canvas.width) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const unit = Math.max(canvas.width, canvas.height);

    const trace = (points: NormPoint[]) => {
      ctx.beginPath();
      points.forEach((point, i) => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      if (points.length === 1) {
        // A tap should still leave a visible dot.
        ctx.lineTo(points[0].x * canvas.width + 0.1, points[0].y * canvas.height);
      }
      ctx.stroke();
    };

    const drawStroke = (stroke: Stroke) => {
      if (stroke.points.length === 0) return;
      if (stroke.tool === "highlight") {
        ctx.globalAlpha = 0.32;
        ctx.strokeStyle = HIGHLIGHT_COLOR;
        ctx.lineWidth = unit * 0.028;
        trace(stroke.points);
        ctx.globalAlpha = 1;
        return;
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = PEN_HALO;
      ctx.lineWidth = unit * 0.0085;
      trace(stroke.points);
      ctx.strokeStyle = PEN_COLOR;
      ctx.lineWidth = unit * 0.0045;
      trace(stroke.points);
    };

    strokes.filter((s) => s.tool === "highlight").forEach(drawStroke);
    strokes.filter((s) => s.tool === "pen").forEach(drawStroke);
    if (draftRef.current) drawStroke({ tool, points: draftRef.current });
  }, [annotationRef, strokes, tool]);

  useEffect(() => {
    paint();
  }, [paint, size]);

  const toNorm = (event: React.PointerEvent<HTMLCanvasElement>): NormPoint => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
    };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawable) return;
    capturePointer(event.currentTarget, event.pointerId);
    draftRef.current = [toNorm(event)];
    forceRepaint((n) => n + 1);
    paint();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawable || !draftRef.current) return;
    draftRef.current.push(toNorm(event));
    paint();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawable || !draftRef.current) return;
    releasePointer(event.currentTarget, event.pointerId);
    const points = draftRef.current;
    draftRef.current = null;
    if (points.length > 0) onCommit({ tool, points });
  };

  return (
    <canvas
      ref={annotationRef}
      width={size.w || 1}
      height={size.h || 1}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ width: size.cssW || undefined, height: size.cssH || undefined }}
      className={`absolute left-0 top-0 ${
        drawable ? "cursor-crosshair touch-none" : "pointer-events-none"
      }`}
    />
  );
}
