<!-- generated-by: gsd-doc-writer -->
# Testing

The project has two test tiers:

| Tier | Framework | Location | Command | Needs a running server |
|---|---|---|---|---|
| Unit | Vitest (`^4.1.11`) | `src/**/*.test.{ts,tsx}` | `npm test` | No |
| End-to-end | Playwright (`@playwright/test` `^1.50.1`) | `tests/e2e/*.spec.ts` | `npm run test:e2e` | Yes, Playwright starts one |

## Test framework and setup

### Vitest (unit)

Configured in `vitest.config.mjs`:

- **Include pattern:** `src/**/*.test.{ts,tsx}`. Any test file under `src/` runs, whether it sits in a `__tests__/` folder or next to its source file.
- **Environment:** `node`. There is no jsdom or happy-dom environment, so tests that touch browser globals have to stub them (see `src/lib/browser/__tests__/scrollLock.test.ts`, which provides a minimal `document.body`).
- **Path alias:** `@` resolves to `./src`, matching `tsconfig.json`, so tests can import `@/lib/...` the same way application code does.
- **Environment variables:** the config loads `.env.local` through `dotenv` before tests run. The current unit tests do not read `process.env`, so the suite runs without a `.env.local` file.

Setup:

```bash
npm install
```

`npm install` also runs the `postinstall` hook (`prisma generate` plus the pdf.js asset sync). No database or Sanity connection is needed for unit tests.

### Playwright (end-to-end)

Configured in `playwright.config.ts`:

- **Test directory:** `./tests/e2e`
- **Base URL:** `http://localhost:3000`
- **Projects:** `chromium` (Desktop Chrome), `mobile-pixel` (Pixel 7), `mobile-iphone` (iPhone 14, which runs on WebKit)
- **Web server:** runs `npm run dev` and waits up to 120 seconds for `http://localhost:3000`. Locally it reuses a dev server that is already running; with `CI` set it always starts a fresh one.
- **CI behaviour:** with `CI` set, `test.only` fails the run (`forbidOnly`) and failed tests are retried twice. Traces are recorded on the first retry.
- **Reporter:** `list`

Install the browser binaries once before the first e2e run:

```bash
npx playwright install chromium webkit
```

The e2e specs drive the real site, so the dev server needs a working environment (see [CONFIGURATION.md](CONFIGURATION.md)). If Sanity is unreachable, pages render from `src/content/fallback/`.

## Running tests

Run the full unit suite once:

```bash
npm test
```

Run Vitest in watch mode (there is no npm script for this):

```bash
npx vitest
```

Run a single unit test file or filter by name:

```bash
npx vitest run src/lib/leads/__tests__/schema.test.ts
npx vitest run -t "route inventory"
```

Run all end-to-end specs across the three device projects:

```bash
npm run test:e2e
```

Run one spec or one device project:

```bash
npx playwright test tests/e2e/mobile-journeys.spec.ts
npx playwright test --project=chromium
```

The full release gate (lint, type check, unit tests, build, `npm audit`, evidence validation) runs the unit suite as GATE-03:

```bash
npx tsx scripts/release-verification.ts
```

## Writing new tests

### Unit tests

- **Naming:** `*.test.ts` or `*.test.tsx`. Anything outside `src/` will not be picked up.
- **Placement:** the existing tests sit in a `__tests__/` folder next to the code they cover, for example `src/lib/collections/__tests__/arrange.test.ts` covers `src/lib/collections/arrange.ts`. Follow that convention.
- **Imports:** import `describe`, `it`, `expect` (and `beforeEach`, `vi` as needed) from `"vitest"` explicitly. Globals are not enabled.
- **No shared helpers:** there is no setup file or shared fixture module. Each test builds its own inputs.

Existing unit tests by area:

| Area | Files |
|---|---|
| Collections logic and routing | `src/lib/collections/__tests__/` (`arrange`, `catalogue`, `showroom`, `routeInventory`) |
| Sanity content integrity | `src/content/sanity/__tests__/` (`schemaQueryParity`, `slugUniqueness`) |
| Fallback content | `src/content/fallback/__tests__/` (`brands`, `catalogFiltering`, `homeLinks`, `showroomTaxonomy`) |
| Lead validation (Zod) | `src/lib/leads/__tests__/schema.test.ts` |
| Catalogue viewer | `src/components/catalog/viewer/__tests__/` (`pageAt`, `pageScale`), `src/lib/catalog/__tests__/capture.test.ts`, `src/types/__tests__/catalog.test.ts` |
| Home page | `src/components/home/__tests__/families.test.ts` |
| Hooks and browser utilities | `src/hooks/__tests__/useCollectionsState.test.ts`, `src/lib/browser/__tests__/scrollLock.test.ts`, `src/lib/__tests__/contrast.test.ts` |

Some tests are architectural guards rather than unit tests. They scan source files or compare definitions so that a class of bug fails CI instead of reaching visitors:

- `routeInventory.test.ts` walks `src/` and fails if any file links to `/collections/<slug>`. The site has only `/` and `/collections`, and categories render as in-page sections.
- `schemaQueryParity.test.ts` checks that every field a GROQ query reads exists on the matching Sanity schema type.

When a bug is possible in code that type-checks, lints and builds cleanly, consider adding a guard test like these.

### End-to-end tests

- **Naming:** `tests/e2e/<name>.spec.ts`
- **Imports:** `import { test, expect } from "@playwright/test";`
- **Device-specific behaviour:** use the `isMobile` fixture to branch, as `tests/e2e/mobile-journeys.spec.ts` does. Each spec runs once per project (desktop, Pixel 7, iPhone 14).
- **URLs:** use relative paths with `page.goto("/")`. The base URL comes from the config.

Current specs: `mobile-journeys.spec.ts`, `motion-protocol.spec.ts`, `phase12-ui-polish.spec.ts`.

### Scripts that are not part of the suite

`scripts/checks/test-*.{cjs,mjs,js}` are not Vitest or Playwright tests and do not run under `npm test`. Most of them (`test-estimator`, `test-leads`, `test-login`, `test-verify`) target a Supabase backend and an `apps/web/` directory that this repository no longer has; `test-lock` drives a CRM admin page on `127.0.0.1:8080` that this project does not have. Don't use them as examples for new tests.

## Coverage requirements

No coverage threshold is configured. `vitest.config.mjs` has no `coverage` section, and the project has no `.nycrc` or `c8` config. To get a coverage report anyway, install `@vitest/coverage-v8` and run `npx vitest run --coverage`.

## CI integration

Unit tests run in the **CI** workflow (`.github/workflows/ci.yml`):

- **Triggers:** every push to any branch, and pull requests targeting `main`
- **Job:** `quality-gates` ("Quality Gates") on `ubuntu-latest` with Node.js 20.x
- **Steps:** `npm ci`, then `npm test`, `npm audit --audit-level=critical`, `node scripts/checks/no-console-log.js`, and `node scripts/audit-dependencies.cjs`

The same workflow also runs a `lint-and-typecheck` job (`npm run lint`, `npx tsc --noEmit`) and, on `main` and on pull requests only, a `build` job (`npm run build`).

**End-to-end tests do not run in CI.** No workflow calls `npm run test:e2e` or `playwright test`, so run them locally before merging UI changes.
