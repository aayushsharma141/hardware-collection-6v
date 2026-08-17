# Engineering Governance Review Workflow

**Trigger:** `/workflow engineering_governance_review`  
**Purpose:** Inspect TypeScript type safety, DRY principles, component boundaries, prop interfaces, and code complexity.

---

## Trajectory & Blocker Gates

1. **Type Strictness Check:** Run `tsc --noEmit`. Zero `any` types in public interfaces.
2. **Component Boundary Inspection:** Verify UI components do not mix business fetching logic with presentation layer.
3. **Prop & Interface Enforcement:** Verify component props inherit from central primitives (`ContainerProps`, `SurfaceProps`).
4. **Code Complexity Audit:** Flag cyclomatic complexity > 10 in custom hooks or utility functions.

---

## Blocker Categorization

- **MUST FIX:** Type errors, missing null-checks on asynchronous properties.
- **SHOULD FIX:** Prop drilling past 3 component layers; inline duplicate utility logic.
- **COULD FIX:** Extracting minor helper methods.
- **IGNORED:** Vendor library internals.
