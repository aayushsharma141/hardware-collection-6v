import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { buildEvidenceManifest, buildEvidenceIndex, validateAllEvidenceSchemas } from "./evidence-engine";

/**
 * Release verification pipeline for Hardware Collection.
 *
 * Rewritten 2026-08-30 (Phase 9 finding G-03). The previous version was boilerplate
 * carried over from a different, monorepo-shaped project and validated nothing here:
 *   - every test gate ran with `cwd: "apps/web"`, a directory that does not exist
 *   - GATE-02/03/04 pointed at src/test/telemetry, src/test/chaos and a
 *     `test:load:tier-a` script, none of which exist
 *   - GATE-01 and GATE-05 were `console.log` statements that printed "PASSED" and
 *     could never fail
 *   - the evidence bundle hardcoded a passing user journey, four green operational
 *     gates and eight "OK" subsystems (Upload, Search, Pipeline, Telemetry, Worker,
 *     Queue) that this project does not have — then Ed25519-signed the result
 *
 * Every gate below runs a command that actually exists in this repository, and the
 * evidence bundle now records only measured results.
 */

interface PipelineStage {
  id: string;
  name: string;
  /** Shell command to run. Mutually exclusive with `run`. */
  command?: string;
  /** In-process check. Returns true on pass. Mutually exclusive with `command`. */
  run?: () => boolean;
  critical: boolean;
}

const POLICY_PATH = path.resolve(process.cwd(), "docs/policies/release-policy.json");

function loadReleasePolicy() {
  if (fs.existsSync(POLICY_PATH)) {
    return JSON.parse(fs.readFileSync(POLICY_PATH, "utf-8"));
  }
  return null;
}

/**
 * Gates are ordered cheapest-first so a trivial failure does not cost a full build.
 * All commands are defined in package.json or are npm builtins — nothing here depends
 * on a runner that is not installed.
 */
const stages: PipelineStage[] = [
  {
    id: "GATE-01",
    name: "Stage 1: Lint",
    command: "npm run lint",
    critical: true,
  },
  {
    id: "GATE-02",
    name: "Stage 2: TypeScript type check",
    command: "npx tsc --noEmit",
    critical: true,
  },
  {
    id: "GATE-03",
    name: "Stage 3: Unit test suite",
    command: "npm test",
    critical: true,
  },
  {
    id: "GATE-04",
    name: "Stage 4: Production build",
    command: "npm run build",
    critical: true,
  },
  {
    id: "GATE-05",
    name: "Stage 5: Dependency vulnerability audit (critical)",
    command: "npm audit --audit-level=critical",
    critical: true,
  },
  {
    id: "GATE-06",
    name: "Stage 6: Evidence schema validation",
    // Called in-process rather than shelled out: neither `tsx` nor `vite-node` is a
    // declared dependency, so the previous `npx vite-node ...` invocation relied on an
    // implicit network fetch inside a release gate.
    run: () => validateAllEvidenceSchemas(),
    critical: true,
  },
];

function getGitMetadata() {
  try {
    const gitSha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    const gitBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
    let dirty = false;
    try {
      dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim().length > 0;
    } catch {
      /* leave dirty=false */
    }
    return { gitSha, gitBranch, workingTreeDirty: dirty };
  } catch (_e) {
    return { gitSha: "unknown-commit", gitBranch: "unknown", workingTreeDirty: null };
  }
}

