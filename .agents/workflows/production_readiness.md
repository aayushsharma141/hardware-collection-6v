# Production Readiness & Release Review Workflow

**Trigger:** `/workflow production_readiness`  
**Purpose:** Verify final Definition of Done checklist before deploying to production.

---

## Production Gate Verification

- [ ] **Design Gate:** Zero hardcoded hex colors, zero glassmorphism cards, 0px/2px radii respected.
- [ ] **Engineering Gate:** `npm run build` & `tsc --noEmit` pass with zero errors.
- [ ] **Accessibility Gate:** Minimum 4.5:1 text contrast, WCAG 2.1 AA compliant, visible focus rings.
- [ ] **Performance Gate:** Lighthouse score > 95, `CLS < 0.01`, `LCP < 1.2s`.
- [ ] **Security Gate:** Zero secret leaks in client bundle, OWASP Top 10 sanitized inputs.
- [ ] **Analytics Gate:** All new user flows emit typed telemetry events (`AnalyticsEventMap`).
- [ ] **Documentation Gate:** ADR updated, CHANGELOG updated.

---

## Final Verdict

If all gates pass: **APPROVED FOR DEPLOYMENT**  
If any MUST FIX item fails: **DEPLOYMENT BLOCKED**
