import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const sha = (value: string) => createHash("sha256").update(value.replace(/\r\n?/g, "\n")).digest("hex");

export async function generateHandbook(root: string): Promise<{ html: string; sha256: string }> {
  const paths = await fg(["governance/*.md", "product/*.md", "design/*.md", "playbooks/*.md"], { cwd: root, onlyFiles: true });
  paths.sort((a, b) => a.localeCompare(b));
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8")) as { version: string };
  const sections = await Promise.all(paths.map(async (path) => {
    const raw = await readFile(resolve(root, path), "utf8");
    const parsed = matter(raw);
    return `<article id="${path.replace(/[^a-z0-9]+/gi, "-")}"><p class="meta">${escape(path)} · ${escape(String(parsed.data.status))} · source-sha256 ${sha(raw)}</p><pre>${escape(parsed.content.trim())}</pre></article>`;
  }));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Norfolk AI Product OS Handbook</title><style>body{font:15px/1.55 Inter,system-ui,sans-serif;max-width:1100px;margin:auto;padding:32px;color:#172320;background:#f6f2e9}header{border-bottom:1px solid #b8c2bd}article{background:#fff;padding:24px;margin:20px 0;border-radius:14px}pre{white-space:pre-wrap;font:inherit}.meta{color:#4f6c64;font-size:12px}</style></head><body><header><p>Private Norfolk AI standard · Product OS ${escape(pkg.version)} · generated from canonical source</p><h1>Norfolk AI Product OS Handbook</h1></header>${sections.join("")}</body></html>`;
  return { html, sha256: sha(html) };
}
