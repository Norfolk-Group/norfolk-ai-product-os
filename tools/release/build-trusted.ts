import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTrustedRelease } from "./trusted.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const [authorizationPath, outputDirectory] = process.argv.slice(2);
if (!authorizationPath || !outputDirectory) throw new Error("usage: release:trusted <authorization.json> <new-output-directory>");
const authorization = JSON.parse(await readFile(resolve(root, authorizationPath), "utf8"));
const privateKeyPem = process.env.PRODUCT_OS_TRUSTED_PRIVATE_KEY;
const publicKeyPem = await readFile(resolve(root, "trust/product-os-release-public-key.pem"), "utf8");
if (!privateKeyPem) throw new Error("PRODUCT_OS_TRUSTED_PRIVATE_KEY is required");
const result = await buildTrustedRelease({ root, authorization, outputDirectory: resolve(outputDirectory), privateKeyPem, publicKeyPem, createdAt: new Date().toISOString() });
console.log(JSON.stringify({ manifestSha256: result.manifestSha256, publicKeySha256: result.publicKeySha256, assets: result.assetPaths.length }));
