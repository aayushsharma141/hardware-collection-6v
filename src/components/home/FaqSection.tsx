import React from "react";
import { HelpCircle } from "lucide-react";

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  categorySlug?: string;
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

  // Group by categorySlug
  const categorizedFaqs = displayFaqs.reduce((acc: Record<string, FaqItem[]>, faq: FaqItem) => {
    const cat = faq.categorySlug || "General";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(faq);
    return acc;
  }, {});

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

  return (
    <section className="max-w-[880px] mx-auto px-6 py-24 relative z-10" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="border-b border-[#1a1017]/[0.10] pb-8 mb-10">
        <span className="hc-mono text-xs uppercase tracking-[0.22em] font-semibold text-[#8b1a42] mb-3 block">
          CUSTOMER SUPPORT
        </span>
        <h2 className="hc-serif text-4xl sm:text-5xl font-light tracking-[-0.01em] text-[#1a1017] leading-[1.05] mb-4">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-16">
        {Object.entries(categorizedFaqs as Record<string, FaqItem[]>).map(([category, categoryFaqs]) => (
          <div key={category}>
            <h3 className="hc-mono text-sm uppercase tracking-[0.15em] font-semibold text-[#8b1a42] mb-8 border-b border-[#1a1017]/10 pb-4">
              {category}
            </h3>
            <div className="space-y-8">
              {categoryFaqs.map((faq: FaqItem) => (
                <div key={faq._id} className="group border border-[#1a1017]/10 bg-white/40 p-6 rounded-xl hover:bg-white/80 transition-colors duration-300">
                  <h4 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3 flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-[#c8a96e] shrink-0 mt-0.5" />
                    {faq.question}
                  </h4>
                  <div className="text-[15px] text-[#2e232b] font-light leading-relaxed pl-9">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
