<!-- generated-by: gsd-doc-writer -->
# API Reference

The site exposes a small set of HTTP routes under `src/app/api/`, built as Next.js App Router route handlers. There is no public API. Every route is used by the site, by Sanity, or by local tooling:

| Consumer | Routes |
|---|---|
| Site frontend (browser) | `/api/leads`, `/api/leads/retry`, `/api/catalog/[slug]/[index]`, `/api/catalog/[slug]/[index]/search` |
| Sanity (webhook and Presentation tool) | `/api/revalidate`, `/api/draft-mode/enable`, `/api/draft-mode/disable` |
| Local development only | `/api/seed` |

The project has no `middleware.ts` or `proxy.ts`, so each handler does its own authentication, validation and error handling. The environment variables these routes read are covered in [CONFIGURATION.md](CONFIGURATION.md).

## Authentication

There is no user authentication. Each route protects itself according to who calls it:

| Route | Mechanism |
|---|---|
| `POST /api/leads` | None (public form endpoint). Protected by a honeypot field and an optional rate limit. |
| `POST /api/leads/retry` | None. Callers must know the lead ID returned by `/api/leads`. |
| `GET /api/catalog/[slug]/[index]` | None (public, read-only). |
| `GET /api/catalog/[slug]/[index]/search` | None (public, read-only, rate limited). |
| `POST /api/revalidate` | Sanity webhook signature, checked with `parseBody` from `next-sanity/webhook` against `SANITY_REVALIDATE_SECRET`. |
| `POST /api/catalog/reindex` | `Authorization: Bearer <CATALOG_REINDEX_SECRET>`, or a Sanity webhook signed with the same secret. |
| `GET /api/draft-mode/enable` | Sanity preview secret, checked by `defineEnableDraftMode` from `next-sanity/draft-mode` using a client configured with `SANITY_API_TOKEN`. |
| `GET /api/draft-mode/disable` | None. |
| `POST /api/seed` | `Authorization: Bearer <SANITY_API_TOKEN>` header. Always returns `403` when `NODE_ENV === "production"`. |

The webhook secret has to match the value configured on the webhook in Sanity's project management console. <!-- VERIFY: the revalidation webhook is configured in sanity.io/manage for the production dataset and points at /api/revalidate -->

## Endpoints Overview

