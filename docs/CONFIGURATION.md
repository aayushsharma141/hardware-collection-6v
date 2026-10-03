<!-- generated-by: gsd-doc-writer -->
# Configuration

The site is configured with environment variables and a few committed config files. The repository has no `.env.example`. The variable list below comes from reading every `process.env` access in `src/`, `scripts/`, `prisma.config.ts`, `sanity.config.ts` and `playwright.config.ts`.

`.gitignore` ignores all `.env*` files, so local values stay out of the repository. Next.js loads `.env.local` automatically. The standalone CMS scripts in `scripts/` load it explicitly with `dotenv.config({ path: ".env.local" })`.

## Environment variables

### Application (Next.js runtime and build)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | **Required** | `dummy-project-id` only when `NODE_ENV=test` | Sanity project ID. Read in `src/content/sanity/env.ts`; also used by `sanity.config.ts` for the embedded Studio at `/studio`. |
| `NEXT_PUBLIC_SANITY_DATASET` | **Required** | `production` only when `NODE_ENV=test` | Sanity dataset name. Read in `src/content/sanity/env.ts`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional | `2024-02-12` | Sanity API version date. Read in `src/content/sanity/env.ts` and `scripts/build-catalog-index.mjs`. |
| `SANITY_API_TOKEN` | Optional (needed in practice) | none | Sanity read token for the shared client (`src/content/sanity/client.ts`). Also used for draft mode (`src/app/api/draft-mode/enable/route.ts`), as the bearer token for `/api/seed`, and by the CMS scripts. Without it the client returns no data and pages render from `src/content/fallback/`. |
| `SANITY_REVALIDATE_SECRET` | Optional (needed for webhooks) | none | Shared secret for the Sanity revalidation webhook at `/api/revalidate`. If it is unset, the route logs an error and rejects every webhook call. |
| `DATABASE_URL` | Required for lead capture | none | PostgreSQL connection string. Prisma reads it through `prisma.config.ts`, and the `pg` pool in `src/lib/leads/createLead.ts` uses it. |
| `TELEGRAM_BOT_TOKEN` | Required for lead alerts | none | Telegram bot token used by `src/lib/leads/telegram.ts`. |
| `TELEGRAM_CHAT_ID` | Required for lead alerts | none | Telegram chat that receives new-lead alerts. |
| `RESEND_API_KEY` | Optional | none | Resend API key for lead notification emails (`src/lib/leads/email.ts`). |
| `STAFF_EMAIL` | Optional | none | Address that receives lead notification emails. |
| `UPSTASH_REDIS_REST_URL` | Optional | none | Upstash Redis REST URL for the `/api/leads` rate limiter. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | none | Upstash Redis REST token. Rate limiting is turned on only when both Upstash variables are set. |
| `NEXT_PUBLIC_SHOWROOM_MAP_URL` | Optional | Google Maps search URL for "Hardware Collection Jamshedpur" | Showroom map link, read in `src/lib/config.ts`. |
| `NODE_ENV` | Set by Next.js | — | Controls the Sanity test fallbacks, the Vision tool (development only), whether `/api/seed` is disabled (production), and Prisma client caching. |

### Tooling and release scripts

| Variable | Required | Default | Description |
|---|---|---|---|
| `EVIDENCE_PRIVATE_KEY` | Required in CI for signing | none | Ed25519 private key (PEM, or base64 of a PEM) that `scripts/evidence-engine.ts` uses to sign evidence bundles. When `CI` is set and no key is available, the script refuses to generate a throwaway key. |
| `EVIDENCE_PUBLIC_KEY` | Optional | none | Ed25519 public key for verifying bundles without the private key. |
| `CI` | Set by CI provider | unset | Makes Playwright stricter (`forbidOnly`, 2 retries, never reuses an existing dev server). Also enforces signing-key presence in `scripts/evidence-engine.ts`. |

### Legacy script variables

Some older utilities in `scripts/checks/`, `scripts/build/` and `scripts/db/` (for example `test-leads.cjs`, `verify-pipeline.cjs` and `test-schema.cjs`) read `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_SERVICE_ROLE_KEY`. Nothing in `src/` uses Supabase, and no `package.json` script runs these utilities, so the application does not need these variables.

## Config file format

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js config. Defines permanent redirects (`/brands` → `/#brands`, `/showroom` → `/#showroom`, `/catalogs` → `/catalogues`, plus legacy `/collections/<slug>` redirects built from `src/content/fallback/catalog`) and `images.remotePatterns` for `lh3.googleusercontent.com`, `cdn.sanity.io` and `images.unsplash.com`. |
| `sanity.config.ts` | Embedded Sanity Studio config (`basePath: '/studio'`). Takes `projectId`, `dataset` and `apiVersion` from `src/content/sanity/env.ts`. The Vision tool is loaded only when `NODE_ENV === "development"`. |
| `prisma.config.ts` | Prisma config. It imports `dotenv/config`, points at `prisma/schema.prisma` and `prisma/migrations`, and reads `DATABASE_URL`. |
| `prisma/schema.prisma` | PostgreSQL datasource with a single `Lead` model. |
| `vercel.json` | Vercel project settings: `{"name": "hc-demo", "framework": "nextjs"}`. |
| `playwright.config.ts` | End-to-end test config. Base URL is `http://localhost:3000`, and the dev server starts with a 120-second timeout. |
| `vitest.config.mjs` | Unit test config. |
| `src/lib/config.ts` | Hard-coded showroom constants (phone numbers, WhatsApp number, address, fallback opening hours, trust stats) and the `SHOWROOM_MAP_URL` override. |

