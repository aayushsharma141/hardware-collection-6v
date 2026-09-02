"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, ShieldCheck, FileText } from "lucide-react";
import { motion } from "motion/react";
import { buildWhatsAppUrl } from "@/lib/config";
import { lockScroll, unlockScroll } from "@/lib/browser/scrollLock";
import dynamic from "next/dynamic";
import { Brand, BrandCatalog, getSlugString } from "@/types/catalog";

/**
 * pdf.js is ~1MB and touches browser-only APIs, so it stays out of this
 * page's import graph and off the server render entirely.
 */
const CatalogPdfViewer = dynamic(() => import("./CatalogPdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex flex-col items-center justify-center text-[#998f81]">
      <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[#e5c487] rounded-full animate-spin mb-4" />
      <span className="font-body text-xs uppercase tracking-widest">Opening catalog…</span>
    </div>
  ),
});

interface CatalogViewerModalProps {
  brand: Brand;
  onClose: () => void;
}

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

export default function CatalogViewerModal({ brand, onClose }: CatalogViewerModalProps) {
  const catalogs = useMemo<BrandCatalog[]>(() => brand.officialCatalogs ?? [], [brand]);
  const slug = getSlugString(brand.slug);
  const [active, setActive] = useState(0);

  const hasCatalogs = catalogs.length > 0 && Boolean(slug);
  const external = !hasCatalogs ? brand.officialCatalogUrl : null;

  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockDrag = (e: DragEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Ctrl/Cmd+P and Ctrl/Cmd+S would otherwise offer the rendered page.
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "s")) {
        e.preventDefault();
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
  }, [onClose]);

  const selector = catalogs.length > 1 && (
    <nav
      aria-label={`${brand.name} catalogs`}
      className="shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--surface-raised)] md:w-72 md:overflow-y-auto"
    >
      <p className="hidden md:block font-body text-[10px] uppercase tracking-[0.18em] text-[#998f81] px-5 pt-5 pb-3">
        {catalogs.length} catalogs
      </p>
      <ul className="flex md:flex-col gap-2 md:gap-1 p-3 md:px-3 md:pb-4 md:pt-0 overflow-x-auto md:overflow-x-visible">
        {catalogs.map((entry, i) => {
          const isActive = i === active;
          const meta = catalogMeta(entry);
          return (
            <li key={i} className="shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "true" : undefined}
                className={`w-full text-left rounded-lg px-4 py-3 border transition-colors duration-150 hc-focus ${
                  isActive
                    ? "bg-[var(--surface-elevated)] border-[var(--accent)]/60"
                    : "bg-transparent border-transparent hover:bg-[var(--surface-elevated)]/60 hover:border-[var(--border)]"
                }`}
              >
                <span className="flex items-start gap-3">
                  <FileText
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isActive ? "text-[var(--accent)]" : "text-[#998f81]"
                    }`}
                  />
                  <span className="min-w-0">
                    <span
                      className={`block font-body text-sm leading-snug whitespace-nowrap md:whitespace-normal ${
                        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {catalogLabel(entry, brand.name, i)}
                    </span>
                    {meta && (
                      <span className="block font-body text-[10px] uppercase tracking-wider text-[#998f81] mt-1">
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
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] bg-[#fdf8f0] text-[var(--text-primary)] flex flex-col select-none"
    >
      <header className="h-16 bg-[var(--surface-raised)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button
            onClick={onClose}
            aria-label="Close catalog"
            className="text-[#998f81] hover:text-[var(--text-primary)] transition-colors p-2 -ml-2 hc-focus"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-px h-6 bg-[var(--border)]" />
          <span
            id="modal-title"
            className="font-display tracking-widest uppercase text-xs md:text-sm text-[var(--text-primary)] truncate"
          >
            {hasCatalogs
              ? catalogLabel(catalogs[active], brand.name, active)
              : `${brand.name} Official Catalog`}
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden lg:inline-flex items-center gap-2 text-[#998f81]">
            <ShieldCheck className="w-4 h-4 text-[#c8a96e]" />
            <span className="font-body text-[10px] uppercase tracking-wider">View only</span>
          </span>
          <a
            href={buildWhatsAppUrl(
              `Hi Hardware Collection, I am viewing the ${brand.name} catalog and need a specific product.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e5c487] text-[#131314] px-3 md:px-4 py-2 font-body font-bold text-[10px] uppercase tracking-wider hover:bg-[#8b1a42] hover:text-white transition-colors hc-focus"
          >
            WhatsApp Specialist
          </a>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row relative">
        {/* Screenshot deterrent, kept out of the pointer path. */}
        <div
          className="absolute inset-0 z-20 pointer-events-none flex flex-wrap items-center justify-center opacity-[0.045] gap-20 p-10 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="font-display text-4xl -rotate-45 whitespace-nowrap">
              HARDWARE COLLECTION
            </span>
          ))}
        </div>

        {selector}

        <div className="flex-1 min-h-0 min-w-0">
          {hasCatalogs ? (
            <CatalogPdfViewer
              key={`${slug}-${active}`}
              src={`/api/catalog/${encodeURIComponent(slug)}/${active}`}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="bg-[var(--surface-raised)] border border-[var(--border)] p-10 md:p-14 text-center max-w-lg w-full rounded-xl">
                <FileText className="w-14 h-14 text-[#c8a96e] mx-auto mb-6 opacity-60" />
                <h2 className="font-display text-2xl md:text-3xl text-[var(--text-primary)] mb-4 uppercase tracking-widest">
                  Not yet available
                </h2>
                <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
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
                  className="inline-block bg-[#e5c487] text-[#131314] px-6 py-3 font-body text-xs font-bold uppercase tracking-wider hover:bg-[#8b1a42] hover:text-white transition-colors hc-focus"
                >
                  {external ? "Visit manufacturer site" : "Request this catalog"}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
