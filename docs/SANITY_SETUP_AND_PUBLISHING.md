# Sanity CMS Setup & Publishing Runbook

This runbook covers the Sanity setup, publishing, draft preview, cache refresh and production acceptance workflow for Hardware Collection.

## 1. Current architecture

- Embedded Sanity Studio: /studio.
- Repository-configured project ID: hoghkg00. Confirm this in Sanity before changing environments.
- Dataset: production.
- API version default: 2024-02-12.
- Approved public routes in the project brief: / and /collections.
- Public content reads use the published perspective. Drafts must not appear on the public website.
- Sanity reads use a 300-second revalidation safety window and type tags. The /api/revalidate webhook should invalidate relevant tags immediately.
- Static fallback content is a resilience mechanism, not the normal place to edit content.

## 2. Environment setup

### Local development

Create .env.local (never commit it) with your actual values:

    NEXT_PUBLIC_SANITY_PROJECT_ID=hoghkg00
    NEXT_PUBLIC_SANITY_DATASET=production
    NEXT_PUBLIC_SANITY_API_VERSION=2024-02-12
    SANITY_API_TOKEN=replace_with_private_server_side_token
    SANITY_REVALIDATE_SECRET=replace_with_long_random_secret
    DATABASE_URL=replace_with_postgres_connection_string
    TELEGRAM_BOT_TOKEN=replace_with_bot_token
    TELEGRAM_CHAT_ID=replace_with_chat_id
    UPSTASH_REDIS_REST_URL=replace_with_upstash_rest_url
    UPSTASH_REDIS_REST_TOKEN=replace_with_upstash_rest_token
    RESEND_API_KEY=
    STAFF_EMAIL=

Never prefix server secrets with NEXT_PUBLIC_. Do not put real credentials in source files, screenshots, public issues or chat logs.

### Vercel Production environment

Set the correct values in the Vercel project's Production environment. Configure Preview/Development separately where required.

| Variable | Purpose | Production requirement |
|---|---|---|
| NEXT_PUBLIC_SANITY_PROJECT_ID | Sanity project | Must match the project holding live content |
| NEXT_PUBLIC_SANITY_DATASET | Dataset | Must match the live dataset |
| NEXT_PUBLIC_SANITY_API_VERSION | API version | Keep deliberate and consistent with scripts |
| SANITY_API_TOKEN | Server-side reads and draft preview validation | Private; never expose to browser bundles |
| SANITY_REVALIDATE_SECRET | Authenticate Sanity webhook | Same secret in Vercel and Sanity |
| UPSTASH_REDIS_REST_URL | Shared lead API rate limiter | Required for production lead capture |
| UPSTASH_REDIS_REST_TOKEN | Shared lead API rate limiter | Required for production lead capture |
| DATABASE_URL | PostgreSQL lead persistence | Required for lead capture |
| TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID | Lead alerts | Required if Telegram alerts are operationally required |
| RESEND_API_KEY / STAFF_EMAIL | Email alerts | Optional only if email notifications are intentionally disabled |

The GitHub Actions `production` environment must also contain these secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `SANITY_API_TOKEN` (used by the pre-deploy published-content verification step)

The deploy workflow deliberately fails if any of these are absent. The Sanity token must have read access to the published dataset required by `npm run cms:verify`; do not use a write token unless the same token is explicitly needed for another reviewed workflow.

After changing runtime variables, redeploy Production. Build-time variables must be present for the relevant build.

Important: this repository currently reuses SANITY_API_TOKEN for server-side reads, draft-mode validation and multiple CMS scripts. Treat it as a private secret with the minimum permissions compatible with those uses. A later credential-hardening change should split read/preview credentials from write/migration credentials before reducing its permissions.

## 3. Sanity project and Studio setup

1. Sign in to the Sanity project dashboard using an account that administers the project.
2. Confirm the project ID is hoghkg00 and the intended dataset is production. Do not create a new dataset to work around an authentication or configuration error.
3. Add team members using individual Sanity accounts and least-privilege access. Do not share the owner's login.
4. Open https://www.hardwarecollection.co/studio and sign in through Sanity authentication.
5. Confirm these singleton documents exist and are editable:
   - Homepage Content — fixed ID homePage.
   - Hero Manager — fixed ID heroManager.
   - Business Settings — fixed ID siteSettings.
   - Navigation — fixed ID navigation.
