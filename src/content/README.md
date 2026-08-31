# `src/content/` — where page content comes from

Two folders, one rule.

## The rule

**`sanity/` is canonical. `fallback/` is a safety net.**

| | `sanity/` | `fallback/` |
|---|---|---|
| Purpose | The real content, editable at `/studio` | Static tables so the site renders if Sanity is unreachable |
| Who edits it | Anyone, through the Studio UI | Developers, rarely |
| Wins a conflict | Yes — Sanity values are spread over fallback | No |

If you are about to edit `fallback/` to change what the site *says*, stop —
that belongs in Sanity. Edit `fallback/` only to keep the offline safety net
in step with a schema change.

`fallback/` is **not** a second CMS and must not grow into one.

## Layout

```text
sanity/
  schemaTypes/   document schemas — the shape of editable content
  queries.ts     GROQ queries; each catches its own error and returns []
  client.ts      configured next-sanity client
  env.ts         projectId / dataset / apiVersion
  structure.ts   Studio desk layout
fallback/
  brands.ts  catalog.ts  home.ts  spaces.ts
```

## Two things to know

Sanity query failures are **silent** — every query returns `[]` on error, so a
CMS outage degrades to fallback content without a visible signal.

The merge of Sanity over fallback currently happens **inline in each route
file**, not in a shared adapter. See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).
