import Navbar from "@/components/Navbar";
import HeroCarousel, { HeroSlide } from "@/components/home/HeroCarousel";
import BrandTrustStrip from "@/components/BrandTrustStrip";
import ProductCatalog from "@/components/ProductCatalog";
import ShowroomExperience from "@/components/ShowroomExperience";
import Testimonials from "@/components/Testimonials";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import Footer from "@/components/Footer";

const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Authorized Architectural Hardware Showroom",
    title: "Premium Hardware\n& Digital Locks",
    description: "20+ years of trusted supply. Official dealer for Hafele, Dorset, Labacha & Hettich in Sakchi, Jamshedpur.",
    primaryCta: "Explore Collections",
    ctaTarget: "/collections",
    imageUrl: "/Hardware Collection/hardware_collection_sakchi_shop_exterior_view.png",
  },
  {
    eyebrow: "Live Showroom Experience",
    title: "Touch Before\nYou Decide",
    description: "Visit our showroom to experience German soft-close drawers, biometric lock demos, and luxury kitchen setups in person.",
    primaryCta: "Get Directions",
    ctaTarget: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9",
    imageUrl: "/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg",
  },
  {
    eyebrow: "Expert Consultation",
    title: "Architect &\nBuilder Trusted",
    description: "Architects, builders and homeowners across East Singhbhum choose us for specification-grade hardware supply.",
    primaryCta: "WhatsApp Enquiry",
    ctaTarget: "https://wa.me/919835190738",
    imageUrl: "/Hardware Collection/hero_bg.png",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] text-[var(--color-text-main)]">
      <Navbar />

      <main>
        {/* Zone 1 - Hero Carousel */}
        <HeroCarousel slides={heroSlides} />

        {/* Zone 2 - Brand Trust Strip */}
        <BrandTrustStrip />

        {/* Zone 3 - Product Catalog Preview */}
        <ProductCatalog />

        {/* Zone 4 - Showroom Experience */}
        <ShowroomExperience />

        {/* Zone 5 - Social Proof */}
        <Testimonials />
      </main>

      <Footer />

      {/* Floating WhatsApp CTA */}
      <WhatsAppCTA />
    </div>
  );
}