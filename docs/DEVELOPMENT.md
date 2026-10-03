<!-- generated-by: gsd-doc-writer -->
# Development

This guide covers setting up the Hardware Collection site for local development, the available npm scripts, code style tooling, and how changes reach `main`. To learn where new code belongs, read [ARCHITECTURE.md](ARCHITECTURE.md). For environment variables, read [CONFIGURATION.md](CONFIGURATION.md).

## Local setup

The repository does not pin a Node.js version: there is no `engines` field and no `.nvmrc`. Every GitHub Actions workflow uses **Node.js 20.x**, so use Node 20 locally to match CI.

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/aayushsharma141/hardware-collection-6v.git
   cd hardware-collection-6v
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   The `postinstall` hook runs two steps automatically:
   - `prisma generate`, which builds the Prisma client from `prisma/schema.prisma`.
   - `node scripts/sync-pdfjs-assets.mjs`, which copies the pdf.js runtime assets from `node_modules/pdfjs-dist` into `public/` for the catalogue viewer.

3. Create `.env.local` in the project root. The repository has no `.env.example`. The full variable list and a minimal template are in [CONFIGURATION.md](CONFIGURATION.md#config-file-format). For most UI work you only need:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`

   If `SANITY_API_TOKEN` is not set, pages render from `src/content/fallback/` rather than from live Sanity content. `DATABASE_URL` and the Telegram variables are only needed if you are testing lead capture (`/api/leads`).

4. Start the dev server:

   ```bash
   npm run dev
   ```

   The site runs at `http://localhost:3000`, and the embedded Sanity Studio runs at `http://localhost:3000/studio`.

You don't need a separate build step before `npm run dev`.

## Build commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js dev server (`next dev`) on port 3000. |
| `npm run build` | Creates a production build (`next build`). It runs `prebuild` first (see below). |
| `npm run start` | Serves the production build (`next start`). Run `npm run build` first. |
| `npm run lint` | Runs ESLint 9 using `eslint.config.mjs`. |
| `npm test` | Runs the Vitest unit suite once (`vitest run`). It picks up every `src/**/*.test.{ts,tsx}` file. |
| `npm run test:e2e` | Runs the Playwright specs in `tests/e2e/`. Outside CI it reuses a dev server that is already running; otherwise it starts its own with `npm run dev`. |
| `npx tsc --noEmit` | Type-checks the project. There is no npm script for this, so run it directly. |

The lifecycle hooks below run automatically. You should still know what they do:

| Hook | What it runs | Why it matters |
|---|---|---|
| `postinstall` | `prisma generate && node scripts/sync-pdfjs-assets.mjs` | Builds the Prisma client and copies the pdf.js assets into `public/`. |
| `prebuild` | `node scripts/sync-pdfjs-assets.mjs --check && node scripts/build-catalog-index.mjs` | Fails the build if the pdf.js assets in `public/` don't match the installed `pdfjs-dist`. Then it builds the catalogue search indexes. Index building is best-effort: if there are no Sanity credentials or no network, it logs the problem and the build continues. |

Other quality checks that CI and the release pipeline run:

```bash
npm audit --audit-level=critical          # dependency CVE audit (blocking at critical)
node scripts/checks/no-console-log.js      # fails on console.log in src/ (console.warn/error allowed)
node scripts/audit-dependencies.cjs        # legacy design-token / button.tsx migration audit
npx tsx scripts/evidence-engine.ts --validate   # evidence schema validation
npx tsx scripts/release-verification.ts         # full release gate (lint, tsc, tests, build, audit, evidence)
```

Despite its name, `scripts/audit-dependencies.cjs` does not scan for vulnerabilities. It looks for imports of `ui/primitives/button` and for legacy `var(--site-*)` tokens. The vulnerability scan is `npm audit`.

## Code style

- **ESLint 9** checks the code using the flat config in `eslint.config.mjs`. That config extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Run it with `npm run lint`. It ignores `scripts/**`, `public/**`, `_quarantine/**`, `.claude/**`, build output and a list of one-off debug scripts at the repo root.
- **TypeScript** runs in `strict` mode (`tsconfig.json`). Import from `src/` through the `@/*` path alias, for example `@/lib/config`. Check types with `npx tsc --noEmit`.
- **No `console.log` in `src/`.** `scripts/checks/no-console-log.js` enforces this rule in CI. Known issue: `src/lib/logger.ts` currently calls `console.log`, so this check fails until the logger is changed or exempted. Use `console.warn` or `console.error` for diagnostics that should reach production logs.
- **Formatting:** the project has no Prettier, Biome or `.editorconfig` config, so no formatter is enforced. Match the style of the file you are editing.
- **CSS:** Tailwind CSS v4 through `@tailwindcss/postcss`. `.vscode/settings.json` turns off VS Code's built-in CSS validator, because it doesn't recognise Tailwind v4 at-rules such as `@theme`.

### Git hooks

`.husky/pre-commit` runs `npm run typecheck` and then `npx lint-staged`. Husky and lint-staged are not listed in `package.json`, and the project has no `typecheck` script. Husky only runs this hook if `core.hooksPath` in your local git config points at `.husky`, and if it does run, it fails. Until those pieces are added, run `npm run lint` and `npx tsc --noEmit` yourself before you commit. <!-- VERIFY: whether the pre-commit hook is intended to be active for contributors -->

## Branch conventions

The default branch is `main`. No branch naming convention is documented. Recent branches follow a `<type>/<short-description>` pattern, for example:

- `feat/collections-family-index`
- `feat/ui-polish-round-2`
- `refactor/structure-legibility`
- `security/rotate-evidence-signing-key`

Commit messages mostly follow the Conventional Commits style, with an optional scope, for example `feat(collections): ...`, `fix(redirects): ...` or `chore: ...`.

Every push to `main` deploys to production on Vercel through `.github/workflows/deploy.yml`, so make your changes on a branch rather than committing to `main` directly.

## PR process

The repository has no `.github/PULL_REQUEST_TEMPLATE.md` or `CONTRIBUTING.md`. Pull requests target `main`, and these automated checks run on them:

- **CI** (`.github/workflows/ci.yml`). The *Lint & Type Check* job runs `npm run lint` and `npx tsc --noEmit`. The *Quality Gates* job runs `npm test`, `npm audit --audit-level=critical`, the `no-console-log` check and the migration audit. The *Build* job runs `npm run build`. The first two jobs run on every push to any branch. The Build job runs only on pull requests and on `main`.
- **Security Audits** (`.github/workflows/security.yml`) and **Secret Scan** (`.github/workflows/secret-scan.yml`, Gitleaks) run on pull requests to `main`.
- Before opening a PR, run `npm run lint`, `npx tsc --noEmit` and `npm test` locally. If your change affects layout, navigation or motion, also run `npm run test:e2e`.
- Put new code in the folder that the "Where does new code go?" table in [ARCHITECTURE.md](ARCHITECTURE.md#where-does-new-code-go) points to. Author content in Sanity, never in `src/content/fallback/`.
- Merging to `main` deploys to production automatically.
