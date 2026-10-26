import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

const ARCHIVE_CATALOGS_DIR = "E:/Hardware-Collection-Archive/Hardware Collection/compressed-catalogs";

interface CatalogDef {
  file: string;
  name: string;
  brandId: string;
  categoryId: string;
}

const CATALOG_DEFS: CatalogDef[] = [
  { file: "blum.pdf", name: "Blum Catalog", brandId: "brand-blum", categoryId: "category-modular-kitchen-hardware" },
  { file: "decor-bath.pdf", name: "Decore Bath Catalog", brandId: "brand-decor-bath", categoryId: "category-bathroom-accessories" },
  { file: "dorset.pdf", name: "Dorset Catalog", brandId: "brand-dorset", categoryId: "category-mortise-door-locks" },
  { file: "geze.pdf", name: "Geze Catalog", brandId: "brand-geze", categoryId: "category-door-closers-stoppers" },
  { file: "godrej.pdf", name: "Godrej Catalog", brandId: "brand-godrej", categoryId: "category-digital-locks" },
  { file: "labacha-long-handle.pdf", name: "Labacha Long Handle", brandId: "brand-labacha", categoryId: "category-cabinet-wardrobe-handles" },
  { file: "labacha-sofa-leg.pdf", name: "Labacha Sofa Leg — Elevé Series", brandId: "brand-labacha", categoryId: "category-cabinet-wardrobe-handles" },
  { file: "liftor.pdf", name: "Liftor Catalog", brandId: "brand-liftor", categoryId: "category-drawer-channels" },
  { file: "madhuram.pdf", name: "Madhuram Catalog", brandId: "brand-madhuram", categoryId: "category-cabinet-wardrobe-handles" },
  { file: "maranello.pdf", name: "Maranello Catalog", brandId: "brand-maranello", categoryId: "category-main-door-handles" },
  { file: "ozone.pdf", name: "Ozone Catalog", brandId: "brand-ozone", categoryId: "category-glass-hardware" },
  { file: "rexton.pdf", name: "Rexton Catalog", brandId: "brand-rexton", categoryId: "category-door-closers-stoppers" },
  { file: "sliding.pdf", name: "Häfele Sliding Systems", brandId: "brand-hafele", categoryId: "category-wardrobe-hardware-sliding" },
  { file: "taco-bigfoot.pdf", name: "Taco Bigfoot Catalog", brandId: "brand-taco", categoryId: "category-hinges-soft-close" },
  { file: "tattva.pdf", name: "Tattva Catalog", brandId: "brand-tattva", categoryId: "category-main-door-handles" },
  { file: "yale.pdf", name: "Yale Catalog", brandId: "brand-yale", categoryId: "category-digital-locks" },
];

