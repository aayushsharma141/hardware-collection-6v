"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/config";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  categorySlug?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    _id: "faq-1",
    question: "Do you have genuine products from authorized brands?",
    answer:
      "Yes. We are authorized direct partners for Häfele, Dorset, Tattva, Ozone, Blum, Hettich and other premier architectural hardware manufacturers. All products carry full manufacturer warranties and authentication.",
  },
  {
    _id: "faq-2",
    question: "Can I visit the showroom to see the products?",
    answer:
      "Yes, absolutely. Our physical showroom in Sakchi, Jamshedpur features functional demonstration displays where you can touch, operate, and compare finishes across doors, modular kitchens, and digital locks.",
  },
  {
    _id: "faq-3",
    question: "Do you provide guidance for home or modular kitchen projects?",
    answer:
      "Yes. Our hardware specialists provide one-on-one consultation for homeowners, architects, and interior designers, assisting with technical hardware scheduling, load calculations, and finish coordination.",
  },
  {
    _id: "faq-4",
    question: "How can I get a catalogue or price information?",
    answer:
      "You can browse all digital brand catalogues directly on our website, or contact our Sakchi team via WhatsApp with your project requirements for personalized catalogs and pricing.",
  },
];

export default function FaqSection({ faqs }: { faqs?: FaqItem[] }) {
  const displayFaqs = faqs && faqs.length >= 4 ? faqs : DEFAULT_FAQS;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 lg:py-20 bg-[var(--surface)] border-b border-[var(--border)] relative z-10" id="faq">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-16">
        {/* Header matching Reference Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="hc-mono text-[10.5px] uppercase tracking-[0.25em] font-semibold text-[var(--color-wine)] mb-1.5">
              FAQ
            </p>
            <h2 className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>Still have questions?</span>
            <a
              href={generateWhatsAppUrl("faq-enquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-wine)] inline-flex items-center gap-1 hover:underline"
            >
              <span>WhatsApp an Expert</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Clean Accordion List */}
        <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
          {displayFaqs.map((faq) => {
            const isOpen = openId === faq._id;
            return (
              <div key={faq._id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq._id)}
                  className="w-full py-5 flex items-center justify-between text-left outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="hc-serif text-lg sm:text-xl font-normal text-[var(--text-primary)] group-hover:text-[var(--color-wine)] transition-colors pr-6">
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--color-wine)] transition-colors">
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? "rotate-45 text-[var(--color-wine)]" : "rotate-0"
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-5 pt-0 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-3xl">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
