#!/usr/bin/env node
/**
 * staging-smoke.mjs — release smoke test against a deployed (preview/staging)
 * URL. Checks what a passing build cannot: headers, robots, redirects, the
 * lead API's guards, the seed lock, and that catalogue search loads its index
 * in the deployed function.
 *
 * READ-ONLY BY DEFAULT. Nothing is written unless you pass a flag:
 *   --rate-limit   sends 6 invalid lead bodies (never stored) and expects a 429.
 *                  Uses up this machine's lead budget for a minute, so it runs last.
 *   --submit-lead  creates ONE real lead named "Smoke Test (delete me)", then
 *                  prints its id so you can check the email/Telegram alert and
 *                  delete the row. Use only against a test database.
 *
 * Other options:
 *   --expect-indexable   expect no X-Robots-Tag noindex (only after launch approval)
 *   --catalog blum/0     catalogue to search (default blum/0)
 *   --q hinge            search term expected to match (default hinge)
 *
 * Vercel Deployment Protection: set VERCEL_AUTOMATION_BYPASS_SECRET and it is
 * sent as x-vercel-protection-bypass on every request.
 *
 * Usage:
 *   node scripts/checks/staging-smoke.mjs https://<preview>.vercel.app
 *   node scripts/checks/staging-smoke.mjs https://<preview>.vercel.app --rate-limit
 *
 * Exits 1 if any check fails. Needs Node 20+ (global fetch).
 */

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--"))?.replace(/\/+$/, "");
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};

if (!base || !/^https?:\/\//.test(base)) {
  console.error("Usage: node scripts/checks/staging-smoke.mjs <base-url> [--rate-limit] [--submit-lead] [--expect-indexable]");
  process.exit(2);
}

const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const results = [];
const record = (status, name, detail = "") => {
  results.push({ status, name, detail });
  console.log(`${status.padEnd(4)}  ${name}${detail ? `  — ${detail}` : ""}`);
};
const pass = (name, detail) => record("PASS", name, detail);
const fail = (name, detail) => record("FAIL", name, detail);
const warn = (name, detail) => record("WARN", name, detail);

async function call(path, init = {}) {
  const headers = { ...(init.headers || {}) };
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...init, headers });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Not JSON; `text` is kept.
  }
  return { res, text, json };
}

