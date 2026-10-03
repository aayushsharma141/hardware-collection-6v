# _quarantine — retired files awaiting review

Created 2026-10-03 during the root clean-up. **Nothing here is used by the website.**
It is excluded from lint (`eslint.config.mjs`), type-checking (`tsconfig.json`),
search (`.ignore`) and Vercel uploads (`.vercelignore`). Don't treat anything here as
current instructions or architecture. The current sources of truth are `CLAUDE.md`,
`PRODUCT.md`, `docs/ARCHITECTURE.md` and `.planning/`.

`MANIFEST.tsv` records every move (category, original path, new path), so any item can
be restored with `git mv` (tracked files) or `mv`. `git-status-before.txt` is the
working-tree state taken just before the clean-up.

| Folder | What | Why retired |
|---|---|---|
| `apep-scaffolding/` | `.brain .rules .context .decisions .docs .apep .skills CHANGELOG.md` | Aug 2026 "APEP" bootstrap; describes the old 13-category model, superseded by CLAUDE.md + .planning |
| `old-tool-configs/` | `.kombai .stitch .trae .windsurf .codex .gemini GEMINI.md .ai-assets`, unused `.agents/*` sections and skills (CRM, admin dashboard, React Native, Vite) | Tools and concepts not used by this project |
| `stale-docs/` | `WORKSPACE_MAP.md`, route/page architecture docs, `docs/{architectural-notes,history,references}`, `plans/`, `.planning/{CONSTITUTION,PROJECT}.md`, `.planning/tasks/` | Describe routes/structure that no longer exist (`/catalogs`, 18 category pages, `src/sanity/`) |
| `history/audit-reports/` | Audit reports 01–12 + screenshots, traces, lighthouse | Point-in-time findings, already actioned |
| `one-off-scripts/` | 6 root scripts + 39 unreferenced `scripts/*` + `scripts/{legacy,dev,debug}` | Run once; nothing (package.json, CI, other scripts) references them |
| `unused-public-assets/` | `public/` files the code never references, incl. byte-identical duplicates | Logo variants, old banner/screenshots. Sanity logos are uploaded image assets, not paths |
| `local-only/` | broken submodule stubs (ECC etc.), `graphify-out/`, `.planning/graphs/`, `test-results/` | Gitignored generated output; all regenerable |

Moved out of the repo entirely: `Hardware Collection/` (raw catalogues/photos, 897 MB),
now at `E:\Hardware-Collection-Archive\Hardware Collection`.
