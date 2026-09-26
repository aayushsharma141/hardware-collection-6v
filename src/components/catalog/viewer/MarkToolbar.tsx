"use client";

import React from "react";
import { Check, Eraser, Highlighter, PenLine, Undo2, X } from "lucide-react";
import type { AnnotationTool } from "./types";

/**
 * Mark mode has exactly four tools and a Done.
 *
 * The customer is not editing a document — they are saying "this one" — so
 * there are no colours, shapes, text boxes or layers to choose between.
 */

interface MarkToolbarProps {
  tool: AnnotationTool;
  canUndo: boolean;
  onTool: (tool: AnnotationTool) => void;
  onUndo: () => void;
  onClear: () => void;
  onDone: () => void;
  onCancel: () => void;
}

function ToolButton({
  active,
  label,
  icon,
  onClick,
  disabled,
}: {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active === undefined ? undefined : active}
      className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-colors disabled:opacity-30 hc-focus ${
        active
          ? "bg-[#C8A96E] text-[#0E0C0C]"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      <span className="font-body text-[9px] uppercase tracking-[0.12em]">{label}</span>
    </button>
  );
}

export default function MarkToolbar({
  tool,
  canUndo,
  onTool,
  onUndo,
  onClear,
  onDone,
  onCancel,
}: MarkToolbarProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-3 md:top-5">
        <p className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-[#0E0C0C]/85 py-1.5 pl-5 pr-1.5 backdrop-blur-md">
          <span className="font-body text-[11px] uppercase tracking-[0.16em] text-white/80">
            Mark something to share
          </span>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel marking"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white hc-focus"
          >
            <X className="h-4 w-4" />
          </button>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-1 rounded-2xl border border-white/10 bg-[#0E0C0C]/90 p-1.5 backdrop-blur-md">
          <ToolButton
            active={tool === "pen"}
            label="Pen"
            icon={<PenLine className="h-5 w-5" />}
            onClick={() => onTool("pen")}
          />
          <ToolButton
            active={tool === "highlight"}
            label="Highlight"
            icon={<Highlighter className="h-5 w-5" />}
            onClick={() => onTool("highlight")}
          />
          <ToolButton
            label="Undo"
            icon={<Undo2 className="h-5 w-5" />}
            onClick={onUndo}
            disabled={!canUndo}
          />
          <ToolButton
            label="Clear"
            icon={<Eraser className="h-5 w-5" />}
            onClick={onClear}
            disabled={!canUndo}
          />
          <button
            type="button"
            onClick={onDone}
            className="ml-1 flex min-h-11 items-center gap-2 rounded-xl bg-[#C8A96E] px-4 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E0C0C] transition-colors hover:bg-[#d8bb84] hc-focus"
          >
            <Check className="h-4 w-4" />
            Done
          </button>
        </div>
      </div>
    </>
  );
}
