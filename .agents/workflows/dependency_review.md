<!-- generated-by: gsd-doc-writer -->
# Dependency, Refactoring & Documentation Review Workflow

**Trigger:** `/workflow dependency_review`
**Purpose:** Audit packages for vulnerabilities and dead weight, check that refactors keep their call sites intact, and keep `docs/` accurate.

---

## When to run

- When `package.json` or `package-lock.json` changes, including Dependabot PRs (`.github/dependabot.yml` opens daily npm PRs and weekly GitHub Actions PRs).
- After a refactor that renames or moves exports, props or files.

## Inputs

- `package.json`, `package-lock.json`, `.github/dependabot.yml`.
- `docs/DEVELOPMENT.md`, `docs/CONFIGURATION.md`, `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`.

## Steps

1. **Vulnerabilities.** Run `npm audit --audit-level=critical`. This is the blocking gate: GATE-05 in `scripts/release-verification.ts`, and the same command runs in `ci.yml` and `security.yml`. Then run plain `npm audit` and list any high or moderate findings for triage.
2. **Outdated packages.** Run `npm outdated`. A major bump to `next`, `react`, `sanity`, `next-sanity`, `prisma`/`@prisma/client`, `tailwindcss` or `vitest` needs `npm run build`, `npm test` and `npm run test:e2e` to pass before merge.
3. **Unused packages (manual).** The repo has no unused-dependency tool. For each package in `dependencies` and `devDependencies`, run `grep -rn "<package>" src scripts prisma *.config.*`. Packages used only by config or CLI (for example `@tailwindcss/postcss`, `prisma`, `eslint-config-next`) count as used. Also flag type-only or build-only packages that sit in `dependencies` instead of `devDependencies`.
4. **Legacy usage audit.** Run `node scripts/audit-dependencies.cjs`. It reports `ui/primitives/button` imports and legacy `var(--site-*)` tokens. Both should be zero.
5. **Refactoring safety.** For every renamed or removed export, prop or file in the diff, grep `src/` and `tests/e2e/` for remaining references, then run `npx tsc --noEmit` and `npm test`.
6. **Documentation.** If the change affects setup, scripts, environment variables, API routes or structure, update the matching file in `docs/` in the same PR. Check that every command and path the touched docs mention still exists.

## Pass/fail criteria

- **MUST FIX (fail):** a critical-severity `npm audit` finding; a type error or broken call site left by a refactor; a doc that names a removed command, route or env var.
- **SHOULD FIX:** high-severity advisories; unused packages; dev-only packages in `dependencies`.
- **COULD FIX:** clearer JSDoc on changed exports.
- **IGNORED:** patch-level bumps that pass CI.

## Output

Write `docs/reviews/dependency-review-YYYY-MM-DD.md`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. Include the `npm audit` summary by severity, the outdated majors, the suspected unused packages, and any docs that were updated.
