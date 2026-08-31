import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/content/fallback/catalog";
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
        status: cat.status,
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
        specifications: prod.specifications || [],
        featured: prod.featured || false,
      });
      results.products++;
    }

    return NextResponse.json({ message: "13 Canonical Collections Seeding Complete", results });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Error seeding data", error: errorMessage }, { status: 500 });
  }
}

