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
    "scripts/**",
    // Retired files awaiting review (see _quarantine/README.md) — not application source.
    "_quarantine/**",
    // Static assets, not source. public/pdf.worker.min.mjs alone contributed 6 errors
    // and 1,571 warnings from minified vendor code.
    "public/**",
    // Claude Code creates a full git worktree per background task under
    // .claude/worktrees/. Without this, linting a nested copy of the whole
    // repo turned 30 warnings into 1,713 problems and 49 errors, so the gate
    // failed whenever a background task happened to be running.
    ".claude/**",
    // One-off dev/debug scripts at the repo root — not application source.
    "check_drafts.ts",
    "check_urls.ts",
    "cleanup.ts",
    "scratch.ts",
    "scratch_settings.ts",
    "compare.mjs",
    "test-log.js",
    "test-pdf-node.mjs",
    "test-sanity.js",
    "test-sanity2.js",
    "screenshot.mjs",
    "uploadLogos.js",
    "patch_sanity_data.js",
    "query_sanity.js",
    "test_sanity.js",
  ]),
]);

export default eslintConfig;
