"use client";

import React, { useCallback, useMemo } from "react";
import Footer from "@/components/layout/Footer";
import { MessageSquare } from "lucide-react";
import { Product, Category, Brand, Offer, SiteSettings, getSlugString } from "@/types/catalog";
import { useCollectionsState } from "@/hooks/useCollectionsState";
import { useConsultationStore } from "@/components/consultation/store";
import { buildGeneralInquiryWhatsappLink, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";
import { categoryRails, groupProducts, productCategorySlug, showroomGroupId } from "@/lib/collections/showroom";

import CollectionsHero from "@/components/collections/CollectionsHero";
import CollectionExplorer from "@/components/collections/CollectionExplorer";
import ProductQuickView from "@/components/collections/ProductQuickView";
import OffersSection from "@/components/collections/OffersSection";
import BrandDiscovery from "@/components/collections/BrandDiscovery";

export interface CollectionsClientProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  offers: Offer[];
  settings?: SiteSettings | null;
}

/**
 * /collections as a showroom index, not a catalogue:
 *
 *   SEE → UNDERSTAND → RECOGNIZE → ENQUIRE → VISIT
 *
 * Hero, the family explorer (family → category → a few products → quick view),
 * current offers, authorized brands, and the hand-off to WhatsApp, a call or the
 * showroom. No search, filters, shortlist or comparison: those answer questions
 * the showroom team answers better.
 */
export default function CollectionsClient({
  categories,
  products,
  brands: rawBrands,
  offers,
  settings,
}: CollectionsClientProps) {
  const brands = useMemo(
    () =>
      Array.from(
        new Map(
          rawBrands.map((b) => {
            const key = normalizeBrandKey(b);
            const enriched = { ...b };
            if (!enriched.logoUrl && CANONICAL_BRANDS_BY_ID[key]?.logo) {
              enriched.logoUrl = CANONICAL_BRANDS_BY_ID[key].logo;
            }
            return [key, enriched];
          })
        ).values()
      ),
    [rawBrands]
  );

  const { openDrawer } = useConsultationStore();

  // Reused for the ?product= deep link (homepage product reel), focus return,
  // scroll lock and the image fallback chain. Its shortlist API is unused here.
  const { selectedProduct, handleProductSelect, getProductDisplayImage } = useCollectionsState({
    categories,
    products,
    brands,
    settings,
  });

  // Product -> category -> `primaryRail` -> showroom family (the CMS owner's grouping).
  const rails = useMemo(() => categoryRails(categories), [categories]);
  const categoryNames = useMemo(
    () => new Map(categories.map((c) => [getSlugString(c.slug), c.name || c.title || ""] as const)),
    [categories]
  );
  const sections = useMemo(() => groupProducts(products, rails), [products, rails]);

  const catalogueHrefFor = useCallback(
    (brandName: string) => {
      const key = normalizeBrandKey({ name: brandName } as Brand);
      const brand = brands.find((b) => normalizeBrandKey(b) === key);
      return brand?.catalogues?.length ? `/catalogues?brand=${key}` : undefined;
    },
    [brands]
  );

  const enquiryHref = useCallback(
    (label: string) =>
      buildWhatsAppLink(
        `Hardware Collection — I'd like to know more about ${label}. Could you share what's available at the showroom?`,
        settings
      ),
    [settings]
  );

  const productEnquiryHref = (product: Product) => {
    const brand = product.brandName || product.brand;
    // Many product names already lead with the brand ("Hafele Mortise Lock").
    const named =
      brand && !product.name.toLowerCase().startsWith(brand.toLowerCase()) ? `${brand} ${product.name}` : product.name;
    return buildWhatsAppLink(
      `Hardware Collection — I'm interested in ${named}. Could you share finishes, price and availability?`,
      settings
    );
  };

  const offerEnquiryHref = useCallback(
    (title: string) => buildWhatsAppLink(`Hardware Collection — I'd like to know more about your offer: ${title}.`, settings),
    [settings]
  );

  const whatsappHref = buildGeneralInquiryWhatsappLink(settings?.whatsappNumber);
  const phone = settings?.primaryPhone?.trim();

  return (
    <div className="hc-root min-h-screen w-full bg-[var(--surface)] text-[var(--text-primary)] selection:bg-[var(--color-brass)]/30 selection:text-white">
      <main className="w-full">
        <CollectionsHero />

        <CollectionExplorer
          sections={sections}
          categoryNames={categoryNames}
          getImage={getProductDisplayImage}
          onOpenProduct={(product, trigger) => handleProductSelect(product, trigger)}
          enquiryHref={enquiryHref}
          catalogueHrefFor={catalogueHrefFor}
          activeProduct={selectedProduct}
          groupIdOf={(product) => showroomGroupId(productCategorySlug(product), rails)}
        />

        <OffersSection offers={offers} enquiryHref={offerEnquiryHref} />

        <BrandDiscovery brands={brands} />

        {/* Hand-off: everything beyond recognising the product happens with the team. */}
        <section id="collections-bottom-cta" className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-16">
          <div className="mx-auto max-w-[1320px] px-6 text-center">
            <MessageSquare className="mx-auto mb-4 h-8 w-8 text-[var(--color-brass)] opacity-80" aria-hidden="true" />
            <h2 className="hc-serif mb-3 text-3xl font-normal tracking-[0.02em] text-[var(--text-primary)] sm:text-4xl">
              Looking for something specific?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm font-light leading-relaxed text-[var(--text-secondary)] sm:text-base">
              Message us a photo or a requirement, call the showroom, or visit us in Sakchi to see finishes and
              mechanisms in person.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="brass-plate hc-focus inline-flex items-center justify-center rounded px-8 py-4 text-xs font-medium uppercase tracking-widest text-white shadow-md transition-transform duration-150 active:scale-95"
              >
                WhatsApp us
              </a>
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="rail-button hc-focus inline-flex items-center justify-center rounded border border-[var(--border)] px-8 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--color-brass)]"
                >
                  Call the showroom
                </a>
              )}
              <button
                type="button"
                onClick={() => openDrawer({ source: "collections", intent: "consultation" })}
                className="rail-button hc-focus inline-flex items-center justify-center rounded border border-[var(--border)] px-8 py-4 text-xs font-medium uppercase tracking-widest text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--color-brass)]"
              >
                Plan a showroom visit
              </button>
            </div>
          </div>
        </section>
      </main>

      <ProductQuickView
        product={selectedProduct}
        image={selectedProduct ? getProductDisplayImage(selectedProduct) : ""}
        whatsappHref={selectedProduct ? productEnquiryHref(selectedProduct) : whatsappHref}
        catalogueHref={
          selectedProduct
            ? catalogueHrefFor(selectedProduct.brandName || selectedProduct.brand || "")
            : undefined
        }
        onClose={() => handleProductSelect(null)}
      />

      <Footer
        settings={settings || undefined}
        brands={brands}
        showroomGroups={sections.map(({ group }) => ({ id: group.id, title: group.title }))}
      />
    </div>
  );
}
