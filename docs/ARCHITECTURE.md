# Architecture

How this codebase is organised and how a request turns into a rendered page.
Read this before adding files — the last section tells you where new code goes.

## The six concerns in `src/`

| Folder | Holds | Rule |
|---|---|---|
| `app/` | Routes, layouts, API handlers | File-based routing. A folder here **is** a URL. Nothing else lives here. |
| `components/` | React components, grouped by domain | Every component sits in a named folder. No loose files at the root. |
| `content/` | Everything that supplies page content | The only place content comes from. See below. |
| `hooks/` | Reusable React state | Client-side only. |
| `lib/` | Non-React logic, grouped by domain | `collections/`, `catalog/`, `integrations/`, `browser/`, `motion/`, `leads/`, plus root files `animations.ts`, `api-error.ts`, `config.ts`, `logger.ts`. |
| `types/` | Shared TypeScript types | Types used by more than one folder. |

## Content ownership — the rule that matters most

**Sanity is the canonical content source. `content/fallback/` is a resilience
mechanism, not a second content system.**

Anything a non-developer should be able to change — product names, category
copy, brand lists, hero text — belongs in Sanity, edited at `/studio`. The
static tables in `content/fallback/` exist so the site still renders if Sanity
is unreachable. They are a safety net, never the place to author content.

```text
Route  (src/app/<segment>/page.tsx)
  ↓
Page / Server Component
  ↓
Feature Component  (src/components/<domain>/)
  ↓
Content Adapter
  ↓
Sanity  (src/content/sanity/)
  │
  └── fallback only if explicitly required  (src/content/fallback/)
```

What this is deliberately **not**:

```text
Component
  ↓
src/content/fallback/*.ts
  ↓
Maybe Sanity has another version   ← ambiguity; do not reintroduce
```

If you find yourself editing `content/fallback/` to change what the site says,
stop. That change belongs in Sanity.

## How content actually flows today

Being precise, because the diagram above is the target and the code is not
fully there yet.

1. `content/sanity/queries.ts` defines GROQ queries and wraps each fetch in
   `try/catch`.
2. Route-level Server Components (`app/**/page.tsx`) call those query
   functions, usually in a `Promise.all`.
3. The route merges the Sanity result over the static fallback, then passes
   the merged data down to feature components as props.

`app/collections/page.tsx` is the clearest example: it passes the tables from
`content/fallback/catalog.ts` and the Sanity documents to `mergeCategories` /
`mergeProducts` in `lib/collections/catalogue.ts`, which build lookup maps and
spread Sanity documents over them so CMS values win field by field.

### Known gaps

Three things a new reader should know before trusting the diagram:

- **The content adapter is only partly a module.** `lib/collections/catalogue.ts`
  exports `mergeProducts` and `mergeCategories`, used by `app/collections/page.tsx`
  and `getShowroomGroups` in `content/sanity/queries.ts`; other routes still merge
  inline, each slightly differently. Extracting a
  shared adapter is the natural next refactor.
- **Sanity failures are silent.** Every list query catches its error and returns
  `[]`; single-document queries (`getHomePage`, `getSiteSettings`, `getNavigation`,
  `getLegalPageBySlug`) return `null`. A broken CMS degrades to fallback content with no visible signal, which
  is good for uptime and bad for noticing outages.
- **One route still hardcodes content.** `app/page.tsx` defines
  `fallbackHeroSlides` inline at the top of the file — a third content location
  outside both Sanity and `content/fallback/`. It should move into
  `content/fallback/` and then into Sanity.

## Request lifecycle

```text
Browser request
  ↓
src/app/layout.tsx          root shell — Navbar, providers (Footer is rendered per page)
  ↓
src/app/<segment>/page.tsx  Server Component; fetches and merges content
  ↓
*Client.tsx                 client boundary where interactivity is needed
  ↓
src/components/<domain>/    presentation
```

Lead capture runs the other direction: a consultation form posts to
`app/api/leads/`, which calls `lib/leads/` to validate, persist via Prisma, and
notify.

## Tests

Two tiers, deliberately separate:

| Tier | Location | Command | Needs a server |
|---|---|---|---|
| Unit | `src/**/__tests__/*.test.ts` | `npm test` | No |
| E2E | `tests/e2e/*.spec.ts` | `npm run test:e2e` | Yes — Playwright starts one |

Unit tests colocate with the code they cover. Put a test next to its subject,
not in a shared bucket.

## Where does new code go?

| You are adding | Put it in |
|---|---|
| A new page or URL | `src/app/<segment>/page.tsx` |
| A component used by one domain | `src/components/<that-domain>/` |
| A component used by three or more domains | `src/components/ui/` |
| Site chrome (header, footer, shell) | `src/components/layout/` |
| Content a non-developer should edit | A Sanity schema in `src/content/sanity/schemaTypes/` |
| A third-party integration | `src/lib/integrations/` |
| Pure logic with no React | `src/lib/<domain>/` |
| A type used by two or more folders | `src/types/` |

If nothing above fits, the folder you want probably does not exist yet. Create
one with a clear domain name rather than dropping the file at a folder root.
