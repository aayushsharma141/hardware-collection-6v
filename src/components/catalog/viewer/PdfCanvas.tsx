"use client";

import "@/lib/polyfills";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";
import type { CatalogueStatus, FitMode } from "./types";

/**
 * The catalogue as one continuous, scrollable column of pages — the way
 * every familiar PDF viewer works. The customer scrolls; the page counter
 * follows; a jump from thumbnails or search scrolls the column to the page.
 *
 * Only the pages in and around the viewport are rendered. A 264-page catalogue
 * mounts three or four canvases at a time, and each page's bytes stream through
 * /api/catalog/<slug>/<n> with Range support only when that page comes into
 * view, so page 1 of a 70 MB file appears without the other 69 MB.
 *
 * Page boxes are sized from page 1 until a page renders and reports its own
 * size; catalogues are almost always uniform, and the rare odd page corrects
 * itself the moment it is seen.
 *
 * The document is drawn to canvases rather than embedded, so there is no
 * browser PDF chrome offering a download or print.
 */

type PdfJs = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfJs> | null = null;

/** Loaded on demand — pdf.js is ~1MB and only viewers need it. */
function loadPdfjs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return lib;
    });
  }
  return pdfjsPromise;
}

const PAGE_GAP = 12;
const SHELL_PADDING = 12;
/** Pages kept mounted beyond the visible ones, above and below. */
const OVERSCAN = 1;
const DOUBLE_TAP_MS = 300;
const KEY_SCROLL_PX = 96;

interface Size {
  w: number;
  h: number;
}

interface PdfCanvasProps {
  src: string;
  /** The page the customer asked for; the column scrolls to it when it changes. */
  page: number;
  zoom: number;
  fit: FitMode;
  pageLabel: string;
  /** Always points at the canvas of the page currently being read. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Scrolling and gestures are off outside the browse state. */
  interactive: boolean;
  /** Rendered over the page currently being read. */
  overlay?: React.ReactNode;
  onDocument: (doc: PDFDocumentProxy | null) => void;
  onLoaded: (numPages: number) => void;
  onStatusChange: (status: CatalogueStatus, message?: string) => void;
  /** The current page's canvas was (re)drawn or swapped. */
  onRendered: () => void;
  /** The page under the reader changed because they scrolled. */
  onPageChange: (page: number) => void;
  onZoomTo: (zoom: number) => void;
  onActivity: () => void;
}

/**
 * The scale every page is drawn at.
 *
 * Exported for test: when the shell has not been measured yet this returns 1,
 * and a 1 that never updates means fit and zoom change their labels while the
 * pages stay at natural size. That failure is invisible in a screenshot, so it
 * is pinned by a test instead.
 */
export function pageScale(
  natural: Size | null,
  shell: Size,
  fit: FitMode,
  zoom: number
): number {
  if (!natural || !shell.w) return 1;
  const widthFit = (shell.w - SHELL_PADDING * 2) / natural.w;
  const base =
    fit === "page"
      ? Math.min(widthFit, (shell.h - SHELL_PADDING * 2) / natural.h)
      : Math.min(widthFit, 1.6);
  return Math.max(base, 0.2) * zoom;
}

