<!-- generated-by: gsd-doc-writer -->
# Decision Engine

**Role:** Decides whether proposed work goes ahead now, later, or not at all, and records the decision. The owner makes the final call on anything that changes product direction, cost, or the locked architecture.

## When it applies

- The mission planner proposes new phases.
- Two pieces of planned work compete for the same time or the same files.
- A request conflicts with `.planning/NEVER-BUILD.md` or the locked architecture, and someone still wants it.

## Inputs

- The proposal from `mission-planner.md` or `intake.md`
- `PRODUCT.md`: product principles and constraints
- `.planning/STATE.md`: current phase, freezes, blockers
- `.planning/ROADMAP.md`
- `.planning/NEVER-BUILD.md`
- Open issues and PRs: `gh issue list`, `gh pr list`

## Steps

1. Check the proposal against `.planning/NEVER-BUILD.md`. A match is a reject unless the owner explicitly reverses that entry.
2. Check `.planning/STATE.md` for a freeze or an active phase the work would disrupt.
3. Look for overlap with open issues and PRs. If it duplicates existing work, fold it into that work.
4. Weigh user value (from `PRODUCT.md`) against effort and risk (security, performance, content dependencies). Say what the judgement is based on; do not produce scores that were not measured.
5. Pick a verdict:

   | Verdict | Meaning |
   |:---|:---|
   | Go | Proceed to planning. |
   | Go with conditions | Proceed, with named conditions (for example "no new client-side dependencies"). |
   | Defer | Worth doing, not now. Record why and what would change the answer. |
   | Merge | Fold into an existing phase, issue or PR. |
   | Owner decision | Needs the owner: product direction, spend, or a change to the locked architecture. |
   | Reject | Not worth doing. Add it to `.planning/NEVER-BUILD.md` with the reason. |

## Hand-off

- Go / Go with conditions: add the phase to `.planning/ROADMAP.md`, then `planner.md`.
- Owner decision: stop and ask the owner.
- Defer, Merge, Reject: no hand-off.

## Output

The verdict and its reasons, recorded in `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/NEVER-BUILD.md`, or as a comment on the issue, whichever applies.
