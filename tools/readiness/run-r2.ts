import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { requestTemporaryR2Credentials, runR2Diagnostic } from "./r2.js";

const required = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "R2_BUCKET", "R2_PARENT_ACCESS_KEY_ID", "R2_ENDPOINT"] as const;
for (const name of required) if (!process.env[name]?.trim()) throw new Error(`missing ${name}`);
const prefix = "diagnostics/product-os/";
const credentials = await requestTemporaryR2Credentials({ accountId: process.env.CLOUDFLARE_ACCOUNT_ID!, apiToken: process.env.CLOUDFLARE_API_TOKEN!, bucket: process.env.R2_BUCKET!, parentAccessKeyId: process.env.R2_PARENT_ACCESS_KEY_ID!, prefix });
const evidence = await runR2Diagnostic({ endpoint: process.env.R2_ENDPOINT!, bucket: process.env.R2_BUCKET!, authorizedPrefix: prefix, objectKey: `${prefix}${randomUUID()}.bin`, credentials });
const output = resolve(process.argv[2] ?? "r2-readiness.json");
await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, { mode: 0o600 });
console.log(`R2 scoped diagnostic passed; redacted evidence written to ${output}`);
