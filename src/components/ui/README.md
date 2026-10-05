# `ui/`

Generic, domain-agnostic primitives — used by three or more domains and
carrying no business meaning. Most of this folder is **shadcn/ui** (`button`,
`card`, `badge`, `tabs`, `dialog`), copied in by `npx shadcn@latest add <name>`
and owned by us from then on.

A component belongs here only if you can describe it without naming a feature.
`Button` and `Dialog` qualify; `ProductCard` does not — that is `collections/`.

Notes on the shadcn copies:

- `components.json` is hand-written; **do not run `shadcn init`** — it rewrites
  `globals.css`. The shadcn colour tokens (`--color-card`, `--color-ring` …) are
  mapped onto the brand palette in the `@theme` block of `globals.css`.
- `--color-muted` is the brand's muted *text* colour, so shadcn's `bg-muted`
  (the default `TabsList` look) is wrong here; pass a `className`.
- The site is light-only, so the `dark:` classes shadcn ships were removed
  (otherwise they switch on with the visitor's OS setting).
- shadcn's CLI imports `cn` from `@/lib/utils`; if that file is ever missing it
  installs an unrelated npm package called `cn`. Check the import after `add`.
