# Findings & Architecture Discoveries

## 1. Workspace Layout
- **Root Directory**: Next.js 16.3.3 + React 19 application root cleanly organized.
- **Components Structure**: Cleanly organized into `src/components/collections/`, `src/components/catalog/`, `src/components/consultation/`, `src/components/home/`, `src/components/visual/`.
- **Organized Utilities & Reports**:
  - `scripts/dev/_fix_imports.py` and `scripts/dev/clean_imports.py` (one-off AST regex refactoring scripts for Lucide icon imports).
  - `scripts/dev/test-sanity.js` (ad-hoc CommonJS sanity client check script).
  - `scripts/cms/seed.mjs` (Sanity CMS dataset seeder).
  - `audit-reports/trace.json` (Next.js / Chrome profiling trace).
  - `audit-reports/lighthouse-report.html` (Static Lighthouse audit report).
  - `audit-reports/canvas_structure.json` (UI canvas structure export).

## 2. Documentation State
- Root markdown files (`CLAUDE.md`, `README.md`, `SYSTEM_ARCHITECTURE.md`, `WORKSPACE_MAP.md`) contain canonical instructions and architectural definitions.
- All code blocks, paths, and commands remain valid.

## 3. Test & Build Health
- `vitest` unit tests: 23/23 passing across `src/lib/__tests__`, `src/lib/leads/__tests__`, and `src/types/__tests__`.
- `next build`: 10/10 static/dynamic routes compiled cleanly with Turbopack.
