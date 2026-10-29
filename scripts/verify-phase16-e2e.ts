import fs from "fs";
import path from "path";
import nextConfig from "../next.config";

interface CheckResult {
  category: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: CheckResult[] = [];

function record(category: string, name: string, passed: boolean, details: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${category}] ${name}: ${details}`);
}

async function runVerification() {
  console.log("==================================================================");
  console.log("🔍 PHASE 16 E2E VERIFICATION SUITE — SYNTHETIC & LIVE AUDIT");
  console.log("==================================================================\n");

  // ── 1. Host Header / X-Robots-Tag Check ────────────────────────
  console.log("--- 1. PREVIEW HOST HEADERS (X-Robots-Tag) ---");
  const headersList = typeof nextConfig.headers === "function" ? await nextConfig.headers() : [];
  const previewRule = headersList.find((h) =>
    h.has?.some((has) => has.type === "host" && (has.value as string).includes("vercel\\.app"))
  );

  if (previewRule) {
    const hostPatternStr = previewRule.has?.find((h) => h.type === "host")?.value as string;
    const regex = new RegExp(`^${hostPatternStr}$`);
    const noindexVal = previewRule.headers?.find((h) => h.key === "X-Robots-Tag")?.value;

    const testHosts = [
      { host: "hc-demo-ten.vercel.app", expectedMatch: true },
      { host: "hardware-collection-preview-pr-12.vercel.app", expectedMatch: true },
      { host: "www.hardwarecollection.co", expectedMatch: false },
      { host: "hardwarecollection.co", expectedMatch: false },
    ];

    for (const { host, expectedMatch } of testHosts) {
      const matched = regex.test(host);
      const passed = matched === expectedMatch;
      record(
        "Headers",
        `Host match: ${host}`,
        passed,
        matched ? `Matches regex and receives X-Robots-Tag: ${noindexVal}` : "Does not match preview rule (clean)"
      );
    }
  } else {
    record("Headers", "Preview host rule presence", false, "Preview host regex rule not found in nextConfig.headers");
  }

  // ── 2. Host Redirects (Bare Domain & Legacy Host) ──────────────
  console.log("\n--- 2. CANONICAL REDIRECTS (Bare Domain & Legacy Host) ---");
  const redirects = typeof nextConfig.redirects === "function" ? await nextConfig.redirects() : [];

  const checkRedirect = (host: string, sourcePath: string) => {
    const rule = redirects.find(
      (r) =>
        r.source === "/:path*" &&
        r.has?.some((h) => h.type === "host" && h.value === host)
    );
    if (!rule) {
      record("Redirects", `Redirect for host ${host}`, false, `No /:path* redirect rule configured for ${host}`);
      return;
    }
    const dest = rule.destination.replace("/:path*", sourcePath);
    record(
      "Redirects",
      `Redirect: ${host}${sourcePath}`,
      rule.permanent === true && dest === `https://www.hardwarecollection.co${sourcePath}`,
      `301 permanent -> ${dest}`
    );
  };

  checkRedirect("hardwarecollection.co", "/");
  checkRedirect("hardwarecollection.co", "/collections");
  checkRedirect("hardwarecollection.co", "/deep/path/finishes");
  checkRedirect("jamshedpurhardware.com", "/");
  checkRedirect("jamshedpurhardware.com", "/collections");
  checkRedirect("jamshedpurhardware.com", "/deep/path/locks");

  // ── 3. Production HTML Heading Hierarchy ───────────────────────
  console.log("\n--- 3. RAW HTML SINGLE H1 AUDIT ---");
  const nextServerDir = path.resolve(process.cwd(), ".next/server/app");

  const checkHtmlH1 = (filename: string, route: string, expectedTextSnippet: string) => {
    const filePath = path.join(nextServerDir, filename);
    if (!fs.existsSync(filePath)) {
      record("HTML H1", `Route ${route}`, false, `Static HTML file not found at ${filePath}. Run npm run build first.`);
      return;
    }
    const html = fs.readFileSync(filePath, "utf-8");
    const h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const count = h1Matches.length;
    const content = h1Matches[0] || "";
    const hasSnippet = content.toLowerCase().includes(expectedTextSnippet.toLowerCase());
    record(
      "HTML H1",
      `Route ${route} H1 count`,
      count === 1 && hasSnippet,
      `Found ${count} <h1>. Snippet check ("${expectedTextSnippet}"): ${hasSnippet ? "PASS" : "FAIL"}`
    );
  };

  checkHtmlH1("index.html", "/", "Sakchi, Jamshedpur");
  checkHtmlH1("collections.html", "/collections", "Architectural Hardware Collections");
  checkHtmlH1("catalogues.html", "/catalogues", "Brands &amp; Catalogues");

  // ── 4. Server-Rendered Taxonomy & Cross-Links ───────────────────
  console.log("\n--- 4. TAXONOMY & BIDIRECTIONAL CROSS-LINKS ---");
  const collectionsHtmlPath = path.join(nextServerDir, "collections.html");
  if (fs.existsSync(collectionsHtmlPath)) {
    const collHtml = fs.readFileSync(collectionsHtmlPath, "utf-8");
    const families = [
      "door",
      "smart-security",
      "kitchen",
      "wardrobe-furniture",
      "bathroom-hardware",
      "glass",
      "furniture-fittings",
    ];

    const missingFamilies = families.filter((f) => !collHtml.includes(`id="${f}"`));
    record(
      "Taxonomy",
      "7 Showroom Families in HTML",
      missingFamilies.length === 0,
      missingFamilies.length === 0 ? "All 7 families present with deep-link anchors" : `Missing: ${missingFamilies.join(", ")}`
    );

    const hasDetailsSummary = collHtml.includes("<details") && collHtml.includes("<summary");
    record(
      "Taxonomy",
      "Native <details>/<summary> Disclosure",
      hasDetailsSummary,
      hasDetailsSummary ? "Native disclosure tags present in static HTML" : "Missing <details>/<summary>"
    );

    const hasCataloguesCrossLink = collHtml.includes('href="/catalogues"');
    record(
      "Cross-Links",
      "/collections -> /catalogues bridge",
      hasCataloguesCrossLink,
      hasCataloguesCrossLink ? "Crawlable anchor href='/catalogues' present" : "Missing cross-link"
    );
  }

  const cataloguesHtmlPath = path.join(nextServerDir, "catalogues.html");
  if (fs.existsSync(cataloguesHtmlPath)) {
    const catHtml = fs.readFileSync(cataloguesHtmlPath, "utf-8");
    const hasCollectionsCrossLink = catHtml.includes('href="/collections"');
    record(
      "Cross-Links",
      "/catalogues -> /collections bridge",
      hasCollectionsCrossLink,
      hasCollectionsCrossLink ? "Crawlable anchor href='/collections' present" : "Missing cross-link"
    );
  }

  // ── 5. Schema.org JSON-LD Validation ───────────────────────────
  console.log("\n--- 5. SCHEMA.ORG HARDWARESTORE VALIDATION ---");
  const indexHtmlPath = path.join(nextServerDir, "index.html");
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
    const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const schemaObj = JSON.parse(jsonLdMatch[1]);
        const graph = schemaObj["@graph"] || [schemaObj];
        const hardwareStore = graph.find((item: any) => item["@type"] === "HardwareStore");

        if (hardwareStore) {
          record(
            "Schema",
            "@type: HardwareStore",
            true,
            `Found entity with @id: ${hardwareStore["@id"]}`
          );

          const hasGeo = hardwareStore.geo?.latitude === 22.8028401 && hardwareStore.geo?.longitude === 86.2015;
          record("Schema", "GeoCoordinates", hasGeo, `lat: ${hardwareStore.geo?.latitude}, lon: ${hardwareStore.geo?.longitude}`);

          const hasHours = Array.isArray(hardwareStore.openingHoursSpecification) && hardwareStore.openingHoursSpecification.length > 0;
          record("Schema", "OpeningHoursSpecification", hasHours, `Found ${hardwareStore.openingHoursSpecification?.length} schedule blocks`);

          const hasMap = typeof hardwareStore.hasMap === "string" && hardwareStore.hasMap.length > 0;
          record("Schema", "hasMap Link", hasMap, `Map URL: ${hardwareStore.hasMap}`);

          const phoneIsPrimary = hardwareStore.telephone?.includes("9835190738") || hardwareStore.telephone?.includes("98351 90738");
          const secondaryPhoneExcluded = !JSON.stringify(hardwareStore).includes("7033650739");
          record(
            "Schema",
            "Telephone Filtering (Primary only)",
            phoneIsPrimary && secondaryPhoneExcluded,
            `Primary: ${hardwareStore.telephone}, Secondary (+91 70336 50739) excluded: ${secondaryPhoneExcluded}`
          );
        } else {
          record("Schema", "@type: HardwareStore", false, "HardwareStore entity not found in @graph");
        }
      } catch (err: any) {
        record("Schema", "JSON-LD Parsing", false, `JSON parse error: ${err.message}`);
      }
    } else {
      record("Schema", "JSON-LD Script Presence", false, "No application/ld+json script tag found in index.html");
    }
  }

  // ── 6. GSAP Animation & Screen-Reader Checks ───────────────────
  console.log("\n--- 6. GSAP ANIMATION & ACCESSIBILITY CHECKS ---");
  const heroStageFile = fs.readFileSync(path.resolve(process.cwd(), "src/components/home/HeroStage.tsx"), "utf-8");
  const hasHeroH1Class = heroStageFile.includes('className="hero-h1') || heroStageFile.includes('className="hero-sub hero-h1') || heroStageFile.includes('hero-h1');
  record(
    "GSAP",
    "HeroStage .hero-h1 animation target selector",
    hasHeroH1Class,
    hasHeroH1Class ? ".hero-h1 class retained for GSAP timeline targeting" : "Missing .hero-h1 class"
  );

  const homePageFile = fs.readFileSync(path.resolve(process.cwd(), "src/app/page.tsx"), "utf-8");
  const hasSrOnlyH1 = homePageFile.includes('<h1 className="sr-only">');
  record(
    "Accessibility",
    "Homepage sr-only semantic H1",
    hasSrOnlyH1,
    hasSrOnlyH1 ? "Accessible sr-only H1 present for screen readers" : "Missing sr-only H1"
  );

  // ── Summary ────────────────────────────────────────────────────
  console.log("\n==================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("Verification execution error:", err);
  process.exit(1);
});