const postJson = (path, body) =>
  call(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

async function check(name, fn) {
  try {
    await fn();
  } catch (error) {
    fail(name, `request failed: ${error instanceof Error ? error.message : error}`);
  }
}

console.log(`Smoke test: ${base}\n`);

// ── Pages, headers, SEO ──────────────────────────────────────────────────────
await check("home page", async () => {
  const { res, text } = await call("/");
  if (res.status === 401 || res.status === 403) {
    return fail("home page", `HTTP ${res.status}: deployment protection? set VERCEL_AUTOMATION_BYPASS_SECRET`);
  }
  res.status === 200 ? pass("home page", "200") : fail("home page", `HTTP ${res.status}`);

  const h = (k) => res.headers.get(k) || "";
  for (const [key, test] of [
    ["content-security-policy", (v) => v.includes("default-src 'self'")],
    ["strict-transport-security", (v) => /max-age=\d+/.test(v)],
    ["x-frame-options", (v) => /sameorigin/i.test(v)],
    ["x-content-type-options", (v) => v === "nosniff"],
  ]) {
    test(h(key)) ? pass(`header ${key}`) : fail(`header ${key}`, h(key) || "missing");
  }

  const noindex = /noindex/i.test(h("x-robots-tag"));
  if (flag("expect-indexable")) {
    noindex ? fail("indexable", `X-Robots-Tag: ${h("x-robots-tag")} (SITE_INDEXABLE not true, or a *.vercel.app host)`) : pass("indexable");
  } else {
    noindex ? pass("noindex before launch", h("x-robots-tag")) : warn("noindex before launch", "page is indexable; intended only after launch approval");
  }

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(text)?.[1];
  canonical === "https://www.hardwarecollection.co"
    ? pass("canonical URL", canonical)
    : fail("canonical URL", canonical || "missing");
});

await check("robots.txt", async () => {
  const { res, text } = await call("/robots.txt");
  if (res.status !== 200) return fail("robots.txt", `HTTP ${res.status}`);
  const groups = text.split(/\n(?=User-Agent:)/i).filter((g) => /User-Agent:/i.test(g));
  const leaky = groups.filter((g) => !/Disallow: \/studio\//.test(g) || !/Disallow: \/api\//.test(g));
  leaky.length === 0 && groups.length > 0
    ? pass("robots.txt", `${groups.length} groups, all block /studio/ and /api/`)
    : fail("robots.txt", `groups missing disallows: ${leaky.map((g) => g.split("\n")[0]).join(", ")}`);
  /Sitemap: https:\/\/www\.hardwarecollection\.co\/sitemap\.xml/.test(text)
    ? pass("robots.txt sitemap line")
    : fail("robots.txt sitemap line");
});

await check("sitemap.xml", async () => {
  const { res, text } = await call("/sitemap.xml");
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const want = ["https://www.hardwarecollection.co", "https://www.hardwarecollection.co/collections", "https://www.hardwarecollection.co/catalogues"];
  res.status === 200 && want.every((u) => locs.includes(u))
    ? pass("sitemap.xml", `${locs.length} URLs`)
    : fail("sitemap.xml", `HTTP ${res.status}, got: ${locs.join(", ") || "none"}`);
});

for (const [from, to] of [
  ["/brands", "/catalogues"],
  ["/catalogs", "/catalogues"],
  ["/collections/kitchen", "/collections#kitchen"],
]) {
  await check(`redirect ${from}`, async () => {
    const { res } = await call(from);
    const location = res.headers.get("location") || "";
    res.status === 308 && location.endsWith(to)
      ? pass(`redirect ${from}`, `308 -> ${to}`)
      : fail(`redirect ${from}`, `HTTP ${res.status} -> ${location || "none"}`);
  });
}

await check("404 page", async () => {
  const { res } = await call("/smoke-test-missing-page");
  res.status === 404 ? pass("404 page", "404") : fail("404 page", `HTTP ${res.status}`);
});

// ── Write-protected and signed endpoints ─────────────────────────────────────
await check("seed locked", async () => {
  const { res } = await call("/api/seed", { method: "POST" });
  res.status === 403 ? pass("seed locked", "403") : fail("seed locked", `HTTP ${res.status}: must be 403 on every deployment`);
});

await check("revalidate webhook", async () => {
  const { res } = await postJson("/api/revalidate", {});
  if (res.status === 401) pass("revalidate webhook", "unsigned request rejected (401)");
  else if (res.status === 500) fail("revalidate webhook", "SANITY_REVALIDATE_SECRET not set: CMS edits will wait for the 5-minute timer");
  else fail("revalidate webhook", `HTTP ${res.status}`);
});

// ── Lead API guards (none of these store anything) ───────────────────────────
for (const [name, body, wantStatus] of [
  ["leads: malformed JSON", "{oops", 400],
  ["leads: null body", "null", 400],
  ["leads: missing fields", {}, 400],
  [
    "leads: oversized message",
    { intent: "callback", name: "Smoke", phone: "9000000000", source: "home", consultationTime: "Anytime", message: "x".repeat(3000) },
    400,
  ],
]) {
  await check(name, async () => {
    const { res } = await postJson("/api/leads", body);
    res.status === wantStatus ? pass(name, String(res.status)) : fail(name, `HTTP ${res.status}, expected ${wantStatus}`);
  });
}

await check("leads: honeypot", async () => {
  const { res, json } = await postJson("/api/leads", { _honey: "bot" });
  res.status === 200 && json?.data?.lead_id === "HC-HONEYPOT"
    ? pass("leads: honeypot", "silently accepted, not stored")
    : fail("leads: honeypot", `HTTP ${res.status}`);
});

await check("retry: malformed JSON", async () => {
  const { res } = await postJson("/api/leads/retry", "{oops");
  res.status === 400 ? pass("retry: malformed JSON", "400") : fail("retry: malformed JSON", `HTTP ${res.status}`);
});

// ── Catalogue search in the deployed function ────────────────────────────────
await check("catalogue search", async () => {
  const catalog = option("catalog", "blum/0");
  const q = option("q", "hinge");
  const { res, json } = await call(`/api/catalog/${catalog}/search?q=${encodeURIComponent(q)}`);
  const n = Array.isArray(json?.matches) ? json.matches.length : -1;
  res.status === 200 && n > 0
    ? pass("catalogue search", `${catalog} "${q}": ${n} matches (index files deployed)`)
    : fail("catalogue search", `HTTP ${res.status}, matches=${n}: index files missing from the function?`);
});

// ── Opt-in: one real lead ────────────────────────────────────────────────────
if (flag("submit-lead")) {
  await check("real lead", async () => {
    const { res, json } = await postJson("/api/leads", {
      intent: "enquiry",
      name: "Smoke Test (delete me)",
      phone: "+91 90000 00000",
      location: "Smoke test",
      projectType: "Other",
      source: "home",
      pageUrl: `${base}/?smoke=1`,
    });
    const id = json?.data?.lead_id;
    if (res.status !== 200 || !id) return fail("real lead", `HTTP ${res.status}: ${JSON.stringify(json)}`);
    pass("real lead stored", id);
    json.data.telegram_status === "sent"
      ? pass("telegram alert", "sent")
      : fail("telegram alert", `${json.data.telegram_status}: check TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID`);
    warn("manual follow-up", `confirm the staff email for ${id} arrived, then delete the lead row`);
  });
}

// ── Opt-in: rate limit (last, it spends this machine's budget) ───────────────
if (flag("rate-limit")) {
  await check("rate limit", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await postJson("/api/leads", {})).res.status);
    statuses.includes(429)
      ? pass("rate limit", statuses.join(" "))
      : fail("rate limit", `${statuses.join(" ")}: no 429, so Upstash is not configured (look for api.ratelimit_unconfigured in logs)`);
  });
}

const failed = results.filter((r) => r.status === "FAIL").length;
const warned = results.filter((r) => r.status === "WARN").length;
console.log(`\n${results.length - failed - warned} passed, ${warned} warnings, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
