"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { PageHit } from "@/lib/catalog/search/findInCatalogue";

/**
 * Text search across the catalogue.
 *
 * Each search is a request to /api/catalog/<slug>/<n>/search, which ranks the
 * catalogue's pages on the server and returns page numbers and snippets. The
 * page text itself never reaches the browser: it includes price lists, and a
 * downloadable copy would undo the view-only viewer.
 */

/** The categories customers actually walk in asking for, as one-tap starters. */
const POPULAR = [
  "Handles",
  "Sliding systems",
  "Wardrobe",
  "Kitchen",
  "Drawer",
  "Hinges",
  "Locks",
  "Door hardware",
];

type SearchResult = { ok: true; matches: PageHit[] } | { ok: false; reason: "missing" | "busy" | "failed" };

/** `<slug>-<n>` -> the search route for that catalogue. */
function searchUrl(catalogId: string, term: string): string | null {
  const parts = /^(.+)-(\d+)$/.exec(catalogId);
  if (!parts) return null;
  return `/api/catalog/${encodeURIComponent(parts[1])}/${parts[2]}/search?q=${encodeURIComponent(term)}`;
}

async function searchCatalogue(catalogId: string, term: string): Promise<SearchResult> {
  const url = searchUrl(catalogId, term);
  if (!url) return { ok: false, reason: "missing" };
  try {
    const res = await fetch(url);
    if (res.status === 404) return { ok: false, reason: "missing" };
    if (res.status === 429) return { ok: false, reason: "busy" };
    if (!res.ok) return { ok: false, reason: "failed" };
    const data = (await res.json()) as { matches?: PageHit[] };
    return { ok: true, matches: data.matches ?? [] };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

interface CatalogSearchProps {
  catalogId: string;
  /** Run this search as soon as the index has loaded (e.g. the category the visitor came from). */
  initialQuery?: string;
  onSelect: (page: number) => void;
  onClose: () => void;
  onSearched: (query: string, results: number) => void;
}

export default function CatalogSearch({
  catalogId,
  initialQuery = "",
  onSelect,
  onClose,
  onSearched,
}: CatalogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [matches, setMatches] = useState<PageHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  // Only the newest search may update the list; an older, slower response is dropped.
  const latestRef = useRef(0);

  // Drag to resize state
  const asideRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!dragRef.current) return;
      e.preventDefault(); // Prevent scrolling while dragging
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

  // Read through refs so a parent re-render (new callback identity) does not refetch the index.
  const initialQueryRef = useRef(initialQuery);
  const onSearchedRef = useRef(onSearched);
  useEffect(() => {
    onSearchedRef.current = onSearched;
  }, [onSearched]);

  const run = useCallback(
    async (term: string) => {
      const searched_ = term.trim();
      if (searched_.length < 2) return;
      const request = ++latestRef.current;

      setSearching(true);
      setSearched(true);
      setBusy(false);
      setMatches([]);

      const result = await searchCatalogue(catalogId, searched_);
      if (request !== latestRef.current) return;

      setSearching(false);
      if (!result.ok) {
        if (result.reason === "busy") setBusy(true);
        else setLoadError(true);
        return;
      }
      setLoadError(false);
      setMatches(result.matches);
      onSearchedRef.current(searched_, result.matches.length);
    },
    [catalogId]
  );

  // A new catalogue starts clean (reset during render, as React recommends for
  // state derived from a prop change).
  const [shownFor, setShownFor] = useState(catalogId);
  if (shownFor !== catalogId) {
    setShownFor(catalogId);
    setMatches([]);
    setSearched(false);
    setLoadError(false);
    setBusy(false);
  }

  // The category the visitor came from is searched straight away. An empty
  // query still asks once, so a catalogue without an index says so before the
  // visitor types.
  useEffect(() => {
    latestRef.current++;
    const initial = initialQueryRef.current.trim();
    if (initial.length >= 2) {
      void run(initial);
      return;
    }
    const request = latestRef.current;
    void searchCatalogue(catalogId, "").then((result) => {
      if (request === latestRef.current && !result.ok && result.reason === "missing") setLoadError(true);
    });
  }, [catalogId, run]);

  const start = useCallback(
    (term?: string) => {
      void run(term ?? query);
    },
    [run, query]
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end md:flex-row md:justify-end pointer-events-none">
      <aside
        ref={asideRef}
        aria-label="Find in catalogue"
        className="pointer-events-auto flex flex-col border-t border-[var(--v-line)] bg-[var(--v-panel)] md:!h-full md:w-80 md:border-l md:border-t-0 shadow-2xl transition-[height] duration-0"
        style={{ height: height !== undefined ? height : "75%" }}
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

        <div className="flex shrink-0 items-center gap-2 px-3 pb-3 md:pt-3">
          <div className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-[var(--v-line-strong)] bg-[var(--v-panel)] px-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--v-text-faint)]" />
            <input
              type="search"
              value={query}
              autoFocus
              placeholder="Search products, keywords…"
              aria-label="Search products or keywords in this catalogue"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                  start();
                }
              }}
              className="min-w-0 flex-1 bg-transparent py-2 font-body text-sm text-[var(--v-text)] outline-none placeholder:text-[var(--v-text-faint)]"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="v-press flex h-11 w-11 shrink-0 items-center justify-center rounded text-[var(--v-text-faint)] hover:text-[var(--v-text)] hc-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4">
          {loadError && (
             <div className="px-1 py-2 font-body text-xs text-[var(--v-text-dim)] text-red-500">
               Search index is unavailable for this catalog.
             </div>
          )}
          {busy && (
            <p aria-live="polite" className="px-1 py-2 font-body text-xs text-[var(--v-text-dim)]">
              Too many searches in a short time. Please try again in a minute.
            </p>
          )}
          {!searched && !searching && !loadError && (
            <div className="px-1 pb-2">
              <p className="pb-2 font-body text-[10px] text-[var(--v-text-dim)]">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      start(term);
                    }}
                    className="v-press min-h-9 rounded-md border border-[var(--v-line-strong)] px-3 font-body text-xs text-[var(--v-text-dim)] hover:border-[var(--v-text)] hover:text-[var(--v-text)] hc-focus"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          {searching && (
            <p aria-live="polite" className="px-1 py-2 font-body text-xs text-[var(--v-text-dim)]">
              Searching…
            </p>
          )}
          {!searching && searched && !busy && !loadError && matches.length === 0 && (
            <p className="px-1 py-2 font-body text-xs text-[var(--v-text-dim)]">
              No matches. Try a different keyword or explore the Pages index.
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {matches.map((match) => (
              <li key={match.page}>
                <button
                  type="button"
                  onClick={() => onSelect(match.page)}
                  className="v-press w-full rounded px-3 py-2.5 text-left hover:bg-black/5 hc-focus"
                >
                  <span className="block font-body text-[10px] font-semibold text-[var(--v-accent-fg)]">
                    Page {match.page}
                  </span>
                  <span className="mt-1 block font-body text-xs leading-relaxed text-[var(--v-text-dim)]">
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
