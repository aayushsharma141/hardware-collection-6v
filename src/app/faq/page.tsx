import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import { getSiteSettings, getBrands, getFaqs } from "@/content/sanity/queries";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Hardware Collection Jamshedpur",
  description: "Get answers to common questions about premium architectural hardware, digital lock installation, warranty, and showroom services in Jamshedpur.",
  alternates: {
    canonical: 'https://hardwarecollection.co/faq',
  },
};

export const revalidate = 60;

export default async function FaqPage() {
  const [siteSettings, brands, faqs] = await Promise.all([
    getSiteSettings(),
    getBrands(),
    getFaqs()
  ]);

  interface FaqItem {
    _id: string;
    question: string;
    answer: string;
    categorySlug?: string;
  }

  // Group by categorySlug
  const categorizedFaqs = faqs.reduce((acc: Record<string, FaqItem[]>, faq: FaqItem) => {
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
    "mainEntity": faqs.map((faq: FaqItem) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#fbf5ea] text-[var(--text-primary)]">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <main className="max-w-[880px] mx-auto px-6 pt-28 md:pt-36 pb-24">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[#8b1a42] transition-colors duration-150 hc-focus py-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-[#1a1017]/[0.10] pb-8 mb-10">
          <span className="hc-mono text-xs uppercase tracking-[0.22em] font-semibold text-[#8b1a42] mb-3 block">
            CUSTOMER SUPPORT · SAKCHI SHOWROOM
          </span>
          <h1 className="hc-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[#1a1017] leading-[1.05] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-light max-w-2xl">
            Find answers to common questions about our products, ordering process, and showroom experience.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-16">
          {Object.entries(categorizedFaqs as Record<string, FaqItem[]>).map(([category, categoryFaqs]) => (
            <section key={category}>
              <h2 className="hc-mono text-sm uppercase tracking-[0.15em] font-semibold text-[#8b1a42] mb-8 border-b border-[#1a1017]/10 pb-4">
                {category}
              </h2>
              <div className="space-y-8">
                {categoryFaqs.map((faq: FaqItem) => (
                  <div key={faq._id} className="group border border-[#1a1017]/10 bg-white/40 p-6 rounded-xl hover:bg-white/80 transition-colors duration-300">
                    <h3 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3 flex items-start gap-3">
                      <HelpCircle className="w-6 h-6 text-[#c8a96e] shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <div className="text-[15px] text-[#2e232b] font-light leading-relaxed pl-9">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {faqs.length === 0 && (
            <div className="text-[var(--text-secondary)] font-light italic">
              No FAQs available at the moment. Please check back later.
            </div>
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 bg-white/60 border border-[#1a1017]/[0.08] rounded-xl p-8 sm:p-10 text-center">
          <MessageCircle className="w-10 h-10 text-[#8b1a42] mx-auto mb-4 opacity-80" />
          <h2 className="hc-serif text-2xl text-[#1a1017] mb-2">Still have questions?</h2>
          <p className="text-sm text-[#7a6872] mb-6 max-w-sm mx-auto">
            We are here to help. Reach out to our experts for personalized guidance on your project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={`https://wa.me/${siteSettings?.whatsappNumber}?text=${encodeURIComponent(siteSettings?.defaultWhatsappMessage || "Hi, I have a question about hardware.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#1a1017] text-white px-6 py-3 rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#8b1a42] transition-colors w-full sm:w-auto"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${siteSettings?.primaryPhone}`}
              className="inline-flex items-center justify-center bg-transparent border border-[#1a1017]/20 text-[#1a1017] px-6 py-3 rounded text-xs font-semibold tracking-widest uppercase hover:bg-black/5 transition-colors w-full sm:w-auto"
            >
              Call Us
            </a>
          </div>
        </div>
      </main>
      
      <Footer settings={siteSettings ?? undefined} brands={brands} />
    </div>
  );
}
