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
      className={`group border-b border-[var(--border)] transition-colors duration-300 ${
        isOpen ? "bg-[var(--color-brass)]/5" : "hover:bg-white/40"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 px-4 md:px-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        aria-expanded={isOpen}
      >
        <h4 className={`hc-serif text-xl md:text-2xl transition-colors duration-300 ${isOpen ? "text-[var(--color-wine)]" : "text-[var(--text-primary)] group-hover:text-[var(--color-brass)]"}`}>
          {faq.question}
        </h4>
        <span className={`shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${isOpen ? 'border-[var(--color-wine)] bg-[var(--color-wine)] text-white' : 'border-[var(--border)] text-[var(--color-brass)] group-hover:border-[var(--color-brass)] group-hover:bg-[var(--color-brass)] group-hover:text-white'}`}>
          <Plus className={`w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? "rotate-[135deg]" : "rotate-0"}`} />
        </span>
      </button>
      <div
        className="grid transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-6 px-4 md:px-6 pt-0 text-[15px] md:text-[16px] text-[#4a3e46] font-light leading-relaxed max-w-[85%]">
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
    <section className="max-w-[880px] mx-auto px-6 py-24 relative z-10" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="flex flex-col items-center text-center mb-16">
        <span className="hc-mono text-xs uppercase tracking-[0.22em] font-semibold text-[var(--color-wine)] mb-3 block">
          Support & Expertise
        </span>
        <h2 className="hc-serif text-4xl sm:text-5xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.05] mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-[var(--text-primary)]/70 max-w-[500px] text-sm md:text-base font-light">
          Everything you need to know about our products, showroom experience, and commercial partnerships.
        </p>
      </div>

      <div className="animate-fade-in-up">
        <div className="border-t border-[var(--border)] bg-white/40 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
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
