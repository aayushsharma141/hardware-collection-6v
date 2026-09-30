import React from "react";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import { getHomePage, getSiteSettings, getBrands, getTestimonials } from "@/content/sanity/queries";
import MobileConversionBar from "@/components/home/MobileConversionBar";

// Global cinema system
import { AtmosphericBackground } from "@/components/home/cinema/AtmosphericBackground";
import { PointerLight } from "@/components/home/cinema/PointerLight";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

// 7 Cinematic Chapters
import HeroStage from "@/components/home/HeroStage";           // CH01 — HIGH tension
import HeroTrustBadges from "@/components/home/HeroTrustBadges";  // 6 Trust Pillars with Icons
import BrandTrustStrip from "@/components/brand/BrandTrustStrip";        // CH02 — LOW tension
import CategoryDiscovery from "@/components/home/CategoryDiscovery";       // CH03 — MEDIUM tension
import MaterialJourney from "@/components/home/MaterialJourney";           // CH04 — VERY HIGH tension
import ProductReel from "@/components/home/ProductReel";                   // CH05 — MEDIUM tension
import ShowroomCinematic from "@/components/home/ShowroomCinematic";       // CH06 — HIGH tension
import FloatingCTA from "@/components/home/FloatingCTA";                   // CH07 — QUIET ZONE

// Mobile specific components
import MobileHero from "@/components/home/mobile/MobileHero";
import MobileCategoryDiscovery from "@/components/home/mobile/MobileCategoryDiscovery";
import MobileProductReel from "@/components/home/mobile/MobileProductReel";
import MobileReviews from "@/components/home/mobile/MobileReviews";
import MobileConsultation from "@/components/home/mobile/MobileConsultation";
import AboutStory from "@/components/home/AboutStory";
import { HeroSlide } from "@/types/hero";

export const revalidate = 60;

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
  
  if (!seo) return {};

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
  };
}

export default async function HomePage() {
  const [homeData, siteSettings, brands, testimonials] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getBrands(),
    getTestimonials(),
  ]);

  const heroSlides: HeroSlide[] = [
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


  return (
    <div
      className="min-h-[100dvh] text-[#1a1017] bg-[#fbf5ea] overflow-x-hidden relative selection:bg-[#8b1a42] selection:text-white"
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
          <MobileHero slides={heroSlides} />
        </div>
        <HeroStage slides={heroSlides} />

        {/* CH02 — Specified By (LOW) */}
        <div className="theme-ivory">
          <BrandTrustStrip brands={homeData?.trustedBrandRefs} />
          <HeroTrustBadges pillars={homeData?.valuePropositions} />
        </div>

        {/* Mobile Mid-Section Experience */}
        <div className="block lg:hidden">
          <MobileCategoryDiscovery categories={homeData?.featuredCategoryRefs} />
          <MobileProductReel products={homeData?.featuredProductRefs} />
          <MobileReviews reviews={testimonials} />
        </div>

        {/* Desktop Mid-Section Experience */}
        <div className="hidden lg:block">
          {/* CH03 — Form & Function (MEDIUM) */}
          <div className="theme-ivory">
            <CategoryDiscovery categories={homeData?.featuredCategoryRefs} />
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
            legacyPillars={homeData?.legacyPillars}
          />
        </div>

        {/* CH07 — Final Conversion & Consultation Zone */}
        <div className="block lg:hidden">
          <MobileConsultation heading={homeData?.ctaHeading} description={homeData?.ctaDescription} cta={homeData?.cta} />
        </div>
        <div className="hidden lg:block">
          <FloatingCTA reviews={testimonials} cta={homeData?.cta} heading={homeData?.ctaHeading} description={homeData?.ctaDescription} />
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer settings={siteSettings} brands={brands} />

      {/* ── Mobile Conversion Bar ───────────────────────────────── */}
      {/* Fixed bottom bar: Call / WhatsApp / Visit — hidden on lg+ */}
      <MobileConversionBar cta={homeData?.cta} />
    </div>
  );
}