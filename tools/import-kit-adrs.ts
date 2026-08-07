import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kit = path.resolve(process.argv[2] ?? path.join(root, "../norfolk-kit"));
const sourceRoot = path.join(kit, "docs/decisions");
const destinationRoot = path.join(root, "decisions/imported/norfolk-kit");
const files = await fg("*.md", { cwd: sourceRoot, onlyFiles: true });
files.sort((a, b) => a.localeCompare(b));
await mkdir(destinationRoot, { recursive: true });
const records = [];
for (const file of files) {
  const body = await readFile(path.join(sourceRoot, file), "utf8");
  const date = body.match(/(?:\*\*)?Date:(?:\*\*)?\s*(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!date) throw new Error(`${file}: source date is missing`);
  await writeFile(path.join(destinationRoot, file), body);
  records.push({ sourceRepository: "Norfolk-Group/norfolk-kit", sourceRef: "f2680624596048a88f78e2a77b2a7e3d1d4aeed5", sourcePath: `docs/decisions/${file}`, importedPath: `decisions/imported/norfolk-kit/${file}`, sourceDate: date, sourceBodySha256: createHash("sha256").update(body).digest("hex"), disposition: "historical-reference-not-current-sequence" });
}
await writeFile(path.join(root, "migration/imported-adrs.json"), `${JSON.stringify(records, null, 2)}\n`);
console.log(`Imported ${records.length} Kit ADR bodies without modification`);
