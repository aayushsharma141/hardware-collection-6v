# scripts/

Utility and automation scripts for the Hardware Collection project.

| Subfolder | Purpose |
|-----------|---------|
| build/  | Build pipeline helpers (progressive enhancement, pipeline verification) |
| checks/ | Page health checks, test runners, and smoke tests |
| cms/    | Sanity content scripts — seeding, category reconciliation, copy sync |
| db/     | Database scripts — SQL inserts, schema, migration runners |

| Root script | Purpose |
|-------------|---------|
| audit-dependencies.cjs | Legacy design-token / button import audit (not a CVE scanner) |
| build-catalog-index.mjs | Builds per-catalogue search indexes for the catalogue viewer |
| compress-catalogs.py | Recompresses brand catalog PDFs before upload to Sanity |
| evidence-engine.ts | Evidence platform validation |
| generate-docs-registry.js | Generates a docs registry (writes to a legacy `apps/web/` path that no longer exists) |
| migrate-category-images.ts | Uploads category images to Sanity |
| release-verification.ts | Release quality gate pipeline |
| seed-phase9-content.ts | Seeds Sanity space documents from fallback content |
| seed-truth.ts | Seeds Sanity site settings, home page and brand data |
| sync-pdfjs-assets.mjs | Copies pdf.js runtime assets into `public/` |

Retired one-off scripts live in `_quarantine/` (see `_quarantine/README.md`).

> These scripts are development/ops utilities. They are **not** part of the production bundle.
