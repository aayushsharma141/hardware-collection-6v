<!-- generated-by: gsd-doc-writer -->
# Deployment

The site is a Next.js 16 App Router app deployed to **Vercel**. Content comes from Sanity, leads are stored in PostgreSQL through Prisma, and the only deploy path in the repository is a GitHub Actions workflow that runs the Vercel CLI when `main` changes.

For every environment variable, see [CONFIGURATION.md](CONFIGURATION.md). For how a request moves through the app, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Deployment targets

| Target | Config file | Notes |
|---|---|---|
| Vercel (production) | `vercel.json`, `.github/workflows/deploy.yml` | `vercel.json` sets the project name `hc-demo` and `framework: "nextjs"`. The workflow deploys with `vercel --prod`. |
| Vercel upload filter | `.vercelignore` | Leaves local-only folders out of the uploaded source: `.next`, `node_modules`, `tests`, `test-results`, `.planning`, `.agents`, `.claude`, `_archive`, `_quarantine`, and other tooling directories. |
| Sanity Studio | `sanity.config.ts` | Embedded in the Next.js app at `/studio` and shipped with every deployment. No separate Studio deploy. |
| PostgreSQL | `prisma/schema.prisma`, `prisma.config.ts` | External database used only for the `Lead` model. It is not provisioned from this repo. <!-- VERIFY: hosting provider and plan for the production PostgreSQL database --> |

The repository has no `Dockerfile`, `docker-compose.yml`, `netlify.toml`, `fly.toml` or `serverless.yml`. Vercel is the only deployment target.

<!-- VERIFY: whether the Vercel project also has the Git integration enabled (which would create preview deployments for branches and PRs alongside deploy.yml) -->

## Build pipeline

### Production deploy (`.github/workflows/deploy.yml`)

Trigger: every push to `main`. The job runs on `ubuntu-latest` with the GitHub `production` environment.

1. `actions/checkout@v4`
2. `actions/setup-node@v4` with Node.js `20.x` and the npm cache
3. `npm ci`, whose `postinstall` runs `prisma generate && node scripts/sync-pdfjs-assets.mjs`
4. Deploy:
   ```bash
   npx vercel --prod --archive=tgz --token="$VERCEL_TOKEN"
   ```
   The workflow pulls the `vercel.app` URL out of the CLI output and publishes it as the `url` output of the `production` environment.

`--archive=tgz` uploads the source as one archive and **Vercel runs the build remotely**. That remote build runs `npm install` (and so `postinstall`) and then `npm run build`, which first runs the `prebuild` hook:

```bash
node scripts/sync-pdfjs-assets.mjs --check && node scripts/build-catalog-index.mjs
next build
```

- `sync-pdfjs-assets.mjs --check` fails the build if the pdf.js runtime files in `public/pdfjs` no longer match the installed `pdfjs-dist`.
- `build-catalog-index.mjs` builds the catalogue index from Sanity. If the Sanity project is not configured, it logs `[catalog-index] Sanity project not configured; skipping.` and the build carries on.

Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

The Vercel CLI is not in `devDependencies`. `npx` downloads the latest version on every deploy.

> **Note:** `deploy.yml` does not wait for `ci.yml`. A push to `main` starts both workflows in parallel, so a commit that fails lint or tests can still reach production. Run the release gate (below) or wait for CI to pass on the PR before you merge.

### Checks that run before and alongside deploys

| Workflow | Trigger | What it runs |
|---|---|---|
| `ci.yml`: Lint & Type Check | Push to any branch, PRs to `main` | `npm run lint`, `npx tsc --noEmit` |
| `ci.yml`: Quality Gates | Push to any branch, PRs to `main` | `npm test`, `npm audit --audit-level=critical`, `node scripts/checks/no-console-log.js`, `node scripts/audit-dependencies.cjs` |
| `ci.yml`: Build | Push to `main`, PRs to `main` | `npm run build` with `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` set and no `SANITY_API_TOKEN`, so the build has to succeed on fallback content alone |
| `secret-scan.yml` | Push/PR to `main` or `master` | Gitleaks |
| `security.yml` | Push/PR to `main` or `master`, weekly cron (Mondays 02:30 UTC) | `npm audit --audit-level=critical`, TruffleHog, CycloneDX SBOM (uploaded as artifact `sbom`), `license-checker --failOn "AGPL;GPL"`. CodeQL runs only if the repository is public. |

### Local release gate

`scripts/release-verification.ts` runs six gates, all critical, cheapest first:

