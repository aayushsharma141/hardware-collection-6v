# Testing & Quality Assurance Review Workflow

**Trigger:** `/workflow testing_review`  
**Purpose:** Audit unit tests, integration tests, Playwright E2E coverage, and mock data contracts.

---

## Testing Gates

1. **Unit Test Execution:** Run unit test suites. Verify zero failing tests in `__tests__/`.
2. **E2E Playwright Suite:** Verify critical flows (Landing, Estimator, Contact) pass Playwright test suites.
3. **Mock Data Integrity:** Ensure mock fixtures mirror production API schemas.
4. **Regression Coverage:** Verify bug fixes include regression unit test assertions.

---

## Blocker Categorization

- **MUST FIX:** Failing unit or E2E tests; deleted assertions to mask failures.
- **SHOULD FIX:** Uncovered conditional branch logic in core repositories.
- **COULD FIX:** Adding extra snapshot tests for UI primitives.
- **IGNORED:** Flaky third-party network requests in mock modes.
