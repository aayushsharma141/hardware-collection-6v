import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Subcategory Pop-Up Modal Architecture & Integration Guard", () => {
  const modalPath = path.resolve(__dirname, "../../../components/collections/CategoryDetailModal.tsx");
  const explorerPath = path.resolve(__dirname, "../../../components/collections/CollectionExplorer.tsx");

  it("CategoryDetailModal file exists and exports a valid React component", () => {
    expect(fs.existsSync(modalPath)).toBe(true);
    const content = fs.readFileSync(modalPath, "utf-8");
    expect(content).toContain("export default function CategoryDetailModal");
  });

  it("CategoryDetailModal implements Radix Dialog with accessible Title and Description", () => {
    const content = fs.readFileSync(modalPath, "utf-8");
    expect(content).toContain("<Dialog ");
    expect(content).toContain("<DialogContent");
    expect(content).toContain("<DialogTitle");
    expect(content).toContain("<DialogDescription");
  });

  it("CategoryDetailModal renders Authorized Brand Catalogues with official viewer links", () => {
    const content = fs.readFileSync(modalPath, "utf-8");
    expect(content).toContain("Authorized Brand Catalogues");
    expect(content).toContain("brand.bestPage");
    expect(content).toContain("Open Catalogue");
    expect(content).toContain("/collections#brand-catalogues");
  });

  it("CategoryDetailModal renders Showroom Guidance with WhatsApp enquiry link", () => {
    const content = fs.readFileSync(modalPath, "utf-8");
    expect(content).toContain("Showroom Guidance");
    expect(content).toContain("Ask on WhatsApp");
    expect(content).toContain("enquiryHref(category.name)");
  });

  it("CollectionExplorer mounts CategoryDetailModal and wires modal state", () => {
    const content = fs.readFileSync(explorerPath, "utf-8");
    expect(content).toContain("import CategoryDetailModal from \"./CategoryDetailModal\";");
    expect(content).toContain("<CategoryDetailModal");
    expect(content).toContain("activeCategoryModal");
  });

  it("CollectionExplorer gallery cards render clean count badges and Explore Range CTA", () => {
    const content = fs.readFileSync(explorerPath, "utf-8");
    expect(content).toContain("Explore Range");
    expect(content).toContain("setActiveCategoryModal");
    expect(content).toContain("brands.length");
    expect(content).toContain("products.length");
    expect(content).toContain("Enquire");
  });

  it("Strict Architectural Guard: Neither CategoryDetailModal nor CollectionExplorer links to /collections/<slug>", () => {
    const modalContent = fs.readFileSync(modalPath, "utf-8");
    const explorerContent = fs.readFileSync(explorerPath, "utf-8");

    // Route rule from AGENTS.md: Never link to /collections/<slug>
    const subRoutePattern = /href=["'`]\/collections\/[a-z0-9_-]+["'`]/i;
    expect(modalContent).not.toMatch(subRoutePattern);
    expect(explorerContent).not.toMatch(subRoutePattern);
  });

  it("CategoryDetailModal keeps internal catalogue links in-tab and only opens external links in a new tab", () => {
    const content = fs.readFileSync(modalPath, "utf-8");
    // Internal routes (anti-UI-slop rule 4): no new-tab spawning.
    expect(content).not.toMatch(/<Link[^>]*target="_blank"/);
    // The WhatsApp enquiry is external and still opens a new tab safely.
    expect(content).toContain('target="_blank"');
    expect(content).toContain('rel="noopener noreferrer"');
  });
});
