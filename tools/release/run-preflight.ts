import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverReleasePreflight, validateReleasePreflight } from "./preflight.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const [path, expectedVersion] = process.argv.slice(2);
if (!path) throw new Error("usage: release:preflight <release-authorization.json> [expected-version]");
const state = await discoverReleasePreflight(root, path);
const errors = validateReleasePreflight(state);
if (expectedVersion && state.authorization.releaseVersion !== expectedVersion) errors.push("dispatch release version does not match authorization");
if (errors.length) throw new Error(errors.join("\n"));
console.log("release preflight passed");
