"use client";

import React from "react";
import { ArrowLeft, Loader2, X } from "lucide-react";
import WhatsAppGlyph from "./WhatsAppGlyph";

/**
 * The last step before the enquiry leaves the site: show the customer exactly
 * what Hardware Collection will receive, let them say it in their own words,
 * then hand it to WhatsApp.
 *
 * The message is editable because the generated one is a starting point, not a
 * script — "I need 40 of these in matte black" is the sentence that actually
 * moves the enquiry forward, and it has to be typeable here rather than after
 * the app has already opened.
 */

export const MESSAGE_MAX = 1000;

interface SharePreviewProps {
  previewUrl: string;
  brand: string;
  catalogue: string;
  page: number;
  message: string;
  busy: boolean;
  /** Set after sharing when the customer has to paste the image themselves. */
  note: string | null;
  onMessageChange: (message: string) => void;
  onEdit: () => void;
  onClose: () => void;
  onShare: () => void;
}

export default function SharePreview({
  previewUrl,
  brand,
  catalogue,
  page,
  message,
  busy,
  note,
  onMessageChange,
  onEdit,
  onClose,
  onShare,
}: SharePreviewProps) {
  const remaining = MESSAGE_MAX - message.length;

  return (
    <div
      role="dialog"
      aria-label="Share to WhatsApp"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="flex w-full max-w-md max-h-[100dvh] flex-col overflow-hidden rounded-2xl border border-[var(--v-line-strong)] bg-[var(--v-surface)] shadow-2xl">
        <div className="flex shrink-0 items-center gap-1 border-b border-[var(--v-line)] px-3 py-3">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Back to the selection"
            className="v-press flex h-11 w-11 items-center justify-center rounded-md text-[var(--v-text-dim)] hover:text-[var(--v-text)] hc-focus"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="flex-1 font-body text-[11px] text-[var(--v-text-dim)] text-center pr-11">
            Share to WhatsApp
          </h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- blob URL from an in-memory capture */}
            <img
              src={previewUrl}
              alt={`Selection from ${brand} ${catalogue}, page ${page}`}
              className="h-28 w-32 shrink-0 rounded-lg border border-[var(--v-line-strong)] bg-[var(--v-panel)] object-contain p-1"
            />
            <div className="min-w-0 pt-1">
              <p className="font-display text-sm text-[var(--v-text)]">{brand}</p>
              <p className="mt-1 font-body text-xs leading-relaxed text-[var(--v-text-dim)]">{catalogue}</p>
              <p className="mt-1 font-body text-xs text-[var(--v-text-faint)]">Catalogue · Page {page}</p>
            </div>
          </div>

          <div>
            <label htmlFor="catalogue-share-message" className="sr-only">
              Message to send with this selection
            </label>
            <textarea
              id="catalogue-share-message"
              value={message}
              rows={4}
              maxLength={MESSAGE_MAX}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="v-press w-full resize-none rounded-lg border border-[var(--v-line-strong)] bg-[var(--v-panel)] p-3 font-body text-sm leading-relaxed text-[var(--v-text)] outline-none focus:border-[var(--v-text)] hc-focus"
            />
            <p
              className={`mt-1 text-right font-body text-[10px] tabular-nums ${
                remaining < 50 ? "text-red-600 font-bold" : "text-[var(--v-text-faint)]"
              }`}
            >
              <span className="sr-only">Message length: </span>
              {message.length}/{MESSAGE_MAX}
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-[var(--v-line)] px-5 py-5">
          <button
            type="button"
            onClick={onShare}
            disabled={busy || message.trim().length === 0}
            className="v-press flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded bg-[var(--v-send)] font-body text-sm font-bold text-[var(--v-surface)] hover:bg-[var(--v-send-hover)] disabled:opacity-50 hc-focus"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <WhatsAppGlyph className="h-5 w-5" />
            )}
            Share to WhatsApp
          </button>

          <button
            type="button"
            onClick={onClose}
            className="v-press mt-3 flex min-h-11 w-full items-center justify-center gap-2 font-body text-[11px] text-[var(--v-text-faint)] hover:text-[var(--v-text)] hc-focus"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>

          {note && (
            <p role="status" className="mt-2 text-center font-body text-xs leading-relaxed text-[var(--v-text-dim)]">
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
