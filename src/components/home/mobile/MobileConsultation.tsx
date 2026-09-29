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
import { SanityCta } from "@/types/sanity";

interface MobileConsultationProps {
  heading?: string;
  description?: string;
  cta?: SanityCta;
}

export default function MobileConsultation({ heading, description, cta }: MobileConsultationProps) {
  return (
    <section
      id="consultation"
      className="w-full px-margin-mobile pt-[104px] pb-[80px] bg-[#fbf5ea] border-t border-[#1a1017]/[0.08] lg:hidden scroll-mt-24"
    >
      <div className="max-w-xl mx-auto flex flex-col space-y-unit-lg">
        <div className="flex flex-col">
          <p className="font-label-caps t-eyebrow text-[#8b1a42] font-semibold tracking-[0.22em] uppercase text-xs">
            Private consultation · Sakchi
          </p>
          <h2 className="font-headline-md t-h2 mt-3 text-[#1a1017] text-3xl sm:text-4xl font-light">
            {heading || "Let's discuss your project."}
          </h2>
          <p className="t-body mt-4 font-light text-[#5a4854] max-w-[44ch] text-sm sm:text-base leading-relaxed">
            {description || "Tell us what you're working on. We'll help you navigate brands, finishes and specifications."}
          </p>
        </div>

        <ConsultationForm inline />

        <div className="flex flex-col gap-3 border-t border-[#1a1017]/[0.10] pt-unit-lg">
          <p className="hc-mono t-meta uppercase text-[#7a6872] text-xs tracking-wider">
            Or reach the showroom directly
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={SHOWROOM_PHONE_HREF}
              className="hc-focus flex-1 inline-flex items-center justify-center min-h-[48px] px-4 rounded bg-[#f7f0e2] border border-[#1a1017]/[0.12] text-[#1a1017] text-[13px] font-semibold uppercase tracking-[0.14em] transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#8b1a42] hover:text-[#8b1a42] active:scale-[0.98] motion-reduce:active:scale-100"
            >
              Call {SHOWROOM_PHONE_DISPLAY}
            </a>
            <a
              href={SHOWROOM_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hc-focus flex-1 inline-flex items-center justify-center min-h-[48px] px-4 rounded bg-[#f7f0e2] border border-[#1a1017]/[0.12] text-[#5a4854] text-[13px] font-medium uppercase tracking-[0.14em] transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#1a1017] hover:text-[#1a1017] active:scale-[0.98] motion-reduce:active:scale-100"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


