# UI, Brand & Audio Invariant Rules

## Context & Postmortem: Incident of PR #48 / PR #49 / PR #53

### What went wrong:
An automated agent working on catalogue view-only mode and Playwright E2E tests noticed that the branch contained UI enhancements (ambient audio, liquid glass navbar, floating CTA, interactive mobile menu, etc.). Assuming these were "unrelated scope drift" or "code pollution," the agent created a new branch `fix/catalogue-view-only-rebased` (PR #49) that intentionally stripped away 54 files containing production UI and audio systems, and closed PR #48 unmerged. Once PR #49 merged into `main`, it wiped out major approved user experience features.

### What was recovered in PR #53 & Subsequent Commits:
1. **Ambient Showroom Audio System**:
   - `public/audio/showroom-ambient.mp3`
   - `src/components/audio/ShowroomAudioPlayer.tsx`
   - Global sound toggle in `Navbar.tsx` and persistent audio controls
2. **Liquid Glass Navbar & Navigation**:
   - Multi-layer glassmorphism (`.liquid-glass-nav`), optical blur, and subtle inner glow
   - `AnimatedMenuIcon.tsx`, `MobileMenu.tsx`, and responsive desktop navigation
3. **Showroom Brand Lockup & Typography Shine**:
   - 3D emblem with optical padding
   - Continuous synchronized metallic text shine sweep (`brand-hw-shine` on `HARDWARE`, `brand-col-shine` on `COLLECTION` using `background-clip: text`)
   - Explicit removal of the legacy rectangular box shimmer overlay (`.brand-lockup__sheen` / `brand-sheen-loop`) to avoid obscuring the mark
4. **Enhanced Discovery & CTAs**:
   - `CategoryDiscovery.tsx`
   - `FloatingCTA.tsx`
   - Product detail drawers and consultation booking flows

---

## Strict Directives for All Agents

1. **NEVER Strip or Revert UI / Audio / Motion Features**:
   - Do NOT delete, disable, or strip features under the pretext of "cleaning PR scope", "simplifying branches", or "isolating bug fixes".
   - If a feature or component exists on `main`, it is INTENTIONAL and CANONICAL.

2. **Branching & Rebasing Discipline**:
   - When branching off `main` to address a bug, test, or isolated task, always build ON TOP of the current codebase.
   - If tests fail, update the test selectors/fixtures to account for current UI—do NOT delete the UI to make tests pass.

3. **Logo & Navbar Specifics**:
   - Do NOT re-add the old rectangular box overlay (`.brand-lockup__sheen`).
   - Do NOT remove or override the typography shine sweep (`brand-hw-shine`, `brand-col-shine`) on `BrandLockup`.
   - Preserve `.liquid-glass-nav` styles in `globals.css` and `Navbar.tsx`.
