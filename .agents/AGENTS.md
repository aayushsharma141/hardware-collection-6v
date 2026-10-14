## Workspace Scoping & Boundaries

- All code, scripts, plans, and output artifacts MUST reside strictly within the root directory of this project.
- Maintain strict project isolation during autonomous tasks without reading, modifying, or creating files outside this project directory.
- Store project-specific planning files in `.planning/` and custom agent resources in `.agents/`.

## Autonomous Execution Rules

- Execute tasks autonomously within the workspace boundaries.
- Never run destructive commands (such as deleting non-project files or clearing system directories).
- Verify all changes locally within this workspace before declaring task completion.

## UI, Brand & Feature Preservation Invariant

- Never delete, strip, or revert UI enhancements, audio systems (`public/audio/*`, `ShowroomAudioPlayer`), or brand styling (liquid glass navbar, text shine sweeps) under the pretext of "cleaning scope" or "isolating bug fixes".
- Consult `.agents/rules/ui_audio_preservation.md` for context on the PR #49 regression incident and recovery.

