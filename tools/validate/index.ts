import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import fg from "fast-glob";
import { validateRepository } from "./repository.js";
import { validateImportedAdr, validateMigrationRegister, validatePromotedContent, validateSupersededDoctrine } from "./migration.js";

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

for (const warning of result.warnings) console.warn(`warning: ${warning}`);
if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`error: ${error}`);
  process.exitCode = 1;
} else {
  const contractCount = (await fg(["governance/*.md", "decisions/*.md", "product/*.md", "design/*.md", "catalog/*.md", "migration/*.md", "playbooks/*.md", "templates/*.md"], { cwd: root })).length;
  console.log(`validated ${contractCount} contracts with no blocking errors`);
}
