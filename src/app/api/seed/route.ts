import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { CATEGORIES, BRANDS } from "@/data/catalog";
import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";

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

    const results = { categories: 0, brands: 0 };

    // Seed Categories
    for (const cat of CATEGORIES) {
      await client.createIfNotExists({
        _id: `category-${cat.id}`,
        _type: "category",
        name: cat.title,
        slug: { _type: "slug", current: cat.id },
        description: cat.shortDesc,
        icon: cat.iconName,
        displayOrder: CATEGORIES.indexOf(cat),
        featured: true,
      });
      results.categories++;
    }

    // Seed Brands
    for (const brand of BRANDS) {
      await client.createIfNotExists({
        _id: `brand-${brand.id}`,
        _type: "brand",
        name: brand.name,
        slug: { _type: "slug", current: brand.id },
        description: brand.tagline,
        displayOrder: BRANDS.indexOf(brand),
        featured: brand.authorized,
      });
      results.brands++;
    }

    return NextResponse.json({ message: "Seeding complete", results });
  } catch (error: any) {
    return NextResponse.json({ message: "Error seeding data", error: error.message }, { status: 500 });
  }
}
