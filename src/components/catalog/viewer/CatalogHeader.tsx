"use client";

import React from "react";
import { shortCatalogueTitle } from "@/lib/catalog/messages";
import { ArrowLeft, Info, Maximize2, MoreHorizontal, Shrink, X } from "lucide-react";

/**
 * Catalogue identity and secondary navigation.
 *
 * Scope is the organising rule: this bar acts on the *viewer* — fullscreen,
 * information, close. Everything that acts on the *document* (pages, find,
 * zoom, enquire, select) lives in the bottom strip. Splitting by scope is what
 * removed the duplication that had one function answering to four names.
 *
 * Both clusters fade while the customer reads; the catalogue keeps the viewport.
 */

interface CatalogHeaderProps {
  brand: string;
  title: string;
  visible: boolean;
  menuOpen: boolean;
  fullscreen: boolean;
  onBack: () => void;
  onToggleMenu: () => void;
  onToggleFullscreen: () => void;
  onOpenInfo: () => void;
}

const menuItem =
  "flex w-full min-h-11 items-center gap-3 rounded px-3 font-body text-sm text-[var(--v-text-dim)] hover:bg-black/5 hover:text-[var(--v-text)] hc-focus";

/** A labelled tool in the desktop cluster. */
function Tool({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="v-press flex min-h-11 items-center gap-2 rounded-md px-3 font-body text-[11px] text-[var(--v-text-dim)] hover:bg-black/5 hover:text-[var(--v-text)] hc-focus"
    >
      {icon}
      {label}
    </button>
  );
}

export default function CatalogHeader({
  brand,
  title,
  visible,
  menuOpen,
  fullscreen,
  onBack,
  onToggleMenu,
  onToggleFullscreen,
  onOpenInfo,
}: CatalogHeaderProps) {
  const chrome = `transition-opacity duration-300 ${
    visible ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  return (
    <>
      <div
        className={`absolute left-3 top-3 z-40 flex max-w-[55%] items-center gap-1 rounded-md border border-[var(--v-line)] bg-[var(--v-chrome)] pr-4 backdrop-blur-md md:left-5 md:top-5 ${chrome}`}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Close catalogue and go back"
          className="v-press flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[var(--v-text-faint)] hover:text-[var(--v-text)] hc-focus"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="min-w-0 truncate font-display text-[11px] uppercase tracking-[0.18em] text-[var(--v-text)] md:text-xs">
          <span className="text-[var(--v-accent-fg)]">{brand}</span>
          {/* The brand is already shown, so the title drops it: "Häfele ·
              Sliding Systems", not "Häfele · Häfele Sliding Systems". Phones
              get the brand alone. */}
          <span className="hidden text-[var(--v-text-faint)] sm:inline"> · </span>
          <span className="hidden text-[var(--v-text)] sm:inline">
            {shortCatalogueTitle(brand, title)}
          </span>
        </span>
      </div>

      <div
        className={`absolute right-3 top-3 z-40 flex items-center gap-0.5 rounded-md border border-[var(--v-line)] bg-[var(--v-chrome)] px-1 backdrop-blur-md md:right-5 md:top-5 ${chrome}`}
      >
        <div className="hidden items-center gap-0.5 lg:flex">
          <Tool
            icon={
              fullscreen ? <Shrink className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />
            }
            label={fullscreen ? "Exit" : "Fullscreen"}
            onClick={onToggleFullscreen}
          />
          <Tool icon={<Info className="h-4 w-4" />} label="Info" onClick={onOpenInfo} />
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-[var(--v-line)]" />
          <button
            type="button"
            onClick={onBack}
            aria-label="Close catalogue"
            className="v-press flex h-10 w-10 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] hc-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleMenu}
          aria-label="More options"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={`v-press flex h-11 w-11 items-center justify-center rounded-md hc-focus lg:hidden ${
            menuOpen ? "text-[var(--v-accent-fg)]" : "text-[var(--v-text-dim)] hover:text-[var(--v-text)]"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div
          role="menu"
          aria-label="Catalogue options"
          className="absolute right-3 top-16 z-50 w-60 rounded-2xl border border-[var(--v-line)] bg-[var(--v-panel)] p-2 shadow-xl lg:hidden"
        >
          <button type="button" role="menuitem" onClick={onToggleFullscreen} className={menuItem}>
            {fullscreen ? (
              <Shrink className="h-4 w-4 text-[var(--v-accent-fg)]" />
            ) : (
              <Maximize2 className="h-4 w-4 text-[var(--v-accent-fg)]" />
            )}
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <button type="button" role="menuitem" onClick={onOpenInfo} className={menuItem}>
            <Info className="h-4 w-4 text-[var(--v-accent-fg)]" />
            Catalogue information
          </button>
        </div>
      )}
    </>
  );
}