| Gate | Check |
|---|---|
| GATE-01 | `npm run lint` |
| GATE-02 | `npx tsc --noEmit` |
| GATE-03 | `npm test` |
| GATE-04 | `npm run build` |
| GATE-05 | `npm audit --audit-level=critical` |
| GATE-06 | Evidence schema validation (in-process) |

```bash
npx tsx scripts/release-verification.ts
```

If a gate fails, the pipeline stops and writes a `HOLD` decision. If all six pass, it writes `PROMOTE`. Either way the result is recorded as a signed evidence bundle in `docs/evidence/`. No workflow runs this gate; you run it by hand.

## Environment setup

Set production variables in the Vercel project's environment settings, not in the repository. <!-- VERIFY: production env vars are managed in the Vercel dashboard for the hc-demo project --> [CONFIGURATION.md](CONFIGURATION.md) has the full table. For a working production deployment:

| Variable | Why production needs it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | `src/content/sanity/env.ts` throws on import without them. Because they are `NEXT_PUBLIC_`, they are built into the client bundle, so changing them needs a rebuild. |
| `SANITY_API_TOKEN` | Without it the Sanity client returns no data and every page renders from `src/content/fallback/`. |
| `SANITY_REVALIDATE_SECRET` | `/api/revalidate` returns 500 on every webhook call if this is unset. It must match the secret on the Sanity webhook. <!-- VERIFY: revalidation webhook is configured at sanity.io/manage and points at the production /api/revalidate URL --> |
| `DATABASE_URL` | `/api/leads` cannot save leads without it. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Without them a lead is still saved, but the lead is marked `telegram_status: "failed"` and no alert is sent. |
| `RESEND_API_KEY`, `STAFF_EMAIL` | Optional. Lead notification emails. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional, but without both `/api/leads` has no rate limit. |

GitHub repository secrets for the deploy workflow: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Release signing uses `EVIDENCE_PRIVATE_KEY` (see `docs/evidence/SIGNING.md`).

With `NODE_ENV=production`, `/api/seed` returns 403 and the Sanity Vision tool is left out of `/studio`.

### Database schema

The repository has no `prisma/migrations/` directory, although `prisma.config.ts` points at that path. Nothing in the deploy pipeline changes the database schema. `postinstall` only runs `prisma generate`. Any change to the `Lead` model has to be applied to the production database by hand before the code that depends on it is deployed. <!-- VERIFY: how schema changes are applied to the production database (e.g. `prisma db push` against DATABASE_URL) -->

## Rollback procedure

None of the workflows has a rollback step. Use Vercel's deployment history:

1. Open the `hc-demo` project in the Vercel dashboard and go to **Deployments**. <!-- VERIFY: Vercel team/project URL for hc-demo -->
2. Find the last good production deployment and choose **Instant Rollback** (or **Promote to Production**). The CLI equivalent is:
   ```bash
   npx vercel rollback <deployment-url> --token="$VERCEL_TOKEN"
   ```
3. Revert the bad commit on `main` (`git revert <sha>` and push). If you skip this, the next push to `main` redeploys the broken code.
4. If the bad release changed Sanity content, not code, roll back the document in Sanity Studio (`/studio`) instead. The revalidation webhook then refreshes the affected cache tags.

Because schema changes are made by hand (see above), a code rollback does not undo them. Check that the previous build still works with the current `Lead` table.

## Monitoring

The repository does not include an APM or error-tracking SDK. `package.json` has no Sentry, Datadog, New Relic or OpenTelemetry dependency, and no `instrumentation.ts` file exists.

What is available:

- **Structured logs:** `src/lib/logger.ts` writes one-line JSON (`level`, `event`, `timestamp`, context) to `console.log`, `console.warn` and `console.error`. On Vercel these lines show up in the project's runtime logs. <!-- VERIFY: log retention and any log drain configured on the Vercel project -->
- **Revalidation failures:** `/api/revalidate` logs an error when `SANITY_REVALIDATE_SECRET` is missing or revalidation throws.
- **Lead delivery:** each `Lead` row records a Telegram notification status (`pending`, `sent`, `failed`). Leads whose alert failed can be retried through `POST /api/leads/retry` with `{ "lead_id": "..." }`. The retry is idempotent and does not resend a `sent` alert.
- **Scheduled security checks:** `security.yml` runs every Monday. Dependabot is configured in `.github/dependabot.yml`.
- **Key rotation:** `key-rotation-reminder.yml` opens a GitHub issue each quarter (1 January, April, July and October). The issue body still refers to Supabase keys, which this codebase no longer uses. Treat it as a reminder to rotate the current secrets listed above.
