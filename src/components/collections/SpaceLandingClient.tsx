"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Space, SiteSettings } from "@/types/catalog";
import CompactCollectionGrid from "@/components/collections/CompactCollectionGrid";
import { buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { useConsultationStore } from "@/components/consultation/store";
import Footer from "@/components/layout/Footer";

export interface SpaceLandingClientProps {
  space: Space;
  settings?: SiteSettings | null;
}

const SPACE_FALLBACK_IMAGES: Record<string, string> = {
  kitchen: "/cinema/categories/HC-03-KITCHEN.png",
  bathroom: "/cinema/categories/HC-03-BATHROOM.png",
  wardrobe: "/cinema/categories/HC-03-WARDROBE.png",
  entrance: "/cinema/categories/HC-03-SECURITY.png",
  commercial: "/cinema/categories/HC-03-GLASS.png",
  "living-interior": "/cinema/categories/HC-03-DOORS.png",
};

export default function SpaceLandingClient({
  space,
  settings,
}: SpaceLandingClientProps) {
  const { openDrawer } = useConsultationStore();

  const slug =
    typeof space.slug === "string"
      ? space.slug
      : (space.slug as { current?: string })?.current || "";

  const heroImage =
    space.heroImageUrl ||
    SPACE_FALLBACK_IMAGES[slug] ||
    "/cinema/categories/HC-03-DOORS.png";

  const consultMessage = `Hardware Collection — I'd like to consult on hardware specifications for ${space.name}.`;
  const whatsappUrl = buildWhatsAppLink(consultMessage, settings);

  const categories = space.linkedCategories || [];

  return (
    <div className="min-h-screen bg-[#fbf5ea] text-[var(--text-primary)]">
      {/* Back Navigation */}
      <div className="max-w-[1320px] mx-auto px-6 pt-28 md:pt-32 pb-4">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-150 hc-focus py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Collections
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative w-full border-b border-[var(--border)] overflow-hidden">
        <div className="relative max-w-[1320px] mx-auto px-6 py-16 md:py-24">
          {/* Background image atmosphere */}
          <div className="absolute inset-0 -z-10 opacity-25">
            <Image
              src={heroImage}
              alt={space.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbf5ea] via-[#fbf5ea]/80 to-transparent" />
          </div>

          <div className="max-w-3xl">
            <span className="hc-mono text-xs uppercase tracking-[0.25em] font-semibold text-[var(--accent)] mb-3 block">
              CURATED ARCHITECTURAL SPACE
            </span>
            <h1 className="hc-serif text-5xl sm:text-7xl lg:text-8xl font-light tracking-[-0.01em] text-[var(--text-primary)] uppercase leading-[0.95] mb-6">
              {space.name}
            </h1>
            {space.description && (
              <p className="text-base sm:text-xl text-[var(--text-secondary)] font-light leading-relaxed mb-8 max-w-2xl">
                {space.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() =>
                  openDrawer({
                    source: "space_landing",
                    intent: "consultation",
                    category: { slug, name: space.name },
                  })
                }
                className="brass-plate hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
              >
                REQUEST SPACE CONSULTATION
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-button hc-focus inline-flex items-center justify-center px-6 py-3.5 text-xs tracking-widest uppercase font-medium text-[var(--text-primary)] border border-[#1a1017]/[0.20] hover:border-[var(--accent)] rounded transition-colors duration-150"
              >
                WHATSAPP SPECIALIST
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-2 block">
              SPECIFICATION HARDWARE
            </span>
            <h2 className="hc-serif text-3xl sm:text-4xl font-normal tracking-[0.02em] text-[var(--text-primary)]">
              Curated Collections for {space.name}
            </h2>
          </div>

          <CompactCollectionGrid categories={categories} />
        </div>
      </section>

      {/* Bottom Advisory Consultation CTA */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <MessageSquare
            className="w-8 h-8 text-[var(--accent)] mx-auto mb-4 opacity-80"
            aria-hidden="true"
          />
          <h3 className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)] mb-3">
            Planning a {space.name} Project?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-light max-w-lg mx-auto mb-8 leading-relaxed">
            Bring your blueprints or site requirements to our Sakchi showroom for personalized specification,
            live tactile demos, and contractor coordination.
          </p>
          <button
            type="button"
            onClick={() =>
              openDrawer({
                source: "space_landing",
                intent: "consultation",
                category: { slug, name: space.name },
              })
            }
            className="brass-plate hc-focus inline-flex items-center justify-center px-8 py-3.5 text-xs tracking-widest uppercase font-medium text-white rounded transition-transform duration-150 active:scale-95 shadow-md"
          >
            BOOK SHOWROOM CONSULTATION
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
