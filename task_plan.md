# Task Plan: Codebase Organization & Context Architecture

## Objective
Establish clean file organization, persistent file-based context management, and unslop documentation across the Hardware Collection workspace.

## Phases

### Phase 1: Planning with Files & Filesystem Context Setup
- [x] Initialize `task_plan.md`, `findings.md`, and `progress.md` in project root
- [x] Configure persistent memory and context discovery anchors
- Status: `completed`

### Phase 2: Root Clutter & File Organization
- [x] Move developer utility scripts (`_fix_imports.py`, `clean_imports.py`, `test-sanity.js`) to `scripts/dev/`
- [x] Move Sanity CMS seed script (`seed.mjs`) to `scripts/cms/seed.mjs`
- [x] Move transient profiling/audit artifacts (`trace.json`, `lighthouse-report.html`, `canvas_structure.json`) to `audit-reports/`
- Status: `completed`

### Phase 3: Natural Language Documentation Unslop
- [ ] Audit markdown documentation (`CLAUDE.md`, `README.md`, `WORKSPACE_MAP.md`) for AI idioms and fluff
- [ ] Strip sycophancy, transition filler, and stock adjectives while preserving code blocks, paths, and technical commands
- Status: `pending`

### Phase 4: Verification & Maintenance
- [x] Verify build (`npm run build`), TypeScript (`npx tsc --noEmit`), and test suite (`npm test`)
- [x] Update `progress.md` and `findings.md`
- Status: `completed`

## Decisions & Assumptions
- All movements are non-destructive and preserve scripts in organized subdirectories.
- Next.js build and routing files (`next.config.ts`, `sanity.config.ts`, `prisma.config.ts`, `vitest.config.mjs`) remain at root.
