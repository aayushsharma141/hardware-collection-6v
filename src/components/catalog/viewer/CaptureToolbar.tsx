"use client";

import React from "react";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";

/** Confirm (or adjust) the area that will be sent to WhatsApp. */
interface CaptureToolbarProps {
  busy: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export default function CaptureToolbar({ busy, onBack, onConfirm }: CaptureToolbarProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-3 md:top-5">
        <p className="rounded-full border border-white/10 bg-[#0E0C0C]/85 px-5 py-2 text-center font-body text-[11px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
          Adjust the area to send
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-md items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[52px] items-center gap-2 rounded-xl border border-white/12 bg-[#0E0C0C]/85 px-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md transition-colors hover:text-white hc-focus"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#C8A96E] font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E0C0C] transition-colors hover:bg-[#d8bb84] disabled:opacity-60 hc-focus"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            Capture
          </button>
        </div>
      </div>
    </>
  );
}
