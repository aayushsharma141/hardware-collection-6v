# Dependency, Refactoring & Documentation Review Workflow

**Trigger:** `/workflow dependency_review`  
**Purpose:** Audit package updates, security vulnerabilities, code refactoring safety, and documentation accuracy.

---

## Review Gates

1. **Dependency Audit:** Audit `package.json` for unused packages or known CVE vulnerabilities.
2. **Refactoring Safety:** Verify refactored components do not break existing public API contracts or component props.
3. **Architecture Decision Records:** Update or create new ADRs in `docs/adr/` whenever architecture patterns change.
4. **Changelog & Documentation:** Update `CHANGELOG.md` and component JSDoc comments.

---

## Blocker Categorization

- **MUST FIX:** High CVE vulnerabilities in dependencies; breaking public prop interfaces without refactoring call sites.
- **SHOULD FIX:** Unused package dependencies in `package.json`.
- **COULD FIX:** Improving JSDoc parameter descriptions.
- **IGNORED:** Minor version patch updates.
