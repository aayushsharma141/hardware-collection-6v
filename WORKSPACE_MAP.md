# Hardware Collection — Workspace Map

Directory structure for the Hardware Collection repository.

```
Hardware-Collection/
├── src/                            # Next.js application source
│   ├── app/                        # App Router pages and API routes
│   ├── components/                 # Shared UI components
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Server utilities (leads, sanity, scroll)
│   ├── sanity/                     # Sanity schema definitions and config
│   └── types/                      # Shared TypeScript types
│
├── prisma/                         # Prisma schema (Lead model — PostgreSQL)
├── scripts/                        # Developer utilities, CMS seed, DB tools
│   ├── build/                      # Build-time scripts
│   ├── checks/                     # Smoke tests and header checks
│   ├── cms/                        # Sanity CMS seed (seed.mjs)
│   ├── db/                         # Database schema and migration scripts
│   ├── debug/                      # Playwright and log debugging utilities
│   ├── dev/                        # One-off developer scripts
│   └── legacy/                     # Archived patch scripts
│
├── public/                         # Static assets served by Next.js
├── docs/                           # Working project documents
│   ├── brand-assets/               # HC logos and partner brand logos
│   ├── strategy/                   # Strategy presentations and roadmaps
│   ├── hiring/                     # Hiring notes
│   ├── operations/                 # GMB docs, proposals, pricing briefs
│   ├── photos/                     # Showroom photography
│   └── web-assets/                 # Web banners and display graphics
│
├── audit-reports/                  # Profiling and audit artifacts (gitignored)
├── _archive/                       # Deprecated concepts and legacy pages
│   ├── hc-demo/                    # Archived interactive client demos
│   ├── index.html                  # Legacy coming-soon page
│   └── old_archive/                # Archived one-off scripts
│
├── Hardware Collection/            # Master archive — raw brand assets and docs
│   ├── branding/                   # Primary logos and QR codes
│   ├── photos/                     # Showroom photography originals
│   └── docs/                       # Master document archive
│
└── .agents/                        # Agent registry, workflows, and rules
```

## Key Conventions

- **Production code**: All active Next.js development lives at the repository root (`src/`, `prisma/`, `public/`).
- **Static assets**: Place web-required static files in root `public/`.
- **Master originals**: Raw brand assets and strategy files live in `Hardware Collection/` (authoritative source).
- **Working copies**: `docs/` holds organized working copies by category.
- **Archive**: `_archive/` holds deprecated projects and legacy pages.

## Naming Conventions

- HC logos: `hc_logo_<variant>.png` (e.g. `hc_logo_hq`, `hc_logo_smb`, `hc_logo_cover`)
- Strategy versioning: `_v2`, `_v3` suffix — not Windows copy artifacts like `(1)`
- No spaces in filenames — use `_` for word separation
- No duplicate extensions (`.pptx.pptx` is incorrect)
