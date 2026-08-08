import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverReleasePreflight, validateReleasePreflight } from "./preflight.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const path = process.argv[2];
if (!path) throw new Error("usage: release:preflight <release-authorization.json>");
const errors = validateReleasePreflight(await discoverReleasePreflight(root, path));
if (errors.length) throw new Error(errors.join("\n"));
console.log("release preflight passed");
