"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Loader2, MessageCircle, RefreshCw, X } from "lucide-react";

/**
 * "Mark this bit and send it" — the snipping tool.
 *
 * The visitor drags (or keyboard-draws) a rectangle over the page, and the
 * marked area is cropped out of the rendered canvas, stamped with the catalog
 * and page it came from, and handed to WhatsApp.
 *
 * How the image actually reaches WhatsApp depends on the platform:
 *   • Web Share Level 2 (phones, and desktop Safari) — the PNG is passed to
 *     the OS share sheet as a file, so WhatsApp receives it as an attachment.
 *   • Everywhere else — a wa.me deep link cannot carry an attachment, so the
 *     PNG is put on the clipboard and the chat opens pre-filled; the visitor
 *     pastes it into the composer. The panel says so rather than pretending.
 */

const MIN_SELECTION = 24;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CatalogSnipLayerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Provenance stamped onto the snip, e.g. "Hafele — Architectural · Page 12". */
  caption: string;
  /** WhatsApp deep link, already carrying the composed message. */
  whatsAppUrl: string;
  onExit: () => void;
  onAnnounce: (message: string) => void;
}

function normalize(a: { x: number; y: number }, b: { x: number; y: number }): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(b.x - a.x),
    h: Math.abs(b.y - a.y),
  };
}

/**
 * Crops the marked region out of the live canvas and adds a provenance strip,
 * so a screenshot that leaves the site still says where it came from.
 */
async function cropToBlob(
  canvas: HTMLCanvasElement,
  regionInViewport: DOMRect,
  caption: string
): Promise<Blob | null> {
  const bounds = canvas.getBoundingClientRect();
  const left = Math.max(regionInViewport.left, bounds.left);
  const top = Math.max(regionInViewport.top, bounds.top);
  const right = Math.min(regionInViewport.right, bounds.right);
  const bottom = Math.min(regionInViewport.bottom, bounds.bottom);
  if (right - left < 8 || bottom - top < 8) return null;

  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;
  const sx = (left - bounds.left) * scaleX;
  const sy = (top - bounds.top) * scaleY;
  const sw = (right - left) * scaleX;
  const sh = (bottom - top) * scaleY;

  const stripHeight = Math.min(64, Math.max(30, Math.round(sh * 0.09)));
  const out = document.createElement("canvas");
  out.width = Math.round(sw);
  out.height = Math.round(sh + stripHeight);
  const ctx = out.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, Math.round(sw), Math.round(sh));

  ctx.fillStyle = "#131314";
  ctx.fillRect(0, Math.round(sh), out.width, stripHeight);
  const fontSize = Math.round(stripHeight * 0.36);
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e5c487";
  ctx.fillText(caption, 12, Math.round(sh) + stripHeight / 2, out.width - 24);
  ctx.textAlign = "right";
  ctx.fillStyle = "#8a8078";
  ctx.fillText("HARDWARE COLLECTION", out.width - 12, Math.round(sh) + stripHeight / 2);

  return new Promise((resolve) => out.toBlob((blob) => resolve(blob), "image/png"));
}

async function copyToClipboard(blob: Blob): Promise<boolean> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

