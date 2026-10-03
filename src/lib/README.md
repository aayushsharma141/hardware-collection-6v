# `src/lib/`

Non-React logic, grouped by domain. This folder was previously flat and mixed
domain rules, design tokens, browser helpers and a service layer; the
subfolders exist to keep that from happening again.

| Folder | Holds |
|---|---|
| `collections/` | The catalogue's showroom model: category → group mapping, row layout, product merge |
| `integrations/` | Third-party surfaces — WhatsApp deep links |
| `browser/` | Browser-only helpers — scroll lock |
| `motion/` | Shared motion tokens |
| `leads/` | Lead capture service — schema, persistence, email, Telegram |
| `catalog/` | Catalogue viewer funnel — analytics events, page capture, WhatsApp messages |
| `config.ts` | Site-wide constants (root-level, used almost everywhere) |
| `animations.ts` | GSAP motion duration constants and helpers (root-level) |
| `api-error.ts` | `ApiError` class and `handleApiError` for API routes (root-level) |
| `logger.ts` | Structured JSON logger (root-level) |

## Conventions

Files are camelCase (`api-error.ts` is the one kebab-case exception). Folder names carry the domain, so modules do not repeat
it — `collections/routing.ts`, not `collections/collectionRouting.ts`.

Nothing here may import from `components/`. Dependencies point one way:
components → lib, never the reverse.

Tests colocate in a `__tests__/` folder beside their subject.
