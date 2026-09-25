#!/usr/bin/env node
/**
 * Copies the runtime assets pdf.js fetches on demand out of node_modules and
 * into public/, where the catalogue viewer points at them.
 *
 * These are not bundled: pdf.js requests them over HTTP only when a page needs
 * them, and a missing one fails as `UnknownErrorException: Failed to fetch`
 * mid-render — which is how this drifted unnoticed once already, with the
 * standard fonts copied by hand and the rest never copied at all.
 *
 * Runs on postinstall and before a build so the files always match the
 * installed pdfjs-dist rather than whichever version was current when someone
 * last copied them.
 *
 *   node scripts/sync-pdfjs-assets.mjs [--check]
 *
 * --check reports drift without writing, for use in CI.
 */

import { createRequire } from "node:module";
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const pdfjsRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));
const { version } = require("pdfjs-dist/package.json");
const publicDir = path.resolve(process.cwd(), "public");

/** Each entry is [source inside pdfjs-dist, destination inside public/]. */
const ASSETS = [
  // The worker. Referenced by GlobalWorkerOptions.workerSrc.
  ["build/pdf.worker.min.mjs", "pdf.worker.min.mjs"],
  // Substitutes for the standard 14 fonts when a PDF does not embed them.
  ["standard_fonts", "pdfjs/standard_fonts"],
  // Predefined Adobe CMaps — needed by CJK and other non-Latin encodings.
  ["cmaps", "pdfjs/cmaps"],
  // ICC profiles for colour-managed pages.
  ["iccs", "pdfjs/iccs"],
  // JPX/JBIG2 image decoders and the colour engine.
  ["wasm", "pdfjs/wasm"],
];

const checkOnly = process.argv.includes("--check");

async function isDirectory(target) {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}

async function countFiles(target) {
  if (!existsSync(target)) return 0;
  if (!(await isDirectory(target))) return 1;
  const entries = await readdir(target, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    total += entry.isDirectory() ? await countFiles(path.join(target, entry.name)) : 1;
  }
  return total;
}

async function main() {
  const problems = [];

  for (const [from, to] of ASSETS) {
    const source = path.join(pdfjsRoot, from);
    const destination = path.join(publicDir, to);

    if (!existsSync(source)) {
      problems.push(`missing in pdfjs-dist: ${from}`);
      continue;
    }

    const expected = await countFiles(source);
    const actual = await countFiles(destination);

    if (checkOnly) {
      if (actual !== expected) {
        problems.push(`${to}: ${actual} file(s) present, ${expected} expected`);
      }
      continue;
    }

    if (await isDirectory(source)) {
      await rm(destination, { recursive: true, force: true });
      await mkdir(destination, { recursive: true });
    } else {
      await mkdir(path.dirname(destination), { recursive: true });
    }
    await cp(source, destination, { recursive: true });
    console.log(`  ${to} (${expected} file${expected === 1 ? "" : "s"})`);
  }

  if (problems.length > 0) {
    console.error(`pdf.js assets out of sync with pdfjs-dist ${version}:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error("Run: node scripts/sync-pdfjs-assets.mjs");
    process.exit(1);
  }

  console.log(
    checkOnly
      ? `pdf.js assets match pdfjs-dist ${version}.`
      : `Synced pdf.js assets from pdfjs-dist ${version}.`
  );
}

main().catch((err) => {
  console.error("Failed to sync pdf.js assets:", err);
  process.exit(1);
});
