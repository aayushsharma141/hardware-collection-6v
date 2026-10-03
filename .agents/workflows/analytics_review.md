<!-- generated-by: gsd-doc-writer -->
# Analytics & Telemetry Review Workflow

**Trigger:** `/workflow analytics_review`
**Purpose:** Check that the site's few conversion events fire at the right moment, use consistent names and carry no personal data.

---

## Current state

This is a lead-generation showroom site. It has no analytics SDK in `package.json` and no event-contract tests. All tracking is a plain push to `window.dataLayer` from two places:

| Source | Events |
|---|---|
| `src/lib/catalog/analytics.ts` (`trackCatalogue`, typed `CatalogueEvent` union) | `catalogue_open`, `catalogue_page_view`, `catalogue_zoom`, `catalogue_search`, `catalogue_mark_start`, `catalogue_mark_complete`, `catalogue_capture`, `catalogue_whatsapp_click` |
| `src/components/consultation/ConsultationForm.tsx` (inline `trackEnquirySubmitted`) | `enquiry_submitted` (fired only after `/api/leads` confirms the lead) |

No tag manager or analytics script is loaded anywhere in `src/`, so these pushes reach a vendor only if one is added later. Treat this review as a correctness and privacy check on the pushes themselves.

The `analytics: true` flag in `src/app/api/leads/route.ts` belongs to the Upstash rate limiter. It is not site analytics.

## When to run

- When an event is added, renamed or moved.
- When `ConsultationForm.tsx`, `CatalogViewerModal.tsx` or `src/lib/catalog/` changes.
- Before connecting any analytics vendor.

## Inputs

- The two source files above.
- `src/lib/leads/schema.ts`, which defines the lead fields that must not leak into events.

## Steps

1. **Inventory.** Run `grep -rn "dataLayer" src` and confirm the push sites are still only the two files above. Any new push site must go through a typed helper like `trackCatalogue`, not an inline string.
2. **Naming.** Event names are `snake_case` and noun-first (`catalogue_*`, `enquiry_*`). New catalogue events are added to the `CatalogueEvent` union, not passed as loose strings.
3. **Funnel timing (manual).** Run `npm run dev`. In the browser console, inspect `window.dataLayer` while you:
   - open a catalogue on `/catalogues`, page, zoom, search, mark, capture and click the WhatsApp button. Each step should push its matching `catalogue_*` event once.
   - submit the consultation form. `enquiry_submitted` should appear only after a successful response, never on a validation or network error.
4. **Privacy.** Payloads must contain no name, phone number, email or free-text message from the lead form. `enquiry_submitted` may carry `lead_id`, `project_type` and `source` only. `catalogue_search` carries the search `query`. Confirm it can't contain contact details.
5. **Resilience.** Each push is wrapped in `try/catch` and guarded by `typeof window`. Tracking must never block or break the form or the viewer.

## Pass/fail criteria

- **MUST FIX (fail):** personal data (name, phone, email, message) in any payload; `enquiry_submitted` firing before a confirmed lead; a tracking error that breaks the UI.
- **SHOULD FIX:** an untyped inline event name; a funnel step that pushes no event or pushes it twice.
- **COULD FIX:** moving `trackEnquirySubmitted` into a typed helper beside `trackCatalogue`.
- **IGNORED:** events pushed during local development.

## Output

Write `docs/reviews/analytics-review-YYYY-MM-DD.md`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. Include the event inventory table as observed, with any differences from the table above.
