"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Search, X } from "lucide-react";

/**
 * Page navigation that never permanently occupies the screen: a bottom sheet
 * on phones, a side drawer on desktop.
 *
 * Thumbnails render only when they scroll into view and each one is drawn
 * once, so opening a 200-page catalogue does not rasterise 200 pages.
 */

const THUMB_WIDTH = 132;

interface ThumbnailDrawerProps {
  doc: PDFDocumentProxy | null;
  pages: number;
  current: number;
  onSelect: (page: number) => void;
  onClose: () => void;
}

function Thumbnail({
  doc,
  page,
  active,
  onSelect,
}: {
  doc: PDFDocumentProxy | null;
  page: number;
  active: boolean;
  onSelect: (page: number) => void;
}) {
  const holderRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(false);
  const drawnRef = useRef(false);

  useEffect(() => {
    const node = holderRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !doc || drawnRef.current) return;
    let cancelled = false;
    drawnRef.current = true;

    (async () => {
      try {
        const pdfPage = await doc.getPage(page);
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        const natural = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({ scale: THUMB_WIDTH / natural.width });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        await pdfPage.render({ canvas, viewport }).promise;
      } catch {
        drawnRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, doc, page]);

  return (
    <button
      ref={holderRef}
      type="button"
      onClick={() => onSelect(page)}
      aria-label={`Go to page ${page}`}
      aria-current={active ? "true" : undefined}
      className={`v-press group flex flex-col items-center gap-1.5 rounded p-1.5 hc-focus ${
        active ? "bg-[var(--v-accent-bg)]" : "hover:bg-black/5"
      }`}
    >
      <canvas
        ref={canvasRef}
        className={`w-full rounded border bg-[var(--v-panel)] ${
          active ? "border-[var(--v-text)]" : "border-[var(--v-line)]"
        }`}
        style={{ minHeight: 84 }}
      />
      <span
        className={`font-body text-[10px] tabular-nums ${
          active ? "text-[var(--v-accent-fg)] font-semibold" : "text-[var(--v-text-dim)]"
        }`}
      >
        {page}
      </span>
    </button>
  );
}

export default function ThumbnailDrawer({
  doc,
  pages,
  current,
  onSelect,
  onClose,
}: ThumbnailDrawerProps) {
  const [filter, setFilter] = useState("");
  
  // Drag to resize state
  const asideRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const deltaY = dragRef.current.startY - clientY;
      const newHeight = Math.max(100, Math.min(window.innerHeight - 80, dragRef.current.startHeight + deltaY));
      setHeight(newHeight);
    };
    const handleUp = () => {
      dragRef.current = null;
    };

    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleUp);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, []);

  // Jumping to a known page number in a 264-page catalogue should not mean
  // scrolling a thumbnail grid to find it.
  const shown = useMemo(() => {
    const all = Array.from({ length: pages }, (_, i) => i + 1);
    const needle = filter.trim();
    if (!needle) return all;
    return all.filter((n) => String(n).startsWith(needle));
  }, [pages, filter]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end md:flex-row md:justify-end pointer-events-none">
      <aside
        ref={asideRef}
        aria-label="Pages"
        className="pointer-events-auto flex flex-col border-t border-[var(--v-line)] bg-[var(--v-panel)] md:!h-full md:w-72 md:border-l md:border-t-0 shadow-2xl transition-[height] duration-0"
        style={{ height: height !== undefined ? height : "70%" }}
      >
        {/* Drag Handle (Mobile Only) */}
        <div 
          className="md:hidden flex w-full cursor-ns-resize items-center justify-center py-3 shrink-0 touch-none active:bg-black/5 transition-colors"
          onTouchStart={(e) => {
            const clientY = e.touches[0].clientY;
            dragRef.current = { startY: clientY, startHeight: asideRef.current?.getBoundingClientRect().height || 0 };
          }}
          onMouseDown={(e) => {
            dragRef.current = { startY: e.clientY, startHeight: asideRef.current?.getBoundingClientRect().height || 0 };
          }}
        >
          <div className="h-1.5 w-12 rounded-full bg-[var(--v-line-strong)]" />
        </div>

        <div className="flex shrink-0 items-center justify-between px-4 pb-3 md:pt-3">
          <h2 className="font-body text-[11px] uppercase tracking-[0.18em] text-[var(--v-text-dim)]">
            Pages
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pages"
            className="v-press flex h-11 w-11 items-center justify-center rounded text-[var(--v-text-faint)] hover:text-[var(--v-text)] hc-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="shrink-0 px-3 pb-3">
          <div className="flex min-h-11 items-center gap-2 rounded border border-[var(--v-line-strong)] bg-[var(--v-panel)] px-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--v-text-faint)]" />
            <input
              type="text"
              inputMode="numeric"
              value={filter}
              placeholder="Search page…"
              aria-label="Filter pages by number"
              onChange={(e) => setFilter(e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 bg-transparent py-2 font-body text-sm tabular-nums text-[var(--v-text)] outline-none placeholder:text-[var(--v-text-faint)]"
            />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-4 gap-1 overflow-y-auto overscroll-contain px-3 pb-4 md:grid-cols-2">
          {shown.map((n) => (
            <Thumbnail
              key={n}
              doc={doc}
              page={n}
              active={n === current}
              onSelect={onSelect}
            />
          ))}
          {shown.length === 0 && (
            <p className="col-span-full px-1 py-3 font-body text-xs text-[var(--v-text-dim)]">
              No page {filter} in this catalogue.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
