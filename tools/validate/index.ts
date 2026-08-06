import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import fg from "fast-glob";
import { validateRepository } from "./repository.js";
import { validateImportedAdr, validateMigrationRegister, validatePromotedContent, validateSupersededDoctrine } from "./migration.js";
import { validateCapabilityMap, validateDataLifecycle, validatePreferredStack } from "./standards.js";
import { scanRepositorySecrets } from "./repository-secrets.js";
import { validateAuthExperience, validateAuthSecurity } from "./auth.js";
import { validateRetirementDossier, validateValidationArtifact } from "./retirement.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const result = await validateRepository(root);

const register = JSON.parse(await readFile(resolve(root, "migration/source-register.json"), "utf8"));
result.errors.push(...validateMigrationRegister(register));
const imported = JSON.parse(await readFile(resolve(root, "migration/imported-adrs.json"), "utf8")) as Array<{ importedPath: string; sourceBodySha256: string; sourceDate: string }>;
for (const record of imported) {
  const body = await readFile(resolve(root, record.importedPath), "utf8");
  result.errors.push(...validateImportedAdr(body, record).map((error) => `${record.importedPath}: ${error}`));
}
for (const path of await fg(["governance/*.md", "product/*.md", "design/*.md"], { cwd: root, onlyFiles: true })) {
  const body = await readFile(resolve(root, path), "utf8");
  result.errors.push(...validateSupersededDoctrine(body).map((error) => `${path}: ${error}`));
}
for (const path of await fg(["migration/promoted/**/*"], { cwd: root, onlyFiles: true })) {
  const body = await readFile(resolve(root, path), "utf8");
  result.errors.push(...validatePromotedContent(body).map((error) => `${path}: ${error}`));
}

result.errors.push(...validatePreferredStack(JSON.parse(await readFile(resolve(root, "standards/preferred-stack.json"), "utf8"))).map((error) => `standards/preferred-stack.json: ${error}`));
result.errors.push(...validateCapabilityMap(JSON.parse(await readFile(resolve(root, "standards/capability-map.example.json"), "utf8"))).map((error) => `standards/capability-map.example.json: ${error}`));
result.errors.push(...validateDataLifecycle(JSON.parse(await readFile(resolve(root, "standards/data-lifecycle.example.json"), "utf8"))).map((error) => `standards/data-lifecycle.example.json: ${error}`));
result.errors.push(...validateAuthExperience(JSON.parse(await readFile(resolve(root, "tests/fixtures/auth/valid-experience.json"), "utf8"))).map((error) => `tests/fixtures/auth/valid-experience.json: ${error}`));
result.errors.push(...validateAuthSecurity(JSON.parse(await readFile(resolve(root, "tests/fixtures/auth/valid-security.json"), "utf8"))).map((error) => `tests/fixtures/auth/valid-security.json: ${error}`));
for (const name of ["norfolk-starter", "norfolk-manual"]) result.errors.push(...validateRetirementDossier(JSON.parse(await readFile(resolve(root, `retirement/${name}.json`), "utf8"))).map((error) => `retirement/${name}.json: ${error}`));
for (const name of ["h-analytics.md", "motion-lineage.md", "report-output.md"]) {
  const body = await readFile(resolve(root, `validation/${name}`), "utf8");
  result.errors.push(...validateValidationArtifact(body).map((error) => `validation/${name}: ${error}`));
}
result.errors.push(...await scanRepositorySecrets(root, { history: "--all" }));

for (const warning of result.warnings) console.warn(`warning: ${warning}`);
if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`error: ${error}`);
  process.exitCode = 1;
} else {
  const contractCount = (await fg(["governance/*.md", "decisions/*.md", "product/*.md", "design/*.md", "catalog/*.md", "migration/*.md", "adoption/*.md", "outputs/{README,shared-principles,job-lifecycle,pdf,xlsx,pptx,docx,email,charts,print,investor-materials}.md", "playbooks/*.md", "standards/*.md", "templates/*.md"], { cwd: root })).length;
  console.log(`validated ${contractCount} contracts with no blocking errors`);
}
