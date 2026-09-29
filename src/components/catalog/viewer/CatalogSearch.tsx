"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * Text search across the catalogue.
 *
 * This version uses a pre-generated lightweight JSON index created at build time.
 * It provides instant, local searching with synonym support and basic ranking,
 * removing the need for slow, heavy client-side PDF parsing.
 */

const MAX_RESULTS = 60;
const SNIPPET = 90;

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

const SYNONYMS: Record<string, string[]> = {
  handles: ["handle", "pull", "pulls", "knob", "knobs"],
  wardrobe: ["wardrobe", "closet", "sliding", "wardrobe system"],
  kitchen: ["kitchen", "cabinet", "drawer", "hinge", "organizer"],
};

interface Match {
  page: number;
  snippet: string;
  score: number;
}

interface IndexData {
  catalog: string;
  brand: string;
  title: string;
  pages: { page: number; text: string }[];
}

interface CatalogSearchProps {
  catalogId: string;
  onSelect: (page: number) => void;
  onClose: () => void;
  onSearched: (query: string, results: number) => void;
}

export default function CatalogSearch({
  catalogId,
  onSelect,
  onClose,
  onSearched,
}: CatalogSearchProps) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [loadError, setLoadError] = useState(false);

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

  useEffect(() => {
    let mounted = true;
    const fetchIndex = async () => {
      try {
        const res = await fetch(`/search-indexes/${catalogId}.json`);
        if (!res.ok) {
          throw new Error("Index not found");
        }
        const data = await res.json();
        if (mounted) {
          setIndexData(data);
          setLoadError(false);
        }
      } catch {
        if (mounted) {
          setLoadError(true);
        }
      }
    };
    void fetchIndex();
    return () => {
      mounted = false;
    };
  }, [catalogId]);

  const scoreMatch = (pageText: string, queryTokens: string[]): { score: number; snippet: string } | null => {
    let score = 0;
    let firstMatchIndex = -1;

    for (const token of queryTokens) {
      if (!token) continue;
      
      const tokenSynonyms = SYNONYMS[token] || [];
      const allTokens = [token, ...tokenSynonyms];

      let tokenMatched = false;
      for (const t of allTokens) {
        const idx = pageText.indexOf(t);
        if (idx !== -1) {
          if (firstMatchIndex === -1 || idx < firstMatchIndex) {
            firstMatchIndex = idx;
          }
          if (t === token) score += 30; // Keyword match
          else score += 20; // Synonym match
          tokenMatched = true;
          break; // Stop checking synonyms for this token if one matched
        }
      }
      
      if (!tokenMatched) {
        // Partial match
        if (pageText.includes(token)) {
           score += 10;
        }
      }
    }

    if (score === 0) return null;

    // Build snippet
    const start = Math.max(0, firstMatchIndex - SNIPPET / 2);
    const snippet = `${start > 0 ? "…" : ""}${pageText.slice(start, start + SNIPPET).trim()}…`;

    return { score, snippet };
  };

  const run = useCallback(
    (term?: string) => {
      const searched_ = (term ?? query).trim();
      const needle = searched_.toLowerCase();
      
      if (needle.length < 2 || !indexData) return;

      setSearching(true);
      setSearched(true);
      setMatches([]);

      const tokens = needle.split(/\s+/);
      const found: Match[] = [];

      // Exact phrase match check + token scoring
      for (const page of indexData.pages) {
        let pageScore = 0;
        let snippetStr = "";

        const exactIdx = page.text.indexOf(needle);
        if (exactIdx !== -1) {
          pageScore += 60; // Exact phrase match
          const start = Math.max(0, exactIdx - SNIPPET / 2);
          snippetStr = `${start > 0 ? "…" : ""}${page.text.slice(start, start + SNIPPET).trim()}…`;
        }

        const tokenResult = scoreMatch(page.text, tokens);
        if (tokenResult) {
          pageScore += tokenResult.score;
          if (!snippetStr) snippetStr = tokenResult.snippet;
        }

        if (pageScore > 0) {
          found.push({
            page: page.page,
            snippet: snippetStr,
            score: pageScore,
          });
        }
      }

      // Sort by score descending
      found.sort((a, b) => b.score - a.score);
      const topResults = found.slice(0, MAX_RESULTS);

      setMatches(topResults);
      setSearching(false);
      onSearched(searched_, topResults.length);
    },
    [query, indexData, onSearched]
  );

  const start = useCallback(
    (term?: string) => {
      run(term);
    },
    [run]
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
          {!searching && searched && matches.length === 0 && (
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
