import { describe, it, expect } from "vitest";
import { schema } from "../schemaTypes";
import {
  getCategoriesQuery,
  getBrandsQuery,
  getAllProductsQuery,
  ACTIVE_OFFERS_QUERY,
} from "../queries";

function fieldNames(type: string): Set<string> {
  const def = schema.types.find((t) => t.name === type) as { fields?: { name: string }[] } | undefined;
  return new Set((def?.fields ?? []).map((f) => f.name));
}

/**
 * The migration once renamed and dropped schema fields while the queries (and
 * the seed scripts) kept reading them, so the frontend silently received
 * nulls. Every field a query reads by name must exist on the schema type.
 */
describe("Sanity schema / query parity", () => {
  const cases: [string, string, string[]][] = [
    ["category", getCategoriesQuery, ["eyebrow", "icon", "cardVariant", "featured", "displayOrder", "primaryRail", "families", "searchKeywords", "whatsappMessage", "categoryImage", "image", "seo"]],
    ["brand", getBrandsQuery, ["authorizedStatus", "featured", "displayOrder", "description", "brandPositioning", "website", "country", "logo", "officialCatalogue", "marketingAssets", "seo"]],
    ["offer", ACTIVE_OFFERS_QUERY, ["heroPlacement", "heroOrder", "validUntil", "offerType", "image", "brand"]],
    ["product", getAllProductsQuery, ["catalogReference", "subcategoryTitle", "showroomDisplay", "featured", "heroImage", "shortDescription", "specifications", "seo"]],
  ];

  it.each(cases)("%s: query fields exist in the schema", (type, query, fields) => {
    const known = fieldNames(type);
    for (const f of fields) {
      expect(known.has(f), `${type}.${f} missing from schema`).toBe(true);
      if (f !== "image") expect(query, `${f} not read by query`).toContain(f);
    }
  });

  it("registers every document type the site queries", () => {
    const names = new Set(schema.types.map((t) => t.name));
    for (const t of ["legalPage", "editorial", "catalogue", "homePage", "siteSettings", "navigation"]) {
      expect(names.has(t), t).toBe(true);
    }
  });
});
