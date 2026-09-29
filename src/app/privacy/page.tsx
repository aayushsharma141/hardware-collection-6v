import React from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getSiteSettings, getBrands, getLegalPageBySlug } from "@/content/sanity/queries";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { PortableText } from "@portabletext/react";

export const metadata = {
  title: "Privacy Policy | Hardware Collection Jamshedpur",
  description:
    "Privacy Policy for Hardware Collection showroom, Sakchi, Jamshedpur. Learn how we handle project inquiries and contact information.",
};

export default async function PrivacyPage() {
  const [siteSettings, brands, pageData] = await Promise.all([getSiteSettings(), getBrands(), getLegalPageBySlug("privacy-policy")]);

  return (
    <div className="min-h-screen bg-[#fbf5ea] text-[var(--text-primary)]">
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
            LEGAL INFORMATION · SAKCHI SHOWROOM
          </span>
          <h1 className="hc-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.01em] text-[#1a1017] leading-[1.05] mb-4">
            {pageData?.title || "Privacy Policy"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-light">
            Last Updated: {pageData?.lastUpdated ? new Date(pageData.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "September 2026"} · Hardware Collection (Proprietor: Mukesh Khandelwal)
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-[15px] sm:text-base text-[#2e232b] font-light leading-relaxed prose prose-headings:hc-serif prose-headings:font-normal prose-headings:text-[#1a1017] prose-a:text-[#8b1a42] max-w-none">
          {pageData?.content ? (
            <PortableText value={pageData.content} />
          ) : (
            <>
              {/* Section 1 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  1. Overview
                </h2>
                <p>
                  Hardware Collection operates an architectural hardware, modular kitchen, and security locks
                  showroom based in Sakchi, Jamshedpur, Jharkhand. This Privacy Policy explains how we collect
                  and handle your information when you browse our website (
                  <span className="font-normal text-[#1a1017]">hardwarecollection.in</span>), submit a project inquiry,
                  or reach out via WhatsApp or phone.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  2. Information You Provide Directly
                </h2>
                <p className="mb-3">
                  When you use our consultation forms or contact us directly, we may collect:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-[#3d2e38]">
                  <li>Your name and contact details (phone number, email address).</li>
                  <li>Your role (Architect, Interior Designer, Builder, Contractor, or Homeowner).</li>
                  <li>Project details, location, and hardware categories of interest.</li>
                </ul>
                <p className="mt-3">
                  We do not collect payment details, credit card numbers, or sensitive financial information
                  through this website.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  3. How We Use Your Information
                </h2>
                <p className="mb-3">
                  We use the details you submit solely to fulfill your hardware requests:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-[#3d2e38]">
                  <li>Responding to your project inquiries and preparing product recommendations.</li>
                  <li>Sharing technical cut-sheets, brand catalogs, and estimate schedules.</li>
                  <li>Coordinating in-person showroom visits and tactile product demonstrations in Sakchi.</li>
                  <li>Routing authorized brand technical support when requested by you.</li>
                </ul>
                <p className="mt-3">
                  We do not sell, rent, or trade your personal information to third-party data brokers or marketing firms.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  4. WhatsApp & Third-Party Communication
                </h2>
                <p>
                  When you click our WhatsApp action links, you communicate directly with our Sakchi showroom representatives
                  through the WhatsApp platform. WhatsApp communications are subject to WhatsApp&apos;s own privacy policy
                  and terms of service.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  5. Data Security & Storage
                </h2>
                <p>
                  Inquiries submitted through our forms are transmitted securely and routed to our internal showroom team
                  for follow-up. We take reasonable organizational precautions to protect your contact information from
                  unauthorized access or misuse.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="hc-serif text-2xl text-[#1a1017] font-normal mb-3">
                  6. Your Rights & Inquiries
                </h2>
                <p>
                  If you wish to review, update, or request the deletion of any contact information you have previously
                  provided to us, please reach out directly to our showroom team:
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
