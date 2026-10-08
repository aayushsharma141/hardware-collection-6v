/**
 * delete-old-deployments.mjs
 *
 * Deletes all Vercel deployments for a project EXCEPT the current
 * live Production deployment.
 *
 * Usage:
 *   VERCEL_TOKEN=<your_token> node scripts/delete-old-deployments.mjs
 *
 * Or pass inline:
 *   node scripts/delete-old-deployments.mjs --token <your_token>
 *
 * Optional flags:
 *   --dry-run     List deployments that would be deleted, but don't delete
 *   --yes         Skip confirmation prompt
 */

import { parseArgs } from "node:util";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// ─── Config ───────────────────────────────────────────────────────────────────

const PROJECT_ID = "hardware-collection-6v";
// Team slug from the Vercel dashboard URL: vercel.com/<TEAM_SLUG>/...
// Set to null for personal (hobby) accounts
const TEAM_SLUG = null; // Update if needed

// ─── Parse CLI flags ──────────────────────────────────────────────────────────

const { values: flags } = parseArgs({
  options: {
    token:     { type: "string" },
    "dry-run": { type: "boolean", default: false },
    yes:       { type: "boolean", default: false },
  },
  strict: false,
});

const TOKEN   = flags.token ?? process.env.VERCEL_TOKEN;
const DRY_RUN = flags["dry-run"];
const AUTO_YES = flags.yes;

if (!TOKEN) {
  console.error(
    "No token provided.\n" +
    "Set VERCEL_TOKEN env var or pass --token <token>."
  );
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE = "https://api.vercel.com";

function teamParam(sep = "&") {
  return TEAM_SLUG ? `${sep}teamId=${TEAM_SLUG}` : "";
}

async function apiGet(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${url} -> ${res.status}: ${body}`);
  }
  return res.json();
}

async function apiDelete(uid) {
  const url = `${BASE}/v13/deployments/${uid}?${teamParam("?")}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok && res.status !== 404) {
    const body = await res.text();
    throw new Error(`DELETE ${url} -> ${res.status}: ${body}`);
  }
  return res.status;
}

async function getAllDeployments() {
  let all = [];
  let until = "";
  while (true) {
    const sinceParam = until ? `&until=${until}` : "";
    const url = `/v6/deployments?projectId=${PROJECT_ID}&limit=100${sinceParam}${teamParam()}`;
    const data = await apiGet(url);
    all = all.concat(data.deployments ?? []);
    if (!data.pagination?.next) break;
    until = data.pagination.next;
  }
  return all;
}

function label(d) {
  const env  = d.target === "production" ? "PRODUCTION" : "preview   ";
  const date = new Date(d.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const msg = (d.meta?.githubCommitMessage ?? "(no message)").slice(0, 55);
  return `${env}  ${d.uid.padEnd(28)}  ${date}  ${msg}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`\nFetching all deployments for project "${PROJECT_ID}"...\n`);

let deployments;
try {
  deployments = await getAllDeployments();
} catch (err) {
  console.error("Failed to fetch deployments:", err.message);
  process.exit(1);
}

if (!deployments.length) {
  console.log("No deployments found. Nothing to do.");
  process.exit(0);
}

// Sort newest first
deployments.sort((a, b) => b.createdAt - a.createdAt);

// Identify the live production deployment (most recent READY production deploy)
const liveDep = deployments.find(
  d => d.target === "production" && d.readyState === "READY"
);

if (!liveDep) {
  console.error(
    "Cannot identify the live Production deployment.\n" +
    "Make sure there is at least one READY Production deployment."
  );
  process.exit(1);
}

const toDelete = deployments.filter(d => d.uid !== liveDep.uid);

console.log(`Total deployments found : ${deployments.length}`);
console.log(`Live production (KEPT)  : ${liveDep.uid}`);
console.log(`  Commit: ${liveDep.meta?.githubCommitMessage ?? "n/a"}`);
console.log(`Deployments to delete   : ${toDelete.length}\n`);

if (!toDelete.length) {
  console.log("Only the production deployment exists. Nothing to delete.");
  process.exit(0);
}

console.log("KEEPING:");
console.log("  " + label(liveDep));
console.log("\nWILL DELETE:");
toDelete.forEach(d => console.log("  " + label(d)));
console.log();

if (DRY_RUN) {
  console.log("DRY RUN - no deletions performed. Remove --dry-run to execute.");
  process.exit(0);
}

if (!AUTO_YES) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(
    `Type YES to permanently delete ${toDelete.length} deployment(s): `
  );
  rl.close();
  if (answer.trim().toUpperCase() !== "YES") {
    console.log("Aborted - no deployments were deleted.");
    process.exit(0);
  }
}

console.log("\nDeleting...\n");

let deleted = 0;
let failed  = 0;

for (const dep of toDelete) {
  try {
    const status = await apiDelete(dep.uid);
    const tag = status === 404 ? "already gone" : "deleted";
    console.log(`  OK   ${dep.uid}  (${tag})`);
    deleted++;
  } catch (err) {
    console.error(`  FAIL ${dep.uid}  ${err.message}`);
    failed++;
  }
  // Avoid Vercel rate limits
  await new Promise(r => setTimeout(r, 300));
}

console.log(`\nDone: ${deleted} deleted, ${failed} failed.`);
console.log(`Live deployment intact: ${liveDep.uid}\n`);
