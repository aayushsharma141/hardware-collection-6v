# Full Codebase Audit — 2026-09-25

**Scope:** all application source, configuration, CI/CD, scripts, git history and all 9 remote
branches of `aayushsharma141/hardware-collection-6v`.
**Method:** every gate below was executed in this container against a clean `npm install`; no
result in this report is inferred. Findings are ordered by severity, and each names the file and
the observable failure.

---

## 1. Measured gate results

`npm install` from the committed lockfile succeeded (847 packages, exit 0).

| Gate | Command | Result |
|---|---|---|
| GATE-01 Lint | `npx eslint` | **PASS** — 0 errors, 30 warnings |
| GATE-02 Types | `npx tsc --noEmit` | **PASS** — no diagnostics |
| GATE-03 Unit tests | `npx vitest run` | **PASS** — 63 tests / 12 files, 1.16s |
| GATE-04 Build | `npm run build` | **FAIL** on a clean checkout — see F-02 |
| GATE-04 Build (with Sanity env) | `NEXT_PUBLIC_SANITY_DATASET=… npm run build` | **PASS** — 58 routes, 54 SSG collection pages |
| GATE-05 CVE audit | `npm audit --audit-level=critical` | **PASS** — 0 critical |
| — same, at `--audit-level=high` | `npm audit --audit-level=high` | **FAIL** — 10 high, 11 moderate (see F-04) |
| GATE-06 Evidence schema | `npx tsx scripts/evidence-engine.ts --validate` | **PASS** — 4 valid, 0 invalid |
| Legacy token/import scan | `node scripts/audit-dependencies.cjs` | **PASS** — 0 findings |

**Net:** `scripts/release-verification.ts` cannot pass in a clean checkout, because GATE-04 aborts
before GATE-05. It passes only when Sanity environment variables are present.

### What is genuinely healthy

This is worth stating plainly, because it is unusual and it constrains the findings below to
configuration and infrastructure rather than application code:

- `strict: true`, and across all 135 `.ts`/`.tsx` files in `src/` (19,644 LOC): **zero** `any`,
  zero `as any`, zero `@ts-ignore`/`@ts-expect-error`, zero non-null assertions, zero
  `console.log`. This matches `.agents/rules/coding.md` exactly.
- Only two `dangerouslySetInnerHTML` sites, both safe (a static `<style>` block in
  `CursorSystem.tsx`, and `JSON.stringify(jsonLd)` over a server-controlled object in
  `layout.tsx`). No XSS surface in rendered output.
- No `.env` files on disk; `.env*` is gitignored; no tracked env files. One committed secret, F-01.
- `/api/revalidate` and `/api/catalog/[slug]/[index]` are carefully written, with honest comments
  that state their own limits ("This is not DRM"). They are the two best files in the repo.
- Lead input is validated with a discriminated-union Zod schema, and `/api/leads` has a honeypot.

---

## 2. Critical

### F-01 — The Ed25519 evidence signing private key is committed to git

`docs/evidence/private.key` is a tracked PKCS#8 private key, added in `472af97`
("wip: checkpoint before structural reorganization", 2026-08-31) and still tracked on `main`.

`.gitignore` lists both `*.key` and `docs/evidence/*.key`, but gitignore does not untrack a file
that is already tracked, so those rules have no effect here.

This is the *active* signing key. `scripts/evidence-engine.ts:19-33` resolves keys as
`EVIDENCE_PRIVATE_KEY`/`EVIDENCE_PUBLIC_KEY` from the environment **or**, failing that, by reading
`docs/evidence/private.key` off disk. `signData()` then signs with whatever that returned.

Consequence: anyone with read access to this repository can mint a valid signature for any
evidence bundle. CLAUDE.md states evidence bundles "are Ed25519-signed, so they must never assert
anything the pipeline did not actually observe" — that guarantee does not currently hold. A forged
bundle asserting `PASS` for every gate is indistinguishable from a real one.

Remediation, in order:
1. Generate a new keypair; store the private half only as the `EVIDENCE_PRIVATE_KEY` secret.
2. `git rm --cached docs/evidence/private.key` and commit.
3. Treat the exposed key as compromised: purge it from history (`git filter-repo`) and
   re-sign or invalidate the 4 existing bundles, which were all signed with it.
4. Make `ensureEd25519Keys()` refuse to fall back to an on-disk private key when
   `NODE_ENV === "production"` or `CI` is set, so this cannot silently recur.

---

## 3. High

