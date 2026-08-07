import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCatalog } from "./generate-catalog/index.js";
import { generateHandbook } from "./generate-handbook/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(resolve(root, "handbook"), { recursive: true });
await mkdir(resolve(root, "catalog/generated"), { recursive: true });
const handbook = await generateHandbook(root);
const catalog = await generateCatalog(root);
await writeFile(resolve(root, "handbook/index.html"), handbook.html);
await writeFile(resolve(root, "catalog/generated/index.html"), catalog.html);
console.log(`generated handbook ${handbook.sha256} and catalog ${catalog.sha256}`);
