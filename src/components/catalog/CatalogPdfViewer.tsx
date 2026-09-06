"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";

/**
 * Renders a catalog page-by-page onto a canvas.
 *
 * `src` points at /api/catalog/<slug>/<n>, never at the Sanity CDN, and the
 * document is drawn rather than embedded so there is no browser PDF chrome
 * offering a download or print button.
 *
 * This component is *controlled*: page, zoom, rotation and fit are owned by
 * CatalogViewerModal, which renders the controls in its side rails. The canvas
 * element is handed up through `canvasRef` so the snipping tool can crop from
 * exactly what was drawn.
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

export type CatalogViewerStatus = "loading" | "ready" | "error";
export type CatalogFitMode = "width" | "page";

interface CatalogPdfViewerProps {
  src: string;
  page: number;
  zoom: number;
  /** User rotation in degrees, added to the page's own orientation. */
  rotation: number;
  fit: CatalogFitMode;
  /** Describes the drawn page to assistive tech. */
  pageLabel: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onLoaded: (numPages: number) => void;
  onStatusChange: (status: CatalogViewerStatus, message?: string) => void;
}

/** Give this a `key` per catalog so switching documents remounts it. */
export default function CatalogPdfViewer({
  src,
  page,
  zoom,
  rotation,
  fit,
  pageLabel,
  canvasRef,
  onLoaded,
  onStatusChange,
}: CatalogPdfViewerProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  // destroy() lives on the loading task in pdf.js 6, not on the document.
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const taskRef = useRef<RenderTask | null>(null);

  // Callbacks live in refs so the parent does not have to memoize them to keep
  // the load and render effects from re-running.
  const onLoadedRef = useRef(onLoaded);
  const onStatusRef = useRef(onStatusChange);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
    onStatusRef.current = onStatusChange;
  });

  const [status, setStatus] = useState<CatalogViewerStatus>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [pageText, setPageText] = useState("");
  // Bumped by the ResizeObserver so fit-to-width/page re-render on layout change.
  const [shellTick, setShellTick] = useState(0);

  // Load the document. The parent keys this component per catalog, so a
  // different `src` arrives on a fresh mount with `status` already "loading".
  useEffect(() => {
    let cancelled = false;

    loadPdfjs()
      .then((pdfjs) => {
        // Release the previous document before opening another.
        loadingTaskRef.current?.destroy();
        const task = pdfjs.getDocument({
          url: src,
          // Let the proxy's Range support stream only what is being read,
          // rather than pulling a 70MB catalog to show page one.
          disableAutoFetch: true,
          disableStream: false,
          // Catalogs that reference the standard 14 fonts without embedding
          // them render blank text without this.
          standardFontDataUrl: "/pdfjs/standard_fonts/",
        });
        loadingTaskRef.current = task;
        return task.promise;
      })
      .then((doc) => {
        if (cancelled) return;
        docRef.current = doc;
        setStatus("ready");
        onLoadedRef.current(doc.numPages);
        onStatusRef.current("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Catalog failed to load:", err);
        setMessage("This catalog could not be opened.");
        setStatus("error");
        onStatusRef.current("error", "This catalog could not be opened.");
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  // Tear down on unmount.
  useEffect(
    () => () => {
      taskRef.current?.cancel();
      loadingTaskRef.current?.destroy();
      loadingTaskRef.current = null;
      docRef.current = null;
    },
    []
  );

  // Re-fit when the viewport changes size.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShellTick((t) => t + 1));
    });
    observer.observe(shell);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Draw the current page.
  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (status !== "ready" || !doc || !canvas) return;

    let cancelled = false;

    (async () => {
      try {
        taskRef.current?.cancel();
        const pdfPage = await doc.getPage(page);
        if (cancelled) return;

        const angle = (((pdfPage.rotate + rotation) % 360) + 360) % 360;
        const natural = pdfPage.getViewport({ scale: 1, rotation: angle });

        const availableWidth = (shellRef.current?.clientWidth ?? 900) - 32;
        const availableHeight = (shellRef.current?.clientHeight ?? 1200) - 32;
        const widthFit = availableWidth / natural.width;
        const base =
          fit === "page"
            ? Math.min(widthFit, availableHeight / natural.height)
            : Math.min(widthFit, 1.6);
        const viewport = pdfPage.getViewport({
          scale: Math.max(base, 0.2) * zoom,
          rotation: angle,
        });

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

        // A canvas is opaque to screen readers, so the page text is mirrored
        // into a visually hidden region beside it.
        const content = await pdfPage.getTextContent();
        if (cancelled) return;
        setPageText(
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim()
        );
      } catch (err) {
        const name = (err as { name?: string })?.name;
        if (name === "RenderingCancelledException" || cancelled) return;
        console.error("Catalog page failed to render:", err);
        setMessage("This page could not be displayed.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, zoom, rotation, fit, status, shellTick, canvasRef]);

  return (
    <div
      ref={shellRef}
      className="h-full min-h-0 overflow-auto flex items-start justify-center p-4 bg-[#f3ece1]"
    >
      {status === "loading" && (
        <div className="flex h-full flex-col items-center justify-center text-[#998f81]">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#e5c487]" />
          <span className="font-body text-xs uppercase tracking-widest">Opening catalog…</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <p className="max-w-sm font-body text-sm text-[var(--text-secondary)]">
            {message ?? "This catalog could not be opened."}
          </p>
        </div>
      )}

      <div className={status === "ready" ? "relative" : "hidden"}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={pageLabel}
          className="bg-white shadow-[0_10px_40px_-18px_rgba(26,16,23,0.5)]"
          // Belt and braces alongside the modal-level handlers.
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        {pageText && (
          <p className="sr-only" data-testid="catalog-page-text">
            {pageText}
          </p>
        )}
      </div>
    </div>
  );
}
