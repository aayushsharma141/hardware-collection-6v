import React from "react";
import Footer from "@/components/layout/Footer";
import { getHomePage, getSiteSettings, getBrands, getTestimonials } from "@/sanity/queries";
import MobileConversionBar from "@/components/home/MobileConversionBar";

// Global cinema system
import { AtmosphericBackground } from "@/components/home/cinema/AtmosphericBackground";
import { PointerLight } from "@/components/home/cinema/PointerLight";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

// 7 Cinematic Chapters
import HeroStage from "@/components/home/HeroStage";           // CH01 — HIGH tension
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

export const revalidate = 60;

const fallbackHeroSlides = [
  {
    id: "ch01",
    eyebrow: "HARDWARE COLLECTION · SAKCHI, JAMSHEDPUR",
    title: "The Art of\nthe Finish.",
    description:
      "Architectural hardware chosen for spaces that deserve better details. Official partner for Häfele, Dorset, Labacha, Godrej & Hettich in Sakchi.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/cinema/hero/HC-01-HERO-01.png",
    productUrl: "/cinema/hero/HC-01-HERO-02.png",
    macroUrl: "/cinema/hero/HC-01-HERO-03.png",
    reflectionUrl: "/cinema/hero/HC-01-HERO-04.png",
  },
  {
    id: "ch02",
    eyebrow: "LIVE SHOWROOM EXPERIENCE",
    title: "Touch Before\nYou Decide.",
    description:
      "Experience German soft-close drawers, live biometric lock demos, and luxury kitchen setups at our Sakchi flagship showroom.",
    primaryCta: "Get Showroom Directions",
    ctaTarget: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9",
    imageUrl: "/cinema/showroom/interior.png",
    // Fallback product overlays for the second slide
    productUrl: "/cinema/hero/HC-01-HERO-03.png",
  },
];

export default async function HomePage() {
  const [homeData, siteSettings, brands, testimonials] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getBrands(),
    getTestimonials(),
  ]);

  const heroSlides =
    homeData?.heroSlides && homeData.heroSlides.length > 0
      ? homeData.heroSlides
      : fallbackHeroSlides;

  return (
    <div
      className="min-h-[100dvh] text-[#1a1017] bg-[#fdf8f0] overflow-x-hidden relative selection:bg-[#8b1a42] selection:text-white"
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

        {/* CH02 — Specified By (LOW)
            Rendered once, for both viewports, which is why the hero above is
            split out rather than nested in the two trees below. This section
            used to live inside the desktop branch only, so the navbar's
            "Brands" link — which scrolls to #brands — pointed at an element
            that does not exist on a phone and did nothing when tapped. A single
            instance also keeps `id="brands"` unique in the document. */}
        <div className="theme-ivory">
          <BrandTrustStrip />
        </div>

        {/* Mobile Experience (Stitch Redesign) */}
        <div className="block lg:hidden">
          <MobileCategoryDiscovery />
          <MobileProductReel />
          <MobileReviews reviews={testimonials} />
          {/* Our Legacy — mirrors the desktop placement: the story of the
              business immediately before the invitation to visit. */}
          <AboutStory id="about-mobile" />
          <MobileConsultation />
        </div>

        {/* Desktop Experience (Legacy) */}
        <div className="hidden lg:block">
          {/* CH03 — Form & Function (MEDIUM) */}
          <div className="theme-ivory">
            <CategoryDiscovery />
          </div>

          {/* CH04 — The Finish · Primary Material Showcase (VERY HIGH) */}
          <div className="theme-ivory">
            <MaterialJourney />
          </div>

          {/* CH05 — The Collection · Emotion→Consideration Bridge (MEDIUM) */}
          <div className="theme-ivory">
            <ProductReel />
          </div>

          {/* CH06 — Inside the Showroom (HIGH) */}
          <div className="theme-ivory">
            <ShowroomCinematic />
          </div>

          {/* CH07 — Come Feel It · Quiet Conversion Zone (QUIET)
               Zone split is internal: reviews → theme-ivory, CTA → theme-dark */}
          <FloatingCTA reviews={testimonials} />
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer settings={siteSettings} brands={brands} />

      {/* ── Mobile Conversion Bar ───────────────────────────────── */}
      {/* Fixed bottom bar: Call / WhatsApp / Visit — hidden on lg+ */}
      <MobileConversionBar />
    </div>
  );
}