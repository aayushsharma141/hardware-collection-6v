<!-- generated-by: gsd-doc-writer -->
# Getting Started

This guide takes you from a fresh clone to the Hardware Collection site running at `http://localhost:3000`. The site is a Next.js 16 (App Router) application. Its content comes from Sanity CMS, and it uses PostgreSQL through Prisma only for lead capture.

## Prerequisites

- `Node.js >= 20.12`. The package has no `engines` field and the repo has no `.nvmrc`. Every CI workflow in `.github/workflows/` uses Node `20.x`. `scripts/build-catalog-index.mjs` loads `.env.local` with `process.loadEnvFile`, and Node added that function in 20.12. On older versions the script cannot read `.env.local`, so it skips the catalogue index.
- `npm`. The repo commits a `package-lock.json`, and CI installs with `npm ci`.
- Git.
- Sanity project ID and dataset names. The app will not start without them (see [First run](#first-run)).
- Optional: a PostgreSQL database. You need it only to test the lead form (`/api/leads`).
- Optional: Playwright browsers, which the end-to-end tests need (`npx playwright install`).

## Installation steps

1. Clone the repository:

   ```bash
   git clone https://github.com/aayushsharma141/hardware-collection-6v.git
   ```

2. Move into the project directory:

   ```bash
   cd hardware-collection-6v
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   `postinstall` runs two steps automatically:
   - `prisma generate` builds the Prisma client from `prisma/schema.prisma`.
   - `node scripts/sync-pdfjs-assets.mjs` copies the pdf.js worker, fonts, CMaps and decoders from `node_modules/pdfjs-dist` into `public/`, where the catalogue viewer loads them.

4. Create `.env.local` in the project root. The repository has no `.env.example`. Next.js loads `.env.local` automatically, and `.gitignore` keeps every `.env*` file out of git. Start with the two variables the app needs to boot:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=
   NEXT_PUBLIC_SANITY_DATASET=
   ```

   The CI build job in `.github/workflows/ci.yml` sets these to `gfwqxrd2` and `production`. Both are `NEXT_PUBLIC_` values that ship in the client bundle, so they are not secrets. For the full variable list (`SANITY_API_TOKEN`, `DATABASE_URL`, Telegram, Resend and Upstash), see [CONFIGURATION.md](CONFIGURATION.md).

## First run

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`. You can open the embedded Sanity Studio at `http://localhost:3000/studio`.

Without `SANITY_API_TOKEN`, the Sanity client returns no data, and pages render from the static fallback content in `src/content/fallback/`. The site still works. To see live CMS content, add a Sanity read token as `SANITY_API_TOKEN` in `.env.local` and restart the dev server.

To check that your setup matches CI, run the unit tests. They do not need any Sanity credentials:

```bash
npm test
```

## Common setup issues

**`Error: Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID` (or `..._DATASET`)**
`src/content/sanity/env.ts` throws this error when either variable is unset and `NODE_ENV` is not `test`. Add both to `.env.local`, then restart `npm run dev`. Next.js reads env files only at startup.

**Pages show placeholder or fallback content instead of CMS data**
This is expected when `SANITY_API_TOKEN` is unset. The site falls back to `src/content/fallback/` rather than failing. Add the token to `.env.local` if you need live content. Do not edit the fallback tables to change content. Sanity is the canonical source.

**Catalogue PDF viewer fails with `UnknownErrorException: Failed to fetch`**
The pdf.js runtime files in `public/` are missing or don't match the installed `pdfjs-dist` version. They normally sync on `npm install`. To re-sync them by hand:

```bash
node scripts/sync-pdfjs-assets.mjs
```

`npm run build` runs the same script with `--check` in `prebuild`. That check fails the build if the files have drifted.

**Catalogue search shows "Search index is unavailable for this catalog."**
`prebuild` builds the per-catalogue search indexes in `public/search-indexes/`, and only when Sanity credentials are available. If they are missing, the script logs `[catalog-index] Sanity project not configured; skipping.` and the build continues. This is harmless in local development.

**Lead form submissions fail locally**
`/api/leads` needs `DATABASE_URL` pointing at a PostgreSQL database that has the `Lead` table. The repo has no `prisma/migrations` folder, so the schema in `prisma/schema.prisma` is the only definition of the table. Telegram and email alerts also need their own variables. Without them, the lead is still saved, but its notification status is marked `failed`. See [CONFIGURATION.md](CONFIGURATION.md#required-vs-optional-settings).

**Port 3000 is already in use**
If port 3000 is taken, `next dev` starts on the next free port. The Playwright config (`playwright.config.ts`) expects `http://localhost:3000`. When `CI` is unset, it reuses whatever server is already running on that port. Stop other processes on port 3000 before you run `npm run test:e2e`.

**Pre-commit hook errors**
`.husky/pre-commit` runs `npm run typecheck` and `npx lint-staged`. However, `package.json` defines no `typecheck` script, and `lint-staged` is not a declared dependency. If the hook fails, run the same checks by hand with `npx tsc --noEmit` and `npm run lint`.

## Next steps

- [ARCHITECTURE.md](ARCHITECTURE.md): how a request becomes a page, and which folder new code belongs in. Read it before adding files.
- [CONFIGURATION.md](CONFIGURATION.md): every environment variable, its default, and how settings change between environments.
- [DEVELOPMENT.md](DEVELOPMENT.md): local development setup, every npm script, code style, and the PR process.
- [TESTING.md](TESTING.md): running the unit and end-to-end suites, writing new tests, and how tests run in CI.
- [README.md](../README.md): the command list (build, lint, typecheck, unit and end-to-end tests) and the repository layout.
