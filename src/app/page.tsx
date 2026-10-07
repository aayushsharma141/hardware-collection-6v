import React from "react";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import { getHomePage, getSiteSettings, getBrands, getTestimonials, getFaqs, getShowroomGroups, getActiveOffers, getHeroManager } from "@/content/sanity/queries";
import { buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { OFFER_HERO_FALLBACK_IMAGE, formatOfferDate } from "@/lib/collections/offers";


// Global cinema system
import { AtmosphericBackground } from "@/components/home/AtmosphericBackground";
import { PointerLight } from "@/components/home/PointerLight";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

// 7 Cinematic Chapters
import HeroStage from "@/components/home/HeroStage";           // CH01 — HIGH tension
import HeroTrustBadges from "@/components/home/HeroTrustBadges";  // 6 Trust Pillars with Icons
import BrandTrustStrip from "@/components/brand/BrandTrustStrip";        // CH02 — LOW tension
import CategoryDiscovery from "@/components/home/CategoryDiscovery";       // CH03 — MEDIUM tension
import MaterialJourney from "@/components/home/MaterialJourney";           // CH04 — VERY HIGH tension
import ProductReel from "@/components/home/ProductReel";                   // CH05 — MEDIUM tension
import ShowroomCinematic from "@/components/home/ShowroomCinematic";       // CH06 — HIGH tension
import FloatingCTA from "@/components/home/FloatingCTA";
import FaqSection from "@/components/home/FaqSection";                   // CH07 — QUIET ZONE

// Mobile specific components
import HeroMobile from "@/components/home/HeroMobile";
import CategoryDiscoveryMobile from "@/components/home/CategoryDiscoveryMobile";
import ProductReelMobile from "@/components/home/ProductReelMobile";
import ReviewsMobile from "@/components/home/ReviewsMobile";
import ConsultationMobile from "@/components/home/ConsultationMobile";
import AboutStory from "@/components/home/AboutStory";
import { HeroSlide } from "@/types/hero";



const fallbackHeroSlides: HeroSlide[] = [
  {
    id: "ch01",
    eyebrow: "ARCHITECTURAL HARDWARE EXPERTS · 10+ YEARS",
    title: "The Art of\nthe Finish.",
    description:
      "Premium architectural hardware and modular solutions, curated for contemporary spaces. Official partner for Häfele, Dorset, Labacha, Godrej & Hettich in Sakchi.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/cinema/hero/HC-01-HERO-01.png",
    productUrl: "/cinema/hero/HC-01-HERO-02.png",
    macroUrl: "/cinema/hero/HC-01-HERO-03.png",
    reflectionUrl: "/cinema/hero/HC-01-HERO-04.png",
    specimenLabel: "Finish study",
    specimenCaption: "Solid brass · Knurled satin gold",
  },
  {
    id: "ch02",
    eyebrow: "LIVE SHOWROOM EXPERIENCE",
    title: "Touch Before\nYou Decide.",
    description:
      "Experience German soft-close drawers, live biometric lock demos, and full-scale luxury kitchen setups at our Sakchi flagship showroom.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/cinema/showroom/interior.png",
    productUrl: "/cinema/hero/HC-01-HERO-03.png",
    specimenLabel: "Live demonstration",
    specimenCaption: "German engineering · Flagship display",
  },
  {
    id: "ch03",
    eyebrow: "CURATED SELECTION · SAKCHI",
    title: "Curated For\nDiscriminating Spaces.",
    description:
      "Biometric security, German kitchen systems, precision door handles, and bathroom accessories engineered for tactile longevity.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/cinema/categories/HC-03-DOORS.png",
    productUrl: "/cinema/materials/HC-04-PVD-BRASS.png",
    specimenLabel: "Architectural security",
    specimenCaption: "SS 304 · Biometric & mortise systems",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getHomePage();
  const seo = homeData?.seo;
  
  return {
    title: seo?.metaTitle || "Hardware Collection | Premium Architectural Hardware in Jamshedpur",
    description: seo?.metaDescription || "Explore premium architectural hardware, digital locks, door handles, kitchen and wardrobe fittings at Hardware Collection, Sakchi, Jamshedpur.",
    alternates: {
      canonical: 'https://hardwarecollection.co',
    },
  };
}

export default async function HomePage() {
  const [homeData, siteSettings, brands, testimonials, faqs, showroomGroups, offers, heroManager] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getBrands(),
    getTestimonials(),
    getFaqs(),
    getShowroomGroups(),
    getActiveOffers(),
    getHeroManager(),
  ]);
  const populatedGroupIds = showroomGroups.map((group) => group.id);

  const hasHomeHero = heroManager?.homeHero && heroManager.homeHero.length > 0;

  const heroSlides: HeroSlide[] = hasHomeHero 
    ? heroManager.homeHero.map((slide, index) => {
        const type = slide.slideType;
        
        if (type === "offer" && slide.offer) {
          return {
            id: `hero-offer-${slide.offer._id || index}`,
            eyebrow: slide.offer.validUntil ? `CURRENT OFFER · UNTIL ${formatOfferDate(slide.offer.validUntil).toUpperCase()}` : "CURRENT OFFER",
            title: slide.offer.title,
            description: slide.offer.description || "Ask our Sakchi showroom team for details and availability.",
            primaryCta: "Enquire about this offer",
            ctaTarget: buildWhatsAppLink(`Hardware Collection — I'd like to know more about your offer: ${slide.offer.title}.`, siteSettings),
            imageUrl: slide.offer.imageUrl || OFFER_HERO_FALLBACK_IMAGE,
            specimenLabel: "Current offer",
            specimenCaption: slide.offer.brandName || "Hardware Collection · Sakchi",
          };
        }
        
        if (type === "collection" && slide.collection) {
          const slug = slide.collection.slug && typeof slide.collection.slug === 'object' ? slide.collection.slug.current : slide.collection.slug;
          return {
            id: `hero-coll-${index}`,
            eyebrow: "FEATURED COLLECTION",
            title: slide.collection.name,
            description: slide.collection.description || "Explore this collection in our Sakchi showroom.",
            primaryCta: "Explore Collection",
            ctaTarget: `/collections#${slug}`,
            imageUrl: slide.collection.imageUrl || slide.collection.heroImageUrl || slide.collection.imageLqip || fallbackHeroSlides[0].imageUrl,
          };
        }

        if (type === "brand" && slide.brand) {
          const brandKey = slide.brand.slug && typeof slide.brand.slug === 'object' ? slide.brand.slug.current : slide.brand.slug;
          return {
            id: `hero-brand-${index}`,
            eyebrow: "AUTHORIZED PARTNER",
            title: slide.brand.name,
            description: slide.subtitle || `Explore ${slide.brand.name} collections and catalogues.`,
            primaryCta: "View Catalogues",
            ctaTarget: brandKey ? `/catalogues?brand=${brandKey}` : "/collections",
            imageUrl: slide.imageDesktopUrl || slide.brand.logoUrl || fallbackHeroSlides[0].imageUrl,
          };
        }

        // Promotional or Custom or fallback for missing ref
        return {
          id: `hero-custom-${index}`,
          eyebrow: slide.subtitle || "SHOWROOM FEATURE",
          title: slide.title || "Premium Hardware",
          description: slide.subtitle || "Curated architectural hardware collections.",
          primaryCta: "Explore",
          ctaTarget: slide.link || "/collections",
          imageUrl: slide.imageDesktopUrl || fallbackHeroSlides[0].imageUrl,
        };
      })
    : (() => {
        // Fallback to legacy behaviour if no slides are defined
        return [
          {
            id: "ch01",
            eyebrow: homeData?.heroEyebrow || fallbackHeroSlides[0].eyebrow,
            title: homeData?.heroHeadline || fallbackHeroSlides[0].title,
            description: homeData?.heroDescription || fallbackHeroSlides[0].description,
            primaryCta: homeData?.primaryCta?.label || fallbackHeroSlides[0].primaryCta,
            ctaTarget: homeData?.primaryCta?.url || fallbackHeroSlides[0].ctaTarget,
            imageUrl: homeData?.heroImageDesktopUrl || fallbackHeroSlides[0].imageUrl,
            productUrl: fallbackHeroSlides[0].productUrl,
            macroUrl: fallbackHeroSlides[0].macroUrl,
            reflectionUrl: fallbackHeroSlides[0].reflectionUrl,
            specimenLabel: fallbackHeroSlides[0].specimenLabel,
            specimenCaption: fallbackHeroSlides[0].specimenCaption,
          },
          ...fallbackHeroSlides.slice(1),
        ];
      })();


  return (
    <div
      className="min-h-[100dvh] text-[var(--text-primary)] bg-[var(--surface)] overflow-x-hidden relative selection:bg-[var(--color-wine)] selection:text-white"
      style={{}}
    >
      {/* ── Global Cinema System ─────────────────────────────────── */}
      {/* z=0: Persistent atmospheric canvas — behind all content */}
      <AtmosphericBackground />

      {/* Scroll progress indicator — subtle top bar */}
      <ScrollProgress />

      {/* Pointer lighting — registered globally, scoped per chapter via .pointer-light */}
      <PointerLight />

      {/* ── 7 Cinematic Chapters ─────────────────────────────────── */}
      <main className="relative z-10">
        {/* CH01 — The Art of the Finish (HIGH) */}
        <div className="block lg:hidden">
          <HeroMobile slides={heroSlides} />
        </div>
        <HeroStage slides={heroSlides} />

        {/* CH02 — Specified By (LOW) */}
        <div className="theme-ivory">
          <BrandTrustStrip brands={siteSettings?.authorizedBrandRefs || homeData?.trustedBrandRefs} />
          <HeroTrustBadges pillars={homeData?.valuePropositions} />
        </div>

        {/* Mobile Mid-Section Experience */}
        <div className="block lg:hidden">
          <CategoryDiscoveryMobile categories={homeData?.featuredCategoryRefs} populatedGroupIds={populatedGroupIds} />
          <ProductReelMobile products={homeData?.featuredProductRefs} />
          <ReviewsMobile reviews={testimonials} />
        </div>

        {/* Desktop Mid-Section Experience */}
        <div className="hidden lg:block">
          {/* CH03 — Form & Function (MEDIUM) */}
          <div className="theme-ivory">
            <CategoryDiscovery categories={homeData?.featuredCategoryRefs} populatedGroupIds={populatedGroupIds} />
          </div>

          {/* CH04 — The Finish · Primary Material Showcase (VERY HIGH) */}
          <div className="theme-ivory">
            <MaterialJourney materials={homeData?.materialFinishes} />
          </div>

          {/* CH05 — The Collection · Emotion→Consideration Bridge (MEDIUM) */}
          <div className="theme-ivory">
            <ProductReel products={homeData?.featuredProductRefs} />
          </div>

          {/* CH06 — Inside the Showroom (HIGH) */}
          <div className="theme-ivory">
            <ShowroomCinematic images={homeData?.showroomGalleryUrls} />
          </div>
        </div>

        {/* CH06.5 — Our Legacy (Single responsive semantic instance) */}
        <div className="theme-ivory">
          <AboutStory 
            id="about" 
            showroomHours={siteSettings?.showroomHours} 
            legacyYearsOfTrust={homeData?.legacyYearsOfTrust}
            legacyBrandsCount={homeData?.legacyBrandsCount}
            legacyShowroomImageUrl={homeData?.legacyShowroomImageUrl}
          />
        </div>

        {/* CH07 — Final Conversion & Consultation Zone */}
        <div className="block lg:hidden">
          <ConsultationMobile heading={homeData?.ctaHeading} description={homeData?.ctaDescription} />
        </div>
        <div className="hidden lg:block">
          <FloatingCTA reviews={testimonials} heading={homeData?.ctaHeading} description={homeData?.ctaDescription} />
        </div>

        {/* CH08 — FAQ */}
        <div className="theme-ivory">
          <FaqSection faqs={faqs} />
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer settings={siteSettings} brands={brands} showroomGroups={showroomGroups} />

      {/* ── Mobile Conversion Bar ───────────────────────────────── */}
      {/* Fixed bottom bar: Call / WhatsApp / Visit — hidden on lg+ */}

    </div>
  );
}
