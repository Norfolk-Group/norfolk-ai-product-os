import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { redactDiagnosticOutput, validateWorkOSReadinessEnvironment } from "./workos.js";

const errors = validateWorkOSReadinessEnvironment(process.env);
if (errors.length) throw new Error(errors.join("\n"));
const startedAt = new Date().toISOString();
const result = spawnSync("npx", ["--yes", "workos@0.21.0", "doctor"], { encoding: "utf8", env: process.env, maxBuffer: 8 * 1024 * 1024 });
const evidence = {
  provider: "workos",
  environment: "staging",
  startedAt,
  completedAt: new Date().toISOString(),
  passed: result.status === 0,
  exitCode: result.status,
  output: redactDiagnosticOutput(`${result.stdout ?? ""}${result.stderr ?? ""}`).trim(),
};
const output = resolve(process.argv[2] ?? "workos-readiness.json");
await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, { mode: 0o600 });
if (!evidence.passed) throw new Error(`WorkOS doctor failed; redacted evidence written to ${output}`);
console.log(`WorkOS staging readiness passed; redacted evidence written to ${output}`);