### F-02 — `npm run build` fails on a clean checkout, blocking the release gate

`src/app/api/seed/route.ts:4` imports `@/content/sanity/env` at module scope. That module
(`src/content/sanity/env.ts:8`) calls `assertValue()` and **throws** when
`NEXT_PUBLIC_SANITY_DATASET` is absent. Next.js evaluates route modules during "Collecting page
data", so the throw aborts the whole build:

```
Error: Failed to collect configuration for /api/seed
  [cause]: Error: Missing environment variable: NEXT_PUBLIC_SANITY_DATASET
```

`env.ts` already has an escape hatch for `NODE_ENV === "test"`, but not for builds. Because GATE-04
precedes GATE-05 and is marked `critical: true`, the release pipeline records `HOLD` for a reason
unrelated to code quality.

Fix: construct the Sanity client lazily inside the `POST` handler rather than at module scope, so
an unconfigured deployment fails at request time (where `/api/seed` already returns 403/401) rather
than at build time.

### F-03 — CI is entirely non-functional: it targets a monorepo layout that does not exist

`.github/workflows/ci.yml` and `.github/workflows/security.yml` are written for an
`apps/web` npm-workspace monorepo. This repository is a single package (`name: "website"`) with
**no** `workspaces` key and **no** `apps/` directory. Every one of the following steps fails
immediately:

| Workflow / job | Step | Why it fails |
|---|---|---|
| ci.yml → Lint & Type Check | `npm run lint --workspace=web` | no workspace `web` |
| ci.yml → Lint & Type Check | `npm run typecheck --workspace=web` | no workspace; **no `typecheck` script** |
| ci.yml → Quality Gates | `node apps/web/scripts/checks/no-console-log.js` | `apps/` does not exist |
| ci.yml → Quality Gates | `npm run arch:check --workspace=apps/web` | no workspace; **no `arch:check` script** |
| ci.yml → Build | `npm run build --workspace=apps/web` | no workspace |
| security.yml → 4 of 5 jobs | `working-directory: apps/web` | directory does not exist |

Package scripts actually available: `dev, build, start, lint, test, test:e2e, postinstall`.

Compounding problems in the same files:

- **Nothing in CI runs the project's real gates.** `npm test` and
  `scripts/release-verification.ts` are never invoked by any workflow.
- **Secrets from a different project.** `ci.yml`'s build job injects `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`,
  `VITE_IMAGEKIT_URL_ENDPOINT`. This stack is Next.js + Sanity + Prisma/Postgres; it uses no Vite
  and no Supabase. The same inheritance explains `key-rotation-reminder.yml`, which quarterly
  files an issue to rotate `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` — credentials this
  project does not have — and points at `.agents/security/KEY_ROTATION_STRATEGY.md`. The key that
  actually needs rotating is F-01, and no workflow mentions it.
- **`deploy.yml` has no dependency on CI.** It deploys to Vercel production on every push to
  `main` with no `needs:` gate, so broken CI could not block a release even if it worked.
- **Retired action versions.** `security.yml` uses `actions/upload-artifact@v3` (retired — hard
  failure), `actions/checkout@v3`, `actions/setup-node@v3`, `github/codeql-action@v2`. Five open
  Dependabot branches propose exactly these bumps; see §6.

Only two CI jobs can currently pass: CodeQL analysis and the TruffleHog/Gitleaks secret scans —
and the latter did not catch F-01.

### F-04 — Ten high-severity CVEs pass the release gate by design

GATE-05 is pinned at `--audit-level=critical`, so it exits 0 while 10 high and 11 moderate
advisories are outstanding. At `--audit-level=high` the same command exits 1. Measured:

```
high  mysql2        Auth plugin downgrade to mysql_clear_password leaks plaintext credentials
high  undici        Downstream response desynchronization via retry interceptor
high  adm-zip       Extraction follows destination symlinks → arbitrary file overwrite
high  js-yaml       Prototype pollution in merge (<<); quadratic-complexity DoS
high  fast-uri      Host confusion via skipped IDN canonicalization
high  deepmerge-ts  Stack exhaustion on recursive object graphs
high  brace-expansion, smol-toml, prisma, @prisma/config
```

Most reach the tree through `prisma`/`@prisma/config` and `sanity` build tooling rather than
request-path code, which lowers real exposure — but the gate should measure that rather than
assume it. CLAUDE.md presents `npm audit` as the project's real vulnerability scanning; a
threshold of `critical` means it reports almost nothing.

