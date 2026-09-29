"use client";

import React from "react";
import { ArrowUpRight, Check, Circle, Eraser, MousePointer2, Square, Undo2, X } from "lucide-react";
import type { AnnotationTool } from "./types";

/**
 * Select mode has exactly four tools and a Done.
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
      className={`v-press flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded px-3 py-1.5 disabled:opacity-30 hc-focus ${
        active
          ? "bg-[var(--v-accent-bg)] text-[var(--v-accent-fg)] font-semibold"
          : "text-[var(--v-text-dim)] hover:bg-black/5 hover:text-[var(--v-text)]"
      }`}
    >
      {icon}
      <span className="font-body text-[9px]">{label}</span>
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
        <p className="pointer-events-auto flex items-center gap-3 rounded-md border border-[var(--v-line-strong)] bg-[var(--v-chrome)] py-1.5 pl-5 pr-1.5 backdrop-blur-md">
          <span className="font-body text-[11px] text-[var(--v-text)]">
            Select a product
          </span>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel selecting"
            className="v-press pointer-events-auto flex h-9 w-9 items-center justify-center rounded-md text-[var(--v-text-faint)] hover:bg-black/5 hover:text-[var(--v-text)] hc-focus"
          >
            <X className="h-4 w-4" />
          </button>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-1 rounded-2xl border border-[var(--v-line-strong)] bg-[var(--v-chrome)] p-1.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <ToolButton
            active={tool === "select"}
            label="Select"
            icon={<MousePointer2 className="h-5 w-5" />}
            onClick={() => onTool("select")}
          />
          <ToolButton
            active={tool === "arrow"}
            label="Arrow"
            icon={<ArrowUpRight className="h-5 w-5" />}
            onClick={() => onTool("arrow")}
          />
          <ToolButton
            active={tool === "circle"}
            label="Circle"
            icon={<Circle className="h-5 w-5" />}
            onClick={() => onTool("circle")}
          />
          <ToolButton
            active={tool === "box"}
            label="Box"
            icon={<Square className="h-5 w-5" />}
            onClick={() => onTool("box")}
          />
          <div className="mx-1 h-8 w-px bg-[var(--v-line-strong)]" />
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
            className="v-press ml-1 flex min-h-11 items-center gap-2 rounded bg-[var(--v-text)] px-4 font-body text-[11px] font-bold text-[var(--v-surface)] hover:bg-white hc-focus"
          >
            <Check className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </>
  );
}