/** Index of the last page whose top is at or above `y`. */
export function pageAt(tops: number[], y: number): number {
  let lo = 0;
  let hi = tops.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (tops[mid] <= y) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ─────────────────────────────────────────────────────────────────────────
// One page
// ─────────────────────────────────────────────────────────────────────────

interface PageViewProps {
  doc: PDFDocumentProxy;
  page: number;
  width: number;
  height: number;
  scale: number;
  current: boolean;
  pageLabel: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  overlay?: React.ReactNode;
  onNaturalSize: (page: number, size: Size) => void;
  onRendered: () => void;
}

function PageView({
  doc,
  page,
  width,
  height,
  scale,
  current,
  pageLabel,
  canvasRef,
  overlay,
  onNaturalSize,
  onRendered,
}: PageViewProps) {
  const localRef = useRef<HTMLCanvasElement | null>(null);
  const taskRef = useRef<RenderTask | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [text, setText] = useState("");

  const cb = useRef({ onNaturalSize, onRendered, current });
  useEffect(() => {
    cb.current = { onNaturalSize, onRendered, current };
  });

  // The shared ref follows whichever page is current, so marking and capture
  // always act on the page being read.
  useEffect(() => {
    if (!current) return;
    const node = localRef.current;
    canvasRef.current = node;
    cb.current.onRendered();
    return () => {
      if (canvasRef.current === node) canvasRef.current = null;
    };
  }, [current, canvasRef]);

  useEffect(() => {
    const canvas = localRef.current;
    if (!canvas) return;
    let cancelled = false;

    (async () => {
      try {
        taskRef.current?.cancel();
        const pdfPage = await doc.getPage(page);
        if (cancelled) return;

        const natural = pdfPage.getViewport({ scale: 1 });
        cb.current.onNaturalSize(page, { w: natural.width, h: natural.height });

        const viewport = pdfPage.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const task = pdfPage.render({ canvas, viewport });
        taskRef.current = task;
        await task.promise;
        if (cancelled) return;
        setFailed(false);
        if (cb.current.current) cb.current.onRendered();
      } catch (err) {
        const name = (err as { name?: string })?.name;
        if (name === "RenderingCancelledException" || cancelled) return;
        console.error(`Catalogue page ${page} failed to render:`, err);
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      taskRef.current?.cancel();
    };
    // Deliberately not keyed on `current`: becoming the page under the reader
    // must not redraw the canvas, or every scroll would flash.
  }, [doc, page, scale, attempt]);

  // A canvas is opaque to screen readers; the current page's text is mirrored
  // into a visually hidden region beside it.
  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    (async () => {
      try {
        const pdfPage = await doc.getPage(page);
        const content = await pdfPage.getTextContent();
        if (cancelled) return;
        setText(
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim()
        );
      } catch {
        // Text is a courtesy; the page itself still renders.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doc, page, current]);

  return (
    <div
      className="relative mx-auto shrink-0"
      style={{ width, height, marginBottom: PAGE_GAP }}
      data-page={page}
    >
      <canvas
        ref={localRef}
        role={current ? "img" : undefined}
        aria-label={current ? pageLabel : undefined}
        aria-hidden={current ? undefined : true}
        className="block bg-[var(--v-panel)] shadow-md"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      {current && overlay}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--v-chrome)] px-6 text-center backdrop-blur-md">
          <p className="font-body text-sm text-[var(--v-text-dim)]">This page couldn&apos;t be displayed.</p>
          <button
            type="button"
            onClick={() => {
              setFailed(false);
              setAttempt((a) => a + 1);
            }}
            className="v-press rounded border border-[var(--v-line-strong)] px-5 py-2 font-body text-[11px] text-[var(--v-text-dim)] hover:border-[var(--v-text)] hover:text-[var(--v-text)] hc-focus"
          >
            Retry
          </button>
        </div>
      )}
      {current && text && <p className="sr-only">{text}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// The column
// ─────────────────────────────────────────────────────────────────────────

export default function PdfCanvas({
  src,
  page,
  zoom,
  fit,
  pageLabel,
  canvasRef,
  interactive,
  overlay,
  onDocument,
  onLoaded,
  onStatusChange,
  onRendered,
  onPageChange,
  onZoomTo,
  onActivity,
}: PdfCanvasProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  // destroy() lives on the loading task in pdf.js 6, not on the document.
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);

  const cb = useRef({
    onDocument,
    onLoaded,
    onStatusChange,
    onRendered,
    onPageChange,
    onZoomTo,
    onActivity,
  });
  useEffect(() => {
    cb.current = {
      onDocument,
      onLoaded,
      onStatusChange,
      onRendered,
      onPageChange,
      onZoomTo,
      onActivity,
    };
  });

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<CatalogueStatus>("loading");
  const [numPages, setNumPages] = useState(0);
  const [defaultSize, setDefaultSize] = useState<Size | null>(null);
  const [sizes, setSizes] = useState<Map<number, Size>>(() => new Map());
  const [shell, setShell] = useState<Size>({ w: 0, h: 0 });
  const [scrollTop, setScrollTop] = useState(0);
  const [current, setCurrent] = useState(1);
  const currentRef = useRef(1);

  // ── Load the document ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    loadPdfjs()
      .then((pdfjs) => {
        void loadingTaskRef.current?.destroy().catch(() => {});
        const task = pdfjs.getDocument({
          url: src,
          // These two belong together. disableAutoFetch on its own still lets
          // pdf.js stream the whole file — 70 MB for the largest catalog in
          // the library — and then abandon that read once ranges take over.
          // With streaming off it asks only for the byte ranges the pages in
          // view need.
          disableAutoFetch: true,
          disableStream: true,
          // pdf.js fetches these four over HTTP, on demand, only when a page
          // needs them — and a missing one surfaces mid-render as
          // "UnknownErrorException: Failed to fetch". They are kept in step
          // with the installed pdfjs-dist by scripts/sync-pdfjs-assets.mjs.
          standardFontDataUrl: "/pdfjs/standard_fonts/",
          cMapUrl: "/pdfjs/cmaps/",
          cMapPacked: true,
          iccUrl: "/pdfjs/iccs/",
          wasmUrl: "/pdfjs/wasm/",
        });
        loadingTaskRef.current = task;
        return task.promise;
      })
      .then(async (loaded) => {
        if (cancelled) return;
        // Page 1 sizes every box until a page reports otherwise.
        const first = await loaded.getPage(1);
        if (cancelled) return;
        const natural = first.getViewport({ scale: 1 });
        setDefaultSize({ w: natural.width, h: natural.height });
        setNumPages(loaded.numPages);
        setDoc(loaded);
        setStatus("ready");
        cb.current.onDocument(loaded);
        cb.current.onLoaded(loaded.numPages);
        cb.current.onStatusChange("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Catalogue failed to load:", err);
        setStatus("error");
        cb.current.onStatusChange("error", "Catalogue temporarily unavailable.");
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(
    () => () => {
      // Tearing down mid-flight rejects the in-flight range reads; that is the
      // expected way to close a document, not an error to surface.
      void loadingTaskRef.current?.destroy().catch(() => {});
      loadingTaskRef.current = null;
    },
    []
  );

  // ── Shell size ─────────────────────────────────────────────────────────
  //
  // Measured synchronously after commit, not inside requestAnimationFrame: a
  // deferred first measurement can be dropped (a backgrounded tab throttles
  // rAF), and if it is, `shell` stays {0,0}, `scale` short-circuits to 1 and
  // every page renders at its natural size — zoom and fit then change the
  // label but nothing on screen. The observer only handles later changes.
  useLayoutEffect(() => {
    const node = shellRef.current;
    if (!node) return;

    const measure = () =>
      setShell((prev) => {
        const w = node.clientWidth;
        const h = node.clientHeight;
        // A detached or hidden shell measures zero; keep the last real size
        // rather than collapsing the layout.
        if (!w && !h) return prev;
        // A scrollbar appearing shifts the width by ~15px; ignoring that
        // keeps a render from re-triggering the layout that caused it.
        return Math.abs(prev.w - w) < 24 && Math.abs(prev.h - h) < 24 ? prev : { w, h };
      });

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // ── Layout ─────────────────────────────────────────────────────────────
  const scale = useMemo(
    () => pageScale(defaultSize, shell, fit, zoom),
    [defaultSize, shell, fit, zoom]
  );

  const layout = useMemo(() => {
    const tops: number[] = [];
    const boxes: Size[] = [];
    let y = SHELL_PADDING;
    for (let i = 1; i <= numPages; i++) {
      const natural = sizes.get(i) ?? defaultSize ?? { w: 1, h: 1 };
      const box = { w: Math.floor(natural.w * scale), h: Math.floor(natural.h * scale) };
      tops.push(y);
      boxes.push(box);
      y += box.h + PAGE_GAP;
    }
    return { tops, boxes, total: y };
  }, [numPages, sizes, defaultSize, scale]);

  const onNaturalSize = useCallback((n: number, size: Size) => {
    setSizes((prev) => {
      const known = prev.get(n);
      if (known && known.w === size.w && known.h === size.h) return prev;
      const next = new Map(prev);
      next.set(n, size);
      return next;
    });
  }, []);

  // ── Which pages are mounted, and which is current ──────────────────────
  const window_ = useMemo(() => {
    if (!numPages) return { first: 1, last: 0 };
    const first = pageAt(layout.tops, scrollTop) + 1;
    const last = pageAt(layout.tops, scrollTop + shell.h) + 1;
    return {
      first: Math.max(1, first - OVERSCAN),
      last: Math.min(numPages, last + OVERSCAN),
    };
  }, [layout, scrollTop, shell.h, numPages]);

  const onScroll = useCallback(() => {
    const node = shellRef.current;
    if (!node) return;
    cb.current.onActivity();
    setScrollTop(node.scrollTop);
  }, []);

  // The page under the reader: whichever page holds the point just above the
  // middle of the viewport, so a page counts once it is what they are looking
  // at. Read from the live scroll position, not the `scrollTop` state — after
  // a re-layout the anchor below has already moved the column, and the state
  // would still describe where it used to be.
  useEffect(() => {
    const node = shellRef.current;
    if (!numPages || !node) return;
    // Live from the DOM: scroll position and viewport height are always
    // available there, and a stale copy silently shifts which page counts.
    const probe = node.scrollTop + node.clientHeight * 0.42;
    const next = pageAt(layout.tops, probe) + 1;
    if (next !== currentRef.current) {
      currentRef.current = next;
      setCurrent(next);
      cb.current.onPageChange(next);
    }
  }, [scrollTop, shell.h, layout, numPages]);

  // ── Scroll to a requested page ─────────────────────────────────────────
  const scrollToPage = useCallback(
    (n: number) => {
      const node = shellRef.current;
      if (!node || !layout.tops.length) return;
      const target = Math.min(Math.max(n, 1), layout.tops.length);
      node.scrollTop = layout.tops[target - 1] - SHELL_PADDING;
      setScrollTop(node.scrollTop);
      if (target !== currentRef.current) {
        currentRef.current = target;
        setCurrent(target);
        // A jump made from inside the column (Home, End, arrow keys) has to
        // reach the counter the same way a scroll does.
        cb.current.onPageChange(target);
      }
    },
    [layout]
  );

  useEffect(() => {
    if (status !== "ready" || page === currentRef.current) return;
    scrollToPage(page);
    // Only a change of the requested page should scroll; a re-laid-out
    // column keeps its place through the anchor below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // Keep the reader's place through a zoom or fit change. The current page
  // does not change when the scale does, so once the column is re-laid-out
  // it is scrolled back to that page's new top. This runs before paint and
  // before the current-page effect above, so the reader never sees the jump
  // and the counter never re-derives itself from the wrong position. Guarded
  // on scale: a page reporting its true size also re-lays-out, and that must
  // not move the reader.
  const appliedScale = useRef(scale);
  useLayoutEffect(() => {
    if (appliedScale.current === scale) return;
    appliedScale.current = scale;
    const node = shellRef.current;
    if (!node || !layout.tops.length) return;
    node.scrollTop = layout.tops[currentRef.current - 1] - SHELL_PADDING;
    setScrollTop(node.scrollTop);
  }, [scale, layout]);

  // ── Keyboard, the way a document scrolls ───────────────────────────────
  useEffect(() => {
    if (!interactive) return;
    const onKey = (event: KeyboardEvent) => {
      const node = shellRef.current;
      if (!node || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const viewport = node.clientHeight * 0.9;
      switch (event.key) {
        case "ArrowDown":
          node.scrollBy({ top: KEY_SCROLL_PX });
          break;
        case "ArrowUp":
          node.scrollBy({ top: -KEY_SCROLL_PX });
          break;
        case "PageDown":
        case " ":
          node.scrollBy({ top: event.shiftKey && event.key === " " ? -viewport : viewport });
          break;
        case "PageUp":
          node.scrollBy({ top: -viewport });
          break;
        case "ArrowRight":
          scrollToPage(currentRef.current + 1);
          break;
        case "ArrowLeft":
          scrollToPage(currentRef.current - 1);
          break;
        case "Home":
          scrollToPage(1);
          break;
        case "End":
          scrollToPage(numPages);
          break;
        default:
          return;
      }
      event.preventDefault();
      cb.current.onActivity();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [interactive, numPages, scrollToPage]);

  // ── Touch: pinch and double-tap zoom; scrolling is native ──────────────
  const touch = useRef({ pinchDistance: 0, pinchZoom: 1, lastTapAt: 0, tapX: 0, tapY: 0 });
  const distanceBetween = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    cb.current.onActivity();
    if (!interactive) return;
    if (event.touches.length === 2) {
      touch.current.pinchDistance = distanceBetween(event.touches[0], event.touches[1]);
      touch.current.pinchZoom = zoom;
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || event.touches.length !== 2 || !touch.current.pinchDistance) return;
    // Two fingers mean zoom, so the shell must not also scroll.
    event.preventDefault();
    const next = distanceBetween(event.touches[0], event.touches[1]);
    cb.current.onZoomTo(touch.current.pinchZoom * (next / touch.current.pinchDistance));
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (touch.current.pinchDistance) {
      touch.current.pinchDistance = 0;
      return;
    }
    const changed = event.changedTouches[0];
    if (!changed) return;
    const now = Date.now();
    const moved =
      Math.abs(changed.clientX - touch.current.tapX) > 12 ||
      Math.abs(changed.clientY - touch.current.tapY) > 12;
    if (!moved && now - touch.current.lastTapAt < DOUBLE_TAP_MS) {
      cb.current.onZoomTo(zoom > 1.2 ? 1 : 2);
      touch.current.lastTapAt = 0;
      return;
    }
    touch.current.lastTapAt = now;
    touch.current.tapX = changed.clientX;
    touch.current.tapY = changed.clientY;
  };

  /** Ctrl/⌘ + wheel zooms, as it does in every desktop viewer. */
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    cb.current.onActivity();
    if (!interactive || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    cb.current.onZoomTo(zoom * (event.deltaY < 0 ? 1.1 : 0.9));
  };

  const pages: React.ReactNode[] = [];
  if (doc && numPages) {
    for (let n = window_.first; n <= window_.last; n++) {
      const box = layout.boxes[n - 1];
      pages.push(
        <div
          key={n}
          className="absolute left-0 right-0"
          style={{ top: layout.tops[n - 1] }}
        >
          <PageView
            doc={doc}
            page={n}
            width={box.w}
            height={box.h}
            scale={scale}
            current={n === current}
            pageLabel={pageLabel}
            canvasRef={canvasRef}
            overlay={overlay}
            onNaturalSize={onNaturalSize}
            onRendered={onRendered}
          />
        </div>
      );
    }
  }

  return (
    <div
      ref={shellRef}
      onScroll={onScroll}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
      onPointerMove={() => cb.current.onActivity()}
      className={`h-full min-h-0 ${
        // Marking and capture happen on a still page.
        interactive ? "overflow-auto overscroll-none touch-pan-x touch-pan-y" : "overflow-hidden touch-none"
      }`}
      style={{ WebkitOverflowScrolling: "touch" }}
      data-lenis-prevent="true"
    >
      {status === "loading" && (
        <div className="flex h-full flex-col items-center justify-center text-[var(--v-text-dim)]">
          <div className="mb-4 h-8 w-8 animate-spin rounded-md border-2 border-[var(--v-line-strong)] border-t-[var(--v-accent-fg)]" />
          <span className="font-body text-xs tracking-[0.2em]">Loading catalogue…</span>
        </div>
      )}

      {/* The document-level error state, with its retry and its WhatsApp
          route out, is owned by CatalogViewerModal so there is one of it. */}

      {status === "ready" && (
        <div className="relative" style={{ height: layout.total }}>
          {pages}
        </div>
      )}
    </div>
  );
}

export type { PdfCanvasProps };
