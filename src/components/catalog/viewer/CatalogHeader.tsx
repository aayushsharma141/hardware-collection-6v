"use client";

import React from "react";
import { shortCatalogueTitle } from "@/lib/catalog/messages";
import { ArrowLeft, Info, Maximize2, MoreHorizontal, Rows3, Search, Shrink } from "lucide-react";

/**
 * Catalogue identity and secondary navigation.
 *
 * Deliberately not a full-width bar: two floating clusters that fade out while
 * the customer is reading, so the page keeps the viewport. Everything that is
 * not needed on every page lives behind the "More" menu.
 */

interface CatalogHeaderProps {
  brand: string;
  title: string;
  visible: boolean;
  menuOpen: boolean;
  fullscreen: boolean;
  searchable: boolean;
  onBack: () => void;
  onToggleMenu: () => void;
  onOpenPages: () => void;
  onOpenSearch: () => void;
  onToggleFullscreen: () => void;
  onOpenInfo: () => void;
}

const menuItem =
  "flex w-full min-h-11 items-center gap-3 rounded-lg px-3 font-body text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white hc-focus";

export default function CatalogHeader({
  brand,
  title,
  visible,
  menuOpen,
  fullscreen,
  searchable,
  onBack,
  onToggleMenu,
  onOpenPages,
  onOpenSearch,
  onToggleFullscreen,
  onOpenInfo,
}: CatalogHeaderProps) {
  const chrome = `transition-opacity duration-300 ${
    visible ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  return (
    <>
      <div
        className={`absolute left-3 top-3 z-40 flex max-w-[70%] items-center gap-1 rounded-full border border-white/10 bg-[#0E0C0C]/80 pr-4 backdrop-blur-md md:left-5 md:top-5 ${chrome}`}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Close catalogue and go back"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/75 transition-colors hover:text-white hc-focus"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="min-w-0 truncate font-display text-[11px] uppercase tracking-[0.18em] text-white md:text-xs">
          <span className="text-[#C8A96E]">{brand}</span>
          {/* The brand is already shown, so the title drops it: "Häfele ·
              Sliding Systems", not "Häfele · Häfele Sliding Systems". Phones
              get the brand alone. */}
          <span className="hidden text-white/35 sm:inline"> · </span>
          <span className="hidden text-white/80 sm:inline">
            {shortCatalogueTitle(brand, title)}
          </span>
        </span>
      </div>

      <div
        className={`absolute right-3 top-3 z-40 flex items-center gap-1 rounded-full border border-white/10 bg-[#0E0C0C]/80 backdrop-blur-md md:right-5 md:top-5 ${chrome}`}
      >
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label="More options"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors hc-focus ${
            menuOpen ? "text-[#C8A96E]" : "text-white/75 hover:text-white"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div
          role="menu"
          aria-label="Catalogue options"
          className="absolute right-3 top-16 z-50 w-60 rounded-2xl border border-white/10 bg-[#171414] p-2 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)] md:right-5 md:top-20"
        >
          <button type="button" role="menuitem" onClick={onOpenPages} className={menuItem}>
            <Rows3 className="h-4 w-4 text-[#C8A96E]" />
            Pages
          </button>
          {searchable && (
            <button type="button" role="menuitem" onClick={onOpenSearch} className={menuItem}>
              <Search className="h-4 w-4 text-[#C8A96E]" />
              Search
            </button>
          )}
          <button type="button" role="menuitem" onClick={onToggleFullscreen} className={menuItem}>
            {fullscreen ? (
              <Shrink className="h-4 w-4 text-[#C8A96E]" />
            ) : (
              <Maximize2 className="h-4 w-4 text-[#C8A96E]" />
            )}
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <button type="button" role="menuitem" onClick={onOpenInfo} className={menuItem}>
            <Info className="h-4 w-4 text-[#C8A96E]" />
            Catalogue information
          </button>
        </div>
      )}
    </>
  );
}
