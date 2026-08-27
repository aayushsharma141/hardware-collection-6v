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

### Pass 2.5: Lint, Schema & Type Consistency Audit
- [x] Fix P0 Rules of Hooks conditional execution in `HeroStage.tsx`
- [x] Fix JSX unescaped entities in `ReviewsSlide.tsx` and `TactileStatement.tsx`
- [x] Fix React 19 / Next 16 `react-hooks/set-state-in-effect` compiler warnings in `CollectionsClient.tsx`, `Navbar.tsx`, and `ConsultationForm.tsx`
- [x] Strictly type Lead notification payloads and handlers in `src/lib/leads/`
- [x] Remove `as any` in Sanity schema icons and catalog lookups
- Status: `completed`

### Phase 3: Natural Language Documentation Unslop
- [ ] Audit markdown documentation (`CLAUDE.md`, `README.md`, `WORKSPACE_MAP.md`) for AI idioms and fluff
- [ ] Strip sycophancy, transition filler, and stock adjectives while preserving code blocks, paths, and technical commands
- Status: `pending`

### Phase 4: Verification & Maintenance
- [x] Verify build (`npm run build`), TypeScript (`npx tsc --noEmit`), and test suite (`npm test`)
- [x] Update `progress.md` and `findings.md`
- Status: `completed`