async function runReleaseVerification() {
  console.log("=================================================");
  console.log("🚀 STARTING RELEASE VERIFICATION PIPELINE");
  console.log("=================================================\n");

  const policy = loadReleasePolicy();
  if (policy) {
    console.log(`📋 Loaded Declarative Release Policy: [ ${policy.name} ] (v${policy.policyVersion})\n`);
  } else {
    console.log(`📋 No release policy found at ${path.relative(process.cwd(), POLICY_PATH)} — running with built-in gates.\n`);
  }

  let passedStages = 0;
  const startTime = Date.now();
  const stageResults: Record<string, { status: string; durationMs: number; check: string }> = {};

  for (const stage of stages) {
    const label = stage.command ?? "in-process check";
    console.log(`▶ Executing [${stage.id}] ${stage.name}...`);
    console.log(`   → ${label}`);
    const stageStart = Date.now();
    try {
      if (stage.command) {
        execSync(stage.command, { cwd: process.cwd(), stdio: "inherit" });
      } else if (stage.run) {
        const ok = stage.run();
        if (!ok) throw new Error(`${stage.id} in-process check returned false`);
      } else {
        throw new Error(`${stage.id} defines neither a command nor a run function`);
      }
      const stageDuration = Date.now() - stageStart;
      console.log(`✅ [${stage.id}] ${stage.name} PASSED (${stageDuration}ms)\n`);
      passedStages++;
      stageResults[stage.id] = { status: "PASSED", durationMs: stageDuration, check: label };
    } catch (_err) {
      const stageDuration = Date.now() - stageStart;
      console.error(`❌ [${stage.id}] ${stage.name} FAILED (${stageDuration}ms)`);
      stageResults[stage.id] = { status: "FAILED", durationMs: stageDuration, check: label };
      if (stage.critical) {
        console.error("\n💥 CRITICAL STAGE FAILED. ABORTING RELEASE PIPELINE.");
        writeEvidenceBundle(false, stageResults, Date.now() - startTime, "HOLD");
        process.exit(1);
      } else {
        console.warn("\n⚠️ Non-critical stage failed. Continuing pipeline...\n");
      }
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const allPassed = passedStages === stages.length;
  const releaseDecision = allPassed ? "PROMOTE" : "HOLD";

  console.log("=================================================");
  if (allPassed) {
    console.log(`🎉 RELEASE VERIFICATION PIPELINE PASSED (${passedStages}/${stages.length} stages in ${durationSec}s)`);
  } else {
    // The previous version printed "PIPELINE PASSED" even when a non-critical stage
    // had failed, then recorded status PASSED in the signed bundle.
    console.warn(`⚠️ RELEASE VERIFICATION PIPELINE INCOMPLETE (${passedStages}/${stages.length} stages in ${durationSec}s)`);
  }
  console.log(`🚀 RELEASE PROMOTION DECISION: [ ${releaseDecision} ]`);
  console.log("=================================================");

  writeEvidenceBundle(allPassed, stageResults, Date.now() - startTime, releaseDecision);

  if (!allPassed) process.exit(1);
}

function writeEvidenceBundle(
  passed: boolean,
  stageResults: Record<string, { status: string; durationMs: number; check: string }>,
  durationMs: number,
  releaseDecision: string
) {
  const timestampStr = new Date().toISOString().replace(/[:.]/g, "").substring(0, 15);
  const { gitSha, gitBranch, workingTreeDirty } = getGitMetadata();
  const shaShort = gitSha.substring(0, 7);
  const evidenceId = `EV-${shaShort}-${timestampStr}-v1.0`;

  const stageValues = Object.values(stageResults);

  const evidenceBundle = {
    schemaVersion: "1.0",
    evidenceId,
    generator: "hardware-collection-release-pipeline@2.0",
    timestamp: new Date().toISOString(),
    status: passed ? "PASSED" : "FAILED",
    releaseDecision,
    // Null rather than a path that may not exist — the previous version always claimed
    // a policy reference even when no policy file was present.
    policyReference: fs.existsSync(POLICY_PATH) ? "docs/policies/release-policy.json" : null,
    provenance: {
      gitSha,
      gitBranch,
      workingTreeDirty,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length,
      hostname: os.hostname(),
    },
    results: {
      durationMs,
      totalStages: stageValues.length,
      passedStages: stageValues.filter((s) => s.status === "PASSED").length,
      failedStages: stageValues.filter((s) => s.status === "FAILED").length,
      stageResults,
    },
    // Deliberately omitted: userJourney, operationalGates and subsystemHealth. The
    // previous version hardcoded those as passing/healthy without measuring anything,
    // and the subsystems named did not exist in this project. An evidence bundle must
    // only assert what the pipeline actually observed.
  };

  try {
    const evidenceDir = path.resolve(process.cwd(), "docs/evidence");
    if (!fs.existsSync(evidenceDir)) {
      fs.mkdirSync(evidenceDir, { recursive: true });
    }

    const artifactFile = path.join(evidenceDir, `${evidenceId}.json`);
    const latestFile = path.join(evidenceDir, "latest-release.json");

    fs.writeFileSync(artifactFile, JSON.stringify(evidenceBundle, null, 2));
    fs.writeFileSync(latestFile, JSON.stringify(evidenceBundle, null, 2));

    console.log(`📄 Evidence bundle archived: ${artifactFile}`);
    console.log(`📄 Latest release pointer updated: ${latestFile}`);

    buildEvidenceManifest();
    buildEvidenceIndex();
    validateAllEvidenceSchemas();
  } catch (err) {
    console.warn("⚠️ Failed to write Evidence Bundle artifact:", err);
  }
}

runReleaseVerification().catch((err) => {
  console.error("Release Verification Pipeline Error:", err);
  process.exit(1);
});
