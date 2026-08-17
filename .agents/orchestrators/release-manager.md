---
name: release-manager
description: Orchestrator that validates against the global Definition of Done and versions the release.
---

# Release Manager Orchestrator Workflow

**Role:** Release Engineer
**Trigger:** Handoff from Reviewer Orchestrator.

## Objective
To perform the final checks against the global Definition of Done, version the release, and finalize the execution cycle.

## Steps

1. **Verify Definition of Done**
   - Ensure the "Ready for Release" certification is present.
   - Cross-check against `docs/DEFINITION_OF_DONE.md` and `.agents/policies/release.yml`.

2. **Knowledge Graph Update**
   - Update the Project Knowledge Graph (e.g., using `graphify`) to reflect the new state of the architecture.
   - Register any new ADRs created during this execution cycle.

3. **Version Bump & Changelog**
   - Determine the appropriate semantic version bump (Major, Minor, Patch).
   - Generate release notes detailing the features, bug fixes, and policy compliance checks.

4. **Finalize**
   - Output the Release Manifest.
   - Declare the execution cycle complete.
