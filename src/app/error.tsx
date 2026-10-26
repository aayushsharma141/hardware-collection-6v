"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, RotateCcw } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/config";

/**
 * Shown when a page throws while rendering. Without it a visitor gets Next's
 * bare default screen: no branding and no way to reach the showroom. The
 * layout (navbar, footer) still renders around this.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error("Page render failed:", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center max-w-[680px] mx-auto bg-[var(--surface)] text-[var(--text-primary)]">
      <span className="hc-mono text-xs uppercase tracking-[0.25em] font-semibold text-[var(--color-wine)] mb-4">
        Something went wrong
      </span>

      <h1 className="hc-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.06em] font-light leading-[1.2] mb-5 text-balance">
        This page didn&apos;t load
      </h1>

      <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-w-[46ch] mb-10">
        Please try again. If it keeps happening, the showroom is one message away.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        <button
          type="button"
          onClick={reset}
          className="hc-focus h-12 px-6 rounded-none bg-[var(--text-primary)] hover:bg-[var(--color-wine)] text-[var(--surface)] text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 transition-colors duration-300 w-full sm:w-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <a
          href={generateWhatsAppUrl("general-enquiry")}
          target="_blank"
          rel="noopener noreferrer"
          className="hc-focus h-12 px-6 rounded-none border border-[var(--border)] hover:border-[var(--text-primary)] text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Speak With The Showroom</span>
        </a>
      </div>

      <Link href="/" className="hc-focus mt-8 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)] hover:text-[var(--color-wine)] transition-colors">
        Back to home
      </Link>
    </main>
  );
}
