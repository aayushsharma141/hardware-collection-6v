# Hardware Collection Workspace Map

This document outlines the organization and directory structure of the **Hardware Collection** repository.

```
Hardware-Collection/
├── src/                            # Next.js Application source code (app, components, data)
├── public/                         # Static web assets served directly by Next.js
├── docs/                           # Project-specific working documents
│   ├── brand-assets/               # HC primary logos (hc_logo_*.png)
│   │   └── brand-logos/            # Partner/vendor brand logos (SVG/PNG)
│   ├── strategy/                   # Digital strategy presentations & roadmaps
│   ├── hiring/                     # Hiring notes & job notices
│   ├── operations/                 # GMB docs, proposals, invoices, pricing, briefs
│   ├── photos/                     # Showroom photography & screen captures
│   └── web-assets/                 # Web banners and display graphics
│
├── _archive/                       # Archived concepts, legacy pages, and scripts
│   ├── hc-demo/                    # Archived Interactive Client Demos (Concepts 1-4)
│   ├── index.html                  # Standalone legacy coming-soon single page
│   └── old_archive/                # Archived one-off scripts and temp data dumps
│
├── Hardware Collection/            # Master Archive — Raw Brand Assets & Strategy Docs
│   ├── branding/                   # Primary logos (hc_logo_*.png) & QR codes
│   ├── photos/                     # Showroom exterior/interior photography
│   └── docs/                       # Master document archive
│       ├── strategy/               # Digital strategy presentations & roadmaps
│       ├── hiring/                 # Hiring notices & notes
│       └── operations/             # GMB docs & audit checklists
│
└── .agents / .apep / .brain        # System configuration & agent working memory
```

## Key Guidelines
- **Production Code**: All active Next.js development takes place at the root of this repository.
- **Public Assets**: Static assets required for web display must reside in the root `public/` directory.
- **Brand Raw Materials**: Master document originals, strategy files, and logos are archived under `Hardware Collection/` (the authoritative master copy).
- **Working Docs**: `docs/` holds working copies organized by category (brand-assets, strategy, hiring, operations, photos, web-assets).
- **Archive**: `_archive/` holds deprecated projects (like `hc-demo`), legacy pages, and temp data dumps.

## Naming Conventions
- HC logos: `hc_logo_<variant>.png` (e.g. `hc_logo_hq`, `hc_logo_smb`, `hc_logo_cover`)
- Strategy versioning: `_v2`, `_v3` suffix (not Windows copy artifacts like `(1)`)
- No spaces in file names — use `_` for word separation
- No duplicate extensions (e.g. `.pptx.pptx` is wrong)
