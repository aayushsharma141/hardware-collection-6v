import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Cinzel, Manrope } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Premium Hardware & Digital Locks | Hardware Collection",
  description: "Authorized Hafele & Dorset Dealer in Sakchi, Jamshedpur. Premium architectural hardware and digital locks.",
};

import { MotionProvider } from "@/components/providers/MotionProvider";
import { ConsultationDrawer } from "@/components/consultation/ConsultationDrawer";
import Navbar from "@/components/layout/Navbar";
import { CANONICAL_BRANDS } from "@/data/brands";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: "Hardware Collection",
    description:
      "Premier architectural hardware, digital locks, and modular fittings showroom in Sakchi, Jamshedpur.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1/18, Kashidih, Near Baradwari Durga Puja Maidan, Sakchi",
      addressLocality: "Jamshedpur",
      addressRegion: "Jharkhand",
      postalCode: "831001",
      addressCountry: "IN",
    },
    telephone: "+919835190738",
    brand: CANONICAL_BRANDS.map((brand) => ({
      "@type": "Brand",
      name: brand.name,
    })),
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${cinzel.variable} ${manrope.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://wa.me" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-manrope bg-dark-bg text-text-main">
        <MotionProvider>
          <Navbar />
          {children}
        </MotionProvider>
        <ConsultationDrawer />
      </body>
    </html>
  );
}
