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

      <div className="space-y-20">
        {Object.entries(categorizedFaqs as Record<string, FaqItem[]>).map(([category, categoryFaqs]) => (
          <div key={category} className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="hc-mono text-sm uppercase tracking-[0.15em] font-semibold text-[#8b1a42]">
                {category}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-brass)]/20 to-transparent"></div>
            </div>
            
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {categoryFaqs.map((faq: FaqItem) => (
                <div 
                  key={faq._id} 
                  className="break-inside-avoid relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-8px_rgba(200,169,110,0.15)] transition-all duration-500 ease-out group cursor-pointer"
                >
                  {/* Subtle Top Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brass)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Ambient Glow */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--color-brass)]/5 blur-3xl group-hover:bg-[var(--color-brass)]/15 transition-colors duration-700 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-brass)]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 ease-out">
                        <HelpCircle className="w-4 h-4 text-[var(--color-brass)]" strokeWidth={2.5} />
                      </div>
                      <h4 className="hc-serif text-2xl text-[var(--text-primary)] font-normal leading-[1.3] tracking-tight">
                        {faq.question}
                      </h4>
                    </div>
                    
                    <div className="text-[15px] text-[#475569] font-light leading-relaxed pl-12">
                      <p>{faq.answer}</p>
                    </div>
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