export default function CatalogSnipLayer({
  canvasRef,
  caption,
  whatsAppUrl,
  onExit,
  onAnnounce,
}: CatalogSnipLayerProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const blobRef = useRef<Blob | null>(null);
  // Mirrors `rect` so pointerup can read the finished selection without
  // running side effects inside a state updater.
  const rectRef = useRef<Rect | null>(null);

  const [rect, setRectState] = useState<Rect | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const setRect = useCallback((next: Rect | null) => {
    rectRef.current = next;
    setRectState(next);
  }, []);

  useEffect(() => {
    overlayRef.current?.focus({ preventScroll: true });
    onAnnounce("Snipping tool on. Drag across the page to mark an area, or use the arrow keys.");
  }, [onAnnounce]);

  // Revokes the previous preview when it is replaced, and the last one on unmount.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const localPoint = (clientX: number, clientY: number) => {
    const bounds = overlayRef.current?.getBoundingClientRect();
    return { x: clientX - (bounds?.left ?? 0), y: clientY - (bounds?.top ?? 0) };
  };

  const capture = useCallback(
    async (selection: Rect) => {
      const canvas = canvasRef.current;
      const bounds = overlayRef.current?.getBoundingClientRect();
      if (!canvas || !bounds) return;

      setBusy(true);
      const region = new DOMRect(
        bounds.left + selection.x,
        bounds.top + selection.y,
        selection.w,
        selection.h
      );
      const blob = await cropToBlob(canvas, region, caption);
      setBusy(false);

      if (!blob) {
        setNote("Mark an area over the catalog page itself.");
        onAnnounce("Nothing captured. Mark an area over the catalog page.");
        setRect(null);
        return;
      }
      blobRef.current = blob;
      setPreview(URL.createObjectURL(blob));
      setNote(null);
      onAnnounce("Area captured. Review it, then send it on WhatsApp.");
    },
    [canvasRef, caption, onAnnounce, setRect]
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (preview) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = localPoint(event.clientX, event.clientY);
    originRef.current = point;
    setRect({ x: point.x, y: point.y, w: 0, h: 0 });
    setDragging(true);
    setNote(null);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !originRef.current) return;
    setRect(normalize(originRef.current, localPoint(event.clientX, event.clientY)));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    originRef.current = null;

    const selection = rectRef.current;
    if (!selection || selection.w < MIN_SELECTION || selection.h < MIN_SELECTION) {
      setRect(null);
      setNote("That area was too small — drag a larger box.");
      return;
    }
    void capture(selection);
  };

  const reset = () => {
    setPreview(null);
    blobRef.current = null;
    setRect(null);
    setNote(null);
    overlayRef.current?.focus({ preventScroll: true });
    onAnnounce("Selection cleared. Mark a new area.");
  };

  /** Keyboard equivalent of dragging: a movable, resizable default box. */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (preview) return;
    const bounds = overlayRef.current?.getBoundingClientRect();
    if (!bounds) return;

    if (event.key === "Escape") {
      event.stopPropagation();
      onExit();
      return;
    }

    const step = event.shiftKey ? 8 : 24;
    const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (arrows.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      const base = rectRef.current ?? {
        x: bounds.width * 0.3,
        y: bounds.height * 0.3,
        w: bounds.width * 0.4,
        h: bounds.height * 0.4,
      };

      // Alt resizes from the bottom-right corner; otherwise the box moves.
      if (event.altKey) {
        const w =
          event.key === "ArrowLeft"
            ? base.w - step
            : event.key === "ArrowRight"
              ? base.w + step
              : base.w;
        const h =
          event.key === "ArrowUp"
            ? base.h - step
            : event.key === "ArrowDown"
              ? base.h + step
              : base.h;
        setRect({
          ...base,
          w: Math.max(MIN_SELECTION, Math.min(w, bounds.width - base.x)),
          h: Math.max(MIN_SELECTION, Math.min(h, bounds.height - base.y)),
        });
        return;
      }

      const x =
        event.key === "ArrowLeft"
          ? base.x - step
          : event.key === "ArrowRight"
            ? base.x + step
            : base.x;
      const y =
        event.key === "ArrowUp"
          ? base.y - step
          : event.key === "ArrowDown"
            ? base.y + step
            : base.y;
      setRect({
        ...base,
        x: Math.max(0, Math.min(x, bounds.width - base.w)),
        y: Math.max(0, Math.min(y, bounds.height - base.h)),
      });
      return;
    }

    if (event.key === "Enter" && rectRef.current) {
      event.preventDefault();
      event.stopPropagation();
      void capture(rectRef.current);
    }
  };

  const sendToWhatsApp = async () => {
    const blob = blobRef.current;
    if (!blob) return;
    setBusy(true);

    const file = new File([blob], "hardware-collection-selection.png", { type: "image/png" });
    const payload: ShareData = { files: [file], title: caption, text: caption };

    if (typeof navigator.canShare === "function" && navigator.canShare(payload)) {
      try {
        await navigator.share(payload);
        setBusy(false);
        onAnnounce("Shared. Pick WhatsApp in the share sheet to attach the image.");
        onExit();
        return;
      } catch (err) {
        // A cancelled share sheet is not a failure — fall through to the
        // clipboard route only if it genuinely errored.
        if ((err as { name?: string })?.name === "AbortError") {
          setBusy(false);
          return;
        }
      }
    }

    const copied = await copyToClipboard(blob);
    setBusy(false);
    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
    const message = copied
      ? "WhatsApp opened and the image is on your clipboard — press Ctrl+V (⌘V) in the chat to attach it."
      : "WhatsApp opened. Your browser blocked the clipboard, so copy the image with the Copy button and paste it into the chat.";
    setNote(message);
    onAnnounce(message);
  };

  const copyOnly = async () => {
    const blob = blobRef.current;
    if (!blob) return;
    const copied = await copyToClipboard(blob);
    const message = copied
      ? "Image copied to your clipboard."
      : "This browser would not allow copying the image.";
    setNote(message);
    onAnnounce(message);
  };

  return (
    <div className="absolute inset-0 z-[45]">
      <div
        ref={overlayRef}
        role="application"
        tabIndex={0}
        aria-label="Snipping tool"
        aria-describedby="snip-instructions"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className={`absolute inset-0 hc-focus ${preview ? "cursor-default" : "cursor-crosshair"}`}
      >
        {rect && rect.w > 0 && rect.h > 0 && (
          <div
            className="pointer-events-none absolute border-2 border-[#e5c487] bg-transparent"
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              boxShadow: "0 0 0 9999px rgba(19,19,20,0.45)",
            }}
          />
        )}
        {!rect && (
          <div className="pointer-events-none absolute inset-0 bg-[#131314]/25" aria-hidden="true" />
        )}
      </div>

      <p
        id="snip-instructions"
        className="pointer-events-none absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[#131314]/90 px-4 py-2 text-center font-body text-[11px] tracking-wide text-[#f4ece0]"
      >
        {preview
          ? "Review your selection below"
          : "Drag to mark an area · Arrow keys to move, Alt+Arrow to resize, Enter to capture, Esc to cancel"}
      </p>

      {(preview || note) && (
        <div
          role="dialog"
          aria-label="Send marked area"
          className="absolute bottom-4 left-1/2 z-50 w-[min(30rem,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_60px_-24px_rgba(26,16,23,0.7)]"
        >
          <div className="flex items-start gap-4">
            {preview && (
              /* eslint-disable-next-line @next/next/no-img-element -- blob URL from an in-memory crop */
              <img
                src={preview}
                alt={`Marked area from ${caption}`}
                className="h-24 w-32 shrink-0 rounded-lg border border-[var(--border)] object-contain bg-white"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-[#998f81]">
                {caption}
              </p>
              <p className="mt-1 font-body text-xs leading-relaxed text-[var(--text-secondary)]">
                {note ??
                  "Send this to a specialist and they will identify the exact product for you."}
              </p>
            </div>
            <button
              type="button"
              onClick={onExit}
              aria-label="Close snipping tool"
              className="shrink-0 rounded-lg p-1 text-[#998f81] transition-colors hover:text-[var(--text-primary)] hc-focus"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {preview && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={sendToWhatsApp}
                disabled={busy}
                className="inline-flex items-center gap-2 bg-[#e5c487] px-4 py-2.5 font-body text-[10px] font-bold uppercase tracking-wider text-[#131314] transition-colors hover:bg-[#8b1a42] hover:text-white disabled:opacity-50 hc-focus"
              >
                <MessageCircle className="h-4 w-4" />
                Send on WhatsApp
              </button>
              <button
                type="button"
                onClick={copyOnly}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2.5 font-body text-[10px] uppercase tracking-wider text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)] hc-focus"
              >
                <Copy className="h-4 w-4" />
                Copy image
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2.5 font-body text-[10px] uppercase tracking-wider text-[#998f81] transition-colors hover:text-[var(--text-primary)] hc-focus"
              >
                <RefreshCw className="h-4 w-4" />
                Mark again
              </button>
            </div>
          )}

          {busy && (
            <p className="mt-3 flex items-center gap-2 font-body text-[10px] uppercase tracking-wider text-[#998f81]">
              <Loader2 className="h-3 w-3 animate-spin" /> Working…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