| Method | Path | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/leads` | Validates a lead, stores it in PostgreSQL, sends the email notification in the background and the Telegram alert before responding. | No |
| `POST` | `/api/leads/retry` | Retries a failed Telegram notification for an existing lead. Idempotent. | No |
| `GET` | `/api/catalog/[slug]/[index]` | Streams a brand catalog PDF from Sanity through the site's origin, with HTTP Range support. | No |
| `GET` | `/api/catalog/[slug]/[index]/search` | Searches one catalogue's page text on the server and returns ranked page numbers with short snippets. | No |
| `POST` | `/api/revalidate` | Sanity webhook. Clears the Next.js cache tag that matches the changed document's `_type`. | Webhook signature |
| `POST` | `/api/catalog/reindex` | Brings the catalogue text index in Upstash in line with Sanity and rebuilds the category -> brand matches. Resumable; continues itself while work is pending. | Bearer or webhook signature |
| `GET` | `/api/draft-mode/enable` | Turns on Next.js draft mode for Sanity previews. | Sanity preview secret |
| `GET` | `/api/draft-mode/disable` | Turns off draft mode and redirects to `/`. | No |
| `POST` | `/api/seed` | Seeds Sanity with fallback brands, categories, products, site settings, navigation and legal pages. | Bearer token, development only |

## Request/Response Formats

### `POST /api/leads`

Source: `src/app/api/leads/route.ts`. The request body is validated against `CreateLeadSchema` in `src/lib/leads/schema.ts`, which is a Zod discriminated union on `intent`.

**Fields shared by every intent** (`BaseLeadSchema`):

| Field | Type | Rule |
|---|---|---|
| `name` | string | At least 2 characters |
| `phone` | string | At least 8 characters |
| `email` | string | Optional. Must be a valid email or `""`. |
| `source` | enum | `home`, `collections`, `product_drawer`, `navbar`, `shortlist` |
| `pageUrl` | string | Optional. Must be a URL or `""`. |
| `_honey` | any | Honeypot. If the value is truthy, the request is not stored. |

**Fields that depend on `intent`:**

| `intent` | Required fields | Optional fields |
|---|---|---|
| `consultation` | none beyond the shared fields | `projectType`, `interest`, `consultationDate`, `consultationTime`, `consultationMode` (`showroom`, `phone`, `whatsapp`, `flexible`), `message`, `selectedProducts` (array of `{ slug, name, brand }`) |
| `enquiry` | `location` (at least 2 characters), `projectType` (one of `Modular Kitchen`, `Home Renovation`, `New Home / Construction`, `Commercial Project`, `Door / Security`, `Wardrobe`, `Other`) | `customerType` (`Architect / Interior Designer`, `Home Owner`, `Builder / Project`, `Retailer`), `category`, `brand`, `product`, `quantity`, `message` |
| `callback` | `consultationTime` (the preferred callback window) | `message` |

Example request:

```json
{
  "intent": "enquiry",
  "name": "Asha Verma",
  "phone": "9876543210",
  "source": "home",
  "location": "Sakchi, Jamshedpur",
  "projectType": "Modular Kitchen",
  "pageUrl": "https://example.com/"
}
```

**Processing order:**

1. Rate limit check, when Upstash is configured (see [Rate Limits](#rate-limits)).
2. Honeypot check. If `_honey` is truthy, the route returns a fake success and stores nothing.
3. Validation with `CreateLeadSchema.safeParse`.
4. Generates a lead ID in the form `HC-<year>-<4 hex chars>`, for example `HC-2026-3FA1`.
5. Saves the lead to PostgreSQL through `createLead` in `src/lib/leads/createLead.ts`.
6. Starts `sendResendEmail` without waiting for it. When it settles, the lead's `emailStatus` becomes `sent` or `failed`.
7. Waits for `sendTelegramAlert`, then sets `telegramStatus` to `sent` or `failed`.

A Telegram failure does not fail the request. The lead is already saved, so the route still returns `success: true`.

Success response (`200`):

```json
{
  "success": true,
  "data": {
    "lead_id": "HC-2026-3FA1",
    "telegram_status": "sent"
  }
}
```

Success response when Telegram fails (`200`):

```json
{
  "success": true,
  "data": {
    "lead_id": "HC-2026-3FA1",
    "telegram_status": "failed",
    "notification_error": "We couldn't notify our Telegram desk yet."
  }
}
```

Honeypot response (`200`). Note that this one is not wrapped in `data`:

```json
{ "success": true, "lead_id": "HC-HONEYPOT", "telegram_status": "sent" }
```

> **Known inconsistencies with the current client.** `src/components/consultation/ConsultationForm.tsx` has three mismatches with this route:
> - It reads `lead_id`, `telegram_status` and `error` from the top level of the response, but the normal success response nests them under `data`, and errors return `error` as an object rather than a string.
> - When no `context.source` is passed, it falls back to `source: "consultation_drawer"`, which is not in `LeadSourceSchema`, so the request fails validation with `400`.
> - The form submits `intent: "enquiry"`.
>
> Keep these in mind when changing either the form or the route.

### `POST /api/leads/retry`

Source: `src/app/api/leads/retry/route.ts`.

Request:

```json
{ "lead_id": "HC-2026-3FA1" }
```

How it works:

- If the lead's `telegramStatus` is already `sent`, the route returns success without sending again.
- Otherwise it claims the retry by moving `telegramStatus` from `failed` to `pending` in a single `updateMany`. If another request claimed it first, the route returns the current status without sending.
- It then sends the Telegram alert and records `sent` or `failed`.

Response (`200`). Unlike `/api/leads`, the fields are at the top level:

```json
{ "success": true, "lead_id": "HC-2026-3FA1", "telegram_status": "sent" }
```

If sending fails, `telegram_status` is `"failed"` and the response also includes `notification_error: "We couldn't notify our Telegram desk yet."`.

### `GET /api/catalog/[slug]/[index]`

Source: `src/app/api/catalog/[slug]/[index]/route.ts`. Runs on the Node.js runtime (`export const runtime = "nodejs"`).

- `slug` is a brand slug. `index` is a zero-based integer from `0` to `50` (`MAX_INDEX`).
- Catalog URLs come from a GROQ query over `catalogue` documents whose `brand->slug.current` matches the slug, ordered by `_createdAt asc`. Each document contributes its `pdfFile.asset->url`. The result for each slug is cached in memory for 10 minutes.
- The request's `Range` header is passed to the Sanity CDN, which lets pdf.js load only the pages it needs. A failed upstream fetch is retried once after 250 ms.
- When the client aborts, the upstream download is cancelled too.

Response headers:

| Header | Value |
|---|---|
| `Content-Type` | `application/pdf` |
| `Content-Disposition` | `inline` (no filename) |
| `Accept-Ranges` | `bytes` |
| `Cache-Control` | `private, max-age=3600` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Robots-Tag` | `noindex, nofollow` |
| Passed through from upstream | `content-length`, `content-range`, `etag`, `last-modified` |

