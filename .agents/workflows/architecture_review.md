# Architecture Review Workflow

**Trigger:** `/workflow architecture_review`  
**Purpose:** Evaluate domain boundaries, database schema changes, state management architecture, and module coupling.

---

## Trajectory & Blocker Gates

1. **Domain Isolation Check:** Verify `apps/web/src/repositories/` handles data access while `stores/` manages transient client state.
2. **ADR Alignment:** Verify architectural changes conform to active Architecture Decision Records (`docs/adr/`).
3. **State Hygiene Audit:** Verify Zustand stores avoid storing derivative or duplicate server state.
4. **Graphify Dependency Check:** Review module graph for circular dependencies.

---

## Blocker Categorization

- **MUST FIX:** Circular imports, state mutations bypassing Zustand actions, API direct database queries in UI.
- **SHOULD FIX:** Monolithic files over 300 lines of code.
- **COULD FIX:** Moving local component state to global store when shared.
- **IGNORED:** Generated build outputs in `dist/`.
