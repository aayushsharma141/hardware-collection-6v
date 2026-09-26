"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { FileText, MessageCircle, RotateCw } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/config";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { trackCatalogue } from "@/lib/catalog/analytics";
import {
  boundsOfStrokes,
  composeCapture,
  shareCapture,
  suggestRegion,
} from "@/lib/catalog/capture";
import {
  buildCaption,
  buildCatalogueUnavailableMessage,
  buildMarkedEnquiryMessage,
  buildPageEnquiryMessage,
} from "@/lib/catalog/messages";
import { Brand, BrandCatalog, getSlugString } from "@/types/catalog";
import CatalogHeader from "./viewer/CatalogHeader";
import ViewerControls from "./viewer/ViewerControls";
import MarkToolbar from "./viewer/MarkToolbar";
import CaptureToolbar from "./viewer/CaptureToolbar";
import AnnotationLayer from "./viewer/AnnotationLayer";
import CaptureSelector from "./viewer/CaptureSelector";
import PageJump from "./viewer/PageJump";
import type {
  AnnotationTool,
  CatalogueStatus,
  FitMode,
  NormRect,
  Stroke,
  ViewerState,
} from "./viewer/types";

/**
 * The catalogue viewer.
 *
 * This is a catalogue-to-WhatsApp conversion surface, not a PDF application.
 * It moves through four states — browse, mark, capture, preview — and every
 * one of them ends in the same place: an enquiry reaching the showroom with
 * enough context (brand, catalogue, page, and usually an image of the marked
 * product) for staff to confirm the model, availability and current price.
 *
 * There is deliberately no download, save, print or generic share. Note that
 * this is a product decision expressed in the interface, plus a proxied asset
 * route that keeps the Sanity URL out of the page — not DRM. Anything the
 * browser renders can still be screenshotted.
 */

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const CONTROLS_IDLE_MS = 2200;
const DEFAULT_REGION: NormRect = { x: 0.14, y: 0.18, w: 0.72, h: 0.52 };

/** pdf.js is ~1MB and browser-only, so it stays out of the page's graph. */
const PdfCanvas = dynamic(() => import("./viewer/PdfCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full flex-col items-center justify-center text-white/55">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#C8A96E]" />
      <span className="font-body text-xs uppercase tracking-[0.2em]">Loading catalogue…</span>
    </div>
  ),
});

const ThumbnailDrawer = dynamic(() => import("./viewer/ThumbnailDrawer"), { ssr: false });
const CatalogSearch = dynamic(() => import("./viewer/CatalogSearch"), { ssr: false });
const CatalogueInfo = dynamic(() => import("./viewer/CatalogueInfo"), { ssr: false });
const SharePreview = dynamic(() => import("./viewer/SharePreview"), { ssr: false });

type Sheet = "none" | "pages" | "search" | "info" | "jump";

interface CatalogViewerModalProps {
  brand: Brand;
  onClose: () => void;
}

