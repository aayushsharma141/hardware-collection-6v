# Analytics & Telemetry Review Workflow

**Trigger:** `/workflow analytics_review`  
**Purpose:** Audit event tracking contracts, PostHog payload schemas, conversion funnels, and A/B test telemetry.

---

## Analytics Gates

1. **Event Contract Compliance:** Verify every call site uses typed event keys defined in `apps/web/src/analytics/events.ts`.
2. **Funnel Coverage:** Ensure Discovery Quiz step transitions and Estimator path selections emit `track()` calls.
3. **Privacy & PII Protection:** Verify zero raw passwords or sensitive user credentials are present in event payloads.
4. **PostHog Client Hygiene:** Verify `posthog-client.ts` initializes cleanly without blocking page render.

---

## Blocker Categorization

- **MUST FIX:** Un-typed inline event strings; PII in analytics payloads.
- **SHOULD FIX:** Missing step completion telemetry in multi-step forms.
- **COULD FIX:** Adding extra context properties (`activeRoom`, `genomeVersion`).
- **IGNORED:** Local dev environment test events.