`dependabot/npm_and_yarn/main/dependencies-80a2ffae7d` (24 updates) is exactly 1 commit ahead of
`main` and merges cleanly — it is the cheapest available remediation.

### F-05 — Unescaped lead input is interpolated into staff notifications

Both notification channels build their payload by string interpolation of attacker-controlled
fields. Zod validates *shape*, not content: `name` is `z.string().min(2)` and `message` is an
unconstrained string.

**`src/lib/leads/email.ts`** — `name`, `phone`, `email`, `message` and `pageUrl` are interpolated
into an HTML email with no escaping. `pageUrl` additionally lands inside an `href`:

```ts
<p ...><a href="${leadData.pageUrl}" ...>${leadData.pageUrl}</a></p>
```

`pageUrl` is `z.string().url()`, which accepts `javascript:` and `data:` URLs. A submitted
`message` containing markup is rendered as markup in the staff mailbox. Escape all five fields
(and reject any `pageUrl` whose protocol is not `http:`/`https:`).

**`src/lib/leads/telegram.ts`** — sends with `parse_mode: "Markdown"` and interpolates `name`,
`location`, `customerType`, `projectType`, `phone` raw. A lead named `A*B` produces unbalanced
Markdown; the Telegram API rejects it with a 400, `sendTelegramAlert` throws, and
`/api/leads` marks `telegramStatus: "failed"`. So a single malformed name **silently drops the
staff alert for that lead** — a lost sale, not just a cosmetic bug. Escape the Markdown special
characters, or switch to `parse_mode: "MarkdownV2"` with proper escaping, or drop `parse_mode`.

---

## 4. Medium

### F-06 — `/api/lead` is unreferenced dead code with no validation and a filesystem write

`src/app/api/lead/route.ts` is deployed (it appears in the build manifest as a dynamic route) but
**nothing in `src/` calls it** — the consultation form posts to `/api/leads` and
`/api/leads/retry` only. It is the superseded singular-noun predecessor of `/api/leads`, and it
has none of its successor's protections:

- No schema validation — it accepts and forwards arbitrary JSON (`Record<string, unknown>`).
- No rate limit, no honeypot.
- Returns `(error as Error).message` to the caller, leaking internals.
- Writes to `path.join(process.cwd(), "..", "..", ".apep", "events.jsonl")` — two levels *above*
  the project root — creating the directory if absent. This is guarded by `if (!process.env.VERCEL)`,
  so it is inert on Vercel; on any other host (local, Docker, self-managed) an unauthenticated
  caller can append unbounded attacker-controlled data to a file outside the deployment tree.

Delete the route. If the webhook mirror to `GOOGLE_SHEET_WEBHOOK_URL` is still wanted, move it
into `/api/leads` behind the existing validation.

### F-07 — `/api/leads/retry` is unauthenticated and triggers outbound notifications

`src/app/api/leads/retry/route.ts` accepts a `lead_id` from any caller with no authentication and
no rate limiting (unlike `/api/leads`, which has both). Its concurrency guard and idempotency
check are well written, but they only prevent *duplicate* sends for an already-sent lead; any
lead in `failed` state can be re-triggered by anyone who can name its ID.

Lead IDs are guessable. `src/app/api/leads/route.ts` builds them as
`HC-${year}-${Math.random().toString(16).substring(2,6).toUpperCase()}` — 4 hex characters, a
65,536-value space, from `Math.random()` (not a CSPRNG). That ID is also the Prisma primary key,
so beyond enumeration there is a birthday-collision risk: `prisma.lead.create` will throw a
unique-constraint error at roughly a few hundred leads, and `/api/leads` has no retry for it —
the lead is lost with a 500. Use `crypto.randomUUID()` for the primary key and keep the short
`HC-YYYY-XXXX` form as a separate human-facing display column.

Add a shared-secret header or session check to the retry endpoint, and apply the same rate limiter.

### F-08 — Prisma logs every query, including lead PII, in production

`src/lib/leads/createLead.ts:18`:

```ts
prisma = new PrismaClient({ adapter, log: ["query"] });
```

This is unconditional. Every `INSERT` into `Lead` — customer name, phone, email, message,
location — is written to stdout and so into Vercel's log retention. That is a data-protection
exposure and a needless one. Gate it: `log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"]`.

### F-09 — The rate limiter on `/api/leads` is trivially bypassed and leaks memory

`src/app/api/leads/route.ts:8-40`:

- Keyed on the **raw** `x-forwarded-for` header. A client that sends its own `X-Forwarded-For` gets
  a fresh bucket per request, so the 5-per-minute limit is bypassed by varying one header. Parse
  the leftmost-untrusted / rightmost-trusted hop per the hosting proxy's contract, or use
  Vercel's `request.ip`.
- All requests without the header collapse into a single `"unknown"` bucket, so a handful of
  legitimate visitors behind a proxy that strips it lock each other out.
- `rateLimitMap` is a module-level `Map` that is **never pruned** — no eviction, no TTL sweep.
  Each distinct (or spoofed) IP adds a permanent entry, so a long-lived serverless instance grows
  without bound. Evict on read, or use a bounded LRU / Vercel KV.

The comment calls this "naive protection", which is fair, but the header-spoofing bypass means it
provides approximately none.

### F-10 — No security headers are configured

`next.config.ts` sets `redirects` and `images.remotePatterns` and nothing else: no `headers()`
block. The site therefore serves no `Content-Security-Policy`, `Strict-Transport-Security`,
`X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, or `Permissions-Policy`.
`/api/catalog/[slug]/[index]` sets `X-Content-Type-Options` and `X-Robots-Tag` on its own
responses, which shows the concern was understood locally but never applied site-wide. A site that
embeds Sanity Studio at `/studio` and proxies PDFs into `pdf.js` particularly wants a CSP and
`frame-ancestors`.

### F-11 — The quality-gate scripts are themselves neither type-checked nor linted

`tsconfig.json` has `"exclude": [... "scripts" ...]` and `eslint.config.mjs` globally ignores
`scripts/**`. So GATE-01 and GATE-02 do not cover `scripts/evidence-engine.ts` or
`scripts/release-verification.ts` — the two files that decide whether a release is allowed to ship,
and the ones that handle the signing key in F-01. The ESLint exclusion is well justified in a
comment (vendored root content produced 4,329 of 4,330 errors), but it is written as a broad
`scripts/**` ignore when what it needed to exclude was the vendored directories. Add a second
tsconfig/ESLint project covering `scripts/*.ts` only.

### F-12 — The pre-commit hook cannot run, in four independent ways

`.husky/pre-commit` contains `npm run typecheck` and `npx lint-staged`. Measured:

| Requirement | State |
|---|---|
| `husky` in dependencies | **absent** |
| `prepare` script to install hooks | **absent** |
| `git config core.hooksPath` | **unset** |
| `.git/hooks/pre-commit` | **does not exist** |
| `.husky/pre-commit` executable bit | **not set** (`-rw-r--r--`) |
| `lint-staged` in dependencies | **absent** |
| `lint-staged` configuration | **absent** |
| `typecheck` npm script | **absent** |

Either wire it up properly (add `husky` + `lint-staged`, a `prepare` script, a `typecheck` script,
`chmod +x`) or delete `.husky/` so it stops implying a protection that does not exist. Given F-03,
there is currently no automated check between a developer's editor and Vercel production.

### F-13 — Zero test coverage on the API layer

63 passing tests across 12 files, all on content, lib, hooks and types:

```
content/fallback/{brands,catalogFiltering,homeLinks,showroomTaxonomy}
content/sanity/slugUniqueness   components/collections/FeaturedChapters
hooks/useCollectionsState       lib/{contrast,browser/scrollLock,collections/routing}
lib/leads/schema                types/catalog
```

Not one of the six API routes has a test. The untested code is the highest-risk code in the
repository: database writes, the rate limiter, the honeypot, the seed endpoint's authorization,
the webhook signature check, the retry concurrency guard, and the PDF range-request proxy.
`lib/leads/schema.test.ts` covers the Zod shapes but not a single handler. E2E is two Playwright
specs (`mobile-journeys`, `motion-protocol`), neither touching lead submission.

Most of these routes are pure `Request → Response` functions and are cheap to test directly.
Priority order: `/api/leads` (rate limit + honeypot + validation rejection),
`/api/revalidate` (signature rejection), `/api/seed` (the 403 and 401 paths),
`/api/leads/retry` (idempotency).

---

## 5. Low

### F-14 — Every component in the tree is a client component

All 59 `.tsx` files under `src/components/` carry `'use client'` — the count of client components
equals the total count of components. For a Sanity-backed catalog site on the App Router, that
forfeits most of what React Server Components offer: the entire component tree, plus `gsap`,
`motion`, `lenis`, `three`, `@react-three/fiber` and `@react-three/drei`, ships to the browser.
The heavy animation libraries genuinely need the client; presentational catalog and layout
components generally do not. Push `'use client'` down to the leaves that own interactivity or
animation and let the static shells render on the server.

### F-15 — `/api/seed` authorization compares against a possibly-undefined token

`src/app/api/seed/route.ts:14` — `authHeader !== \`Bearer ${process.env.SANITY_API_TOKEN}\``.
If `SANITY_API_TOKEN` is unset, the template yields the literal string `"Bearer undefined"`, which
a caller can simply send. The `NODE_ENV === "production"` check above it means this is reachable
only in non-production, and the subsequent Sanity writes would fail without a token, so impact is
limited — but the check should reject outright when the variable is missing, and use
`crypto.timingSafeEqual` rather than `!==`. `/api/revalidate` already handles the
missing-secret case correctly and explains why in a comment; mirror that.

### F-16 — Repository hygiene

- **`tsconfig.tsbuildinfo` (479 KB) is tracked.** It is a build artifact that changes on every
  `tsc` run — it showed up modified in this audit merely from running GATE-02. Add to `.gitignore`
  and `git rm --cached`.
- **`public/` is 91 MB.** Brand artwork is served unoptimized at 8–10 MB per file:
  `HC-02-HAFELE.png` 10.4 MB, `HC-02-DORSET.png` 8.8 MB, `HC-02-LABACHA.png` 8.8 MB,
  `Godrej_Enterprises_Group_Logo_.jpg` 6.7 MB. ESLint's 30 warnings are almost entirely
  `@next/next/no-img-element` on exactly these assets (`ShowroomCinematic.tsx`,
  `HeroCarousel.tsx`, `TactileStatement.tsx`), so they bypass `next/image` optimization as well.
  Converting to WebP/AVIF and routing through `next/image` is the single largest available
  Core Web Vitals win.
- **`docs/references/dribbble/27564427-1.mp4` (18 MB) is tracked** — a third-party design
  reference video in the git history. Worth removing on size grounds, and worth checking on
  licensing grounds.
- **`.gitignore` contains `.claude/`, but 126 files under `.claude/` are tracked** — the same
  already-tracked-file problem as F-01, and the reason F-17's stub skills are in the repo at all.
  Decide whether `.claude/` is shared project configuration (remove the ignore rule) or local
  (untrack it); right now it is both.
- **Root clutter.** 18 top-level directories, 7 of which (`ECC/`, `superpowers/`, `caveman/`,
  `headroom/`, `claude-mem/`, `everything-claude-code/`, `Front-End-Checklist/`) are empty
  placeholders tracked by a single stub file each. They exist only to be excluded again in
  `eslint.config.mjs` and `tsconfig.json`, and they are the direct cause of the over-broad
  exclusions in F-11. Removing them lets both exclusion lists shrink to what they actually mean.
- **`.agents/` is 318 tracked files — larger than `src/` (141).** Documentation and agent
  specification outweigh application code more than 2:1. Not a defect, but it is where the
  repository's accumulated drift lives, and F-03's Supabase workflows are an instance of it.

### F-17 — Three of the four requested skills are unimplemented stubs

Reported because the audit was requested *through* these skills, and their output would otherwise
be mistaken for analysis.

- **`/find-skills` does not exist.** `skills-lock.json` declares it
  (`vercel-labs/skills`, `skills/find-skills/SKILL.md`, with a pinned hash), but there is no
  `.claude/skills/find-skills/` directory. The lockfile lists 11 skills; 10 are installed. The
  `prisma-*` entries all resolved correctly, so the omission is specific to this one. Either
  install it or drop the entry.
- **`senior-architect`, `senior-backend` and `senior-fullstack` are templates with no
  implementation.** Each ships three Python scripts (~3.1 KB apiece) whose `analyze()` method is
  a comment reading `# Main logic here` followed by `self.results['findings'] = []` — they are
  structurally incapable of returning a finding. Each ships three reference documents that are
  placeholder text: "Pattern 1: Best Practice Implementation", "Detailed explanation of the
  pattern", "Benefit 1 / Benefit 2 / Benefit 3", "Scenario 1 / Scenario 2". All nine scripts and
  nine reference files follow the same generated skeleton with only the class name substituted.

  Running them would have printed `✅ Completed successfully!` with zero findings — which is why
  this audit was performed by executing the project's real gates and reading the source instead.
  Every finding above is attributable to a command run in this container or a cited file and line.
  The `code-reviewer` skill in the same directory is, by contrast, substantive.

---

## 6. Branch audit (all 9 remote branches)

| Branch | Head | Ahead / behind `main` | Assessment |
|---|---|---|---|
| `main` | `074657e` | — | Current. Builds and tests clean with Sanity env present. |
| `claude/codebase-audit-skills-le9amc` | `074657e` | 0 / 0 | This audit's branch. |
| `refactor/structure-legibility` | `074657e` | 0 / 0 | **Fully merged, identical to `main`.** Safe to delete. |
| `dependabot/npm_and_yarn/main/dependencies-80a2ffae7d` | `07ae7cb` | 1 / 0 | **Merge this.** 24 dependency updates, exactly one commit on top of current `main`, no conflicts. The cheapest fix for F-04. Verify GATE-01…06 after merging. |
| `dependabot/github_actions/actions/checkout-7` | `1865c41` | 16 / 50 | Stale. Cut before the structural reorganization; diff vs `main` is 441 files / −29,392 lines. |
| `dependabot/github_actions/actions/setup-node-7` | `6b8c9c3` | 16 / 50 | Stale, same base. |
| `dependabot/github_actions/actions/upload-artifact-7` | `73f6199` | 16 / 50 | Stale, same base. |
| `dependabot/github_actions/github/codeql-action-4` | `2d39561` | 16 / 50 | Stale, same base. |
| `dependabot/github_actions/gitleaks/gitleaks-action-3` | `6d8d2d0` | 16 / 50 | Stale, same base. |
| `v0/editoraayusharma755-5662-701dc8f4` | `9478118` ("Add README.md") | 50 / 3 | **Abandoned.** A separate v0.dev-generated application; diff vs `main` is 1,143 files, −210,673 lines. Shares almost no history with the current site. |

**On the five GitHub-Actions branches:** the bumps they propose are all correct and needed (F-03
lists retired `upload-artifact@v3`, `checkout@v3`, `setup-node@v3`, `codeql-action@v2`), but none
should be merged as-is — each is 50 commits behind and would revert the restructure. Close them and
apply the version bumps directly to `.github/workflows/` while fixing F-03; Dependabot will
reconcile on its next run. Note that four of these five branches cannot be validated by CI anyway,
for the reasons in F-03.

---

## 7. Recommended order of work

Sequenced so each step is independently verifiable:

1. **F-01** — rotate the evidence signing key, untrack it, purge it from history. Nothing else in
   this list matters if release evidence can be forged.
2. **F-02** — make `/api/seed` construct its Sanity client lazily. This is a handful of lines and
   it is what currently makes the release gate unpassable.
3. **F-03** — rewrite `ci.yml` for this repository's actual single-package layout: `npm ci`,
   `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`. Drop the Vite/Supabase secrets
   and `key-rotation-reminder.yml`. Add `needs:` to `deploy.yml`. Bump the retired action versions.
4. **F-04** — merge `dependabot/npm_and_yarn/main/dependencies-80a2ffae7d`, then raise GATE-05 to
   `--audit-level=high` and record any remaining advisory as an explicit, dated exception rather
   than letting the threshold hide it.
5. **F-05, F-08** — escape the notification payloads; stop logging queries. Both are small,
   contained, and carry customer-data risk.
6. **F-06, F-07, F-09, F-15** — delete `/api/lead`; authenticate the retry endpoint; move lead
   primary keys to `crypto.randomUUID()`; fix the rate-limiter key and add eviction.
7. **F-13** — add handler tests for the six routes, in the priority order given. Do this *with*
   step 6 so the fixes land with regression cover.
8. **F-10, F-11, F-12** — security headers; a tsconfig/ESLint project for `scripts/`; either wire
   up or remove the husky hook.
9. **F-16, F-14** — asset optimization (the largest user-visible win), repository hygiene, then
   the server/client component boundary as a considered refactor.
10. **F-17** — install or drop `find-skills`; replace or remove the three stub skills so they
    cannot be mistaken for working analysis tools.
11. Delete `refactor/structure-legibility`; close the five stale Actions branches and
    `v0/editoraayusharma755-5662-701dc8f4`.

---

*Gate results in §1 were produced by executing each command in a Linux container against a clean
`npm install` of the committed lockfile on `074657e`. Findings cite file and line. Incidental
working-tree changes from running the gates (`package-lock.json` npm-metadata drift,
`tsconfig.tsbuildinfo`, a regenerated `dependency_audit_report.md`) were reverted and are not part
of this change.*