async function main() {
  console.log(`Starting ingestion of 16 catalogues into Sanity project [${projectId}]...\n`);

  if (!fs.existsSync(ARCHIVE_CATALOGS_DIR)) {
    console.error(`Archive folder not found at: ${ARCHIVE_CATALOGS_DIR}`);
    process.exit(1);
  }

  for (let i = 0; i < CATALOG_DEFS.length; i++) {
    const item = CATALOG_DEFS[i];
    const fullPath = path.join(ARCHIVE_CATALOGS_DIR, item.file);

    if (!fs.existsSync(fullPath)) {
      console.warn(`  ⚠️ File missing: ${item.file}`);
      continue;
    }

    const docId = `catalogue-${item.file.replace(/\.pdf$/, "").replace(/[^a-z0-9]/g, "-")}`;
    console.log(`[${i + 1}/${CATALOG_DEFS.length}] Uploading ${item.file} (${(fs.statSync(fullPath).size / (1024 * 1024)).toFixed(1)} MB)...`);

    try {
      const stream = fs.createReadStream(fullPath);
      const asset = await client.assets.upload("file", stream, {
        filename: item.file,
        contentType: "application/pdf",
      });

      console.log(`  Uploaded asset -> ${asset._id}`);

      const doc = {
        _id: docId,
        _type: "catalogue",
        catalogueName: item.name,
        brand: {
          _type: "reference",
          _ref: item.brandId,
        },
        category: {
          _type: "reference",
          _ref: item.categoryId,
        },
        pdfFile: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
        version: "2025/2026",
        releaseDate: "2025-01-01",
      };

      await client.createOrReplace(doc);
      console.log(`  ✓ Created catalogue document [${docId}] ("${item.name}")`);

      // Attach catalogue reference to category
      await client
        .patch(item.categoryId)
        .setIfMissing({ catalogues: [] })
        .append("catalogues", [
          {
            _type: "reference",
            _ref: docId,
            _key: docId,
          },
        ])
        .commit();
    } catch (err) {
      console.error(`  ✗ Error uploading ${item.file}:`, (err as Error).message);
    }
  }

  // --- Seed FAQs ---
  console.log("\nSeeding FAQs...");
  const FAQS = [
    {
      _id: "faq-genuine-products",
      _type: "faq",
      question: "Do you have genuine products from authorized brands?",
      answer: "Yes. We are authorized direct partners for Häfele, Dorset, Tattva, Ozone, Blum, Hettich and other premier architectural hardware manufacturers. All products carry full manufacturer warranties and authentication.",
      featured: true,
      sortOrder: 1,
    },
    {
      _id: "faq-visit-showroom",
      _type: "faq",
      question: "Can I visit the showroom to see the products?",
      answer: "Yes, absolutely. Our physical showroom in Sakchi, Jamshedpur features functional demonstration displays where you can touch, operate, and compare finishes across doors, modular kitchens, and digital locks.",
      featured: true,
      sortOrder: 2,
    },
    {
      _id: "faq-guidance-consultation",
      _type: "faq",
      question: "Do you provide guidance for home or modular kitchen projects?",
      answer: "Yes. Our hardware specialists provide one-on-one consultation for homeowners, architects, and interior designers, assisting with technical hardware scheduling, load calculations, and finish coordination.",
      featured: true,
      sortOrder: 3,
    },
    {
      _id: "faq-catalogue-pricing",
      _type: "faq",
      question: "How can I get a catalogue or price information?",
      answer: "You can browse all digital brand catalogues directly on our website, or contact our Sakchi team via WhatsApp with your project requirements for personalized catalogs and pricing.",
      featured: true,
      sortOrder: 4,
    },
  ];

  for (const faq of FAQS) {
    await client.createOrReplace(faq);
    console.log(`  Seeded FAQ: ${faq.question.slice(0, 40)}...`);
  }

  // --- Seed Testimonials ---
  console.log("\nSeeding Testimonials...");
  const TESTIMONIALS = [
    {
      _id: "testimonial-1",
      _type: "testimonial",
      customerName: "Ankit Agarwal",
      testimonialText: "Exceptional collection of Häfele and Dorset architectural hardware. The team in Sakchi helped us select the exact mortise locks and soft-close drawer fittings for our home.",
      rating: 5,
      source: "Google Reviews",
      date: "2026-03-15",
      approved: true,
    },
    {
      _id: "testimonial-2",
      _type: "testimonial",
      customerName: "Dr. S. P. Sharma",
      testimonialText: "Best showroom in Jamshedpur for premium hardware. Mukesh-ji and the staff guided us with load calculations and finishes for our entire modular kitchen.",
      rating: 5,
      source: "Google Reviews",
      date: "2026-02-20",
      approved: true,
    },
    {
      _id: "testimonial-3",
      _type: "testimonial",
      customerName: "Rajesh Murmu",
      testimonialText: "Smooth experience purchasing digital locks and glass partition fittings. Great technical support and genuine manufacturer warranty.",
      rating: 5,
      source: "Google Reviews",
      date: "2026-01-10",
      approved: true,
    },
    {
      _id: "testimonial-4",
      _type: "testimonial",
      customerName: "Priya Sengupta",
      testimonialText: "Wide range of designer door handles and Blum fittings. Everything under one roof with live working demonstration displays.",
      rating: 5,
      source: "Google Reviews",
      date: "2025-11-28",
      approved: true,
    },
  ];

  for (const t of TESTIMONIALS) {
    await client.createOrReplace(t);
    console.log(`  Seeded Testimonial: ${t.customerName}`);
  }

  const counts = await client.fetch(`{
    "catalogues": count(*[_type == "catalogue"]),
    "faqs": count(*[_type == "faq"]),
    "testimonials": count(*[_type == "testimonial"])
  }`);

  console.log("\n🎉 INGESTION COMPLETE!");
  console.log(`  Catalogues  : ${counts.catalogues}`);
  console.log(`  FAQs        : ${counts.faqs}`);
  console.log(`  Testimonials: ${counts.testimonials}\n`);
}

main().catch(console.error);