Minimal local `.env.local` (names only; fill in your own values):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
DATABASE_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# Optional
RESEND_API_KEY=
STAFF_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SHOWROOM_MAP_URL=
```

## Required vs optional settings

**Fail at startup or import:**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: when `NODE_ENV` is not `test`, `src/content/sanity/env.ts` throws `Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID`.
- `NEXT_PUBLIC_SANITY_DATASET`: same check, throwing `Missing environment variable: NEXT_PUBLIC_SANITY_DATASET`.

**Fail only when the feature runs:**

- `DATABASE_URL`: the Prisma client is built at module load, but the connection is only tried when a lead is written. Without it, `/api/leads` fails.
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`: `sendTelegramAlert` throws `Missing Telegram configuration: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set.` The leads route catches this, saves the lead anyway, and returns `telegram_status: "failed"`.
- `RESEND_API_KEY` / `STAFF_EMAIL`: `sendResendEmail` throws `Missing Resend configuration (RESEND_API_KEY or STAFF_EMAIL)`. Email is sent in the background, so a failure only marks the lead's email notification status as `failed`.
- `SANITY_REVALIDATE_SECRET`: without it, every revalidation webhook is rejected.
- `EVIDENCE_PRIVATE_KEY`: when `CI` is set, `scripts/evidence-engine.ts` throws if no signing key is available.
- Most CMS scripts in `scripts/cms/` and `scripts/seed-*.ts` call `process.exit(1)` when the Sanity project ID, dataset or token is missing. `scripts/cms/seed.mjs` exits only when `SANITY_API_TOKEN` is missing; it falls back to project `gfwqxrd2` and dataset `production`.

**Degrade gracefully:**

- `SANITY_API_TOKEN` missing: the Sanity client returns no data and the site renders from `src/content/fallback/`. CI's build job relies on this to check that the site still renders without Sanity.
- `UPSTASH_REDIS_REST_*` missing: `/api/leads` runs without rate limiting. With both set, it allows 5 requests per minute per IP (sliding window).
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` missing during `npm run build`: the `prebuild` step (`scripts/build-catalog-index.mjs`) logs `[catalog-index] Sanity project not configured; skipping.` and continues. The app import check above still applies.

## Defaults

| Setting | Default | Set in |
|---|---|---|
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-02-12` | `src/content/sanity/env.ts`, `scripts/build-catalog-index.mjs` |
| `NEXT_PUBLIC_SANITY_DATASET` (test only) | `production` | `src/content/sanity/env.ts` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` (test only) | `dummy-project-id` | `src/content/sanity/env.ts` |
| `NEXT_PUBLIC_SHOWROOM_MAP_URL` | `https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur` | `src/lib/config.ts` |
| Sanity `useCdn` | `false` (constant, not env-driven) | `src/content/sanity/env.ts` |
| Sanity client `perspective` | `published` (constant) | `src/content/sanity/client.ts` |
| Lead rate limit | 5 requests / 1 minute per IP | `src/app/api/leads/route.ts` |
| Lead email sender | `Hardware Collection <leads@hardwarecollection.in>` <!-- VERIFY: leads@hardwarecollection.in is a verified sending domain in Resend --> | `src/lib/leads/email.ts` |

## Per-environment overrides

The repository has no `.env.development`, `.env.production` or `.env.test` files. Settings change by environment in these ways:

- **Local development:** put values in `.env.local`. With `NODE_ENV=development`, the Sanity Vision tool appears in `/studio` and `/api/seed` is enabled (it still needs `Authorization: Bearer <SANITY_API_TOKEN>`). The Prisma client is cached on `global` between hot reloads.
- **Test (`NODE_ENV=test`):** Vitest runs without real Sanity credentials. `env.ts` falls back to the `dummy-project-id` project and the `production` dataset.
- **CI:** `.github/workflows/ci.yml` sets `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` directly in the build job. It does not set `SANITY_API_TOKEN`, so the build uses fallback content. `CI` changes Playwright and evidence-engine behaviour as described above.
- **Production (Vercel):** runtime variables are set in the Vercel project environment. <!-- VERIFY: production env vars are managed in the Vercel dashboard for the hc-demo project --> `.github/workflows/deploy.yml` deploys on push to `main` and needs the GitHub secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`. With `NODE_ENV=production`, `/api/seed` returns 403 and the Vision tool is excluded.
- **Sanity webhook:** the same `SANITY_REVALIDATE_SECRET` value must be set on the webhook in Sanity's project management console. <!-- VERIFY: revalidation webhook is configured at sanity.io/manage for this project -->
