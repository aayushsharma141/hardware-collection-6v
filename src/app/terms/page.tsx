import React from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getSiteSettings, getBrands, getLegalPageBySlug } from "@/content/sanity/queries";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { PortableText } from "@portabletext/react";

export const metadata = {
  title: "Terms & Conditions | Hardware Collection Jamshedpur",
  description:
    "Terms and conditions for Hardware Collection showroom, Sakchi, Jamshedpur. Product information, specifications, and showroom consultation terms.",
};

export default async function TermsPage() {
  const [siteSettings, brands, pageData] = await Promise.all([getSiteSettings(), getBrands(), getLegalPageBySlug("terms")]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--text-primary)]">
      <main className="max-w-[880px] mx-auto px-6 pt-28 md:pt-36 pb-24">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-150 hc-focus py-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-[var(--text-primary)]/[0.10] pb-8 mb-10">
          <span className="hc-mono text-xs uppercase tracking-[0.22em] font-semibold text-[var(--color-primary)] mb-3 block">
            LEGAL TERMS · SAKCHI SHOWROOM
          </span>
          <h1 className="hc-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[var(--text-primary)] leading-[1.05] mb-4">
            {pageData?.title || "Terms & Conditions"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-light">
            Last Updated: {pageData?.lastUpdated ? new Date(pageData.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "September 2026"} · Hardware Collection (Proprietor: Mukesh Khandelwal)
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-[15px] sm:text-base text-[var(--color-charcoal)] font-light leading-relaxed prose prose-headings:hc-serif prose-headings:font-normal prose-headings:text-[var(--text-primary)] prose-a:text-[var(--color-primary)] max-w-none">
          {pageData?.content ? (
            <PortableText value={pageData.content} />
          ) : (
            <>
              {/* Section 1 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using this website (
                  <span className="font-normal text-[#1a1017]">hardwarecollection.in</span>), viewing our digital catalogues,
                  or submitting project inquiries to Hardware Collection, Sakchi, Jamshedpur, you agree to comply with
                  and be bound by these terms. If you disagree with any part of these terms, please consult our showroom
                  team directly before specifying products.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  2. Informational &amp; Specification Reference
                </h2>
                <p className="mb-3">
                  This website serves as an architectural portfolio and specification reference for the premium brands
                  we represent in Jamshedpur. Please note:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-[#3d2e38]">
                  <li>
                    This website is not an automated e-commerce storefront. Orders, availability verification,
                    and technical pricing are finalized through direct showroom consultation or written estimates.
                  </li>
                  <li>
                    Images, finishes, and dimensions displayed are representative. Due to display calibration,
                    natural patination of living finishes (such as brass and bronze), and manufacturer iterations,
                    we strongly encourage visiting our Sakchi showroom to examine physical samples before procurement.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  3. Manufacturer Specifications &amp; Warranties
                </h2>
                <p className="mb-3">
                  Hardware Collection is an authorized dealer and specification partner for world-class manufacturers
                  including Blum, Häfele, Dorset, Hettich, Tattva, and other represented brands.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-[#3d2e38]">
                  <li>
                    All product warranties, technical certifications, and performance guarantees are provided
                    directly by the respective manufacturer according to their official terms.
                  </li>
                  <li>
                    Manufacturer product specifications, catalogue data, and technical cut-sheets may be updated
                    by the manufacturer without prior notice.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  4. Consultations &amp; Price Estimates
                </h2>
                <p>
                  Consultations, schedule preparation, and quotes provided by Hardware Collection are based on client-provided
                  blueprints, site dimensions, or requirements. Estimates remain valid for the duration specified in the
                  formal quote and are subject to market commodity fluctuations and manufacturer price revisions.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  5. Intellectual Property
                </h2>
                <p>
                  All trademarks, brand logos, product photographs, and catalogue documents featured on this website are
                  the property of their respective manufacturers and brand owners, used by Hardware Collection under
                  authorized dealership agreements for specification purposes.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  6. Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These terms are governed by the laws of India. Any disputes arising out of or related to our showroom
                  services or transactions shall be subject to the exclusive jurisdiction of the competent courts in
                  Jamshedpur, Jharkhand.
                </p>
              </section>
            </>
          )}

          <div className="mt-6 p-6 rounded-xl bg-[#f7f0e2] border border-[#1a1017]/[0.08] space-y-3 text-sm not-prose">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#8b1a42] shrink-0 mt-1" />
              <div>
                <strong className="text-[#1a1017] font-medium block">Hardware Collection Showroom</strong>
                <span>{siteSettings?.showroomAddress || "1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#8b1a42] shrink-0" />
              <span>{siteSettings?.primaryPhone || "+91 98351 90738"} {siteSettings?.secondaryPhone && ` / ${siteSettings.secondaryPhone}`}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#8b1a42] shrink-0" />
              <span>info@hardwarecollection.in</span>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={siteSettings ?? undefined} brands={brands} />
    </div>
  );
}
