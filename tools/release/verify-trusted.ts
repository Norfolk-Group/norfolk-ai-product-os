import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { verifyTrustedRelease } from "./trusted.js";

const [directory, publicKeyPath] = process.argv.slice(2);
if (!directory || !publicKeyPath) throw new Error("usage: release:verify <bundle-directory> <trusted-public-key.pem>");
const errors = await verifyTrustedRelease(resolve(directory), await readFile(resolve(publicKeyPath), "utf8"));
if (errors.length) throw new Error(errors.join("\n"));
console.log("trusted release verification passed");
