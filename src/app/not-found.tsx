import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/config";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Page Not Found | Hardware Collection Jamshedpur",
  },
  description: "The page you are looking for is not in the collection.",
};

export default function NotFound() {
  const whatsappUrl = generateWhatsAppUrl("general-enquiry");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf5ea] text-[#1a1017]">
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center max-w-[680px] mx-auto">
        <span className="hc-mono text-xs uppercase tracking-[0.25em] font-semibold text-[#8b1a42] mb-4">
          404
        </span>

        <h1 className="hc-serif text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.06em] font-light text-[#1a1017] leading-[1.2] mb-5">
          This space isn&apos;t in the collection
        </h1>

        <p className="text-sm sm:text-base text-[#5a4854] font-light leading-relaxed max-w-[46ch] mb-10">
          The page you&apos;re looking for may have moved or may no longer be available.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/collections"
            className="hc-focus h-12 px-6 rounded bg-[#8b1a42] hover:bg-[#6b1432] text-white text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 transition-colors shadow-md w-full sm:w-auto"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hc-focus h-12 px-6 rounded border border-[#c8a96e]/70 hover:border-[#8b1a42] hover:bg-[#8b1a42] hover:text-white text-[#1a1017] text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#c8a96e]" />
            <span>Speak With The Showroom</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
