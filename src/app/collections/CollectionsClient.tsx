"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Product, Category, Brand, Offer } from "@/types/catalog";
import { useCollectionsState } from "@/hooks/useCollectionsState";
import { useConsultationStore } from "@/components/consultation/store";
import { buildGeneralInquiryWhatsappLink, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import {
  HERO_FALLBACK_IMAGE,
  formatOfferDate,
  pickHeroOffers,
  weaveHeroSlides,
  HERO_MAX_SLIDES_COLLECTIONS,
} from "@/lib/collections/offers";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";
import {
  allShowroomSections,
  categoryRails,
  categoriesByFamily,
  productCategorySlug,
  showroomGroupId,
} from "@/lib/collections/showroom";

import CollectionsHero, { type HeroSlide } from "@/components/collections/CollectionsHero";
import CollectionExplorer from "@/components/collections/CollectionExplorer";
import ProductQuickView from "@/components/collections/ProductQuickView";
import OffersSection from "@/components/collections/OffersSection";
import ShowroomCta from "@/components/collections/ShowroomCta";

export interface CollectionsClientProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  offers: Offer[];
  settings?: import("@/types/catalog").SiteSettings | null;
  heroManager?: import("@/types/catalog").HeroManager | null;
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
/** Tile photographs for the families the site has artwork for; others use a product or none. */
const FAMILY_TILE_IMAGE: Record<string, string> = {
  door: "/cinema/categories/HC-03-DOORS.png",
  "smart-security": "/cinema/categories/HC-03-SECURITY.png",
  kitchen: "/cinema/categories/HC-03-KITCHEN.png",
  "wardrobe-furniture": "/cinema/categories/HC-03-WARDROBE.png",
  "bathroom-hardware": "/cinema/categories/HC-03-BATHROOM.png",
  glass: "/cinema/categories/HC-03-GLASS.png",
  "furniture-fittings": "/cinema/categories/HC-03-FURNITURE.png",
};

export default function CollectionsClient({
  categories,
  products,
  brands: rawBrands,
  offers,
  settings,
  heroManager: _heroManager,
}: CollectionsClientProps) {
  const brands = useMemo(
    () =>
      Array.from(
        new Map(
          rawBrands.map((b) => {
            const key = normalizeBrandKey(b);
            const enriched = { ...b };
            if (CANONICAL_BRANDS_BY_ID[key]?.logo) {
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
  const sections = useMemo(() => allShowroomSections(products, rails), [products, rails]);

  // Every category under each collection, whether or not a product has been entered for it.
  const familyCategories = useMemo(() => categoriesByFamily(categories, rails), [categories, rails]);

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
        `Hardware Collection: I'd like to know more about ${label}. Could you share what's available at the showroom?`,
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
      `Hardware Collection: I'm interested in ${named}. Could you share finishes, price and availability?`,
      settings
    );
  };

  const offerEnquiryHref = useCallback(
    (title: string) => buildWhatsAppLink(`Hardware Collection: I'd like to know more about your offer: ${title}.`, settings),
    [settings]
  );

  const familyImage = useCallback(
    (familyId: string, familyProducts: Product[]) =>
      FAMILY_TILE_IMAGE[familyId] || familyProducts.find((p) => p.imageUrl)?.imageUrl,
    []
  );

  const brandLogo = useCallback(
    (brandName: string) => {
      const key = normalizeBrandKey({ name: brandName } as Brand);
      const brand = brands.find((b) => normalizeBrandKey(b) === key);
      return brand?.logoUrl || brand?.logo || undefined;
    },
    [brands]
  );

  const whatsappHref = buildGeneralInquiryWhatsappLink(settings?.whatsappNumber);

  // Up to 7 collection slides: 7 showroom categories with active offers woven in, capped at 7.
  const heroSlides = useMemo<HeroSlide[]>(() => {
    const familySlides = sections.flatMap(({ group }) =>
      FAMILY_TILE_IMAGE[group.id]
        ? [{ id: group.id, title: group.title, tagline: group.tagline, image: FAMILY_TILE_IMAGE[group.id] }]
        : []
    );
    const offerSlides = pickHeroOffers(offers, "collections", 3).map<HeroSlide>((offer) => ({
      id: `offer-${offer._id}`,
      title: offer.title,
      tagline: offer.validUntil ? `Current offer · until ${formatOfferDate(offer.validUntil)}` : "Current offer",
      image: offer.imageUrl || HERO_FALLBACK_IMAGE,
      offerHref: offerEnquiryHref(offer.title),
    }));
    return weaveHeroSlides(familySlides, offerSlides, HERO_MAX_SLIDES_COLLECTIONS);
  }, [sections, offers, offerEnquiryHref]);
  const phone = settings?.primaryPhone?.trim();

  return (
    <div className="hc-root min-h-screen w-full bg-[var(--surface)] text-[var(--text-primary)] selection:bg-[var(--color-brass)]/30 selection:text-white">
      <main className="w-full pb-16 sm:pb-0">
        <CollectionsHero slides={heroSlides} whatsappHref={whatsappHref} />

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-2">
          <h1 className="hc-serif text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)] leading-[1.1] font-normal tracking-tight">
            Architectural Hardware Collections
          </h1>
          <p className="mt-4 text-[15px] sm:text-base text-[var(--text-secondary)] font-light max-w-lg">
            Explore hardware by application, from doors and digital security to kitchens, wardrobes, bathrooms and glass systems.
          </p>
        </div>

        <CollectionExplorer
          sections={sections}
          familyCategories={familyCategories}
          familyImage={familyImage}
          brandLogo={brandLogo}
          getImage={getProductDisplayImage}
          onOpenProduct={(product, trigger) => handleProductSelect(product, trigger)}
          enquiryHref={enquiryHref}
          catalogueHrefFor={catalogueHrefFor}
          activeProduct={selectedProduct}
          groupIdOf={(product) => showroomGroupId(productCategorySlug(product), rails)}
        />

        <OffersSection offers={offers} enquiryHref={offerEnquiryHref} />

        <ShowroomCta
          whatsappHref={whatsappHref}
          phone={phone}
          address={settings?.showroomAddress}
          onVisit={() => openDrawer({ source: "collections", intent: "consultation" })}
        />

        {/* Contextual Cross-Link Bridge to Brands & Catalogues */}
        <div className="border-t border-[var(--border)] py-10 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">Brand Directory</p>
            <p className="text-lg sm:text-xl font-light text-[var(--text-primary)] mt-1">Looking for a specific manufacturer or official reference?</p>
          </div>
          <Link
            href="/catalogues"
            className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline inline-flex items-center gap-2 shrink-0"
          >
            <span>Explore Brands & Catalogues</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
