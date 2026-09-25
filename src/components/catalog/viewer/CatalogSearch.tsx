"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Search, X } from "lucide-react";

/**
 * Text search across the catalogue.
 *
 * Page text is pulled one page at a time and cached, so a search is
 * incremental rather than a single long freeze, and a repeat search over the
 * same catalogue is instant. Only available when the PDF actually carries a
 * text layer — scanned catalogues fall back to thumbnails and page jump.
 */

const MAX_RESULTS = 60;
const SNIPPET = 90;

interface Match {
  page: number;
  snippet: string;
}

interface CatalogSearchProps {
  doc: PDFDocumentProxy | null;
  pages: number;
  onSelect: (page: number) => void;
  onClose: () => void;
  onSearched: (query: string, results: number) => void;
}

export default function CatalogSearch({
  doc,
  pages,
  onSelect,
  onClose,
  onSearched,
}: CatalogSearchProps) {
  const cache = useRef(new Map<number, string>());
  const runId = useRef(0);

  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [scanned, setScanned] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(
    () => () => {
      runId.current += 1;
    },
    []
  );

  const textFor = useCallback(
    async (page: number): Promise<string> => {
      const hit = cache.current.get(page);
      if (hit !== undefined) return hit;
      if (!doc) return "";
      try {
        const pdfPage = await doc.getPage(page);
        const content = await pdfPage.getTextContent();
        const text = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        cache.current.set(page, text);
        return text;
      } catch {
        // Closing the sheet aborts the range reads this depends on, and one
        // unreadable page should not abandon the rest of the search. Not
        // cached, so a later search retries it.
        return "";
      }
    },
    [doc]
  );

  const run = useCallback(async () => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2 || !doc) return;

    const id = ++runId.current;
    setSearching(true);
    setSearched(true);
    setMatches([]);
    setScanned(0);

    const found: Match[] = [];
    for (let page = 1; page <= pages; page++) {
      if (runId.current !== id) return;
      const text = await textFor(page);
      const at = text.toLowerCase().indexOf(needle);
      if (at >= 0) {
        const start = Math.max(0, at - SNIPPET / 2);
        found.push({
          page,
          snippet: `${start > 0 ? "…" : ""}${text.slice(start, start + SNIPPET).trim()}…`,
        });
        setMatches([...found]);
      }
      setScanned(page);
      if (found.length >= MAX_RESULTS) break;
      // Yield so the page stays responsive while a long catalogue is scanned.
      if (page % 4 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (runId.current !== id) return;
    setSearching(false);
    onSearched(query.trim(), found.length);
  }, [query, doc, pages, textFor, onSearched]);

  /** Never let a scan reject into an unhandled rejection. */
  const start = useCallback(() => {
    void run().catch(() => setSearching(false));
  }, [run]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-[#0E0C0C]/60 backdrop-blur-sm md:flex-row md:justify-start">
      <button type="button" aria-label="Close search" onClick={onClose} className="flex-1 cursor-default" />
      <aside
        aria-label="Search catalogue"
        className="flex max-h-[75%] flex-col border-t border-white/10 bg-[#171414] md:max-h-none md:w-80 md:border-l md:border-t-0"
      >
        <div className="flex shrink-0 items-center gap-2 px-3 py-3">
          <div className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-white/12 bg-[#0E0C0C] px-3">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <input
              type="search"
              value={query}
              autoFocus
              placeholder="Search this catalogue"
              aria-label="Search this catalogue"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                  start();
                }
              }}
              className="min-w-0 flex-1 bg-transparent py-2 font-body text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white hc-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
          {searching && (
            <p aria-live="polite" className="px-1 py-2 font-body text-xs text-white/45">
              Searching page {scanned} of {pages}…
            </p>
          )}
          {!searching && searched && matches.length === 0 && (
            <p className="px-1 py-2 font-body text-xs text-white/45">
              No matches. This catalogue may be a scan without searchable text — try Pages instead.
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {matches.map((match) => (
              <li key={match.page}>
                <button
                  type="button"
                  onClick={() => onSelect(match.page)}
                  className="w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/8 hc-focus"
                >
                  <span className="block font-body text-[10px] uppercase tracking-[0.14em] text-[#C8A96E]">
                    Page {match.page}
                  </span>
                  <span className="mt-1 block font-body text-xs leading-relaxed text-white/65">
                    {match.snippet}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
