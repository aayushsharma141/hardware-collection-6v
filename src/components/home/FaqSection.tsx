"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  categorySlug?: string;
}

function AccordionItem({ faq, isOpen, onClick }: { faq: FaqItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div 
      className={`group border-b border-[var(--border)] transition-colors duration-300`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)] focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq._id}`}
      >
        <h4 className={`hc-serif text-xl md:text-2xl transition-colors duration-300 pr-8 ${isOpen ? "text-[var(--color-wine)]" : "text-[var(--text-primary)] group-hover:text-[var(--color-brass)]"}`}>
          {faq.question}
        </h4>
        <span className={`shrink-0 flex items-center justify-center w-8 h-8 transition-colors duration-300 ${isOpen ? 'text-[var(--color-wine)]' : 'text-[var(--text-primary)]/40 group-hover:text-[var(--color-brass)]'}`}>
          <Plus className={`w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-[135deg]" : "rotate-0"}`} />
        </span>
      </button>
      <div
        id={`faq-answer-${faq._id}`}
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className={`pb-6 pt-0 text-sm md:text-base text-[var(--text-primary)] font-light leading-relaxed max-w-[90%] md:max-w-[80%] transition-[transform,opacity] duration-300 ${isOpen ? 'translate-y-0 opacity-70' : '-translate-y-2 opacity-0'}`}>
            <p>{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const displayFaqs = faqs && faqs.length > 0 ? faqs : [
    {
      _id: "faq-fallback-1",
      question: "Do you supply architectural hardware for commercial projects?",
      answer: "Yes, we specialize in bulk and customized architectural hardware supply for commercial projects including hotels, offices, and residential complexes. Our team provides dedicated support from specification to delivery.",
      categorySlug: "General"
    },
    {
      _id: "faq-fallback-2",
      question: "Can I book an appointment to visit the showroom?",
      answer: "Absolutely. We encourage scheduling a consultation so our hardware specialists can give you undivided attention and guide you through our collections based on your project requirements.",
      categorySlug: "Showroom"
    },
    {
      _id: "faq-fallback-3",
      question: "What brands are available in your collection?",
      answer: "We carry premium architectural hardware from leading global and national brands. Our selection is carefully curated for design, durability, and warranty support.",
      categorySlug: "Products"
    }
  ];

  // Generate FAQ Schema for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": displayFaqs.map((faq: FaqItem) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const [openId, setOpenId] = useState<string | null>(displayFaqs[0]?._id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="max-w-[800px] mx-auto px-6 py-12 md:py-16 relative z-10" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <span className="hc-mono text-xs uppercase tracking-[0.2em] font-semibold text-[var(--color-wine)] mb-4 block">
          Support & Expertise
        </span>
        <h2 className="hc-serif text-3xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-4">
          Common Enquiries
        </h2>
        <p className="text-[var(--text-primary)] opacity-60 max-w-[500px] text-sm md:text-base font-light leading-relaxed">
          Everything you need to know about our products, showroom experience, and commercial partnerships.
        </p>
      </div>

      <div className="animate-fade-in-up">
        <div className="border-t border-[var(--border)]">
          {displayFaqs.map((faq: FaqItem) => (
            <AccordionItem 
              key={faq._id} 
              faq={faq} 
              isOpen={openId === faq._id} 
              onClick={() => toggleAccordion(faq._id)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
