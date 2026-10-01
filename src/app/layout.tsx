import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Cinzel, Manrope, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Jost is a geometric sans in the Futura lineage, used only for the brand
 * wordmark. Futura itself is a licensed Monotype face and cannot be bundled;
 * swap the `--font-wordmark` value for a self-hosted Futura when a licence is
 * bought and nothing else has to change.
 */
const jost = Jost({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

import { getSiteSettings, getNavigation } from "@/content/sanity/queries";
import { CANONICAL_BRANDS } from "@/content/fallback/brands";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ConsultationDrawer } from "@/components/consultation/ConsultationDrawer";
import Navbar from "@/components/layout/Navbar";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import DraftModeBanner from "@/components/preview/DraftModeBanner";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = settings?.seo;

  return {
    title: {
      default: seo?.metaTitle || "Hardware Collection | Premium Architectural Hardware in Jamshedpur",
      template: "%s | Hardware Collection",
    },
    description: seo?.metaDescription || "Authorized Hafele & Dorset Dealer in Sakchi, Jamshedpur. Premium architectural hardware and digital locks.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavigation()]);
  const { isEnabled: isDraftMode } = await draftMode();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: "Hardware Collection",
    description:
      settings?.seo?.description || "Premier architectural hardware, digital locks, and modular fittings showroom in Sakchi, Jamshedpur.",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.showroomAddress || "1/18, Kashidih, Near Durga Puja Maidan, Sakchi",
      addressLocality: "Jamshedpur",
      addressRegion: "Jharkhand",
      postalCode: "831001",
      addressCountry: "IN",
    },
    telephone: settings?.primaryPhone || "+919835190738",
    brand: CANONICAL_BRANDS.map((brand) => ({
      "@type": "Brand",
      name: brand.name,
    })),
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${cinzel.variable} ${manrope.variable} ${jost.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://wa.me" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-manrope hc-root antialiased">
        <MotionProvider>
          <Navbar
            primaryPhone={settings?.primaryPhone}
            whatsappNumber={settings?.whatsappNumber}
            defaultWhatsappMessage={settings?.defaultWhatsappMessage}
            announcementBar={nav?.announcementBar}
            mainMenu={nav?.mainMenu}
          />
          {children}
        </MotionProvider>
        <ConsultationDrawer />
        {isDraftMode && <VisualEditing />}
        {isDraftMode && <DraftModeBanner />}
      </body>
    </html>
  );
}
