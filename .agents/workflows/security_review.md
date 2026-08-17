# Security & Vulnerability Review Workflow

**Trigger:** `/workflow security_review`  
**Purpose:** Audit static code against OWASP Top 10, API authorization, and secret leaks.

---

## Security Review Gates

1. **Secret Leak Detection:** Scan for API keys or private credentials hardcoded in client source files.
2. **XSS & Injection Protection:** Verify user-generated content and input fields use DOM sanitization.
3. **Authentication & Authorization:** Verify admin routes (`apps/web/src/routes/adminRoutes.tsx`) are protected by `AdminDeviceGate`.
4. **CORS & CSP Inspection:** Check Content Security Policy headers and cross-origin controls.

---

## Blocker Categorization

- **MUST FIX:** Exposed private credentials, un-sanitized dangerouslySetInnerHTML, un-gated admin routes.
- **SHOULD FIX:** Missing rate limiting on public form submissions.
- **COULD FIX:** Adding extra audit logs for auth events.
- **IGNORED:** Public environment variables (`VITE_PUBLIC_*`).
