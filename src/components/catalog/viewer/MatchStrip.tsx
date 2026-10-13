"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

interface MatchStripProps {
  /** What the visitor came looking for, e.g. the /collections category name. */
  query: string;
  /** Matching pages, ascending. */
  pages: readonly number[];
  current: number;
  visible: boolean;
  onGo: (page: number) => void;
  onSearch: () => void;
  onDismiss: () => void;
}

/**
 * The pages of this catalogue that matched the category the visitor arrived
 * from, so the related products are one tap away instead of a search away.
 * A match is a page that mentions the category, not a single product: a page
 * may show several.
 */
export default function MatchStrip({ query, pages, current, visible, onGo, onSearch, onDismiss }: MatchStripProps) {
  if (pages.length === 0) return null;
  const index = pages.indexOf(current);
  const previous = [...pages].reverse().find((p) => p < current);
  const next = pages.find((p) => p > current);

  return (
    <nav
      aria-label={`Pages matching ${query || "your search"}`}
      className={`absolute left-1/2 top-[68px] z-40 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-1 rounded-md border border-[var(--v-line)] bg-[var(--v-chrome)] px-1 py-1 backdrop-blur-md transition-opacity duration-300 md:top-[80px] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => previous && onGo(previous)}
        disabled={previous === undefined}
        aria-label="Previous matching page"
        className="v-press flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] disabled:opacity-30 hc-focus"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="hidden shrink-0 pl-1 pr-2 font-body text-[10px] uppercase tracking-[0.14em] text-[var(--v-text-dim)] sm:inline">
        {query ? `${query}:` : "Matches:"}
      </span>

      <ol className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onGo(p)}
              aria-current={p === current ? "page" : undefined}
              ref={p === current ? (el) => el?.scrollIntoView({ block: "nearest", inline: "nearest" }) : undefined}
              aria-label={`Page ${p}`}
              className={`v-press flex h-9 min-w-9 items-center justify-center rounded-md px-2 font-body text-[11px] tabular-nums hc-focus ${
                p === current
                  ? "bg-[var(--v-text)] text-[var(--v-surface)]"
                  : "text-[var(--v-text)] hover:bg-black/5"
              }`}
            >
              {p}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => next && onGo(next)}
        disabled={next === undefined}
        aria-label="Next matching page"
        className="v-press flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] disabled:opacity-30 hc-focus"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <span aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-[var(--v-line)]" />
      <button
        type="button"
        onClick={onSearch}
        aria-label={`Search this catalogue for ${query || "more"}`}
        className="v-press flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] hc-focus"
      >
        <Search className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Hide matching pages"
        className="v-press flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] hc-focus"
      >
        <X className="h-4 w-4" />
      </button>
      <span className="sr-only" aria-live="polite">
        {index >= 0 ? `Match ${index + 1} of ${pages.length}` : ""}
      </span>
    </nav>
  );
}
