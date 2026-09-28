"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";

/** Confirm (or adjust) the selection that will be sent to WhatsApp. */
interface CaptureToolbarProps {
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CaptureToolbar({ busy, onCancel, onConfirm }: CaptureToolbarProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-3 md:top-5">
        <p className="rounded-md border border-[var(--v-line-strong)] bg-[var(--v-chrome)] px-5 py-2 text-center font-body text-[11px] text-[var(--v-text)] backdrop-blur-md">
          Adjust selection
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-md items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="v-press flex min-h-[52px] items-center gap-2 rounded border border-[var(--v-line-strong)] bg-[var(--v-chrome)] px-4 font-body text-[11px] font-semibold text-[var(--v-text-dim)] backdrop-blur-md hover:text-[var(--v-text)] hc-focus"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="v-press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded bg-[var(--v-text)] font-body text-[11px] font-bold text-[var(--v-surface)] hover:bg-white disabled:opacity-60 hc-focus"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
