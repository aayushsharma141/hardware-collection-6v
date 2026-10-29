"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Product, Category, Brand, Offer } from "@/types/catalog";
import { useCollectionsState } from "@/hooks/useCollectionsState";
import { useConsultationStore } from "@/components/consultation/store";
import { buildGeneralInquiryWhatsappLink, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { resolveMapUrl } from "@/lib/config";
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
import CollectionExplorer, { type CategoryBrandChip } from "@/components/collections/CollectionExplorer";
import { verifyBrandMatch } from "@/lib/catalog/search/verifyMatch";
import { buildMatchHref } from "@/lib/catalog/search/matchLink";
import type { CategoryMatches } from "@/lib/catalog/search/types";
import ProductQuickView from "@/components/collections/ProductQuickView";
import OffersSection from "@/components/collections/OffersSection";
import ShowroomCta from "@/components/collections/ShowroomCta";
import CatalogsClient from "@/app/catalogues/CatalogsClient";

export interface CollectionsClientProps {
  categories: Category[];
  products: Product[];
  brands: Brand[];
  offers: Offer[];
  settings?: import("@/types/catalog").SiteSettings | null;
  heroManager?: import("@/types/catalog").HeroManager | null;
  /** Brands whose uploaded catalogues contain each category products, if catalogue search is available. */
  catalogueMatches?: CategoryMatches | null;
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
  catalogueMatches,
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
      return brand?.catalogues?.length ? `/collections?brand=${key}#brand-catalogues` : undefined;
    },
    [brands]
  );

  // Brands that supply each category, from searching the uploaded catalogue PDFs
  // (so it does not depend on products being entered in the CMS). A brand is shown
  // only when a catalogue page actually matched; there is no CMS-based fallback,
  // because a product record does not prove a matching page exists. A match is
  // used only if it was found in the PDF Sanity serves at that position today.
  const categoryBrands = useMemo(() => {
    const byKey = new Map(brands.map((b) => [normalizeBrandKey(b), b]));
    const titles = new Map(categories.map((c) => [c.slug, c.title || c.name || ""]));
    const chips = new Map<string, CategoryBrandChip[]>();
    for (const [slug, matches] of Object.entries(catalogueMatches ?? {})) {
      const list: CategoryBrandChip[] = [];
      for (const match of matches) {
        const brand = byKey.get(match.brandKey);
        const verified = brand ? verifyBrandMatch(brand, match) : null;
        if (!brand || !verified) continue;
        const best = verified.catalogues[0];
        list.push({
          key: match.brandKey,
          name: brand.name || match.brand,
          logo: brand.logoUrl || brand.logo || undefined,
          href: buildMatchHref(verified, titles.get(slug) ?? ""),
          bestPage: best.pages[0].page,
          morePages: best.pages.length - 1,
        });
      }
      if (list.length > 0) chips.set(slug, list);
    }
    return chips;
  }, [brands, categories, catalogueMatches]);

  // Products entered in the CMS under each category, featured first, for the
  // explorer cards. Real records only; a category without any shows none.
  const categoryProducts = useMemo(() => {
    const byCategory = new Map<string, Product[]>();
    for (const product of products) {
      const slug = productCategorySlug(product);
      if (!slug) continue;
      byCategory.set(slug, [...(byCategory.get(slug) ?? []), product]);
    }
    for (const list of byCategory.values()) list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return byCategory;
  }, [products]);

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
      <main className="w-full pb-16 sm:pb-0 pt-[88px] sm:pt-[100px] md:pt-[112px]">
        <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <CollectionsHero slides={heroSlides} whatsappHref={whatsappHref} />
        </div>

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-2">
          <h1 className="hc-serif text-[clamp(2rem,5vw,3.5rem)] text-[var(--text-primary)] leading-[1.1] font-normal tracking-tight text-balance">
            Architectural Hardware Collections
          </h1>
          <p className="mt-4 text-[15px] sm:text-base text-[var(--text-secondary)] font-light max-w-xl text-pretty">
            Find the hardware for your space. Explore by application, from doors and digital security to kitchens, wardrobes, bathrooms and glass systems, and expand any space for the full category specification.
          </p>
        </div>

        <CollectionExplorer
          sections={sections}
          familyCategories={familyCategories}
          familyImage={familyImage}
          categoryBrands={categoryBrands}
          categoryProducts={categoryProducts}
          catalogueSearchAvailable={Boolean(catalogueMatches)}
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
          mapUrl={resolveMapUrl(settings?.googleMapsUrl)}
          onVisit={() => openDrawer({ source: "collections", intent: "consultation" })}
        />

        <section id="brand-catalogues" className="scroll-mt-28 border-t border-[var(--border)] mt-12">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-semibold">Official References</p>
            <h2 className="hc-serif text-3xl sm:text-4xl font-normal text-[var(--text-primary)] mt-2">Brands & Catalogues</h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] font-light">
              Explore our manufacturer partners and view official catalogue pages for product details. For finishes, availability and recommendations, enquire with the showroom.
            </p>
          </div>
          <CatalogsClient
            embedded
            brands={brands}
            settings={settings}
            showroomGroups={sections.map(({ group }) => ({ id: group.id, title: group.title }))}
          />
        </section>
      </main>

      <ProductQuickView
        product={selectedProduct}
        image={selectedProduct ? getProductDisplayImage(selectedProduct) : ""}
        whatsappHref={selectedProduct ? productEnquiryHref(selectedProduct) : whatsappHref}
        catalogueHref={
          selectedProduct
            ? // Open at this brand's matching pages for the product's category when the
              // catalogue search found them; otherwise the catalogue from its start.
              categoryBrands
                .get(productCategorySlug(selectedProduct))
                ?.find(
                  (chip) =>
                    chip.key === normalizeBrandKey({ name: selectedProduct.brandName || selectedProduct.brand || "" } as Brand)
                )?.href ?? catalogueHrefFor(selectedProduct.brandName || selectedProduct.brand || "")
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