6. Confirm document lists exist for Products, Categories, Brands, Catalogues (PDFs), Offers & Deals, Testimonials, Gallery and FAQs.
7. If a singleton is missing, inspect its fixed ID and schema before seeding. Never run a production seed or destructive create-or-replace script without reviewing target documents and having a rollback/backup plan.

## 4. Configure the publish revalidation webhook

The site is designed to update published content immediately through POST /api/revalidate, with a five-minute revalidation window as fallback. The production release gate sends an unsigned request and expects HTTP 401; HTTP 500 means the webhook secret is missing or the route is misconfigured.

1. Generate a long, random webhook secret. Store it as SANITY_REVALIDATE_SECRET in Vercel Production.
2. In Sanity project management, create a webhook targeting https://www.hardwarecollection.co/api/revalidate.
3. Set the webhook secret to exactly the same value as the Vercel variable. Do not place the secret in the URL or payload.
4. Trigger on create, update and delete events for document types used by the website. At minimum verify: homePage, heroManager, siteSettings, navigation, offer, product, category, brand and testimonial.
5. Configure the webhook payload/projection to include the changed document's _type property. The route expects _type and validates the Sanity webhook signature.
6. Use Sanity's test delivery. A valid delivery should return HTTP 200 with revalidated: true and the expected type.
7. Confirm invalid/missing signatures are rejected with HTTP 401. HTTP 500 stating revalidation is not configured means the Vercel secret is missing. Signature failures usually mean the secrets do not match.
8. Inspect delivery history after a real publish. The presence of a webhook URL alone does not prove the workflow works.

If a document type is not included in the GROQ query's cache tags, webhook delivery will not invalidate that query. Verify both sides: tags in src/content/sanity/queries.ts and _type in the webhook payload.

## 5. Draft preview workflow

1. Open the target document in /studio.
2. Make a small, reversible draft edit.
3. Use the Sanity Presentation preview panel. The configured preview URL is / and draft mode is enabled through /api/draft-mode/enable.
4. Confirm the preview shows the draft while a normal/incognito public browser still shows only published content.
5. Publish the document.
6. Confirm the webhook succeeds and the public page updates. If the webhook is temporarily unavailable, allow the 300-second cache safety window and inspect logs.
7. End preview using the draft-mode disable flow and confirm the browser returns to published content.

Do not switch the shared production client to the raw perspective as a shortcut. Draft access must remain scoped to the authenticated preview workflow.

## 6. Content editing workflows

### Product

1. Open Catalogue → Products → Create.
2. Enter a clear product name and unique slug.
3. Select an existing Brand and Category reference. Do not create near-duplicates to bypass missing references.
4. Add short description, overview, features, specifications and applications.
5. Upload a correctly oriented, high-quality hero image and gallery images approved for showroom use.
6. Set Featured Product only when it should be promoted. Set Showroom Display only when the item is actually displayed at the physical showroom.
7. Save as draft, preview, then publish.
8. Verify the product appears in the correct group on /collections, WhatsApp enquiry includes the correct product context, and no pricing/cart/checkout UI is introduced.

### Brand and category

1. Edit an existing record if the entity already exists.
2. Check slug, display order, logo/image, public copy and visibility fields.
3. Check product references before changing slugs or removing records.
4. Publish and verify grouping, brand identity and image rendering.
5. Keep the approved category taxonomy and authorised brand status accurate.

### Homepage content and hero

1. Use Showroom → Homepage Content for editable copy, references, gallery, testimonials and SEO fields supported by the schema.
2. Use Showroom → Hero Manager to configure Home Page Hero and Collection Hero slides.
3. To feature an offer, create/edit it under Offers & Deals, set it active, check its validity dates, choose the intended Home/Collection visibility toggles and set a deliberate hero order.
4. Before publishing multiple offers, confirm current hero-selection logic and maximum slide limits. Preview both placements on desktop and mobile.
5. Publish and verify on the live site. Saving a draft does not publish it.

### Business settings

Verify phone, WhatsApp number, address, opening hours, Google Maps links, social links, authorised brand references and SEO defaults. The showroom owner must approve these facts. Visible hours, structured data and the Google Business Profile must agree.

### Catalogues (PDFs)

