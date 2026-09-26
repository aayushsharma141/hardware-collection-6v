#!/usr/bin/env node
/**
 * Fails if `console.log` appears in application source.
 *
 * `.agents/rules/coding.md` and CLAUDE.md both hold the repo to zero
 * `console.log` in `src/`. CI referenced this check for months at
 * `apps/web/scripts/checks/no-console-log.js`, a path that has never existed in
 * this repository, so the step only ever failed with MODULE_NOT_FOUND and the
 * rule went unenforced.
 *
 * `console.warn` and `console.error` are allowed: they carry real diagnostics
 * (Sanity fetch fallbacks, lead-notification retries) and are meant to reach
 * production logs.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "src");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "__tests__"]);

// Matches console.log( but not console.logger, and not a line where it is
// commented out.
const OFFENDER = /(^|[^\w.])console\s*\.\s*log\s*\(/;

function walk(dir, found) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), found);
      continue;
    }
    if (!EXTENSIONS.has(path.extname(entry.name))) continue;

    const filePath = path.join(dir, entry.name);
    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    lines.forEach((line, i) => {
      const code = line.trim();
      if (code.startsWith("//") || code.startsWith("*")) return;
      if (OFFENDER.test(line)) {
        found.push(`${path.relative(ROOT, filePath)}:${i + 1}: ${code}`);
      }
    });
  }
}

if (!fs.existsSync(SRC)) {
  console.error(`✖ Expected application source at ${path.relative(ROOT, SRC)}`);
  process.exit(1);
}

const found = [];
walk(SRC, found);

if (found.length > 0) {
  console.error(`✖ ${found.length} console.log call(s) in src/:\n`);
  found.forEach((hit) => console.error(`  ${hit}`));
  console.error("\nUse console.warn or console.error for diagnostics that should ship.");
  process.exit(1);
}

console.log("✔ No console.log in src/");
