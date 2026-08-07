import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const sha = (value: string) => createHash("sha256").update(value.replace(/\r\n?/g, "\n")).digest("hex");
const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function generateCatalog(root: string): Promise<{ html: string; sha256: string }> {
  const sourcePath = "catalog/catalog-contract.json";
  const raw = await readFile(resolve(root, sourcePath), "utf8");
  const contract = JSON.parse(raw) as { sections: string[]; controls: string[]; approvalStatus: string };
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8")) as { version: string };
  const controls = contract.controls.map((control) => `<button type="button">${escape(control)}</button>`).join("");
  const sections = contract.sections.map((section) => `<article id="${section.toLowerCase().replaceAll(" ", "-")}"><h2>${escape(section)}</h2><p>Abstract specimen · compare states, themes, breakpoints, and accessibility metadata.</p></article>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Norfolk Design Catalog</title><style>body{font:15px/1.5 Inter,system-ui,sans-serif;margin:0;background:#f6f2e9;color:#172320}header,main{max-width:1100px;margin:auto;padding:24px}.tools{display:flex;gap:8px;flex-wrap:wrap}button{min-height:44px;padding:8px 14px}article{background:#fff;border:1px solid #d8ded9;border-radius:14px;padding:20px;margin:16px 0}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style></head><body><header><p>Private Norfolk AI standard · Product OS ${escape(pkg.version)} · approval ${escape(contract.approvalStatus)}</p><p>Source path ${sourcePath} · source-sha256 ${sha(raw)} · freshness 2026-08-05</p><h1>Living design catalog</h1><label>Search <input type="search"></label><div class="tools">${controls}</div></header><main>${sections}</main></body></html>`;
  return { html, sha256: sha(html) };
}
