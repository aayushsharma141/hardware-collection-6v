import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "ECC/**",
    "audit-reports/**",
    "scripts/**",
    // Vendored / non-application content checked into the repo root. Linting these as
    // app source produced 4,329 of the 4,330 reported errors and made `npm run lint`
    // useless as a release gate — the application itself had exactly 1.
    "superpowers/**",
    "everything-claude-code/**",
    "claude-mem/**",
    "headroom/**",
    "Front-End-Checklist/**",
    "caveman/**",
    "Hardware Collection/**",
    "verify_phase5.js",
    // Static assets, not source. public/pdf.worker.min.mjs alone contributed 6 errors
    // and 1,571 warnings from minified vendor code.
    "public/**",
    // Claude Code creates a full git worktree per background task under
    // .claude/worktrees/. Without this, linting a nested copy of the whole
    // repo turned 30 warnings into 1,713 problems and 49 errors, so the gate
    // failed whenever a background task happened to be running.
    ".claude/**",
  ]),
]);

export default eslintConfig;