A `206 Partial Content` response is fully buffered before it is sent, so it never uses chunked transfer encoding alongside `Content-Range`, which iOS Safari rejects. A full `200` response is streamed. If the upstream source fails partway through, the stream closes cleanly instead of raising an error.

The browser never sees the Sanity asset URL. This discourages casual downloading and link sharing, but it is not DRM.

### `GET /api/catalog/[slug]/[index]/search`

Source: `src/app/api/catalog/[slug]/[index]/search/route.ts`, logic in `src/lib/catalog/search/findInCatalogue.ts`. Used by the viewer's Find panel.

- **Query:** `q`, the search term (trimmed, capped at 80 characters). A term shorter than 2 characters returns no matches; the panel sends an empty `q` once to learn whether the catalogue is searchable.
- **Response:** `200` with `{ "matches": [{ "page": 61, "snippet": "…mortise hinges…", "score": 30 }] }`, best first, at most 60.
- **Source of text:** the live index in Upstash (`catalog:index:<slug>-<n>`), else the build-time file `catalog-index/<slug>-<n>.json`. That folder is outside `public/` and gitignored, and `next.config.ts` traces it into this function and `/collections`.
- **Headers:** `Cache-Control: private, max-age=300`, `X-Robots-Tag: noindex`.

The page text includes price lists, so it never leaves the server. Only page numbers and snippets do.

### `POST /api/catalog/reindex`

Source: `src/app/api/catalog/reindex/route.ts`. Reads every catalogue PDF in Sanity, extracts page text for new or replaced PDFs (`src/lib/catalog/indexing/`), removes deleted ones, and rebuilds the matches that `/collections` shows as brand rows. One run works for about 40 seconds (`maxDuration` 60); if catalogues remain it schedules another run, which resumes from stored progress. A PDF that fails is recorded and not retried until it changes. `?force=1` (bearer only) reindexes everything.

```json
{
  "outcomes": { "blum-0": "complete", "godrej-0": "needs_ocr", "hafele-0": "unchanged" },
  "pending": [],
  "pruned": [],
  "notFullySearchable": { "godrej-0": { "coverage": "none", "emptyPages": 4, "pages": 4 } },
  "matchesChanged": true
}
```

`needs_ocr` means the PDF was read but too many pages have no text layer; run `npx tsx scripts/ocr-catalogues.ts` for it. Errors: `401` bad token or signature, `500` secret unset, `503` Upstash unset.

### `POST /api/revalidate`

Source: `src/app/api/revalidate/route.ts`. Sanity sends a signed webhook whose body contains at least `_type`. The route calls `revalidateTag(body._type, { expire: 0 })`.

Success response (`200`):

```json
{ "revalidated": true, "type": "product", "now": 1759480000000 }
```

### `GET /api/draft-mode/enable` and `GET /api/draft-mode/disable`

