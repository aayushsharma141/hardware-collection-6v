# `src/lib/`

Non-React logic, grouped by domain. This folder was previously flat and mixed
domain rules, design tokens, browser helpers and a service layer; the
subfolders exist to keep that from happening again.

| Folder | Holds |
|---|---|
| `collections/` | Collection routing and tier rules |
| `integrations/` | Third-party surfaces — WhatsApp deep links |
| `browser/` | Browser-only helpers — scroll lock |
| `motion/` | Shared motion tokens |
| `leads/` | Lead capture service — schema, persistence, email, Telegram |
| `config.ts` | Site-wide constants (root-level, used almost everywhere) |

## Conventions

Files are camelCase. Folder names carry the domain, so modules do not repeat
it — `collections/routing.ts`, not `collections/collectionRouting.ts`.

Nothing here may import from `components/`. Dependencies point one way:
components → lib, never the reverse.

Tests colocate in a `__tests__/` folder beside their subject.
