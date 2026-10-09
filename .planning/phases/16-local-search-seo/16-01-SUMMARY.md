# Plan 16-01: Canonical Host & Non-Production Noindex - Summary

**Executed:** 2026-10-09
**Status:** Complete
**Commit:** `0136647`

---

## 1. What was built

- **`next.config.ts`**:
  - Implemented 301 permanent redirect from bare domain `hardwarecollection.co` to canonical origin `https://www.hardwarecollection.co/:path*`.
  - Added dynamic non-production indexing protection based on `process.env.SITE_INDEXABLE !== 'true'`.
  - Configured custom security headers injecting `X-Robots-Tag: noindex, nofollow` matching all preview host headers via regular expression `(?<subdomain>.*)\\.vercel\\.app` (covering `hc-demo-ten.vercel.app` and preview deployments).
- **`src/app/robots.ts`**:
  - Maintained open crawler access to allow search engines to read the `X-Robots-Tag` header on preview hosts.
  - Declared canonical sitemap destination strictly at `https://www.hardwarecollection.co/sitemap.xml`.

---

## 2. Verification

- Evaluated host regex and verified header assignment behavior in Next.js configuration.
- `npx tsc --noEmit`: 0 errors.
- `npm run lint`: 0 errors.
- `npm test`: Passed.
