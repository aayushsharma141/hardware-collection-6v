"use client";

import React from "react";
import { FileText, X } from "lucide-react";
import type { CatalogueDocument } from "@/types/catalog";

/**
 * "Catalogue information" from the More menu.
 *
 * Also where a brand's other catalogues are switched, so multi-catalogue
 * brands need no extra chrome in the reading view.
 */

interface CatalogueInfoProps {
  brand: string;
  catalogues: CatalogueDocument[];
  active: number;
  pages: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  onEnquire: () => void;
  label: (entry: CatalogueDocument, index: number) => string;
}

function formatSize(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--v-line)] py-2.5">
      <dt className="font-body text-[10px] text-[var(--v-text-faint)]">{term}</dt>
      <dd className="text-right font-body text-xs text-[var(--v-text-dim)]">{value}</dd>
    </div>
  );
}

export default function CatalogueInfo({
  brand,
  catalogues,
  active,
  pages,
  onSelect,
  onClose,
  onEnquire,
  label,
}: CatalogueInfoProps) {
  const entry = catalogues[active];
  const size = formatSize(entry?.size);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-[var(--v-chrome)] backdrop-blur-sm md:flex-row md:justify-end">
      <button type="button" aria-label="Close information" onClick={onClose} className="flex-1 cursor-default" />
      <aside
        aria-label="Catalogue information"
        className="flex max-h-[80%] flex-col border-t border-[var(--v-line)] bg-[var(--v-panel)] md:max-h-none md:w-80 md:border-l md:border-t-0 shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between px-4 py-3">
          <h2 className="font-body text-[11px] uppercase tracking-[0.18em] text-[var(--v-text-dim)]">
            Catalogue information
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close information"
            className="v-press flex h-11 w-11 items-center justify-center rounded text-[var(--v-text-faint)] hover:text-[var(--v-text)] hc-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-5">
          <dl>
            <Row term="Brand" value={brand} />
            {entry && <Row term="Catalogue" value={label(entry, active)} />}
            {entry?.version && <Row term="Version" value={entry.version} />}
            {entry?.releaseDate && <Row term="Released" value={entry.releaseDate.slice(0, 10)} />}
            {pages > 0 && <Row term="Pages" value={String(pages)} />}
            {size && <Row term="Size" value={size} />}
            <Row term="Access" value="View only — reference material" />
          </dl>

          {catalogues.length > 1 && (
            <>
              <h3 className="mt-6 font-body text-[10px] text-[var(--v-text-dim)]">
                Other catalogues from {brand}
              </h3>
              <ul className="mt-2 flex flex-col gap-1">
                {catalogues.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => onSelect(i)}
                      aria-current={i === active ? "true" : undefined}
                      className={`v-press flex w-full min-h-11 items-center gap-3 rounded px-3 py-2 text-left hc-focus ${
                        i === active
                          ? "bg-[var(--v-accent-bg)] text-[var(--v-accent-fg)] font-semibold"
                          : "text-[var(--v-text-dim)] hover:bg-black/5 hover:text-[var(--v-text)]"
                      }`}
                    >
                      <FileText
                        className={`h-4 w-4 shrink-0 ${
                          i === active ? "text-[var(--v-accent-fg)]" : "text-[var(--v-text-faint)]"
                        }`}
                      />
                      <span className="font-body text-xs leading-snug">{label(item, i)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            type="button"
            onClick={onEnquire}
            className="v-press mt-6 flex min-h-11 w-full items-center justify-center rounded border border-[var(--v-send)] font-body text-[11px] font-semibold text-[var(--v-send)] hover:bg-[var(--v-send)] hover:text-[var(--v-surface)] hc-focus"
          >
            Ask about this catalogue
          </button>
        </div>
      </aside>
    </div>
  );
}