- **`enable`** is generated by `defineEnableDraftMode` from `next-sanity/draft-mode`. The Sanity Presentation tool calls it with its own preview parameters. Without `SANITY_API_TOKEN`, the secret cannot be validated, so draft mode stays off.
- **`disable`** turns off draft mode and returns a redirect to `/`.

### `POST /api/seed`

Source: `src/app/api/seed/route.ts`. It writes the following to Sanity:

- Data from `src/content/fallback/catalog.ts` (`BRANDS`, `CATEGORIES`, `PRODUCTS`) and legal pages, using `createIfNotExists`.
- The `siteSettings` and `navigation` singletons, using `createOrReplace`. Running the seed again overwrites these two documents.

Response (`200`):

```json
{ "message": "Seeding Complete", "results": { "categories": 0, "brands": 0, "products": 0 } }
```

The counts are the number of documents attempted, not the number actually created.

Example call from a local dev server:

```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer $SANITY_API_TOKEN"
```

## Error Codes

### Lead submission (`/api/leads`)

Errors go through `handleApiError` in `src/lib/api-error.ts`, which returns this structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed"
  }
}
```

| Status | `error.code` | Cause |
|---|---|---|
| `400` | `VALIDATION_ERROR` | The body failed `CreateLeadSchema`. Field-level details are not returned. |
| `429` | `RATE_LIMIT_EXCEEDED` | The caller exceeded the Upstash rate limit. |
| `500` | `INTERNAL_ERROR` | Any other error, for example invalid JSON or a database failure. The message is `An unexpected error occurred.` |

### Other routes

The remaining routes return their own response bodies rather than using `handleApiError`:

| Route | Status | Body / meaning |
|---|---|---|
| `/api/leads/retry` | `400` | `{ "success": false, "error": "Invalid lead ID provided" }` |
| | `404` | `{ "success": false, "error": "Lead not found" }` |
| | `500` | `{ "success": false, "error": "Internal Server Error" }` |
| `/api/catalog/[slug]/[index]` | `404` | Plain text `Not found`. The index is invalid or out of range, or no catalog exists at that position. |
| | `499` | Empty body. The client aborted the request. |
| | `502` | Plain text `Upstream error`. The Sanity lookup failed, or the CDN fetch failed or returned a non-OK status. |
| `/api/catalog/[slug]/[index]/search` | `404` | `{ "error": "Not found" }`. The slug or position is invalid, or the catalogue has no index. |
| | `429` | `{ "error": "Too many searches" }`. Over the rate limit. |
| `/api/revalidate` | `400` | `{ "message": "Bad Request: payload has no _type" }` |
| | `401` | `{ "message": "Invalid signature" }` |
| | `500` | `{ "message": "Revalidation is not configured on this deployment." }` when `SANITY_REVALIDATE_SECRET` is unset. Otherwise `{ "message": "<error message>" }`. |
| `/api/seed` | `401` | `{ "message": "Unauthorized" }` |
| | `403` | `{ "message": "Seed endpoint disabled in production" }` |
| | `500` | `{ "message": "Error seeding data", "error": "<error message>" }` |

## Rate Limits

`GET /api/catalog/[slug]/[index]/search` allows 30 requests per minute per client IP (sliding window, key `ratelimit_catalog_search_<first x-forwarded-for address>`), under the same activation rule as below. If Redis is unreachable, the search is served unthrottled. `POST /api/leads/retry` also limits to 5 per minute.

`POST /api/leads` has a rate limit. It uses `@upstash/ratelimit` backed by `@upstash/redis`:

- **Limit:** 5 requests per 1 minute, as a sliding window (`Ratelimit.slidingWindow(5, "1 m")`), with analytics enabled.
- **Key:** `ratelimit_leads_<x-forwarded-for>`. The full `x-forwarded-for` header value is used, or `unknown` if the header is missing.
- **Activation:** The limiter is created only when both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set. If either is missing, rate limiting is silently disabled and the honeypot is the only bot protection.

<!-- VERIFY: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set in the production Vercel environment, so rate limiting is active in production -->

No other route has application-level rate limiting.
