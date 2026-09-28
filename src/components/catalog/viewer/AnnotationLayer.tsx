"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AnnotationTool, NormPoint, Stroke } from "./types";

/**
 * The drawing surface for Select mode.
 *
 * Marks are stored in 0–1 page space, so zooming or re-fitting the page keeps
 * them exactly where the customer put them. The canvas is kept at the same
 * backing resolution as the page canvas so the capture step can composite the
 * two without rescaling.
 *
 * Ink follows different rules from chrome. The chrome is colourless because it
 * sits beside the artwork; a callout sits *on* the artwork and has to survive
 * a white product shot and a near-black lifestyle spread alike. So it draws in
 * saturated red under a white halo — a colour a reader already reads as
 * "someone marked this". Muted chrome tones were tried here and vanished into
 * the page.
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

const PEN_COLOR = "#D92D20";
const PEN_HALO = "rgba(255,255,255,0.9)";

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

    const drawArrow = (p1: NormPoint, p2: NormPoint) => {
      const x1 = p1.x * canvas.width;
      const y1 = p1.y * canvas.height;
      const x2 = p2.x * canvas.width;
      const y2 = p2.y * canvas.height;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      const headlen = unit * 0.02;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.moveTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    };

    const drawCircle = (p1: NormPoint, p2: NormPoint) => {
      const x1 = p1.x * canvas.width;
      const y1 = p1.y * canvas.height;
      const x2 = p2.x * canvas.width;
      const y2 = p2.y * canvas.height;
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const rx = Math.abs(x2 - x1) / 2;
      const ry = Math.abs(y2 - y1) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      ctx.stroke();
    };

    const drawBox = (p1: NormPoint, p2: NormPoint) => {
      const x = Math.min(p1.x, p2.x) * canvas.width;
      const y = Math.min(p1.y, p2.y) * canvas.height;
      const w = Math.abs(p2.x - p1.x) * canvas.width;
      const h = Math.abs(p2.y - p1.y) * canvas.height;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.stroke();
    };

    const drawShape = (p1: NormPoint, p2: NormPoint, toolType: string) => {
      if (toolType === "arrow") drawArrow(p1, p2);
      else if (toolType === "circle") drawCircle(p1, p2);
      else if (toolType === "box") drawBox(p1, p2);
    };

    const drawStroke = (stroke: Stroke) => {
      if (stroke.points.length < 2) return;
      if (stroke.tool === "select") return;

      const p1 = stroke.points[0];
      const p2 = stroke.points[1];

      ctx.globalAlpha = 1;
      ctx.strokeStyle = PEN_HALO;
      ctx.lineWidth = unit * 0.0085;
      drawShape(p1, p2, stroke.tool);

      ctx.strokeStyle = PEN_COLOR;
      ctx.lineWidth = unit * 0.0045;
      drawShape(p1, p2, stroke.tool);
    };

    strokes.forEach(drawStroke);
    if (draftRef.current && draftRef.current.length >= 2 && tool !== "select") {
      drawStroke({ tool, points: draftRef.current });
    }
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
    if (!drawable || tool === "select") return;
    capturePointer(event.currentTarget, event.pointerId);
    draftRef.current = [toNorm(event), toNorm(event)];
    forceRepaint((n) => n + 1);
    paint();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawable || !draftRef.current || tool === "select") return;
    draftRef.current[1] = toNorm(event);
    paint();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawable || !draftRef.current || tool === "select") return;
    releasePointer(event.currentTarget, event.pointerId);
    const points = draftRef.current;
    draftRef.current = null;
    
    // Prevent tiny accidental marks (e.g. taps without dragging)
    const dx = points[1].x - points[0].x;
    const dy = points[1].y - points[0].y;
    if (Math.hypot(dx, dy) > 0.01) {
      onCommit({ tool, points });
    }
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
