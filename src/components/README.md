# `src/components/`

Every component lives in a domain folder. There are no loose files at this
root, and adding one is the thing most likely to make this tree unreadable
again.

| Folder | Scope |
|---|---|
| `layout/` | Site chrome present across pages — Navbar, Footer |
| `brand/` | Logo, wordmark, brand trust marks |
| `ui/` | Generic primitives reused across three or more domains |
| `home/` | Homepage sections in one flat folder; hero and mobile variants are sibling files (`HeroStage.tsx`, `HeroMobile.tsx`) |
| `collections/` | Collection browsing, filtering, product cards and drawers |
| `catalog/` | Catalog library and PDF viewer |
| `consultation/` | Lead capture — drawer, form, success state |
| `reviews/` | Testimonials and ratings |
| `animations/` | Motion primitives — fades, parallax, tilt, cursor |
| `providers/` | React context providers |
| `preview/` | Draft Mode banner shown while previewing Sanity drafts |

## Choosing a folder

Used by one domain → that domain's folder. Used by three or more → `ui/`.
Site chrome → `layout/`. If none fit, create a new domain folder rather than
dropping the file here.

`animations/` holds behaviour you wrap content in. Decorative layers that render
on their own (atmosphere, watermark, particles) currently live in `home/`.
