/**
 * seed-complete-migration.ts — seeds an EMPTY Sanity project (used for the
 * 2026-10-26 move to hoghkg00) from the repo's fallback content and public/
 * images: brands, 13 categories, fallback products, siteSettings, navigation,
 * homePage and heroManager.
 *
 * It is not an export/import. It brings over no catalogues/PDFs, testimonials,
 * FAQs, offers, legal pages or curated collections, and none of the owner's
 * Studio edits. Every document is written with createOrReplace, so running it
 * against a project people already edit OVERWRITES their changes.
 *
 * DRY RUN BY DEFAULT: prints the target and what would be written. --apply writes.
 *
 * Usage:
 *   npx tsx scripts/cms/seed-complete-migration.ts            # dry run
 *   npx tsx scripts/cms/seed-complete-migration.ts --apply    # write
 */
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { CANONICAL_BRANDS } from "../../src/content/fallback/brands";
import { CATEGORIES, PRODUCTS } from "../../src/content/fallback/catalog";
import { railGroupId } from "../../src/lib/collections/showroom";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity credentials in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-12",
  useCdn: false,
  token,
});

async function uploadLocalImage(relPath: string) {
  const fullPath = path.resolve(process.cwd(), "public", relPath.replace(/^\//, ""));
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return null;
  }
  try {
    const stream = fs.createReadStream(fullPath);
    const asset = await client.assets.upload("image", stream, {
      filename: path.basename(fullPath),
    });
    console.log(`Uploaded image: ${relPath} -> ${asset._id}`);
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.warn(`Failed to upload ${relPath}:`, (err as Error).message);
    return null;
  }
}

const apply = process.argv.includes("--apply");

async function main() {
  if (!apply) {
    const existing = await client.fetch<number>(`count(*[!(_type match "sanity.*") && !(_type match "system.*")])`);
    console.log(`DRY RUN (nothing will be written)  project: ${projectId}  dataset: ${dataset}`);
    console.log(`  documents already in the dataset: ${existing}${existing > 0 ? "  <- these would be OVERWRITTEN where ids match" : ""}`);
    console.log(`  would upload: 7 family renders, 3 showroom images, 4 hero slides, ${CANONICAL_BRANDS.filter((b) => b.logo).length} brand logos`);
    console.log(`  would write: ${CANONICAL_BRANDS.length} brands, ${CATEGORIES.length} categories, ${PRODUCTS.length} products,`);
    console.log("               siteSettings, navigation, homePage, heroManager");
    console.log("\nRe-run with --apply to write.");
    return;
  }

  console.log(`Starting complete Sanity migration into project ${projectId} (dataset: ${dataset})...\n`);

  // --- 1. Upload Family / Category Imagery ---
  console.log("1. Uploading family & category renders...");
  const familyImages: Record<string, any> = {
    door: await uploadLocalImage("cinema/categories/HC-03-DOORS.png"),
    "smart-security": await uploadLocalImage("cinema/categories/HC-03-SECURITY.png"),
    kitchen: await uploadLocalImage("cinema/categories/HC-03-KITCHEN.png"),
    "wardrobe-furniture": await uploadLocalImage("cinema/categories/HC-03-WARDROBE.png"),
    "bathroom-hardware": await uploadLocalImage("cinema/categories/HC-03-BATHROOM.png"),
    glass: await uploadLocalImage("cinema/categories/HC-03-GLASS.png"),
    "furniture-fittings": await uploadLocalImage("cinema/categories/HC-03-FURNITURE.png"),
  };

  // --- 2. Upload Showroom & Editorial Images ---
  console.log("\n2. Uploading showroom & consultation images...");
  const exteriorImg = await uploadLocalImage("cinema/showroom/exterior.png");
  const interiorImg = await uploadLocalImage("cinema/showroom/interior.png");
  const consultationImg = await uploadLocalImage("cinema/consultation/consultation-editorial-v2.jpg");

  // --- 3. Upload Hero Slides ---
  console.log("\n3. Uploading hero slide images...");
  const hero1 = await uploadLocalImage("cinema/hero/HC-01-HERO-01.png");
  const hero2 = await uploadLocalImage("cinema/hero/HC-01-HERO-02.png");
  const hero3 = await uploadLocalImage("cinema/hero/HC-01-HERO-03.png");
  const hero4 = await uploadLocalImage("cinema/hero/HC-01-HERO-04.png");

  // --- 4. Upload Brand Logos & Seed Brands ---
  console.log("\n4. Seeding brands & uploading brand logos...");
  const brandDocIds: string[] = [];
  const brandBySlug = new Map<string, string>();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const brandByNameNorm = new Map<string, string>();

  for (let i = 0; i < CANONICAL_BRANDS.length; i++) {
    const b = CANONICAL_BRANDS[i];
    let logoAsset = null;
    if (b.logo) {
      logoAsset = await uploadLocalImage(b.logo);
    }
    const brandDocId = `brand-${b.id}`;
    const doc = {
      _id: brandDocId,
      _type: "brand",
      name: b.name,
      slug: { _type: "slug", current: b.id },
      country: b.country,
      tier: b.tier,
      authorized: b.authorized,
      authorizedStatus: "Authorized Partner",
      website: b.website || undefined,
      tagline: b.tagline,
      description: b.description,
      establishedYear: b.establishedYear,
      displayOrder: i,
      featured: b.authorized,
      ...(logoAsset ? { logo: logoAsset } : {}),
    };
    await client.createOrReplace(doc);
    brandDocIds.push(brandDocId);
    brandBySlug.set(b.id, brandDocId);
    brandByNameNorm.set(norm(b.name), brandDocId);
    console.log(`  Seeded brand: ${b.name}`);
  }

  // --- 5. Seed Site Settings ---
  console.log("\n5. Seeding Site Settings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    businessName: "Hardware Collection",
    ownerName: "Mukesh Khandelwal",
    phone: "+91 98351 90738",
    whatsapp: "919835190738",
    defaultWhatsappMessage: "Hi Hardware Collection, I would like to enquire about your architectural hardware collections.",
    email: "hardwarecollectionjsr@gmail.com",
    address: "1/18, Kashidih, Near Durga Puja Maidan,\nSakchi, Jamshedpur,\nJharkhand 831001",
    openingHours: "Mon–Sun: 10:00 AM – 8:00 PM",
    instagramUrl: "https://www.instagram.com/hardwarecollection_jsr/",
    facebookUrl: "https://www.facebook.com/hardwarecollectionjsr/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hardware+Collection,+Kashidih,+Sakchi,+Jamshedpur",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.892699292556!2d86.20885231542845!3d22.806427385061614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31e5088fcc1%3A0x6fb7ebaa2fb0327e!2sKashidih%2C%20Sakchi%2C%20Jamshedpur%2C%20Jharkhand%20831001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    authorizedBrands: brandDocIds.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: id,
    })),
  });
  console.log("  Seeded siteSettings successfully");

  // --- 6. Seed Global Navigation ---
  console.log("\n6. Seeding Global Navigation...");
  await client.createOrReplace({
    _id: "navigation",
    _type: "navigation",
    mainMenu: [
      { _key: "menu-collections", label: "Collections", path: "/collections" },
      // Matches NAV_LINKS_FALLBACK in Navbar.tsx, the menu the live site shows.
      { _key: "menu-catalogues", label: "Brands & Catalogues", path: "/catalogues" },
    ],
    footerLegalLinks: [
      { _key: "legal-privacy", label: "Privacy Policy", path: "/privacy" },
      { _key: "legal-terms", label: "Terms of Service", path: "/terms" },
    ],
    socialLinks: [
      { _key: "social-instagram", platform: "Instagram", url: "https://www.instagram.com/hardwarecollection_jsr/" },
      { _key: "social-whatsapp", platform: "WhatsApp", url: "https://wa.me/919835190738" },
      { _key: "social-facebook", platform: "Facebook", url: "https://www.facebook.com/hardwarecollectionjsr/" },
    ],
  });
  console.log("  Seeded navigation successfully");

  // --- 7. Seed Home Page ---
  console.log("\n7. Seeding Home Page...");
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    // Field names follow schemaTypes/homePage.ts. The legacy, why-choose and
    // showroom headings have no schema fields; the site keeps that copy in code.
    heroHeadline: "The Art of the Finish.",
    heroDescription: "Architectural Hardware for Jamshedpur's Finest Homes. Where precision engineering meets unparalleled aesthetic vision.",
    valuePropositions: [
      {
        _key: "f1",
        title: "Authorized Dealer Network",
        description: "Direct partnerships with global brands like Hafele, Hettich, Blum, and Godrej. We provide full warranty support and ensure product authenticity.",
      },
      {
        _key: "f2",
        title: "Expert Curation & Compatibility",
        description: "With more than 10 years of technical knowledge, we ensure your mortise locks fit your doors perfectly and your kitchen systems are engineered for the required weight.",
      },
      {
        _key: "f3",
        title: "After-Sales Support",
        description: "We don't just sell boxes. We assist with installation diagrams, technical support, and post-purchase service coordination.",
      },
    ],
    ...(exteriorImg ? { showroomExteriorImage: exteriorImg } : {}),
    ...(interiorImg ? { showroomInteriorImage: interiorImg } : {}),
    ...(consultationImg ? { consultationImage: consultationImg } : {}),
  });
  console.log("  Seeded homePage successfully");

  // --- 8. Seed Hero Manager ---
  console.log("\n8. Seeding Hero Manager...");
  // Shape follows schemaTypes/objects/heroSlide.ts: a "promotional" slide with
  // imageDesktop and link, which is what getHeroManagerQuery reads.
  const slideSpecs = [
    { key: "slide-1", image: hero1, title: "The Art of Architectural Finishes", subtitle: "Curated luxury hardware for residences across Jamshedpur", link: "/collections" },
    { key: "slide-2", image: hero2, title: "German Precision in Motion", subtitle: "Official partners for Häfele, Hettich & Blum systems", link: "/catalogues" },
    { key: "slide-3", image: hero3, title: "Biometric & Digital Security", subtitle: "Touchless entry and multi-point mortise security locks", link: "/collections#smart-security" },
    { key: "slide-4", image: hero4, title: "Visit Our Sakchi Showroom", subtitle: "Experience tactile finishes and smooth mechanics in person", link: "/#showroom" },
  ];
  const slides = slideSpecs
    .filter((s) => s.image)
    .map((s) => ({
      _key: s.key,
      _type: "heroSlide",
      slideType: "promotional",
      title: s.title,
      subtitle: s.subtitle,
      imageDesktop: s.image,
      link: s.link,
    }));

  if (slides.length > 0) {
    await client.createOrReplace({
      _id: "heroManager",
      _type: "heroManager",
      homeHero: slides,
      collectionHero: slides,
    });
    console.log("  Seeded heroManager successfully");
  }

  // --- 9. Seed Categories ---
  console.log(`\n9. Seeding ${CATEGORIES.length} Categories...`);
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const rail = railGroupId(cat.slug);
    const cardImg = familyImages[rail] || familyImages["door"];

    // Find brands attributed to this category
    const catBrandRefs = [];
    if (cat.brands && Array.isArray(cat.brands)) {
      for (const bName of cat.brands) {
        const bId = brandByNameNorm.get(norm(bName));
        if (bId) {
          catBrandRefs.push({
            _type: "reference",
            _ref: bId,
            _key: bId,
          });
        }
      }
    }

    const doc: any = {
      _id: `category-${cat.slug}`,
      _type: "category",
      name: cat.title,
      slug: { _type: "slug", current: cat.slug },
      eyebrow: cat.eyebrow,
      description: cat.shortDesc,
      overview: cat.overview,
      cardVariant: cat.cardVariant,
      primaryRail: rail,
      suitableFor: cat.suitableFor || ["Residential", "Commercial"],
      keyFeatures: cat.keyFeatures || [],
      searchKeywords: cat.subcategories || [],
      icon: cat.iconName,
      whatsappMessage: cat.whatsappMessage,
      featured: cat.featured ?? false,
      verificationStatus: cat.verificationStatus,
      displayOrder: i,
      ...(cardImg ? { categoryImage: cardImg } : {}),
      ...(catBrandRefs.length > 0 ? { brands: catBrandRefs } : {}),
    };

    await client.createOrReplace(doc);
    console.log(`  Seeded category [${cat.slug}] -> rail=${rail}`);
  }

  // --- 10. Seed Products ---
  console.log(`\n10. Seeding ${PRODUCTS.length} Products...`);
  for (const prod of PRODUCTS) {
    const brandId = brandByNameNorm.get(norm(prod.brand)) || `brand-${prod.brand.toLowerCase()}`;
    const categoryId = `category-${prod.categorySlug}`;

    const doc: any = {
      _id: `product-${prod.id}`,
      _type: "product",
      name: prod.name,
      slug: { _type: "slug", current: prod.id },
      catalogReference: prod.catalogReference,
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      category: {
        _type: "reference",
        _ref: categoryId,
      },
      shortDescription: prod.shortDescription,
      description: prod.description,
      features: prod.features,
      finishes: prod.finishes,
      application: prod.application,
      featured: prod.featured ?? false,
      whatsappMessage: prod.whatsappMessage,
      material: prod.material,
      durability: prod.durability,
      dimensions: prod.dimensions,
      showroomBay: prod.showroomBay,
      displayStatus: prod.displayStatus,
      specifications: prod.specifications?.map((s) => ({
        _key: s.key.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        key: s.key,
        value: s.value,
      })),
    };

    await client.createOrReplace(doc);
    console.log(`  Seeded product: ${prod.name}`);
  }

  const totalCount = await client.fetch<number>("count(*)");
  console.log(`\n🎉 MIGRATION COMPLETE! Total documents in new Sanity project: ${totalCount}`);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
