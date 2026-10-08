import React from "react";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import { getHomePage, getSiteSettings, getBrands, getTestimonials, getFaqs, getShowroomGroups, getActiveOffers } from "@/content/sanity/queries";
import { buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import {
  OFFER_HERO_FALLBACK_IMAGE,
  formatOfferDate,
  pickHeroOffers,
  weaveHeroSlides,
  HERO_MAX_SLIDES_HOME,
} from "@/lib/collections/offers";


// Global cinema system
import { AtmosphericBackground } from "@/components/home/AtmosphericBackground";
import { PointerLight } from "@/components/home/PointerLight";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

// 7 Cinematic Chapters
import HeroStage from "@/components/home/HeroStage";           // CH01 — HIGH tension
import BrandTrustStrip from "@/components/brand/BrandTrustStrip";        // CH02 — LOW tension
import CategoryDiscovery from "@/components/home/CategoryDiscovery";       // CH03 — MEDIUM tension
import ProductReel from "@/components/home/ProductReel";                   // CH05 — MEDIUM tension
import FloatingCTA from "@/components/home/FloatingCTA";
import FaqSection from "@/components/home/FaqSection";                   // CH07 — QUIET ZONE

// Mobile specific components
import HeroMobile from "@/components/home/HeroMobile";
import CategoryDiscoveryMobile from "@/components/home/CategoryDiscoveryMobile";
import ProductReelMobile from "@/components/home/ProductReelMobile";
import AboutStory from "@/components/home/AboutStory";
import { HeroSlide } from "@/types/hero";



const fallbackHeroSlides: HeroSlide[] = [
  {
    id: "ch01",
    eyebrow: "ARCHITECTURAL HARDWARE",
    title: "The Art of\nthe Finish.",
    description:
      "Curated hardware for modern spaces. Explore global brands, unmatched quality and expert guidance — at our Sakchi showroom.",
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
  {
    id: "ch04",
    eyebrow: "PRECISION CRAFTSMANSHIP",
    title: "Engineered For\nLasting Impressions.",
    description:
      "From architectural mortise locks to whisper-quiet concealed sliding systems, explore hardware crafted to endure generations.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/cinema/categories/HC-03-KITCHEN.png",
    productUrl: "/cinema/hero/HC-01-HERO-04.png",
    specimenLabel: "Precision engineering",
    specimenCaption: "Modular solutions · Premium finishes",
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
  const [homeData, siteSettings, brands, testimonials, faqs, showroomGroups, offers] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getBrands(),
    getTestimonials(),
    getFaqs(),
    getShowroomGroups(),
    getActiveOffers(),
  ]);
  const populatedGroupIds = showroomGroups.map((group) => group.id);

  const builtInHeroSlides: HeroSlide[] = [
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

  // Offers toggled for the home hero in the Studio join the carousel, up to 3 offers.
  const offerHeroSlides = pickHeroOffers(offers, "home", 3).map<HeroSlide>((offer) => ({
    id: `offer-${offer._id}`,
    eyebrow: offer.validUntil ? `CURRENT OFFER · UNTIL ${formatOfferDate(offer.validUntil).toUpperCase()}` : "CURRENT OFFER",
    title: offer.title,
    description: offer.description || "Ask our Sakchi showroom team for details and availability.",
    primaryCta: "Enquire about this offer",
    ctaTarget: buildWhatsAppLink(`Hardware Collection — I'd like to know more about your offer: ${offer.title}.`, siteSettings),
    imageUrl: offer.imageUrl || OFFER_HERO_FALLBACK_IMAGE,
    specimenLabel: "Current offer",
    specimenCaption: offer.brandName || "Hardware Collection · Sakchi",
  }));

  // Total up to 4 slides on Home page
  const heroSlides = weaveHeroSlides(builtInHeroSlides, offerHeroSlides, HERO_MAX_SLIDES_HOME);


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
        {/* 01 HERO — The Art of the Finish */}
        <div className="block lg:hidden">
          <HeroMobile slides={heroSlides} />
        </div>
        <div className="hidden lg:block">
          <HeroStage slides={heroSlides} />
        </div>

        {/* 02 WHERE TO BEGIN — What are you working on? */}
        <div className="block lg:hidden">
          <CategoryDiscoveryMobile categories={homeData?.featuredCategoryRefs} populatedGroupIds={populatedGroupIds} />
        </div>
        <div className="hidden lg:block theme-ivory">
          <CategoryDiscovery categories={homeData?.featuredCategoryRefs} populatedGroupIds={populatedGroupIds} />
        </div>

        {/* 03 BRAND AUTHORITY — Authorized Brands. Genuine Products. */}
        <div className="theme-ivory">
          <BrandTrustStrip brands={siteSettings?.authorizedBrandRefs || homeData?.trustedBrandRefs} />
        </div>

        {/* 04 FLAGSHIP PIECES — Selected hardware */}
        <div className="block lg:hidden">
          <ProductReelMobile products={homeData?.featuredProductRefs} />
        </div>
        <div className="hidden lg:block theme-ivory">
          <ProductReel products={homeData?.featuredProductRefs} />
        </div>

        {/* 05 WHY HARDWARE COLLECTION — Hardware that completes the space */}
        <div className="theme-ivory">
          <AboutStory 
            id="about" 
            showroomHours={siteSettings?.showroomHours} 
            legacyYearsOfTrust={homeData?.legacyYearsOfTrust}
            legacyBrandsCount={homeData?.legacyBrandsCount}
            legacyShowroomImageUrl={homeData?.legacyShowroomImageUrl}
          />
        </div>

        {/* 06 & 07 VOICES OF TRUST & VISIT SAKCHI */}
        {/* FloatingCTA contains both the reviews (06) and the Consultation Section (07) */}
        <div className="w-full">
          <FloatingCTA reviews={testimonials} heading={homeData?.ctaHeading} description={homeData?.ctaDescription} />
        </div>

        {/* 08 FAQ — Only essential questions */}
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