function catalogLabel(entry: BrandCatalog, brandName: string, index: number): string {
  return entry.title || `${brandName} Catalog ${index + 1}`;
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export default function CatalogViewerModal({ brand, onClose }: CatalogViewerModalProps) {
  const catalogs = useMemo<BrandCatalog[]>(() => brand.officialCatalogs ?? [], [brand]);
  const slug = getSlugString(brand.slug);
  const reduceMotion = useReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const pageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const annotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<ViewerState>("browse");
  const [active, setActive] = useState(0);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState<FitMode>("width");
  const [status, setStatus] = useState<CatalogueStatus>("loading");
  const [renderToken, setRenderToken] = useState(0);
  // Bumping this remounts the canvas, which is how a failed document is retried.
  const [reloadToken, setReloadToken] = useState(0);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [tool, setTool] = useState<AnnotationTool>("pen");
  const [region, setRegion] = useState<NormRect>(DEFAULT_REGION);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);

  const [sheet, setSheet] = useState<Sheet>("none");
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  const hasCatalogs = catalogs.length > 0 && Boolean(slug);
  const external = !hasCatalogs ? brand.officialCatalogUrl : null;
  const ready = status === "ready";
  const title = hasCatalogs
    ? catalogLabel(catalogs[active], brand.name, active)
    : `${brand.name} Official Catalog`;
  const context = useMemo(
    () => ({ brand: brand.name, catalogue: title, page }),
    [brand.name, title, page]
  );

  useFocusTrap(rootRef, true);

  const announce = useCallback((message: string) => setAnnouncement(message), []);

  // ── Chrome auto-hide ───────────────────────────────────────────────────
  // The catalogue is the interface, so the controls step back while the
  // customer reads and return on the next touch, tap or key.
  const wake = useCallback(() => {
    setControlsVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setControlsVisible(false), CONTROLS_IDLE_MS);
  }, []);

  useEffect(() => {
    const first = setTimeout(() => setControlsVisible(false), CONTROLS_IDLE_MS);
    return () => {
      clearTimeout(first);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  /** Anything open over the page keeps the chrome up regardless of the timer. */
  const chromeVisible = controlsVisible || sheet !== "none" || menuOpen;

  // ── Navigation ─────────────────────────────────────────────────────────
  const goToPage = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(next, 1), numPages || 1);
      if (target === page) return;
      setPage(target);
      // Marks belong to the page they were drawn on.
      setStrokes([]);
      trackCatalogue("catalogue_page_view", {
        brand: brand.name,
        catalogue: title,
        page: target,
        pages: numPages,
      });
    },
    [numPages, page, brand.name, title]
  );

  const pageViewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScrolledToPage = useCallback(
    (next: number) => {
      setPage(next);
      setStrokes([]);
      if (pageViewTimer.current) clearTimeout(pageViewTimer.current);
      pageViewTimer.current = setTimeout(() => {
        trackCatalogue("catalogue_page_view", {
          brand: brand.name,
          catalogue: title,
          page: next,
          pages: numPages,
        });
      }, 600);
    },
    [brand.name, title, numPages]
  );

  useEffect(
    () => () => {
      if (pageViewTimer.current) clearTimeout(pageViewTimer.current);
    },
    []
  );

  const zoomTo = useCallback(
    (next: number) => {
      const clamped = +Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)).toFixed(2);
      if (clamped === zoom) return;
      setZoom(clamped);
      trackCatalogue("catalogue_zoom", { brand: brand.name, catalogue: title, zoom: clamped });
    },
    [zoom, brand.name, title]
  );

  const selectCatalogue = useCallback(
    (index: number) => {
      setActive(index);
      setDoc(null);
      setPage(1);
      setNumPages(0);
      setZoom(1);
      setFit("width");
      setStatus("loading");
      setStrokes([]);
      setSheet("none");
      setState("browse");
      announce(`Opened ${catalogLabel(catalogs[index], brand.name, index)}.`);
    },
    [announce, brand.name, catalogs]
  );

  // ── WhatsApp ───────────────────────────────────────────────────────────
  const enquireAboutPage = useCallback(() => {
    const url = buildWhatsAppUrl(
      hasCatalogs
        ? buildPageEnquiryMessage(context)
        : buildCatalogueUnavailableMessage(brand.name)
    );
    trackCatalogue("catalogue_whatsapp_click", {
      brand: brand.name,
      catalogue: title,
      page,
      intent: "page",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }, [brand.name, context, hasCatalogs, page, title]);

  // ── Mark → capture → preview ───────────────────────────────────────────
  const startMarking = useCallback(() => {
    setStrokes([]);
    setState("mark");
    trackCatalogue("catalogue_mark_start", { brand: brand.name, catalogue: title, page });
    announce("Mark mode. Draw on the page to point at a product, then choose Done.");
  }, [announce, brand.name, page, title]);

  const finishMarking = useCallback(() => {
    const bounds = boundsOfStrokes(strokes);
    setRegion(bounds ? suggestRegion(bounds) : DEFAULT_REGION);
    setState("capture");
    announce("Adjust the area to send, then choose Capture.");
  }, [announce, strokes]);

  const confirmCapture = useCallback(async () => {
    const pageCanvas = pageCanvasRef.current;
    if (!pageCanvas) return;
    setBusy(true);
    const blob = await composeCapture({
      page: pageCanvas,
      annotations: annotationCanvasRef.current,
      region,
      caption: buildCaption(context),
    });
    setBusy(false);

    if (!blob) {
      announce("Nothing was captured. Try a larger area.");
      return;
    }
    blobRef.current = blob;
    setPreviewUrl(URL.createObjectURL(blob));
    setShareNote(null);
    setState("preview");
    trackCatalogue("catalogue_mark_complete", {
      brand: brand.name,
      catalogue: title,
      page,
      intent: "marked",
    });
    trackCatalogue("catalogue_capture", { brand: brand.name, catalogue: title, page });
    announce("Selection captured. Review it, then share to WhatsApp.");
  }, [announce, brand.name, context, page, region, title]);

  const share = useCallback(async () => {
    const blob = blobRef.current;
    if (!blob) return;
    setBusy(true);
    const message = buildMarkedEnquiryMessage(context);
    const result = await shareCapture({
      blob,
      message,
      whatsAppUrl: buildWhatsAppUrl(message),
    });
    setBusy(false);

    if (result.cancelled) return;

    trackCatalogue("catalogue_whatsapp_click", {
      brand: brand.name,
      catalogue: title,
      page,
      intent: "marked",
      transport: result.transport,
    });

    if (result.transport === "share-sheet") {
      announce("Shared. Choose WhatsApp to attach the image.");
      setState("browse");
      setStrokes([]);
      return;
    }
    const note =
      result.transport === "clipboard"
        ? "WhatsApp is open and the image is on your clipboard — paste it into the chat to send it."
        : "WhatsApp is open. Your browser blocked the clipboard, so take a screenshot of this image to attach it.";
    setShareNote(note);
    announce(note);
  }, [announce, brand.name, context, page, title]);

  // Release the previous preview when it is replaced, and the last on unmount.
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const leavePreview = useCallback(() => {
    setPreviewUrl(null);
    setShareNote(null);
    setState("capture");
  }, []);

  const cancelMarking = useCallback(() => {
    setStrokes([]);
    setPreviewUrl(null);
    setShareNote(null);
    setState("browse");
    announce("Back to browsing.");
  }, [announce]);

  const toggleFullscreen = useCallback(() => {
    const node = rootRef.current;
    if (!node) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void node.requestFullscreen?.().catch(() => setFullscreen(false));
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── Open event, and the view-only guards ───────────────────────────────
  useEffect(() => {
    trackCatalogue("catalogue_open", { brand: brand.name, catalogue: title });
    // Intentionally once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockDrag = (e: DragEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd+P and Ctrl/Cmd+S would otherwise offer the rendered page.
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "s")) {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Escape") {
        // Unwind one layer at a time.
        if (menuOpen) setMenuOpen(false);
        else if (sheet !== "none") setSheet("none");
        else if (state === "preview") leavePreview();
        else if (state === "capture") setState("mark");
        else if (state === "mark") cancelMarking();
        else onClose();
        return;
      }

      if (isTypingTarget(e.target) || state !== "browse" || sheet !== "none") return;
      setControlsVisible(true);

      // Arrow, Page, Home and End keys scroll the column itself; see PdfCanvas.
      switch (e.key) {
        case "+":
        case "=":
          zoomTo(zoom + 0.25);
          break;
        case "-":
        case "_":
          zoomTo(zoom - 0.25);
          break;
        case "0":
          zoomTo(1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDrag);
    document.addEventListener("keydown", onKeyDown);
    // Paired with the @media print rule in globals.css.
    document.body.classList.add("catalog-locked");
    lockScroll();

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("catalog-locked");
      unlockScroll();
    };
  }, [
    onClose,
    state,
    sheet,
    menuOpen,
    zoomTo,
    zoom,
    cancelMarking,
    leavePreview,
  ]);

  const onDocument = useCallback((next: PDFDocumentProxy | null) => setDoc(next), []);
  const onLoaded = useCallback((total: number) => {
    setNumPages(total);
    // Catalogs differ wildly in length — 264 pages for Häfele, 32 for Blum —
    // so a page carried over from the last one has to be brought into range
    // rather than sent to pdf.js as an invalid page request.
    setPage((current) => Math.min(Math.max(current, 1), total || 1));
  }, []);
  const onStatusChange = useCallback((next: CatalogueStatus) => setStatus(next), []);
  const onRendered = useCallback(() => setRenderToken((t) => t + 1), []);

  const openSheet = (next: Sheet) => {
    setMenuOpen(false);
    setSheet(next);
  };

  return (
    <motion.div
      ref={rootRef}
      tabIndex={-1}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 32 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-title"
      aria-describedby="catalogue-hint"
      className="fixed inset-0 z-[100] select-none bg-[#0E0C0C] text-white outline-none"
    >
      <h1 id="catalogue-title" className="sr-only">
        {brand.name} — {title}
      </h1>
      <p id="catalogue-hint" className="sr-only">
        View-only catalogue. Arrow keys turn pages. Use Mark &amp; Share to send a product to
        Hardware Collection on WhatsApp, or Enquire to ask about this page.
      </p>
      <p aria-live="polite" role="status" className="sr-only">
        {ready && numPages ? `Page ${page} of ${numPages}` : ""}
      </p>
      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>

      {hasCatalogs ? (
        <>
          <div className="absolute inset-0" onClick={wake}>
            <PdfCanvas
              key={`${slug}-${active}-${reloadToken}`}
              src={`/api/catalog/${encodeURIComponent(slug)}/${active}`}
              page={page}
              zoom={zoom}
              fit={fit}
              pageLabel={`${title}, page ${page}${numPages ? ` of ${numPages}` : ""}`}
              canvasRef={pageCanvasRef}
              interactive={state === "browse" && sheet === "none"}
              onDocument={onDocument}
              onLoaded={onLoaded}
              onStatusChange={onStatusChange}
              onRendered={onRendered}
              onPageChange={onScrolledToPage}
              onZoomTo={zoomTo}
              onActivity={wake}
              overlay={
                <>
                  <AnnotationLayer
                    pageCanvasRef={pageCanvasRef}
                    annotationRef={annotationCanvasRef}
                    strokes={strokes}
                    tool={tool}
                    drawable={state === "mark"}
                    renderToken={renderToken}
                    onCommit={(stroke) => setStrokes((all) => [...all, stroke])}
                  />
                  {state === "capture" && (
                    <CaptureSelector region={region} onChange={setRegion} />
                  )}
                </>
              }
            />
          </div>

          {status === "error" && (
            <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
              <div className="max-w-sm text-center">
                <p className="font-body text-sm text-white/75">
                  Catalogue temporarily unavailable.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {/* A failure here is usually a dropped connection, so the
                      first offer is to try again rather than to give up. */}
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("loading");
                      setReloadToken((t) => t + 1);
                      announce("Retrying the catalogue.");
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#C8A96E]/60 px-5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#C8A96E] transition-colors hover:bg-[#C8A96E] hover:text-[#0E0C0C] hc-focus"
                  >
                    <RotateCw className="h-4 w-4" />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={enquireAboutPage}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#8B1A4A] px-5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#a02456] hc-focus"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          {state === "browse" && (
            <>
              <CatalogHeader
                brand={brand.name}
                title={title}
                visible={chromeVisible}
                menuOpen={menuOpen}
                fullscreen={fullscreen}
                searchable={Boolean(doc)}
                onBack={onClose}
                onToggleMenu={() => setMenuOpen((open) => !open)}
                onOpenPages={() => openSheet("pages")}
                onOpenSearch={() => openSheet("search")}
                onToggleFullscreen={() => {
                  setMenuOpen(false);
                  toggleFullscreen();
                }}
                onOpenInfo={() => openSheet("info")}
              />
              <ViewerControls
                page={page}
                pages={numPages}
                zoom={zoom}
                fit={fit}
                ready={ready}
                visible={chromeVisible}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                onZoom={(delta) => zoomTo(zoom + delta)}
                onToggleFit={() => setFit((f) => (f === "width" ? "page" : "width"))}
                onResetZoom={() => zoomTo(1)}
                onOpenPageJump={() => openSheet("jump")}
                onMark={startMarking}
                onEnquire={enquireAboutPage}
              />
            </>
          )}

          {state === "mark" && (
            <MarkToolbar
              tool={tool}
              canUndo={strokes.length > 0}
              onTool={setTool}
              onUndo={() => setStrokes((all) => all.slice(0, -1))}
              onClear={() => setStrokes([])}
              onDone={finishMarking}
              onCancel={cancelMarking}
            />
          )}

          {state === "capture" && (
            <CaptureToolbar busy={busy} onBack={() => setState("mark")} onConfirm={confirmCapture} />
          )}

          {state === "preview" && previewUrl && (
            <SharePreview
              previewUrl={previewUrl}
              brand={brand.name}
              catalogue={title}
              page={page}
              busy={busy}
              note={shareNote}
              onEdit={leavePreview}
              onClose={cancelMarking}
              onShare={share}
            />
          )}

          {sheet === "jump" && (
            <PageJump
              page={page}
              pages={numPages}
              onGo={(target) => {
                goToPage(target);
                setSheet("none");
              }}
              onCancel={() => setSheet("none")}
            />
          )}

          {sheet === "pages" && (
            <ThumbnailDrawer
              doc={doc}
              pages={numPages}
              current={page}
              onSelect={(target) => {
                goToPage(target);
                setSheet("none");
              }}
              onClose={() => setSheet("none")}
            />
          )}

          {sheet === "search" && (
            <CatalogSearch
              doc={doc}
              pages={numPages}
              onSelect={(target) => {
                goToPage(target);
                setSheet("none");
              }}
              onClose={() => setSheet("none")}
              onSearched={(query, results) =>
                trackCatalogue("catalogue_search", {
                  brand: brand.name,
                  catalogue: title,
                  query,
                  results,
                })
              }
            />
          )}

          {sheet === "info" && (
            <CatalogueInfo
              brand={brand.name}
              catalogues={catalogs}
              active={active}
              pages={numPages}
              onSelect={selectCatalogue}
              onClose={() => setSheet("none")}
              onEnquire={enquireAboutPage}
              label={(entry, index) => catalogLabel(entry, brand.name, index)}
            />
          )}
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171414] p-8 text-center md:p-12">
            <FileText className="mx-auto mb-6 h-12 w-12 text-[#C8A96E] opacity-70" />
            <h2 className="mb-4 font-display text-2xl uppercase tracking-[0.16em] text-white md:text-3xl">
              Not yet available
            </h2>
            <p className="mb-8 font-body text-sm leading-relaxed text-white/60">
              {external
                ? `${brand.name} publishes its catalogue on the manufacturer's own site.`
                : `We have not received the current ${brand.name} catalogue yet. Message a specialist and we will help you with the range directly.`}
            </p>
            {external ? (
              <a
                href={external}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-6 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-[#C8A96E] hover:text-[#C8A96E] hc-focus"
              >
                Visit manufacturer site
              </a>
            ) : (
              <button
                type="button"
                onClick={enquireAboutPage}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#8B1A4A] px-6 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#a02456] hc-focus"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire on WhatsApp
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-4 block w-full font-body text-[11px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white hc-focus"
            >
              Back to catalogues
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
