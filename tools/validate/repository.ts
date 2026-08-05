import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

export type ValidationResult = { errors: string[]; warnings: string[] };

const markdownLink = /\[[^\]]+\]\(([^)]+)\)/g;
const contractGlobs = ["governance/*.md", "decisions/*.md", "product/*.md", "playbooks/*.md", "templates/*.md"];
const allowedStatus = new Set(["draft", "proposed", "accepted", "deprecated", "superseded"]);
const allowedTier = new Set(["CONTRACT", "REFERENCE"]);

export async function validateRepository(root: string, now = new Date()): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const contracts = await fg(contractGlobs, { cwd: root, onlyFiles: true });
  const index = await readFile(resolve(root, "docs/README.md"), "utf8");

  for (const path of contracts) {
    const content = await readFile(resolve(root, path), "utf8");
    const metadata = matter(content).data as Record<string, unknown>;
    for (const key of ["title", "status", "tier", "owner", "lastVerified"]) {
      if (!metadata[key]) errors.push(`${path}: missing ${key}`);
    }
    if (metadata.status && !allowedStatus.has(String(metadata.status))) errors.push(`${path}: invalid status ${metadata.status}`);
    if (metadata.tier && !allowedTier.has(String(metadata.tier))) errors.push(`${path}: invalid tier ${metadata.tier}`);
    if (!index.includes(`../${path}`)) {
      errors.push(`${path}: not indexed in docs/README.md`);
    }
    if (metadata.tier === "CONTRACT" && metadata.lastVerified) {
      const ageDays = (now.getTime() - new Date(String(metadata.lastVerified)).getTime()) / 86_400_000;
      if (!Number.isFinite(ageDays)) errors.push(`${path}: invalid lastVerified date`);
      else if (ageDays > 90) warnings.push(`${path}: CONTRACT is stale (${Math.floor(ageDays)} days)`);
    }
  }

  const markdownFiles = await fg(["**/*.md", "!node_modules/**"], { cwd: root, onlyFiles: true });
  for (const path of markdownFiles) {
    const content = await readFile(resolve(root, path), "utf8");
    for (const match of content.matchAll(markdownLink)) {
      const target = match[1].split("#", 1)[0];
      if (!target || /^(https?:|mailto:)/.test(target)) continue;
      const absolute = resolve(root, dirname(path), target);
      try {
        await access(absolute);
      } catch {
        errors.push(`${path}: broken link ${match[1]}`);
      }
    }
  }

  return { errors, warnings };
}

export function normalizeTextForHash(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

export function isPotentiallySensitive(value: string): boolean {
  const patterns = [
    /(?:api|secret|access)[_-]?key\s*[:=]/i,
    /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
    /https?:\/\/[^\s]+(?:client|customer|investor)/i,
    /\/(?:Users|home)\/[^/\s]+\//,
    /(?:KIT Capital|H-Analytics)/i
  ];
  return patterns.some((pattern) => pattern.test(value));
}

export function isCanonicalClientEvidence(record: Record<string, unknown>): boolean {
  return record.disposition === "approved-canonical";
}

export function validateCanonicalClientEvidence(record: Record<string, unknown>): string[] {
  if (!isCanonicalClientEvidence(record)) return [];
  const errors: string[] = [];
  if (record.rights !== "approved-for-reuse") errors.push("canonical evidence requires approved reuse rights");
  if (record.syntheticReplacement !== true) errors.push("canonical evidence requires synthetic replacement");
  if (record.metadataStripped !== true) errors.push("canonical evidence requires stripped metadata");
  if (record.secretScan !== "passed" || record.identifierScan !== "passed") errors.push("canonical evidence requires passed scans");
  if (record.humanDisclosureReview !== true) errors.push("canonical evidence requires human disclosure review");
  return errors;
}
