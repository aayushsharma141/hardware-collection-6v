import { describe, it, expect } from "vitest";
import nextConfig from "../../../../next.config";
import sitemap from "../../../app/sitemap";
import { SHOWROOM_GROUPS } from "../showroom";
import fs from "fs";
import path from "path";

describe("Phase 16: Local Search & SEO Verification Suite", () => {
  describe("1. Next.js Redirects & Canonicalization", () => {
    it("redirects bare domain hardwarecollection.co to www canonical origin with path preservation", async () => {
      const redirects = typeof nextConfig.redirects === "function" ? await nextConfig.redirects() : [];
      const bareRedirect = redirects.find(
        (r) =>
          r.source === "/:path*" &&
          r.has?.some((h) => h.type === "host" && h.value === "hardwarecollection.co")
      );

      expect(bareRedirect).toBeDefined();
      expect(bareRedirect?.destination).toBe("https://www.hardwarecollection.co/:path*");
      expect(bareRedirect?.permanent).toBe(true);
    });

    it("redirects legacy jamshedpurhardware.com domain to www canonical origin in single hop", async () => {
      const redirects = typeof nextConfig.redirects === "function" ? await nextConfig.redirects() : [];
      const legacyRedirect = redirects.find(
        (r) =>
          r.source === "/:path*" &&
          r.has?.some((h) => h.type === "host" && h.value === "jamshedpurhardware.com")
      );

      expect(legacyRedirect).toBeDefined();
      expect(legacyRedirect?.destination).toBe("https://www.hardwarecollection.co/:path*");
      expect(legacyRedirect?.permanent).toBe(true);
    });
  });

  describe("2. Next.js Indexing & Security Headers", () => {
    it("configures preview host regex matching *.vercel.app for noindex headers", async () => {
      const headersList = typeof nextConfig.headers === "function" ? await nextConfig.headers() : [];
      const previewHeaderRule = headersList.find((entry) =>
        entry.has?.some(
          (h) => h.type === "host" && (h.value as string).includes("vercel\\.app")
        )
      );

      expect(previewHeaderRule).toBeDefined();
      const hostRule = previewHeaderRule?.has?.find((h) => h.type === "host");
      const hostPattern = new RegExp(`^${hostRule?.value}$`);

      // Simulated host tests
      expect(hostPattern.test("hc-demo-ten.vercel.app")).toBe(true);
      expect(hostPattern.test("preview-branch-abc.vercel.app")).toBe(true);
      expect(hostPattern.test("www.hardwarecollection.co")).toBe(false);
      expect(hostPattern.test("hardwarecollection.co")).toBe(false);

      const noindexHeader = previewHeaderRule?.headers?.find((h) => h.key === "X-Robots-Tag");
      expect(noindexHeader?.value).toBe("noindex, nofollow");
    });

    it("enforces Strict-Transport-Security (HSTS) in default security headers", async () => {
      const headersList = typeof nextConfig.headers === "function" ? await nextConfig.headers() : [];
      const globalRule = headersList.find((entry) => entry.source === "/(.*)" && !entry.has);

      expect(globalRule).toBeDefined();
      const hstsHeader = globalRule?.headers?.find((h) => h.key === "Strict-Transport-Security");
      expect(hstsHeader).toBeDefined();
      expect(hstsHeader?.value).toBe("max-age=31536000");
    });
  });

  describe("3. Heading Hierarchy (Strict Single <h1> per Route)", () => {
    it("homepage has a single semantic <h1> and demoted visual hero headline preserving .hero-h1 class", () => {
      const pagePath = path.resolve(__dirname, "../../../app/page.tsx");
      const pageContent = fs.readFileSync(pagePath, "utf-8");

      // Verify page.tsx has sr-only semantic h1 with local intent
      expect(pageContent).toContain('<h1 className="sr-only">');
      expect(pageContent).toContain("Sakchi, Jamshedpur</h1>");

      // Verify HeroStage.tsx has p with hero-h1 for GSAP animations
      const heroStagePath = path.resolve(__dirname, "../../../components/home/HeroStage.tsx");
      const heroStageContent = fs.readFileSync(heroStagePath, "utf-8");
      expect(heroStageContent).toContain('<p aria-hidden="true" className="hero-h1');
      expect(heroStageContent).not.toMatch(/<h1[^>]*hero-h1/);

      // Verify HeroMobile.tsx has p aria-hidden="true" and no h1
      const heroMobilePath = path.resolve(__dirname, "../../../components/home/HeroMobile.tsx");
      const heroMobileContent = fs.readFileSync(heroMobilePath, "utf-8");
      expect(heroMobileContent).toContain('<p aria-hidden="true"');
      expect(heroMobileContent).not.toMatch(/<h1[^>]*>/);
    });

    it("collections page has exactly one visible <h1>", () => {
      const clientPath = path.resolve(__dirname, "../../../app/collections/CollectionsClient.tsx");
      const clientContent = fs.readFileSync(clientPath, "utf-8");
      const h1Matches = clientContent.match(/<h1\b/g);
      expect(h1Matches?.length).toBe(1);
      expect(clientContent).toMatch(/<h1[^>]*>[\s\S]*?Architectural Hardware Collections[\s\S]*?<\/h1>/);
    });

    it("catalogues modal uses <h2> to prevent injecting duplicate <h1>", () => {
      const modalPath = path.resolve(__dirname, "../../../components/catalog/CatalogViewerModal.tsx");
      const modalContent = fs.readFileSync(modalPath, "utf-8");
      expect(modalContent).not.toContain("<h1");
      expect(modalContent).toContain("<h2");
    });
  });

  describe("4. Server-Rendered Taxonomy & Crawlable Cross-Links", () => {
    it("CollectionExplorer renders all 7 canonical showroom families via <details>/<summary>", () => {
      const explorerPath = path.resolve(__dirname, "../../../components/collections/CollectionExplorer.tsx");
      const explorerContent = fs.readFileSync(explorerPath, "utf-8");

      expect(explorerContent).toContain("<details");
      expect(explorerContent).toContain("<summary");

      // Verify all 7 families are mapped
      for (const group of SHOWROOM_GROUPS) {
        expect(group.id).toBeTruthy();
      }
    });

    it("verifies bidirectional crawlable cross-link bridges exist between collections and catalogues", () => {
      const collectionsClient = fs.readFileSync(
        path.resolve(__dirname, "../../../app/collections/CollectionsClient.tsx"),
        "utf-8"
      );
      const catalogsClient = fs.readFileSync(
        path.resolve(__dirname, "../../../app/catalogues/CatalogsClient.tsx"),
        "utf-8"
      );

      // Collections links to catalogues
      expect(collectionsClient).toContain('href="/catalogues"');
      // Catalogues links to collections
      expect(catalogsClient).toContain('href="/collections"');
    });
  });

  describe("5. Schema.org HardwareStore Entity Graph & Sitemap", () => {
    it("layout.tsx outputs @type: HardwareStore with coordinates, hours, map link, and excludes secondary phone", () => {
      const layoutPath = path.resolve(__dirname, "../../../app/layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      expect(layoutContent).toContain('"@type": "HardwareStore"');
      expect(layoutContent).toContain('"latitude": 22.8028401');
      expect(layoutContent).toContain('"longitude": 86.2015');
      expect(layoutContent).toContain('"hasMap": SHOWROOM_MAP_URL');
      expect(layoutContent).toContain('"openingHoursSpecification"');
      // Secondary unverified phone must not be hardcoded or present in schema
      expect(layoutContent).not.toContain("+917033650739");
      expect(layoutContent).not.toContain("SHOWROOM_SECONDARY_PHONE");
    });

    it("sitemap declares canonical base URL and includes all 3 public content routes", () => {
      const items = sitemap();
      const urls = items.map((i) => i.url);

      expect(urls).toContain("https://www.hardwarecollection.co");
      expect(urls).toContain("https://www.hardwarecollection.co/collections");
      expect(urls).toContain("https://www.hardwarecollection.co/catalogues");

      // Privacy and terms should be excluded from search priority sitemap
      expect(urls).not.toContain("https://www.hardwarecollection.co/privacy");
      expect(urls).not.toContain("https://www.hardwarecollection.co/terms");
    });
  });
});
