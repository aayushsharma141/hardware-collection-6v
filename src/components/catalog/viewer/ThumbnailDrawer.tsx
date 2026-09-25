"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { X } from "lucide-react";

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
      className={`group flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors hc-focus ${
        active ? "bg-[#C8A96E]/15" : "hover:bg-white/8"
      }`}
    >
      <canvas
        ref={canvasRef}
        className={`w-full rounded border bg-white ${
          active ? "border-[#C8A96E]" : "border-white/12"
        }`}
        style={{ minHeight: 84 }}
      />
      <span
        className={`font-body text-[10px] tabular-nums ${
          active ? "text-[#C8A96E]" : "text-white/50"
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
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-[#0E0C0C]/60 backdrop-blur-sm md:flex-row md:justify-start">
      <button
        type="button"
        aria-label="Close pages"
        onClick={onClose}
        className="flex-1 cursor-default"
      />
      <aside
        aria-label="Pages"
        className="flex max-h-[70%] flex-col border-t border-white/10 bg-[#171414] md:max-h-none md:w-72 md:border-l md:border-t-0"
      >
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <h2 className="font-body text-[11px] uppercase tracking-[0.18em] text-white/55">
            Pages
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pages"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white hc-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-1 overflow-y-auto overscroll-contain px-3 pb-4 md:grid-cols-2">
          {Array.from({ length: pages }, (_, i) => (
            <Thumbnail
              key={i + 1}
              doc={doc}
              page={i + 1}
              active={i + 1 === current}
              onSelect={onSelect}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}
