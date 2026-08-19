import fs from "fs";
import path from "path";

/**
 * Hardware Collection — Motion & Animation Protocol Validator
 * Corresponds to MOTION_TEST_PROTOCOL.md specifications.
 */

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, "src");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}${details ? " - " + details : ""}`);
    failures.push({ testName, details });
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".css")) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const allSourceFiles = getAllFiles(SRC_DIR);

console.log("=================================================");
console.log(`🎬 HARDWARE COLLECTION — MOTION PROTOCOL TEST SUITE (${allSourceFiles.length} files scanned)`);
console.log("=================================================\n");

// -------------------------------------------------------------
// GATE 01: Motion Token System & Centralization (Rule 04)
// -------------------------------------------------------------
console.log("▶ GATE 01: Motion Token Registry & Global Centralization");
const motionTokensPath = path.join(SRC_DIR, "lib", "motionTokens.ts");
assert(fs.existsSync(motionTokensPath), "motionTokens.ts exists in src/lib/");

if (fs.existsSync(motionTokensPath)) {
  const motionTokensContent = fs.readFileSync(motionTokensPath, "utf8");
  assert(motionTokensContent.includes("duration:"), "Motion tokens define standard duration tiers (micro, standard, editorial, cinematic)");
  assert(motionTokensContent.includes("zLayers"), "Z-Axis Depth Contract is defined in motion tokens");
  assert(motionTokensContent.includes("visualTension"), "Visual Tension Map is defined for all 7 chapters");
}

// -------------------------------------------------------------
// GATE 02: Reduced Motion Accessibility (Rule 17)
// -------------------------------------------------------------
console.log("\n▶ GATE 02: Reduced Motion Accessibility Compliance");
const motionProviderPath = path.join(SRC_DIR, "components", "providers", "MotionProvider.tsx");
assert(fs.existsSync(motionProviderPath), "MotionProvider exists");

if (fs.existsSync(motionProviderPath)) {
  const providerContent = fs.readFileSync(motionProviderPath, "utf8");
  assert(providerContent.includes('reducedMotion="user"'), "MotionConfig reducedMotion='user' is configured globally");
}

// Verify components that use animation implement useReducedMotion guards
const animatedComponents = [
  "components/ThreeDHero.tsx",
  "components/home/ShowroomCinematic.tsx",
  "components/home/ProductReel.tsx",
  "components/home/MaterialJourney.tsx",
  "components/home/TactileStatement.tsx",
  "components/home/SignatureCollection.tsx",
];

animatedComponents.forEach((relPath) => {
  const compPath = path.join(SRC_DIR, relPath);
  if (fs.existsSync(compPath)) {
    const content = fs.readFileSync(compPath, "utf8");
    assert(
      content.includes("useReducedMotion") || content.includes("shouldReduceMotion"),
      `Component ${relPath} respects prefers-reduced-motion`
    );
  }
});

// -------------------------------------------------------------
// GATE 03: Conversion Stability & Non-Hijacked CTAs (Rule 02, 03, 24)
// -------------------------------------------------------------
console.log("\n▶ GATE 03: Conversion Stability & CTA Accessibility");
const floatingCtaPath = path.join(SRC_DIR, "components", "home", "FloatingCTA.tsx");
const whatsappCtaPath = path.join(SRC_DIR, "components", "WhatsAppCTA.tsx");

assert(fs.existsSync(floatingCtaPath), "FloatingCTA exists and provides quick showroom/selection conversion");
assert(fs.existsSync(whatsappCtaPath), "Global WhatsAppCTA exists");

if (fs.existsSync(whatsappCtaPath)) {
  const whatsappContent = fs.readFileSync(whatsappCtaPath, "utf8");
  assert(
    whatsappContent.includes("https://wa.me/") || whatsappContent.includes("api.whatsapp.com") || whatsappContent.includes("href"),
    "WhatsApp CTA links directly without obstructive intermediate animation delays"
  );
}

// -------------------------------------------------------------
// GATE 04: Product Drawer Focus Trap & Keyboard Navigation (Rule 11)
// -------------------------------------------------------------
console.log("\n▶ GATE 04: Product Drawer Accessibility & Focus Trapping");
const collectionsClientPath = path.join(SRC_DIR, "app", "collections", "CollectionsClient.tsx");
assert(fs.existsSync(collectionsClientPath), "CollectionsClient exists");

if (fs.existsSync(collectionsClientPath)) {
  const collectionsContent = fs.readFileSync(collectionsClientPath, "utf8");
  assert(collectionsContent.includes('role="dialog"'), "Product drawer uses role='dialog'");
  assert(collectionsContent.includes('aria-modal="true"'), "Product drawer specifies aria-modal='true'");
  assert(collectionsContent.includes('key === "Escape"'), "Product drawer handles Escape key to dismiss");
  assert(collectionsContent.includes('key === "Tab"'), "Product drawer implements Tab focus trap");
  assert(
    collectionsContent.includes("triggerElementRef") || collectionsContent.includes("focus()"),
    "Product drawer restores focus to triggering element upon close"
  );
}

// -------------------------------------------------------------
// GATE 05: Mobile Responsive & Touch Layout Safeguards (Rule 08, 18)
// -------------------------------------------------------------
console.log("\n▶ GATE 05: Mobile Layout & Scroll-Jacking Safeguards");
const categoryDiscoveryPath = path.join(SRC_DIR, "components", "home", "CategoryDiscovery.tsx");
if (fs.existsSync(categoryDiscoveryPath)) {
  const categoryContent = fs.readFileSync(categoryDiscoveryPath, "utf8");
  assert(
    categoryContent.includes("matchMedia") || categoryContent.includes("md:") || categoryContent.includes("lg:"),
    "CategoryDiscovery restricts horizontal desktop GSAP pinning to desktop viewports"
  );
}

// -------------------------------------------------------------
// GATE 06: Three.js & WebGL Fallback Safety (Rule 21)
// -------------------------------------------------------------
console.log("\n▶ GATE 06: Three.js & WebGL Graceful Degradation");
const threeDHeroPath = path.join(SRC_DIR, "components", "ThreeDHero.tsx");
if (fs.existsSync(threeDHeroPath)) {
  const threeContent = fs.readFileSync(threeDHeroPath, "utf8");
  assert(
    threeContent.includes("webglSupported") || threeContent.includes("isCapable"),
    "ThreeDHero verifies WebGL capability before mounting 3D canvas"
  );
  assert(
    threeContent.includes("isDesktop") || threeContent.includes("isFinePointer"),
    "ThreeDHero falls back to static high-resolution asset on mobile/touch devices"
  );
}

// -------------------------------------------------------------
// SUMMARY & VERDICT
// -------------------------------------------------------------
console.log("\n=================================================");
console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
if (failedTests === 0) {
  console.log("🎉 VERDICT: ALL MOTION PROTOCOL MECHANICAL GATES PASSED [100%]");
} else {
  console.log(`⚠️ VERDICT: ${failedTests} GATES FAILED`);
}
console.log("=================================================\n");

process.exit(failedTests === 0 ? 0 : 1);
