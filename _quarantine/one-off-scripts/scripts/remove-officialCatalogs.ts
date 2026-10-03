import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * HISTORICAL MIGRATION SCRIPT (Executed & Completed)
 * 
 * Purpose: Remove the legacy 'officialCatalogs' field from 'brand' documents.
 * Context: We migrated to standalone 'catalogue' documents that reference the brand.
 * After verifying 16 standalone catalogs mapped perfectly to the brands, we wiped out the old fields.
 */

async function runFinalCleanup() {
  console.log("=== FINAL CLEANUP: officialCatalogs ===\n");
  
  // 1. Fetch current state
  const brands = await client.fetch(`*[_type == "brand" && defined(officialCatalogs)] {
    _id, brandName, officialCatalogs
  }`);
  
  const catalogues = await client.fetch(`*[_type == "catalogue"] {
    _id, "brandId": brand._ref
  }`);

  if (brands.length === 0) {
    console.log("No brands found with 'officialCatalogs'. They are already clean.");
    return;
  }

  // Pre-commit assertions
  let totalLegacyReferences = 0;
  let allHaveEquivalents = true;
  
  brands.forEach((b: any) => {
    const legacyCount = b.officialCatalogs ? b.officialCatalogs.length : 0;
    totalLegacyReferences += legacyCount;
    
    const standaloneCats = catalogues.filter((c: any) => c.brandId === b._id);
    if (legacyCount > standaloneCats.length) {
      allHaveEquivalents = false;
    }
  });

  // Assertion 1: Confirm all 16 legacy references have standalone docs
  if (!allHaveEquivalents || totalLegacyReferences !== 16) {
    throw new Error(`Pre-commit check failed: Expected 16 legacy references with standalone equivalents. Found ${totalLegacyReferences}. allHaveEquivalents: ${allHaveEquivalents}`);
  }
  
  // Assertion 2: Confirm exactly 15 brand documents
  if (brands.length !== 15) {
    throw new Error(`Pre-commit check failed: Expected 15 brands with 'officialCatalogs', found ${brands.length}`);
  }

  console.log(`Pre-commit checks passed: 15 brands, 16 safely migrated catalogues.`);

  // Build Transaction
  const transaction = client.transaction();
  let patchCount = 0;

  brands.forEach((b: any) => {
    // Assertion 3: Transaction contains ONLY unset(["officialCatalogs"])
    transaction.patch(b._id, (p) => p.unset(["officialCatalogs"]));
    patchCount++;
  });

  if (patchCount !== 15) {
    throw new Error("Transaction mismatch");
  }

  // Assertion 4: Commit transaction
  console.log("Executing transaction...");
  await transaction.commit();
  console.log("Cleanup complete! 15 documents updated.");
}

runFinalCleanup().catch(console.error);
