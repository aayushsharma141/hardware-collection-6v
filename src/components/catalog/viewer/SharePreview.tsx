"use client";

import React from "react";
import { ArrowLeft, Loader2, MessageCircle, X } from "lucide-react";

/**
 * The last step before the enquiry leaves the site: show the customer exactly
 * what Hardware Collection will receive, then hand it to WhatsApp.
 */

interface SharePreviewProps {
  previewUrl: string;
  brand: string;
  catalogue: string;
  page: number;
  busy: boolean;
  /** Set after sharing when the customer has to paste the image themselves. */
  note: string | null;
  onEdit: () => void;
  onClose: () => void;
  onShare: () => void;
}

export default function SharePreview({
  previewUrl,
  brand,
  catalogue,
  page,
  busy,
  note,
  onEdit,
  onClose,
  onShare,
}: SharePreviewProps) {
  return (
    <div
      role="dialog"
      aria-label="Share to WhatsApp"
      className="absolute inset-0 z-50 flex flex-col bg-[#0E0C0C]/97 backdrop-blur-sm"
    >
      <div className="flex shrink-0 items-center justify-between px-3 py-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex min-h-11 items-center gap-2 rounded-full px-3 font-body text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white hc-focus"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share preview"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white hc-focus"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- blob URL from an in-memory capture */}
        <img
          src={previewUrl}
          alt={`Marked selection from ${brand} ${catalogue}, page ${page}`}
          className="max-h-full max-w-full rounded-lg border border-white/12 bg-white object-contain shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
        />
      </div>

      <div className="shrink-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <p className="text-center font-display text-sm uppercase tracking-[0.16em] text-white/85">
          {brand}
        </p>
        <p className="mt-1 text-center font-body text-xs text-white/50">
          {catalogue} · Page {page}
        </p>

        <button
          type="button"
          onClick={onShare}
          disabled={busy}
          className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#8B1A4A] font-body text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#a02456] disabled:opacity-60 hc-focus"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
          Share to WhatsApp
        </button>

        {note && (
          <p role="status" className="mt-3 text-center font-body text-xs leading-relaxed text-[#C8A96E]">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
