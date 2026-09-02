"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

/**
 * Renders a catalog page-by-page onto a canvas.
 *
 * `src` points at /api/catalog/<slug>/<n>, never at the Sanity CDN, and the
 * document is drawn rather than embedded so there is no browser PDF chrome
 * offering a download or print button.
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

interface CatalogPdfViewerProps {
  src: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

/** Give this a `key` per catalog: switching documents remounts it, which is
 *  how paging and zoom reset rather than being cleared in an effect. */
export default function CatalogPdfViewer({ src }: CatalogPdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  // destroy() lives on the loading task in pdf.js 6, not on the document.
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const taskRef = useRef<RenderTask | null>(null);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  // Load (or reload) the document.
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
        setNumPages(doc.numPages);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Catalog failed to load:", err);
        setMessage("This catalog could not be opened.");
        setStatus("error");
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

        const available = (shellRef.current?.clientWidth ?? 900) - 32;
        const natural = pdfPage.getViewport({ scale: 1 });
        const fit = Math.min(available / natural.width, 1.6);
        const viewport = pdfPage.getViewport({ scale: Math.max(fit, 0.2) * zoom });

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
  }, [page, zoom, status, numPages]);

  const go = useCallback(
    (delta: number) => setPage((p) => Math.min(Math.max(p + delta, 1), numPages || 1)),
    [numPages]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        ref={shellRef}
        className="flex-1 min-h-0 overflow-auto flex items-start justify-center p-4 bg-[#f3ece1]"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center h-full text-[#998f81]">
            <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[#e5c487] rounded-full animate-spin mb-4" />
            <span className="font-body text-xs uppercase tracking-widest">Opening catalog…</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <p className="font-body text-sm text-[var(--text-secondary)] max-w-sm">
              {message ?? "This catalog could not be opened."}
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`shadow-[0_10px_40px_-18px_rgba(26,16,23,0.5)] bg-white ${
            status === "ready" ? "" : "hidden"
          }`}
          // Belt and braces alongside the modal-level handlers.
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      <footer className="h-14 shrink-0 border-t border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center gap-6 px-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={page <= 1 || status !== "ready"}
          aria-label="Previous page"
          className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-body text-xs text-[var(--text-secondary)] tabular-nums min-w-[7rem] text-center">
          Page <span className="text-[var(--text-primary)]">{status === "ready" ? page : "–"}</span>{" "}
          of {numPages || "–"}
        </span>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={page >= numPages || status !== "ready"}
          aria-label="Next page"
          className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[var(--border)] hidden sm:block" />

        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)))}
            disabled={zoom <= MIN_ZOOM || status !== "ready"}
            aria-label="Zoom out"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-body text-xs text-[var(--text-secondary)] tabular-nums w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)))}
            disabled={zoom >= MAX_ZOOM || status !== "ready"}
            aria-label="Zoom in"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
