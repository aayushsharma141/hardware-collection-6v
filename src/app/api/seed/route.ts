import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/content/fallback/catalog";
import { SHOWROOM_HOURS_FALLBACK } from "@/lib/config";
import { apiVersion, dataset, projectId, useCdn } from "@/content/sanity/env";

export async function POST(request: Request) {
  try {
    // SECURITY: Only allow seeding in development mode
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Seed endpoint disabled in production" }, { status: 403 });
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.SANITY_API_TOKEN}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: process.env.SANITY_API_TOKEN,
    });

    const results = { categories: 0, brands: 0, products: 0 };

    // 1. Seed Brands
    for (const brand of BRANDS) {
      await client.createIfNotExists({
        _id: `brand-${brand.id}`,
        _type: "brand",
        name: brand.name,
        slug: { _type: "slug", current: brand.id },
        description: brand.tagline,
        authorizedStatus: brand.authorized ? "Authorized Dealer" : "Partner",
        displayOrder: BRANDS.indexOf(brand),
        featured: brand.authorized,
      });
      results.brands++;
    }

    // 2. Seed 13 Canonical Categories
    for (const cat of CATEGORIES) {
      await client.createIfNotExists({
        _id: `category-${cat.slug}`,
        _type: "category",
        name: cat.title,
        slug: { _type: "slug", current: cat.slug },
        eyebrow: cat.eyebrow,
        description: cat.shortDesc,
        overview: cat.overview,
        cardVariant: cat.cardVariant,
        primaryRail: cat.primaryRail,
        suitableFor: cat.suitableFor,
        keyFeatures: cat.keyFeatures,
        icon: cat.iconName,
        whatsappMessage: cat.whatsappMessage,
        displayOrder: CATEGORIES.indexOf(cat),
        featured: cat.featured || false,
      });
      results.categories++;
    }

    // 3. Seed Verified Initial Products
    for (const prod of PRODUCTS) {
      await client.createIfNotExists({
        _id: `product-${prod.id}`,
        _type: "product",
        name: prod.name,
        slug: { _type: "slug", current: prod.id },
        catalogReference: prod.catalogReference || prod.model,
        shortDescription: prod.shortDescription || prod.description,
        brand: {
          _type: "reference",
          _ref: `brand-${prod.brand.toLowerCase()}`,
        },
        category: {
          _type: "reference",
          _ref: `category-${prod.categorySlug}`,
        },
        showroomDisplay: prod.displayStatus === "Live Display",
        specifications: prod.specifications?.map(s => ({ _key: s.key, specName: s.key, specValue: s.value })) || [],
        featured: prod.featured || false,
      });
      results.products++;
    }

    // 4. Seed Business Settings
    await client.createOrReplace({
      _id: "siteSettings",
      _type: "siteSettings",
      businessName: "Hardware Collection",
      ownerName: "Mukesh Khandelwal",
      phone: "+91 98351 90738",
      whatsapp: "919835190738",
      email: "info@hardwarecollection.co",
      address: "1/18, Kashidih, Near Durga Puja Maidan,\nSakchi, Jamshedpur, Jharkhand 831001",
      openingHours: SHOWROOM_HOURS_FALLBACK,
      defaultWhatsappMessage: "Hi Hardware Collection, I would like to connect with your consultation desk regarding architectural hardware.",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur",
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.674844391696!2d86.20150000000001!3d22.8028401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e3035e707e07%3A0x8f8ee13c908afec6!2sHardware%20Collection!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      seo: {
        metaTitle: "Hardware Collection | Premium Architectural Hardware in Jamshedpur",
        metaDescription: "Authorized Hafele & Dorset Dealer in Sakchi, Jamshedpur. Premium architectural hardware and digital locks.",
      }
    });

    // 5. Seed Navigation
    await client.createOrReplace({
      _id: "navigation",
      _type: "navigation",
      announcementBar: "",
      mainMenu: [
        { _key: "m1", label: "Collections", path: "/collections" },
        { _key: "m2", label: "Brands & Catalogues", path: "/catalogues" }
      ],
      footerLegalLinks: [
        { _key: "f1", label: "Privacy Policy", path: "/privacy" },
        { _key: "f2", label: "Terms & Conditions", path: "/terms" }
      ],
      socialLinks: [
        { _key: "s1", platform: "Instagram", url: "https://instagram.com/hardwarecollectionjsr" },
        { _key: "s2", platform: "Facebook", url: "https://facebook.com/hardwarecollectionjsr" }
      ]
    });

    // 6. Seed Legal Pages
    await client.createIfNotExists({
      _id: "privacy-policy",
      _type: "legalPage",
      title: "Privacy Policy",
      slug: { _type: "slug", current: "privacy-policy" },
      lastUpdated: new Date().toISOString(),
      content: [
        {
          _type: "block",
          _key: "p1",
          style: "normal",
          children: [{ _type: "span", _key: "s1", text: "Welcome to Hardware Collection's Privacy Policy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us." }]
        }
      ]
    });

    await client.createIfNotExists({
      _id: "terms-and-conditions",
      _type: "legalPage",
      title: "Terms & Conditions",
      slug: { _type: "slug", current: "terms-and-conditions" },
      lastUpdated: new Date().toISOString(),
      content: [
        {
          _type: "block",
          _key: "p1",
          style: "normal",
          children: [{ _type: "span", _key: "s1", text: "These Terms & Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Hardware Collection, concerning your access to and use of the showroom and website." }]
        }
      ]
    });

    return NextResponse.json({ message: "Seeding Complete", results });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Error seeding data", error: errorMessage }, { status: 500 });
  }
}

