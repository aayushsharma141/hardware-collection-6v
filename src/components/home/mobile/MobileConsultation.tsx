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
      className="w-full px-margin-mobile pt-[104px] pb-[80px] bg-surface-obsidian border-t border-outline-variant lg:hidden scroll-mt-24"
    >
      <div className="max-w-xl mx-auto flex flex-col space-y-unit-lg">
        <div className="flex flex-col">
          <p className="font-label-caps t-eyebrow text-[#c8a96e]">
            Private consultation &middot; Sakchi
          </p>
          <h2 className="font-headline-md t-h2 mt-3 text-text-bone">
            Let&rsquo;s discuss your project.
          </h2>
          <p className="t-body mt-4 font-light text-text-muted max-w-[44ch]">
            Tell us what you&rsquo;re working on. We&rsquo;ll help you navigate
            brands, finishes and specifications.
          </p>
        </div>

        <ConsultationForm inline />

        <div className="flex flex-col gap-3 border-t border-outline-variant pt-unit-lg">
          <p className="hc-mono t-meta uppercase text-text-muted">
            Or reach the showroom directly
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={SHOWROOM_PHONE_HREF}
              className="hc-focus flex-1 inline-flex items-center justify-center min-h-[48px] px-4 border border-outline-variant text-text-bone text-[13px] font-semibold uppercase tracking-[0.14em] transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary hover:text-primary active:scale-[0.98] motion-reduce:active:scale-100"
            >
              Call {SHOWROOM_PHONE_DISPLAY}
            </a>
            <a
              href={SHOWROOM_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hc-focus flex-1 inline-flex items-center justify-center min-h-[48px] px-4 border border-outline-variant text-text-muted text-[13px] font-medium uppercase tracking-[0.14em] transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-text-bone hover:text-text-bone active:scale-[0.98] motion-reduce:active:scale-100"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


