import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { validateRepository } from "./repository.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const result = await validateRepository(root);

for (const warning of result.warnings) console.warn(`warning: ${warning}`);
if (result.errors.length > 0) {
  for (const error of result.errors) console.error(`error: ${error}`);
  process.exitCode = 1;
} else {
  const contractCount = (await fg(["governance/*.md", "decisions/*.md", "product/*.md", "design/*.md", "playbooks/*.md", "templates/*.md"], { cwd: root })).length;
  console.log(`validated ${contractCount} contracts with no blocking errors`);
}
