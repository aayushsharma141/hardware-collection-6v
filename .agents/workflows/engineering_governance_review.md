<!-- generated-by: gsd-doc-writer -->
# Engineering Governance Review Workflow

**Trigger:** `/workflow engineering_governance_review`
**Purpose:** Check type safety, component boundaries, duplication and code complexity in `src/`.

---

## When to run

- On every PR that changes `src/`, before review is requested.
- As part of `audit_workflow`.

## Inputs

- The diff under review (`git diff main...HEAD`).
- `tsconfig.json` (`"strict": true`), `eslint.config.mjs` (`eslint-config-next` core-web-vitals and TypeScript presets).
- `docs/ARCHITECTURE.md` and `src/components/README.md`.

## Steps

1. **Type check.** Run `npx tsc --noEmit`. The result must be zero errors.
2. **Lint.** Run `npm run lint` (ESLint 9). The result must be zero errors. Note any new warnings.
3. **No `console.log`.** Run `node scripts/checks/no-console-log.js`. `console.warn` and `console.error` are allowed.
4. **`any` usage.** Run `grep -rnE ": any\b|as any|<any>" src`. It currently finds none. Any new `any` needs a justification, and none may appear in exported types or component props.
5. **Null safety.** In changed code, check that async results (Sanity queries, `fetch` responses, Prisma lookups) are null-checked before use. Sanity query helpers in `src/content/sanity/queries.ts` return `[]` on failure, and callers must handle the empty case.
6. **Component boundaries.** Components in `src/components/` receive data through props and don't fetch it. Fetching and merging happens in `src/app/**/page.tsx`. Pure logic goes in `src/lib/<domain>/`, and reusable React state goes in `src/hooks/`.
7. **Shared types.** A type used by two or more folders lives in `src/types/`. Flag duplicated inline type shapes.
8. **Size and complexity (manual).** Run `find src -name "*.ts*" -not -path "*/__tests__/*" | xargs wc -l | sort -n | tail -15` to list the largest files. For changed files over about 300 lines, or functions with deep nesting or many branches, suggest extracting a hook or a `src/lib/` helper.
9. **Tests.** New logic in `src/lib/`, `src/hooks/` or `src/content/` gets a colocated test in `__tests__/` (see `docs/TESTING.md`). Run `npm test`.

## Pass/fail criteria

- **MUST FIX (fail):** any `tsc` or ESLint error; a `console.log` in `src/`; `any` in an exported type or props; an unchecked null on async data; data fetching inside a component.
- **SHOULD FIX:** duplicated utility logic; prop drilling through more than three layers; new `src/lib/` logic without a test.
- **COULD FIX:** extracting small helpers; tightening local types.
- **IGNORED:** vendor code and generated files (`public/`, `.next/`, `next-env.d.ts`).

## Output

Write `docs/reviews/engineering-governance-YYYY-MM-DD.md`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. Include the command results (tsc, lint, no-console-log, tests) and a findings list with file, line and severity.
