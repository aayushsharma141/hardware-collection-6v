"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Crop,
  FileText,
  Hash,
  Keyboard,
  Layers,
  Maximize2,
  MessageCircle,
  Minimize2,
  RotateCw,
  Scan,
  ShieldCheck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buildWhatsAppUrl } from "@/lib/config";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import dynamic from "next/dynamic";
import { Brand, BrandCatalog, getSlugString } from "@/types/catalog";
import { Rail, RailButton, RailDivider, RailReadout } from "./CatalogRail";
import type { CatalogFitMode, CatalogViewerStatus } from "./CatalogPdfViewer";

/**
 * pdf.js is ~1MB and touches browser-only APIs, so it stays out of this
 * page's import graph and off the server render entirely.
 */
const CatalogPdfViewer = dynamic(() => import("./CatalogPdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full flex-col items-center justify-center text-[#998f81]">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#e5c487]" />
      <span className="font-body text-xs uppercase tracking-widest">Opening catalog…</span>
    </div>
  ),
});

const CatalogSnipLayer = dynamic(() => import("./CatalogSnipLayer"), { ssr: false });

interface CatalogViewerModalProps {
  brand: Brand;
  onClose: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const SHORTCUTS: Array<[string, string]> = [
  ["↑ / ↓ / Page Up / Page Down", "Previous or next page"],
  ["Home / End", "First or last page"],
  ["+ / −", "Zoom in or out"],
  ["0", "Reset zoom"],
  ["W", "Switch fit to width / whole page"],
  ["R", "Rotate the page"],
  ["S", "Mark an area to send"],
  ["F", "Full screen"],
  ["?", "This list"],
  ["Esc", "Close"],
];

function catalogLabel(entry: BrandCatalog, brandName: string, index: number): string {
  return entry.title || `${brandName} Catalog ${index + 1}`;
}

function catalogMeta(entry: BrandCatalog): string {
  return [
    entry.type && entry.type !== "catalog" ? entry.type : null,
    entry.version ? `v${entry.version}` : null,
    entry.releaseDate ? entry.releaseDate.slice(0, 4) : null,
  ]
    .filter(Boolean)
    .join(" • ");
}

/** True when a keystroke belongs to a text field rather than the viewer. */
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [active, setActive] = useState(0);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fit, setFit] = useState<CatalogFitMode>("width");
  const [status, setStatus] = useState<CatalogViewerStatus>("loading");
  const [panel, setPanel] = useState<"none" | "catalogs" | "jump" | "help">("none");
  const [snipping, setSnipping] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [pageInput, setPageInput] = useState("1");

  const hasCatalogs = catalogs.length > 0 && Boolean(slug);
  const external = !hasCatalogs ? brand.officialCatalogUrl : null;
  const ready = status === "ready";

  const title = hasCatalogs
    ? catalogLabel(catalogs[active], brand.name, active)
    : `${brand.name} Official Catalog`;
  const provenance = `${brand.name} — ${title} · Page ${page}`;

  useFocusTrap(rootRef, true);

  const announce = useCallback((message: string) => setAnnouncement(message), []);

  const goToPage = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(next, 1), numPages || 1);
      setPage(target);
      setPageInput(String(target));
    },
    [numPages]
  );

  const step = useCallback((delta: number) => goToPage(page + delta), [goToPage, page]);

  const commitPageInput = useCallback(() => {
    const target = Number.parseInt(pageInput, 10);
    if (Number.isFinite(target)) goToPage(target);
    setPanel("none");
  }, [goToPage, pageInput]);

  const zoomBy = useCallback((delta: number) => {
    setZoom((z) => +Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)).toFixed(2));
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = rootRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void node.requestFullscreen?.().catch(() => setFullscreen(false));
    }
  }, []);

  const selectCatalog = useCallback(
    (index: number) => {
      setActive(index);
      setPage(1);
      setPageInput("1");
      setZoom(1);
      setRotation(0);
      setNumPages(0);
      setStatus("loading");
      setPanel("none");
      setSnipping(false);
      announce(`Opened ${catalogLabel(catalogs[index], brand.name, index)}.`);
    },
    [announce, brand.name, catalogs]
  );

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
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
        // Unwind one layer at a time: overlay, then panel, then the modal.
        if (snipping) setSnipping(false);
        else if (panel !== "none") setPanel("none");
        else onClose();
        return;
      }

      if (isTypingTarget(e.target) || snipping) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          goToPage(1);
          break;
        case "End":
          e.preventDefault();
          goToPage(numPages || 1);
          break;
        case "+":
        case "=":
          zoomBy(0.25);
          break;
        case "-":
        case "_":
          zoomBy(-0.25);
          break;
        case "0":
          setZoom(1);
          break;
        case "w":
        case "W":
          setFit((f) => (f === "width" ? "page" : "width"));
          break;
        case "r":
        case "R":
          setRotation((deg) => (deg + 90) % 360);
          break;
        case "s":
        case "S":
          if (hasCatalogs) setSnipping(true);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case "?":
          setPanel((p) => (p === "help" ? "none" : "help"));
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
    lockScroll(); // BUG-05 fix: centralized scroll lock

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("catalog-locked");
      unlockScroll();
    };
  }, [
    onClose,
    snipping,
    panel,
    step,
    goToPage,
    numPages,
    zoomBy,
    toggleFullscreen,
    hasCatalogs,
  ]);

  const onLoaded = useCallback((total: number) => setNumPages(total), []);
  const onStatusChange = useCallback(
    (next: CatalogViewerStatus) => setStatus(next),
    []
  );

  const whatsAppUrl = buildWhatsAppUrl(
    hasCatalogs
      ? `Hi Hardware Collection, I am viewing the ${brand.name} catalog "${title}" (page ${page}) and need this product.`
      : `Hi Hardware Collection, I am viewing the ${brand.name} catalog and need a specific product.`
  );

  return (
    <motion.div
      ref={rootRef}
      tabIndex={-1}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={reduceMotion ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 30 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalog-modal-title"
      aria-describedby="catalog-modal-hint"
      className="fixed inset-0 z-[100] select-none bg-[#fbf5ea] text-[var(--text-primary)] outline-none"
    >
      {/* Announcements for assistive tech — the canvas cannot carry them.
          The page counter is derived rather than stored, so turning a page
          updates the live region without an effect. */}
      <p aria-live="polite" role="status" className="sr-only">
        {ready && numPages ? `Page ${page} of ${numPages}` : ""}
      </p>
      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>
      <p id="catalog-modal-hint" className="sr-only">
        View-only catalog. Use the arrow keys to turn pages, S to mark an area to send on
        WhatsApp, and question mark for all shortcuts.
      </p>

      {/* Identity chip — the former title bar, reduced to what it actually said. */}
      <div className="pointer-events-none absolute left-16 top-3 z-40 flex max-w-[45vw] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)]/92 px-4 py-2 backdrop-blur-md md:left-24">
        <FileText className="h-3.5 w-3.5 shrink-0 text-[#c8a96e]" />
        <span
          id="catalog-modal-title"
          className="truncate font-display text-[11px] uppercase tracking-widest text-[var(--text-primary)] md:text-xs"
        >
          {title}
        </span>
      </div>

      <div className="pointer-events-none absolute right-16 top-3 z-40 hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)]/92 px-4 py-2 backdrop-blur-md sm:flex md:right-24">
        <ShieldCheck className="h-3.5 w-3.5 text-[#c8a96e]" />
        <span className="font-body text-[10px] uppercase tracking-wider text-[#998f81]">
          View only
        </span>
      </div>

      {/* Content plane. Rails float above it rather than bracketing it. */}
      <div className="absolute inset-0 px-16 md:px-24">
        <div className="relative h-full min-h-0">
          {/* Screenshot deterrent, kept out of the pointer path. */}
          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-wrap items-center justify-center gap-20 overflow-hidden p-10 opacity-[0.045]"
            aria-hidden="true"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="-rotate-45 whitespace-nowrap font-display text-4xl">
                HARDWARE COLLECTION
              </span>
            ))}
          </div>

          {hasCatalogs ? (
            <>
              <CatalogPdfViewer
                key={`${slug}-${active}`}
                src={`/api/catalog/${encodeURIComponent(slug)}/${active}`}
                page={page}
                zoom={zoom}
                rotation={rotation}
                fit={fit}
                pageLabel={`${title}, page ${page}${numPages ? ` of ${numPages}` : ""}`}
                canvasRef={canvasRef}
                onLoaded={onLoaded}
                onStatusChange={onStatusChange}
              />
              {snipping && (
                <CatalogSnipLayer
                  canvasRef={canvasRef}
                  caption={provenance}
                  whatsAppUrl={whatsAppUrl}
                  onExit={() => {
                    setSnipping(false);
                    announce("Snipping tool closed.");
                  }}
                  onAnnounce={announce}
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-10 text-center md:p-14">
                <FileText className="mx-auto mb-6 h-14 w-14 text-[#c8a96e] opacity-60" />
                <h2 className="mb-4 font-display text-2xl uppercase tracking-widest text-[var(--text-primary)] md:text-3xl">
                  Not yet available
                </h2>
                <p className="mb-8 font-body text-sm leading-relaxed text-[var(--text-secondary)]">
                  {external
                    ? `${brand.name} publishes its catalog on the manufacturer's own site.`
                    : `We have not received the current ${brand.name} catalog yet. Message a specialist and we will send it to you directly.`}
                </p>
                <a
                  href={
                    external ||
                    buildWhatsAppUrl(
                      `Hi Hardware Collection, could you send me the ${brand.name} catalog?`
                    )
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#e5c487] px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-[#131314] transition-colors hover:bg-[#8b1a42] hover:text-white hc-focus"
                >
                  {external ? "Visit manufacturer site" : "Request this catalog"}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Left rail: leaving, and moving through the document ───────── */}
      <Rail side="left" label="Catalog navigation">
        <RailButton
          side="left"
          icon={<X className="h-5 w-5" />}
          label="Close catalog"
          hint="Esc"
          onClick={onClose}
        />
        {hasCatalogs && (
          <>
            <RailDivider />
            {catalogs.length > 1 && (
              <RailButton
                side="left"
                icon={<Layers className="h-5 w-5" />}
                label={`All catalogs (${catalogs.length})`}
                pressed={panel === "catalogs"}
                onClick={() => setPanel((p) => (p === "catalogs" ? "none" : "catalogs"))}
              />
            )}
            <RailButton
              side="left"
              icon={<ChevronUp className="h-5 w-5" />}
              label="Previous page"
              disabled={page <= 1 || !ready}
              onClick={() => step(-1)}
            />
            <RailReadout label={`Page ${page} of ${numPages || "unknown"}`}>
              <span className="block text-[var(--text-primary)]">{ready ? page : "–"}</span>
              <span className="block text-[#998f81]">{numPages || "–"}</span>
            </RailReadout>
            <RailButton
              side="left"
              icon={<ChevronDown className="h-5 w-5" />}
              label="Next page"
              disabled={page >= numPages || !ready}
              onClick={() => step(1)}
            />
            <RailButton
              side="left"
              icon={<Hash className="h-5 w-5" />}
              label="Jump to page"
              pressed={panel === "jump"}
              disabled={!ready}
              onClick={() => setPanel((p) => (p === "jump" ? "none" : "jump"))}
            />
          </>
        )}
      </Rail>

      {/* ── Right rail: what you can do to the page in front of you ────── */}
      <Rail side="right" label="Catalog tools">
        {hasCatalogs && (
          <>
            <RailButton
              side="right"
              icon={<ZoomIn className="h-5 w-5" />}
              label="Zoom in"
              hint="+"
              disabled={zoom >= MAX_ZOOM || !ready}
              onClick={() => zoomBy(0.25)}
            />
            <RailReadout label={`Zoom ${Math.round(zoom * 100)} percent`}>
              {Math.round(zoom * 100)}%
            </RailReadout>
            <RailButton
              side="right"
              icon={<ZoomOut className="h-5 w-5" />}
              label="Zoom out"
              hint="−"
              disabled={zoom <= MIN_ZOOM || !ready}
              onClick={() => zoomBy(-0.25)}
            />
            <RailButton
              side="right"
              icon={<Scan className="h-5 w-5" />}
              label={fit === "width" ? "Fit whole page" : "Fit to width"}
              hint="W"
              pressed={fit === "page"}
              disabled={!ready}
              onClick={() => setFit((f) => (f === "width" ? "page" : "width"))}
            />
            <RailButton
              side="right"
              icon={<RotateCw className="h-5 w-5" />}
              label="Rotate page"
              hint="R"
              disabled={!ready}
              onClick={() => setRotation((deg) => (deg + 90) % 360)}
            />
            <RailDivider />
            <RailButton
              side="right"
              icon={<Crop className="h-5 w-5" />}
              label="Mark an area to send"
              hint="S"
              pressed={snipping}
              disabled={!ready}
              onClick={() => setSnipping((s) => !s)}
            />
          </>
        )}
        <RailButton
          side="right"
          tone="accent"
          icon={<MessageCircle className="h-5 w-5" />}
          label="WhatsApp a specialist"
          onClick={() => window.open(whatsAppUrl, "_blank", "noopener,noreferrer")}
        />
        <RailDivider />
        <RailButton
          side="right"
          icon={fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          label={fullscreen ? "Exit full screen" : "Full screen"}
          hint="F"
          pressed={fullscreen}
          onClick={toggleFullscreen}
        />
        <RailButton
          side="right"
          icon={<Keyboard className="h-5 w-5" />}
          label="Keyboard shortcuts"
          hint="?"
          pressed={panel === "help"}
          onClick={() => setPanel((p) => (p === "help" ? "none" : "help"))}
        />
      </Rail>

      {/* ── Panels opened from the rails ───────────────────────────────── */}
      {panel === "catalogs" && (
        <nav
          aria-label={`${brand.name} catalogs`}
          className="absolute left-16 top-1/2 z-50 max-h-[70dvh] w-72 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-3 shadow-[0_24px_60px_-24px_rgba(26,16,23,0.7)] md:left-24"
        >
          <p className="px-2 pb-2 font-body text-[10px] uppercase tracking-[0.18em] text-[#998f81]">
            {catalogs.length} catalogs
          </p>
          <ul className="flex flex-col gap-1">
            {catalogs.map((entry, i) => {
              const isActive = i === active;
              const meta = catalogMeta(entry);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => selectCatalog(i)}
                    aria-current={isActive ? "true" : undefined}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors duration-150 hc-focus ${
                      isActive
                        ? "border-[var(--accent)]/60 bg-[var(--surface-elevated)]"
                        : "border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--surface-elevated)]/60"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <FileText
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isActive ? "text-[var(--accent)]" : "text-[#998f81]"
                        }`}
                      />
                      <span className="min-w-0">
                        <span
                          className={`block font-body text-sm leading-snug ${
                            isActive
                              ? "text-[var(--text-primary)]"
                              : "text-[var(--text-secondary)]"
                          }`}
                        >
                          {catalogLabel(entry, brand.name, i)}
                        </span>
                        {meta && (
                          <span className="mt-1 block font-body text-[10px] uppercase tracking-wider text-[#998f81]">
                            {meta}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {panel === "jump" && (
        <form
          aria-label="Jump to page"
          onSubmit={(e) => {
            e.preventDefault();
            commitPageInput();
          }}
          className="absolute left-16 top-1/2 z-50 flex -translate-y-1/2 items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 shadow-[0_24px_60px_-24px_rgba(26,16,23,0.7)] md:left-24"
        >
          <label className="font-body text-[10px] uppercase tracking-wider text-[#998f81]">
            <span className="mb-1 block">Page number</span>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              // Enter is handled here rather than left to implicit submission,
              // which the number input does not reliably trigger.
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitPageInput();
                }
              }}
              onFocus={(e) => e.currentTarget.select()}
              autoFocus
              className="w-24 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-body text-sm tabular-nums text-[var(--text-primary)] hc-focus"
            />
          </label>
          <button
            type="submit"
            className="bg-[#e5c487] px-4 py-2.5 font-body text-[10px] font-bold uppercase tracking-wider text-[#131314] transition-colors hover:bg-[#8b1a42] hover:text-white hc-focus"
          >
            Go
          </button>
        </form>
      )}

      {panel === "help" && (
        <div
          role="dialog"
          aria-label="Keyboard shortcuts"
          className="absolute right-16 top-1/2 z-50 w-80 max-w-[calc(100vw-8rem)] -translate-y-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 shadow-[0_24px_60px_-24px_rgba(26,16,23,0.7)] md:right-24"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xs uppercase tracking-widest text-[var(--text-primary)]">
              Shortcuts
            </h2>
            <button
              type="button"
              onClick={() => setPanel("none")}
              aria-label="Close shortcuts"
              className="rounded-lg p-1 text-[#998f81] transition-colors hover:text-[var(--text-primary)] hc-focus"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <dl className="space-y-2">
            {SHORTCUTS.map(([keys, description]) => (
              <div key={keys} className="flex items-baseline justify-between gap-4">
                <dt className="shrink-0 font-body text-[11px] tabular-nums text-[var(--text-primary)]">
                  {keys}
                </dt>
                <dd className="text-right font-body text-[11px] text-[var(--text-secondary)]">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </motion.div>
  );
}
