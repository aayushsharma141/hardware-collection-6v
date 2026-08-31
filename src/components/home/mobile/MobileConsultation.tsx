import React from "react";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { SHOWROOM_PHONE_HREF, SHOWROOM_PHONE_DISPLAY, SHOWROOM_MAP_URL } from "@/lib/config";

/**
 * MobileConsultation &mdash; the mobile close.
 *
 * This section used to render its own two-field form whose submit handler was
 * `preventDefault()` and nothing else: no request, no validation, no success
 * or error state, and no labels on the inputs. Every enquiry typed into it on
 * a phone &mdash; the majority of this site's traffic &mdash; was discarded.
 *
 * It now renders the same `ConsultationForm` the desktop chapter and the
 * navbar drawer use, so a mobile enquiry reaches the lead pipeline with the
 * same validation, retry and success states as everywhere else.
 */
export default function MobileConsultation() {
  return (
    <section
      id="consultation"
      className="w-full px-margin-mobile py-unit-xl bg-surface-obsidian border-t border-outline-variant lg:hidden scroll-mt-24"
    >
      <div className="max-w-xl mx-auto flex flex-col space-y-unit-lg">
        <div className="flex flex-col space-y-unit-xs">
          <p className="font-label-caps text-label-caps text-primary uppercase">
            Private consultation &middot; Sakchi
          </p>
          <h2 className="font-headline-md text-[30px] leading-[1.1] text-text-bone">
            Let&rsquo;s discuss your project.
          </h2>
          <p className="pt-1 text-[13.5px] leading-[1.65] font-light text-text-muted max-w-[44ch]">
            Tell us what you&rsquo;re working on. Our technical team will help
            you navigate brands, finishes and specifications &mdash; with zero
            guesswork.
          </p>
        </div>

        <ConsultationForm inline />

        <div className="flex flex-col gap-3 border-t border-outline-variant pt-unit-lg">
          <p className="hc-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
            Or reach the showroom directly
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={SHOWROOM_PHONE_HREF}
              className="hc-focus flex-1 inline-flex items-center justify-center min-h-[48px] px-4 border border-outline-variant text-text-bone text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-primary hover:text-primary"
            >
              Call {SHOWROOM_PHONE_DISPLAY}
            </a>
            <a
              href={SHOWROOM_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hc-focus flex-1 inline-flex items-center justify-center min-h-[48px] px-4 border border-outline-variant text-text-muted text-[11px] font-medium uppercase tracking-[0.14em] transition-colors hover:border-text-bone hover:text-text-bone"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