1. Create/update the Catalogue document with title, Brand, Category, PDF, version/release date and cover image.
2. Confirm the PDF is valid and the current approved edition.
3. Publish and test the in-site view-only viewer, page navigation/search if available, and WhatsApp enquiry flow.
4. Confirm the website does not expose a download button. View-only UX discourages casual downloading but cannot prevent screenshots or all forms of copying.

## 7. Automated published-content verification

With the required environment variables available in your local shell, run:

    npm run cms:verify

The command uses the published perspective and checks that the fixed-ID singleton documents exist exactly once, that products have their required identity/reference fields, and that at least one brand and category are published. It reports missing product images and an empty product catalogue as warnings. It does not publish, mutate, or delete CMS data. Run it before launch and after migrations/seeding.

## 8. Publishing and cache acceptance test

Run these checks for at least one record of each critical type after setup and after changes to caching or GROQ queries.

- [ ] Authenticated preview shows draft edits.
- [ ] A normal public session does not show drafts.
- [ ] Publish triggers a successful webhook delivery.
- [ ] The corresponding live page updates without a code deployment.
- [ ] Delete/unpublish hides content according to intended schema behavior.
- [ ] Updating a product image changes the rendered image without stale references.
- [ ] Invalid/missing webhook signatures are rejected.
- [ ] If the webhook fails, the page recovers after the documented 300-second revalidation window.
- [ ] Sanity query failures are visible in logs/monitoring and are not mistaken for successful publishing.
- [ ] Fallback content does not silently override intended published data.
- [ ] Home and Collections work on desktop and mobile.

## 9. Data quality and migration safety

Before bulk seed, migration, slug repair or catalogue reindex:

1. Confirm the selected project and dataset in command output.
2. Inspect whether the script uses createIfNotExists, patch, createOrReplace or delete operations.
3. Export/backup affected documents or use a staging dataset first.
4. Run a dry-run/report mode if available.
5. Verify reference integrity and required image assets before publishing.
6. Review the report, then deliberately run the write operation.
7. Re-run content validation and live acceptance checks.

Do not use a production write token in a browser, CI build step or public environment variable. Do not use the production seed route as a normal content editor.

## 10. Production release checklist

- [ ] Vercel Production has the correct Sanity project/dataset and private server token.
- [ ] SANITY_REVALIDATE_SECRET is configured in both Vercel and the Sanity webhook.
- [ ] Webhook test delivery returns HTTP 200.
- [ ] Upstash Redis variables exist; the lead endpoint fails closed if the limiter is absent.
- [ ] Database and notification credentials are configured and tested.
- [ ] CI passes lint, typecheck, unit tests, dependency audit and production build.
- [ ] Deployment URL is accepted only after a successful Vercel CLI exit.
- [ ] Deployed / and /collections smoke tests pass.
- [ ] Production has SITE_INDEXABLE=true; preview deployments remain noindex.
- [ ] sitemap.xml, robots rules, canonical URLs and actual HTTP headers are verified after deployment.
- [ ] Route architecture is reconciled: the repository currently contains /catalogues, while the project brief allows only / and /collections. Do not remove the catalogue viewer before moving its capability into the approved route.
- [ ] Owner approves business details and opening hours.
- [ ] A manual end-to-end lead test succeeds, alerts arrive, and the test lead is removed from production data.

## 11. Troubleshooting

| Symptom | Check first |
|---|---|
| Studio does not load | Vercel deployment, project ID/dataset, Sanity authentication and browser console |
| Studio loads but lists are empty | Project/dataset, dataset permissions, query errors and document types |
| Publish succeeds but site is stale | Webhook history, matching secret, _type projection, cache tags and revalidation logs |
| Preview shows published data only | Presentation preview URL, draft-mode endpoint, private token and preview cookies |
| Public site shows fallback content | Server logs for Sanity query errors; verify published documents in the correct dataset |
| Offer is missing from hero | Active flag, validity dates, correct page visibility, hero order, slide cap and selection query |
| Product is missing from a group | Published state, category/brand references, category rail mapping and showroom display logic |
| Lead form fails after rate-limit hardening | Confirm both Upstash variables exist and are valid |
| Search engines cannot index production | Vercel Production SITE_INDEXABLE=true, X-Robots-Tag, metadata and canonical host |
