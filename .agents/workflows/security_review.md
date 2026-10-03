<!-- generated-by: gsd-doc-writer -->
# Security & Vulnerability Review Workflow

**Trigger:** `/workflow security_review`

## Purpose

Check the attack surface this site actually has: the API routes under `src/app/api/`,
server-only secrets, raw HTML injection, dependency vulnerabilities, and the embedded
Sanity Studio at `/studio`. There are no user accounts, so there is no login flow to review.

## When to run

- Before every production release (feeds `production_readiness`).
- After any change under `src/app/api/`, `src/lib/leads/`, `src/content/sanity/client.ts`,
  or to dependencies.

## Inputs

- `src/app/api/` — `leads/route.ts`, `leads/retry/route.ts`, `revalidate/route.ts`,
  `draft-mode/enable/route.ts`, `draft-mode/disable/route.ts`, `seed/route.ts`,
  `catalog/[slug]/[index]/route.ts`.
- `docs/API.md` and `docs/CONFIGURATION.md`.
- `.github/workflows/security.yml` and `.github/workflows/secret-scan.yml`.

## Steps

1. **Dependencies.** Run `npm audit --audit-level=critical` (GATE-05). Note high and
   moderate findings in the report without blocking on them.
2. **Secrets in source.** Grep `src/` and `scripts/` for hardcoded keys and tokens. Server
   secrets (`SANITY_API_TOKEN`, `SANITY_REVALIDATE_SECRET`, `UPSTASH_REDIS_REST_TOKEN`,
   `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`, `RESEND_API_KEY`) must be read only from
   `process.env` in server code and never carry a `NEXT_PUBLIC_` prefix. `NEXT_PUBLIC_*`
   values ship in the client bundle by design and are not secrets.
3. **Client leakage.** Confirm no file with `"use client"` imports the
   token-bearing client in `src/content/sanity/client.ts` or reads a server-only variable.
4. **API authorization.** For each route confirm:
   - `revalidate` rejects requests without a valid `SANITY_REVALIDATE_SECRET` signature (401).
   - `draft-mode/enable` uses `defineEnableDraftMode` and stays disabled without a token.
   - `seed` returns 403 when `NODE_ENV` is `production` and requires a Bearer token otherwise.
   - `leads` validates the body with the Zod schemas in `src/lib/leads/schema.ts`, applies
     the Upstash sliding-window rate limit (5 per minute per IP) when Upstash is configured,
     and keeps the honeypot check.
   - `leads/retry` accepts any `lead_id` with no authentication or rate limit — record its
     current state and whether that is acceptable.
5. **Raw HTML.** Grep for `dangerouslySetInnerHTML`. Current uses are JSON-LD
   (`src/app/layout.tsx`, `src/app/collections/page.tsx`, `src/components/home/FaqSection.tsx`)
   and a static `<style>` in `src/components/animations/CursorSystem.tsx`. Any new use that
   renders CMS or user input is a finding.
6. **Headers.** `next.config.ts` defines no `headers()` and there is no middleware, so no
   CSP or frame-ancestors policy is set by the app. Check live response headers manually
   with `curl -I` against the deployment and record what is present.
   <!-- VERIFY: production URL for header inspection -->
7. **CI scanners.** Confirm Gitleaks (`secret-scan.yml`) and TruffleHog, npm audit, SBOM and
   license checks (`security.yml`) passed on the branch. The CodeQL job is skipped while the
   repository is private.

## Pass/fail criteria

- **MUST FIX:** a critical `npm audit` finding; a secret in source or in a `NEXT_PUBLIC_`
  variable; an unauthenticated write route that was previously protected; raw HTML built
  from CMS or user input.
- **SHOULD FIX:** missing rate limiting on a public POST route; no security headers.
- **COULD FIX:** extra logging around rejected requests.
- **Pass:** no MUST FIX items.

## Output

`docs/reviews/security-YYYY-MM-DD.md` (create `docs/reviews/` on first run) with the
audit summary, a per-route table (auth, validation, rate limit), and findings by severity
with file paths.
